import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;

// 🔹 Get ALL low stock products in a collection (default threshold = 5)
const getAllLowStockCollection = async (collectionId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock`);
  return response.data;
};

const getAllLowStockCategory = async (collectionId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock-categories`);
  return response.data;
};


// 🔹 Get low stock products by category in a collection
const getLowStockByCategory = async (collectionId, categoryId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock?threshold=${threshold}`);
  const data = response.data;
  return data[categoryId] || []; // Assumes you're indexing by category name
};

// 🔹 Get all collections (for dropdowns etc.)
const getAllCollection = async () => {
  const response = await axios.get(`${API_URL}/collections`);
  return response.data;
};

// 🔹 (Optional) Check if a single product is low in stock
const isProductLowStock = (product, threshold = 5) => {
  return product.stockQuantity <= threshold;
};






// Bundle the service
const stockService = {
  getAllLowStockCollection,
  getLowStockByCategory,
  getAllCollection,
  isProductLowStock,
  getAllLowStockCategory
};

export default stockService;
