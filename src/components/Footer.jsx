import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: `#${sectionId}` });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="bg-muted text-primary-text py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <img 
                src="/images/logo.webp"
                alt="Ghaim UAE Logo" 
                className="h-8 w-auto"
                style={{ maxHeight: '48px' }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-text-muted mb-6 leading-relaxed text-sm lg:text-base">
              Premium event rentals and production across the UAE. Corporate, private, and government events delivered with precision and care.
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
            <h3 className="text-base lg:text-lg font-semibold text-primary-text mb-4 lg:mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left text-sm lg:text-base"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('rentals')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left text-sm lg:text-base"
                >
                  Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('process')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left text-sm lg:text-base"
                >
                  Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left text-sm lg:text-base"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-light-gray hover:text-gold transition-colors duration-300 text-left text-sm lg:text-base"
                >
                  Projects
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
            <h3 className="text-base lg:text-lg font-semibold text-primary-text mb-4 lg:mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-accent" />
                <span className="text-text-muted text-sm lg:text-base">+971 XX XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-accent" />
                <span className="text-text-muted text-sm lg:text-base">info@ghaimuae.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary-accent" />
                <span className="text-text-muted text-sm lg:text-base">Dubai, United Arab Emirates</span>
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
            <h3 className="text-base lg:text-lg font-semibold text-primary-text mb-4 lg:mb-6">Stay Updated</h3>
            <p className="text-text-muted mb-4 lg:mb-6 text-sm lg:text-base">
              Subscribe to our newsletter for exclusive offers and event planning tips.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-white/50 border border-primary-accent/30 rounded-lg text-primary-text placeholder-text-muted focus:outline-none focus:border-primary-accent transition-colors duration-300 text-sm lg:text-base"
              />
              <motion.button
                type="submit"
                className="w-full bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm lg:text-base"
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
          className="border-t border-primary-accent/20 mt-10 lg:mt-12 pt-6 lg:pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="text-text-muted text-xs sm:text-sm">
              © 2026 Ghaim UAE. All Rights Reserved.
            </div>
            <div className="flex space-x-4 sm:space-x-6">
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-xs sm:text-sm">
                Privacy Policy
              </button>
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-xs sm:text-sm">
                Terms of Service
              </button>
              <button className="text-text-muted hover:text-accent transition-colors duration-300 text-xs sm:text-sm">
                Sitemap
              </button>
            </div>
          </div>
        </motion.div>


      </div>
    </footer>
  );
};

export default Footer;
