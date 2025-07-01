import axios from 'axios';
import API from './axiosInstance';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

const uploadHandloomImage = async (formData) => {
  const upload = await API.post(`${API_BASE_URL}/handloom/upload`, formData);
  console.log("Upload response:", upload.data);
  return upload;
};

const reorderHandloomImages = async (orderedPublicIds) => {
  try {
    const response = await API.put(`${API_BASE_URL}/handloom/reorder`, { orderedPublicIds });
    return response.data;
  } catch (error) {
    console.error("Error reordering handloom images:", error);
    throw error;
  }
};

const getHandloomImages = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/handloom/images`);
    console.log("Handloom images data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching handloom images:", error);
    throw error;
  }
};

const deleteHandloomImage = (publicId) =>
  API.post(`${API_BASE_URL}/handloom/delete`, { publicId });

const handloomService = {
  uploadHandloomImage,
  getHandloomImages,
  deleteHandloomImage,
  reorderHandloomImages
};

export default handloomService;
