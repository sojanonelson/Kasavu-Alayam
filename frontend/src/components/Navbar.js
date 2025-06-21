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
    <header className={`w-full shadow-sm ${navBar ? 'z-50 absolute' : ''}`}>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-[8px] lg:text-sm py-2 text-center px-4">
        Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className={`${navBar ? 'bg-white/10 shadow-lg' : 'bg-white'} lg:py-3`}>
        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:px-32 items-center justify-between px-8 py-6">
          {/* Left Navigation Links */}
          <div className="flex items-center space-x-8">
            <a href="/" className={`${navBar ? 'text-white' : 'text-black'} custom-font2 relative group transition-colors duration-300`}>
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>
            
            {/* Men's Collection Dropdown */}
            <div className="relative group">
              <a href="/collections/mens" className={`${navBar ? 'text-white' : 'text-black'} custom-font2 relative group transition-colors duration-300`}>
                Mens Collection
                <span className={` absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black' }  transition-all duration-300 group-hover:w-full`}></span>
              </a>
              <div className="absolute left-0 top-full mt-2 lg:w-[20cm] bg-white shadow-lg  opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 grid grid-cols-2 gap-1 p-2">
                {/* Casual Wear */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b">Casual Wear</div>
                <a href="/collections/mens/casual-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Casual Shirts</a>
                <a href="/collections/mens/casual-pants" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Casual Pants</a>
                <a href="/collections/mens/t-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">T-Shirts</a>
                
                {/* Formal Wear */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b mt-1">Formal Wear</div>
                <a href="/collections/mens/formal-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Formal Shirts</a>
                <a href="/collections/mens/formal-pants" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Formal Pants</a>
                
                {/* Traditional */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b mt-1">Traditional</div>
                <a href="/collections/mens/dhotis" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Dhotis</a>
                <a href="/collections/mens/mundu" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Mundu</a>
              </div>
            </div>
            
            {/* Women's Collection Dropdown */}
            <div className="relative group">
              <a href="/collections/womens" className={`${navBar ? 'text-white' : 'text-black'} custom-font2 relative group transition-colors duration-300`}>
                Womens Collection
               <span className={` absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black' }  transition-all duration-300 group-hover:w-full`}></span>
              </a>
              <div className="absolute left-0 top-full mt-2 lg:w-[20cm] bg-white shadow-lg   opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 grid grid-cols-2 gap-1 p-2">
                {/* Traditional Wear */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b">Traditional</div>
                <a href="/collections/womens/sarees" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Sarees</a>
                <a href="/collections/womens/salwars" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Salwars</a>
                <a href="/collections/womens/lehengas" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Lehengas</a>
                <a href="/collections/womens/blouses" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Blouses</a>
                
                {/* Casual Wear */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b mt-1">Casual Wear</div>
                <a href="/collections/womens/kurtis" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Kurtis</a>
                <a href="/collections/womens/tops" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Tops</a>
                
                {/* Party Wear */}
                <div className="col-span-2 font-medium px-3 py-1 text-gray-700 border-b mt-1">Party Wear</div>
                <a href="/collections/womens/party-gowns" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100">Gowns</a>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="block">
              <div className="flex items-center justify-center text-white">
                <div className={`${navBar ? 'text-white' : 'text-black'} custom-font flex items-center justify-center rounded font-bold lg:text-5xl`}>
                  Kasavu Aalayam
                </div>
              </div>
            </a>
          </div>

          {/* Right Navigation Links and Icons */}
          <div className="flex items-center space-x-8">
            <a href="/collections/textiles" className={`${navBar ? 'text-white' : 'text-black'} custom-font2 relative group transition-colors duration-300`}>
              Textiles
              <span className={` absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black' }  transition-all duration-300 group-hover:w-full`}></span>
            </a>
            <a href="/collections/kids" className={`${navBar ? 'text-white' : 'text-black'} custom-font2 relative group transition-colors duration-300`}>
              Kids
              <span className={` absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black' }  transition-all duration-300 group-hover:w-full`}></span>
            </a>
            
            {/* Icons */}
            <button className={`${navBar ? "text-white" : "text-black"} transition-colors duration-300 relative`}>
              <ShoppingCart size={24} />
            </button>
            <a href="/my-account" className={`${navBar ? "text-white" : "text-black"} transition-colors duration-300`}>
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
              className={`${navBar ? 'text-white' : 'text-black'} transition-colors duration-300 z-10`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Center Logo - Absolutely positioned for perfect centering */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/" className="flex-shrink-0">
                <div className={`w-auto h-12 flex items-center justify-center rounded ${navBar ? 'text-white':'text-black'} custom-font pr-1 text-1xl`}>
                  Kasavu Aalayam
                </div>
              </a>
            </div>

            {/* Mobile Icons */}
            <div className="flex items-center space-x-4 z-10">
              <button className={`${navBar ? 'text-white' : 'text-black'} justify-center items-center flex-row flex transition-colors duration-300 relative`}>
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="bg-red-600 text-white text-xs px-1 rounded-full ml-1">
                    {cartCount}
                  </span>
                )}
              </button>
              <a href="/my-account" className={`${navBar ? 'text-white':'text-black'} transition-colors duration-300`}>
                <User size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className={`${navBar ? 'bg-white/10 backdrop-blur-md' : 'bg-white'} border-t border-gray-200`}>
              <div className="px-4 py-2 space-y-1">
                <a 
                  href="/" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
                </a>
                <a 
                  href="/collections/mens" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Mens Collection
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
                </a>
                <a 
                  href="/collections/womens" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Womens Collection
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
                </a>
                <a 
                  href="/collections/sarees" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Sarees
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
                </a>
                <a 
                  href="/collections/kids" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Kids
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
                </a>
                <a 
                  href="/contact" 
                  className={`block px-3 py-2 ${navBar ? 'text-white' : 'text-gray-800'} custom-font2 hover:bg-gray-50 rounded transition-colors duration-300 relative group`}
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                  <span className={`absolute left-3 -bottom-1 w-0 h-0.5 ${navBar ? 'bg-white' : 'bg-black'} transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]`}></span>
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