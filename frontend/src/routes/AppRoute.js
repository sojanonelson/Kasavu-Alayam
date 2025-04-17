// src/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeScreen from '../pages/Home';
import MensCollection from '../pages/Mens-collection';
import WomensCollection from '../pages/Womens-collection';
import RegisterForm from '../components/RegisterForm';
import SareesSection from '../pages/sarees-collection';
import SideContactNavbar from '../pages/sidecontactbar';
import CustomerLayout from '../Layouts/CustomerLayout';
import Profile from '../pages/Customer/Profile';
import Navbar from '../components/Navbar';
import Orders from '../pages/Customer/Orders';
import NotFound from '../pages/NotFound';
import AppNotFound from '../pages/AppNotFound';
import SingleProductPage from '../pages/SingleProduct';

// Import nested pages

// import Orders from '../pages/user/Orders';
// import Wishlist from '../pages/user/Wishlist';
// import AddressBook from '../pages/user/AddressBook';
// import Returns from '../pages/user/Returns';

const AppRoutes = () => {
  return (
    
    <Routes>
     
      <Route path="/" element={<HomeScreen />} />
      <Route path="/" element={<SideContactNavbar  />} />
      <Route path="/mens" element={<MensCollection />} />
      <Route path="/womens" element={<WomensCollection />} />
      <Route path='/components' element={<RegisterForm />} />
      <Route path="/sarees" element={<SareesSection />} />
      <Route path='/product' element={<SingleProductPage/>}/>
      <Route path="*" element={<AppNotFound />} />

      {/* My Account Routes */}
      <Route path="/my-account" element={<CustomerLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<Profile />} />
    <Route path="orders" element={<Orders />} />
    <Route path="*" element={<NotFound />} />
            {/* <Route path="wishlist" element={<Wishlist />} />
        <Route path="address-book" element={<AddressBook />} />
        <Route path="returns" element={<Returns />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
