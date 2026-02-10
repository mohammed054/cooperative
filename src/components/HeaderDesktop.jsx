import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
import { ButtonLink } from './Button'
import { SearchButton } from './SearchButton'
import ScribbleButton from './ScribbleButton'

export const HeaderDesktop = ({
  navItems,
  isActivePage,
  activeMenu,
  isHovering,
  headerIsLight,
  openMenu,
  scheduleCloseMenu,
  goTo,
  handleDropdownKeydown,
  setSearchOpen,
  setActiveMenu,
  location,
}) => {
  return (
    <nav
      className="hidden items-center gap-6 lg:flex"
      aria-label="Main navigation"
    >
      {navItems.map(item => {
        const hasChildren = Boolean(item.children?.length)
        const isActive = isActivePage(item.href)

        return (
          <div key={item.label} className="group relative">
            {hasChildren ? (
              <button
                type="button"
                onMouseEnter={() => openMenu(item.label)}
                onFocus={() => openMenu(item.label)}
                onBlur={scheduleCloseMenu}
                onKeyDown={e => handleDropdownKeydown(e, item)}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                  isHovering || !headerIsLight
                    ? isActive
                      ? 'text-ink'
                      : 'text-ink-muted hover:text-ink'
                    : isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                }`}
                aria-expanded={activeMenu === item.label}
                aria-haspopup="true"
                aria-label={`${item.label} menu`}
              >
                {item.label}
                <FaChevronDown
                  className={`text-[10px] opacity-70 transition ${
                    activeMenu === item.label ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : (
              <Link
                to={item.href}
                onFocus={() => setActiveMenu(null)}
                onClick={() => setActiveMenu(null)}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 ${
                  isHovering || !headerIsLight
                    ? isActive
                      ? 'text-ink after:bg-ink'
                      : 'text-ink-muted hover:text-ink after:bg-transparent'
                    : isActive
                      ? 'text-white after:bg-white'
                      : 'text-white/80 hover:text-white after:bg-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}

      {/* Search Button */}
      <SearchButton
        onClick={() => {
          setActiveMenu(null)
          setSearchOpen(true)
        }}
        isLight={headerIsLight && !isHovering}
      />

      <ScribbleButton
        to="/contact"
        className={`btn-primary text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary outline-none ${
          location.pathname === '/contact'
            ? 'ring-2 ring-offset-2 ring-primary'
            : ''
        }`}
        aria-current={location.pathname === '/contact' ? 'page' : undefined}
      >
        Contact
      </ScribbleButton>
    </nav>
  )
}
