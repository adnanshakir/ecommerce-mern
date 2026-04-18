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
