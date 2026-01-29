import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaPlay } from 'react-icons/fa';

const Hero = () => {
  const [videoLoaded] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 bg-dark-gray">
<img
          ref={imgRef}
          src="/api/placeholder/1920/1080"
          alt="Event background"
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-gray/70 to-dark-gray/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Corporate Event Rentals
            <br />
            <span className="text-gradient">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl lg:text-2xl text-light-gray mb-8 font-light"
          >
            Chairs • AV Equipment • Stands • Full Setup
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => scrollToSection('rentals')}
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('rentals')}
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-full font-semibold hover:bg-gold hover:text-dark-gray transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="inline mr-2" />
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={() => scrollToSection('rentals')}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gold text-2xl"
        >
          <FaArrowDown />
        </motion.div>
      </motion.div>

      {/* Video Play Button Overlay */}
      <motion.button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold/20 hover:bg-gold/30 rounded-full p-8 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: videoLoaded ? 0 : 1 }}
      >
        <FaPlay className="text-white text-3xl" />
      </motion.button>
    </section>
  );
};

export default Hero;