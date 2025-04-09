import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

const getCustomers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createCustomer = async (customerData) => {
  const response = await axios.post(API_URL, customerData);
  return response.data;
};

const customerService = {
  getCustomers,
  createCustomer,
};

export default customerService;
