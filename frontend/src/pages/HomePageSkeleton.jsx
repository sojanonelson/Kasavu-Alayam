import React from 'react';

const HomePageSkeleton = () => {
  return (
    <div className="font-sans">
      {/* Navbar Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 md:px-20 py-4 flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-8">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="relative h-screen bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end items-center pb-32 text-center px-6">
          <div className="max-w-4xl w-full space-y-6">
            <div className="h-12 md:h-16 w-3/4 mx-auto bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 md:h-8 w-1/2 mx-auto bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="h-12 w-40 mx-auto bg-gray-300 rounded-lg animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
        
        {/* Pagination dots skeleton */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="text-center mb-12">
          <div className="h-10 w-64 mx-auto bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 w-96 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`h-[28rem] bg-gray-200 shadow-lg overflow-hidden animate-pulse ${
              index === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : 
              index === 2 ? 'rounded-tr-2xl rounded-br-2xl' : ''
            }`} style={{animationDelay: `${index * 0.1}s`}}>
              <div className="h-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="h-8 w-3/4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-300 rounded mb-6"></div>
                  <div className="h-10 w-24 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Border Element Skeleton */}
      <div className="flex justify-center items-center">
        <div className="h-16 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* About Section Skeleton */}
      <section className="bg-white py-20 px-6 md:px-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="h-8 w-64 mx-auto bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="space-y-3 mb-8">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="h-4 w-4/5 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
          </div>

          {/* Product Images Skeleton */}
          <div className="flex flex-row justify-center items-center pb-10 gap-5">
            {[0, 1, 2].map((index) => (
              <div key={index} className="w-2/6 text-center">
                <div className="w-full h-64 bg-gray-200 rounded-t-full mb-2 animate-pulse" style={{animationDelay: `${index * 0.1}s`}}></div>
                <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded mb-1 animate-pulse" style={{animationDelay: `${index * 0.1 + 0.1}s`}}></div>
                <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: `${index * 0.1 + 0.2}s`}}></div>
              </div>
            ))}
          </div>

          <div className="flex justify-center my-16 items-center">
            <div className="h-16 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Collections Section Skeleton */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto">
          {/* Section header skeleton */}
          <div className="text-center mb-16 relative">
            <div className="h-10 w-80 mx-auto bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-4 w-96 mx-auto bg-gray-200 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
          </div>
          
          {/* Featured collection cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-96 bg-gray-200 rounded-xl shadow-lg overflow-hidden animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-300/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="mb-2">
                      <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-1 w-10 bg-gray-300 rounded"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-4/5 bg-gray-300 rounded mb-6"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
                  </div>
                  {/* Decorative corners */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-gray-300"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA button skeleton */}
          <div className="mt-16 text-center">
            <div className="h-12 w-48 mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Side Contact Bar Skeleton */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" style={{animationDelay: `${index * 0.1}s`}}></div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <footer className="bg-gray-900 text-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[0, 1, 2, 3].map((col) => (
              <div key={col} className="space-y-4">
                <div className="h-5 w-3/4 bg-gray-700 rounded animate-pulse" style={{animationDelay: `${col * 0.1}s`}}></div>
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className="h-3 w-full bg-gray-700 rounded animate-pulse" style={{animationDelay: `${(col * 4 + item) * 0.05}s`}}></div>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="h-4 w-64 bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </footer>

      {/* Floating elements that might be part of feedback system */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default HomePageSkeleton;