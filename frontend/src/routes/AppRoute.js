// src/AppRoutes.js
import React, { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import HomeScreen from "../pages/Home";
import WomensCollection from "../components/collections/Womens-collection";
import RegisterForm from "../components/RegisterForm";
import SareesSection from "../pages/sarees-collection";
import SideContactNavbar from "../pages/sidecontactbar";
import CustomerLayout from "../Layouts/CustomerLayout";
import Profile from "../pages/Customer/Profile";
import Orders from "../pages/Customer/Orders";
import NotFound from "../pages/NotFound";
import AppNotFound from "../pages/AppNotFound";
import SingleProductPage from "../pages/BuyNow/SingleProduct";
import CollectionsPage from "../components/collections/CollectionsPage";
import MensCollection from "../components/collections/Mens-collection";
import Cart from "../pages/Admin/Cart";
import AdminLayout from "../Layouts/AdminLayout";
import Navbar from "../components/Navbar";
import OverviewPage from "../pages/Admin/Overview";
import Customers from "../pages/Admin/Customers";
import OrdersPage from "../pages/Admin/Order";
import NotificationsPage from "../pages/Admin/Notificaton";
import InventoryManagement from "../pages/Admin/Inventory";
import Register from "../pages/Register";
import KidsCollection from '../components/collections/Kids-collection'; 

// Test
import CartComponent from '../pages/Admin/Cart';

import MyAccount from "../pages/MyAccount/MyAccount";
import ManageCategory from "../pages/Admin/ManageCategory";

import CreateProduct from "../pages/Admin/Products/CreateProduct";
import ProductOverview from "../pages/Admin/ProductOverview";
import UpdateProduct from "../pages/Admin/Products/UpdateProduct";







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
          <Route path="/kids" element={<KidsCollection/>} />
          <Route path="/mens" element={<MensCollection />} />
          <Route path="/components" element={<RegisterForm />} />
          <Route path="/sarees" element={<SareesSection />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/product" element={<SingleProductPage />} />
          <Route path="*" element={<AppNotFound />} />
          <Route path="/kids-collection" component={KidsCollection} />
           <Route path="/details/:id" element={<SingleProductPage />} />
          <Route path="/my-account" element={<CustomerLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="*" element={<NotFound />} />

         

            {/* <Route path="cart" element={<CartComponent />} />  */}
   {/* <Route path="/buy-now" element={<BuyNow />} /> */}
   {/* <Route path="/my-account" element={<MyAccount />}></Route> */}

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
           <Route path="category" element={<ManageCategory/>} />
           <Route path="products/create" element={<CreateProduct/>}/>
            <Route path="products/update/:id" element={<UpdateProduct/>}/>
           <Route path="products" element={<ProductOverview/>}/>
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