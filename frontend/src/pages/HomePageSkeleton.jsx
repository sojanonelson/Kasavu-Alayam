import React, { useState, useEffect } from 'react';

const EcommerceLoading = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    "Weaving traditions...",
    "Threading heritage...",
    "Crafting excellence...",
    "Embracing culture...",
    "Welcome to Kasavu!"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 2;
        
        // Update phase based on progress
        const phaseIndex = Math.floor(newProgress / 20);
        setCurrentPhase(Math.min(phaseIndex, phases.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Entering the world of handlooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center overflow-hidden">
      {/* Handloom pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M30 30L0 0h30v30zM60 60L30 30v30h30zM0 60L30 30H0v30zM60 0L30 30V0h30z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating handloom threads animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-thread"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            <div 
              className="w-1 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full opacity-30"
              style={{
                height: `${20 + Math.random() * 40}px`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Main loading container */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        
        {/* Animated handloom wheel */}
        <div className="mb-12">
          <div className="relative inline-block">
            {/* Main spinning wheel (like a traditional spinning wheel) */}
            <div className="w-32 h-32 mx-auto relative">
              {/* Outer ring with handloom pattern */}
              <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
              <div className="absolute inset-2 border-2 border-gray-400 rounded-full"></div>
              
              {/* Spinning spokes */}
              <div className="absolute inset-0 animate-spin-slow">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-16 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      transformOrigin: 'center bottom',
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg)`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Center hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full animate-pulse shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-400 to-gray-600 opacity-50"></div>
                </div>
              </div>
            </div>
            
            {/* Orbiting threads */}
            <div className="absolute inset-0 animate-orbit-slow">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full shadow-md animate-pulse"
                  style={{
                    background: `linear-gradient(45deg, ${i % 2 === 0 ? '#6b7280' : '#4b5563'}, ${i % 2 === 0 ? '#4b5563' : '#374151'})`,
                    left: '50%',
                    top: '50%',
                    transform: `
                      translate(-50%, -50%) 
                      rotate(${i * 60}deg) 
                      translateX(70px) 
                      translateY(-50%)
                    `,
                    animationDelay: `${i * 0.3}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand name with traditional Kerala styling */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-black to-gray-800 mb-2 tracking-wide drop-shadow-sm">
            കാശവ് ആലയം
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-wide">
            Kasavu Aalayam
          </h2>
          <p className="text-gray-700 text-sm font-medium tracking-wider uppercase">
            Authentic Kerala Handlooms
          </p>
        </div>

        {/* Progress bar with monochrome colors */}
        <div className="mb-6">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-gray-600 via-gray-800 to-gray-700 rounded-full transition-all duration-300 ease-out relative"
              style={{width: `${loadingProgress}%`}}
            >
              {/* Silver shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900 drop-shadow-sm">{loadingProgress}%</span>
        </div>

        {/* Loading phase text */}
        <div className="mb-8">
          <p className="text-gray-800 font-medium text-lg">
            {phases[currentPhase]}
          </p>
        </div>

        {/* Loading dots animation with grayscale colors */}
        <div className="flex justify-center space-x-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-bounce shadow-md"
              style={{
                background: `linear-gradient(45deg, #6b7280, #4b5563)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Decorative traditional pattern elements */}
      <div className="absolute top-10 left-10 w-8 h-8 border-2 border-gray-400/30 rotate-45 animate-pulse"></div>
      <div className="absolute top-20 right-16 w-6 h-6 border-2 border-gray-500/30 rotate-12 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-16 left-20 w-4 h-4 border-2 border-gray-600/30 rotate-45 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-10 right-10 w-8 h-8 border-2 border-gray-500/30 rotate-12 animate-pulse" style={{animationDelay: '1.5s'}}></div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes orbit-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float-thread {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(-20px) translateX(10px) rotate(5deg); 
            opacity: 0.6; 
          }
        }
        
        .animate-orbit-slow {
          animation: orbit-slow 12s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-float-thread {
          animation: float-thread linear infinite;
        }
      `}</style>
    </div>
  );
};

export default EcommerceLoading;  