import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaChevronDown, FaHome } from 'react-icons/fa'
import { services, caseStudies } from '../data/siteData'

const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }

    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const getBreadcrumbName = (segment, index) => {
    const fullPath = '/' + pathnames.slice(0, index + 1).join('/')

    // Service detail pages
    if (pathnames[0] === 'services' && index === 1) {
      const service = services.find(s => s.slug === segment)
      return service ? service.title : segment
    }

    // Case study detail pages
    if (pathnames[0] === 'work' && index === 1) {
      const caseStudy = caseStudies.find(c => c.slug === segment)
      return caseStudy ? caseStudy.title : segment
    }

    // Regular pages
    const pageNames = {
      services: 'Services',
      work: 'Work',
      process: 'Process',
      about: 'About',
      testimonials: 'Testimonials',
      pricing: 'Pricing',
      faq: 'FAQ',
      contact: 'Contact',
      projects: 'Projects',
      privacy: 'Privacy',
      terms: 'Terms',
    }

    return pageNames[segment] || segment
  }

  const hasDropdown = (segment, index) => {
    return segment === 'services' || segment === 'work' || segment === 'about'
  }

  const getDropdownItems = segment => {
    switch (segment) {
      case 'services':
        return services.map(service => ({
          label: service.title,
          href: `/services/${service.slug}`,
          description: service.summary,
        }))
      case 'work':
        return [
          ...caseStudies.map(study => ({
            label: study.title,
            href: `/work/${study.slug}`,
            description: study.location,
          })),
          {
            label: 'Project Gallery',
            href: '/projects',
            description: 'Browse production visuals',
          },
        ]
      case 'about':
        return [
          {
            label: 'About Us',
            href: '/about',
            description: 'Our team and principles',
          },
          {
            label: 'Testimonials',
            href: '/testimonials',
            description: 'Client feedback',
          },
          {
            label: 'FAQ',
            href: '/faq',
            description: 'Planning questions',
          },
        ]
      default:
        return []
    }
  }

  const handleDropdownToggle = (segment, e) => {
    e.preventDefault()
    setActiveDropdown(activeDropdown === segment ? null : segment)
  }

  const handleDropdownKeydown = (e, segment) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveDropdown(activeDropdown === segment ? null : segment)
    }
  }

  if (pathnames.length === 0) return null

  return (
    <nav
      className="breadcrumb-nav bg-surface-1 border-b border-border"
      aria-label="Breadcrumb"
      role="navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="breadcrumb-list flex items-center gap-2 py-3 text-sm">
          <li className="breadcrumb-item flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-ink-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-sm outline-none px-2 py-1"
              aria-label="Navigate to home page"
            >
              <FaHome className="text-xs" />
              <span>Home</span>
            </Link>
          </li>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
            const isLast = index === pathnames.length - 1
            const showDropdown = hasDropdown(name, index)
            const dropdownItems = showDropdown ? getDropdownItems(name) : []

            return (
              <li
                key={routeTo}
                className="breadcrumb-item flex items-center gap-2"
              >
                <span className="breadcrumb-separator text-ink-subtle">/</span>

                {isLast ? (
                  <span
                    className="breadcrumb-current text-ink font-medium px-2 py-1 rounded-sm bg-primary/10"
                    aria-current="page"
                  >
                    {getBreadcrumbName(name, index)}
                  </span>
                ) : showDropdown ? (
                  <div
                    className="relative"
                    ref={activeDropdown === name ? dropdownRef : null}
                  >
                    <button
                      type="button"
                      onClick={e => handleDropdownToggle(name, e)}
                      onKeyDown={e => handleDropdownKeydown(e, name)}
                      className="flex items-center gap-1 text-ink-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-sm outline-none px-2 py-1 rounded-sm"
                      aria-expanded={activeDropdown === name}
                      aria-haspopup="true"
                      aria-label={`${getBreadcrumbName(name, index)} menu`}
                    >
                      <span>{getBreadcrumbName(name, index)}</span>
                      <FaChevronDown
                        className={`text-xs transition-transform ${activeDropdown === name ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {activeDropdown === name && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-50">
                        <div className="p-2">
                          {dropdownItems.map((item, itemIndex) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-3 py-2 text-sm rounded-md hover:bg-surface-2 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
                            >
                              <div className="font-medium text-ink">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-xs text-ink-muted mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-ink-muted hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded-sm outline-none px-2 py-1 rounded-sm"
                  >
                    {getBreadcrumbName(name, index)}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumbs
