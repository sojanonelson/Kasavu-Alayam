import { Outlet, NavLink } from 'react-router-dom';
import { User, ShoppingBag, MapPin, Heart, RotateCcw, LogOut } from 'lucide-react';

const CustomerLayout = () => {
  return (
    <div className="max-w-7xl mx-auto flex min-h-screen px-4 lg:pt-32 lg:px-8 poppins-regular">
      
      <aside className="w-72 bg-white lg:mt-24  p-6 rounded-lg ">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold mb-1">Hey Sojan</h2>
          <p className="text-sm text-gray-500">sojannelson54@gmail.com</p>
        </div>
        
        <nav className="flex flex-col space-y-3">
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
            to="orders" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <ShoppingBag size={18} />
            <span>Orders</span>
          </NavLink>
          
          <NavLink 
            to="address-book" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <MapPin size={18} />
            <span>Address Book</span>
          </NavLink>
          
          <NavLink 
            to="wishlist" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Heart size={18} />
            <span>Wishlist</span>
          </NavLink>
          
          <NavLink 
            to="returns" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <RotateCcw size={18} />
            <span>Returns</span>
          </NavLink>
          
          <div className="border-t my-2"></div>
          
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
      <main className="flex-1 p-8 mt-24 ml-8 bg-white rounded-lg ">
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;