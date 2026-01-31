// src/components/GhaimuHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GetStartedButton from './GetStartedButton';

const GhaimuHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounced scroll handling for smoother performance
      scrollTimeoutRef.current = setTimeout(() => {
        // Hide/show based on scroll direction with improved thresholds
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsHidden(true);
        } else if (currentScrollY < lastScrollY || currentScrollY <= 80) {
          setIsHidden(false);
        }
        
        // Change background based on scroll position
        setScrolled(currentScrollY > 30);
        setLastScrollY(currentScrollY);
      }, 16); // ~60fps for smooth scrolling
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Services', section: 'services' },
    { label: 'Rentals', section: 'rentals' },
    { label: 'Process', section: 'process' },
    { label: 'Coverage', section: 'coverage' },
    { label: 'Get Started', section: 'get-started', isButton: true },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: isHidden ? -120 : 0,
        transition: { 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic bezier for smooth natural movement
        }
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-white shadow-xl border-b border-gray-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left Aligned */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="../public/images/logo.webp" /* Changed to relative path for GitHub Pages compatibility */
              alt="GHAIM UAE" 
              className="h-10 w-auto"
            />
            <span className={`ml-3 text-4xl font-bold transition-colors duration-300 ${
              scrolled ? 'text-ghaimuae-primary' : 'text-white'
            }`}>
              GHAIM
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              item.isButton && item.label === 'Get Started' ? (
                <GetStartedButton
                  key={item.label}
                  onClick={() => scrollToSection(item.section)}
                  className="text-sm px-6 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              ) : (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.section)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center
                    ${item.isButton 
                      ? scrolled 
                        ? 'bg-primary-accent text-white hover:bg-primary-accent/90' 
                        : 'bg-ghaimuae-white text-primary-accent hover:bg-opacity-90'
                      : scrolled
                        ? 'text-ghaimuae-light-gray hover:text-black hover:bg-white'
                        : 'text-white hover:bg-white hover:text-black'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredItem(item.label)}
                  onHoverEnd={() => setHoveredItem(null)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.label}
                  {!item.isButton && (
                    <motion.span 
                      className="inline-block text-xl font-bold leading-none w-5 h-5 flex items-center justify-center ml-2" 
                      animate={{ rotate: hoveredItem === item.label ? 135 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      +
                    </motion.span>
                  )}
                </motion.button>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                scrolled ? 'text-ghaimuae-primary' : 'text-white'
              }`}
              onClick={() => {
                // Mobile menu toggle logic here
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default GhaimuHeader;
