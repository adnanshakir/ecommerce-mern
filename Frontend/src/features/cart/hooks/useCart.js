import { addToCart, getCartItems } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { setItems } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddToCart = async ({ productId, variantId }) => {
    try {
      const data = await addToCart({ productId, variantId });
      dispatch(setItems(data.cart?.items || []));

      return data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
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

  return {
    handleAddToCart,
    handleGetCart,
  };
};
