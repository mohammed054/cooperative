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
        group relative overflow-hidden flex items-center justify-center space-x-2 
        rounded-full bg-primary-accent px-8 py-4 font-semibold text-white 
        transition-all duration-500 shadow-lg hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-primary-accent/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* Diagonal scrapping effect - top-right to bottom-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0 skew-x-[-12deg]"></div>
      
      {/* Content layer - above effects */}
      <span className="relative z-10 transition-colors duration-500 group-hover:text-gray-100">
        {children}
      </span>
      
      {/* Arrow SVG - same as used in btn-arrow-circle */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="170 48 12 12" 
        width="20" 
        height="20" 
        className="relative z-10 w-5 h-5 transition-all duration-500 group-hover:text-gray-100 transform rotate-0 group-hover:-rotate-45 group-hover:translate-x-1"
        fill="currentColor"
      >
        <path
          d="m179.81 48.27c-0.98-0.38-2.3-0.93-2.93-1.22-0.64-0.29-1.74-0.82-2.45-1.18-0.71-0.37-1.44-0.74-1.64-0.84-0.21-0.1-0.41-0.16-0.5-0.15-0.12 0.01-0.25 0.11-0.48 0.36-0.24 0.25-0.32 0.37-0.33 0.51-0.01 0.09 0.01 0.22 0.04 0.27 0.03 0.06 0.18 0.18 0.33 0.27 0.15 0.1 0.7 0.39 1.21 0.65 0.52 0.26 1.24 0.62 1.61 0.79 0.36 0.17 0.94 0.44 1.29 0.59 0.35 0.15 0.63 0.29 0.63 0.32 0 0.03-0.7 0.04-1.55 0.04-0.85-0.01-2.17-0.01-2.94-0.01-0.77 0-2.51 0.02-3.87 0.04-1.36 0.02-3.55 0.06-4.87 0.1-1.32 0.04-2.51 0.1-2.63 0.14-0.12 0.04-0.29 0.14-0.38 0.23-0.09 0.09-0.19 0.24-0.23 0.34-0.05 0.1-0.07 0.25-0.06 0.35 0.01 0.1 0.06 0.22 0.11 0.26 0.04 0.04 0.4 0.07 0.82 0.06 0.41 0 2.16-0.04 3.88-0.08 1.73-0.03 4.07-0.07 5.2-0.07 1.13-0.01 3.19-0.01 4.57-0.01 1.39 0.01 2.79 0.02 3.12 0.02 0.33 0 0.62 0.01 0.65 0.01 0.03 0-0.35 0.42-0.85 0.94-0.71 0.75-0.95 1.04-1.14 1.36-0.13 0.22-0.3 0.57-0.39 0.78-0.08 0.2-0.15 0.43-0.14 0.51q0.02 0.15 0.15 0.26c0.11 0.08 0.19 0.09 0.4 0.04q0.26-0.07 0.44-0.26c0.1-0.11 0.28-0.41 0.4-0.67 0.21-0.44 0.28-0.53 0.92-1.22 0.58-0.61 0.81-0.82 1.37-1.21l0.67-0.48c0.38 0.12 0.56 0.11 0.7 0.07 0.13-0.05 0.32-0.18 0.45-0.31 0.15-0.17 0.23-0.31 0.27-0.5 0.03-0.14 0.03-0.29-0.01-0.33-0.03-0.04-0.86-0.39-1.84-0.77z"
        />
      </svg>
    </button>
  );
};

export default GetStartedButton;