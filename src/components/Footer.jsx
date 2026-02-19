import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { caseStudies, services } from '../data/siteData'
import { assetUrl } from '../lib/assetUrl'
import ScribbleButton from './ScribbleButton'

const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
)

const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const FooterLink = ({ to, href, onClick, children }) => {
  const base = {
    fontSize: '13px',
    color: '#888',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    display: 'block',
    padding: '3px 0',
    minHeight: '28px',
  }

  const handlers = {
    onMouseEnter: e => {
      e.currentTarget.style.color = '#1c1c1c'
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = '#888'
    },
  }

  if (to) return <Link to={to} style={base} {...handlers}>{children}</Link>
  if (href) return <a href={href} style={base} {...handlers}>{children}</a>
  return (
    <button
      onClick={onClick}
      style={{
        ...base,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
      {...handlers}
    >
      {children}
    </button>
  )
}

const ColHeading = ({ children }) => (
  <p
    style={{
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#1c1c1c',
      marginBottom: '14px',
    }}
  >
    {children}
  </p>
)

const Footer = () => {
  const shouldReduceMotion = useReducedMotion()
  const navigate = useNavigate()
  const location = useLocation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })
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
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
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
      ref={ref}
      style={{
        background: isHome
          ? 'linear-gradient(180deg, #0f1012 0%, #f2eee7 22%, #f5f2eb 64%, #f3eee5 100%)'
          : 'linear-gradient(180deg, rgba(248,244,236,0.95) 0%, #f6f2eb 62%, #f3ede4 100%)',
        borderTop: isHome
          ? 'none'
          : '1px solid rgba(0,0,0,0.05)',
        position: 'relative',
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px 24px;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
            gap: 0 40px;
          }
        }
      `}</style>

      <motion.div
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={inView ? 'show' : 'hidden'}
        style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 20px 24px' }}
        className="sm:px-6 lg:px-8"
      >
        <div className="footer-grid">
          <motion.div
            variants={itemVariants}
            style={{ gridColumn: '1 / -1' }}
            className="md:col-auto"
          >
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <img
                src={assetUrl('images/logo.webp')}
                alt="Ghaim UAE"
                style={{ height: '28px', width: 'auto', filter: 'brightness(0)' }}
                loading="lazy"
                decoding="async"
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#1c1c1c',
                }}
              >
                GHAIM
              </span>
            </Link>

            <p
              style={{
                marginTop: '14px',
                fontSize: '13px',
                color: '#888',
                lineHeight: 1.6,
                maxWidth: '260px',
              }}
            >
              Event production and curated rentals across the UAE. Senior-led crews,
              disciplined timelines, calm show control.
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
              {[
                { href: 'https://facebook.com', label: 'Facebook', Icon: IconFacebook },
                { href: 'https://instagram.com', label: 'Instagram', Icon: IconInstagram },
                { href: 'https://linkedin.com', label: 'LinkedIn', Icon: IconLinkedIn },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: '#888',
                    textDecoration: 'none',
                    transition: 'border-color 0.22s, color 0.22s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#1c1c1c'
                    e.currentTarget.style.color = '#1c1c1c'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
                    e.currentTarget.style.color = '#888'
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ColHeading>Services</ColHeading>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {services.map(service => (
                <li key={service.slug}>
                  <FooterLink to={`/services/${service.slug}`}>{service.title}</FooterLink>
                </li>
              ))}
              <li style={{ marginTop: '10px' }}>
                <FooterLink to="/services">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1c1c1c' }}>
                    All services -&gt;
                  </span>
                </FooterLink>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ColHeading>Work</ColHeading>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {caseStudies.map(study => (
                <li key={study.slug}>
                  <FooterLink to={`/work/${study.slug}`}>{study.title}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink to="/projects">Project gallery</FooterLink>
              </li>
              <li style={{ marginTop: '10px' }}>
                <FooterLink to="/work">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1c1c1c' }}>
                    Case studies -&gt;
                  </span>
                </FooterLink>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ColHeading>Company</ColHeading>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { to: '/about', label: 'About' },
                { to: '/process', label: 'Process' },
                { to: '/testimonials', label: 'Testimonials' },
                { to: '/faq', label: 'FAQ' },
                { to: '/pricing', label: 'Pricing' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ColHeading>Contact</ColHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { href: 'tel:+97142345678', label: '+971 4 234 5678' },
                { href: 'mailto:hello@ghaimuae.com', label: 'hello@ghaimuae.com' },
                { href: null, label: 'Dubai Design District' },
              ].map(({ href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    style={{
                      fontSize: '13px',
                      color: '#888',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      minHeight: '28px',
                      display: 'block',
                      padding: '3px 0',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#1c1c1c'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#888'
                    }}
                  >
                    {label}
                  </a>
                ) : (
                  <p key={label} style={{ fontSize: '13px', color: '#bbb', padding: '3px 0' }}>
                    {label}
                  </p>
                )
              )}
            </div>

            <ScribbleButton
              to="/contact"
              showArrow={false}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                background: '#1c1c1c',
                border: '1px solid #1c1c1c',
                borderRadius: '100px',
                padding: '9px 18px',
                textDecoration: 'none',
                transition: 'background 0.22s, border-color 0.22s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#333'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1c1c1c'
              }}
            >
              Request a proposal
            </ScribbleButton>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          style={{
            marginTop: '36px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
          className="sm:flex-row sm:items-center sm:justify-between"
        >
          <p style={{ fontSize: '11px', color: '#bbb', letterSpacing: '0.03em' }}>
            (c) 2026 Ghaim UAE. All rights reserved.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { to: '/privacy', label: 'Privacy policy' },
              { to: '/terms', label: 'Terms of service' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontSize: '11px',
                  color: '#bbb',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#1c1c1c'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#bbb'
                }}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={() => scrollToSection('get-started')}
              style={{
                fontSize: '11px',
                color: '#bbb',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#1c1c1c'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#bbb'
              }}
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
