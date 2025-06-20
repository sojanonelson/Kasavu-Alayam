import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API;


const getProductByCollectionId = async (collectionId) => {
  const response = await axios.get(`${API_URL}/collections/${collectionId}/products`);
  return response.data;
};

const getAllCollection = async () => {
  const response = await axios.get(`${API_URL}/collections`);
  return response.data;
};

const createCollection = async (data) => {
  const response = await axios.post(`${API_URL}/collections`,data);
  return response.data;
};


const deleteCollection = async (id) => {
  const response = await axios.delete(`${API_URL}/collections/${id}`,);
  return response.data;
};

const updateCollection = async (id, data) => {
  const response = await axios.put(`${API_URL}/collections/${id}`, data);
  return response.data;
};



const collectionService  = {
  getProductByCollectionId,
  getAllCollection,
  createCollection,
  deleteCollection,
  updateCollection
  
};

export default collectionService;
