import { useState, useRef, useEffect, useCallback } from 'react'
import { assetUrl } from '../lib/assetUrl'
import { services } from '../data/siteData'
import ScribbleButton from './ScribbleButton'

const NavRow = ({ label, isSub = false, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-current={isActive ? 'page' : undefined}
    className={`w-full rounded-lg text-left font-medium transition-colors ${
      isSub
        ? `py-2.5 px-4 text-base ${
            isActive ? 'bg-surface text-ink' : 'text-ink-muted hover:bg-surface hover:text-ink'
          }`
        : `py-3 px-4 text-lg ${isActive ? 'bg-surface text-ink' : 'text-ink hover:bg-surface'}`
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

const AccordionSection = ({
  label,
  isOpen,
  onToggle,
  isActive,
  ariaControlsId,
  children,
}) => (
  <div>
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={ariaControlsId}
      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-lg font-semibold transition-colors ${
        isActive ? 'bg-surface text-ink' : 'text-ink hover:bg-surface'
      }`}
      style={{ minHeight: '48px', letterSpacing: '0.02em' }}
    >
      <span>{label}</span>
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
        transition:
          'max-height 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
      }}
    >
      <div className="mt-1 space-y-1 pb-2 pl-2">{children}</div>
    </div>
  </div>
)

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
      const timerId = setTimeout(() => setIsAnimating(false), 320)
      return () => clearTimeout(timerId)
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const handlePointerDown = event => {
      if (
        drawerRef.current?.contains(event.target) ||
        mobileMenuButtonRef.current?.contains(event.target)
      ) {
        return
      }
      handleClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
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
      <button
        ref={mobileMenuButtonRef}
        onClick={toggleMobileMenu}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-drawer"
        className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:hidden"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <div className="flex flex-col items-center justify-center gap-[5px]">
          {[0, 1, 2].map(index => (
            <span
              key={index}
              style={{
                display: 'block',
                height: '1.5px',
                width: index === 1 ? (mobileOpen ? '24px' : '14px') : '20px',
                borderRadius: '2px',
                backgroundColor: headerIsLight && !mobileOpen ? '#ffffff' : '#1c1c1c',
                transformOrigin: 'center',
                transition:
                  'transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.22s, width 0.3s, background-color 0.3s',
                transform: mobileOpen
                  ? index === 0
                    ? 'translateY(6.5px) rotate(45deg)'
                    : index === 1
                      ? 'scaleX(0)'
                      : 'translateY(-6.5px) rotate(-45deg)'
                  : 'none',
                opacity: mobileOpen && index === 1 ? 0 : 1,
              }}
            />
          ))}
        </div>
      </button>

      {mobileOpen && (
        <div
          onMouseDown={handleClose}
          aria-hidden="true"
          className="fixed inset-0 z-[45] cursor-pointer bg-black/40 transition-opacity duration-200"
        />
      )}

      <div
        ref={drawerRef}
        id="mobile-drawer"
        onClick={event => event.stopPropagation()}
        className="fixed right-0 top-0 z-[60] flex h-screen w-[85vw] max-w-[420px] flex-col bg-white"
        style={{
          transform: mobileOpen ? 'translateX(0)' : 'translateX(102%)',
          transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.15)',
        }}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border/50 px-4">
          <button onClick={() => navigateTo('/')} aria-label="Home" className="flex items-center gap-3">
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
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 pt-5" aria-label="Mobile navigation">
            <div className="space-y-1">
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
                    isSub
                    isActive={isActivePage(`/services/${service.slug}`)}
                    onClick={() => navigateTo(`/services/${service.slug}`)}
                  />
                ))}
              </AccordionSection>

              <NavRow
                label="Work"
                isActive={isActivePage('/work')}
                onClick={() => navigateTo('/work')}
              />
              <NavRow
                label="Process"
                isActive={isActivePage('/process')}
                onClick={() => navigateTo('/process')}
              />
              <NavRow
                label="Pricing"
                isActive={isActivePage('/pricing')}
                onClick={() => navigateTo('/pricing')}
              />

              <AccordionSection
                label="Company"
                isOpen={openAccordions.has('Company')}
                onToggle={() => toggleAccordion('Company')}
                isActive={isActivePage('/about')}
                ariaControlsId="company-submenu"
              >
                <NavRow
                  label="About"
                  isSub
                  isActive={isActivePage('/about')}
                  onClick={() => navigateTo('/about')}
                />
                <NavRow
                  label="Testimonials"
                  isSub
                  isActive={isActivePage('/testimonials')}
                  onClick={() => navigateTo('/testimonials')}
                />
                <NavRow
                  label="FAQ"
                  isSub
                  isActive={isActivePage('/faq')}
                  onClick={() => navigateTo('/faq')}
                />
              </AccordionSection>
            </div>
          </nav>
        </div>

        <div className="flex-shrink-0 border-t border-border/50 bg-white p-6">
          <ScribbleButton
            onClick={() => navigateTo('/contact')}
            aria-current={location?.pathname === '/contact' ? 'page' : undefined}
            variant="primary"
            tone="dark"
            size="lg"
            className="w-full justify-center"
          >
            Get in touch
          </ScribbleButton>
        </div>
      </div>
    </>
  )
}
