import axios from "axios";
import API from "./axiosInstance";

const API_URL = process.env.REACT_APP_BACKEND_API;

// 💼 Add or update product in cart
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

// ❌ Remove product from cart
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

// 🔄 Update quantity of a product
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

// 📦 Get user's cart
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
