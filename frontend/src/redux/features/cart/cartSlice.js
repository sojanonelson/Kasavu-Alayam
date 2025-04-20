import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // {id, name, price, quantity}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload; // This is the product object
      const existing = state.items.find((i) => i.id === item.id); // Check if product already exists in the cart
      
      if (existing) {
        // If product exists, increase the quantity
        existing.quantity += item.quantity || 1; // Default quantity to 1 if not specified
      } else {
        // If product doesn't exist, add it to the cart
        state.items.push({ ...item, quantity: item.quantity || 1 }); // Ensure quantity is set
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload; // Product ID to be removed
      state.items = state.items.filter((item) => item.id !== productId); // Remove product by id
    },
    clearCart(state) {
      state.items = []; // Clear all products from the cart
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
