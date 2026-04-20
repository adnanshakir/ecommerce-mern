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

export async function getAllProducts() {
  const response = await productApi.get("/");
  return response.data;
}

export async function getProductDetails(productId) {
  const response = await productApi.get(`/detail/${productId}`);
  return response.data;
}

// export async function addProductVariant(productId, newProductVariant) {
//   const formData = new FormData();

//   newProductVariant.images.forEach((img) => {
//     formData.append("images", img.file);
//   });

//   formData.append("priceAmount", newProductVariant.price.amount);
//   formData.append("priceCurrency", newProductVariant.price.currency);
//   formData.append("stock", newProductVariant.stock);
//   formData.append("attributes", JSON.stringify(newProductVariant.attributes));

//   const response = await productApi.post(`/${productId}/variants`, formData)

//   return response.data;
// }