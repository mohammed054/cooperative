import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { caseStudies, services } from '../data/siteData'
import { assetUrl } from '../lib/assetUrl'
import Search from './Search'
import { HeaderDesktop } from './HeaderDesktop'
import { HeaderMobile } from './HeaderMobile'
import { MegaMenu } from './MegaMenu'

const GhaimAEHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isHovering, setIsHovering] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimeoutRef = useRef(null)
  const closeTimeoutRef = useRef(null)
  const mobileMenuButtonRef = useRef(null)

  const navItems = useMemo(
    () => [
      {
        label: 'Services',
        href: '/services',
        children: services.map(service => ({
          label: service.title,
          description: service.summary,
          href: `/services/${service.slug}`,
        })),
      },
      {
        label: 'Work',
        href: '/work',
        children: [
          ...caseStudies.map(study => ({
            label: study.title,
            description: study.location,
            href: `/work/${study.slug}`,
          })),
          {
            label: 'Project gallery',
            description: 'Browse production visuals',
            href: '/projects',
          },
        ],
      },
      { label: 'Process', href: '/process' },
      {
        label: 'Company',
        href: '/about',
        children: [
          {
            label: 'About',
            description: 'Our team and principles',
            href: '/about',
          },
          {
            label: 'Testimonials',
            description: 'Client feedback',
            href: '/testimonials',
          },
          { label: 'FAQ', description: 'Planning questions', href: '/faq' },
        ],
      },
      { label: 'Pricing', href: '/pricing' },
    ],
    []
  )

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      scrollTimeoutRef.current = setTimeout(() => {
        if (mobileOpen) {
          setIsHidden(false)
        } else if (currentY <= 20) {
          setIsHidden(false)
        } else if (currentY > lastScrollY.current) {
          setIsHidden(false)
        } else if (currentY < lastScrollY.current) {
          setIsHidden(true)
        }

        setScrolled(currentY > 30)
        lastScrollY.current = currentY
      }, 16)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleKeyDown = e => {
      // Global search shortcut (Ctrl/Cmd + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        return
      }

      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false)
        } else if (mobileOpen) {
          setMobileOpen(false)
          if (mobileMenuButtonRef.current) {
            mobileMenuButtonRef.current.focus()
          }
        } else if (activeMenu) {
          setActiveMenu(null)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [mobileOpen, activeMenu, searchOpen])

  const goTo = href => {
    if (!href) return
    setMobileOpen(false)
    setActiveMenu(null)
    navigate(href)
  }

  const openMenu = label => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    setActiveMenu(label)
  }

  const scheduleCloseMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  const handleDropdownKeydown = (e, item) => {
    const hasChildren = Boolean(item.children?.length)

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (hasChildren) {
          setActiveMenu(activeMenu === item.label ? null : item.label)
        } else {
          goTo(item.href)
        }
        break
      case 'Escape':
        e.preventDefault()
        setActiveMenu(null)
        break
      case 'ArrowDown':
        if (hasChildren && activeMenu === item.label) {
          e.preventDefault()
          // Focus first item in dropdown
          const firstDropdownItem = document.querySelector(
            '[data-dropdown-item="0"]'
          )
          if (firstDropdownItem) {
            firstDropdownItem.focus()
          }
        }
        break
      case 'ArrowUp':
        if (hasChildren && activeMenu === item.label) {
          e.preventDefault()
          // Focus last item in dropdown
          const dropdownItems = document.querySelectorAll(
            '[data-dropdown-item]'
          )
          const lastDropdownItem = dropdownItems[dropdownItems.length - 1]
          if (lastDropdownItem) {
            lastDropdownItem.focus()
          }
        }
        break
    }
  }

  const handleDropdownItemKeydown = (e, index, totalItems, href) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const nextIndex = (index + 1) % totalItems
        const nextItem = document.querySelector(
          `[data-dropdown-item="${nextIndex}"]`
        )
        if (nextItem) nextItem.focus()
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prevIndex = index === 0 ? totalItems - 1 : index - 1
        const prevItem = document.querySelector(
          `[data-dropdown-item="${prevIndex}"]`
        )
        if (prevItem) prevItem.focus()
        break
      }
      case 'ArrowRight': {
        // Navigate to quick action buttons
        const quickActions = document.querySelector('[data-quick-actions]')
        if (quickActions) {
          e.preventDefault()
          const firstAction = quickActions.querySelector('button')
          if (firstAction) firstAction.focus()
        }
        break
      }
      case 'Escape': {
        e.preventDefault()
        setActiveMenu(null)
        // Return focus to the menu trigger
        const triggerButton = document.querySelector(
          `[aria-label="${activeMenu} menu"]`
        )
        if (triggerButton) triggerButton.focus()
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        goTo(href)
        break
      }
    }
  }

  const handleQuickActionKeydown = e => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        e.preventDefault()
        const buttons = e.target.parentElement.querySelectorAll('button')
        const currentIndex = Array.from(buttons).indexOf(e.target)
        const nextIndex =
          e.key === 'ArrowRight'
            ? (currentIndex + 1) % buttons.length
            : (currentIndex - 1 + buttons.length) % buttons.length
        buttons[nextIndex].focus()
        break
      }
      case 'Escape': {
        e.preventDefault()
        setActiveMenu(null)
        const triggerButton = document.querySelector(
          `[aria-label="${activeMenu} menu"]`
        )
        if (triggerButton) triggerButton.focus()
        break
      }
    }
  }

  const activeItem = useMemo(
    () =>
      navItems.find(item => item.label === activeMenu && item.children?.length),
    [activeMenu, navItems]
  )

  const isHome = location.pathname === '/'
  const headerIsLight = isHome && !scrolled && !mobileOpen

  // Helper function to check if a navigation item is active
  const isActivePage = href => {
    if (href === '/') return location.pathname === '/'

    // Check for exact match
    if (location.pathname === href) return true

    // Check if current path starts with href (for parent pages)
    if (href !== '/' && location.pathname.startsWith(href + '/')) return true

    // Special cases for dropdown items
    if (
      href === '/about' &&
      (location.pathname === '/about' ||
        location.pathname === '/testimonials' ||
        location.pathname === '/faq')
    ) {
      return true
    }
    if (href === '/services' && location.pathname.startsWith('/services')) {
      return true
    }
    if (
      href === '/work' &&
      (location.pathname.startsWith('/work') ||
        location.pathname === '/projects')
    ) {
      return true
    }

    return false
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          y: isHidden ? -120 : 0,
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        }}
        className={[
          'fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-out',
          isHovering || !headerIsLight
            ? 'bg-white/95 shadow-lg backdrop-blur border-b border-border'
            : 'bg-transparent',
        ].join(' ')}
        onMouseLeave={() => {
          setIsHovering(false)
          scheduleCloseMenu()
        }}
        onMouseEnter={() => {
          setIsHovering(true)
          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        }}
      >
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={assetUrl('images/logo.webp')}
              alt="Ghaim UAE"
              className={`h-9 w-auto ${isHovering || !headerIsLight ? 'brightness-0' : 'brightness-0 invert'}`}
              loading="lazy"
              decoding="async"
            />
            <span
              className={`text-xl font-semibold tracking-[0.12em] ${isHovering || !headerIsLight ? 'text-ink' : 'text-white'}`}
            >
              GHAIM
            </span>
          </Link>

          <HeaderDesktop
            navItems={navItems}
            isActivePage={isActivePage}
            activeMenu={activeMenu}
            isHovering={isHovering}
            headerIsLight={headerIsLight}
            openMenu={openMenu}
            scheduleCloseMenu={scheduleCloseMenu}
            goTo={goTo}
            handleDropdownKeydown={handleDropdownKeydown}
            setSearchOpen={setSearchOpen}
            setActiveMenu={setActiveMenu}
            location={location}
          />

          <HeaderMobile
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            headerIsLight={headerIsLight}
            mobileMenuButtonRef={mobileMenuButtonRef}
            services={services}
            caseStudies={caseStudies}
            isActivePage={isActivePage}
            goTo={goTo}
            setSearchOpen={setSearchOpen}
            location={location}
          />
        </div>

        <MegaMenu
          activeItem={activeItem}
          isActivePage={isActivePage}
          goTo={goTo}
          setActiveMenu={setActiveMenu}
          handleQuickActionKeydown={handleQuickActionKeydown}
          handleDropdownKeydown={handleDropdownKeydown}
          handleDropdownItemKeydown={handleDropdownItemKeydown}
          isHovering={isHovering}
          headerIsLight={headerIsLight}
        />
      </motion.header>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default GhaimAEHeader
