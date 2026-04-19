import { uploadFile } from "../services/storage.service.js";
import productModel from "../models/product.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, priceAmount, priceCurrency } = req.body;
    const sellerId = req.user._id;

    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
          folder: "E-commerce",
        });
      }),
    );

    const product = await productModel.create({
      name,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
      seller: sellerId,
    });

    res.status(201).json(product);
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
    const products = await productModel.find();

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
    const product = await productModel.findOne({ _id: id, seller: req.user._id });


    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    const files = req.files;
    const images = [];

    if (files && files.length !== 0) {
      (
        await Promise.all(
          files.map(async (file) => {
            const image = await uploadFile({
              buffer: file.buffer,
              fileName: file.originalname,
              folder: "E-commerce",
            });
            return image;
          }),
        )
      ).map((img) => images.push(img));
    }

    const { attributes, priceAmount, priceCurrency, stock } = req.body;

    console.log(product, images, priceAmount, stock, attributes)

    // const newVariant = {
    //   attributes,
    //   price: {
    //     amount: priceAmount,
    //     currency: priceCurrency || "INR",
    //   },
    //   stock,
    //   images,
    // };

    // product.varients.push(newVariant);
    // await product.save();

    // res.status(201).json({
    //   message: "Variant added successfully",
    //   success: true,
    //   variant: newVariant,
    // });
  } catch (error) {
    console.error("Error adding product variant:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
