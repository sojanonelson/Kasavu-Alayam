// src/AppRoutes.js
import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import HomeScreen from "../pages/Home";
import WomensCollection from "../pages/Womens-collection";
import RegisterForm from "../components/RegisterForm";
import SareesSection from "../pages/sarees-collection";
import SideContactNavbar from "../pages/sidecontactbar";
import CustomerLayout from "../Layouts/CustomerLayout";
import Profile from "../pages/Customer/Profile";
import Orders from "../pages/Customer/Orders";
import NotFound from "../pages/NotFound";
import AppNotFound from "../pages/AppNotFound";
import SingleProductPage from "../pages/SingleProduct";
import CollectionsPage from "../components/collections/CollectionsPage";
import MensCollection from "../components/collections/MensCollection";
import Cart from "../pages/Customer/Cart";
import AdminLayout from "../Layouts/AdminLayout";
import ProfilePage from "../pages/Admin/Profile";
import Navbar from "../components/Navbar";
import OverviewPage from "../pages/Admin/Overview";
import Customers from "../pages/Admin/Customers";
import { Helmet } from "react-helmet";
import OrdersPage from "../pages/Admin/Order";
import NotificationsPage from "../pages/Admin/Notificaton";
import InventoryManagement from "../pages/Admin/Inventory";
import Register from "../pages/Register";

const AppRoutes = () => {
  const [showCart, setShowCart] = useState(false);
  return (
    <>
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)} // close when background is clicked
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl transition-transform duration-300">
            <Cart onClose={() => setShowCart(false)} />
          </div>
        </>
      )}

      <Routes>
        {/* Routes with Navbar */}
        <Route element={<WithNavbar />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/" element={<SideContactNavbar />} />
          <Route path="/" element={<MensCollection />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collections/:id" element={<CollectionsPage />} />
          <Route path="/womens" element={<WomensCollection />} />
          <Route path="/mens" element={<MensCollection />} />
          <Route path="/components" element={<RegisterForm />} />
          <Route path="/sarees" element={<SareesSection />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/product" element={<SingleProductPage />} />
          <Route path="*" element={<AppNotFound />} />

          <Route path="/my-account" element={<CustomerLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Routes without Navbar */}
        <Route path="/admin" element={<AdminLayout />}>
        

          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage/>}/>
          <Route path="users" element={<Customers />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="notifications" element={<NotificationsPage/>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

// Wrapper component for routes that need Navbar
const WithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppRoutes;