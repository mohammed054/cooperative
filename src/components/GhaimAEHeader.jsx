import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { caseStudies, services } from '../data/siteData';
import { assetUrl } from '../lib/assetUrl';
import ScribbleButton from './ScribbleButton';
import Search from './Search';
import { useFocusTrap } from '../hooks/useFocusTrap';

const GhaimAEHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const { containerRef: mobileMenuRef } = useFocusTrap(mobileOpen);

  const navItems = useMemo(() => [
    {
      label: 'Services',
      href: '/services',
      children: services.map((service) => ({
        label: service.title,
        description: service.summary,
        href: `/services/${service.slug}`,
      })),
    },
    {
      label: 'Work',
      href: '/work',
      children: [
        ...caseStudies.map((study) => ({
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
        { label: 'About', description: 'Our team and principles', href: '/about' },
        { label: 'Testimonials', description: 'Client feedback', href: '/testimonials' },
        { label: 'FAQ', description: 'Planning questions', href: '/faq' },
      ],
    },
    { label: 'Pricing', href: '/pricing' },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        if (mobileOpen) {
          setIsHidden(false);
        } else if (currentY <= 20) {
          setIsHidden(false);
        } else if (currentY > lastScrollY.current) {
          setIsHidden(false);
        } else if (currentY < lastScrollY.current) {
          setIsHidden(true);
        }

        setScrolled(currentY > 30);
        lastScrollY.current = currentY;
      }, 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Global search shortcut (Ctrl/Cmd + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
        } else if (mobileOpen) {
          setMobileOpen(false);
          if (mobileMenuButtonRef.current) {
            mobileMenuButtonRef.current.focus();
          }
        } else if (activeMenu) {
          setActiveMenu(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [mobileOpen, activeMenu, searchOpen]);

  const goTo = (href) => {
    if (!href) return;
    navigate(href);
    setMobileOpen(false);
  };

  const openMenu = (label) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveMenu(label);
  };

  const scheduleCloseMenu = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setActiveMenu(null), 220);
  };

  const handleDropdownKeydown = (e, item) => {
    const hasChildren = Boolean(item.children?.length);
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (hasChildren) {
          setActiveMenu(activeMenu === item.label ? null : item.label);
        } else {
          goTo(item.href);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveMenu(null);
        break;
      case 'ArrowDown':
        if (hasChildren && activeMenu === item.label) {
          e.preventDefault();
          // Focus first item in dropdown
          const firstDropdownItem = document.querySelector('[data-dropdown-item="0"]');
          if (firstDropdownItem) {
            firstDropdownItem.focus();
          }
        }
        break;
      case 'ArrowUp':
        if (hasChildren && activeMenu === item.label) {
          e.preventDefault();
          // Focus last item in dropdown
          const dropdownItems = document.querySelectorAll('[data-dropdown-item]');
          const lastDropdownItem = dropdownItems[dropdownItems.length - 1];
          if (lastDropdownItem) {
            lastDropdownItem.focus();
          }
        }
        break;
    }
  };

  const handleDropdownItemKeydown = (e, index, totalItems, href) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = (index + 1) % totalItems;
        const nextItem = document.querySelector(`[data-dropdown-item="${nextIndex}"]`);
        if (nextItem) nextItem.focus();
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevIndex = index === 0 ? totalItems - 1 : index - 1;
        const prevItem = document.querySelector(`[data-dropdown-item="${prevIndex}"]`);
        if (prevItem) prevItem.focus();
        break;
      }
      case 'ArrowRight': {
        // Navigate to quick action buttons
        const quickActions = document.querySelector('[data-quick-actions]');
        if (quickActions) {
          e.preventDefault();
          const firstAction = quickActions.querySelector('button');
          if (firstAction) firstAction.focus();
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setActiveMenu(null);
        // Return focus to the menu trigger
        const triggerButton = document.querySelector(`[aria-label="${activeMenu} menu"]`);
        if (triggerButton) triggerButton.focus();
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        goTo(href);
        break;
      }
    }
  };

  const handleQuickActionKeydown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight': {
        e.preventDefault();
        const buttons = e.target.parentElement.querySelectorAll('button');
        const currentIndex = Array.from(buttons).indexOf(e.target);
        const nextIndex = e.key === 'ArrowRight' 
          ? (currentIndex + 1) % buttons.length 
          : (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setActiveMenu(null);
        const triggerButton = document.querySelector(`[aria-label="${activeMenu} menu"]`);
        if (triggerButton) triggerButton.focus();
        break;
      }
    }
  };

  const activeItem = useMemo(
    () => navItems.find((item) => item.label === activeMenu && item.children?.length),
    [activeMenu, navItems],
  );

  const isHome = location.pathname === '/';
  const headerIsLight = isHome && !scrolled && !mobileOpen;

  // Helper function to check if a navigation item is active
  const isActivePage = (href) => {
    if (href === '/') return location.pathname === '/';
    
    // Check for exact match
    if (location.pathname === href) return true;
    
    // Check if current path starts with href (for parent pages)
    if (href !== '/' && location.pathname.startsWith(href + '/')) return true;
    
    // Special cases for dropdown items
    if (href === '/about' && (location.pathname === '/about' || location.pathname === '/testimonials' || location.pathname === '/faq')) {
      return true;
    }
    if (href === '/services' && location.pathname.startsWith('/services')) {
      return true;
    }
    if (href === '/work' && (location.pathname.startsWith('/work') || location.pathname === '/projects')) {
      return true;
    }
    
    return false;
  };

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
          isHovering || (!headerIsLight) ? 'bg-white/95 shadow-lg backdrop-blur border-b border-border' : 'bg-transparent',
        ].join(' ')}
        onMouseLeave={() => {
          setIsHovering(false);
          scheduleCloseMenu();
        }}
        onMouseEnter={() => {
          setIsHovering(true);
          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        }}
      >
        <div
          className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        >
          <Link to="/" className="flex items-center gap-3">
            <img
              src={assetUrl('images/logo.webp')}
              alt="Ghaim UAE"
              className={`h-9 w-auto ${isHovering || (!headerIsLight) ? 'brightness-0' : 'brightness-0 invert'}`}
              loading="lazy"
              decoding="async"
            />
            <span className={`text-xl font-semibold tracking-[0.12em] ${isHovering || (!headerIsLight) ? 'text-ink' : 'text-white'}`}>
              GHAIM
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isActive = isActivePage(item.href);
              return (
                <div key={item.label} className="group relative">
                  {hasChildren ? (
                    <button
                      type="button"
                      onMouseEnter={() => openMenu(item.label)}
                      onFocus={() => openMenu(item.label)}
                      onBlur={() => scheduleCloseMenu()}
                      onKeyDown={(e) => handleDropdownKeydown(e, item)}
                      className={[
                        'inline-flex items-center gap-2 text-sm font-semibold transition outline-none rounded-sm',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                        isHovering || (!headerIsLight) 
                          ? isActive 
                            ? 'text-ink' 
                            : 'text-ink-muted hover:text-ink' 
                          : isActive 
                            ? 'text-white' 
                            : 'text-white/80 hover:text-white',
                      ].join(' ')}
                      aria-expanded={activeMenu === item.label}
                      aria-haspopup="true"
                      aria-label={`${item.label} menu`}
                    >
                      {item.label}
                      <FaChevronDown
                        className={[
                          'text-[10px] opacity-70 transition',
                          activeMenu === item.label ? 'rotate-180' : '',
                        ].join(' ')}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onFocus={() => setActiveMenu(null)}
                      className={[
                        'inline-flex items-center gap-2 text-sm font-semibold transition rounded-sm',
                        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none',
                        'relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5',
                        isHovering || (!headerIsLight) 
                          ? isActive 
                            ? 'text-ink after:bg-ink' 
                            : 'text-ink-muted hover:text-ink after:bg-transparent' 
                          : isActive 
                            ? 'text-white after:bg-white' 
                            : 'text-white/80 hover:text-white after:bg-transparent',
                      ].join(' ')}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={[
                'inline-flex items-center gap-2 text-sm font-semibold transition rounded-sm',
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none px-3 py-1',
                isHovering || (!headerIsLight) 
                  ? 'text-ink-muted hover:text-ink' 
                  : 'text-white/80 hover:text-white',
              ].join(' ')}
              aria-label="Open search (Ctrl+K)"
            >
              <FaSearch className="text-xs" />
              <span className="hidden sm:inline">Search</span>
            </button>
            
            <ScribbleButton 
              to="/contact" 
              className={`btn-primary text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none ${
                location.pathname === '/contact' ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              aria-current={location.pathname === '/contact' ? 'page' : undefined}
            >
              Contact
            </ScribbleButton>
          </nav>

          <button
            ref={mobileMenuButtonRef}
            className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition ${
              isHovering || (!headerIsLight) ? 'text-ink hover:bg-surface' : 'text-white hover:bg-white/10'
            } lg:hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none`}
            onClick={() => setMobileOpen(!mobileOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMobileOpen(!mobileOpen);
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
        </div>

        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
              onMouseEnter={() => openMenu(activeItem.label)}
              onMouseLeave={scheduleCloseMenu}
            >
               <div className="border-t border-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                 <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                   {/* Mega Menu Header */}
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                     <div className="lg:col-span-2">
                       <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">{activeItem.label}</p>
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
                             <button
                               onClick={() => goTo('/services')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               All Services
                             </button>
                             <button
                               onClick={() => goTo('/contact')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 border border-border bg-surface-2 text-ink rounded-full hover:bg-surface-3 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               Get Quote
                             </button>
                           </>
                         )}
                         {activeItem.label === 'Work' && (
                           <>
                             <button
                               onClick={() => goTo('/projects')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               View Gallery
                             </button>
                             <button
                               onClick={() => goTo('/contact')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 border border-border bg-surface-2 text-ink rounded-full hover:bg-surface-3 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               Discuss Project
                             </button>
                           </>
                         )}
                         {activeItem.label === 'Company' && (
                           <>
                             <button
                               onClick={() => goTo('/contact')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               Contact Team
                             </button>
                             <button
                               onClick={() => goTo('/process')}
                               onKeyDown={handleQuickActionKeydown}
                               className="text-xs px-3 py-1.5 border border-border bg-surface-2 text-ink rounded-full hover:bg-surface-3 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               Our Process
                             </button>
                           </>
                         )}
                       </div>
                     </div>
                     
                       {/* Featured Content */}
                       <div className="hidden lg:block">
                         <div className="bg-surface-2 rounded-xl p-4">
                           <h4 className="text-sm font-semibold text-ink mb-3">Featured</h4>
                           
                           {/* Featured Content */}
                           {activeItem.label === 'Services' && (
                             <div className="mb-4">
                               <p className="text-xs text-ink-muted mb-2">Most Popular</p>
                               <button
                                 onClick={() => goTo('/services/event-production')}
                                 className="w-full text-left group"
                               >
                                 <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">Event Production</p>
                                 <p className="text-xs text-ink-muted mt-1">Complete event management</p>
                               </button>
                             </div>
                           )}
                           {activeItem.label === 'Work' && (
                             <div className="mb-4">
                               <p className="text-xs text-ink-muted mb-2">Latest Project</p>
                               <button
                                 onClick={() => goTo('/work/skyline-investor-summit')}
                                 className="w-full text-left group"
                               >
                                 <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">Skyline Summit</p>
                                 <p className="text-xs text-ink-muted mt-1">Elite corporate event</p>
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
                                 <p className="text-sm font-medium text-ink group-hover:text-primary transition-colors">Client Stories</p>
                                 <p className="text-xs text-ink-muted mt-1">Read testimonials</p>
                               </button>
                             </div>
                           )}
                           
                           {/* Search within category */}
                           <div className="pt-3 border-t border-border">
                             <p className="text-xs text-ink-muted mb-2">Search {activeItem.label}</p>
                             <button
                               onClick={() => {
                                 setActiveMenu(null);
                                 setSearchOpen(true);
                               }}
                               className="w-full flex items-center gap-2 text-xs px-3 py-2 bg-white border border-border rounded-lg hover:border-primary/30 hover:bg-surface-1 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
                             >
                               <FaSearch className="text-ink-muted" />
                               <span className="text-ink-muted">Search {activeItem.label.toLowerCase()}...</span>
                             </button>
                           </div>
                         </div>
                       </div>
                   </div>
                   
                   {/* Menu Items Grid */}
                   <div className={`grid gap-3 ${
                     activeItem.children.length <= 4 
                       ? 'grid-cols-1 md:grid-cols-2' 
                       : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                   }`}>
                     {activeItem.children.map((child, index) => (
                       <button
                         key={child.href}
                         data-dropdown-item={index}
                         onClick={() => goTo(child.href)}
                         onKeyDown={(e) => handleDropdownItemKeydown(e, index, activeItem.children.length, child.href)}
                         className="group relative rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-surface-3 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none overflow-hidden"
                       >
                         <div className="flex items-start justify-between gap-3">
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">{child.label}</p>
                             <p className="text-xs text-ink-muted mt-1 line-clamp-2">{child.description}</p>
                           </div>
                           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <FaChevronDown className="text-xs text-ink-muted rotate-270" />
                           </div>
                         </div>
                         
                         {/* Hover indicator */}
                         <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                       </button>
                     ))}
                   </div>
                   
                   {/* Footer */}
                   <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                     <p className="text-xs text-ink-muted">
                       {activeItem.label === 'Services' && 'Need help choosing? Contact our team'}
                       {activeItem.label === 'Work' && 'Like what you see? Let\'s discuss your project'}
                       {activeItem.label === 'Company' && 'Questions? We\'re here to help'}
                     </p>
                     <button
                       onClick={() => {
                         setActiveMenu(null);
                         goTo('/contact');
                       }}
                       className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none rounded-sm px-2 py-1"
                     >
                       Get in touch →
                     </button>
                    </div>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="lg:hidden"
            >
              <div 
                ref={mobileMenuRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-menu-title"
                className="border-t border-border bg-surface-2 px-5 pb-6 pt-4"
              >
                <h2 id="mobile-menu-title" className="sr-only">Mobile navigation menu</h2>
                <div className="grid gap-2">
                  <button 
                    onClick={() => goTo('/')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/') ? 'page' : undefined}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => goTo('/services')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/services') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/services') ? 'page' : undefined}
                  >
                    Services
                  </button>
                  <button 
                    onClick={() => goTo('/work')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/work') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/work') ? 'page' : undefined}
                  >
                    Work
                  </button>
                  <button 
                    onClick={() => goTo('/process')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/process') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/process') ? 'page' : undefined}
                  >
                    Process
                  </button>
                  <button 
                    onClick={() => goTo('/pricing')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/pricing') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/pricing') ? 'page' : undefined}
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => goTo('/about')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/about') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/about') ? 'page' : undefined}
                  >
                    About
                  </button>
                  <button 
                    onClick={() => goTo('/testimonials')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/testimonials') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/testimonials') ? 'page' : undefined}
                  >
                    Testimonials
                  </button>
                  <button 
                    onClick={() => goTo('/faq')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/faq') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/faq') ? 'page' : undefined}
                  >
                    FAQ
                  </button>
                  <button 
                    onClick={() => goTo('/privacy')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/privacy') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/privacy') ? 'page' : undefined}
                  >
                    Privacy
                  </button>
                  <button 
                    onClick={() => goTo('/terms')} 
                    className={`text-left text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                      isActivePage('/terms') ? 'text-primary bg-primary/10' : 'text-ink hover:text-primary'
                    }`}
                    aria-current={isActivePage('/terms') ? 'page' : undefined}
                  >
                    Terms
                  </button>
                  
                  {/* Mobile Search Button */}
                  <button 
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 mt-2"
                  >
                    <FaSearch className="text-xs" />
                    <span>Search Site</span>
                  </button>
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Services</p>
                    <div className="mt-2 grid gap-2">
                      {services.map((service) => (
                        <button
                          key={service.slug}
                          onClick={() => goTo(`/services/${service.slug}`)}
                          className={`text-left text-sm transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                            location.pathname === `/services/${service.slug}` 
                              ? 'text-primary bg-primary/10' 
                              : 'text-ink-muted hover:text-primary'
                          }`}
                          aria-current={location.pathname === `/services/${service.slug}` ? 'page' : undefined}
                        >
                          {service.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Work</p>
                    <div className="mt-2 grid gap-2">
                      {caseStudies.map((study) => (
                        <button
                          key={study.slug}
                          onClick={() => goTo(`/work/${study.slug}`)}
                          className={`text-left text-sm transition rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none px-2 py-1 ${
                            location.pathname === `/work/${study.slug}` 
                              ? 'text-primary bg-primary/10' 
                              : 'text-ink-muted hover:text-primary'
                          }`}
                          aria-current={location.pathname === `/work/${study.slug}` ? 'page' : undefined}
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
                        aria-current={location.pathname === '/projects' ? 'page' : undefined}
                      >
                        Project gallery
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <ScribbleButton 
                    to="/contact" 
                    onClick={() => setMobileOpen(false)} 
                    className={`btn-primary w-full text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none ${
                      location.pathname === '/contact' ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    aria-current={location.pathname === '/contact' ? 'page' : undefined}
                  >
                    Contact
                  </ScribbleButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Search Modal */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default GhaimAEHeader;
