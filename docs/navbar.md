# COMPREHENSIVE NAVBAR DOCUMENTATION - GHAIM UAE

**Purpose**: Complete technical and visual reference for the navbar system. This document explains every behavior, pixel, state, animation, accessibility feature, and mobile responsiveness consideration.

**Version**: 1.0
**Last Updated**: February 2026

---

# TABLE OF CONTENTS

1. [Architecture Overview](#1-architecture-overview)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Desktop Navigation (HeaderDesktop)](#3-desktop-navigation-headerdesktop)
4. [MegaMenu Dropdown](#4-megamenu-dropdown)
5. [Mobile Navigation (HeaderMobile)](#5-mobile-navigation-headermobile)
6. [Header Container (GhaimAEHeader)](#6-header-container-ghaimaEheader)
7. [Search Modal](#7-search-modal)
8. [Focus Trap Hook](#8-focus-trap-hook)
9. [State Management](#9-state-management)
10. [Accessibility (A11y)](#10-accessibility-a11y)
11. [Animations & Transitions](#11-animations--transitions)
12. [Mobile Responsiveness Analysis](#12-mobile-responsiveness-analysis)
13. [Issues & Recommendations](#13-issues--recommendations)
14. [Performance Considerations](#14-performance-considerations)
15. [Browser-Specific Notes](#15-browser-specific-notes)

---

# 1. ARCHITECTURE OVERVIEW

## 1.1 What is the Navbar System?

The navbar system is the primary navigation component that appears at the top of every page. It consists of:

- A fixed header that stays at the top of the viewport
- Desktop navigation with dropdown menus (visible at 1024px+)
- Mobile hamburger menu with slide-out drawer (visible below 1024px)
- Search modal triggered by Cmd/Ctrl+K
- Mega-menu dropdown for Services, Work, and Company sections

## 1.2 Design Philosophy

The navbar follows these principles:

1. **Context-Aware**: Changes appearance based on page (home vs subpages) and scroll position
2. **Transparent to Solid**: Starts transparent on hero sections, becomes solid on scroll
3. **Hide on Scroll Down**: Header slides up when scrolling down, reveals when scrolling up
4. **Full Mobile Experience**: Complete navigation in drawer, not just a collapsed menu
5. **Keyboard First**: Full keyboard navigation support with focus management

## 1.3 File Locations

| File             | Path                               | Purpose                                     |
| ---------------- | ---------------------------------- | ------------------------------------------- |
| Parent Container | `src/components/GhaimAEHeader.jsx` | Main header, state management, scroll logic |
| Desktop Nav      | `src/components/HeaderDesktop.jsx` | Desktop navigation items and dropdowns      |
| Mobile Nav       | `src/components/HeaderMobile.jsx`  | Hamburger button and mobile drawer          |
| MegaMenu         | `src/components/MegaMenu.jsx`      | Dropdown panel for desktop                  |
| Search Modal     | `src/components/Search.jsx`        | Search functionality                        |
| Focus Trap       | `src/hooks/useFocusTrap.js`        | Accessibility hook for focus management     |
| Search Hook      | `src/hooks/useSearch.js`           | Search logic and results                    |

---

# 2. COMPONENT HIERARCHY

## 2.1 Tree Structure

```
GhaimAEHeader (parent)
├── motion.header (container)
│   ├── Logo (Link)
│   ├── HeaderDesktop (nav - hidden < 1024px)
│   │   ├── NavItem[] (with/without children)
│   │   ├── SearchButton
│   │   └── ScribbleButton (Contact CTA)
│   └── HeaderMobile (hamburger - hidden >= 1024px)
│       ├── HamburgerButton (closed state)
│       └── MobileDrawer (open state)
│           ├── MainNavButtons[]
│           ├── ServicesSection
│           ├── WorkSection
│           └── ContactButton
├── MegaMenu (dropdown - desktop only, hidden < 1024px)
├── MobileBackdrop (overlay when mobile menu open)
└── Search (modal - Cmd+K or search icon)
```

## 2.2 Data Flow

```
                    ┌─────────────────┐
                    │ GhaimAEHeader  │
                    │ (Parent)       │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ HeaderDesktop │   │  HeaderMobile │   │    Search    │
│   (navItems)  │   │   (services,  │   │ (isOpen,     │
│   (location)  │   │    caseStudies)│   │  onClose)    │
└───────────────┘   └───────────────┘   └───────────────┘
         │
         ▼
┌───────────────┐
│   MegaMenu    │
│ (activeItem)  │
└───────────────┘
```

## 2.3 Props Passed to Components

### HeaderDesktop Props

```javascript
{
  navItems: Array,          // Navigation items with children
  isActivePage: Function,   // Check if page is active
  activeMenu: string|null,  // Currently open dropdown
  isHovering: boolean,      // Header is being hovered
  headerIsLight: boolean,   // Should use light colors
  openMenu: Function,       // Open dropdown by label
  scheduleCloseMenu: Function, // Close with delay
  goTo: Function,          // Navigate and close menus
  handleDropdownKeydown: Function, // Keyboard navigation
  setSearchOpen: Function, // Open search modal
  setActiveMenu: Function, // Set active dropdown
  location: object         // Current route
}
```

### HeaderMobile Props

```javascript
{
  mobileOpen: boolean,       // Is menu open
  setMobileOpen: Function,  // Toggle menu
  headerIsLight: boolean,   // Should use light colors
  mobileMenuButtonRef: Ref, // Ref for focus management
  services: Array,          // Services list
  caseStudies: Array,       // Work/case studies
  isActivePage: Function,   // Check if page active
  goTo: Function,          // Navigate and close
  setSearchOpen: Function,  // Open search
  location: object         // Current route
}
```

### MegaMenu Props

```javascript
{
  activeItem: object|null,   // Current dropdown content
  goTo: Function,           // Navigate
  setActiveMenu: Function,   // Close dropdown
  handleQuickActionKeydown: Function, // Keyboard
  handleDropdownItemKeydown: Function // Keyboard
}
```

---

# 3. DESKTOP NAVIGATION (HeaderDesktop)

**Location**: `src/components/HeaderDesktop.jsx`

## 3.1 Navigation Items Structure

The desktop navigation contains 5 main items:

```javascript
const navItems = [
  {
    label: 'Services',
    href: '/services',
    children: [
      /* 6 services */
    ],
  },
  {
    label: 'Work',
    href: '/work',
    children: [
      /* 3 case studies + gallery */
    ],
  },
  {
    label: 'Process', // NO children - direct link
    href: '/process',
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      /* About, Testimonials, FAQ */
    ],
  },
  {
    label: 'Pricing', // NO children - direct link
    href: '/pricing',
  },
]
```

## 3.2 Visual States

### State 1: Transparent (Home Page, Not Scrolled)

Used when ALL of these are true:

- User is on homepage (`location.pathname === '/'`)
- User hasn't scrolled (`!scrolled`)
- Mobile menu is closed (`!mobileOpen`)
- User is not hovering header (`!isHovering`)

**Appearance**:

```css
/* Text colors */
color: white/80          /* Default links */
color: white            /* Active/hover */

/* Chevron */
FaChevronDown: text-white/80
```

### State 2: Solid (Scrolled or Subpages)

Used when ANY of these are true:

- User scrolled past 4px (`scrolled === true`)
- User is on subpage (not home)
- User is hovering the header (`isHovering`)
- Mobile menu is open (`mobileOpen`)

**Appearance**:

```css
/* Text colors */
color: ink-muted        /* Default links */
color: ink              /* Active/hover */

/* Background */
background: white/95    /* bg-white/95 */
border-bottom: 1px solid border-border
box-shadow: shadow-lg
backdrop-filter: blur
```

## 3.3 Nav Item Rendering

### Items WITH Children (Dropdown)

```jsx
<button
  className="inline-flex items-center gap-2 text-sm font-semibold"
  onMouseEnter={() => openMenu(item.label)}
  onFocus={() => openMenu(item.label)}
  onBlur={scheduleCloseMenu}
  aria-expanded={activeMenu === item.label}
  aria-haspopup="true"
  aria-label={`${item.label} menu`}
>
  {item.label}
  <FaChevronDown
    className={`text-[10px] ${activeMenu === item.label ? 'rotate-180' : ''}`}
  />
</button>
```

**Key Behaviors**:

- `onMouseEnter`: Opens dropdown immediately
- `onFocus`: Opens dropdown when tabbing (keyboard)
- `scheduleCloseMenu`: Closes after 150ms delay (prevents flicker)
- `FaChevronDown`: Rotates 180deg when open

### Items WITHOUT Children (Direct Link)

```jsx
<Link
  to={item.href}
  className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5"
>
  {item.label}
</Link>
```

**Key Behaviors**:

- Uses React Router's `<Link>` for client-side navigation
- Has underline indicator (`:after` pseudo-element)
- Underline shows when active page

## 3.4 Active Page Indicator

The `isActivePage` function determines if a nav item should show active state:

```javascript
const isActivePage = href => {
  // Exact match
  if (location.pathname === href) return true

  // Parent match (e.g., /services matches /services/event-production)
  if (href !== '/' && location.pathname.startsWith(href + '/')) return true

  // Special cases
  if (href === '/about') {
    // Includes /testimonials, /faq
  }
  if (href === '/services') {
    /* ... */
  }
  if (href === '/work') {
    /* ... */
  }

  return false
}
```

**Active State Appearance**:

- Text color: `text-ink` (dark) or `text-white` (light)
- Underline: `after:bg-ink` or `after:bg-white`

## 3.5 Contact CTA Button

```jsx
<ScribbleButton to="/contact" className="btn-primary text-sm rounded-sm">
  Contact
</ScribbleButton>
```

**Properties**:

- Style: Primary button (white background, dark text on desktop)
- Size: text-sm (14px)
- Border-radius: rounded-sm (4px)
- Position: Rightmost item in nav

---

# 4. MEGAMENU DROPDOWN

**Location**: `src/components/MegaMenu.jsx`

## 4.1 When It Appears

The MegaMenu appears when:

1. Desktop is visible (`hidden lg:block` - hidden below 1024px)
2. `activeMenu` state is set (user hovered/focused a dropdown item)
3. The item has children (Services, Work, or Company)

## 4.2 Animation

```javascript
{
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: {
    duration: 0.25,      // 250ms
    ease: [0.16, 1, 0.3, 1],  // Custom cubic-bezier
    staggerChildren: 0.02  // 20ms between children
  }
}
```

**Animation Breakdown**:

- **Fade**: opacity 0 → 1
- **Slide**: y -8px → 0 (slight upward motion)
- **Scale**: 0.98 → 1 (subtle grow)
- **Stagger**: Each child animates 20ms after previous

## 4.3 Structure Overview

```
MegaMenu Container (motion.div)
└── Border Wrapper (white bg, shadow)
    └── Inner Container (max-w-7xl)
        ├── Header Section (2/3 width)
        │   ├── Category Label (eyebrow)
        │   ├── Title (H3)
        │   ├── Description (paragraph)
        │   └── Quick Actions (buttons)
        ├── Featured Section (1/3 width)
        │   └── Featured Card
        │       ├── Featured Item
        │       └── Search Input
        ├── Items Grid
        │   └── Item Cards[] (with descriptions)
        └── Footer (border-top)
            └── Helper text + CTA link
```

## 4.4 Header Section

### Eyebrow Label

```jsx
<p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">
  {activeItem.label}
</p>
```

- Font: text-xs (12px)
- Transform: uppercase
- Letter-spacing: 0.3em (3px) - very wide
- Color: ink-subtle (#8892a0)

### Title

```jsx
<h3 className="mt-2 text-2xl font-semibold text-ink font-serif">
  {dynamicTitle}
</h3>
```

- Font: text-2xl (24px)
- Weight: font-semibold (600)
- Font-family: font-serif (Fraunces)
- Margin-top: mt-2 (8px)

### Description

```jsx
<p className="mt-3 text-sm text-ink-muted">{dynamicDescription}</p>
```

- Font: text-sm (14px)
- Color: ink-muted (#5c6470)
- Margin-top: mt-3 (12px)

### Quick Actions

```jsx
<div className="mt-4 flex flex-wrap gap-2">
  <ButtonLink variant="secondary" size="sm">
    All Services
  </ButtonLink>
  <ButtonLink variant="tertiary" size="sm">
    Get Quote
  </ButtonLink>
</div>
```

- Margin-top: mt-4 (16px)
- Gap: gap-2 (8px)
- Wrap: flex-wrap (buttons flow to new lines)

## 4.5 Featured Section

```jsx
<div className="bg-surface-2 rounded-xl p-4">
  <h4 className="text-sm font-semibold text-ink mb-3">Featured</h4>
  {/* Featured Item */}
  <button className="w-full text-left group">
    <p className="text-sm font-medium text-ink group-hover:text-primary">
      {title}
    </p>
    <p className="text-xs text-ink-muted mt-1">{description}</p>
  </button>
  {/* Search */}
  <div className="pt-3 border-t border-border">
    <button className="w-full flex items-center gap-2 text-xs ...">
      <FaSearch />
      Search {category}...
    </button>
  </div>
</div>
```

**Card Styling**:

- Background: surface-2 (#ffffff)
- Border-radius: rounded-xl (12px)
- Padding: p-4 (16px)

## 4.6 Menu Items Grid

```jsx
<div
  className={`grid gap-3 ${
    activeItem.children.length <= 4
      ? 'grid-cols-1 md:grid-cols-2' // 1-4 items: 1-2 columns
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // 5+: 1-3 columns
  }`}
>
  {activeItem.children.map((child, index) => (
    <button
      key={child.href}
      data-dropdown-item={index}
      className="group relative rounded-2xl border border-border 
                 bg-surface-2 px-4 py-3 text-left
                 hover:border-primary/30 hover:bg-surface-3 hover:shadow-md
                 focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Content */}
      <p className="text-sm font-semibold text-ink group-hover:text-primary">
        {child.label}
      </p>
      <p className="text-xs text-ink-muted mt-1 line-clamp-2">
        {child.description}
      </p>

      {/* Hover Arrow */}
      <div
        className="absolute bottom-0 left-0 w-full h-0.5 
                      bg-primary transform scale-x-0 
                      group-hover:scale-x-100 origin-left"
      />
    </button>
  ))}
</div>
```

**Grid Sizing Logic**:

- 1-4 children: `grid-cols-1 md:grid-cols-2` (max 2 columns)
- 5+ children: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (max 3 columns)

**Item Card Styling**:

- Border: 1px border-border (rgba(28,28,28,0.12))
- Border-radius: rounded-2xl (24px)
- Padding: px-4 py-3 (16px 12px)
- Background: surface-2 (#ffffff)
- Hover: border-primary/30 (subtle blue tint), bg-surface-3

## 4.7 Footer Section

```jsx
<div
  className="mt-6 pt-4 border-t border-border 
                flex items-center justify-between"
>
  <p className="text-xs text-ink-muted">{helperText}</p>
  <button
    className="text-xs font-medium text-primary 
                     hover:text-primary/80"
  >
    Get in touch →
  </button>
</div>
```

- Margin-top: mt-6 (24px)
- Padding-top: pt-4 (16px)
- Border-top: 1px border-border

---

# 5. MOBILE NAVIGATION (HeaderMobile)

**Location**: `src/components/HeaderMobile.jsx`

## 5.1 Breakpoint Behavior

The mobile navigation is visible when:

- Window width < 1024px (the `lg` breakpoint in Tailwind)
- Uses `lg:hidden` class to hide at larger sizes

**Breakpoint Values**:

- `lg` = 1024px in Tailwind
- Below 1024px: Mobile hamburger shown
- 1024px and above: Desktop navigation shown

## 5.2 Hamburger Button (Closed State)

### Position and Size

```jsx
<button
  className="flex h-10 w-10           /* 40px × 40px */
              flex-col 
              items-center 
              justify-center 
              gap-1.5               /* 6px gap between lines */
              rounded-full          /* Pill shape */
              transition"
>
  {/* Three span elements for the lines */}
  <span className="block h-0.5 w-5" /> {/* Top line */}
  <span className="block h-0.5 w-5" /> {/* Middle line */}
  <span className="block h-0.5 w-5" /> {/* Bottom line */}
</button>
```

**Dimensions Breakdown**:

- Container: 40px × 40px (h-10 w-10)
- Each line: 0.5px height (h-0.5), 20px width (w-5)
- Gap between lines: 1.5 × 4px = 6px
- Shape: rounded-full (pill)

### Color Logic

```jsx
headerIsLight
  ? 'text-white hover:bg-white/10' /* Dark page background */
  : 'text-ink hover:bg-surface' /* Light page background */
```

- On hero (headerIsLight): White icon, subtle hover
- On subpages (headerIsLight = false): Dark icon, light hover

### Accessibility

```jsx
aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
aria-expanded={mobileOpen}
aria-controls="mobile-menu"
```

## 5.3 Hamburger Animation (Open State)

When `mobileOpen === true`, the hamburger transforms to an X:

### Line Transformations

```jsx
{/* TOP LINE */}
<span className={`
  block h-0.5 w-5 rounded-full transition
  ${headerIsLight ? 'bg-white' : 'bg-ink'}
  ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}
/* Becomes: moves down 6px, rotates 45deg */`}

/*{/* MIDDLE LINE */}
<span className={`
  block h-0.5 w-5 rounded-full transition
  ${headerIsLight ? 'bg-white' : 'bg-ink'}
  ${mobileOpen ? 'opacity-0' : ''}
/* Becomes: invisible */}

/*{/* BOTTOM LINE */}
<span className={`
  block h-0.5 w-5 rounded-full transition
  ${headerIsLight ? 'bg-white' : 'bg-ink'}
  ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}
/* Becomes: moves up 6px, rotates -45deg */}
```

**Visual Result**:

```
Closed (hamburger):     Open (X):
    ━━━                     ━━━
    ━━━        →              (invisible)
    ━━━                     ━━━ (rotated)
```

### Animation Details

- Uses CSS `transition` (default timing)
- No JavaScript animation library needed
- Smooth transformation via CSS transforms

## 5.4 Mobile Drawer (Menu Open)

### Container

```jsx
<motion.div
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
  className="border-t border-border
             bg-surface-2
             px-5 pb-6 pt-4
             lg:hidden"
>
```

**Animation Breakdown**:

- **Initial**: x: 100% (off-screen right), opacity: 0
- **Animate**: x: 0% (natural position), opacity: 1
- **Duration**: 0.3s (300ms)
- **Ease**: [0.16, 1, 0.3, 1] - fast start, smooth end

### Styling

```css
/* Position - full screen */
position: fixed;
top: 76px; /* Below header */
left: 0;
right: 0;
bottom: 0;

/* Background */
background: surface-2 (#ffffff);

/* Border */
border-top: 1px solid border-border;

/* Spacing */
padding-left: 20px;
padding-right: 20px;
padding-top: 16px;
padding-bottom: 24px;
```

## 5.5 Mobile Menu Content Structure

### Screen Reader Title (Hidden)

```jsx
<h2 id="mobile-menu-title" className="sr-only">
  Mobile navigation menu
</h2>
```

- Not visible on screen
- Used by screen readers for context

### Section 1: Main Navigation

```jsx
<div className="grid gap-2 mb-5">
  {/* 10 buttons: Home, Services, Work, Process, Pricing, 
      About, Testimonials, FAQ, Privacy, Terms */}
  <button
    className="text-left text-sm font-semibold 
                     px-2 py-1 rounded-sm"
  >
    {label}
  </button>
</div>
```

**Each Button Properties**:

- Text alignment: text-left
- Font size: text-sm (14px)
- Font weight: font-semibold (600)
- Padding: px-2 (8px) py-1 (4px)
- Border-radius: rounded-sm (4px)
- **TOTAL TAP AREA**: ~36px × ~28px (SEE ISSUES SECTION)

### Section 2: Services Subsection

```jsx
<div className="mb-5">
  <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Services</p>
  <div className="mt-2 grid gap-2">{/* 6 service buttons */}</div>
</div>
```

**Eyebrow Styling**:

- Font: text-xs (12px)
- Transform: uppercase
- Letter-spacing: 0.3em (3px)
- Color: ink-subtle (#8892a0)
- Margin-top: mt-2 (8px)

### Section 3: Work Subsection

```jsx
<div className="mb-6">
  <p className="text-xs uppercase tracking-[0.3em] text-ink-subtle">Work</p>
  <div className="mt-2 grid gap-2">
    {/* 3 case studies + Project gallery */}
  </div>
</div>
```

### Section 4: Contact CTA

```jsx
<ScribbleButton to="/contact" className="btn-primary w-full text-sm rounded-sm">
  Contact
</ScribbleButton>
```

- Width: w-full (full width of container)
- Style: btn-primary (primary button style)

## 5.6 Active State Styling

### Main Nav Items

```jsx
isActivePage('/')
  ? 'text-primary bg-primary/10' /* Active */
  : 'text-ink hover:text-primary' /* Inactive */
```

- Active: Primary color (#1c1c1c), background with 10% opacity
- Inactive: ink (#1c1c1c), hover changes to primary

### Subsection Items

```jsx
location.pathname === `/services/${service.slug}`
  ? 'text-primary bg-primary/10'
  : 'text-ink-muted hover:text-primary'
```

- Active: Same as main items
- Inactive: ink-muted (#5c6470), hover changes to primary

## 5.7 Staggered Animation

Each section animates in with increasing delay:

```jsx
{/* Main Nav - earliest */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.05 }}
>
{/* Services - slightly later */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.08 }}
>
{/* Work - even later */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.11 }}
>
{/* Contact CTA - latest */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.14 }}
>
```

**Timing Summary**:
| Section | Delay | Appears At |
|---------|-------|------------|
| Main Nav | 0.05s | 50ms after open |
| Services | 0.08s | 80ms after open |
| Work | 0.11s | 110ms after open |
| Contact | 0.14s | 140ms after open |

## 5.8 Search Button

```jsx
<button
  onClick={() => {
    setMobileOpen(false)
    setSearchOpen(true)
  }}
  className="flex items-center gap-2 
             text-sm font-semibold 
             text-ink hover:text-primary 
             transition-colors 
             rounded-sm 
             px-2 py-1 mt-2"
>
  <FaSearch className="text-xs" />
  <span>Search Site</span>
</button>
```

- Closes mobile menu
- Opens search modal
- Icon: FaSearch, text-xs (12px)

---

# 6. HEADER CONTAINER (GhaimAEHeader)

**Location**: `src/components/GhaimAEHeader.jsx`

## 6.1 Fixed Positioning

```jsx
<motion.header
  className="fixed left-0 right-0 top-0 z-50
             border-b will-change-transform"
>
```

**Properties**:

- `position: fixed` - Stays in viewport
- `top: 0` - At top of viewport
- `left: 0; right: 0` - Full width
- `z-index: 50` - Above most content
- `border-b` - Bottom border (color changes by state)
- `will-change-transform` - Optimization hint for animation

## 6.2 Height

```jsx
<div className="min-h-[76px]">
```

- Minimum height: 76px
- Allows content to determine actual height
- On mobile: may need adjustment for safe areas

## 6.3 Container Padding

```jsx
className="mx-auto flex min-h-[76px] max-w-7xl
            items-center justify-between
            px-4 sm:px-6 lg:px-8"
```

**Responsive Padding**:
| Breakpoint | Width | Padding |
|------------|-------|---------|
| Default (mobile) | < 640px | px-4 (16px) |
| sm | 640px+ | px-6 (24px) |
| lg | 1024px+ | px-8 (32px) |

**Container**:

- `max-w-7xl` = max-width: 1280px
- `mx-auto` = centered horizontally

## 6.4 Logo

### Image

```jsx
<img
  src={assetUrl('images/logo.webp')}
  alt="Ghaim UAE"
  className="h-9 w-auto"
  loading="lazy"
  decoding="async"
/>
```

- Height: h-9 (36px)
- Width: w-auto (proportional)
- Format: WebP (for smaller file size)
- Loading: lazy (loaded when near viewport)
- Decoding: async (non-blocking)

### Logo Visibility Logic

```jsx
className={`
  h-9 w-auto
  ${isHovering || !headerIsLight ? 'brightness-0' : 'brightness-0 invert'}
`}
```

**Problem**: This uses CSS filters which may not work as expected:

- `brightness-0` = makes image completely black
- `brightness-0 invert` = makes image completely white (then inverted to black by brightness)

**ISSUE**: The logic is inverted! When headerIsLight (dark background), we want white logo, so we use `brightness-0 invert`. But this may not produce the expected result.

**Recommended Fix**: Use separate logo variants (logo-light.webp, logo-dark.webp)

### Logo Text

```jsx
<span
  className={`
  text-xl font-semibold tracking-[0.12em]
  ${isHovering || !headerIsLight ? 'text-ink' : 'text-white'}
`}
>
  GHAIM
</span>
```

- Font: text-xl (20px)
- Weight: font-semibold (600)
- Letter-spacing: tracking-[0.12em] (1.2px)
- Color: white (on dark) or ink (on light)

## 6.5 Scroll Behavior

### State Variables

```javascript
const [scrolled, setScrolled] = useState(false)
const [isHidden, setIsHidden] = useState(false)

// Refs for performance (avoid re-renders)
const lastScrollYRef = useRef(0)
const scrollRafRef = useRef(null)
const hiddenRef = useRef(false)
const scrolledRef = useRef(false)
```

### Thresholds

```javascript
const TOP_THRESHOLD = 4 // Becomes "scrolled" after 4px
const DELTA_THRESHOLD = 6 // For hide/show decision
```

### Scroll Logic

```javascript
const applyScrollState = () => {
  const currentY = Math.max(window.scrollY, 0)
  const delta = currentY - lastScrollYRef.current
  const absDelta = Math.abs(delta)

  // 1. Determine scrolled state
  const nextScrolled = currentY > TOP_THRESHOLD

  // 2. Determine hidden state
  let nextHidden = hiddenRef.current

  if (mobileOpenRef.current || currentY <= TOP_THRESHOLD) {
    // Never hide on mobile or at top
    nextHidden = false
  } else if (absDelta >= DELTA_THRESHOLD) {
    // Hide when scrolling down, show when scrolling up
    nextHidden = delta > 0
  }

  // 3. Update state if changed
  if (nextHidden !== hiddenRef.current) {
    hiddenRef.current = nextHidden
    setIsHidden(nextHidden)
  }

  if (nextScrolled !== scrolledRef.current) {
    scrolledRef.current = nextScrolled
    setScrolled(nextScrolled)
  }

  lastScrollYRef.current = currentY
}
```

### Decision Flowchart

```
Scroll Event
     │
     ▼
currentY > 4px?
     │
     ├─ NO ──► scrolled = false
     │              │
     │              ▼
     │         Always show header
     │
     └─ YES ──► scrolled = true
                   │
                   ▼
              Mobile menu open?
                   │
         ┌─────────┴─────────┐
         │                   │
        YES                 NO
         │                   │
         ▼                   ▼
    Always show          |delta| >= 6px?
                            │
              ┌──────────────┼──────────────┐
              │              │              │
             YES            NO             YES
              │              │              │
              ▼              ▼              ▼
         delta > 0?     Keep same    delta > 0?
         (scrolling                    (scrolling
          down?)                       down?)
           │                            │
     ┌────┴────┐                 ┌────┴────┐
    YES       NO                YES       NO
     │        │                  │        │
     ▼        ▼                  ▼        ▼
  HIDE     SHOW              SHOW      HIDE
```

### Animation

```jsx
<motion.header
  animate={{
    y: isHidden ? '-100%' : '0%',
    opacity: isHidden ? 0 : 1,
  }}
  transition={{
    duration: 0.26,
    ease: [0.33, 1, 0.68, 1],
  }}
>
```

- **Hidden**: y: -100% (completely above viewport), opacity: 0
- **Visible**: y: 0 (natural), opacity: 1
- **Duration**: 0.26s (260ms)
- **Ease**: [0.33, 1, 0.68, 1] - custom cubic-bezier

## 6.6 Background States

### State 1: Transparent

```jsx
className="
  bg-transparent
  border-transparent
  shadow-none
  backdrop-blur-0
"
```

Used when:

- On homepage (`isHome`)
- Not scrolled (`!scrolled`)
- Not hovering (`!isHovering`)
- Mobile closed (`!mobileOpen`)

### State 2: Solid

```jsx
className="
  bg-white/95
  border-border
  shadow-lg
  backdrop-blur
"
```

Used when:

- Scrolled OR
- Not on homepage OR
- Hovering OR
- Mobile menu open

**Background**: white at 95% opacity (allows slight transparency)
**Border**: 1px solid border (rgba(28,28,28,0.12))
**Shadow**: shadow-lg (0 10px 15px rgba(0,0,0,0.1))
**Blur**: backdrop-blur (creates frosted glass effect)

## 6.7 Body Scroll Lock

```javascript
useEffect(() => {
  if (mobileOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => {
    document.body.style.overflow = ''
  }
}, [mobileOpen])
```

**Purpose**: Prevents background scrolling when mobile menu is open

**Cleanup**: Always resets to empty string on unmount

---

# 7. SEARCH MODAL

**Location**: `src/components/Search.jsx`

## 7.1 Trigger Methods

1. **Keyboard Shortcut**: Cmd/Ctrl + K
2. **Search Button Click**: In header
3. **Mobile**: "Search Site" button in drawer

### Keyboard Shortcut Handler

```javascript
const handleKeyDown = e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    setSearchOpen(true)
  }
}

document.addEventListener('keydown', handleKeyDown)
```

## 7.2 Modal Structure

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  className="fixed inset-0 z-50 flex"
>
  {/* Backdrop */}
  <motion.div className="absolute inset-0 bg-black/60" />

  {/* Modal Container */}
  <motion.div className="relative w-full max-w-4xl mx-auto mt-20 px-4">
    {/* Modal Content */}
    <div className="bg-white rounded-2xl shadow-2xl border border-border">
      {/* Input */}
      {/* Results */}
      {/* Footer */}
    </div>
  </motion.div>
</motion.div>
```

## 7.3 Backdrop

```css
/* Position */
position: absolute;
inset: 0;

/* Appearance */
background: rgba(0, 0, 0, 0.6); /* black/60 */
```

- Covers entire viewport
- Semi-transparent black
- Click to close

## 7.4 Container

```css
/* Sizing */
width: 100%;
max-width: 1024px; /* max-w-4xl */
margin-top: 80px; /* mt-20 */

/* Centering */
margin-left: auto;
margin-right: auto;

/* Responsive padding */
padding-left: 16px; /* px-4 */
padding-right: 16px;

/* Tablet+ */
@media (min-width: 640px) {
  padding-left: 24px; /* sm:px-6 */
  padding-right: 24px;
}

/* Desktop+ */
@media (min-width: 1024px) {
  padding-left: 32px; /* lg:px-8 */
  padding-right: 32px;
}
```

## 7.5 Search Input

```jsx
<div className="relative border-b border-border">
  <FaSearch
    className="absolute left-4 top-1/2 -translate-y-1/2 
                       text-ink-muted text-lg"
  />

  <input
    type="text"
    value={query}
    onChange={e => {
      setQuery(e.target.value)
      setSelectedIndex(0)
    }}
    placeholder="Search services, projects, FAQ, or pages..."
    className="w-full pl-12 pr-20 py-4 
               text-lg border-0 
               focus:outline-none focus:ring-0 
               placeholder:text-ink-muted"
    ref={inputRef}
    autoFocus
  />

  <button
    onClick={onClose}
    className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
    aria-label="Close search"
  >
    <FaTimes />
  </button>
</div>
```

**Input Styling**:

- Full width: w-full
- Padding-left: pl-12 (48px for icon)
- Padding-right: pr-20 (80px for close button)
- Padding-vertical: py-4 (16px)
- Font-size: text-lg (18px)
- No border, no focus ring (custom styling)

## 7.6 Results Container

```jsx
<div
  ref={resultsRef}
  className="max-h-96 overflow-y-auto"
  role="listbox"
  aria-label="Search results"
>
  {/* Content */}
</div>
```

- Max height: 96px (384px - limits visible results)
- Overflow: auto (scrollable)
- Role: listbox (accessibility)

## 7.7 Popular Searches (Empty Query)

```jsx
{
  !query && (
    <div className="p-6">
      <h3
        className="text-sm font-semibold text-ink-subtle 
                   uppercase tracking-[0.3em] mb-4"
      >
        Popular Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map(search => (
          <button
            onClick={() => handlePopularSearch(search)}
            className="px-3 py-1.5 text-sm 
                     bg-surface-2 text-ink-muted 
                     hover:text-ink hover:bg-surface-3 
                     rounded-full transition-colors"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  )
}
```

## 7.8 Search Results (With Query)

```jsx
{
  query && hasResults && (
    <div className="py-2">
      <p className="px-6 py-2 text-sm text-ink-muted">
        Found {totalResults} result{totalResults !== 1 ? 's' : ''}
      </p>

      {results.map(category => (
        <div key={category.category}>
          <h3
            className="px-6 py-2 text-sm font-semibold 
                       text-ink-subtle uppercase tracking-[0.3em]"
          >
            {category.category}
          </h3>

          {category.items.map(result => (
            <button
              className="w-full px-6 py-3 text-left 
                       hover:bg-surface-2 
                       focus:bg-surface-2 
                       group"
              role="option"
            >
              <h4 className="font-medium text-ink group-hover:text-primary">
                {highlightMatch(result.title, query)}
              </h4>
              {result.description && (
                <p className="text-sm text-ink-muted mt-1">
                  {highlightMatch(result.description, query)}
                </p>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
```

### Text Highlighting

```javascript
const highlightMatch = (text, query) => {
  if (!query) return text

  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark className="bg-primary/20 text-primary font-semibold">{part}</mark>
    ) : (
      <span key={index}>{part}</span>
    )
  )
}
```

## 7.9 Keyboard Navigation

### Key: ArrowDown

```javascript
case 'ArrowDown':
  e.preventDefault()
  setSelectedIndex(prev => {
    const next = prev + 1
    return next < totalFlatResults ? next : 0  // Wrap to start
  })
```

### Key: ArrowUp

```javascript
case 'ArrowUp':
  e.preventDefault()
  setSelectedIndex(prev => {
    const next = prev - 1
    return next >= 0 ? totalFlatResults - 1 : next  // Wrap to end
  })
```

### Key: Enter

```javascript
case 'Enter':
  e.preventDefault()
  if (selectedIndex < popularSearches.length && !query) {
    // Selected popular search - fill query
    handlePopularSearch(popularSearches[selectedIndex])
  } else {
    // Selected result - navigate
    handleResultClick(flatResults[resultIndex])
  }
```

### Key: Escape

```javascript
case 'Escape':
  e.preventDefault()
  onClose()
```

## 7.10 Footer Shortcuts

```jsx
<div className="border-t border-border px-6 py-3 bg-surface-1">
  <div className="flex items-center justify-between text-xs text-ink-subtle">
    <div className="flex items-center gap-4">
      <span>↑↓ Navigate</span>
      <span>↵ Select</span>
      <span>ESC Close</span>
    </div>
    <div>
      Press <kbd className="px-2 py-0.5 bg-surface-2 rounded">Ctrl</kbd> +
      <kbd className="px-2 py-0.5 bg-surface-2 rounded ml-1">K</kbd> to search
    </div>
  </div>
</div>
```

---

# 8. FOCUS TRAP HOOK

**Location**: `src/hooks/useFocusTrap.js`

## 8.1 Purpose

The focus trap ensures that when the mobile menu or search modal is open, keyboard focus cannot escape the container. This is crucial for accessibility.

## 8.2 Implementation

```javascript
export const useFocusTrap = isActive => {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Get all focusable elements
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Store current focus to restore later
    previousFocusRef.current = document.activeElement

    // Focus first element
    firstElement.focus()

    // Handle Tab key
    const handleTabKey = e => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab: go to last if at first
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: go to first if at last
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    // Handle Escape key
    const handleEscapeKey = e => {
      if (e.key === 'Escape') {
        // Return focus to trigger element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }

    // Add listeners
    containerRef.current.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    // Cleanup
    return () => {
      containerRef.current.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)

      // Restore focus when trap is deactivated
      if (
        previousFocusRef.current &&
        document.activeElement === document.body
      ) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive])

  return { containerRef, previousFocusRef }
}
```

## 8.3 Focusable Elements Selector

```javascript
'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
```

This selector includes:

- `<button>` - Button elements
- `[href]` - Links (a tags with href)
- `<input>` - Input fields
- `<select>` - Dropdowns
- `<textarea>` - Text areas
- `[tabindex]:not([tabindex="-1"])` - Elements with tabindex >= 0

**Excludes**:

- Elements with `tabindex="-1"` (intentionally non-focusable)

## 8.4 Focus Restoration

When the focus trap is deactivated (modal closes):

1. Check if focus is on body (meaning user didn't move it)
2. If so, restore focus to the element that opened the modal
3. This prevents focus from being lost or on wrong element

---

# 9. STATE MANAGEMENT

## 9.1 All State Variables

| State      | Type         | Default | Purpose                                     |
| ---------- | ------------ | ------- | ------------------------------------------- |
| scrolled   | boolean      | false   | Has user scrolled past threshold?           |
| isHidden   | boolean      | false   | Should header be hidden (scroll direction)? |
| mobileOpen | boolean      | false   | Is mobile menu open?                        |
| activeMenu | string\|null | null    | Which dropdown is open?                     |
| isHovering | boolean      | false   | Is user hovering header?                    |
| searchOpen | boolean      | false   | Is search modal open?                       |

## 9.2 Refs (for Performance)

| Ref                 | Type    | Purpose                       |
| ------------------- | ------- | ----------------------------- |
| lastScrollYRef      | number  | Previous scroll position      |
| scrollRafRef        | number  | Animation frame ID            |
| hiddenRef           | boolean | Current hidden state (sync)   |
| scrolledRef         | boolean | Current scrolled state (sync) |
| mobileOpenRef       | boolean | Current mobile state (sync)   |
| closeTimeoutRef     | timeout | Menu close timeout ID         |
| mobileMenuButtonRef | element | Hamburger button ref          |

**Why Refs?**:

- Reading scroll position directly from state causes re-renders
- Refs update synchronously without re-render
- State updated after RAF completes

## 9.3 State Transitions

### Scroll States

```
Initial: scrolled=false, isHidden=false
     │
     ▼
User scrolls > 4px
     │
     ▼
scrolled = true
     │
     ├─ Scrolling DOWN (delta > 0) + |delta| >= 6
     │   │
     │   ▼
     │  isHidden = true (header hides)
     │
     └─ Scrolling UP (delta < 0) + |delta| >= 6
         │
         ▼
        isHidden = false (header shows)
```

### Mobile Menu States

```
mobileOpen = false (initial)
     │
     ▼
User clicks hamburger OR
window resized to < 1024px
     │
     ▼
mobileOpen = true
     │
     ├─ Click backdrop
     │   │
     │   ▼
     │  mobileOpen = false
     │
     ├─ Click nav item
     │   │
     │   ▼
     │  Navigate + mobileOpen = false
     │
     └─ Press Escape
         │
         ▼
        mobileOpen = false + focus restored
```

### Dropdown States

```
activeMenu = null (initial)
     │
     ▼
Mouse enter nav item OR
Focus on nav item
     │
     ▼
activeMenu = 'Services' | 'Work' | 'Company'
     │
     ├─ Mouse leave + 150ms timeout
     │   │
     │   ▼
     │  activeMenu = null
     │
     ├─ Click another dropdown
     │   │
     │   ▼
     │  activeMenu = new item
     │
     └─ Press Escape
         │
         ▼
        activeMenu = null
```

---

# 10. ACCESSIBILITY (A11y)

## 10.1 ARIA Attributes

### Header

```jsx
<header role="banner">
```

### Navigation

```jsx
<nav aria-label="Main navigation">
```

### Dropdown Triggers

```jsx
<button
  aria-expanded={activeMenu === item.label}  // Is dropdown open?
  aria-haspopup="true"                        // Has popup content
  aria-label={`${item.label} menu`}           // Accessible name
>
```

### Mobile Menu

```jsx
<motion.div
  role="dialog"           // Modal-like container
  aria-modal="true"       // Modal behavior
  aria-labelledby="mobile-menu-title"  // Title for screen readers
>
```

### Search Modal

```jsx
<input
  aria-label="Search input"
>

<div role="listbox" aria-label="Search results">

<button role="option">
```

### Active Page

```jsx
<a aria-current={isActive ? 'page' : undefined}>
```

## 10.2 Keyboard Navigation

### Desktop Dropdown

| Key                       | Action                            |
| ------------------------- | --------------------------------- |
| Tab                       | Move to next/focusable element    |
| Enter/Space               | Open dropdown or navigate to link |
| Escape                    | Close dropdown                    |
| Arrow Down                | Focus first item in dropdown      |
| Arrow Up                  | Focus last item in dropdown       |
| Arrow Right (in dropdown) | Focus quick action buttons        |

### Mobile Menu

| Key         | Action                       |
| ----------- | ---------------------------- |
| Tab         | Cycle through menu items     |
| Enter/Space | Activate button/navigate     |
| Escape      | Close menu + focus hamburger |

### Search Modal

| Key          | Action                 |
| ------------ | ---------------------- |
| Cmd/Ctrl + K | Open search            |
| Arrow Down   | Select next result     |
| Arrow Up     | Select previous result |
| Enter        | Navigate to selected   |
| Escape       | Close modal            |

## 10.3 Focus Management

### On Mobile Menu Open

1. Store current focused element
2. Move focus to first menu item
3. Enable focus trap

### On Mobile Menu Close

1. Disable focus trap
2. Restore focus to hamburger button

### On Search Open

1. Move focus to search input
2. Enable focus trap

### On Search Close

1. Clear query
2. Reset selection
3. Restore focus

## 10.4 Screen Reader Considerations

### Hidden Labels

```jsx
<h2 id="mobile-menu-title" className="sr-only">
  Mobile navigation menu
</h2>
```

### Live Regions

```jsx
<p aria-live="polite" className="sr-only">
  {/* For dynamic announcements if needed */}
</p>
```

---

# 11. ANIMATIONS & TRANSITIONS

## 11.1 Header Hide/Show

```javascript
{
  // When hiding: move up 100% and fade out
  y: isHidden ? '-100%' : '0%',
  opacity: isHidden ? 0 : 1,

  // Timing
  duration: 0.26,
  ease: [0.33, 1, 0.68, 1]
}
```

**Ease Breakdown**:

- 0.33: Start faster than linear
- 1: End very fast (almost no deceleration at end)
- 0.68: Control point 2
- 1: Control point 3

**Visual Feel**: Quick slide up/down, minimal fade

## 11.2 Mobile Menu Slide

```javascript
{
  initial: { x: '100%', opacity: 0 },
  animate: { x: '0%', opacity: 1 },
  exit: { x: '100%', opacity: 0 },
  transition: {
    duration: 0.3,
    ease: [0.16, 1, 0.3, 1]
  }
}
```

**Ease Breakdown**:

- Very fast start (0.16)
- Quick deceleration (1)
- Control: 0.3

**Visual Feel**: Snappy slide from right

## 11.3 MegaMenu Fade

```javascript
{
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1],
    staggerChildren: 0.02
  }
}
```

**Visual Feel**: Subtle appear with slight upward motion

## 11.4 Staggered Children

Each child in the mega menu animates 20ms after the previous:

- Item 0: 0ms delay
- Item 1: 20ms delay
- Item 2: 40ms delay
- etc.

## 11.5 Search Modal

```javascript
{
  // Backdrop
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 }

  // Modal
  initial: { y: -25, opacity: 0, scale: 0.98 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -25, opacity: 0, scale: 0.98 },
  transition: { duration: 0.35 }
}
```

**Modal Animation**:

- Slide down 25px
- Scale from 98% to 100%
- Longer duration (350ms) for more prominent element

## 11.6 CSS Transitions

### Header Background

```css
transition:
  background-color 0.3s ease-out,
  box-shadow 0.3s ease-out,
  backdrop-filter 0.3s ease-out,
  border-color 0.3s ease-out;
```

### Hamburger Lines

```css
transition:
  transform 0.3s ease,
  opacity 0.3s ease;
```

### Nav Item Hover

```css
transition: color 0.2s ease;
```

---

# 12. MOBILE RESPONSIVENESS ANALYSIS

## 12.1 Breakpoints Used

| Breakpoint | Width   | Tailwind  | Used For          |
| ---------- | ------- | --------- | ----------------- |
| Mobile     | < 640px | (default) | Most styling      |
| Tablet     | 640px+  | sm:       | Increased padding |
| Laptop     | 768px+  | md:       | Grid changes      |
| Desktop    | 1024px+ | lg:       | Nav switch        |
| Large      | 1280px+ | xl:       | Container max     |

## 12.2 Mobile Detection Logic

### In JavaScript

```javascript
// GhaimAEHeader.jsx
if (window.innerWidth >= 1024) setMobileOpen(false)

// ScrollableCardSection.jsx
const isMobile = window.innerWidth < 640
```

### In CSS (Tailwind)

```jsx
{
  /* Hidden on desktop */
}
className = 'lg:hidden'

{
  /* Hidden on mobile */
}
className = 'hidden lg:block'
```

## 12.3 Layout Changes by Breakpoint

### Below 1024px (Mobile/Tablet)

- Hamburger button visible
- Full-screen drawer menu
- No mega menu
- No desktop nav

### 1024px and above (Desktop)

- Desktop nav visible
- Hamburger hidden
- Mega menu dropdowns work

## 12.4 Viewport Units

### Hero Section

```jsx
className = 'h-[100svh]'
```

- Uses `svh` (small viewport height)
- 100svh = 100% of smallest viewport dimension
- Better than `vh` on mobile browsers with UI bars

---

# 13. ISSUES & RECOMMENDATIONS

## 13.1 CRITICAL: Touch Target Sizes

### Issue

```jsx
<button className="px-2 py-1">{/* Text only */}</button>
```

**Calculation**:

- Font-size: 14px (text-sm)
- Padding: px-2 (8px) + py-1 (4px)
- **Total height**: ~28px
- **Total width**: ~variable based on text

**Problem**:

- Apple HIG recommends 44×44px minimum
- WCAG 2.1 Level AA recommends at least 44×44px
- Current targets are ~28px - WAY TOO SMALL

### Recommendation

```jsx
<button className="px-4 py-3">{/* More padding */}</button>
```

- Padding: px-4 (16px) + py-3 (12px) = 28px + font
- Total: ~44px minimum
- Add `min-h-[44px]` to ensure consistency

## 13.2 CRITICAL: Mobile Menu Scroll

### Issue

```jsx
<motion.div className="border-t ... pb-6 pt-4">
  {/* Content grows beyond viewport */}
  {/* No scroll mechanism */}
</motion.div>
```

**Problem**:

- If content exceeds viewport height, user cannot scroll
- No `overflow-y-auto` on container

### Recommendation

```jsx
<motion.div className="border-t ... pb-6 pt-4 overflow-y-auto">
  {/* Now scrollable */}
</motion.div>
```

Or add max-height:

```jsx
<motion.div
  className="border-t ... pb-6 pt-4"
  style={{ maxHeight: 'calc(100vh - 76px)', overflowY: 'auto' }}
>
```

## 13.3 HIGH: Logo Visibility on Dark Background

### Issue

```jsx
className={`h-9 w-auto ${
  isHovering || !headerIsLight
    ? 'brightness-0'
    : 'brightness-0 invert'
}`}
```

**Problem**:

- `brightness(0)` makes everything black
- `brightness(0) invert(1)` makes everything white, then inverts
- This is unreliable across browsers

### Recommendation

```jsx
// Use two different logos
<img
  src={headerIsLight ? logoLightUrl : logoDarkUrl}
  className="h-9 w-auto"
/>

// Or CSS filter that works
className={headerIsLight ? 'brightness-0 invert' : ''}
// If light background, make dark logo white
```

## 13.4 MEDIUM: Header Height on Small Screens

### Issue

```jsx
<div className="min-h-[76px]">
```

- 76px header on a 320px screen = 24% of screen
- Takes significant portion of viewport

### Recommendation

```jsx
<div className="min-h-[60px] sm:min-h-[76px]">
```

- 60px on small mobile
- 76px on larger screens

## 13.5 MEDIUM: iOS Safari Safe Areas

### Issue

- Fixed header may overlap iOS home indicator
- No safe-area-inset-top consideration

### Recommendation

```jsx
<header className="fixed ... top-0 ...
                  pt-[env(safe-area-inset-top)]">
```

## 13.6 LOW: Menu Close Delay

### Issue

```javascript
const scheduleCloseMenu = () => {
  closeTimeoutRef.current = setTimeout(() => {
    setActiveMenu(null)
  }, 150)
}
```

- 150ms delay can feel sluggish
- But prevents flicker when moving between items

### Consideration

- 150ms is reasonable for mouse users
- Consider faster for touch (no hover on touch)

---

# 14. PERFORMANCE CONSIDERATIONS

## 14.1 Scroll Handler Optimization

### Problem

Scroll events fire rapidly (potentially 100+ times per second)

### Solution

```javascript
const handleScroll = () => {
  if (scrollRafRef.current !== null) return // Skip if RAF pending
  scrollRafRef.current = requestAnimationFrame(applyScrollState)
}

window.addEventListener('scroll', handleScroll, { passive: true })
```

**Benefits**:

- RAF limits to 60fps
- `passive: true` improves scroll performance
- Skips intermediate scroll positions

## 14.2 Refs vs State

### Problem

Reading `window.scrollY` in render causes re-render every scroll

### Solution

```javascript
const lastScrollYRef = useRef(0)

// In scroll handler:
const currentY = window.scrollY
lastScrollYRef.current = currentY

// Only update state when needed:
if (nextScrolled !== scrolledRef.current) {
  setScrolled(nextScrolled) // Triggers re-render
}
```

**Benefits**:

- Refs update synchronously without re-render
- State only updates when threshold crossed
- Much better performance

## 14.3 Memoization

### navItems

```javascript
const navItems = useMemo(() => [...], [])
```

- Recalculated only once (empty dependency array)
- Prevents recreation on every render

### activeItem

```javascript
const activeItem = useMemo(
  () => navItems.find(item => item.label === activeMenu),
  [activeMenu, navItems]
)
```

- Recalculated when activeMenu changes

## 14.4 Bundle Size

### Framer Motion

- Used for: header animation, mobile menu, mega menu, search modal
- Could be replaced with CSS animations for smaller bundle

### React Icons

- Only using: FaChevronDown, FaSearch, FaTimes, FaArrowRight, FaChevronLeft, FaChevronLeft, FaQuoteLeft
- Consider tree-shaking or using SVG directly

---

# 15. BROWSER-SPECIFIC NOTES

## 15.1 iOS Safari

### playsInline

```jsx
<video playsInline ...>
```

Required for video to play in-place rather than fullscreen

### -webkit-overflow-scrolling

```css
overflow-y: auto; /* May need -webkit prefix */
```

For smooth momentum scrolling

### Safe Areas

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

For iPhone X+ notch/home indicator

## 15.2 Mobile Chrome

### 100vh Issue

- Mobile Chrome address bar can resize
- Use `100svh` (small viewport height) instead

### Touch Action

```css
touch-action: manipulation;
```

Disables double-tap to zoom on interactive elements

## 15.3 Focus Visible

### Legacy Browser Support

```css
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

Modern browsers support `:focus-visible`, older need fallback

---

# APPENDIX A: COLOR REFERENCE

## Header Colors

| State               | Background  | Text  | Border      |
| ------------------- | ----------- | ----- | ----------- |
| Transparent (light) | transparent | white | transparent |
| Solid (light)       | white/95    | ink   | border      |
| Hover (light)       | white       | ink   | -           |

## Brand Colors

| Token      | Hex                 | Usage           |
| ---------- | ------------------- | --------------- |
| ink        | #1c1c1c             | Primary text    |
| ink-muted  | #5c6470             | Secondary text  |
| ink-subtle | #8892a0             | Tertiary/labels |
| surface    | #f6f7f9             | Background      |
| surface-2  | #ffffff             | White           |
| surface-3  | #eef1f6             | Hover states    |
| border     | rgba(28,28,28,0.12) | Borders         |
| primary    | (from config)       | Links/accents   |

---

# APPENDIX B: TYPOGRAPHY REFERENCE

## Font Families

- Headings: Fraunces (serif)
- Body: Manrope (sans-serif)

## Sizes Used in Navbar

| Element      | Size           | Weight  |
| ------------ | -------------- | ------- |
| Logo text    | text-xl (20px) | 600     |
| Nav links    | text-sm (14px) | 600     |
| Nav children | text-sm (14px) | 400-500 |
| Eyebrow      | text-xs (12px) | 600     |
| Button       | text-sm (14px) | 600     |

---

# APPENDIX C: ANIMATION REFERENCE

## Easing Curves Used

| Name         | Values             | Usage          |
| ------------ | ------------------ | -------------- |
| Header hide  | [0.33, 1, 0.68, 1] | Quick, minimal |
| Menu slide   | [0.16, 1, 0.3, 1]  | Snappy         |
| Mega menu    | [0.16, 1, 0.3, 1]  | Snappy         |
| Search modal | [0.16, 1, 0.3, 1]  | Snappy         |

## Durations

| Animation        | Duration  |
| ---------------- | --------- |
| Header hide/show | 260ms     |
| Mobile menu      | 300ms     |
| Mega menu        | 250ms     |
| Search modal     | 350ms     |
| Stagger children | 20ms each |

---

# APPENDIX D: ACCESSIBILITY CHECKLIST

- [ ] All buttons have accessible names
- [ ] Focus trap in modals works
- [ ] Escape closes all popups
- [ ] Tab order is logical
- [ ] Focus visible on all interactive elements
- [ ] ARIA attributes correct
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets >= 44px
- [ ] Reduced motion respected

---

# DOCUMENT END

This document provides complete technical reference for the Ghaim UAE navbar system. For questions or clarifications, refer to the source code or contact the development team.
