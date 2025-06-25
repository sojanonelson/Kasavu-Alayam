import axios from 'axios';
import API from './axiosInstance';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

const uploadCarouselImage = async (formData) =>{
  const upload = await  API.post(`${API_BASE_URL}/websetting/upload`, formData);
  console.log("FORM:", formData)
  console.log("DJ:", upload.data)
  return upload


}

const reorderCarouselImages = async (orderedPublicIds) => {
  try {
    const response = await API.put(`${API_BASE_URL}/websetting/reorder`, { orderedPublicIds });
    return response.data;
  } catch (error) {
    console.error("Error reordering carousel images:", error);
    throw error;
  }
};

const getCarouselImages = async () => {
  try {
    const response = await API.get(`${API_BASE_URL}/websetting/images`);
    console.log("Carousel images data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    throw error;
  }
};
const deleteCarouselImage = (publicId) =>
  API.post(`${API_BASE_URL}/websetting/delete`, { publicId });

const updateContactInfo = async (contact) => {
  const res = await API.post(`${API_BASE_URL}/websetting/contact`, contact);
  return res.data;
};

const updateBranches = async (branches) => {
  const res = await API.post(`${API_BASE_URL}/websetting/branches`, branches);
  return res.data;
};

const getWebSettings = async () => {
  const res = await axios.get(`${API_BASE_URL}/websetting`);
  return res.data;
};

const updateMaintenanceStatus = async (data) => {
  const res = await API.post(`${API_BASE_URL}/websetting/maintenance`, data);
  return res.data;
};

const websiteSettingService = {
  uploadCarouselImage,
  getCarouselImages,
  deleteCarouselImage,
  updateContactInfo,
  updateBranches,
  getWebSettings,
  updateMaintenanceStatus,
  reorderCarouselImages
};

export default websiteSettingService;
