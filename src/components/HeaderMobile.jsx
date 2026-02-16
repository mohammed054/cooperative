import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { assetUrl } from '../lib/assetUrl'

const ArrowIcon = ({ isOpen }) => (
  <motion.svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </motion.svg>
)

const XIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HamburgerIcon = ({ isOpen }) => (
  <div className="flex flex-col justify-center items-center gap-[5px] w-10 h-10">
    <span
      className={`block h-0.5 w-5 rounded-full transition-colors ${
        isOpen ? 'rotate-45 translate-y-1.5' : ''
      } ${isOpen ? '' : 'bg-current'}`}
    />
    <span
      className={`block h-0.5 w-5 rounded-full transition-colors ${
        isOpen ? 'opacity-0' : ''
      } ${isOpen ? '' : 'bg-current'}`}
    />
    <span
      className={`block h-0.5 w-5 rounded-full transition-colors ${
        isOpen ? '-rotate-45 -translate-y-1.5' : ''
      } ${isOpen ? '' : 'bg-current'}`}
    />
  </div>
)

const MobileNavItem = ({
  label,
  href,
  onClick,
  isActive,
  hasChildren,
  isOpen,
  onToggle,
  children,
}) => {
  const handlePress = () => {
    if (hasChildren) {
      onToggle()
    } else if (onClick) {
      onClick(href)
    }
  }

  return (
    <div className="mb-2">
      <button
        onClick={handlePress}
        className={`w-full min-h-[48px] flex items-center justify-between px-4 rounded-lg text-left transition-colors ${
          isActive ? 'bg-ink/5 text-ink' : 'text-ink hover:bg-ink/[0.03]'
        }`}
        style={{ fontSize: '18px', fontWeight: 600 }}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <span>{label}</span>
        {hasChildren && <ArrowIcon isOpen={isOpen} />}
      </button>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SubLink = ({ label, href, onClick, isActive }) => (
  <button
    onClick={() => onClick(href)}
    className={`w-full min-h-[44px] flex items-center pl-8 pr-4 rounded-md text-left transition-colors ${
      isActive
        ? 'bg-ink/5 text-ink'
        : 'text-ink-muted hover:bg-ink/[0.03] hover:text-ink'
    }`}
    style={{ fontSize: '16px', fontWeight: 500 }}
    aria-current={isActive ? 'page' : undefined}
  >
    {label}
  </button>
)

export const HeaderMobile = ({
  mobileOpen,
  setMobileOpen,
  headerIsLight,
  mobileMenuButtonRef,
  services,
  caseStudies,
  isActivePage,
  goTo,
  setSearchOpen,
  location,
}) => {
  const [servicesOpen, setServicesOpen] = useState(false)

  const handleClose = () => {
    setMobileOpen(false)
    setServicesOpen(false)
  }

  const handleOverlayClick = () => {
    handleClose()
  }

  const mainNavItems = [
    { label: 'Services', href: '/services', hasChildren: true },
    { label: 'Work', href: '/work', hasChildren: false },
    { label: 'Process', href: '/process', hasChildren: false },
    { label: 'Pricing', href: '/pricing', hasChildren: false },
    { label: 'Company', href: '/about', hasChildren: false },
    { label: 'Contact', href: '/contact', hasChildren: false },
  ]

  const handleNavClick = href => {
    handleClose()
    if (href) {
      goTo(href)
    }
  }

  if (!mobileOpen) {
    return (
      <button
        ref={mobileMenuButtonRef}
        className={`flex lg:hidden items-center justify-center w-11 h-11 rounded-full transition-colors ${
          headerIsLight
            ? 'text-white hover:bg-white/10'
            : 'text-ink hover:bg-surface'
        }`}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        aria-expanded={false}
      >
        <HamburgerIcon isOpen={false} />
      </button>
    )
  }

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-0 right-0 h-full w-[85vw] max-w-[420px] bg-white z-50 lg:hidden flex flex-col"
        style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.15)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Top Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
          <Link to="/" onClick={handleClose} className="flex items-center">
            <img
              src={assetUrl('images/logo.webp')}
              alt="Ghaim UAE"
              className="h-7 w-auto"
              loading="lazy"
            />
          </Link>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-surface transition-colors"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-4">
          {mainNavItems.map(item => (
            <MobileNavItem
              key={item.label}
              label={item.label}
              href={item.href}
              onClick={handleNavClick}
              isActive={isActivePage(item.href)}
              hasChildren={item.hasChildren}
              isOpen={item.hasChildren && servicesOpen}
              onToggle={() => setServicesOpen(!servicesOpen)}
            >
              {item.label === 'Services' && (
                <div className="space-y-1">
                  {services.map(service => (
                    <SubLink
                      key={service.slug}
                      label={service.title}
                      href={`/services/${service.slug}`}
                      onClick={handleNavClick}
                      isActive={
                        location.pathname === `/services/${service.slug}`
                      }
                    />
                  ))}
                </div>
              )}
            </MobileNavItem>
          ))}
        </div>

        {/* Bottom Sticky CTA */}
        <div className="flex-shrink-0 px-4 pb-6 pt-2 border-t border-border">
          <button
            onClick={() => handleNavClick('/contact')}
            className="w-full h-12 rounded-xl bg-ink text-white font-semibold text-base transition-colors hover:bg-ink-muted"
          >
            Contact Us
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
