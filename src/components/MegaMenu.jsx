import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import { ButtonLink } from './Button'

export const MegaMenu = ({
  activeItem,
  isActivePage,
  goTo,
  setActiveMenu,
  handleQuickActionKeydown,
  handleDropdownKeydown,
  handleDropdownItemKeydown,
  isHovering,
  headerIsLight,
}) => {
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
          {/* Mega Menu Header */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.03 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
                {activeItem.label}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-ink font-serif">
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

              {/* Quick Actions */}
              <div data-quick-actions className="mt-4 flex flex-wrap gap-2">
                {activeItem.label === 'Services' && (
                  <>
                    <ButtonLink
                      onClick={() => goTo('/services')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="secondary"
                      size="sm"
                    >
                      All Services
                    </ButtonLink>
                    <ButtonLink
                      onClick={() => goTo('/contact')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="tertiary"
                      size="sm"
                    >
                      Get Quote
                    </ButtonLink>
                  </>
                )}
                {activeItem.label === 'Work' && (
                  <>
                    <ButtonLink
                      onClick={() => goTo('/projects')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="secondary"
                      size="sm"
                    >
                      View Gallery
                    </ButtonLink>
                    <ButtonLink
                      onClick={() => goTo('/contact')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="tertiary"
                      size="sm"
                    >
                      Discuss Project
                    </ButtonLink>
                  </>
                )}
                {activeItem.label === 'Company' && (
                  <>
                    <ButtonLink
                      onClick={() => goTo('/contact')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="secondary"
                      size="sm"
                    >
                      Contact Team
                    </ButtonLink>
                    <ButtonLink
                      onClick={() => goTo('/process')}
                      onKeyDown={handleQuickActionKeydown}
                      variant="tertiary"
                      size="sm"
                    >
                      Our Process
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>

            {/* Featured Content */}
            <div className="hidden lg:block">
              <div className="bg-surface-2 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-ink mb-3">
                  Featured
                </h4>

                {/* Featured Content */}
                {activeItem.label === 'Services' && (
                  <div className="mb-4">
                    <p className="text-xs text-ink-muted mb-2">Most Popular</p>
                    <button
                      onClick={() => goTo('/services/event-production')}
                      className="w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
                        Event Production
                      </p>
                      <p className="text-xs text-ink-muted mt-1">
                        Complete event management
                      </p>
                    </button>
                  </div>
                )}
                {activeItem.label === 'Work' && (
                  <div className="mb-4">
                    <p className="text-xs text-ink-muted mb-2">
                      Latest Project
                    </p>
                    <button
                      onClick={() => goTo('/work/skyline-investor-summit')}
                      className="w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
                        Skyline Summit
                      </p>
                      <p className="text-xs text-ink-muted mt-1">
                        Elite corporate event
                      </p>
                    </button>
                  </div>
                )}
                {activeItem.label === 'Company' && (
                  <div className="mb-4">
                    <p className="text-xs text-ink-muted mb-2">Quick Link</p>
                    <button
                      onClick={() => goTo('/testimonials')}
                      className="w-full text-left group"
                    >
                      <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">
                        Client Stories
                      </p>
                      <p className="text-xs text-ink-muted mt-1">
                        Read testimonials
                      </p>
                    </button>
                  </div>
                )}

                {/* Search within category */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-ink-muted mb-2">
                    Search {activeItem.label}
                  </p>
                  <button className="w-full flex items-center gap-2 text-xs px-3 py-2 bg-white border border-border rounded-lg hover:border-primary/30 hover:bg-surface-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none">
                    <FaSearch className="text-ink-muted" />
                    <span className="text-ink-muted">
                      Search {activeItem.label.toLowerCase()}...
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items Grid */}
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
            {activeItem.children.map((child, index) => (
              <button
                key={child.href}
                data-dropdown-item={index}
                onClick={() => goTo(child.href)}
                onKeyDown={e =>
                  handleDropdownItemKeydown(
                    e,
                    index,
                    activeItem.children.length,
                    child.href
                  )
                }
                className="group relative rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-surface-3 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                      {child.label}
                    </p>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2">
                      {child.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaChevronDown className="text-xs text-ink-muted rotate-270" />
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.09 }}
            className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <p className="text-xs text-ink-muted">
              {activeItem.label === 'Services' &&
                'Need help choosing? Contact our team'}
              {activeItem.label === 'Work' &&
                "Like what you see? Let's discuss your project"}
              {activeItem.label === 'Company' &&
                "Questions? We're here to help"}
            </p>
            <button
              onClick={() => {
                setActiveMenu(null)
                goTo('/contact')
              }}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none rounded-sm px-2 py-1"
            >
              Get in touch →
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
