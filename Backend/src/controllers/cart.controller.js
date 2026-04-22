import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  const userId = req.user._id;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let variant = null;

    if (variantId) {
      variant = product.variants.id(variantId);

      if (!variant) {
        return res.status(404).json({
          message: "Variant not found",
          success: false,
        });
      }
    }

    const stock = variant
      ? await stockOfVariant(productId, variantId)
      : product.stock || 999;

    if (!stock || stock <= 0) {
      return res.status(400).json({
        message: "Out of stock",
        success: false,
      });
    }

    const cart =
      (await cartModel.findOne({ userId })) ||
      (await cartModel.create({ userId }));

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (variantId
          ? item.variant?.toString() === variantId
          : !item.variant),
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

      existingItem.quantity += quantity;
      await cart.save();

      const updatedCart = await cartModel
        .findOne({ userId })
        .populate("items.product");

      return res.status(200).json({
        message: "Cart updated successfully",
        cart: updatedCart,
        success: true,
      });
    }

    if (quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} left in stock.`,
        success: false,
      });
    }

    cart.items.push({
      product: productId,
      variant: variantId || null,
      quantity,
      price: variant?.price || product.price,
    });

    await cart.save();

    const updatedCart = await cartModel
      .findOne({ userId })
      .populate("items.product");

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: updatedCart,
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
  try {
    const cart = await cartModel
      .findOne({ userId: req.user._id })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart: { items: [] },
        success: true,
      });
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
