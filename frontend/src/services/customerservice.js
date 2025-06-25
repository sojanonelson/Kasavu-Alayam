// customerService.js
import API from './axiosInstance';

const getAllCustomers = async () => {
  const response = await API.get(`/user`);
  return response.data;
};

const getUserById = async (id) => {
  const response = await API.get(`/user/${id}`);
  return response.data;
};

const updateUser = async (id, data) => {
  const response = await API.put(`/user/${id}`, data);
  return response.data;
};

const customerService = {
  getAllCustomers,
  getUserById,
  updateUser,
};

export default customerService
