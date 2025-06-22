import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Settings, ExternalLink, Code, Users, X, Settings2 } from 'lucide-react';
import devSound from '../assets/dev.mp3'; // Adjust the path as necessary

const DevelopmentBadge = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  const handleClick = () => {
    setIsPopupOpen(!isPopupOpen);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const badgeVariants = {
    initial: {
      scale: 1,
      rotate: 0
    },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.2
        }
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const popupVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: "70%",
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const iconVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <>
      {/* Audio Element */}
      <audio ref={audioRef} src={devSound} />

      {/* Backdrop */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Development Badge */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        variants={badgeVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-full flex items-center shadow-lg cursor-pointer border-2 border-gray-500 hover:border-gray-400 transition-colors duration-200">
          <motion.div>
            <Settings className="mr-2" size={18} />
          </motion.div>
          <span className="font-medium text-sm">On Development</span>
          <motion.div
            className="ml-2 w-2 h-2 bg-orange-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed bottom-20 left-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center mb-2">
                <motion.div>
                  <Settings className="mr-2 animate-spin" size={20} />
                </motion.div>
                <h3 className="font-bold text-lg">
                  <a
                    href="https://techhike.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    TechHike
                    <ExternalLink className="ml-1" size={16} />
                  </a>
                </h3>
              </div>

              <div className="flex items-center text-sm">
                <AlertCircle className="mr-1" size={14} />
                <span>Development Progress</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 w-80">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-blue-600">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full relative"
                    variants={progressVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-30"
                      animate={{
                        x: ["-100%", "100%"]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.8
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Contact Info */}
              <motion.div
                className="bg-gray-50 rounded-lg p-3 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center mb-2">
                  <Users className="mr-2 text-blue-600" size={16} />
                  <span className="font-medium text-gray-800">Contact TechHike Team</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get the latest updates on our development progress and be the first to know about new features!
                </p>
              </motion.div>

              {/* Action Button */}
              <motion.a
                href="https://techhike.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-center block hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Visit TechHike
                <ExternalLink className="ml-2" size={16} />
              </motion.a>

              {/* Footer */}
              <motion.div
                className="text-center mt-3 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                🚀 Building the future, one line at a time
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DevelopmentBadge;
