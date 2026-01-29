import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import logo from '../assets/images/logo.webp';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ghaimu-dark-gray text-ghaimu-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img 
              src={logo} 
              alt="GHAIM UAE" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-ghaimu-light-gray mb-6 leading-relaxed text-sm">
              Strategic business solutions that drive efficiency, scalability, and sustainable growth for enterprises across the UAE and beyond.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook className="text-xl" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-ghaimu-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('comparison')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Why Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-ghaimu')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  About GHAIM UAE
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-ghaimu-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-ghaimu-primary" />
                <span className="text-ghaimu-light-gray text-sm">+971 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-ghaimu-primary" />
                <span className="text-ghaimu-light-gray text-sm">info@ghaimuae.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-ghaimu-primary" />
                <span className="text-ghaimu-light-gray text-sm">Dubai, UAE</span>
              </div>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-ghaimu-white mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Corporate Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Logistics Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Infrastructure Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-left text-sm"
                >
                  Custom Solutions
                </button>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-ghaimu-primary/20 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-ghaimu-light-gray text-sm mb-4 md:mb-0">
              © 2026 GHAIM UAE. All Rights Reserved.
            </div>
            <div className="flex space-x-6">
              <button className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-sm">
                Privacy Policy
              </button>
              <button className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-sm">
                Terms of Service
              </button>
              <button className="text-ghaimu-light-gray hover:text-ghaimu-white transition-colors duration-300 text-sm">
                Cookie Policy
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-ghaimu-primary hover:bg-ghaimu-white text-ghaimu-white hover:text-ghaimu-primary p-4 rounded-full shadow-lg transition-all duration-300 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <FaArrowUp className="text-xl" />
        </motion.button>
      </div>
    </footer>
  );
};

export default Footer;