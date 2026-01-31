// src/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown } from 'react-icons/fa';
import GetStartedButton from './GetStartedButton';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-screen h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/background.mp4" type="video/mp4" /* Using absolute path with base - Vite will handle it correctly */ />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-ghaimuae-primary max-w-3xl mx-auto leading-tight mb-8"
        >
          Premium Event Solutions Built for Scale, Precision, and Impact
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GetStartedButton
            className="px-10 py-4 text-lg"
            onClick={() => scrollToSection('scrollable-cards')}
          />
        </motion.div>

        {/* Scroll down arrow */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-white"
          onClick={() => scrollToSection('scrollable-cards')}
        >
          <FaArrowDown size={24} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
