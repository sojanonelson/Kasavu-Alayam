import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  Settings,
  ExternalLink,
  Code,
  Users,
  X,
  Settings2,
  Trophy,
  Star,
} from "lucide-react";

const DevelopmentBadge = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);
  const [latestCommit, setLatestCommit] = useState(null);
  const [progress, setProgress] = useState(92); // Set to 100 for demo
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [duration, setDuration] = useState('');
  const [uptimeData, setUptimeData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);

  // Confetti particles array
  const [confettiParticles, setConfettiParticles] = useState([]);

  const handleClick = () => {
    setIsPopupOpen(!isPopupOpen);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  // Generate confetti particles
  const generateConfetti = () => {
    const particles = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: Math.random() * 3 + 2,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
      });
    }
    return particles;
  };

  useEffect(() => {
    // Check if progress reaches 100% and celebration hasn't been shown
    if (progress === 100 && !hasShownCelebration) {
      setShowCelebration(true);
      setHasShownCelebration(true);
      setConfettiParticles(generateConfetti());
      
      // Hide celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [progress, hasShownCelebration]);

  useEffect(() => {
    // Fetch latest GitHub commit
    fetch(
      `https://api.github.com/repos/sojanonelson/Kasavu-Alayam/commits?sha=main&per_page=1`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLatestCommit(data[0]);
        }
      })
      .catch(console.error);

    // Check backend status
    const start = performance.now();

    fetch("https://kasavu-alayam.onrender.com/")
      .then((res) => res.text())
      .then((text) => {
        const duration = Math.round(performance.now() - start);
        setDuration(duration);
        if (text.includes("✅ Server running")) {
          setBackendStatus("🟢 Online");
        } else {
          setBackendStatus("🟠 Unknown");
        }
      })
      .catch(() => {
        setBackendStatus("🔴 Offline");
      });
  }, []);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // CSS animations for particles
  const particleStyle = (particle, index) => ({
    position: 'absolute',
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    backgroundColor: particle.color,
    borderRadius: particle.shape === 'circle' ? '50%' : '2px',
    animation: `confettiFall 3s ease-in forwards`,
    animationDelay: `${index * 0.02}s`,
    transform: `rotate(${particle.rotation}deg)`,
  });

  const ConfettiParticle = ({ particle, index }) => (
    <div
      key={particle.id}
      style={particleStyle(particle, index)}
      className="animate-pulse"
    />
  );

  return (
    <>
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-30px);
          }
          60% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Confetti Particles */}
          {confettiParticles.map((particle, index) => (
            <ConfettiParticle key={particle.id} particle={particle} index={index} />
          ))}

          {/* Celebration Message */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-blue-950 text-white px-8 py-6 rounded-3xl shadow-2xl text-center max-w-md mx-4 ">
              <div className="flex justify-center mb-4">
                <Trophy size={48} className="text-yellow-300 " />
              </div>
              
              <h2 className="text-3xl font-bold mb-2 ">
                🎉 DEVELOPMENT COMPLETE! 🎉
              </h2>
              
              <p className="text-lg mb-4">
                Amazing work! You've reached 100% completion!
              </p>
              
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className="text-yellow-300 fill-current animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Firework Bursts */}
          <div className="absolute top-20 left-20 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-32 w-4 h-4 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-40 left-1/4 w-4 h-4 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-20 w-4 h-4 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Backdrop */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={handleClose}
        />
      )}

      {/* Development Badge */}
      <div
        className="fixed bottom-4 left-4 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div className={`${progress === 100 ? 'bg-gradient-to-r from-green-600 to-emerald-700 border-green-500' : 'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500'} text-white px-4 py-3 rounded-full flex items-center shadow-lg cursor-pointer border-2 hover:border-gray-400 transition-colors duration-200`}>
          <div>
            {progress === 100 ? (
              <Trophy className="mr-2" size={18} />
            ) : (
              <Settings className="mr-2 animate-spin" size={18} />
            )}
          </div>
          <span className="font-medium text-sm">
            {progress === 100 ? 'Development Complete!' : 'On Development'}
          </span>
          <div
            className={`ml-2 w-2 h-2 ${progress === 100 ? 'bg-yellow-200 animate-pulse' : 'bg-green-400'} rounded-full `}
          />
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div
          className="fixed bottom-20 left-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className={`${progress === 100 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white p-4 relative`}>
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center mb-2">
              <div>
                {progress === 100 ? (
                  <Trophy className="mr-2" size={20} />
                ) : (
                  <Settings className="mr-2 animate-spin" size={20} />
                )}
              </div>
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
              {progress === 100 ? (
                <>
                  <Trophy className="mr-1" size={14} />
                  <span>Development Complete!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1" size={14} />
                  <span>Development Progress</span>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 w-80">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className={`text-sm font-bold ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`${progress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'} h-full rounded-full relative transition-all duration-1000 ease-out`}
                  style={{ width: `${progress}%` }}
                >
                  <div
                    className="absolute inset-0 bg-white opacity-30 animate-pulse"
                  />
                </div>
              </div>

              {progress === 100 && (
                <div className="mt-2 text-center text-sm font-medium text-green-600 ">
                  🎉 Congratulations! Project Complete! 🎉
                </div>
              )}

              {latestCommit && (
                <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm text-gray-800">
                  <strong>Latest commit:</strong>
                  <br />
                  {latestCommit.commit.message.split("\n")[0]}
                  <br />
                  <code className="text-xs font-mono">
                    {latestCommit.sha.substring(0, 7)}
                  </code>
                  <br />
                  <a
                    href={latestCommit.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    View on GitHub
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-3 p-2 bg-gray-100 rounded-lg text-sm text-gray-800">
              <strong>Backend Status:</strong> <span>{backendStatus} </span><br />
              <strong>Response:</strong> <span>{duration}ms</span>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center mb-2">
                <Users className="mr-2 text-blue-600" size={16} />
                <span className="font-medium text-gray-800">
                  Contact TechHike Team
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {progress === 100 
                  ? "The project is now complete! Check out the final version and share your feedback."
                  : "Get the latest updates on our development progress and be the first to know about new features!"
                }
              </p>
            </div>

            {/* Action Button */}
            <a
              href="https://techhike.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${progress === 100 ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white py-2 px-4 rounded-lg font-medium text-center block transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95`}
            >
              {progress === 100 ? 'View Complete Project' : 'Visit TechHike'}
              <ExternalLink className="ml-2" size={16} />
            </a>

            {/* Footer */}
            <div className="text-center mt-3 text-xs text-gray-500">
              {progress === 100 
                ? '🏆 Mission accomplished! 🚀'
                : '🚀 Building the future, one line at a time'
              }
            </div>
          </div>
        </div>
      )}

      {/* Additional CSS for slide animation */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default DevelopmentBadge;