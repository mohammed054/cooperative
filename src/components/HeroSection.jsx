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
              <button className="relative overflow-hidden rounded-full px-10 py-4 bg-primary-accent text-white font-semibold transition-all duration-500 hover:text-gray-200 text-lg shadow-lg">
                Get Started
                {/* Hover scrape effect */}
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-all duration-500"></span>
              </button>

             {/* Secondary CTA - Arrow Only Circle */}
             <button 
               onClick={() => scrollToSection('services')}
               className="btn-arrow-circle"
             >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="170 48 12 12" width="24" height="24" className="w-6 h-6">
                 <path
                   fill="currentColor"
                   d="m179.81 48.27c-0.98-0.38-2.3-0.93-2.93-1.22-0.64-0.29-1.74-0.82-2.45-1.18-0.71-0.37-1.44-0.74-1.64-0.84-0.21-0.1-0.41-0.16-0.5-0.15-0.12 0.01-0.25 0.11-0.48 0.36-0.24 0.25-0.32 0.37-0.33 0.51-0.01 0.09 0.01 0.22 0.04 0.27 0.03 0.06 0.18 0.18 0.33 0.27 0.15 0.1 0.7 0.39 1.21 0.65 0.52 0.26 1.24 0.62 1.61 0.79 0.36 0.17 0.94 0.44 1.29 0.59 0.35 0.15 0.63 0.29 0.63 0.32 0 0.03-0.7 0.04-1.55 0.04-0.85-0.01-2.17-0.01-2.94-0.01-0.77 0-2.51 0.02-3.87 0.04-1.36 0.02-3.55 0.06-4.87 0.1-1.32 0.04-2.51 0.1-2.63 0.14-0.12 0.04-0.29 0.14-0.38 0.23-0.09 0.09-0.19 0.24-0.23 0.34-0.05 0.1-0.07 0.25-0.06 0.35 0.01 0.1 0.06 0.22 0.11 0.26 0.04 0.04 0.4 0.07 0.82 0.06 0.41 0 2.16-0.04 3.88-0.08 1.73-0.03 4.07-0.07 5.2-0.07 1.13-0.01 3.19-0.01 4.57-0.01 1.39 0.01 2.79 0.02 3.12 0.02 0.33 0 0.62 0.01 0.65 0.01 0.03 0-0.35 0.42-0.85 0.94-0.71 0.75-0.95 1.04-1.14 1.36-0.13 0.22-0.3 0.57-0.39 0.78-0.08 0.2-0.15 0.43-0.14 0.51q0.02 0.15 0.15 0.26c0.11 0.08 0.19 0.09 0.4 0.04q0.26-0.07 0.44-0.26c0.1-0.11 0.28-0.41 0.4-0.67 0.21-0.44 0.28-0.53 0.92-1.22 0.58-0.61 0.81-0.82 1.37-1.21l0.67-0.48c0.38 0.12 0.56 0.11 0.7 0.07 0.13-0.05 0.32-0.18 0.45-0.31 0.15-0.17 0.23-0.31 0.27-0.5 0.03-0.14 0.03-0.29-0.01-0.33-0.03-0.04-0.86-0.39-1.84-0.77z"
                 />
               </svg>
             </button>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
};

export default HeroSection;