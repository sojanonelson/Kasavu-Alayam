import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_API

const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createCustomer = async (customerData) => {
  const response = await axios.post(`${API_URL}/customers`, customerData);
  return response.data;
};

const customerService = {
  getCustomers,
  createCustomer,
};

export default customerService;
