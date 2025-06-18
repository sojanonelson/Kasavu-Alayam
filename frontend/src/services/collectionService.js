import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API;


const getProductByCollection = async (collection) => {
  const response = await axios.post(`${API_URL}/collections`, {
    collection: collection
  });
  return response.data;
};



const collectionService  = {
  getProductByCollection
};

export default collectionService;
