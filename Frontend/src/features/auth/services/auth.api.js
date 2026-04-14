import axios from "axios";

const authApi = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export async function register({
  email,
  password,
  contact,
  fullname,
  isSeller,
}) {
  const response = await authApi.post("/register", {
    email,
    password,
    contact,
    fullname,
    isSeller,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApi.post("/login", {
    email,
    password,
  });
  return response.data;
}
