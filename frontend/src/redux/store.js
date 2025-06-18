import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../pages/Cart/cartSlice';
import generalReducer from './features/general/general'; // assuming correct path

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    general: generalReducer, // ✅ This is the correct place for reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // ✅ Only ignore the persist action here
      },
    }),
});

export default store;
