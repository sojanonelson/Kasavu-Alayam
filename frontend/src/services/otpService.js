import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API// Adjust the URL as necessary

const SendVerificationOtp = async (data) => {
    console.log("SVO:", data)
  const response = await axios.post(`${API_URL}/otp/account-verify`, data);
  return response.data;
};


const verifyOtp = async (data) => {
  const response = await axios.post(`${API_URL}/otp/verify-otp`, data);
  return response.data;
};


const otpService = {
  SendVerificationOtp,
  verifyOtp
};

export default otpService;
