// axiosInstance.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  withCredentials: true, // 🌐 Needed for sending refresh token cookies
});

// 🛡 Add access token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Refresh token logic on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response && error.response.status === 401;

    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint to get new token (cookie-based refresh)
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/user/refresh`, {
          withCredentials: true, // 🧁 Send refresh token in cookie
        });

        const newToken = res.data.accessToken;
        localStorage.setItem('token', newToken); // ✅ Save new token

        // Update header & retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error('Refresh failed:', refreshErr);
        // Optionally log out the user here
      }
    }

    return Promise.reject(error);
  }
);

export default API;
