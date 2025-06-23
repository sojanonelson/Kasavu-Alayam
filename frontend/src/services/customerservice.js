import axios from 'axios';


const API_URL = process.env.REACT_APP_BACKEND_API

const getAllCustomers = async () => {
  const response = await axios.get(`${API_URL}/user`);
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/user/${id}`);
  return response.data;
};



const updateUser = async (id,data) => {
  console.log("ID:", id)
  console.log("Data:", data)
  const response = await axios.put(`${API_URL}/user/${id}`,data);
  return response.data;
};



const userService = {
  getAllCustomers,
  getUserById,
  updateUser
  
};

export default userService;
