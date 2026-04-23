import axios from "axios";

const productApi = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});

export async function createProduct(formData) {
  const response = await productApi.post("/", formData);
  return response.data;
}

export async function getSellerProducts() {
  const response = await productApi.get("/seller");
  return response.data;
}

export async function getAllProducts({ category, sub, q } = {}) {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (sub) params.append("sub", sub);
  if (q) params.append("q", q);

  const query = params.toString();
  const response = await productApi.get(query ? `/?${query}` : "/");
  return response.data;
}

export async function getProductDetails(productId) {
  const response = await productApi.get(`/detail/${productId}`);
  return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
  const formData = new FormData();

  newProductVariant.images.forEach((img) => {
  if (img instanceof File) {
    formData.append("images", img);
  } else if (img?.file) {
    formData.append("images", img.file);
  }
});

  formData.append("priceCurrency", newProductVariant.price.currency);
  formData.append("stock", String(newProductVariant.stock));
  formData.append("priceAmount", String(newProductVariant.price.amount));
  formData.append("attributes", JSON.stringify(newProductVariant.attributes));

  const response = await productApi.post(`/${productId}/variants`, formData);

  return response.data;
}

export async function searchProducts(query, category) {
  const params = new URLSearchParams({ q: query });

  if (category) {
    params.set("category", category);
  }

  const response = await productApi.get(`/search?${params.toString()}`);
  return response.data;
}
