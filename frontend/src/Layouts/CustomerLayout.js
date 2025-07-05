import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  HomeIcon,
  ShoppingBagIcon,
  HelpCircle,
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

        const userData = await customerService.getUserById(user._id || user.id);
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

  const getInitials = (firstName) => {
    return firstName ? firstName.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 poppins-regular lg:pt-20">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {getInitials(
                userData?.firstName ||
                  JSON.parse(localStorage.getItem("user"))?.firstName
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back,{" "}
                {userData?.firstName ||
                  JSON.parse(localStorage.getItem("user"))?.firstName}
              </h2>
              <p className="text-sm text-gray-500 truncate">{userData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full lg:pb-4 lg:px-8 lg:pt-6 gap-8">
        {/* Sidebar */}
        <aside className="lg:w-80 bg-white lg:rounded-xl lg:border border-gray-200/50 lg:p-6 p-1 pt-4 lg:pt-6 lg:h-fit lg:sticky lg:top-28">
          {/* Desktop Profile Header */}
          <div className="border-b border-gray-100 pb-6 mb-6 hidden lg:block">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {getInitials(
                  userData?.firstName ||
                    JSON.parse(localStorage.getItem("user"))?.firstName
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {userData?.firstName ||
                    JSON.parse(localStorage.getItem("user"))?.firstName}
                </h2>
                <p className="text-sm text-gray-500 break-all">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm"
                }`
              }
            >
              <User
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden lg:inline font-medium">
                Profile Settings
              </span>
            </NavLink>

            <NavLink
              to="order"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm"
                }`
              }
            >
              <ShoppingBagIcon
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden lg:inline font-medium">My Orders</span>
            </NavLink>

            <NavLink
              to="address"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm"
                }`
              }
            >
              <HomeIcon
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden lg:inline font-medium">Addresses</span>
            </NavLink>

            {/* <NavLink
              to="help"
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm"
                }`
              }
            >
              <HelpCircle
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden lg:inline font-medium">
                Help & Support
              </span>
            </NavLink> */}

            {/* Divider */}
            <div className="hidden lg:block border-t border-gray-200 my-4"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 hover:shadow-sm w-full text-left"
            >
              <LogOut
                size={20}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden lg:inline font-medium">Sign Out</span>
            </button>
          </nav>

          {/* Desktop Footer Info */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">Need assistance?</p>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white lg:rounded-xl  lg:border border-gray-200/50 lg:p-8 py-4 px-4 lg:py-8 overflow-hidden">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
