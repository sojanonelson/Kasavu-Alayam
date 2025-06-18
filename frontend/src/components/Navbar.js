import React, { useState } from 'react';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import Logo from '../assets/logo.png'
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = 3; // Mock cart count
  const navBar = useSelector((state) => state.general.showNavbar);
  console.log("status:", navBar)

  return (
    <header className={`w-full  shadow-sm ${navBar ? 'z-50 absolute' : ''}`}>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-[8px] lg:text-sm py-2 text-center px-4">
        Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className={ `${navBar ? 'bg-white/10 shadow-lg' : 'bg-white'}  lg:py-3`}>
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between px-8 py-6">
          {/* Left Navigation Links */}
          <div className="flex items-center space-x-8">
            <a href="/" className={` ${navBar ? 'text-white' : 'text-black'} custom-font2   transition-colors duration-300`} >
              Home
            </a>
            <a href="/collections/mens" className={` ${navBar ? 'text-white' : 'text-black'} custom-font2   transition-colors duration-300`} >
              Mens Collection
            </a>
            <a href="/collections/womens" className={` ${navBar ? 'text-white' : 'text-black'} custom-font2   transition-colors duration-300`} >
              Womens Collection
            </a>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2 ">
            <a href="/" className="block">
              <div className="flex items-center justify-center text-white ">
                <div className={`  ${navBar ? ' text-white ' : ' text-black'}  custom-font  flex items-center justify-center rounded  font-bold lg:text-5xl `}>
                  Kasavu Aalayam
                </div>
              </div>
            </a>
          </div>

          {/* Right Navigation Links and Icons */}
          <div className="flex items-center space-x-8">
            <a href="/collections/sarees" className={` ${navBar ? 'text-white' : 'text-black'} custom-font2   transition-colors duration-300`} >
              Sarees
            </a>
            <a href="/collections/kids" className={` ${navBar ? 'text-white' : 'text-black'} custom-font2   transition-colors duration-300`} >
              Kids
            </a>
            
            {/* Icons */}
            <button className={` ${navBar ? "text-white" : "text-black"}  transition-colors duration-300 relative`}>
              <ShoppingCart size={24} />
             
            </button>
            <a href="/my-account" className={` ${navBar ? "text-white" : "text-black"} transition-colors duration-300 `}>
              <User size={24} />
            </a>
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white  transition-colors duration-300 z-10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Center Logo - Absolutely positioned for perfect centering */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/" className="flex-shrink-0">
                <div className={`w-auto h-12  flex items-center justify-center  rounded ${navBar ? 'text-white':'text-black'} custom-font pr-1 text-1xl `}>
                  Kasavu Aalayam
                </div>
              </a>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center space-x-4 z-10">
              <button className={` ${navBar ? 'text-white' : 'text-black'} justify-center items-center flex-row flex  transition-colors duration-300 relative`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1 rounded-full ml-1">
                    {cartCount}
                  </span>
                )}
              </button>
              <a href="/my-account" className={`${navBar ? 'text-white':'text-black'} transition-colors duration-300 `} >
                <User size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="bg-white border-t border-gray-200">
              <div className="px-4 py-2 space-y-1">
                <a 
                  href="/" 
                  className="block px-3 py-2 text-gray-800  custom-font2   rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/collections/mens" 
                  className="block px-3 py-2 text-gray-800  custom-font2   rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Mens Collection
                </a>
                <a 
                  href="/collections/womens" 
                  className="block px-3 py-2 text-gray-800 custom-font2   rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Womens Collection
                </a>
                <a 
                  href="/collections/sarees" 
                  className="block px-3 py-2 text-gray-800  custom-font2   rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sarees
                </a>
                <a 
                  href="/collections/kids" 
                  className="block px-3 py-2 text-gray-800  custom-font2  rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Kids
                </a>
                <a 
                  href="/contact" 
                  className="block px-3 py-2 text-gray-800  custom-font2  hover:bg-gray-50 rounded transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;