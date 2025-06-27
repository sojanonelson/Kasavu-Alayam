import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;


// 📥 Add new address
export const addAddress = async (userId, address) => {
    console.log("AddAddress:", address)
  const response = await API.post(`${API_URL}/user/address/add`, {
    userId,
    address
  }, { withCredentials: true });
  return response.data;
};

// ✏️ Update existing address
export const updateAddress = async (userId, addressId, updatedAddress) => {
  const response = await API.put(`${API_URL}/user/address/update`, {
    userId,
    addressId,
    updatedAddress
  }, { withCredentials: true });
  return response.data;
};

// 🗑 Delete an address
export const deleteAddress = async (userId, addressId) => {
  const response = await API.delete(`${API_URL}/user/address/delete`, {
    data: { userId, addressId },
    withCredentials: true
  });
  return response.data;
};

// 📦 Fetch all addresses
export const getUserAddresses = async (userId) => {
  const response = await API.get(`${API_URL}/user/address/${userId}`, {
    withCredentials: true
  });
  return response.data;
};
