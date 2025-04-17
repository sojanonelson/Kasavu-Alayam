import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Mail, Phone, MessageCircle, ChevronLeft, ChevronRight, Calendar, X, Clock, Send, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";

// Enhanced ContactOption with animation and active state
const ContactOption = memo(({ icon: Icon, title, value, href, onClick, active, setActive, id }) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        onClick(e);
      }
      if (setActive) {
        e.preventDefault();
        setActive(id);
      }
    }}
    className={`group flex items-center p-3 rounded-lg no-underline text-gray-800 gap-3 transition-all duration-300 border ${
      active === id 
        ? "bg-red-50 border-red-200 shadow-sm" 
        : "bg-gray-50 border-transparent hover:bg-white hover:translate-x-1 hover:border-gray-200 hover:shadow-sm"
    }`}
  >
    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${active === id ? "bg-red-100" : "bg-white"}`}>
      <Icon className={`w-4 h-4 ${active === id ? "text-red-600" : "text-gray-600"} transition-transform duration-300 group-hover:scale-110`} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-xs">{title}</div>
      <div className="text-xs text-gray-600 mt-1 truncate">{value}</div>
    </div>
  </a>
));

// Form input component
const FormInput = ({ icon: Icon, placeholder, type = "text", value, onChange, name }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon className="w-4 h-4" />
    </div>
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 transition-all"
    />
  </div>
);

// Business hours component
const BusinessHours = memo(() => {
  const hours = [
    { day: "Monday", time: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", time: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", time: "9:00 AM - 5:00 PM" },
    { day: "Thursday", time: "9:00 AM - 5:00 PM" },
    { day: "Friday", time: "9:00 AM - 5:00 PM" },
    { day: "Saturday", time: "10:00 AM - 3:00 PM" },
    { day: "Sunday", time: "Closed" }
  ];
  
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  const adjustedToday = today === 0 ? 6 : today - 1; // Adjust to match our array (Monday is 0)
  
  return (
    <div className="flex flex-col gap-2 mt-2">
      {hours.map((item, index) => (
        <div 
          key={item.day} 
          className={`flex justify-between items-center text-xs p-2 rounded ${
            index === adjustedToday ? "bg-red-50 text-red-800" : ""
          }`}
        >
          <span className="font-medium">{item.day}</span>
          <span className={index === adjustedToday ? "font-semibold" : "text-gray-500"}>
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
});

// Social Media Icons
const SocialMediaIcons = () => (
  <div className="flex justify-center gap-4 mt-3">
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
      <Linkedin className="w-4 h-4" />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
      <Instagram className="w-4 h-4" />
    </a>
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600 transition-colors">
      <Facebook className="w-4 h-4" />
    </a>
  </div>
);

// Enhanced side contact navbar
const SideContactNavbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const navbarRef = useRef(null);

  // Contact information
  const contactInfo = {
    email: { value: "kasavuaalayam@gmail.com", href: "mailto:kasavuaalayam@gmail.com" },
    whatsapp: { value: "+91 8075920705", href: "https://wa.me/918075920705" },
    phone: { value: "+91 8075920705", href: "tel:+918075920705" },
    location: { value: "123 Fashion Street, Kerala", href: "https://maps.google.com/?q=Kerala" }
  };

  // Simulate visitor count
  useEffect(() => {
    const baseCount = 2500;
    const randomIncrement = Math.floor(Math.random() * 100);
    setVisitorCount(baseCount + randomIncrement);
    
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 60000); // Increment by 1 every minute
    
    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Memoized resize handler to prevent unnecessary rerenders
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Toggle navbar expansion with animation
  const toggleNavbar = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Responsive calculations
  const isMobile = windowWidth < 640;
  const isPanelExpanded = activeTab === "hours" || activeTab === "message";
  const panelWidth = isMobile 
    ? (isPanelExpanded ? "w-64" : "w-40") 
    : (isPanelExpanded ? "w-72" : "w-52");

  return (
    <div
      ref={navbarRef}
      className="fixed top-1/2 -translate-y-1/2 z-50 flex transition-all duration-300 ease-in-out drop-shadow-xl"
      style={{ right: isExpanded ? "0" : isMobile ? "-160px" : (isPanelExpanded ? "-288px" : "-208px") }}
    >
      {/* Toggle Button */}
      <div
        className="relative bg-gradient-to-b from-red-500 to-red-600 text-white p-2 rounded-l-lg cursor-pointer flex flex-col items-center justify-center gap-4 shadow-lg transition-all duration-300 hover:from-red-600 hover:to-red-700"
        onClick={toggleNavbar}
      >
        <div className="flex flex-col items-center justify-center">
          {isExpanded ? 
            <ChevronRight className="w-5 h-5 transition-all duration-300" /> : 
            <ChevronLeft className="w-5 h-5 transition-all duration-300" />
          }
          
          <div className="w-full h-px bg-red-400 my-2 opacity-70"></div>
          
          <span className="text-xs font-semibold tracking-widest whitespace-nowrap rotate-180" 
                style={{ writingMode: 'vertical-rl' }}>
            Kasavu Aalayam
          </span>
        </div>

        {/* Pulse Notification */}
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>
        
        {/* Live visitor count */}
        <div className="absolute -bottom-2 -left-2 bg-white text-red-600 text-xs font-semibold px-2 py-1 rounded-full shadow-md border border-red-200 flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          {visitorCount}
        </div>
      </div>

      {/* Contact Options Panel */}
      <div className={`bg-white p-4 rounded-r-lg flex flex-col gap-3 transition-all duration-300 ${panelWidth}`}>
        {/* Header with tabs */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-center text-gray-800 text-sm font-bold">
            {activeTab === "contact" && "Contact Us"}
            {activeTab === "hours" && "Business Hours"}
            {activeTab === "message" && "Send Message"}
          </h3>
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab("contact")} 
              className={`p-1 rounded-md transition-colors ${activeTab === "contact" ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            >
              <Phone className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setActiveTab("hours")} 
              className={`p-1 rounded-md transition-colors ${activeTab === "hours" ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            >
              <Clock className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setActiveTab("message")} 
              className={`p-1 rounded-md transition-colors ${activeTab === "message" ? "bg-red-100 text-red-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            >
              <MessageCircle className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Contact tab */}
        {activeTab === "contact" && (
          <>
            <ContactOption 
              icon={Mail} 
              title="Email" 
              value={contactInfo.email.value} 
              href={contactInfo.email.href}
              id="email"
            />
            
            <ContactOption 
              icon={MessageCircle} 
              title="WhatsApp" 
              value={contactInfo.whatsapp.value} 
              href={contactInfo.whatsapp.href}
              onClick={(e) => {
                window.open(contactInfo.whatsapp.href, '_blank');
                e.preventDefault();
              }}
              id="whatsapp"
            />
            
            <ContactOption 
              icon={Phone} 
              title="Call Us" 
              value={contactInfo.phone.value} 
              href={contactInfo.phone.href}
              id="phone"
            />
            
            <ContactOption 
              icon={MapPin} 
              title="Visit Us" 
              value={contactInfo.location.value} 
              href={contactInfo.location.href}
              id="location"
            />

            {!isMobile && (
              <div className="mt-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 p-3 text-white text-center">
                <p className="text-xs mb-2 font-medium">Schedule a Visit</p>
                <button
                  onClick={() => setActiveTab("message")}
                  className="inline-flex items-center justify-center gap-1 bg-white text-red-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-50 transition-colors w-full"
                >
                  <Calendar className="w-3 h-3 text-red-600" />
                  Book Appointment
                </button>
              </div>
            )}
            
            <SocialMediaIcons />
          </>
        )}
        
        {/* Hours tab */}
        {activeTab === "hours" && (
          <>
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs mb-2">
              <div className="font-semibold mb-1">Business Hours</div>
              <div>Our store is open for walk-ins and appointments according to the schedule below.</div>
            </div>
            <BusinessHours />
            <button
              onClick={() => setActiveTab("contact")}
              className="mt-3 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Back to Contact
            </button>
          </>
        )}
        
        {/* Message tab */}
        {activeTab === "message" && (
          <>
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Message Sent!</h4>
                <p className="text-xs text-gray-600 mb-4">Thank you for reaching out. We'll get back to you soon.</p>
                <button
                  onClick={() => setActiveTab("contact")}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back to Contact
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <FormInput 
                  icon={Mail} 
                  placeholder="Your Email" 
                  type="email" 
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <FormInput 
                  icon={Phone} 
                  placeholder="Your Name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <div className="relative">
                  <textarea
                    placeholder="Your Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs min-h-24 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-300 transition-all"
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("contact")}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-2 rounded-lg text-xs font-medium transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-2 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Kasavu Aalayam</h1>
        <p className="text-gray-700 mb-4">
          Welcome to our website. Browse through our collection of premium traditional clothing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Latest Collection</h3>
            <p className="text-sm text-gray-600">Explore our new arrivals featuring traditional designs with modern elements.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Custom Orders</h3>
            <p className="text-sm text-gray-600">Get in touch with us for personalized designs and custom measurements.</p>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <p className="text-sm text-red-800">
            <strong>Note:</strong> Check out our contact options on the right side of the screen to reach us or schedule an appointment!
          </p>
        </div>
      </div>
      
      {/* The Side Contact Navbar component */}
      <SideContactNavbar />
    </div>
  );
}