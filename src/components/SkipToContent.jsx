import React from 'react';

const SkipToContent = () => {
  const handleSkip = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        focus:z-50 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 
        focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 
        focus:ring-primary focus:ring-offset-2 focus:transition-all 
        focus:duration-200 hover:bg-white hover:text-gray-900
        text-sm font-medium
      "
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;