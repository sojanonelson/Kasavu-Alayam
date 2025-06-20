import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_API;

const websiteSettingService = {
  uploadCarouselImages: async (formData) => {
    const res = await axios.post(`${API_BASE_URL}/websetting/carousel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteCarouselImage: async (publicId) => {
    const res = await axios.delete(`${API_BASE_URL}/websetting/carousel`, {
      data: { publicId }
    });
    return res.data;
  },

  updateContactInfo: async (contact) => {
    const res = await axios.post(`${API_BASE_URL}/websetting/contact`, contact);
    return res.data;
  },

  updateBranches: async (branches) => {
    const res = await axios.post(`${API_BASE_URL}/websetting/branches`, branches);
    return res.data;
  },

  getWebSettings: async () => {
    const res = await axios.get(`${API_BASE_URL}/websetting`);
    return res.data;
  },

  updateMaintenanceStatus: async (data) => {
    const res = await axios.post(`${API_BASE_URL}/websetting/maintenance`, data);
    return res.data;
  },
};

export default websiteSettingService;