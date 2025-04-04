import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      {/* Top Banner */}
      <div className="bg-gray-600 text-white text-sm py-2 text-center">
        🚚 Order Available Worldwide | Free Shipping on Orders Above ₹999
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md px-4 md:px-10 py-10 relative z-10">
        <div className="max-w-10xl mx-auto flex items-center justify-between">
          {/* Left - Navigation Links */}
          <div className="hidden md:flex gap-6 text-gray-700 text-md font-medium flex-1">
            <Link to="/">Home</Link>
            <Link to="/mens">Men’s Collection</Link>
            <Link to="/womens">Women’s Collection</Link>
            <Link to="/sarees">Sarees</Link>
            <Link to="/dresses">Dresses</Link>
           
          
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <img src={logo} alt="logo" className="h-10" />
            </Link>
          </div>

          {/* Right - Account Icon */}
          <div className="hidden md:flex items-center justify-end flex-1">
            <Link to="/account" className="text-gray-700 hover:text-yellow-600">
              <User size={24} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            {isOpen ? (
              <X size={28} onClick={() => setIsOpen(false)} />
            ) : (
              <Menu size={28} onClick={() => setIsOpen(true)} />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4 text-gray-700">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/mens" onClick={() => setIsOpen(false)}>Men’s Collection</Link>
          <Link to="/womens" onClick={() => setIsOpen(false)}>Women’s Collection</Link>
          <Link to="/sarees" onClick={() => setIsOpen(false)}>Sarees</Link>
          <Link to="/dresses" onClick={() => setIsOpen(false)}>Dresses</Link>
          <Link to="/accessories" onClick={() => setIsOpen(false)}>Accessories</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <hr />
          <Link to="/account" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <User size={20} /> Account
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
