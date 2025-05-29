import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

// Individual Contact Circle Component
const ContactCircle = memo(({ icon: Icon, title, onClick, bgColor, hoverColor, iconColor }) => (
  <div
    onClick={onClick}
    className={`group relative w-8 h-8 ${bgColor} ${hoverColor} rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg`}
    title={title}
  >
    <Icon className={`w-4 h-4 ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
    
    {/* Tooltip */}
    <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {title}
      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
    </div>
    
    {/* Ripple effect */}
    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 rounded-full bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
    </div>
  </div>
));

// Enhanced side contact navbar with circular design
const SideContactNavbar = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [visitorCount, setVisitorCount] = useState(0);

  // Contact information
  const contactInfo = {
    email: { value: "kasavuaalayam@gmail.com", href: "mailto:kasavuaalayam@gmail.com" },
    whatsapp: { value: "+91 8075920705", href: "https://wa.me/918075920705" },
    phone: { value: "+91 8075920705", href: "tel:+918075920705" },
    location: { value: "123 Fashion Street, Kerala", href: "https://maps.google.com/?q=Kerala" }
  };

  // Contact actions
  const handleWhatsApp = () => {
    window.open(contactInfo.whatsapp.href, '_blank');
  };

  const handleEmail = () => {
    window.location.href = contactInfo.email.href;
  };

  const handleCall = () => {
    window.location.href = contactInfo.phone.href;
  };

  const handleLocation = () => {
    window.open(contactInfo.location.href, '_blank');
  };

  // Simulate visitor count
  useEffect(() => {
    const baseCount = 2500;
    const randomIncrement = Math.floor(Math.random() * 100);
    setVisitorCount(baseCount + randomIncrement);
    
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Memoized resize handler
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Responsive calculations
  const isMobile = windowWidth < 640;

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-5 z-50">
      {/* Contact Circles */}
      <div className="flex flex-col gap-2 items-center">
        {/* WhatsApp */}
        <ContactCircle
          icon={MessageCircle}
          title="WhatsApp Chat"
          onClick={handleWhatsApp}
          bgColor="bg-green-500"
          hoverColor="hover:bg-green-600"
          iconColor="text-white"
        />

        {/* Email */}
        <ContactCircle
          icon={Mail}
          title="Send Email"
          onClick={handleEmail}
          bgColor="bg-blue-500"
          hoverColor="hover:bg-blue-600"
          iconColor="text-white"
        />

        {/* Phone */}
        <ContactCircle
          icon={Phone}
          title="Call Us"
          onClick={handleCall}
          bgColor="bg-orange-500"
          hoverColor="hover:bg-orange-600"
          iconColor="text-white"
        />

        {/* Location */}
        <ContactCircle
          icon={MapPin}
          title="Find Location"
          onClick={handleLocation}
          bgColor="bg-purple-500"
          hoverColor="hover:bg-purple-600"
          iconColor="text-white"
        />
      </div>
    </div>
  );
};

export default function Demo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Demo content */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Kasavu Aalayam</h1>
          <p className="text-gray-600">Premium Traditional Clothing Collection</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Latest Collection</h3>
            <p className="text-sm text-red-700">Explore our new arrivals featuring traditional designs with modern elements.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Custom Orders</h3>
            <p className="text-sm text-blue-700">Get in touch with us for personalized designs and custom measurements.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Expert Craftsmanship</h3>
            <p className="text-sm text-green-700">Each piece is carefully crafted by skilled artisans with attention to detail.</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Ready to Connect?</h2>
          <p className="text-red-100 mb-4">Use our floating contact panel on the right to reach us instantly!</p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">📱 WhatsApp</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">📧 Email</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">📞 Call</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">📍 Visit</span>
          </div>
        </div>
      </div>
      
      {/* The redesigned Side Contact Navbar */}
      <SideContactNavbar />
    </div>
  );
}