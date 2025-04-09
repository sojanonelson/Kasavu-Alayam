import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

const productService = {
  getProducts,
  createProduct,
};

export default productService;
