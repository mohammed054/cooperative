import React from 'react';

const GetStartedButton = ({ 
  onClick, 
  className = '', 
  children = 'Get Started',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative overflow-hidden flex items-center justify-center 
        rounded-full bg-logo-blue px-12 py-5 font-bold text-white text-lg
        shadow-lg hover:shadow-2xl transition-all duration-700 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-logo-blue/30 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Scraping gradient overlay - pencil-like effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Animated scraping element - moves left to right */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-white/20 transform -translate-x-full group-hover:animate-scrape pointer-events-none"></div>
      
      {/* Text content - centered and above effects */}
      <span className="relative z-10 transition-all duration-700 group-hover:text-gray-100 group-hover:drop-shadow-sm">
        {children}
      </span>
    </button>
  );
};

export default GetStartedButton;