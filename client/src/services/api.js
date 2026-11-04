
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// Get all products
export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

// Get one product
export const getProductById = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// Add a product
export const addProduct = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

// Update a product
export const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

export default API;
