// src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomeScreen from '../pages/Home';
import Navbar from '../components/Navbar';


const AppRoutes = () => {
  return (
    <Routes>
        
      <Route path="/" element={<HomeScreen />} />

    </Routes>
  );
};

export default AppRoutes;
