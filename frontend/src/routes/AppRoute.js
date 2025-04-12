// src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import accountService from '../services/accountService';


import HomeScreen from '../pages/Home';
import Navbar from '../components/Navbar';
import MensCollection from '../pages/Mens-collection';
import WomensCollection from '../pages/Womens-collection';
import RegisterForm from '../components/RegisterForm';
import SareesSection from '../pages/sarees-collection';







const AppRoutes = () => {
  return (
    <Routes>
        
      <Route path="/" element={<HomeScreen />} />
      <Route path="/mens" element={<MensCollection />} />
      <Route path="/womens" element={<WomensCollection />} />
      <Route path='/components' element={<RegisterForm />} />
      <Route path="/sarees" element={<SareesSection />} />
      
    

    </Routes>
  );
};

export default AppRoutes;
