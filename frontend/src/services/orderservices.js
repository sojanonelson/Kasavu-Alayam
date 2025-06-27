
import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;


// 🪙 Create a new order
export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/order/create`, orderData);
  return response.data;
};

// 📦 Get all orders (admin only)
export const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/order/all`);
  return response.data;
};



// 👤 Get orders of a specific user
export const getOrdersByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/order/user/${userId}`);
  return response.data;
};

// 🆔 Get single order by tracking ID
export const getOrderByTrackingId = async (trackingId) => {
  const response = await axios.get(`${API_URL}/order/${trackingId}`);
  return response.data;
};
