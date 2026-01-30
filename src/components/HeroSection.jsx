import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      ref={ref}
      className="relative w-screen h-screen flex items-center justify-center bg-ghaimu-primary overflow-hidden"
    >
      {/* Background Subtle Pattern/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ghaimu-primary via-ghaimu-primary to-ghaimu-dark-gray opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
           {/* Main Headline */}
           <motion.h1 
             className="text-3xl md:text-4xl lg:text-5xl font-bold text-ghaimu-white mb-12 leading-tight max-w-3xl mx-auto"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
             transition={{ duration: 0.8, delay: 0.2 }}
           >
             Premium event solutions built for scale, precision, and impact.
           </motion.h1>

           {/* CTA Buttons */}
          <motion.div 
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Primary CTA */}
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="px-10 py-4 bg-primary-accent text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>

            {/* Secondary CTA - Arrow Only Circle */}
            <motion.button
              onClick={() => scrollToSection('services')}
              className="btn-arrow-circle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
};

export default HeroSection;