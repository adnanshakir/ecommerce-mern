import { addToCart, getCartItems } from "../service/cart.api";
import { useDispatch } from "react-redux";
import { addItem, setItems } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();

  const handleAddToCart = async ({ productId, variantId }) => {
    try {
      const data = await addToCart({ productId, variantId });
        dispatch(addItem(data.item));

      return data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCartItems();
      dispatch(setItems(data.cart));
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  return {
    handleAddToCart,
    handleGetCart,
  };
};
