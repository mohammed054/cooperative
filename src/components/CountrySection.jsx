import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowDown, FaPhone, FaEnvelope } from 'react-icons/fa';

const CountrySection = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="country" className="py-20 bg-dark-gray overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
<img
                src="/api/placeholder/600/400"
                alt="Nationwide event coverage"
                className="rounded-lg shadow-2xl w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-gold text-dark-gray p-4 rounded-lg">
                <FaPhone className="text-2xl mb-2" />
                <p className="font-bold">Nationwide Service</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              We Do It Across the Country
            </h2>
            <p className="text-light-gray text-lg mb-8 leading-relaxed">
              Our team provides seamless event setup across cities, ensuring every rental arrives on time and ready. From coast to coast, we bring professional event solutions directly to your venue, no matter the location.
            </p>
            <p className="text-light-gray text-lg mb-8 leading-relaxed">
              With local partners in every major metropolitan area, we guarantee consistent quality and reliable service for your corporate events, conferences, and special occasions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.button
                onClick={() => scrollToSection('process')}
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('contact')}
                className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-full font-semibold hover:bg-gold hover:text-dark-gray transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEnvelope className="inline mr-2" />
                Contact Us
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gold">50+</div>
                <div className="text-light-gray text-sm">Cities</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gold">1000+</div>
                <div className="text-light-gray text-sm">Events</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gold">99%</div>
                <div className="text-light-gray text-sm">On-time</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Curved Arrow Pointing Down */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16 cursor-pointer"
          onClick={() => scrollToSection('process')}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gold text-3xl"
          >
            <FaArrowDown />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountrySection;