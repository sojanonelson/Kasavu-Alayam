
import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;


// 🪙 Create a new order
export const getTransactionHistory = async () => {
  const response = await axios.get(`${API_URL}/payment/razorpay/payments`);
  return response.data;
};

export const getPaymentDetails = async (paymentId) => {
  const response = await axios.get(`${API_URL}/payment/razorpay/payments/${paymentId}`);
  return response.data;
};

