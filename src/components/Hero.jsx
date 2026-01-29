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
      <div className="absolute inset-0 bg-primary">
<img
          src="/images/hero-bg.jpg"
          alt="Event background"
          className="w-full h-full object-cover opacity-50"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="heading-xl"
          >
            Corporate Event Rentals
            <br />
            <span className="gradient-corporate">Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-body"
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
              className="btn-primary hover-lift"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('rentals')}
              className="btn-outline hover-lift"
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
          className="text-accent text-2xl"
        >
          <FaArrowDown />
        </motion.div>
      </motion.div>

      {/* Video Play Button Overlay */}
      <motion.button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 accent-bg hover:bg-micro-pink rounded-full p-8 transition-all duration-300 micro-accent-hover"
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