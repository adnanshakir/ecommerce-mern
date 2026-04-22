import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from "../service/cart.api";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../state/cart.slice";

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const mergeClientMetadata = (nextItems, existingItems) => {
    const metadataById = new Map(
      (existingItems || []).map((item) => [
        item?._id,
        {
          size: item?.size,
          variantData: item?.variantData,
        },
      ]),
    );

    return (nextItems || []).map((item) => ({
      ...item,
      ...(metadataById.get(item?._id) || {}),
    }));
  };

  const attachAddedItemMetadata = (nextItems, payload) => {
    const { productId, variantId, size, variantData } = payload || {};

    if (!size && !variantData) {
      return nextItems;
    }

    const merged = [...(nextItems || [])];

    for (let index = merged.length - 1; index >= 0; index -= 1) {
      const item = merged[index];
      const productMatch = item?.product?._id === productId;
      const itemVariantId = item?.variant?._id || item?.variant;
      const variantMatch = variantId
        ? String(itemVariantId) === String(variantId)
        : !itemVariantId;

      if (productMatch && variantMatch) {
        merged[index] = {
          ...item,
          size: size || item?.size,
          variantData: variantData || item?.variantData,
        };
        break;
      }
    }

    return merged;
  };

  const handleAddToCart = async ({ productId, variantId, size, variantData }) => {
    try {
      const data = await addToCart({ productId, variantId });
      const withExistingMetadata = mergeClientMetadata(data.cart?.items || [], items);
      const withAddedMetadata = attachAddedItemMetadata(withExistingMetadata, {
        productId,
        variantId,
        size,
        variantData,
      });

      dispatch(setItems(withAddedMetadata));

      return data;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleGetCart = async () => {
    try {
      const data = await getCartItems();
      dispatch(setItems(mergeClientMetadata(data.cart?.items || [], items)));
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const handleUpdateCartQuantity = async ({ itemId, quantity }) => {
    try {
      const data = await updateCartItemQuantity({ itemId, quantity });
      dispatch(setItems(mergeClientMetadata(data.cart?.items || [], items)));

      return data;
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const handleRemoveFromCart = async ({ itemId }) => {
    try {
      const data = await removeCartItem({ itemId });
      dispatch(setItems(mergeClientMetadata(data.cart?.items || [], items)));

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
