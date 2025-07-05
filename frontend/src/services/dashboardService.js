
import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;


// 🪙 Create a new order
export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard/fetch`);
  return response.data;
};

