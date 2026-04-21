import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;
  const userId = req.user._id;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res
      .status(404)
      .json({ message: "Product or variant not found", success: false });
  }

  const stock = await stockOfVariant(productId, variantId);

  if (stock <= 0) {
    return res
      .status(400)
      .json({ message: "Variant is out of stock", success: false });
  }

  try {
    if (!variantId || variantId === "base") {
      return res.status(400).json({
        message: "Invalid variant",
        success: false,
      });
    }

    const cart =
      (await cartModel.findOne({ userId })) ||
      (await cartModel.create({ userId }));

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    );

    if (existingItem) {
      const quantityInCart = existingItem.quantity;

      if (quantityInCart + quantity > stock) {
        return res.status(400).json({
          message: `Cannot add ${quantity} items. Only ${
            stock - quantityInCart
          } left in stock.`,
          success: false,
        });
      }

      await cartModel.findOneAndUpdate(
        { userId, "items.product": productId, "items.variant": variantId },
        { $inc: { "items.$.quantity": quantity } },
        { new: true },
      );

      return res.status(200).json({
        message: "Cart updated successfully",
        success: true,
      });
    }

    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} left in stock.`,
        success: false,
      });
    }

    const variant = product.variants.id(variantId);

    cart.items.push({
      product: productId,
      variant: variantId,
      quantity,
      price: variant?.price || product.price,
    });

    await cart.save();

    return res.status(200).json({
      message: "Item added to cart successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCart = async (req, res) => {
  const user = req.user;

  try {
    let cart = await cartModel.findOne({ user }).populate("items.product");

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Cart fetched successfully", cart, success: true });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
