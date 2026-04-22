import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

export const addToCart = async (req, res) => {
  const { productId, variantId, quantity = 1, size = null } = req.body;
  const userId = req.user._id;

  try {
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    let variantData = null;

    if (variantId) {
      variantData = product.variants?.find(
        (v) => v._id.toString() === variantId
      );

      if (!variantData) {
        return res.status(404).json({
          message: "Variant not found",
          success: false,
        });
      }
    }

    const stock = variantData
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
      (await cartModel.create({ userId, items: [] }));

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (variantId
          ? item.variant?.toString() === variantId
          : !item.variant) &&
        item.size === size
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

      const updatedCart = await cartModel.findOne({ userId });

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

    const snapshot = {
      product: productId,
      variant: variantId || null,

      name: product.name,

      image:
        variantData?.images?.[0]?.url ||
        product.images?.[0]?.url ||
        "",

      size: size || null,

      price: {
        amount: variantData?.price?.amount ?? product.price?.amount,
        currency: variantData?.price?.currency || product.price?.currency || "INR",
      },

      quantity,
    };

    cart.items.push(snapshot);
    await cart.save();

    const updatedCart = await cartModel.findOne({ userId });

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
    const cart = await cartModel.findOne({ userId: req.user._id });

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

export const updateCartItemQuantity = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await cartModel.findOne({ userId });

    return res.status(200).json({
      message: "Cart item updated successfully",
      cart: updatedCart,
      success: true,
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const removeCartItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        success: false,
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
        success: false,
      });
    }

    item.deleteOne();
    await cart.save();

    const updatedCart = await cartModel.findOne({ userId });

    return res.status(200).json({
      message: "Cart item removed successfully",
      cart: updatedCart || { items: [] },
      success: true,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
