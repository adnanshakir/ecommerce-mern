import { uploadFile } from "../services/storage.service.js";
import productModel from "../models/product.model.js";

const VALID_SUBCATEGORIES = {
  tops: ["tshirts", "shirts", "tanks"],
  bottoms: ["jeans", "trousers"],
};

const escapeRegExp = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      priceAmount,
      priceCurrency,
      category,
      subCategory,
    } = req.body;
    const sellerId = req.user._id;

    /* ── Validate category / subCategory ── */
    const normCategory = category?.toLowerCase().trim();
    const normSubCategory = subCategory?.toLowerCase().trim();

    if (!normCategory || !VALID_SUBCATEGORIES[normCategory]) {
      return res.status(400).json({
        message:
          "Invalid category. Must be one of: " +
          Object.keys(VALID_SUBCATEGORIES).join(", "),
        field: "category",
        success: false,
      });
    }

    if (
      !normSubCategory ||
      !VALID_SUBCATEGORIES[normCategory].includes(normSubCategory)
    ) {
      return res.status(400).json({
        message: `Invalid subCategory for "${normCategory}". Must be one of: ${VALID_SUBCATEGORIES[normCategory].join(", ")}`,
        field: "subCategory",
        success: false,
      });
    }

    const normalizedName = name?.trim();

    const exists = await productModel.findOne({
      name: { $regex: new RegExp(`^${escapeRegExp(normalizedName)}$`, "i") },
      seller: sellerId,
      category: normCategory,
      subCategory: normSubCategory,
    });

    if (exists) {
      return res.status(400).json({
        message: "A product with this name already exists",
        success: false,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
        success: false,
      });
    }

    const images = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "E-commerce",
            }),
          ),
        )
      : [];

    const product = await productModel.create({
      name: normalizedName,
      description,
      price: {
        amount: Math.round(Number(priceAmount)),
        currency: priceCurrency || "INR",
      },
      images,
      seller: sellerId,
      category: normCategory,
      subCategory: normSubCategory,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getSellerProducts(req, res) {
  try {
    const sellerId = req.user._id;
    const products = await productModel.find({ seller: sellerId });

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getAllProducts(req, res) {
  try {
    const { category, sub, q } = req.query;

    const filter = {
      ...(category && { category }),
      ...(sub && { subCategory: sub }),
      ...(q?.trim() && { name: { $regex: q.trim(), $options: "i" } }),
    };

    const products = await productModel.find(filter);

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function getProductDetails(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product details fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function addProductVariant(req, res) {
  try {
    const { id } = req.params;

    const product = await productModel.findOne({
      _id: id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // upload images
    const images = req.files?.length
      ? await Promise.all(
          req.files.map((file) =>
            uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "E-commerce",
            }),
          ),
        )
      : [];

    const { priceAmount, priceCurrency, stock } = req.body;

    const attributes = req.body.attributes
      ? JSON.parse(req.body.attributes)
      : {};

    const parsedVariantPriceAmount = Number(priceAmount);

    const finalPrice = {
      amount: Number.isFinite(parsedVariantPriceAmount)
        ? Math.round(parsedVariantPriceAmount)
        : product.price.amount,
      currency: priceCurrency || product.price.currency || "INR",
    };

    // normalize attributes (SAFE + USED)
    const normalize = (obj = {}) => {
      const plain = JSON.parse(JSON.stringify(obj));
      return JSON.stringify(
        Object.keys(plain)
          .sort()
          .reduce((acc, key) => {
            acc[key] = plain[key];
            return acc;
          }, {}),
      );
    };

    // duplicate check
    const isDuplicate = product.variants.some((v) => {
      return (
        normalize(v.attributes || {}) === normalize(attributes || {}) &&
        Number(v.price?.amount) === Number(finalPrice.amount)
      );
    });

    if (isDuplicate) {
      return res.status(400).json({
        message: "Variant already exists",
        success: false,
      });
    }

    const newVariant = {
      attributes,
      price: finalPrice,
      stock,
      images,
    };

    product.variants.push(newVariant);
    await product.save();

    return res.status(201).json({
      message: "Variant added successfully",
      success: true,
      variant: newVariant,
    });
  } catch (error) {
    console.error("Error adding product variant:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function searchProducts(req, res) {
  try {
    const { q, category } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({ products: [] });
    }

    const products = await productModel
      .find({
        name: { $regex: q.trim(), $options: "i" },
        ...(category ? { category } : {}),
      })
      .limit(10)
      .select("name images price category");

    res.status(200).json({ products, success: true });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed", success: false });
  }
}
