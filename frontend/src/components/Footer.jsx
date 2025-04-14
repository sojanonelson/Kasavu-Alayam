import React from 'react';
import { Mail, Phone, MapPin, ShoppingBag, Heart, Clock, Truck } from 'lucide-react';
import logo from '../assets/white.png';

const Footer = () => {
  return (
    <footer className="bg-red-700 text-white py-10 px-6 md:px-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <ShoppingBag size={16} />
                  <span>Shop Now</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <MapPin size={16} />
                  <span>Our Stores</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline">
                  <Heart size={16} />
                  <span>Wishlist</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Middle Column - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 8129966333</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>contact@kasavuaalayam.com</span>
              </div>
              <div className="pt-4">
                <img src={logo} alt="Kasavu Aalayam" className="h-8" />
              </div>
            </div>
          </div>

          {/* Right Column - Newsletter (Focal Point) */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">
              Exclusive Offers
            </h3>
            <p className="mb-3 text-sm">Get 10% off your first order when you subscribe</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 w-full text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
              />
              <button className="bg-white text-red-700 px-4 py-2 hover:bg-gray-100 transition-colors font-medium">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/20 text-center text-xs">
          <p>© {new Date().getFullYear()} Kasavu Aalayam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;