import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from 'react-icons/fa';

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
    <footer id="contact" className="bg-muted text-primary-text py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <img 
                src="../public/images/logo.webp" /* Changed to relative path for GitHub Pages compatibility */
                alt="Event Rentals Logo" 
                className="h-8 w-auto"
                style={{ maxHeight: '48px' }}
              />
            </div>
            <p className="text-text-muted mb-6 leading-relaxed">
              Professional event rentals for corporate gatherings, conferences, and special occasions across the country.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-text-muted hover:text-primary-accent transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-text-muted hover:text-primary-accent transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-text-muted hover:text-primary-accent transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="text-xl" />
              </motion.a>
              <motion.a
                href="#"
                className="text-text-muted hover:text-primary-accent transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter className="text-xl" />
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
            <h3 className="text-lg font-semibold text-primary-text mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('rentals')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left"
                >
                  Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('process')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left"
                >
                  Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left"
                >
                  Testimonials
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
            <h3 className="text-lg font-semibold text-primary-text mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-accent" />
                <span className="text-text-muted">+123 456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-accent" />
                <span className="text-text-muted">info@example.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary-accent" />
                <span className="text-text-muted">123 Event St, City</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-primary-text mb-6">Stay Updated</h3>
            <p className="text-text-muted mb-6">
              Subscribe to our newsletter for exclusive offers and event planning tips.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-white/50 border border-primary-accent/30 rounded-lg text-primary-text placeholder-text-muted focus:outline-none focus:border-primary-accent transition-colors duration-300"
              />
              <motion.button
                type="submit"
                className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-primary-accent/20 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-text-muted text-sm mb-4 md:mb-0">
              © 2026 Event Rentals. All Rights Reserved.
            </div>
            <div className="flex space-x-6">
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-sm">
                Privacy Policy
              </button>
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-sm">
                Terms of Service
              </button>
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-sm">
                Sitemap
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary-accent hover:bg-primary-accent/90 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
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