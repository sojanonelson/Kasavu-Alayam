import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleNavbar } from "../redux/features/general/general";

// Pages and Components
import HomeScreen from "../pages/Home";
import WomensCollection from "../components/collections/Womens-collection";

import SideContactNavbar from "../pages/sidecontactbar";
import CustomerLayout from "../Layouts/CustomerLayout";
import Profile from "../pages/Customer/Profile";
import Orders from "../pages/Customer/Orders";
import NotFound from "../pages/NotFound";
import AppNotFound from "../pages/AppNotFound";
import SingleProductPage from "../pages/BuyNow/SingleProduct";
import MensCollection from "../components/collections/Mens-collection";
import KidsCollection from "../components/collections/Kids-collection";
import AdminLayout from "../Layouts/AdminLayout";
import Navbar from "../components/Navbar";
import OverviewPage from "../pages/Admin/Overview";
import Customers from "../pages/Admin/Customers";
import OrdersPage from "../pages/Admin/Order";
import NotificationsPage from "../pages/Admin/Notificaton";
import InventoryManagement from "../pages/Admin/Inventory";
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
import ResetPassword from "../pages/ResetPassword";
import CheckoutCart from "../pages/CheckoutCart";
import Address from "../pages/Customer/Address";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/Customer/OrderDetails";

const AppRoutes = () => {
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === "/") {
      dispatch(toggleNavbar(true));
    } else {
      dispatch(toggleNavbar(false));
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("USER:", parsedUser);
    }
    setLoadingUser(false);
  }, [location.pathname, dispatch]);

  if (loadingUser) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-xl transition-transform duration-300">
            <CheckoutCart onClose={() => setShowCart(false)} />
          </div>
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route element={<WithNavbar />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/" element={<SideContactNavbar />} />
          <Route path="/" element={<MensCollection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/collections/:collection" element={<CollectionsShowCase />} />
          <Route path="/womens" element={<WomensCollection />} />
          <Route path="/kids" element={<KidsCollection />} />
          <Route path="/mens" element={<MensCollection />} />
          
          <Route path="/checkout/cart" element={<CheckoutCart />} />
           <Route path="/checkout" element={<Checkout />} />
          <Route path="/product" element={<SingleProductPage />} />
          <Route path="/product/:productId" element={<SingleProductPage />} />
          <Route path="*" element={<AppNotFound />} />

          {/* Protected Customer Routes */}
          <Route path="/my-account" element={<ProtectedRoute user={user}><CustomerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
             <Route path="address" element={<Address />} />
            <Route path="order" element={<Orders />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute user={user}>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="collection" element={<CollectionManager />} />
          <Route path="users" element={<Customers />} />
          <Route path="orders" element={<OrdersPage />} />
        
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

// Navbar Wrapper Layout
const WithNavbar = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

// Route Guard for Logged-In Users
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Route Guard for Admin Only
const ProtectedAdminRoute = ({ user, children }) => {
  console.log("US:", user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default AppRoutes;
