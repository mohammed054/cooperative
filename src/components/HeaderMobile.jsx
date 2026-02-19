import { useState, useRef, useEffect, useCallback } from 'react'
import { assetUrl } from '../lib/assetUrl'
import { services } from '../data/siteData'

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

/** Single tappable nav row — brand colors, luxury spacing */
const NavRow = ({ label, href, isSub = false, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`w-full text-left font-medium rounded-lg transition-colors
      ${isSub
        ? `py-2.5 px-4 text-base ${isActive ? 'text-ink bg-surface' : 'text-ink-muted hover:text-ink hover:bg-surface'}`
        : `py-3 px-4 text-lg ${isActive ? 'text-ink bg-surface' : 'text-ink hover:bg-surface'}`
      }`}
    style={{
      minHeight: isSub ? '44px' : '48px',
      paddingLeft: isSub ? '32px' : '16px',
      letterSpacing: '0.02em',
    }}
  >
    {label}
  </button>
)

/** Accordion section — brand colors, elegant plus/minus toggle */
const AccordionSection = ({ label, isOpen, onToggle, isActive, ariaControlsId, children }) => (
  <div>
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={ariaControlsId}
      className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg
        flex items-center justify-between transition-colors
        ${isActive ? 'text-ink bg-surface' : 'text-ink hover:bg-surface'}`}
      style={{ minHeight: '48px', letterSpacing: '0.02em' }}
    >
      <span>{label}</span>

      {/* Plus → × morph — more refined than a plain chevron */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={{
          flexShrink: 0,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
          opacity: 0.45,
        }}
      >
        <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>

    <div
      id={ariaControlsId}
      style={{
        overflow: 'hidden',
        maxHeight: isOpen ? '600px' : '0px',
        opacity: isOpen ? 1 : 0,
        transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
      }}
    >
      <div className="mt-1 pl-2 space-y-1 pb-2">
        {children}
      </div>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────

export const HeaderMobile = ({
  mobileOpen,
  setMobileOpen,
  headerIsLight,
  mobileMenuButtonRef,
  isActivePage,
  goTo,
  location,
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [openAccordions, setOpenAccordions] = useState(new Set())
  const closeBtnRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    if (mobileOpen && closeBtnRef.current) closeBtnRef.current.focus()
  }, [mobileOpen])

  const toggleMobileMenu = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setMobileOpen(prev => !prev)
    if (!mobileOpen) setOpenAccordions(new Set())
  }

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setMobileOpen(false)
    setOpenAccordions(new Set())
  }, [setMobileOpen])

  useEffect(() => {
    if (!mobileOpen) {
      const t = setTimeout(() => setIsAnimating(false), 320)
      return () => clearTimeout(t)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const handle = e => {
      if (drawerRef.current?.contains(e.target) || mobileMenuButtonRef.current?.contains(e.target)) return
      handleClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [handleClose, mobileMenuButtonRef, mobileOpen])

  const toggleAccordion = label => {
    const next = new Set(openAccordions)
    next.has(label) ? next.delete(label) : next.add(label)
    setOpenAccordions(next)
  }

  const navigateTo = href => {
    goTo(href)
    setMobileOpen(false)
  }

  return (
    <>
      {/* ── Hamburger button ── */}
      <button
        ref={mobileMenuButtonRef}
        onClick={toggleMobileMenu}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-drawer"
        className="flex lg:hidden h-11 w-11 items-center justify-center rounded-full
          transition-all duration-200 hover:bg-surface/50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        {/* Three bars — asymmetric widths for a refined feel; original colors */}
        <div className="flex flex-col items-center justify-center gap-[5px]">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                height: '1.5px',
                // Middle bar slightly shorter — subtle luxury detail
                width: i === 1 ? (mobileOpen ? '24px' : '14px') : '20px',
                borderRadius: '2px',
                backgroundColor: headerIsLight && !mobileOpen ? '#ffffff' : '#1c1c1c',
                transformOrigin: 'center',
                transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.22s, width 0.3s, background-color 0.3s',
                transform: mobileOpen
                  ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-6.5px) rotate(-45deg)'
                  : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </div>
      </button>

      {/* ── Overlay ── */}
      {mobileOpen && (
        <div
          onMouseDown={handleClose}
          aria-hidden="true"
          className="fixed inset-0 z-[45] bg-black/40 transition-opacity duration-200 cursor-pointer"
        />
      )}

      {/* ── Drawer ── */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        onClick={e => e.stopPropagation()}
        className="fixed top-0 right-0 h-screen w-[85vw] max-w-[420px] bg-white z-[60] flex flex-col"
        style={{
          transform: mobileOpen ? 'translateX(0)' : 'translateX(102%)',
          transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.15)',
        }}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        {/* ─ Drawer header ─ */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50 flex-shrink-0">
          <button
            onClick={() => navigateTo('/')}
            aria-label="Home"
            className="flex items-center gap-3"
          >
            <img
              src={assetUrl('images/logo.webp')}
              alt="Ghaim UAE"
              className="h-7 w-auto brightness-0"
              loading="lazy"
              decoding="async"
            />
            <span className="text-lg font-semibold tracking-[0.12em] text-ink">
              GHAIM
            </span>
          </button>

          <button
            ref={closeBtnRef}
            onClick={handleClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-full
              transition-colors hover:bg-surface
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ─ Scrollable nav area ─ */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 pt-5" aria-label="Mobile navigation">
            <div className="space-y-1">

              {/* Services accordion */}
              <AccordionSection
                label="Services"
                isOpen={openAccordions.has('Services')}
                onToggle={() => toggleAccordion('Services')}
                isActive={isActivePage('/services')}
                ariaControlsId="services-submenu"
              >
                {services.map(service => (
                  <NavRow
                    key={service.slug}
                    label={service.title}
                    href={`/services/${service.slug}`}
                    isSub
                    isActive={isActivePage(`/services/${service.slug}`)}
                    onClick={() => navigateTo(`/services/${service.slug}`)}
                  />
                ))}
              </AccordionSection>

              <NavRow label="Work"    isActive={isActivePage('/work')}    onClick={() => navigateTo('/work')} />
              <NavRow label="Process" isActive={isActivePage('/process')} onClick={() => navigateTo('/process')} />
              <NavRow label="Pricing" isActive={isActivePage('/pricing')} onClick={() => navigateTo('/pricing')} />

              {/* Company accordion */}
              <AccordionSection
                label="Company"
                isOpen={openAccordions.has('Company')}
                onToggle={() => toggleAccordion('Company')}
                isActive={isActivePage('/about')}
                ariaControlsId="company-submenu"
              >
                <NavRow label="About"        isSub isActive={isActivePage('/about')}        onClick={() => navigateTo('/about')} />
                <NavRow label="Testimonials" isSub isActive={isActivePage('/testimonials')} onClick={() => navigateTo('/testimonials')} />
                <NavRow label="FAQ"          isSub isActive={isActivePage('/faq')}          onClick={() => navigateTo('/faq')} />
              </AccordionSection>

            </div>
          </nav>
        </div>

        {/* ─ Sticky CTA — original brand styles ─ */}
        <div className="flex-shrink-0 p-6 bg-white border-t border-border/50">
          <button
            onClick={() => navigateTo('/contact')}
            aria-current={location?.pathname === '/contact' ? 'page' : undefined}
            className="w-full h-12 bg-ink text-white text-sm font-semibold rounded-lg
              transition-colors hover:bg-ink-muted
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              flex items-center justify-center gap-2"
            style={{ minHeight: '48px', letterSpacing: '0.04em' }}
          >
            Get in touch
            {/* Thin arrow — adds luxury directionality */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-60">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
