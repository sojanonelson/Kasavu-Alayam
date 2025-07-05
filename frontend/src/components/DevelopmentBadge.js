import React, { useState, useRef, useEffect } from "react";
import { AlertCircle, Settings, X, Trophy, RocketIcon } from "lucide-react";

const DevelopmentBadge = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);
  const [latestCommit, setLatestCommit] = useState(null);
  const [progress, setProgress] = useState(100);
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [duration, setDuration] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState([]);

  const handleClick = () => {
    setIsPopupOpen(!isPopupOpen);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

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
    if (progress === 100 && !hasShownCelebration) {
      setShowCelebration(true);
      setHasShownCelebration(true);
      setConfettiParticles(generateConfetti());

      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [progress, hasShownCelebration]);

  useEffect(() => {
    fetch(`https://api.github.com/repos/sojanonelson/Kasavu-Alayam/commits?sha=main&per_page=1`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLatestCommit(data[0]);
        }
      })
      .catch(console.error);

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
    <div key={particle.id} style={particleStyle(particle, index)} className="animate-pulse" />
  );

  return (
    <>
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

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleClose} />
      )}

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
        <div className={`bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500 text-white px-4 py-3 rounded-full flex items-center shadow-lg cursor-pointer border-2 hover:border-gray-400 transition-colors duration-200`}>
          <div>
            <Settings className="mr-2 animate-spin" size={18} />
          </div>
          <span className="font-medium text-sm">
            {progress === 100 ? 'Development Complete!' : 'On Development'}
          </span>
          <div className={`ml-2 w-2 h-2 'bg-yellow-200 animate-pulse rounded-full`} />
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed bottom-20 left-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" style={{ animation: 'slideInUp 0.3s ease-out' }}>
          <div className={` bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 relative`}>
            <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors">
              <X size={18} />
            </button>
            <div className="flex items-center mb-2">
              <div>
                 <Settings className="mr-2 animate-spin" size={20} />
              </div>
              <h3 className="font-bold text-lg">
                <a href="https://techhike.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                  TechHike
                  <img src="https://techhike.vercel.app/favicon.ico" alt="TechHike Favicon" className="ml-1" style={{ width: '16px', height: '16px' }} />
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
          <div className="p-4 w-80">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className={`text-sm font-bold text-blue-600 `}>
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className={` bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full relative transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
                </div>
              </div>
              <div className="text-white bg-gray-800 rounded-md p-3 my-2 flex justify-center items-center cursor-pointer gap-2">
                <RocketIcon />
                <p className="poppins-regular">Ready to deploy</p>
              </div>
              {progress === 100 && (
                <div className="mt-2 text-center text-sm font-medium text-gray-600">
                  <p>
                    After deployment! Your project will live at{" "}
                    <a href="https://kasavuaalayam.com" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">
                      kasavuaalayam.com
                    </a>
                  </p>
                </div>
              )}
              {latestCommit && (
                <div className="mt-4 p-2 bg-gray-100 rounded-lg text-sm text-gray-800">
                  <strong>Latest commit:</strong>
                  <br />
                  {latestCommit.commit.message.split("\n")[0]}
                  <br />
                  <code className="text-xs font-mono">{latestCommit.sha.substring(0, 7)}</code>
                  <br />
                  <a href={latestCommit.html_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                    View on GitHub
                  </a>
                </div>
              )}
            </div>

            <div className="mt-3 p-2 bg-gray-100 rounded-lg text-sm text-gray-800">
              <strong>Backend Status:</strong> <span>{backendStatus}</span><br />
              <strong>Response:</strong> <span>{duration}ms</span>
            </div>

           
            <div className="text-center mt-3 text-xs text-gray-500">
              🚀 Building the future, one line at a time
            </div>
          </div>
        </div>
      )}

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
