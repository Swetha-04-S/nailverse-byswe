
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api"
});

// Attach the correct token based on the API operation
API.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const url = config.url || "";

  const isAdminProductOperation =
    url.startsWith("/products") &&
    ["post", "put", "patch", "delete"].includes(method);

  const isCustomerOperation =
    url.startsWith("/customer") ||
    url.startsWith("/orders") ||
    url.startsWith("/users/me");

  let token = null;

  if (isAdminProductOperation) {
    token = localStorage.getItem("adminToken");
  } else if (isCustomerOperation) {
    token = localStorage.getItem("customerToken");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

// ==========================================
// PRODUCT APIs
// ==========================================

export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};
// GET ONE PRODUCT BY ID
export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

// ==========================================
// CUSTOMER AUTHENTICATION
// ==========================================

export const registerCustomer = async (customerData) => {
  const response = await API.post(
    "/auth/register",
    customerData
  );

  return response.data;
};

export const loginCustomer = async (loginData) => {
  const response = await API.post(
    "/auth/customer-login",
    loginData
  );

  return response.data;
};

export const logoutCustomer = () => {
  localStorage.removeItem("customerToken");
  localStorage.removeItem("customerUser");
};

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

export const loginAdmin = async (loginData) => {
  const response = await API.post(
    "/auth/login",
    loginData
  );

  return response.data;
};

// Named and default exports
export { API };
export default API;
// CUSTOMER PROFILE API
export const getCustomerProfile = async () => {
  const response = await API.get("/customer/me");
  return response.data;
};
export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};
export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");
  return response.data;
};
