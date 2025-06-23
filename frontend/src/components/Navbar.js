import React, { useState, useEffect } from 'react';
import { Menu, X, User, ShoppingCart, LogIn } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import LoginWithOTP from '../pages/Login';
import { toggleLoginModel } from "../redux/features/general/general"; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = 3; // Mock cart count
  const navBar = useSelector((state) => state.general.showNavbar);
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setShowLogin(true);
    dispatch(toggleLoginModel(true));
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full transition-all duration-500 ${
      navBar ? 'z-50 fixed' : 'sticky top-0 z-50'
    } ${isScrolled ? 'shadow-2xl' : 'shadow-sm'}`}>
      
      {/* Top Banner */}
      <div className={`bg-gray-900 text-white text-xs py-2 text-center px-4 transition-all duration-500 ${
        isScrolled ? 'h-0 py-0 overflow-hidden lg:h-auto lg:py-2' : 'h-auto'
      }`}>
        Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className={`${
        navBar 
          ? `${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/20' : 'bg-white/10 backdrop-blur-2xl'} shadow-lg` 
          : `${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50' : 'bg-white'}`
      } transition-all duration-500`}>
        
        {/* Desktop Layout - Keep Original Design */}
        <div className="hidden lg:flex lg:px-32 items-center justify-between px-8 py-4">
          {/* Left Navigation Links */}
          <div className="flex items-center space-x-8">
            <a href="/" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 relative group transition-colors duration-500`}>
              Home
              <span className={`absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-500 group-hover:w-full`}></span>
            </a>
            
            {/* Men's Collection Dropdown */}
            <div className="relative group">
              <a href="/collections/mens" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 relative group transition-colors duration-500`}>
                Mens Collection
                <span className={`absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-500 group-hover:w-full`}></span>
              </a>
              <div className="absolute left-0 top-full mt-2 w-96 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 grid grid-cols-2 gap-1 p-4">
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b text-sm">Casual Wear</div>
                <a href="/collections/mens/casual-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Casual Shirts</a>
                <a href="/collections/mens/casual-pants" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Casual Pants</a>
                <a href="/collections/mens/t-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">T-Shirts</a>
                
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b mt-2 text-sm">Formal Wear</div>
                <a href="/collections/mens/formal-shirts" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Formal Shirts</a>
                <a href="/collections/mens/formal-pants" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Formal Pants</a>
                
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b mt-2 text-sm">Traditional</div>
                <a href="/collections/mens/dhotis" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Dhotis</a>
                <a href="/collections/mens/mundu" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Mundu</a>
              </div>
            </div>
            
            {/* Women's Collection Dropdown */}
            <div className="relative group">
              <a href="/collections/womens" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 relative group transition-colors duration-500`}>
                Womens Collection
                <span className={`absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-500 group-hover:w-full`}></span>
              </a>
              <div className="absolute left-0 top-full mt-2 w-96 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 grid grid-cols-2 gap-1 p-4">
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b text-sm">Traditional</div>
                <a href="/collections/womens/sarees" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Sarees</a>
                <a href="/collections/womens/salwars" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Salwars</a>
                <a href="/collections/womens/lehengas" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Lehengas</a>
                <a href="/collections/womens/blouses" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Blouses</a>
                
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b mt-2 text-sm">Casual Wear</div>
                <a href="/collections/womens/kurtis" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Kurtis</a>
                <a href="/collections/womens/tops" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Tops</a>
                
                <div className="col-span-2 font-medium px-3 py-2 text-gray-700 border-b mt-2 text-sm">Party Wear</div>
                <a href="/collections/womens/party-gowns" className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded">Gowns</a>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
            <a href="/" className="block">
              <div className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font font-bold text-4xl ${
                isScrolled ? 'text-3xl' : ''
              } transition-all duration-500`}>
                Kasavu Aalayam
              </div>
            </a>
          </div>

          {/* Right Navigation Links and Icons */}
          <div className="flex items-center space-x-8">
            <a href="/collections/textiles" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 relative group transition-colors duration-500`}>
              Textiles
              <span className={`absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-500 group-hover:w-full`}></span>
            </a>
            <a href="/collections/kids" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 relative group transition-colors duration-500`}>
              Kids
              <span className={`absolute left-0 -bottom-1 w-0 h-0.5 ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-500 group-hover:w-full`}></span>
            </a>
            
            <button className={`${navBar ? (isScrolled ? "text-black" : "text-white") : "text-black"} transition-colors duration-500 hover:scale-110 transform`}>
              <ShoppingCart size={22} />
            </button>
            <a href="/my-account" className={`${navBar ? (isScrolled ? "text-black" : "text-white") : "text-black"} transition-colors duration-500 hover:scale-110 transform`}>
              <User size={22} />
            </a>
            <button onClick={handleLogin} className={`${navBar ? (isScrolled ? "text-black" : "text-white") : "text-black"} transition-colors duration-500 hover:scale-110 transform`}>
              <LogIn size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Layout - Simplified to 3 Lines */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between px-3 py-2">
            {/* Hamburger Menu */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} transition-all duration-500 p-1`}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 w-full ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-full ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full ${navBar ? (isScrolled ? 'bg-black' : 'bg-white') : 'bg-black'} transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>

            {/* Center Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/">
                <div className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font font-bold text-lg sm:text-xl transition-all duration-500`}>
                  Kasavu Aalayam
                </div>
              </a>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              <button className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} transition-all duration-500 relative p-1`}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
              <a href="/my-account" className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} transition-all duration-500 p-1`}>
                <User size={18} />
              </a>
              <button onClick={handleLogin} className={`${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} transition-all duration-500 p-1`}>
                <LogIn size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className={`${
              navBar 
                ? `${isScrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/10 backdrop-blur-2xl'} border-t border-white/20` 
                : `bg-white border-t border-gray-200`
            } px-3 py-4`}>
              <div className="space-y-2">
                <a href="/" className={`block ${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 text-base py-2 border-b ${navBar ? (isScrolled ? 'border-black/20' : 'border-white/20') : 'border-gray-200'}`} onClick={() => setIsOpen(false)}>
                  Home
                </a>
                <a href="/collections/mens" className={`block ${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 text-base py-2 border-b ${navBar ? (isScrolled ? 'border-black/20' : 'border-white/20') : 'border-gray-200'}`} onClick={() => setIsOpen(false)}>
                  Mens Collection
                </a>
                <a href="/collections/womens" className={`block ${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 text-base py-2 border-b ${navBar ? (isScrolled ? 'border-black/20' : 'border-white/20') : 'border-gray-200'}`} onClick={() => setIsOpen(false)}>
                  Womens Collection
                </a>
                <a href="/collections/textiles" className={`block ${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 text-base py-2 border-b ${navBar ? (isScrolled ? 'border-black/20' : 'border-white/20') : 'border-gray-200'}`} onClick={() => setIsOpen(false)}>
                  Textiles
                </a>
                <a href="/collections/kids" className={`block ${navBar ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'} custom-font2 text-base py-2`} onClick={() => setIsOpen(false)}>
                  Kids
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showLogin && <LoginWithOTP onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Navbar;