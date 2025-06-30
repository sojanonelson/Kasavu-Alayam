
import axios from 'axios';
import API from './axiosInstance';

const API_URL = process.env.REACT_APP_BACKEND_API;



export const createReview = async (reviewData) => {
    console.log(reviewData)
  const response = await axios.post(`${API_URL}/product/reviews`, reviewData);
  return response.data;
};


export const getAllReviews = async () => {
  const response = await axios.get(`${API_URL}/product/reviews/all`);
  return response.data;
};




export const getReviewOfProduct = async (productId) => {
  const response = await axios.get(`${API_URL}/product/reviews/product/${productId}`);
  return response.data;
};


export const deleteReviewById = async (reviewId) => {
  const response = await axios.delete(`${API_URL}/product/reviews/${reviewId}`);
  return response.data;
};


export const eligibilityCheck = async (productId,userId) => {

  const response = await API.get(`${API_URL}/product/reviews/eligible/${productId}` );
  return response.data;
};

