import React, { useState, useEffect } from 'react';

const EcommerceLoading = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    "Initializing...",
    "Loading products...",
    "Setting up store...",
    "Almost ready...",
    "Welcome!"
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
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-lg font-medium">Redirecting to store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v40c-11.046 0-20-8.954-20-20zM0 20c0 11.046 8.954 20 20 20V0C8.954 0 0 8.954 0 20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Main loading container */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        
        {/* Animated logo/icon */}
        <div className="mb-12">
          <div className="relative inline-block">
            {/* Main loading circle */}
            <div className="w-24 h-24 mx-auto relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
              
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-orbit">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-black rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `
                      translate(-50%, -50%) 
                      rotate(${i * 90}deg) 
                      translateX(50px) 
                      translateY(-50%)
                    `,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold custom-font text-black mb-2 tracking-wide">
            Kasavu Aalayam
          </h1>
          <p className="text-gray-600 text-sm font-medium tracking-wider uppercase">
            Premium Handlooms
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full transition-all duration-300 ease-out relative"
              style={{width: `${loadingProgress}%`}}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Progress percentage */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-black">{loadingProgress}%</span>
        </div>

        {/* Loading phase text */}
        <div className="mb-8">
          <p className="text-gray-700 font-medium">
            {phases[currentPhase]}
          </p>
        </div>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-black rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Minimal corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-black/20"></div>
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-black/20"></div>
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-black/20"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-black/20"></div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-orbit {
          animation: orbit 8s linear infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EcommerceLoading;