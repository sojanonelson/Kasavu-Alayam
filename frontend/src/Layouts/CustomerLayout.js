import { Outlet, NavLink } from 'react-router-dom';
import { User, ShoppingBag, MapPin, Heart, RotateCcw, LogOut } from 'lucide-react';
import Footer from '../components/Footer';
import customerService from '../services/customerservice'
import { useEffect, useState } from 'react';

const CustomerLayout = () => {
  const [userData ,setUserData] = useState('')
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const userStr = localStorage.getItem('user');
          if (!userStr) return;
          const user = JSON.parse(userStr);
  
          const userData = await customerService.getUserById(user._id || user.id); // support both _id and id
          if (userData && userData._id) {
            setUserData(userData)
            console.log("U:", userData)
            
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUser();
    }, []);
  return (
    <div className="flex flex-col min-h-screen poppins-regular">
      
      {/* Main content container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full pb-2 px-4 lg:px-8 lg:pt-2 gap-8">
        
        {/* Sidebar */}
        <aside className="w-72 border-r-2 bg-white p-6  pt-10 ">
          <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold mb-1">
  Hey {userData?.firstName || JSON.parse(localStorage.getItem('user'))?.firstName }
</h2>

            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          <nav className="flex flex-col space-y-3">
            {/* Your NavLinks */}
            <NavLink 
              to="profile" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <User size={18} />
              <span>Profile</span>
            </NavLink>

            <NavLink 
              to="order" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <User size={18} />
              <span>Order</span>
            </NavLink>

            <NavLink 
              to="account-settings" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <User size={18} />
              <span>Account settings</span>
            </NavLink>
            <NavLink 
              to="help" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <User size={18} />
              <span>Help & support</span>
            </NavLink>
            <NavLink 
              to="help" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <User size={18} />
              <span>Help & support</span>
            </NavLink>
            
            
            {/* Add the rest of the links similarly */}
            <NavLink 
              to="/" 
              className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white p-8 ">
          <Outlet />
        </main>
      </div>

     
      <Footer />
    </div>
  );
};

export default CustomerLayout;
