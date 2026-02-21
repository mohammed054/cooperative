import React from 'react'
import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/assetUrl'

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/work', label: 'Work' },
  { to: '/process', label: 'Process' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const Footer = () => {
  const year = new Date().getFullYear()

  const linkStyle = {
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,0.32)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  }

  const hover = {
    onMouseEnter: e => { e.currentTarget.style.color = 'rgba(250,247,242,0.75)' },
    onMouseLeave: e => { e.currentTarget.style.color = 'rgba(250,247,242,0.32)' },
  }

  return (
    <footer
      id="site-footer"
      /* PART 5 FIX: Removed inline background:'#09090b'. Background now controlled
         by flagship-scene-deep CSS class. Border and position kept as style props. */
      className="flagship-scene-deep"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {/* Main bar */}
      <div
        style={{
          maxWidth: '1280px',
          marginInline: 'auto',
          padding: '0 clamp(1.2rem, 4vw, 3rem)',
          height: 'clamp(56px, 7vh, 72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        {/* Left: Logo */}
        <Link
          to="/"
          aria-label="Ghaim — home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src={assetUrl('images/logo.webp')}
            alt=""
            style={{
              height: '1.25rem',
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              opacity: 0.55,
            }}
            loading="lazy"
            decoding="async"
          />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1rem',
              letterSpacing: '-0.018em',
              color: 'rgba(250,247,242,0.55)',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Ghaim
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav
          aria-label="Footer navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.4rem, 3vw, 2.4rem)',
          }}
          className="footer-nav-center"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={linkStyle}
              {...hover}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Contact CTA */}
        <Link
          to="/contact"
          style={{
            ...linkStyle,
            color: 'rgba(250,247,242,0.4)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          {...hover}
        >
          Get in touch
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
            <path d="M1.5 4h5M4.5 2L6.5 4l-2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          maxWidth: '1280px',
          marginInline: 'auto',
          padding: '0.75rem clamp(1.2rem, 4vw, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: 'rgba(250,247,242,0.14)',
          }}
        >
          © {year} Ghaim UAE LLC
        </p>

        <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center' }}>
          {[
            { to: '/privacy', label: 'Privacy' },
            { to: '/terms', label: 'Terms' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: 'rgba(250,247,242,0.14)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(250,247,242,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(250,247,242,0.14)' }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile: stack nav */}
      <style>{`
        @media (max-width: 640px) {
          .footer-nav-center {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
