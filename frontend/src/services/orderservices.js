
import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;
export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/order/create`, orderData);
  return response.data;
};
export const getAllOrders = async () => {
  const response = await axios.get(`${API_URL}/order/all`);
  return response.data;
};
export const getOrdersByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/order/user/${userId}`);
  return response.data;
};
export const getOrderByTrackingId = async (trackingId) => {
  const response = await API.get(`${API_URL}/order/${trackingId}`);
  return response.data;
};
export const getPackedOrders = async () => {
  const response = await axios.get(`${API_URL}/order/packed`);
  return response.data;
};
export const getUnpackedOrders = async () => {
  const response = await axios.get(`${API_URL}/order/unpacked`);
  return response.data;
};
export const updateOrderPack = async (orderId, packedStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/order/${orderId}/packed`, {
      packed: packedStatus
    });
    return response.data;
  } catch (error) {
    console.error("Error updating packed status:", error);
    throw error;
  }
};

export const getRevenueData = async () => {
  try{
    const response = await axios.get(`${API_URL}/order/revenue`)
    return response.data;

  }catch(error){
    console.error(error)
    throw error;
  }
}