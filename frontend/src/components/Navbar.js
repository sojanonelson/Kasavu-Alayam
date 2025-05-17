import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../redux/features/cart/cartSelector';
import Logo from '../assets/black.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = useSelector(selectCartTotalQuantity);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if user scrolled down or up
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }

      // Add shadow when scrolled
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen || cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, cartOpen]);

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-sm py-2 text-center">
        Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className={`bg-white/70 backdrop-blur-md items-center px-4 md:px-10 py-8 transition-all duration-300 ${
        scrolled ? 'shadow-md py-4' : 'py-8'
      }`}>
        <div className="max-w-10xl mx-auto flex items-center justify-between">
          {/* Left Links */}
          <div className="hidden md:flex gap-8 text-gray-800 font-medium flex-1">
<<<<<<< HEAD
            <Link to="/">Home</Link>
            <Link to="/mens">Mens Collection</Link>
            <Link to="/womens">Womens Collection</Link>
            <Link to="/sarees">Sarees</Link>
            <Link to="/kids">Kids</Link>
=======
            <Link to="/" className="nav-link relative hover:text-red-600 transition-colors duration-300">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/mens" className="nav-link relative hover:text-red-600 transition-colors duration-300">
              Mens Collection
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/womens" className="nav-link relative hover:text-red-600 transition-colors duration-300">
              Womens Collection
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/sarees" className="nav-link relative hover:text-red-600 transition-colors duration-300">
              Sarees
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/dresses" className="nav-link relative hover:text-red-600 transition-colors duration-300">
              Kids
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
>>>>>>> origin/main
          </div>

          {/* Logo */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
            scrolled ? 'scale-75' : 'scale-100'
          }`}>
            <Link to="/">
              <img src={Logo} className="h-16 mb-2" alt="Kasavu Aalayam" />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6 justify-end flex-1">
            <button 
              onClick={() => setCartOpen(!cartOpen)} 
              className="relative hover:text-red-600 transition-colors duration-300"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <Link to="/my-account" className="hover:text-red-600 transition-colors duration-300">
              <User size={24} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="transition-transform duration-300 hover:scale-110"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white px-6 py-4 flex flex-col gap-4 shadow-lg mobile-menu-container
          fixed left-0 w-64 h-screen top-0 z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Menu</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="transition-transform duration-300 hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>
        
        <Link 
          to="/" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/mens" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Mens
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/womens" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Womens
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/sarees" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Sarees
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/dresses" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Dresses
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/accessories" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Accessories
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/contact" 
          onClick={() => setIsOpen(false)}
          className="relative group hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          Contact
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/my-account" 
          onClick={() => setIsOpen(false)} 
          className="relative group flex items-center gap-2 hover:pl-2 transition-all duration-200 hover:text-red-600"
        >
          <User size={20} /> Account
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4 transition-transform duration-300 ease-in-out ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button 
            onClick={() => setCartOpen(false)}
            className="transition-transform duration-300 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>
        {/* You can import and use your <Cart /> component here */}
      </div>

      {/* Overlay for cart */}
      {cartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setCartOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;