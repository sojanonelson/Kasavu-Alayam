import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard,
  Users,
  ShoppingBag,
  Boxes,
  Layers, // For Collections
  Tag,    // For Categories
  Package,
  Bell,
  Settings,
  LayoutGrid,
  FileText, // For Reports
  HelpCircle,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  Home,    // For Homepage Editor
  ClipboardList // For Inventory (alternative)
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import AdminNavbar from '../components/AdminNavbar';
import Logo from '../assets/square.png'; // Adjust the path to your logo image

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileAlert, setShowMobileAlert] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowMobileAlert(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const closeMobileAlert = () => {
    setShowMobileAlert(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Alert */}
      {showMobileAlert && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white  shadow-2xl p-6 max-w-md w-full border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="bg-yellow-100 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 poppins-bold">Desktop Recommended</h2>
      </div>
      <p className="mb-6 text-gray-600 leading-relaxed">
        This admin dashboard is designed for larger screens. For optimal experience and full functionality, we recommend accessing it from a desktop or tablet device.
      </p>
      <div className="flex justify-between">
        <button 
          onClick={closeMobileAlert}
          className="px-4 py-2 text-gray-600 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Dismiss
        </button>
        <button 
          onClick={closeMobileAlert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  </div>
)}

      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:hidden">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </header>
      )}

      <div className="flex flex-1 mx-auto w-full px-4 lg:px-0 gap-0">
        {/* Sidebar */}
        <aside 
          className={`
            ${sidebarOpen ? 'fixed inset-0 z-40 bg-black bg-opacity-50  lg:bg-transparent' : ''}
            ${!sidebarOpen && isMobile ? 'hidden' : ''}
          `}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <div 
            className={`
              w-64 bg-gray-800 p-2 flex-shrink-0 h-full transition-all
              ${isMobile ? 'fixed left-0 top-0 z-50 h-screen overflow-y-auto' : ''}
            `}
            onClick={e => e.stopPropagation()}
          >
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-2 mb-4">
              <div className="flex items-center space-x-3 p-2">
                <div className="h-10 w-10 rounded-full  flex items-center bg-white justify-center text-blue-600">
                  {/* <User className="h-5 w-5" /> */}
                  <img src={Logo} alt='logo'  className='bg-white border rounded-full'></img>
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Admin Panel </h2>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>

            <nav className="space-y-1  rounded-lg  p-2">
              {/* Dashboard Link */}
              <NavLink 
                to="overview" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors   ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <LayoutDashboard size={18} className="flex-shrink-0" />
                <span className="text-sm">Overview</span>
              </NavLink>

              {/* Users Management */}
              <NavLink 
                to="users" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Users size={18} className="flex-shrink-0" />
                <span className="text-sm">Users</span>
              </NavLink>

              {/* Orders Management */}
              <NavLink 
                to="orders" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <ShoppingBag size={18} className="flex-shrink-0" />
                <span className="text-sm">Orders</span>
              </NavLink>

              <NavLink 
                to="inventory" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Boxes  size={18} className="flex-shrink-0" />
                <span className="text-sm">Inventory</span>
              </NavLink>

               <NavLink 
  to="collection" 
  className={({ isActive }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
        : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
    }`
  }
  onClick={() => isMobile && setSidebarOpen(false)}
>
  <Layers size={18} className="flex-shrink-0" />
  <span className="text-sm">Collection</span>
</NavLink>
              <NavLink 
  to="category" 
  className={({ isActive }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
        : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
    }`
  }
  onClick={() => isMobile && setSidebarOpen(false)}
>
  <Tag size={18} className="flex-shrink-0" />
  <span className="text-sm">Category</span>
</NavLink>

              {/* Reports */}
              <NavLink 
                to="products" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Package  size={18} className="flex-shrink-0" />
                <span className="text-sm">Products</span>
              </NavLink>
              
             
              {/* Notifications */}
              <NavLink 
                to="notifications" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Bell size={18} className="flex-shrink-0" />
                <span className="text-sm">Notifications</span>
              </NavLink>
             

              

              {/* Settings */}
              <NavLink 
                to="settings" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <Settings size={18} className="flex-shrink-0" />
                <span className="text-sm">Settings</span>
              </NavLink>
              
             
              <NavLink 
                to="homepage-editor" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600' 
                      : 'text-gray-100 hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <LayoutGrid size={18} className="flex-shrink-0" />
                <span className="text-sm"> Homepage Editor
</span>
              </NavLink>
            </nav>

            {/* Logout Button */}
            <div className="mt-4 rounded-lg shadow-sm p-2">
              <button onClick={()=> handleLogout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-red-500 hover:bg-red-50 transition-colors text-sm">
                <LogOut size={18} className="flex-shrink-0" />
                <span>Log out</span>
              </button>
            </div>
            
          </div>
         
        </aside>

        {/* Main content */}
        <main className="flex-1  lg:py-0">
          <div className="bg-white rounded-lg shadow-sm  lg:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;