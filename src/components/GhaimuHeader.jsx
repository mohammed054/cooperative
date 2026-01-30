import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.webp';

const GhaimuHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/show based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      // Change background based on scroll position
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Services', section: 'services' },
    { label: 'Solutions', section: 'solutions' },
    { label: 'Comparison', section: 'comparison' },
    { label: 'About', section: 'why-ghaimu' },
    { label: 'Contact Us', section: 'contact', isButton: true },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: isHidden ? -100 : 0,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-ghaimu-primary/95 backdrop-blur-sm shadow-lg' 
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
              src={logo} 
              alt="GHAIM UAE" 
              className="h-10 w-auto"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.section)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${item.isButton 
                    ? 'bg-ghaimu-white text-ghaimu-primary hover:bg-opacity-90' 
                    : 'text-ghaimu-white hover:bg-ghaimu-white/10'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-ghaimu-white p-2 hover:bg-ghaimu-white/10 rounded-lg transition-colors"
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