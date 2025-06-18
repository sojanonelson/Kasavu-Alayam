import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API;

// GET all products
const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// GET single product by ID
const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

const getProductByIdeal = async (ideal) => {
  const response = await axios.get(`${API_URL}/products/ideal/${ideal}`);
  return response.data;
};


// POST new product
const createProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products`, productData);
  return response.data;
};

// PUT update product by ID
const updateProduct = async (id, formData) => {
  console.log("PD:", formData)
  const response = await axios.put(`${API_URL}/products/${id}`, formData);
  return response.data;
};

const updateProductImages = async (id, formData) => {
  try {
    console.log("FormData Payload:", formData);

    const response = await axios.put(`${API_URL}/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update product images:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE product by ID
const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  createProduct,
  getProductByIdeal,
  updateProduct,updateProductImages,
  deleteProduct,
};

export default productService;
