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
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="videos/background.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          /* Mobile: white for contrast over video; md+: original dark navy */
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-white md:text-[#2D2E40] max-w-3xl mx-auto leading-tight mb-8"
        >
          <motion.span
            className="relative inline-block"
            initial="hidden"
            animate="visible"
          >
            Premium
            <svg
              viewBox="0 0 200 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -bottom-3 left-0 w-full h-4"
            >
              <motion.path
                d="M2 4C50 2 150 2 198 4"
                stroke="#FBBF24"
                strokeWidth="8"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
          </motion.span>{" "}
          Event Solutions Designed for Impact and Experience
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GetStartedButton
            className="
              px-10 py-4 text-lg
              bg-[#2D2E40]
              hover:bg-[#1F2030]
              text-white
              rounded-xl
              transition-all
              duration-300
              shadow-lg
            "
            onClick={() => scrollToSection('scrollable-cards')}
          />
        </motion.div>

        {/* Scroll arrow */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-white opacity-80 hover:opacity-100 transition"
          onClick={() => scrollToSection('scrollable-cards')}
        >
          <FaArrowDown size={24} />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
