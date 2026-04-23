import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddToCart = async ({ productId, variantId, quantity = 1, size }) => {
    try {
      const data = await addToCart({ productId, variantId, quantity, size });
      dispatch(setItems(data.cart?.items || []));
      return data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      throw error;
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCartItems();
      dispatch(setItems(data.cart?.items || []));
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleUpdateCartQuantity = async ({ itemId, quantity }) => {
    try {
      const data = await updateCartItemQuantity({ itemId, quantity });
      dispatch(setItems(data.cart?.items || []));
      return data;
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const handleRemoveFromCart = async ({ itemId }) => {
    try {
      const data = await removeCartItem({ itemId });
      dispatch(setItems(data.cart?.items || []));
      return data;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  return {
    handleAddToCart,
    handleGetCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart,
  };
};
