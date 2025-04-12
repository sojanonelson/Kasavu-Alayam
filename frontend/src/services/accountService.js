import axios from 'axios';

const API_URL = 'http://localhost:3000/api/account';

const register = async (formData) => {
  const data = new FormData();
  for (let key in formData) {
    data.append(key, formData[key]);
  }

  const response = await axios.post(`${API_URL}/register`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response;
};

export default {
  register
};
