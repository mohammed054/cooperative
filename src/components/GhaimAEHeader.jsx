import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { caseStudies, services } from '../data/siteData';
import { assetUrl } from '../lib/assetUrl';
import ScribbleButton from './ScribbleButton';

const GhaimAEHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const navItems = [
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
  ];

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
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

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

  const activeItem = useMemo(
    () => navItems.find((item) => item.label === activeMenu && item.children?.length),
    [activeMenu, navItems],
  );

  const isHome = location.pathname === '/';
  const headerIsLight = isHome && !scrolled && !mobileOpen;

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

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              return (
                <div key={item.label} className="group relative">
                  <Link
                    to={item.href}
                    onMouseEnter={() => (hasChildren ? openMenu(item.label) : setActiveMenu(null))}
                    onFocus={() => (hasChildren ? openMenu(item.label) : setActiveMenu(null))}
                    className={[
                      'inline-flex items-center gap-2 text-sm font-semibold transition',
                      isHovering || (!headerIsLight) ? 'text-ink-muted hover:text-ink' : 'text-white/80 hover:text-white',
                    ].join(' ')}
                    aria-expanded={activeMenu === item.label}
                  >
                    {item.label}
                    {hasChildren && (
                      <FaChevronDown
                        className={[
                          'text-[10px] opacity-70 transition',
                          activeMenu === item.label ? 'rotate-180' : '',
                        ].join(' ')}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
            <ScribbleButton to="/contact" className="btn-primary text-sm">
              Contact
            </ScribbleButton>
          </nav>

          <button
            className={`flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition ${
              isHovering || (!headerIsLight) ? 'text-ink hover:bg-surface' : 'text-white hover:bg-white/10'
            } lg:hidden`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
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
                <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-8">
                  <div>
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
                  </div>
                  <div className="grid gap-3">
                    {activeItem.children.map((child) => (
                      <button
                        key={child.href}
                        type="button"
                        onClick={() => goTo(child.href)}
                        className="w-full rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left transition hover:border-ink hover:bg-surface-3"
                      >
                        <p className="text-sm font-semibold text-ink">{child.label}</p>
                        <p className="text-xs text-ink-muted">{child.description}</p>
                      </button>
                    ))}
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
              <div className="border-t border-border bg-surface-2 px-5 pb-6 pt-4">
                <div className="grid gap-2">
                  <button onClick={() => goTo('/')} className="text-left text-sm font-semibold text-ink">
                    Home
                  </button>
                  <button onClick={() => goTo('/services')} className="text-left text-sm font-semibold text-ink">
                    Services
                  </button>
                  <button onClick={() => goTo('/work')} className="text-left text-sm font-semibold text-ink">
                    Work
                  </button>
                  <button onClick={() => goTo('/process')} className="text-left text-sm font-semibold text-ink">
                    Process
                  </button>
                  <button onClick={() => goTo('/pricing')} className="text-left text-sm font-semibold text-ink">
                    Pricing
                  </button>
                  <button onClick={() => goTo('/about')} className="text-left text-sm font-semibold text-ink">
                    About
                  </button>
                  <button onClick={() => goTo('/testimonials')} className="text-left text-sm font-semibold text-ink">
                    Testimonials
                  </button>
                  <button onClick={() => goTo('/faq')} className="text-left text-sm font-semibold text-ink">
                    FAQ
                  </button>
                  <button onClick={() => goTo('/privacy')} className="text-left text-sm font-semibold text-ink">
                    Privacy
                  </button>
                  <button onClick={() => goTo('/terms')} className="text-left text-sm font-semibold text-ink">
                    Terms
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
                          className="text-left text-sm text-ink-muted hover:text-ink"
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
                          className="text-left text-sm text-ink-muted hover:text-ink"
                        >
                          {study.title}
                        </button>
                      ))}
                      <button onClick={() => goTo('/projects')} className="text-left text-sm text-ink-muted hover:text-ink">
                        Project gallery
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <ScribbleButton to="/contact" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-sm">
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
    </>
  );
};

export default GhaimAEHeader;
