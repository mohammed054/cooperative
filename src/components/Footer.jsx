import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { caseStudies, services } from '../data/siteData'
import { assetUrl } from '../lib/assetUrl'
import ScribbleButton from './ScribbleButton'

const SOCIAL_LINKS = [
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

const Footer = () => {
  const shouldReduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const location = useLocation()
  const footerRef = useRef(null)
  const inView = useInView(footerRef, { once: true, margin: '-5% 0px' })
  const isHome = location.pathname === '/'

  const scrollToSection = id => {
    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: `#${id}` })
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
  }
  const itemVariants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="relative overflow-hidden border-t border-black/[0.05] bg-[linear-gradient(180deg,#f4efe7_0%,#f5f2eb_66%,#f3ede4_100%)]"
    >
      {isHome && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 top-0 h-44 bg-[linear-gradient(180deg,#0f1116_0%,rgba(15,17,22,0.82)_20%,rgba(15,17,22,0.52)_44%,rgba(15,17,22,0.18)_68%,rgba(15,17,22,0)_100%)]"
        />
      )}

      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={inView ? 'show' : 'hidden'}
        className="relative mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pb-8 lg:pt-20"
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:gap-x-9">
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={assetUrl('images/logo.webp')}
                alt="Ghaim UAE"
                className="h-7 w-auto brightness-0"
                loading="lazy"
                decoding="async"
              />
              <span className="text-sm font-semibold tracking-[0.16em] text-ink">GHAIM</span>
            </Link>

            <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-ink-muted">
              Event production and curated rentals across the UAE with senior-led
              crews and disciplined show control.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted transition-colors hover:border-black/20 hover:text-ink"
                  aria-label={item.label}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="cinematic-eyebrow text-ink-subtle">Services</p>
            <ul className="mt-4 space-y-2">
              {services.map(service => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="cinematic-eyebrow text-ink-subtle">Work</p>
            <ul className="mt-4 space-y-2">
              {caseStudies.map(study => (
                <li key={study.slug}>
                  <Link
                    to={`/work/${study.slug}`}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {study.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/projects" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Project gallery
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="cinematic-eyebrow text-ink-subtle">Company</p>
            <ul className="mt-4 space-y-2">
              {[
                { to: '/about', label: 'About' },
                { to: '/process', label: 'Process' },
                { to: '/testimonials', label: 'Testimonials' },
                { to: '/faq', label: 'FAQ' },
                { to: '/pricing', label: 'Pricing' },
              ].map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="cinematic-eyebrow text-ink-subtle">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-ink-muted">
              <a href="tel:+97142345678" className="block transition-colors hover:text-ink">
                +971 4 234 5678
              </a>
              <a href="mailto:hello@ghaimuae.com" className="block transition-colors hover:text-ink">
                hello@ghaimuae.com
              </a>
              <p className="text-ink-subtle">Dubai Design District</p>
            </div>

            <div className="mt-5">
              <ScribbleButton
                to="/contact"
                variant="primary"
                tone="dark"
                size="sm"
                analyticsLabel="footer-request-proposal"
              >
                Request a proposal
              </ScribbleButton>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col gap-4 border-t border-black/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[11px] tracking-[0.03em] text-ink-subtle">
            (c) 2026 Ghaim UAE. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.03em] text-ink-subtle">
            <Link to="/privacy" className="transition-colors hover:text-ink">
              Privacy policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-ink">
              Terms of service
            </Link>
            <button
              onClick={() => scrollToSection('get-started')}
              className="transition-colors hover:text-ink"
            >
              Start a project
            </button>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer
