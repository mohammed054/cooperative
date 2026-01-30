import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt } from 'react-icons/fa';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', section: 'hero' },
    { label: 'Rentals', section: 'rentals' },
    { label: 'Process', section: 'process' },
    { label: 'Testimonials', section: 'testimonials' },
    { label: 'Call Us', section: 'contact', isButton: true },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
         scrolled 
           ? 'bg-navbar-scrolled shadow-lg' 
           : 'bg-transparent'
       }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="hover-lift"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src="/images/logo.svg" 
              alt="Event Rentals Logo" 
              className="h-10 w-auto"
              style={{ maxHeight: '48px' }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
               <motion.button
                 key={item.label}
                 onClick={() => scrollToSection(item.section)}
                 className={`
                   ${item.isButton 
                     ? 'bg-primary-accent text-white px-8 py-4 font-semibold rounded-full hover:bg-primary-accent/90 transition-all duration-300' 
                     : 'text-primary-text hover:text-link-hover px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2'
                   }
                 `}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3, delay: index * 0.1 }}
               >
                   {item.isButton && <FaPhoneAlt className="inline mr-2 text-white" />}
                    {!item.isButton && (
                      <motion.span
                        className="inline-block text-lg font-bold leading-none"
                        whileHover={{ rotate: 135 }}
                        transition={{ duration: 0.3 }}
                      >
                        +
                      </motion.span>
                    )}
                 {item.label}
               </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-primary-text p-2"
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
    </motion.nav>
  );
};

export default Navbar;