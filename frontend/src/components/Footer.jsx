import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Clock, 
  Truck, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Shield,
  Award,
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import logo from '../assets/white.png';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative z-10">
        {/* Top Section - Features Bar */}
        <div className="bg-red-900/50 backdrop-blur-sm py-6 px-6 md:px-8 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Truck size={20} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Free Shipping</h4>
                  <p className="text-xs text-white/80">On orders above ₹2000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Shield size={20} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Secure Payment</h4>
                  <p className="text-xs text-white/80">100% protected checkout</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Award size={20} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Quality Assured</h4>
                  <p className="text-xs text-white/80">Premium traditional wear</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="bg-white/10 p-2 rounded-lg">
                  <Users size={20} className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Expert Support</h4>
                  <p className="text-xs text-white/80">24/7 customer service</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 px-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Main Grid - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              
              {/* Company Info Column */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <img src={logo} alt="Kasavu Aalayam" className="h-12 mb-4" />
                  <p className="text-sm text-white/90 leading-relaxed mb-4">
                    Celebrating the rich heritage of traditional Indian wear with contemporary elegance. 
                    Your destination for premium silk sarees and ethnic collections.
                  </p>
                  
                  {/* Social Media Links */}
                  <div className="flex gap-3">
                    <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                      <Facebook size={18} />
                    </a>
                    <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all duration-300 hover:scale-110">
                      <Instagram size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links Column */}
              <div>
                <h3 className="text-lg font-semibold mb-6 relative">
                  <span className="border-b-2 border-amber-400 pb-1">Quick Links</span>
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: ShoppingBag, text: 'Shop Collections', href: '/collections' },
                    { icon: MapPin, text: 'Store Locator', href: '/stores' }
                  ].map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="flex items-center gap-3 text-sm text-white/90 hover:text-white hover:translate-x-1 transition-all duration-300 group">
                        <item.icon size={16} className="text-amber-300 group-hover:scale-110 transition-transform" />
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Service Column */}
              <div>
                <h3 className="text-lg font-semibold mb-6 relative">
                  <span className="border-b-2 border-amber-400 pb-1">Customer Care</span>
                </h3>
                <ul className="space-y-3">
                  {[
                    { text: 'Contact Us', href: '/contact' },
                    { text: 'Return Policy', href: '/returns' },
                    { text: 'Privacy Policy', href: '/privacy' },
                    { text: 'Terms of Service', href: '/terms' }
                  ].map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="text-sm text-white/90 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter & Contact Column */}
              <div>
                <h3 className="text-lg font-semibold mb-6 relative">
                  <span className="border-b-2 border-amber-400 pb-1">Stay Connected</span>
                </h3>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-amber-300" />
                    <span>+91 651852565845</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-amber-300" />
                    <span>contact@kasavuaalayam.com</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={16} className="text-amber-300 mt-0.5" />
                    <span>Idukki, Kerala, India</span>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <h4 className="font-semibold mb-2 text-amber-300">Exclusive Offers</h4>
                  <p className="text-xs text-white/80 mb-3">
                    Subscribe for 10% off your first order & latest updates
                  </p>
                  
                  {!isSubscribed ? (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-amber-400 focus:bg-white/15 transition-all"
                        required
                      />
                      <button 
                        type="submit"
                        className="bg-amber-400 hover:bg-amber-500 text-red-900 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center gap-1 font-medium"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 text-green-300 text-sm">
                      <CheckCircle size={16} />
                      <span>Successfully subscribed!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-white/80">
                  © {new Date().getFullYear()} Kasavu Aalayam. All rights reserved.
                </div>
                
             <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-6 text-xs text-white/70 px-4 py-2">
  <span>
    Crafted By: <a href="https://techhike.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TechHike</a>
  </span>
  <div className="flex gap-4">
    <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
    <a href="/terms" className="hover:text-white transition-colors">Terms</a>
    <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;