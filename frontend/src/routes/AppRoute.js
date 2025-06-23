import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../redux/features/general/general";

// Pages and components
import HomeScreen from "../pages/Home";
import WomensCollection from "../components/collections/Womens-collection";

import SareesSection from "../pages/sarees-collection";
import SideContactNavbar from "../pages/sidecontactbar";
import CustomerLayout from "../Layouts/CustomerLayout";
import Profile from "../pages/Customer/Profile";
import Orders from "../pages/Customer/Orders";
import NotFound from "../pages/NotFound";
import AppNotFound from "../pages/AppNotFound";
import SingleProductPage from "../pages/BuyNow/SingleProduct";
import MensCollection from "../components/collections/Mens-collection";
import Cart from "../pages/Admin/Cart";
import AdminLayout from "../Layouts/AdminLayout";
import Navbar from "../components/Navbar";
import OverviewPage from "../pages/Admin/Overview";
import Customers from "../pages/Admin/Customers";
import OrdersPage from "../pages/Admin/Order";
import NotificationsPage from "../pages/Admin/Notificaton";
import InventoryManagement from "../pages/Admin/Inventory";
import KidsCollection from '../components/collections/Kids-collection';

import ManageCategory from "../pages/Admin/ManageCategory";
import CreateProduct from "../pages/Admin/Products/CreateProduct";
import ProductOverview from "../pages/Admin/ProductOverview";
import UpdateProduct from "../pages/Admin/Products/UpdateProduct";
import Settings from "../pages/Admin/Settings";
import HomepageEditor from "../pages/Admin/HomepageEditor";

import CollectionManager from "../pages/Admin/Collections";
import InventoryCollections from "../pages/Admin/Inventory/InventoryCollections";
import CollectionsShowCase from "../pages/Collections";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRoutes = () => {
  const [showCart, setShowCart] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Show navbar only on homepage
    if (location.pathname === "/") {
      dispatch(toggleNavbar(true));
    } else {
      dispatch(toggleNavbar(false));
    }
  }, [location.pathname, dispatch]);

  const loading = useSelector((state) => state.general.showNavbar);
  const loginModel = useSelector((state) => state.general.loginModel);

  console.log("REDUX:", loading);
  console.log("LoginModel:", loginModel);

  return (
    <div >
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl transition-transform duration-300">
            <Cart onClose={() => setShowCart(false)} />
          </div>
        </>
      )}

      <Routes>
        <Route element={<WithNavbar />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/" element={<SideContactNavbar />} />
          <Route path="/" element={<MensCollection />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/collections/:collection" element={<CollectionsShowCase />} />
          <Route path="/womens" element={<WomensCollection />} />
          <Route path="/kids" element={<KidsCollection />} />
          <Route path="/mens" element={<MensCollection />} />
          <Route path="/sarees" element={<SareesSection />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/product" element={<SingleProductPage />} />
          <Route path="*" element={<AppNotFound />} />
          <Route path="/details/:productId" element={<SingleProductPage />} />
          <Route path="/my-account" element={<CustomerLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="collection" element={<CollectionManager />} />
          <Route path="users" element={<Customers />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="homepage-editor" element={<HomepageEditor />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="inventory/collection/:id" element={<InventoryCollections />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="category" element={<ManageCategory />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="products" element={<ProductOverview />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

const WithNavbar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppRoutes;
