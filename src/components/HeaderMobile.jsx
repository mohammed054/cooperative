import { FaSearch } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useFocusTrap } from '../hooks/useFocusTrap'
import ScribbleButton from './ScribbleButton'

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
  const { containerRef: mobileMenuRef } = useFocusTrap(mobileOpen)

  if (!mobileOpen) {
    return (
      <button
        ref={mobileMenuButtonRef}
        className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition ${
          headerIsLight
            ? 'text-white hover:bg-white/10'
            : 'text-ink hover:bg-surface'
        } lg:hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none`}
        onClick={() => setMobileOpen(!mobileOpen)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setMobileOpen(!mobileOpen)
          }
        }}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } ${mobileOpen ? 'opacity-0' : ''}`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
        />
      </button>
    )
  }

  return (
    <AnimatePresence>
      {/* Mobile Menu */}
      <motion.div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="border-t border-border bg-surface-2 px-5 pb-6 pt-4 lg:hidden"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Mobile navigation menu
        </h2>

        {/* Main Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="grid gap-2 mb-5"
        >
          <button
            onClick={() => goTo('/')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/') ? 'page' : undefined}
          >
            Home
          </button>
          <button
            onClick={() => goTo('/services')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/services')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/services') ? 'page' : undefined}
          >
            Services
          </button>
          <button
            onClick={() => goTo('/work')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/work')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/work') ? 'page' : undefined}
          >
            Work
          </button>
          <button
            onClick={() => goTo('/process')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/process')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/process') ? 'page' : undefined}
          >
            Process
          </button>
          <button
            onClick={() => goTo('/pricing')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/pricing')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/pricing') ? 'page' : undefined}
          >
            Pricing
          </button>
          <button
            onClick={() => goTo('/about')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/about')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/about') ? 'page' : undefined}
          >
            About
          </button>
          <button
            onClick={() => goTo('/testimonials')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/testimonials')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/testimonials') ? 'page' : undefined}
          >
            Testimonials
          </button>
          <button
            onClick={() => goTo('/faq')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/faq')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/faq') ? 'page' : undefined}
          >
            FAQ
          </button>
          <button
            onClick={() => goTo('/privacy')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/privacy')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/privacy') ? 'page' : undefined}
          >
            Privacy
          </button>
          <button
            onClick={() => goTo('/terms')}
            className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
              isActivePage('/terms')
                ? 'text-primary bg-primary/10'
                : 'text-ink hover:text-primary'
            }`}
            aria-current={isActivePage('/terms') ? 'page' : undefined}
          >
            Terms
          </button>

          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setMobileOpen(false)
              setSearchOpen(true)
            }}
            className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 mt-2"
          >
            <FaSearch className="text-xs" />
            <span>Search Site</span>
          </button>
        </motion.div>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, delay: 0.08 }}
          className="mb-5"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
            Services
          </p>
          <div className="mt-2 grid gap-2">
            {services.map(service => (
              <button
                key={service.slug}
                onClick={() => goTo(`/services/${service.slug}`)}
                className={`text-left text-sm transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                  location.pathname === `/services/${service.slug}`
                    ? 'text-primary bg-primary/10'
                    : 'text-ink-muted hover:text-primary'
                }`}
                aria-current={
                  location.pathname === `/services/${service.slug}`
                    ? 'page'
                    : undefined
                }
              >
                {service.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Work Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, delay: 0.11 }}
          className="mb-6"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
            Work
          </p>
          <div className="mt-2 grid gap-2">
            {caseStudies.map(study => (
              <button
                key={study.slug}
                onClick={() => goTo(`/work/${study.slug}`)}
                className={`text-left text-sm transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                  location.pathname === `/work/${study.slug}`
                    ? 'text-primary bg-primary/10'
                    : 'text-ink-muted hover:text-primary'
                }`}
                aria-current={
                  location.pathname === `/work/${study.slug}`
                    ? 'page'
                    : undefined
                }
              >
                {study.title}
              </button>
            ))}
            <button
              onClick={() => goTo('/projects')}
              className={`text-left text-sm transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                location.pathname === '/projects'
                  ? 'text-primary bg-primary/10'
                  : 'text-ink-muted hover:text-primary'
              }`}
              aria-current={
                location.pathname === '/projects' ? 'page' : undefined
              }
            >
              Project gallery
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, delay: 0.14 }}
        >
          <ScribbleButton
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className={`btn-primary w-full text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none ${
              location.pathname === '/contact'
                ? 'ring-2 ring-offset-2 ring-primary'
                : ''
            }`}
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
          >
            Contact
          </ScribbleButton>
        </motion.div>
      </motion.div>

      {/* Close Menu Button */}
      <button
        ref={mobileMenuButtonRef}
        className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition lg:hidden ${
          headerIsLight
            ? 'text-white hover:bg-white/10'
            : 'text-ink hover:bg-surface'
        } focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none`}
        onClick={() => setMobileOpen(false)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setMobileOpen(false)
          }
        }}
        aria-label="Close menu"
        aria-expanded={mobileOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } translate-y-1.5 rotate-45`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } opacity-0`}
        />
        <span
          className={`block h-0.5 w-5 rounded-full transition ${
            headerIsLight ? 'bg-white' : 'bg-ink'
          } -translate-y-1.5 -rotate-45`}
        />
      </button>
    </AnimatePresence>
  )
}
