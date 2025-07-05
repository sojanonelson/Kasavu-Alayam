import React, { useState, useEffect, useCallback, memo } from "react";
import { Mail, Phone, MessageSquare, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ContactCircle = memo(({ icon: Icon, title, onClick, bgColor, hoverColor, iconColor }) => (
  <div
    onClick={onClick}
    className={`group relative w-8 h-8 ${bgColor} ${hoverColor} rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg`}
    title={title}
  >
    <Icon className={`w-4 h-4 ${iconColor} transition-transform duration-300 group-hover:scale-110`} />
    <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      {title}
      <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
    </div>
    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 rounded-full bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-150"></div>
    </div>
  </div>
));
const SideContactNavbar = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [visitorCount, setVisitorCount] = useState(0);
  const contactInfo = {
    email: { value: "kasavuaalayam@gmail.com", href: "mailto:kasavuaalayam@gmail.com" },
    whatsapp: { value: "+91 8075920705", href: "https://wa.me/918075920705" },
    phone: { value: "+91 8075920705", href: "tel:+918075920705" },
    location: { value: "123 Fashion Street, Kerala", href: "https://maps.google.com/?q=Kerala" }
  };
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
  useEffect(() => {
    const baseCount = 2500;
    const randomIncrement = Math.floor(Math.random() * 100);
    setVisitorCount(baseCount + randomIncrement);

    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
  const isMobile = windowWidth < 640;

  return (
    <div className="fixed bottom-12 right-0 z-50 mb-4 mr-4 lg:block">
      <div className="flex flex-col gap-2 items-center">
        <ContactCircle
          icon={MessageSquare}
          title="WhatsApp Chat"
          onClick={handleWhatsApp}
          bgColor="bg-green-500"
          hoverColor="hover:bg-green-600"
          iconColor="text-white"
        />
        <ContactCircle
          icon={Mail}
          title="Send Email"
          onClick={handleEmail}
          bgColor="bg-blue-600"
          hoverColor="hover:bg-blue-700"
          iconColor="text-white"
        />
        <ContactCircle
          icon={Phone}
          title="Call Us"
          onClick={handleCall}
          bgColor="bg-green-600"
          hoverColor="hover:bg-green-700"
          iconColor="text-white"
        />
        <ContactCircle
          icon={Navigation}
          title="Find Location"
          onClick={handleLocation}
          bgColor="bg-red-500"
          hoverColor="hover:bg-red-600"
          iconColor="text-white"
        />
      </div>
    </div>
  );
};

export default function Demo() {
  const navigate = useNavigate();
  const handloomImage = "https://img.etimg.com/thumb/width-1200,height-1200,imgsize-961164,resizemode-75,msid-68716260/magazines/panache/how-handloom-sarees-are-weaving-a-storm-in-bengaluru.jpg";
  const handleExploreCollection = () => {
    navigate('/collections/womens'); 
  };

  return (
    <div className="h-[70vh] relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={handloomImage}
          alt="Premium Silk Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-20 pb-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
            <div className="mx-4 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-24"></div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-wide">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              Authentic
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent inline-block transform hover:scale-105 transition-transform duration-300 delay-100">
              Handloom
            </span>
            <br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-200">
              Treasures
            </span>
          </h1>
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-base md:text-lg lg:text-xl text-gray-200 font-light leading-relaxed">
              <span className="text-amber-300 font-medium">Discover</span> the finest collection of traditional handwoven textiles,
              <br className="hidden md:block" />
              crafted with <span className="text-amber-300 font-medium">love</span> and <span className="text-amber-300 font-medium">heritage</span>
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleExploreCollection}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-transparent backdrop-blur-md rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-white/30 hover:border-white/50"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <img
                  src={handloomImage}
                  alt=""
                  className="w-full h-full object-cover opacity-20 scale-150 blur-sm group-hover:opacity-30 group-hover:blur-none transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/60 via-orange-400/50 to-yellow-500/60 mix-blend-overlay"></div>
              </div>
              <div className="absolute inset-0 opacity-30 rounded-full">
                <div className="absolute -top-2 -left-2 w-12 h-12 bg-amber-400/40 rounded-full filter blur-xl animate-pulse"></div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-300/30 rounded-full filter blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-yellow-500/40 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-0 right-0 w-6 h-6 bg-amber-300/30 rounded-full filter blur-md animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              <div className="absolute inset-0 opacity-20 rounded-full">
                <div className="absolute top-1 left-1 w-10 h-10 bg-gradient-to-br from-red-400/50 to-orange-500/50 rounded-full filter blur-lg animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-tl from-yellow-400/40 to-amber-500/40 rounded-full filter blur-md animate-pulse" style={{animationDelay: '1.2s'}}></div>
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-bl from-orange-300/60 to-red-400/30 rounded-full filter blur-sm animate-pulse" style={{animationDelay: '2.1s'}}></div>
              </div>

              <span className="relative z-10 flex items-center gap-2 font-medium">
                Explore Collection
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-full"></div>
            </button>
          </div>
          <div className="mt-8 flex justify-center items-center space-x-4 text-amber-300">
            <div className="w-8 h-px bg-amber-300"></div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-amber-300 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-amber-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-1 h-1 bg-amber-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <div className="w-8 h-px bg-amber-300"></div>
          </div>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-200 font-medium">Est. Traditional Heritage</span>
          </div>
        </div>
      </div>
      <SideContactNavbar />
    </div>
  );
}
