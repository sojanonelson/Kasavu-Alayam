// src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomeScreen from '../pages/Home';
import Navbar from '../components/Navbar';
import MensCollection from '../pages/Mens-collection';
import WomensCollection from '../pages/Womens-collection';


const AppRoutes = () => {
  return (
    <Routes>
        
      <Route path="/" element={<HomeScreen />} />
      <Route path="/mens" element={<MensCollection />} />
      <Route path="/womens" element={<WomensCollection />} />
    

    </Routes>
  );
};

export default AppRoutes;
