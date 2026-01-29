import React from 'react';
import { motion } from 'framer-motion';
import LazyLoadImage from 'react-lazy-load-image-component';
import { FaArrowRight, FaRocket } from 'react-icons/fa';

const CtaSection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cta" className="py-32 bg-gradient-to-br from-dark-gray via-charcoal to-dark-gray relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FFD700" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 left-10 text-gold/20"
      >
        <FaRocket className="text-6xl" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-10 right-10 text-electric-blue/20"
      >
        <FaArrowRight className="text-6xl" />
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-block mb-8"
          >
            <div className="bg-gold/20 border border-gold/50 text-gold px-6 py-3 rounded-full text-sm font-semibold">
              Ready to Transform Your Event?
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Let's find that place
            <br />
            <span className="text-gradient">you've been dreaming about.</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl lg:text-2xl text-light-gray mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join hundreds of satisfied clients who have transformed their corporate events with our premium rental solutions. Your perfect event starts here.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              onClick={() => scrollToSection('contact')}
              className="bg-gold hover:bg-white text-dark-gray px-12 py-4 text-lg font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <FaArrowRight className="inline ml-3" />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('testimonials')}
              className="bg-transparent border-2 border-electric-blue text-electric-blue px-12 py-4 text-lg font-bold rounded-full hover:bg-electric-blue hover:text-dark-gray transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See Success Stories
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-12 border-t border-charcoal"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-8 sm:space-y-0 sm:space-x-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">No Setup Fees</div>
                <div className="text-light-gray text-sm">Transparent Pricing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">24/7 Support</div>
                <div className="text-light-gray text-sm">Always Here to Help</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold mb-2">Satisfaction Guaranteed</div>
                <div className="text-light-gray text-sm">100% Customer Focus</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;