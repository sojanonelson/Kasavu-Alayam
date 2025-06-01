import React, { createContext, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastItem = ({ toast, onRemove }) => {
  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          bgColor: "bg-gradient-to-r from-emerald-500 to-green-600",
          borderColor: "border-emerald-400",
          iconColor: "text-emerald-100"
        };
      case "error":
        return {
          icon: AlertCircle,
          bgColor: "bg-gradient-to-r from-red-500 to-rose-600",
          borderColor: "border-red-400",
          iconColor: "text-red-100"
        };
      case "warning":
        return {
          icon: AlertCircle,
          bgColor: "bg-gradient-to-r from-amber-500 to-orange-600",
          borderColor: "border-amber-400",
          iconColor: "text-amber-100"
        };
      default:
        return {
          icon: Info,
          bgColor: "bg-gradient-to-r from-blue-500 to-indigo-600",
          borderColor: "border-blue-400",
          iconColor: "text-blue-100"
        };
    }
  };

  const config = getToastConfig(toast.type);
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 30
        }
      }}
      exit={{ 
        opacity: 0, 
        x: 300, 
        scale: 0.8,
        transition: {
          duration: 0.2
        }
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`
        relative overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm
        ${config.bgColor} border ${config.borderColor}
        min-w-[320px] max-w-[400px]
      `}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      
      <div className="relative p-4 flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <motion.p 
            className="text-white font-medium text-sm leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {toast.message}
          </motion.p>
        </div>
        
        <motion.button
          onClick={() => onRemove(toast.id)}
          className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-white/30"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ 
          duration: toast.duration / 1000,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Demo Component
const ToastDemo = () => {
  const { showToast } = useToast();

  const handleShowToast = (type) => {
    const messages = {
      success: "Operation completed successfully! 🎉",
      error: "Something went wrong. Please try again.",
      warning: "Please check your input and try again.",
      info: "Here's some important information for you."
    };
    
    showToast(messages[type], type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Enhanced Toast System
          </h1>
          <p className="text-slate-300 text-lg max-w-md mx-auto">
            Beautiful, animated toast notifications with Framer Motion
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <motion.button
            onClick={() => handleShowToast("success")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Success Toast
          </motion.button>
          
          <motion.button
            onClick={() => handleShowToast("error")}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Error Toast
          </motion.button>
          
          <motion.button
            onClick={() => handleShowToast("warning")}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Warning Toast
          </motion.button>
          
          <motion.button
            onClick={() => handleShowToast("info")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Info Toast
          </motion.button>
        </div>
      </div>
    </div>
  );
};

