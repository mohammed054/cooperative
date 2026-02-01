import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GhaimAEHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: 1,
          y: isHidden ? -120 : 0,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled || mobileOpen ? 'bg-white shadow-xl border-b border-gray-200' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div className="flex items-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <img src="images/logo.webp" alt="GHAIM UAE" className="h-10 w-auto" />
              <span
                className={`ml-3 text-4xl font-bold transition-colors duration-300 ${
                  scrolled || mobileOpen ? 'text-ghaimuae-primary' : 'text-white'
                }`}
              >
                GHAIM
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) =>
                item.isButton ? (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.section)}
                    className="ml-4 px-5 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-85"
                    style={{ background: 'var(--color-primary, #1a1a2e)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                ) : (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.section)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      scrolled
                        ? 'text-ghaimuae-light-gray hover:text-black hover:bg-gray-100'
                        : 'text-white hover:bg-white hover:text-black'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                )
              )}
            </nav>

            {/* Mobile Hamburger — redesigned */}
            <div className="md:hidden flex items-center">
              <button
                className={`relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl transition-all duration-300 ${
                  scrolled || mobileOpen
                    ? 'hover:bg-gray-100'
                    : 'hover:bg-white/10'
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {/* Three animated bars */}
                <span
                  className={`block rounded-full transition-all duration-300 ease-in-out ${
                    scrolled || mobileOpen ? 'bg-ghaimuae-primary' : 'bg-white'
                  }`}
                  style={{
                    width: mobileOpen ? '18px' : '22px',
                    height: '2px',
                    transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className={`block rounded-full transition-all duration-300 ease-in-out ${
                    scrolled || mobileOpen ? 'bg-ghaimuae-primary' : 'bg-white'
                  }`}
                  style={{
                    width: '22px',
                    height: '2px',
                    opacity: mobileOpen ? 0 : 1,
                    transform: mobileOpen ? 'scaleX(0)' : 'none',
                  }}
                />
                <span
                  className={`block rounded-full transition-all duration-300 ease-in-out ${
                    scrolled || mobileOpen ? 'bg-ghaimuae-primary' : 'bg-white'
                  }`}
                  style={{
                    width: mobileOpen ? '18px' : '22px',
                    height: '2px',
                    transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu — redesigned */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: '500px' }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden"
              style={{ background: 'white' }}
            >
              <div className="px-5 pt-2 pb-5">
                {/* Divider */}
                <div className="w-full h-px bg-gray-100 mb-4" />

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                  {navItems.filter(item => !item.isButton).map((item, i) => (
                    <motion.button
                      key={item.label}
                      onClick={() => scrollToSection(item.section)}
                      className="w-full text-left px-3 py-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between group"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.06 }}
                    >
                      <span className="text-base font-semibold tracking-tight">
                        {item.label}
                      </span>
                      {/* Animated arrow */}
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-ghaimuae-primary transition-all duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </nav>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100 my-4" />

                {/* Get Started CTA */}
                {navItems.filter(item => item.isButton).map((item) => (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.section)}
                    className="w-full py-3 rounded-xl text-white font-semibold text-base tracking-tight transition-opacity duration-200 hover:opacity-90"
                    style={{ background: 'var(--color-primary, #1a1a2e)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Backdrop overlay when mobile menu is open */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default GhaimAEHeader;
