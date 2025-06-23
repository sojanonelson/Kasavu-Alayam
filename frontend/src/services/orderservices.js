import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API// Adjust the URL as necessary

const getUserByPhone = async (phone) => {
  const response = await axios.get(`${API_URL}/user/?phone=${phone}`);
  return response.data;
};

const createOrUpdateUser = async (userData) => {
  const response = await axios.post(`${API_URL}/user/create`, userData);
  return response.data;
};

const orderService = {
  getUserByPhone,
  createOrUpdateUser,
};

export default orderService;
