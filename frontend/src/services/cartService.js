import axios from "axios";
import API from "./axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_API;
const addToCart = async ({ userId, productId, quantity }) => {
  const res = await API.post(
    `${API_URL}/cart/add`,
    {
      userId,
      productId,
      quantity,
    },
    { withCredentials: true }
  );
  return res.data;
};
const removeFromCart = async (userId, productId ) => {
  console.log("u:", userId)
  const res = await API.post(
    `${API_URL}/cart/remove`,
    {
      userId,
      productId,
    },
    { withCredentials: true }
  );
  return res.data;
};
const updateCartItemQuantity = async ( userId, productId, quantity ) => {
    console.log("ProductID:", productId)
    console.log("UserID:", userId )
  const res = await API.post(
    `${API_URL}/cart/update`,
    {
      userId,
      productId,
      quantity,
    },
    { withCredentials: true }
  );
  return res.data;
};
const getUserCart = async (userId) => {
  const res = await API.get(`${API_URL}/cart/${userId}`, {
    withCredentials: true,
  });
  return res.data;
};

export default {
  getUserCart,
  updateCartItemQuantity,
  removeFromCart,
  addToCart,
};
