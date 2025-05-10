import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartTotalQuantity } from '../redux/features/cart/cartSelector';
import Logo from '../assets/black.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = useSelector(selectCartTotalQuantity);

  return (
    <header className="fixed w-full top-0 left-0 z-50">
      {/* Top Banner */}
      <div className="bg-gray-900 text-white text-sm py-2 text-center">
        Order Available Worldwide | Free Shipping on Orders Above ₹2999
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/70 backdrop-blur-[1px] items-center px-4 md:px-10 py-8">
        <div className="max-w-10xl mx-auto flex items-center justify-between">
          {/* Left Links */}
          <div className="hidden md:flex gap-8 text-gray-800 font-medium flex-1">
            <Link to="/">Home</Link>
            <Link to="/mens">Mens Collection</Link>
            <Link to="/womens">Womens Collection</Link>
            <Link to="/sarees">Sarees</Link>
            <Link to="/dresses">Kids</Link>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/">
              <img src={Logo} className="h-16 mb-2" alt="Kasavu Aalayam" />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-6 justify-end flex-1">
            <button onClick={() => setCartOpen(!cartOpen)} className="relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <Link to="/my-account">
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
        <div className="md:hidden bg-white px-6 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/mens" onClick={() => setIsOpen(false)}>Mens</Link>
          <Link to="/womens" onClick={() => setIsOpen(false)}>Womens</Link>
          <Link to="/sarees" onClick={() => setIsOpen(false)}>Sarees</Link>
          <Link to="/dresses" onClick={() => setIsOpen(false)}>Dresses</Link>
          <Link to="/accessories" onClick={() => setIsOpen(false)}>Accessories</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/my-account" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <User size={20} /> Account
          </Link>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button onClick={() => setCartOpen(false)}><X size={20} /></button>
          </div>
          {/* You can import and use your <Cart /> component here */}
        </div>
      )}
    </header>
  );
};

export default Navbar;
