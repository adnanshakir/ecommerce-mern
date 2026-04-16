import { productModel } from "../models/product.model.js";

export async function createProduct(req, res) {
  try {
    const { name, description, price } = req.body;
    const sellerId = req.user._id;

    const newProduct = productModel.create({
      name,
      description,
      price,
      seller: sellerId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
