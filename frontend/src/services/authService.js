import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API;

const createAccount = async (data) => {
  const response = await axios.post(`${API_URL}/user/register`, data, {
    withCredentials: true
  });
  return response.data;
};

const LoginAccount = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/user/login`,
    { email, password },
    { withCredentials: true } 
  );
  return response.data;
};

const DeleteAccount = async (id) => {
  const response = await axios.delete(`${API_URL}/user/${id}`, {
    withCredentials: true
  });
  return response.data;
};

const authService = {
  createAccount,
  LoginAccount,
  DeleteAccount
};

export default authService;
