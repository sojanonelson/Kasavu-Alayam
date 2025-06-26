import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;

// ------- CATEGORY APIs --------

const createCategory = async (name) => {
  const response = await API.post(`${API_URL}/categories`, { name });
  return response.data;
};


const getAllCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};



const getAllCategoriesWithSubcategories = async () => {
  const response = await axios.get(`${API_URL}/categories/categories-with-subcategories`);
  return response.data;
};


const updateCategory = async (id, name) => {
  console.log("SSS;", name)
  const response = await API.put(`${API_URL}/categories/${id}`, { name:name });
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await API.delete(`${API_URL}/categories/${id}`);
  return response.data;
};

// ------- SUBCATEGORY APIs --------

const createSubCategory = async (name, categoryId) => {
  const response = await API.post(`${API_URL}/subcategories`, {
    name,
    categoryId
  });
  return response.data;
};


const getAllSubCategories = async () => {
  const response = await axios.get(`${API_URL}/subcategories`);
  return response.data;
};

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createSubCategory,
  getAllSubCategories,
  getAllCategoriesWithSubcategories
};
