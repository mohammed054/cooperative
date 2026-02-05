import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { caseStudies, services } from '../data/siteData';
import { assetUrl } from '../lib/assetUrl';
import ScribbleButton from './ScribbleButton';

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
    <footer id="site-footer" className="bg-surface py-12 lg:py-16 text-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <img
                src={assetUrl('images/logo.webp')}
                alt="Ghaim UAE logo"
                className="h-8 w-auto brightness-0"
                loading="lazy"
                decoding="async"
              />
              <span className="text-lg font-semibold tracking-[0.2em]">GHAIM</span>
            </div>
            <p className="mt-4 text-sm text-ink-muted">
              Event production and curated rentals across the UAE. Senior-led crews, disciplined timelines, and calm show control.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <motion.a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink-muted transition hover:text-ink"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Facebook"
              >
                <FaFacebook className="text-lg" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink-muted transition hover:text-ink"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Instagram"
              >
                <FaInstagram className="text-lg" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-ink-muted transition hover:text-ink"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-ink">Services</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className="transition hover:text-ink">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/services" className="mt-4 inline-flex text-sm font-semibold text-ink">
              View all services
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-ink">Work</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {caseStudies.map((study) => (
                <li key={study.slug}>
                  <Link to={`/work/${study.slug}`} className="transition hover:text-ink">
                    {study.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/projects" className="transition hover:text-ink">
                  Project gallery
                </Link>
              </li>
            </ul>
            <Link to="/work" className="mt-4 inline-flex text-sm font-semibold text-ink">
              View case studies
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-ink">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              <li>
                <Link to="/about" className="transition hover:text-ink">
                  About
                </Link>
              </li>
              <li>
                <Link to="/process" className="transition hover:text-ink">
                  Process
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="transition hover:text-ink">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition hover:text-ink">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="transition hover:text-ink">
                  Pricing
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-ink">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-ink-muted">
              <div className="flex items-center gap-3">
                <FaPhone className="text-accent" />
                <span>+971 4 234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-accent" />
                <span>hello@ghaimuae.com</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-accent" />
                <span>Dubai Design District, UAE</span>
              </div>
            </div>
            <ScribbleButton to="/contact" className="btn-primary mt-5 text-sm">
              Request a proposal
            </ScribbleButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 border-t border-border pt-6"
        >
          <div className="flex flex-col gap-3 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Ghaim UAE. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="transition hover:text-ink">
                Privacy policy
              </Link>
              <Link to="/terms" className="transition hover:text-ink">
                Terms of service
              </Link>
              <button onClick={() => scrollToSection('get-started')} className="transition hover:text-ink">
                Start a project
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
