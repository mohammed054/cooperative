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

  // Handle focus management
  useEffect(() => {
    if (mobileOpen && closeBtnRef.current) {
      closeBtnRef.current.focus()
    }
  }, [mobileOpen])

  const handleHamburgerClick = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setMobileOpen(!mobileOpen)
    // Reset accordions when opening/closing
    if (!mobileOpen) {
      setOpenAccordions(new Set())
    }
  }

  const handleCloseClick = () => {
    setIsAnimating(true)
    setMobileOpen(false)
    setOpenAccordions(new Set())
  }

  // Reset animation state when animation ends
  useEffect(() => {
    if (!mobileOpen) {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [mobileOpen])

  // Handle click outside to close drawer
  useEffect(() => {
    if (!mobileOpen) return

    const handleClickOutside = e => {
      // Check if click is inside drawer
      if (drawerRef.current && drawerRef.current.contains(e.target)) {
        return
      }
      // Check if click is on hamburger button
      if (
        mobileMenuButtonRef.current &&
        mobileMenuButtonRef.current.contains(e.target)
      ) {
        return
      }
      // Click is outside, close the menu
      handleCloseClick()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  const toggleAccordion = label => {
    const newAccordions = new Set(openAccordions)
    if (newAccordions.has(label)) {
      newAccordions.delete(label)
    } else {
      newAccordions.add(label)
    }
    setOpenAccordions(newAccordions)
  }

  const isAccordionOpen = label => openAccordions.has(label)

  return (
    <>
      {/* Mobile Header - Fixed at top, 64px height */}
      <header className="fixed top-0 left-0 right-0 z-[60] lg:hidden">
        <div
          className={`flex items-center justify-end h-16 px-4 transition-colors duration-300 ${
            mobileOpen
              ? 'bg-white/95 backdrop-blur-sm border-b border-border/50'
              : 'bg-transparent'
          }`}
        >
          {/* Hamburger Button Right */}
          <button
            ref={mobileMenuButtonRef}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-surface/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={handleHamburgerClick}
            onKeyDown={e => handleKeyDown(e, handleHamburgerClick)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            style={{
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? 'translate-y-2 rotate-45' : ''
                }`}
                style={{
                  backgroundColor: mobileOpen ? '#1c1c1c' : '#1c1c1c',
                  transformOrigin: 'center',
                }}
              />
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
                style={{
                  backgroundColor: mobileOpen ? '#1c1c1c' : '#1c1c1c',
                }}
              />
              <span
                className={`block h-0.5 w-6 rounded-full transition-all duration-300 ${
                  mobileOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
                style={{
                  backgroundColor: mobileOpen ? '#1c1c1c' : '#1c1c1c',
                  transformOrigin: 'center',
                }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Drawer Overlay - Full screen coverage */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[45] transition-opacity duration-200 cursor-pointer"
          onMouseDown={handleCloseClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`fixed top-0 right-0 h-screen w-[85vw] max-w-[420px] bg-white z-[60] transform transition-transform duration-280 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
        }}
        onAnimationEnd={() => setIsAnimating(false)}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          {/* Logo */}
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

          {/* Close Button */}
          <button
            ref={closeBtnRef}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={handleCloseClick}
            onKeyDown={e => handleKeyDown(e, handleCloseClick)}
            aria-label="Close menu"
            style={{
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-ink"
            >
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

        {/* Scrollable Content */}
        <div className="max-h-[calc(100vh-64px-120px)] overflow-y-auto">
          <nav className="p-6" aria-label="Mobile navigation">
            {/* Main Navigation Items */}
            <div className="space-y-2">
              {/* Services Accordion */}
              <div>
                <button
                  onClick={() => toggleAccordion('Services')}
                  className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                    isActivePage('/services')
                      ? 'text-ink bg-surface'
                      : 'text-ink hover:bg-surface'
                  }`}
                  aria-expanded={isAccordionOpen('Services')}
                  aria-controls="services-submenu"
                  style={{
                    minHeight: '48px',
                    fontSize: '18px',
                  }}
                >
                  <span>Services</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform duration-200 ${
                      isAccordionOpen('Services') ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Services Submenu */}
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
                      <button
                        key={service.slug}
                        onClick={() => {
                          goTo(`/services/${service.slug}`)
                          setMobileOpen(false)
                        }}
                        className={`w-full text-left text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                          location.pathname === `/services/${service.slug}`
                            ? 'text-ink bg-surface'
                            : 'text-ink-muted hover:text-ink hover:bg-surface'
                        }`}
                        aria-current={
                          location.pathname === `/services/${service.slug}`
                            ? 'page'
                            : undefined
                        }
                        style={{
                          minHeight: '44px',
                          fontSize: '16px',
                          paddingLeft: '32px',
                        }}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work */}
              <button
                onClick={() => {
                  goTo('/work')
                  setMobileOpen(false)
                }}
                className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isActivePage('/work')
                    ? 'text-ink bg-surface'
                    : 'text-ink hover:bg-surface'
                }`}
                aria-current={isActivePage('/work') ? 'page' : undefined}
                style={{
                  minHeight: '48px',
                  fontSize: '18px',
                }}
              >
                Work
              </button>

              {/* Process */}
              <button
                onClick={() => {
                  goTo('/process')
                  setMobileOpen(false)
                }}
                className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isActivePage('/process')
                    ? 'text-ink bg-surface'
                    : 'text-ink hover:bg-surface'
                }`}
                aria-current={isActivePage('/process') ? 'page' : undefined}
                style={{
                  minHeight: '48px',
                  fontSize: '18px',
                }}
              >
                Process
              </button>

              {/* Pricing */}
              <button
                onClick={() => {
                  goTo('/pricing')
                  setMobileOpen(false)
                }}
                className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isActivePage('/pricing')
                    ? 'text-ink bg-surface'
                    : 'text-ink hover:bg-surface'
                }`}
                aria-current={isActivePage('/pricing') ? 'page' : undefined}
                style={{
                  minHeight: '48px',
                  fontSize: '18px',
                }}
              >
                Pricing
              </button>

              {/* Company Accordion */}
              <div>
                <button
                  onClick={() => toggleAccordion('Company')}
                  className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between ${
                    isActivePage('/about')
                      ? 'text-ink bg-surface'
                      : 'text-ink hover:bg-surface'
                  }`}
                  aria-expanded={isAccordionOpen('Company')}
                  aria-controls="company-submenu"
                  style={{
                    minHeight: '48px',
                    fontSize: '18px',
                  }}
                >
                  <span>Company</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform duration-200 ${
                      isAccordionOpen('Company') ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Company Submenu */}
                <div
                  id="company-submenu"
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{
                    maxHeight: isAccordionOpen('Company') ? '300px' : '0',
                    opacity: isAccordionOpen('Company') ? '1' : '0',
                  }}
                >
                  <div className="space-y-2 mt-2 pl-4">
                    <button
                      onClick={() => {
                        goTo('/about')
                        setMobileOpen(false)
                      }}
                      className={`w-full text-left text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                        location.pathname === '/about'
                          ? 'text-ink bg-surface'
                          : 'text-ink-muted hover:text-ink hover:bg-surface'
                      }`}
                      aria-current={
                        location.pathname === '/about' ? 'page' : undefined
                      }
                      style={{
                        minHeight: '44px',
                        fontSize: '16px',
                        paddingLeft: '32px',
                      }}
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        goTo('/testimonials')
                        setMobileOpen(false)
                      }}
                      className={`w-full text-left text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                        location.pathname === '/testimonials'
                          ? 'text-ink bg-surface'
                          : 'text-ink-muted hover:text-ink hover:bg-surface'
                      }`}
                      aria-current={
                        location.pathname === '/testimonials'
                          ? 'page'
                          : undefined
                      }
                      style={{
                        minHeight: '44px',
                        fontSize: '16px',
                        paddingLeft: '32px',
                      }}
                    >
                      Testimonials
                    </button>
                    <button
                      onClick={() => {
                        goTo('/faq')
                        setMobileOpen(false)
                      }}
                      className={`w-full text-left text-base font-medium py-3 px-4 rounded-lg transition-colors ${
                        location.pathname === '/faq'
                          ? 'text-ink bg-surface'
                          : 'text-ink-muted hover:text-ink hover:bg-surface'
                      }`}
                      aria-current={
                        location.pathname === '/faq' ? 'page' : undefined
                      }
                      style={{
                        minHeight: '44px',
                        fontSize: '16px',
                        paddingLeft: '32px',
                      }}
                    >
                      FAQ
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <button
                onClick={() => {
                  goTo('/contact')
                  setMobileOpen(false)
                }}
                className={`w-full text-left text-lg font-semibold py-3 px-4 rounded-lg transition-colors ${
                  isActivePage('/contact')
                    ? 'text-ink bg-surface'
                    : 'text-ink hover:bg-surface'
                }`}
                aria-current={isActivePage('/contact') ? 'page' : undefined}
                style={{
                  minHeight: '48px',
                  fontSize: '18px',
                }}
              >
                Contact
              </button>
            </div>
          </nav>
        </div>

        {/* Sticky CTA - Anchors the layout at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-border/50"
          style={{ paddingBottom: '24px', paddingTop: '24px' }}
        >
          <button
            onClick={() => {
              goTo('/contact')
              setMobileOpen(false)
            }}
            className="w-full h-12 bg-ink text-white text-base font-semibold rounded-lg hover:bg-ink-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
            style={{
              minHeight: '48px',
              fontSize: '16px',
            }}
          >
            Contact
          </button>
        </div>
      </div>
    </>
  )
}
