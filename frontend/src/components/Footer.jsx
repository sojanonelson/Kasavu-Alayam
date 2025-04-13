import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-6 md:px-16 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About ATextile</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            ATextile is one of the finest textile stores offering premium quality fabrics and
            garments since 1998. We deliver style and comfort with a blend of tradition and
            modernity.
          </p>
        </div>

        {/* Branches */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Our Branches</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>📍 MG Road, Bangalore</li>
            <li>📍 T. Nagar, Chennai</li>
            <li>📍 Ernakulam, Kochi</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="text-sm text-gray-400 space-y-3">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-blue-400" />
              <span>support@atextile.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-green-400" />
              <span>+91 98765 43210</span>
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
        © {new Date().getFullYear()} ATextile. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
