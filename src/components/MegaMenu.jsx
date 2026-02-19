import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import ScribbleButton from './ScribbleButton'

export const MegaMenu = ({ activeItem, setActiveMenu }) => {
  if (!activeItem) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.02,
      }}
      className="hidden lg:block"
      onMouseEnter={() => setActiveMenu(activeItem.label)}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="border-t border-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.03 }}
            className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
                {activeItem.label}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">
                {activeItem.label === 'Services'
                  ? 'Build the right production plan for your room.'
                  : activeItem.label === 'Work'
                    ? 'Recent rooms, timelines, and outcomes.'
                    : 'How we operate and support your team.'}
              </h3>
              <p className="mt-3 text-sm text-ink-muted">
                {activeItem.label === 'Services'
                  ? 'Select a discipline to see scopes, standards, and ideal use cases.'
                  : activeItem.label === 'Work'
                    ? 'Browse case studies or jump into the full project gallery.'
                    : 'Learn about the team, client feedback, and planning essentials.'}
              </p>

              <div data-quick-actions className="mt-4 flex flex-wrap gap-2">
                {activeItem.label === 'Services' && (
                  <>
                    <ScribbleButton
                      to="/services"
                      onClick={() => setActiveMenu(null)}
                      variant="outline"
                      tone="dark"
                      size="sm"
                      showArrow={false}
                      analyticsLabel="mega-menu-services-all-services"
                    >
                      All Services
                    </ScribbleButton>
                    <ScribbleButton
                      to="/contact"
                      onClick={() => setActiveMenu(null)}
                      variant="primary"
                      tone="dark"
                      size="sm"
                      analyticsLabel="mega-menu-services-get-quote"
                    >
                      Get Quote
                    </ScribbleButton>
                  </>
                )}
                {activeItem.label === 'Work' && (
                  <>
                    <ScribbleButton
                      to="/projects"
                      onClick={() => setActiveMenu(null)}
                      variant="outline"
                      tone="dark"
                      size="sm"
                      showArrow={false}
                      analyticsLabel="mega-menu-work-view-gallery"
                    >
                      View Gallery
                    </ScribbleButton>
                    <ScribbleButton
                      to="/contact"
                      onClick={() => setActiveMenu(null)}
                      variant="primary"
                      tone="dark"
                      size="sm"
                      analyticsLabel="mega-menu-work-discuss-project"
                    >
                      Discuss Project
                    </ScribbleButton>
                  </>
                )}
                {activeItem.label === 'Company' && (
                  <>
                    <ScribbleButton
                      to="/contact"
                      onClick={() => setActiveMenu(null)}
                      variant="outline"
                      tone="dark"
                      size="sm"
                      showArrow={false}
                      analyticsLabel="mega-menu-company-contact-team"
                    >
                      Contact Team
                    </ScribbleButton>
                    <ScribbleButton
                      to="/process"
                      onClick={() => setActiveMenu(null)}
                      variant="primary"
                      tone="dark"
                      size="sm"
                      analyticsLabel="mega-menu-company-our-process"
                    >
                      Our Process
                    </ScribbleButton>
                  </>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-xl bg-surface-2 p-4">
                <h4 className="mb-3 text-sm font-semibold text-ink">Featured</h4>

                {activeItem.label === 'Services' && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs text-ink-muted">Most Popular</p>
                    <Link
                      to="/services/event-production"
                      onClick={() => setActiveMenu(null)}
                      className="block w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
                        Event Production
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Complete event management
                      </p>
                    </Link>
                  </div>
                )}
                {activeItem.label === 'Work' && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs text-ink-muted">Latest Project</p>
                    <Link
                      to="/work/skyline-investor-summit"
                      onClick={() => setActiveMenu(null)}
                      className="block w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
                        Skyline Summit
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Elite corporate event
                      </p>
                    </Link>
                  </div>
                )}
                {activeItem.label === 'Company' && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs text-ink-muted">Quick Link</p>
                    <Link
                      to="/testimonials"
                      onClick={() => setActiveMenu(null)}
                      className="block w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink transition-colors group-hover:text-primary">
                        Client Stories
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Read testimonials
                      </p>
                    </Link>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-xs text-ink-muted">
                    Search {activeItem.label}
                  </p>
                  <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs">
                    <FaSearch className="text-ink-muted" />
                    <span className="text-ink-muted">
                      Search {activeItem.label.toLowerCase()}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.06 }}
            className={`grid gap-3 ${
              activeItem.children.length <= 4
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {activeItem.children.map(child => (
              <Link
                key={child.href}
                data-dropdown-item={child.href}
                to={child.href}
                onClick={() => setActiveMenu(null)}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left outline-none transition-all hover:border-primary/30 hover:bg-surface-3 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                      {child.label}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                      {child.description}
                    </p>
                  </div>
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <FaChevronDown className="rotate-270 text-xs text-ink-muted" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.09 }}
            className="mt-6 flex items-center justify-between border-t border-border pt-4"
          >
            <p className="text-xs text-ink-muted">
              {activeItem.label === 'Services' &&
                'Need help choosing? Contact our team'}
              {activeItem.label === 'Work' &&
                "Like what you see? Let's discuss your project"}
              {activeItem.label === 'Company' &&
                "Questions? We're here to help"}
            </p>
            <ScribbleButton
              to="/contact"
              onClick={() => setActiveMenu(null)}
              variant="micro"
              tone="dark"
              showArrow={false}
              analyticsLabel="mega-menu-footer-get-in-touch"
            >
              Get in touch
            </ScribbleButton>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
