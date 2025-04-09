import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Logo from '../assets/white.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // NavLink component with underline animation
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="relative group text-white transition-colors duration-300"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  // MobileNavLink component with underline animation
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
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-sm py-2 text-center">
         Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className="bg-black/20 backdrop-blur-[1px] items-center shadow-md px-4 md:px-10 py-8">
        <div className="max-w-10xl mx-auto flex items-center justify-between">
          {/* Left - Navigation Links */}
          <div className="hidden md:flex gap-8 text-white text-md font-medium poppins-regular flex-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/mens">Men's Collection</NavLink>
            <NavLink to="/womens">Women's Collection</NavLink>
            <NavLink to="/sarees">Sarees</NavLink>
            <NavLink to="/dresses">Dresses</NavLink>
          </div>

          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {/* <Link to="/">
              <h1 className='text-4xl text-white font-bold poppins-bold'>Kasavu Aalayam</h1>
            </Link> */}
            <Link to="/">
      <img src={Logo} className='h-16 mb-2'></img>
            </Link>
          </div>

          {/* Right - Account Icon */}
          <div className="hidden md:flex items-center justify-end flex-1">
            <Link to="/account" className="text-gray-100 hover:text-red-600 transition-colors duration-300">
              <User size={24} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            {isOpen ? (
              <X size={28} onClick={() => setIsOpen(false)} className="text-white" />
            ) : (
              <Menu size={28} onClick={() => setIsOpen(true)} className="text-white" />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg px-6 py-4 flex flex-col gap-4 text-gray-700">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
          <MobileNavLink to="/mens" onClick={() => setIsOpen(false)}>Men's Collection</MobileNavLink>
          <MobileNavLink to="/womens" onClick={() => setIsOpen(false)}>Women's Collection</MobileNavLink>
          <MobileNavLink to="/sarees" onClick={() => setIsOpen(false)}>Sarees</MobileNavLink>
          <MobileNavLink to="/dresses" onClick={() => setIsOpen(false)}>Dresses</MobileNavLink>
          <MobileNavLink to="/accessories" onClick={() => setIsOpen(false)}>Accessories</MobileNavLink>
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

export default Navbar;