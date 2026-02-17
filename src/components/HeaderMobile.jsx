import { useState, useRef, useEffect } from 'react'
import { assetUrl } from '../lib/assetUrl'
import { services } from '../data/siteData'

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

  /** ---------------- Focus on close button when drawer opens ---------------- */
  useEffect(() => {
    if (mobileOpen && closeBtnRef.current) closeBtnRef.current.focus()
  }, [mobileOpen])

  /** ---------------- Handle hamburger toggle ---------------- */
  const toggleMobileMenu = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setMobileOpen(prev => !prev)

    if (!mobileOpen) setOpenAccordions(new Set())
  }

  const handleClose = () => {
    setIsAnimating(true)
    setMobileOpen(false)
    setOpenAccordions(new Set())
  }

  /** ---------------- Reset animation state after drawer closes ---------------- */
  useEffect(() => {
    if (!mobileOpen) {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [mobileOpen])

  /** ---------------- Click outside drawer to close ---------------- */
  useEffect(() => {
    if (!mobileOpen) return

    const handleClickOutside = e => {
      if (
        drawerRef.current?.contains(e.target) ||
        mobileMenuButtonRef.current?.contains(e.target)
      ) return
      handleClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  /** ---------------- Keyboard accessibility ---------------- */
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  /** ---------------- Accordion state ---------------- */
  const toggleAccordion = label => {
    const newAccordions = new Set(openAccordions)
    if (newAccordions.has(label)) newAccordions.delete(label)
    else newAccordions.add(label)
    setOpenAccordions(newAccordions)
  }

  const isAccordionOpen = label => openAccordions.has(label)

  /** ---------------- Reusable navigation button ---------------- */
  const NavButton = ({ label, href, isSub = false }) => (
    <button
      onClick={() => {
        goTo(href)
        setMobileOpen(false)
      }}
      className={`w-full text-left font-medium rounded-lg transition-colors py-3 px-4 ${
        isActivePage(href)
          ? 'text-ink bg-surface'
          : isSub
          ? 'text-ink-muted hover:text-ink hover:bg-surface'
          : 'text-ink hover:bg-surface'
      }`}
      aria-current={isActivePage(href) ? 'page' : undefined}
      style={{
        minHeight: isSub ? '44px' : '48px',
        fontSize: isSub ? '16px' : '18px',
        paddingLeft: isSub ? '32px' : '16px',
      }}
    >
      {label}
    </button>
  )

  return (
    <>
      {/* ---------- Mobile Header ---------- */}
      <header className="fixed top-0 left-0 right-0 z-[60] lg:hidden">
        <div
          className={`flex items-center justify-end h-16 px-4 transition-colors duration-300 ${
            mobileOpen
              ? 'bg-white/95 backdrop-blur-sm border-b border-border/50'
              : 'bg-transparent'
          }`}
        >
          {/* Hamburger */}
          <button
            ref={mobileMenuButtonRef}
            onClick={toggleMobileMenu}
            onKeyDown={e => handleKeyDown(e, toggleMobileMenu)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-surface/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? 'translate-y-2 rotate-45' : ''
                }`}
                style={{ backgroundColor: '#1c1c1c', transformOrigin: 'center' }}
              />
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
                style={{ backgroundColor: '#1c1c1c' }}
              />
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
                style={{ backgroundColor: '#1c1c1c', transformOrigin: 'center' }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* ---------- Overlay ---------- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[45] transition-opacity duration-200 cursor-pointer"
          onMouseDown={handleClose}
          aria-hidden="true"
        />
      )}

      {/* ---------- Mobile Drawer ---------- */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`fixed top-0 right-0 h-screen w-[85vw] max-w-[420px] bg-white z-[60] transform transition-transform duration-280 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.15)' }}
        onAnimationEnd={() => setIsAnimating(false)}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <button
            onClick={() => goTo('/')}
            className="flex items-center gap-3"
            aria-label="Home"
          >
            <img
              src={assetUrl('images/logo.webp')}
              alt="Ghaim UAE"
              className="h-7 w-auto"
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
            onKeyDown={e => handleKeyDown(e, handleClose)}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Close menu"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="max-h-[calc(100vh-64px-120px)] overflow-y-auto">
          <nav className="p-6" aria-label="Mobile navigation">
            <div className="space-y-2">
              {/* Services Accordion */}
              <div>
                <button
                  onClick={() => toggleAccordion('Services')}
                  className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors ${
                    isActivePage('/services') ? 'text-ink bg-surface' : 'text-ink hover:bg-surface'
                  }`}
                  aria-expanded={isAccordionOpen('Services')}
                  aria-controls="services-submenu"
                  style={{ minHeight: '48px', fontSize: '18px' }}
                >
                  <span>Services</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className={`transition-transform duration-200 ${isAccordionOpen('Services') ? 'rotate-180' : ''}`}
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div
                  id="services-submenu"
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{
                    maxHeight: isAccordionOpen('Services') ? '500px' : '0',
                    opacity: isAccordionOpen('Services') ? '1' : '0',
                  }}
                >
                  <div className="space-y-2 mt-2 pl-4">
                    {services.map(service => (
                      <NavButton
                        key={service.slug}
                        label={service.title}
                        href={`/services/${service.slug}`}
                        isSub
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Other Nav Links */}
              <NavButton label="Work" href="/work" />
              <NavButton label="Process" href="/process" />
              <NavButton label="Pricing" href="/pricing" />

              {/* Company Accordion */}
              <div>
                <button
                  onClick={() => toggleAccordion('Company')}
                  className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-colors ${
                    isActivePage('/about') ? 'text-ink bg-surface' : 'text-ink hover:bg-surface'
                  }`}
                  aria-expanded={isAccordionOpen('Company')}
                  aria-controls="company-submenu"
                  style={{ minHeight: '48px', fontSize: '18px' }}
                >
                  <span>Company</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className={`transition-transform duration-200 ${isAccordionOpen('Company') ? 'rotate-180' : ''}`}
                    fill="none"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <div
                  id="company-submenu"
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{
                    maxHeight: isAccordionOpen('Company') ? '300px' : '0',
                    opacity: isAccordionOpen('Company') ? '1' : '0',
                  }}
                >
                  <div className="space-y-2 mt-2 pl-4">
                    <NavButton label="About" href="/about" isSub />
                    <NavButton label="Testimonials" href="/testimonials" isSub />
                    <NavButton label="FAQ" href="/faq" isSub />
                  </div>
                </div>
              </div>

              <NavButton label="Contact" href="/contact" />
            </div>
          </nav>
        </div>

        {/* Sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-border/50" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <button
            onClick={() => {
              goTo('/contact')
              setMobileOpen(false)
            }}
            className="w-full h-12 bg-ink text-white text-base font-semibold rounded-lg hover:bg-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
            style={{ minHeight: '48px', fontSize: '16px' }}
          >
            Contact
          </button>
        </div>
      </div>
    </>
  )
}
