import { createProduct, getSellerProducts, getAllProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setProduct, setAllProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  async function handleCreateProduct(formData) {
    try {
      const data = await createProduct(formData);
      return data.product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async function handleGetSellerProducts() {
    try {
      const data = await getSellerProducts();
      dispatch(setProduct(data.products));

      return data.products;
    } catch (error) {
      console.error("Error fetching seller products:", error);
      throw error;
    }
  }

  async function handleGetAllProducts() {
    try {
      const data = await getAllProducts();
      dispatch(setAllProducts(data.products));

      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
  };
};
