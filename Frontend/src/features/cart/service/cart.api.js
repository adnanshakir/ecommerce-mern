import axios from "axios";

const cartApi = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export async function getCartItems() {
  const response = await cartApi.get("/items");
  return response.data;
}

export async function addToCart({ productId, variantId }) {
  const response = await cartApi.post(`/add/${productId}/${variantId}`, {
    quantity: 1,
  });
  return response.data;
}
