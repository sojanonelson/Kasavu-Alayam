import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;
const getAllLowStockCollection = async (collectionId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock`);
  return response.data;
};

const getAllLowStockCategory = async (collectionId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock-categories`);
  return response.data;
};
const getLowStockByCategory = async (collectionId, categoryId, threshold = 5) => {
  const response = await API.get(`${API_URL}/collections/${collectionId}/low-stock?threshold=${threshold}`);
  const data = response.data;
  return data[categoryId] || []; 
};
const getAllCollection = async () => {
  const response = await axios.get(`${API_URL}/collections`);
  return response.data;
};
const isProductLowStock = (product, threshold = 5) => {
  return product.stockQuantity <= threshold;
};
const stockService = {
  getAllLowStockCollection,
  getLowStockByCategory,
  getAllCollection,
  isProductLowStock,
  getAllLowStockCategory
};

export default stockService;
