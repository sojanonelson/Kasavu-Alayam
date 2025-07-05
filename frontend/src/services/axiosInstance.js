import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  withCredentials: true,
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('🔄 Access token expired. Attempting to refresh...');
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_API}/user/refresh`,
          { withCredentials: true }
        );
        if (!res.data.accessToken) {
          throw new Error('No access token received');
        }
        const newToken = res.data.accessToken;
        localStorage.setItem('token', newToken);
        console.log('✅ Token refreshed successfully:', newToken);
        console.log('🔄 Retrying original request...');
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error('❌ Refresh failed:', refreshErr.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default API;