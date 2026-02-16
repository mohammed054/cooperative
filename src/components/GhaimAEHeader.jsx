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
  const lastScrollYRef = useRef(0)
  const scrollRafRef = useRef(null)
  const hiddenRef = useRef(false)
  const scrolledRef = useRef(false)
  const mobileOpenRef = useRef(false)
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
    const TOP_THRESHOLD = 4
    const DELTA_THRESHOLD = 6

    const applyScrollState = () => {
      const currentY = Math.max(window.scrollY, 0)
      const delta = currentY - lastScrollYRef.current
      const absDelta = Math.abs(delta)
      const nextScrolled = currentY > TOP_THRESHOLD
      let nextHidden = hiddenRef.current

      if (mobileOpenRef.current || currentY <= TOP_THRESHOLD) {
        nextHidden = false
      } else if (absDelta >= DELTA_THRESHOLD) {
        nextHidden = delta > 0
      }

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden
        setIsHidden(nextHidden)
      }

      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled
        setScrolled(nextScrolled)
      }

      lastScrollYRef.current = currentY
      scrollRafRef.current = null
    }

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return
      scrollRafRef.current = requestAnimationFrame(applyScrollState)
    }

    lastScrollYRef.current = Math.max(window.scrollY, 0)
    scrolledRef.current = lastScrollYRef.current > TOP_THRESHOLD
    hiddenRef.current = false
    setScrolled(scrolledRef.current)
    setIsHidden(false)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    mobileOpenRef.current = mobileOpen
    if (mobileOpen) hiddenRef.current = false
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
          y: isHidden ? '-100%' : '0%',
          opacity: isHidden ? 0 : 1,
        }}
        transition={{ duration: 0.26, ease: [0.33, 1, 0.68, 1] }}
        className={[
          'fixed left-0 right-0 top-0 z-50 border-b will-change-transform',
          'transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out',
          isHovering || !headerIsLight
            ? 'bg-white/95 border-border shadow-lg backdrop-blur'
            : 'bg-transparent border-transparent shadow-none backdrop-blur-0',
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
        <div className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
          goTo={goTo}
          setActiveMenu={setActiveMenu}
          handleQuickActionKeydown={handleQuickActionKeydown}
          handleDropdownItemKeydown={handleDropdownItemKeydown}
        />
      </motion.header>

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
