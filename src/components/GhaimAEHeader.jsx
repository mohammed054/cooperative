import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GetStartedButton from './GetStartedButton';

const GhaimAEHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const navItems = [
    { label: 'Services', section: 'services' },
    { label: 'Rentals', section: 'rentals' },
    { label: 'Process', section: 'process' },
    { label: 'Coverage', section: 'coverage' },
    { label: 'Get Started', section: 'get-started', isButton: true },
  ];

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        if (currentY > lastScrollY && currentY > 80) setIsHidden(true);
        else if (currentY < lastScrollY || currentY <= 80) setIsHidden(false);

        setScrolled(currentY > 30);
        setLastScrollY(currentY);
      }, 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [lastScrollY]);

  // Close mobile menu when resizing above md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: 1,
        y: isHidden ? -120 : 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled ? 'bg-white shadow-xl border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex items-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <img src="images/logo.webp" alt="GHAIM UAE" className="h-10 w-auto" />
            <span
              className={`ml-3 text-4xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-ghaimuae-primary' : 'text-white'
              }`}
            >
              GHAIM
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) =>
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                    scrolled
                      ? 'text-ghaimuae-light-gray hover:text-black hover:bg-white'
                      : 'text-white hover:bg-white hover:text-black'
                  }`}
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
            )}
          </nav>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                scrolled ? 'text-ghaimuae-primary' : 'text-white'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100/10 bg-white"
          >
            <div className="flex flex-col gap-4 py-4 px-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.section)}
                  className={`text-left text-xl font-bold ${
                    item.isButton ? 'text-primary-accent' : 'text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default GhaimAEHeader;
