import { Link } from 'react-router-dom'
import { SearchButton } from './SearchButton'
import ScribbleButton from './ScribbleButton'

/**
 * NavItem — desktop nav link or dropdown trigger.
 * Original brand colors preserved; luxury refinements applied to
 * typography, spacing, underline animation, and chevron.
 */
const NavItem = ({
  item,
  isActive,
  isLight,
  activeMenu,
  openMenu,
  scheduleCloseMenu,
  handleDropdownKeydown,
  setActiveMenu,
}) => {
  const hasChildren = Boolean(item.children?.length)
  const isOpen = activeMenu === item.label

  // ── Original brand color classes ──
  const colorClass = isLight
    ? isActive
      ? 'text-white'
      : 'text-white/80 hover:text-white'
    : isActive
    ? 'text-ink'
    : 'text-ink-muted hover:text-ink'

  const shared = `relative inline-flex items-center gap-1.5 outline-none
    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    rounded-sm transition-colors duration-200 ${colorClass}`

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }

  // Underline bar — white on hero, ink on scrolled
  const lineBase = `absolute bottom-[-3px] left-0 h-px transition-all duration-300`
  const lineColor = isLight ? 'bg-white' : 'bg-ink'

  return (
    <div className="group relative flex items-center">
      {hasChildren ? (
        <button
          type="button"
          style={labelStyle}
          onMouseEnter={() => openMenu(item.label)}
          onFocus={() => openMenu(item.label)}
          onBlur={scheduleCloseMenu}
          onKeyDown={e => handleDropdownKeydown(e, item)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`${item.label} menu`}
          className={shared}
        >
          {item.label}

          {/* Thin chevron — rotates on open */}
          <svg
            width="9"
            height="9"
            viewBox="0 0 10 10"
            fill="none"
            className="mt-px opacity-50"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Active underline */}
          <span
            aria-hidden
            className={`${lineBase} ${lineColor}`}
            style={{ width: isActive || isOpen ? '100%' : '0%', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
          {/* Hover underline */}
          <span
            aria-hidden
            className={`${lineBase} ${lineColor} w-0 opacity-0 group-hover:w-full group-hover:opacity-100`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
        </button>
      ) : (
        <Link
          to={item.href}
          style={labelStyle}
          onFocus={() => setActiveMenu(null)}
          onClick={() => setActiveMenu(null)}
          aria-current={isActive ? 'page' : undefined}
          className={shared}
        >
          {item.label}

          {/* Active underline */}
          <span
            aria-hidden
            className={`${lineBase} ${lineColor}`}
            style={{ width: isActive ? '100%' : '0%', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
          {/* Hover underline */}
          <span
            aria-hidden
            className={`${lineBase} ${lineColor} w-0 opacity-0 group-hover:w-full group-hover:opacity-100`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          />
        </Link>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

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
  const isLight = headerIsLight && !isHovering

  return (
    <nav
      className="hidden items-center lg:flex"
      aria-label="Main navigation"
      style={{ gap: '32px' }}
    >
      {/* ── Nav links ── */}
      <div className="flex items-center" style={{ gap: '28px' }}>
        {navItems.map(item => (
          <NavItem
            key={item.label}
            item={item}
            isActive={isActivePage(item.href)}
            isLight={isLight}
            activeMenu={activeMenu}
            openMenu={openMenu}
            scheduleCloseMenu={scheduleCloseMenu}
            handleDropdownKeydown={handleDropdownKeydown}
            setActiveMenu={setActiveMenu}
          />
        ))}
      </div>

      {/* ── Subtle divider ── */}
      <div
        aria-hidden
        className={`h-[18px] w-px transition-colors duration-300 ${isLight ? 'bg-white/20' : 'bg-border'}`}
      />

      {/* ── Search + CTA ── */}
      <div className="flex items-center gap-3">
        <SearchButton
          onClick={() => {
            setActiveMenu(null)
            setSearchOpen(true)
          }}
          isLight={isLight}
        />

        {/* Original ScribbleButton — brand styles untouched */}
        <ScribbleButton
          to="/contact"
          ariaLabel="Contact"
          className="w-auto rounded-full inline-flex items-center justify-center gap-2 bg-white px-6 py-2 text-sm font-semibold text-black shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition hover:bg-white/90 hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-current={location.pathname === '/contact' ? 'page' : undefined}
        >
          Contact
        </ScribbleButton>
      </div>
    </nav>
  )
}