import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

const getOrders = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

const orderService = {
  getOrders,
  createOrder,
};

export default orderService;
