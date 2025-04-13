import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 py-12 px-6 md:px-16 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div className="transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4 text-white">About ATextile</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            ATextile is one of the finest textile stores offering premium quality fabrics and
            garments since 1998. We deliver style and comfort with a blend of tradition and
            modernity.
          </p>
        </div>

        {/* Branches */}
        <div className="transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4 text-white">Our Branches</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <span>MG Road, Bangalore</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <span>T. Nagar, Chennai</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <span>Ernakulam, Kochi</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <a href="mailto:support@atextile.com" className="hover:text-blue-300">
                support@atextile.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-green-400" />
              <a href="tel:+919876543210" className="hover:text-green-300">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} className="text-red-400" />
              <span>Head Office: MG Road, Bangalore, India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} ATextile. All rights reserved.
        </p>
        <p className="mt-2">
          <a href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</a> |
          <a href="/terms-of-service" className="hover:text-gray-300"> Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
