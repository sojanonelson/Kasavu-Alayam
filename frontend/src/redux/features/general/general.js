// src/redux/slices/general.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appLoading: false,
  showNavbar: true,         // Navbar visibility on home screen
  theme: 'light',           // 'light' or 'dark'
  userData: null ,
  loginModel: false           // User object or null if not logged in
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
    },
    toggleNavbar: (state, action) => {
      state.showNavbar = action.payload;
    },
     toggleLoginModel: (state, action) => {
      state.loginModel = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    }
  }
});

export const {
  setAppLoading,
  toggleNavbar,
  toggleLoginModel,
  setTheme,
  setUserData,
  clearUserData
} = generalSlice.actions;

export default generalSlice.reducer;
