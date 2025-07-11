import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../assets/2.png';

const ScrollNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="relative group text-black transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  const MobileNavLink = ({ to, children, onClick }) => (
    <Link 
      to={to} 
      onClick={onClick}
      className="relative group text-gray-700 py-1 transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  return (
    <header className="fixed w-full top-0 left-0 z-50">
      {/* ✅ Animate banner + navbar together */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 70, damping: 15 }}
      >
        {/* Top Banner */}
        <div className="bg-gray-900 text-white text-sm py-2 text-center">
          Order Available Worldwideeee | Free Shipping on Orders Above ₹2999
        </div>

        {/* Main Navbar */}
        <nav className="lg:bg-white bg-gray-100 lg:backdrop-blur-sm items-center shadow-md px-4 md:px-10 py-8">
          <div className="max-w-10xl mx-auto flex items-center justify-between">
            {/* Left - Navigation Links */}
            <div className="hidden md:flex gap-8 text-black text-md font-medium poppins-regular" style={{maxWidth: 'calc(50% - 100px)'}}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/mens">Mens Collection</NavLink>
              <NavLink to="/womens">Womens Collection</NavLink>
              <NavLink to="/sarees">Sarees</NavLink>
              <NavLink to="/kids">Kids</NavLink>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/">
                <img src={Logo} className="h-16 mb-2" alt="Logo" />
              </Link>
            </div>

            {/* Right - Account */}
            <div className="hidden md:flex items-center justify-end" style={{maxWidth: 'calc(50% - 100px)'}}>
              <Link to="/account" className="text-gray-100 hover:text-white bg-gray-500 rounded-full p-1 transition-colors duration-300">
                <User size={24} className='' />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              {isOpen ? (
                <X size={28} onClick={() => setIsOpen(false)} className="text-black" />
              ) : (
                <Menu size={28} onClick={() => setIsOpen(true)} className="text-black" />
              )}
            </div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg px-6 py-4 flex flex-col gap-4 text-gray-700">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/mens" onClick={() => setIsOpen(false)}>Mens Collection</MobileNavLink>
          <MobileNavLink to="/womens" onClick={() => setIsOpen(false)}>Womens Collection</MobileNavLink>
          <MobileNavLink to="/sarees" onClick={() => setIsOpen(false)}>Sarees</MobileNavLink>
          <MobileNavLink to="/dresses" onClick={() => setIsOpen(false)}>Dresses</MobileNavLink>
          <MobileNavLink to="/kids" onClick={() => setIsOpen(false)}>Kids</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
          <hr />
          <MobileNavLink to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <User size={20} /> Account
          </MobileNavLink>
        </div>
      )}
    </header>
  );
};

export default ScrollNavbar;