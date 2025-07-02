import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  RotateCcw,
  LogOut,
  HomeIcon,
  ListOrderedIcon,
  ShoppingBagIcon,
} from "lucide-react";
import Footer from "../components/Footer";
import customerService from "../services/customerservice";
import { useEffect, useState } from "react";

const CustomerLayout = () => {
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const userData = await customerService.getUserById(user._id || user.id); // support both _id and id
        if (userData && userData._id) {
          setUserData(userData);
          console.log("U:", userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <div className="flex flex-col min-h-screen poppins-regular lg:pt-20">
      {/* Main content container */}
      <div className="border-b lg:hidden pb-4 mb-6 p-3">
        <h2 className="text-xl font-semibold mb-1">
          Hey{" "}
          {userData?.firstName ||
            JSON.parse(localStorage.getItem("user"))?.firstName}
        </h2>

        <p className="text-sm text-gray-500">{userData.email}</p>
      </div>
      <div className="flex flex-1  max-w-7xl mx-auto w-full lg:pb-4  lg:px-8 lg:pt-2 gap-8">
        <aside className="lg:w-72 border-r-2 bg-white lg:p-6 p-1  pt-10 ">
          <div className="border-b pb-4 mb-6 hidden lg:block">
            <h2 className="text-xl font-semibold mb-1">
              Hey{" "}
              {userData?.firstName ||
                JSON.parse(localStorage.getItem("user"))?.firstName}
            </h2>

            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          <nav className="flex flex-col space-y-3">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <User size={18} />
              <span className="hidden lg:inline">Profile</span>
            </NavLink>

            <NavLink
              to="order"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <ShoppingBagIcon size={18} />
              <span className="hidden lg:inline">Order</span>
            </NavLink>

            <NavLink
              to="address"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <HomeIcon size={18} />
              <span className="hidden lg:inline">Address</span>
            </NavLink>

            <NavLink
              to="help"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <User size={18} />
              <span className="hidden lg:inline">Help & Support</span>
            </NavLink>

            <NavLink
              onClick={handleLogout}
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Log out</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white lg:p-8 py-2 lg:py-0 ">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
