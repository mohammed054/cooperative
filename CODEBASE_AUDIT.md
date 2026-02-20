# Codebase Structural Audit

**Project:** Ghaim UAE Cooperative  
**Date:** February 20, 2026  
**Auditor:** Senior React Codebase Auditor  
**Scope:** Full structural audit of 50+ JSX files, ~50k lines of code

---

## 1. Location of Delivery Framework Section

### File Location
**Path:** `src/components/homepage/OperationsSpineScene.jsx`  
**Lines:** 209-214

### Text Content (HARDCODED)
```jsx
<p className="osv2-eyebrow">Delivery Framework</p>

<h2 className="osv2-headline">
  Process pressure
  <br />
  translated into
  <br />
  composure at showtime.
</h2>

<p className="osv2-body">
  Each phase locks before the next advances. Scroll through the command sequence.
</p>
```

### Component
- **Name:** `OperationsSpineScene`
- **Export:** Default export and named export
- **File:** `src/components/homepage/OperationsSpineScene.jsx`
- **Lines:** 1-380 (full component)

### Parent Chain (Bottom-Up)
```
OperationsSpineScene (src/components/homepage/OperationsSpineScene.jsx)
    ↓ imported at line 21
Home (src/pages/Home.jsx)
    ↓ mapped in SCENE_COMPONENT_REGISTRY
    ↓ rendered via downstreamScenes.map()
    ↓ scene definition from HOMEPAGE_SCENE_REGISTRY
homepageFoundation.js (src/foundation/homepageFoundation.js)
    ↓ scene id: 'operations-spine'
    ↓ mode: 'pinned'
    ↓ length: 240vh
```

### Text Source Analysis
| Attribute | Value |
|-----------|-------|
| Hardcoded | **YES** — directly in JSX at lines 209-214 |
| Passed as props | No |
| From constants file | No |
| From CMS/JSON | No |

### Home Page Connection
The component connects to the Home page via:

1. **Scene Registry** (`src/foundation/homepageFoundation.js`, lines 83-97):
```javascript
{
  id: 'operations-spine',
  tone: 'steel',
  length: 240,
  mode: 'pinned',
  entryCue: 'spine-pre-pin-buffer',
  exitCue: 'spine-release',
  ctaSlot: 'post-step-three',
  transitionReady: true,
  media: { ... }
}
```

2. **Component Mapping** (`src/pages/Home.jsx`, lines 23-33):
```javascript
const SCENE_COMPONENT_REGISTRY = Object.freeze({
  'operations-spine': OperationsSpineScene,
  // ... other scenes
});
```

3. **Render Order** (`src/pages/Home.jsx`, line 57):
```javascript
const downstreamScenes = HOMEPAGE_SCENE_REGISTRY.filter(
  scene => scene.id !== 'command-arrival' && scene.id !== 'authority-ledger'
);
// operations-spine is 3rd in downstreamScenes (index 2)
```

---

## 2. How It Is Styled

### Styling Method
**Embedded CSS-in-JS using `<style>` tag**

The component uses a `<style>` tag embedded directly in the JSX (lines 92-206 of OperationsSpineScene.jsx).

**NOT using:**
- ❌ Tailwind CSS classes
- ❌ CSS Modules
- ❌ Global CSS (except CSS custom properties)
- ❌ Styled Components
- ❌ Inline styles (except dynamic values)

### CSS Custom Properties Used
The component references these CSS variables from `src/index.css`:
```css
--color-ink: #1c1c1c
--color-ink-muted: #5c6470
--color-ink-subtle: #8892a0
--color-surface: #f6f7f9
--color-surface-2: #ffffff
--color-border: rgba(28, 28, 28, 0.12)
--font-heading: 'Fraunces', serif
--font-body: 'Manrope', system-ui, sans-serif
```

### Complete Class Name Inventory

#### Container Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-outer` | Root container, position: relative | Line 95 |
| `.osv2-sticky` | Sticky pinned container, 100vh min-height | Line 97 |
| `.osv2-grain` | Texture overlay container | Line 113 |
| `.osv2-grain__back` | Gradient background texture | Line 114 |
| `.osv2-grain__lines` | Line pattern texture | Line 115 |

#### Content Layout Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-content` | Main content grid, max-width: 1260px | Line 117 |
| `.osv2-left` | Left column (copy + progress) | Line 119 |
| `.osv2-eyebrow` | "Delivery Framework" label | Line 122 |
| `.osv2-headline` | Main headline text | Line 123 |
| `.osv2-body` | Body text | Line 124 |

#### Progress Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-prog-wrap` | Progress wrapper | Line 126 |
| `.osv2-prog-track` | Progress bar track | Line 127 |
| `.osv2-prog-fill` | Progress bar fill (animated) | Line 128 |
| `.osv2-prog-label` | Progress label (01/04) | Line 129 |
| `.osv2-prog-label__current` | Current number | Line 130 |
| `.osv2-prog-label__sep` | Separator slash | Line 131 |

#### CTA Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-cta` | CTA wrapper | Line 133 |
| `.osv2-cta__btn` | CTA button styles | Line 134 |
| `.osv2-cta__arrow` | Arrow icon | Line 135 |

#### Rail Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-right` | Right column (rail + cards) | Line 137 |
| `.osv2-rail` | Vertical rail container | Line 141 |
| `.osv2-rail__track` | Rail track background | Line 142 |
| `.osv2-rail__fill` | Rail fill (animated) | Line 143 |
| `.osv2-rail__dots` | Dot container | Line 144 |
| `.osv2-rail__dot` | Individual dot | Line 145 |
| `.osv2-rail__dot--active` | Active dot state | Line 146 |

#### Card Classes
| Class Name | Purpose | Defined At |
|------------|---------|------------|
| `.osv2-cards` | Cards container grid | Line 148 |
| `.osv2-card` | Individual card | Line 150 |
| `.osv2-card--active` | Active card state | Line 160 |
| `.osv2-card__num` | Phase number (01, 02, etc.) | Line 173 |
| `.osv2-card__inner` | Card inner grid | Line 175 |
| `.osv2-card__thumb` | Thumbnail container | Line 178 |
| `.osv2-card__img` | Image element | Line 179 |
| `.osv2-card__shimmer` | Shimmer animation | Line 180 |
| `.osv2-card__text` | Text container | Line 182 |
| `.osv2-card__eyebrow` | Phase label | Line 183 |
| `.osv2-card__title` | Phase title | Line 184 |
| `.osv2-card__detail` | Phase description | Line 185 |
| `.osv2-card__dot` | Active indicator dot | Line 187 |

### Responsive Breakpoints

| Breakpoint | CSS Line | Changes |
|------------|----------|---------|
| `min-width: 960px` | 118, 120 | Two-column grid, sticky left column |
| `max-width: 760px` | 139-140, 176, 266-268 | Single column, hide rail, reset card transform |
| `min-width: 480px` | 177 | Card inner two-column grid |
| `max-width: 480px` | 269-271 | Reset card active transform |
| `max-width: 420px` | 192-202 | Skip GSAP pin, show all cards static |
| `prefers-reduced-motion` | 204-211 | Disable animations |

### Why It Might Not Be Mobile Responsive

1. **GSAP Pin Behavior:** The GSAP ScrollTrigger pin creates a sticky container that can cause duplication bugs on mobile browsers due to spacer element backgrounds.

2. **Fixed Pixel Calculations:** The JS uses `VH_PER_PHASE = 0.9` which calculates scroll distance based on viewport height, potentially causing issues with dynamic viewport changes (mobile URL bar show/hide).

3. **Complex Transform Chains:** The active card uses `transform: scale(1.016) translateX(-2px)` which can cause sub-pixel overflow on mobile.

4. **No Touch-Optimized Interactions:** The scroll-based animation relies on wheel events; touch scrolling has different physics.

---

## 3. Landing Page Component Tree

### Entry Point
**File:** `src/pages/Home.jsx`

### Scene Order (Complete Architecture)

```
flagship-home flagship-home-cinematic (div.container)
│
├── [1] CommandArrivalScene ──────────────────────────── FREE, GSAP PINNED TRANSITION
│   │   id: 'command-arrival'
│   │   tone: 'deep'
│   │   mode: 'free' (but pinned via GSAP internally)
│   │   length: 100vh
│   │   type: SCROLL-BASED + ANIMATED
│   │   
│   └── AuthorityLedgerScene (embedded) ─────────────── FREE
│       │   id: 'authority-ledger'
│       │   tone: 'dark'
│       │   mode: 'free'
│       │   length: 100vh
│       │   type: STATIC + ANIMATED (on scroll)
│
├── homepage-tone-bridge (gradient bridge)
│
├── [2] SignatureReelScene ────────────────────────────── PINNED
│   │   id: 'signature-reel'
│   │   tone: 'dark'
│   │   mode: 'pinned'
│   │   length: 220vh
│   │   type: HORIZONTAL SCROLL + ANIMATED
│   │   hooks: useScroll (Framer Motion), useInView
│   │
│   └── SignatureReelContent
│       └── ProjectCard (×3) ────────────────────────── ANIMATED
│
├── [3] CapabilityMatrixScene ─────────────────────────── FREE
│   │   id: 'capability-matrix'
│   │   tone: 'steel'
│   │   mode: 'free'
│   │   length: 100vh
│   │   type: STATIC + ANIMATED (on scroll)
│   │
│   └── CAPABILITY_MODULES (×3) ──────────────────────── ANIMATED
│
├── homepage-tone-bridge (gradient bridge)
│
├── [4] OperationsSpineScene ──────────────────────────── PINNED ← DELIVERY FRAMEWORK
│   │   id: 'operations-spine'
│   │   tone: 'steel'
│   │   mode: 'pinned'
│   │   length: 240vh
│   │   type: SCROLL-BASED + ANIMATED
│   │   hooks: useReducedMotion, useLayoutEffect (GSAP)
│   │
│   ├── osv2-left (sticky header)
│   │   ├── "Delivery Framework" (eyebrow) ──────────── STATIC TEXT
│   │   ├── Headline ─────────────────────────────────── STATIC TEXT
│   │   ├── Body text ────────────────────────────────── STATIC TEXT
│   │   ├── Progress bar ─────────────────────────────── ANIMATED (GSAP)
│   │   └── CTA button ───────────────────────────────── ANIMATED (GSAP)
│   │
│   └── osv2-right (cards rail)
│       ├── Vertical rail ────────────────────────────── ANIMATED (GSAP)
│       └── PhaseCard (×4) ───────────────────────────── ANIMATED (GSAP)
│           ├── Phase 01: Executive Briefing
│           ├── Phase 02: Systems Alignment
│           ├── Phase 03: Rehearsal Control
│           └── Phase 04: Live Command
│
├── homepage-tone-bridge (gradient bridge)
│
├── [5] NarrativeBridgeScene ──────────────────────────── FREE
│   │   id: 'narrative-bridge'
│   │   tone: 'warm'
│   │   mode: 'free'
│   │   length: 75vh
│   │   type: STATIC + ANIMATED (on scroll)
│   │
│   └── SceneCard ────────────────────────────────────── ANIMATED
│
├── [6] ProofTheaterScene ─────────────────────────────── FREE
│   │   id: 'proof-theater'
│   │   tone: 'linen'
│   │   mode: 'free'
│   │   length: 120vh
│   │   type: INTERACTIVE CAROUSEL + ANIMATED
│   │
│   └── ProofTheaterSplit
│       ├── Testimonial carousel ────────────────────── ANIMATED + INTERACTIVE
│       └── Client index sidebar ────────────────────── INTERACTIVE
│
├── homepage-tone-bridge (gradient bridge)
│
├── [7] ConversionChamberScene ────────────────────────── FREE
│   │   id: 'conversion-chamber'
│   │   tone: 'dark'
│   │   mode: 'free'
│   │   length: 120vh
│   │   type: INTERACTIVE FORM + ANIMATED
│   │
│   └── ConversionChamberContent
│       ├── Lead info card ──────────────────────────── STATIC
│       └── Lead capture form ───────────────────────── INTERACTIVE + ANIMATED
│
├── [8] GlobalFooterScene ─────────────────────────────── FREE
│   │   id: 'global-footer'
│   │   tone: 'deep'
│   │   mode: 'free'
│   │   length: 70vh
│   │   type: STATIC + ANIMATED (on scroll)
│   │
│   └── Footer links, contact info ──────────────────── ANIMATED
│
└── SceneErrorBoundary (wraps each scene)
```

### Custom Hooks Used

| Hook | File | Purpose | Used In |
|------|------|---------|---------|
| `useLenisScroll` | `src/hooks/useLenisScroll.js` | Lenis smooth scroll init | Home.jsx |
| `useReducedMotion` | Framer Motion | Accessibility check | All scenes |
| `useScroll` | Framer Motion | Scroll progress | Multiple scenes |
| `useTransform` | Framer Motion | Value transformation | Multiple scenes |
| `useInView` | Framer Motion | Visibility detection | Multiple scenes |
| `useLayoutEffect` | React (GSAP) | DOM measurements | OperationsSpineScene |

### Layout Wrappers

| Component | File | Purpose |
|-----------|------|---------|
| `SceneWrapper` | `src/components/flagship/SceneWrapper.jsx` | Sets min-height, id, theme |
| `SceneShell` | `src/components/flagship/SceneShell.jsx` | Inner content container |
| `ScrollLockedSection` | `src/components/flagship/ScrollLockedSection.jsx` | Pinned section wrapper |
| `SceneCard` | Inline in HomeScenes.jsx | Card component wrapper |

### Scene Type Classification

| Scene | Static | Scroll-Based | Animated | Horizontally Scrolling | Interactive |
|-------|--------|--------------|----------|------------------------|-------------|
| command-arrival | | ✓ | ✓ | | |
| authority-ledger | ✓ | | ✓ | | |
| signature-reel | | ✓ | ✓ | ✓ | ✓ |
| capability-matrix | ✓ | | ✓ | | |
| **operations-spine** | | **✓** | **✓** | | |
| narrative-bridge | ✓ | | ✓ | | |
| proof-theater | | | ✓ | | ✓ |
| conversion-chamber | | | ✓ | | ✓ |
| global-footer | ✓ | | ✓ | | |

---

## 4. Responsiveness Problems

### 4.1 Viewport Meta Setup
**File:** `index.html`  
**Line:** 7  
**Status:** ✅ CORRECT

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 4.2 Container Widths

**Issue:** Multiple container width definitions causing inconsistency

| Location | Width Definition | Issue |
|----------|------------------|-------|
| `.osv2-content` (line 117) | `width: min(1260px, calc(100% - 2.4rem))` | Uses `min()` — good |
| `.flagship-shell` (index.css) | `width: min(1180px, calc(100% - 2.5rem))` | Different max-width |
| `.scene-shell` (index.css) | `width: min(1200px, calc(100% - 2.5rem))` | Different max-width |
| `.authority-ledger-shell` (index.css) | `width: min(1240px, 100%)` | Different max-width |

**Root Cause:** No single source of truth for container widths  
**Suggested Fix:** Create a CSS custom property `--content-max-width` and use consistently

### 4.3 Hardcoded Pixel Widths

**File:** `src/components/homepage/OperationsSpineScene.jsx`

| Line | Hardcoded Value | Issue |
|------|-----------------|-------|
| 70 | `const MOBILE_BREAKPOINT = 760` | Should use CSS custom property |
| 71 | `const TINY_BREAKPOINT = 420` | Should use CSS custom property |
| 73 | `const VH_PER_PHASE = 0.9` | Assumption about viewport |

**File:** `src/components/homepage/HomeScenes.jsx`

| Line | Hardcoded Value | Issue |
|------|-----------------|-------|
| 55 | `const CARD_GAP = 12` | Magic number |
| 265 | `min-w-[252px]` | Hardcoded card width in Tailwind |

### 4.4 Overflow Issues

**File:** `src/index.css`

| Line | Rule | Status |
|------|------|--------|
| 71 | `html { overflow-x: hidden; }` | ✅ Prevents horizontal scroll |
| 76-78 | `body { /* overflow-x removed */ }` | ✅ Fixed (was breaking sticky) |

**File:** `src/components/homepage/OperationsSpineScene.jsx`

| Line | Rule | Issue |
|------|------|-------|
| 97-100 | `.osv2-sticky { overflow: hidden; }` | Can clip content on zoom |
| 263-264 | `.osv2-card--active { transform: translateX(-2px); }` | Causes 2px overflow |

### 4.5 Position Absolute/Fixed Elements

**File:** `src/components/homepage/OperationsSpineScene.jsx`

| Element | Position | Potential Issue |
|---------|----------|-----------------|
| `.osv2-grain` | absolute (line 113) | Can overflow on mobile |
| `.osv2-rail__track` | absolute (line 142) | Fine, contained |
| `.osv2-rail__fill` | absolute (line 143) | Fine, contained |
| `.osv2-card__shimmer` | absolute (line 180) | Fine, contained |

### 4.6 Horizontal Scroll Locking Logic

**File:** `src/components/homepage/HomeScenes.jsx`

```javascript
// Line 461-463
<div
  className="cinematic-horizontal-rail flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:hidden"
  style={{ touchAction: 'pan-x' }}
  onScroll={handleMobileTrackScroll}
>
```

**Status:** ✅ Correct implementation with `touchAction: 'pan-x'` and `snap-x`

### 4.7 Sections Breaking Below 768px

| Section | Breaks Below | Reason | Fix Status |
|---------|--------------|--------|------------|
| `.osv2-right` | 760px | Rail visible when it shouldn't be | ✅ Fixed (line 139-140) |
| `.osv2-card--active` | 760px | `translateX(-2px)` overflow | ✅ Fixed (line 266-268) |
| `.hero-command-grid` | 900px | Two-column collapses | ⚠️ Needs review |
| `.flagship-hero-layout` | 1080px | Grid collapses | ✅ Handled (index.css) |

### 4.8 Missing Tailwind Breakpoints

**Issue:** OperationsSpineScene uses custom CSS with `@media` queries instead of Tailwind responsive utilities.

**Tailwind Breakpoints (from tailwind.config.js):**
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**OperationsSpineScene Breakpoints:**
- 420px (tiny)
- 480px (mobile)
- 760px (mobile)
- 960px (desktop)

**Mismatch:** The component's 760px breakpoint falls between Tailwind's `sm` (640px) and `md` (768px), causing inconsistent behavior.

### 4.9 Specific Issues with Root Causes and Fixes

#### Issue 1: GSAP Pin Spacer Duplication
**File:** `src/components/homepage/OperationsSpineScene.jsx`  
**Lines:** 116-124, 179-184

**Root Cause:** GSAP wraps pinned elements in a `.pin-spacer` div that inherits computed styles from the pinned element, including background colors. On mobile browsers, this creates a visible "duplicate" of the section.

**Fix Applied:**
```css
.osv2-outer > .pin-spacer {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  min-height: 0 !important;
}
```

**Remaining Issue:** The fix uses `!important` which is fragile.

**Recommended Fix:** 
```javascript
// In GSAP ScrollTrigger config
onRefresh(self) {
  if (self.spacer) {
    self.spacer.style.background = 'transparent';
    self.spacer.style.minHeight = '';
  }
}
```

#### Issue 2: Breakpoint Threshold Mismatch
**File:** `src/components/homepage/OperationsSpineScene.jsx`  
**Lines:** 68-72

**Root Cause:** JS used `MOBILE_BREAKPOINT = 760` while CSS had different thresholds (480px for rail), causing the rail to visually disappear while GSAP still calculated layouts for two-column.

**Fix Applied:** Aligned CSS breakpoints to 760px.

**Recommended Fix:** Use CSS custom properties for breakpoints:
```css
:root {
  --breakpoint-mobile: 760px;
  --breakpoint-tiny: 420px;
}
```

#### Issue 3: Card Transform Overflow
**File:** `src/components/homepage/OperationsSpineScene.jsx`  
**Lines:** 163-164, 263-264

**Root Cause:** Active card uses `transform: scale(1.016) translateX(-2px)` which causes horizontal overflow on narrow viewports.

**Fix Applied:** Reset `translateX` to 0 at 760px and 480px breakpoints.

**Remaining Issue:** The scale transform still causes minor overflow.

**Recommended Fix:**
```css
.osv2-card--active {
  transform: scale(1.01); /* Reduced scale */
  /* Remove translateX entirely */
}
```

#### Issue 4: Dynamic Viewport Height Issues
**File:** `src/components/homepage/OperationsSpineScene.jsx`  
**Lines:** 73, 151

**Root Cause:** Mobile browsers have dynamic viewport height (100vh includes URL bar, but actual visible area is smaller).

**Partial Fix:** Uses `100dvh` where supported (line 98).

**Recommended Fix:**
```css
.osv2-sticky {
  min-height: 100vh;
  min-height: 100dvh; /* Already applied */
  min-height: 100svh; /* Add for small viewport */
}
```

#### Issue 5: Touch Scroll Physics
**File:** `src/hooks/useLenisScroll.js`  
**Lines:** 12-21

**Root Cause:** Lenis smooth scroll has different physics for touch vs wheel, potentially causing janky scroll on mobile.

**Current Config:**
```javascript
syncTouch: false, // Native touch scroll
touchMultiplier: MOTION_TOKEN_CONTRACT.scroll.touchMultiplier,
```

**Status:** ✅ Correctly configured to use native touch scroll.

---

## 5. Refactoring Recommendations

### Priority 1: Critical (Address Immediately)

| # | Issue | File | Line(s) | Recommendation |
|---|-------|------|---------|----------------|
| 1 | Hardcoded text in JSX | OperationsSpineScene.jsx | 209-214 | Extract to constants file or CMS |
| 2 | Embedded CSS in component | OperationsSpineScene.jsx | 92-206 | Move to CSS module or global CSS |
| 3 | Breakpoint inconsistency | OperationsSpineScene.jsx | 68-72, 139-140 | Align with Tailwind breakpoints |

### Priority 2: High (Address This Sprint)

| # | Issue | File | Line(s) | Recommendation |
|---|-------|------|---------|----------------|
| 4 | Container width inconsistency | Multiple files | Various | Create `--content-max-width` CSS variable |
| 5 | Magic numbers | HomeScenes.jsx | 55, 265 | Extract to constants |
| 6 | GSAP cleanup fragility | OperationsSpineScene.jsx | 179-184 | Use GSAP context properly |

### Priority 3: Medium (Address Next Sprint)

| # | Issue | File | Line(s) | Recommendation |
|---|-------|------|---------|----------------|
| 7 | No TypeScript | All JSX files | N/A | Consider TypeScript migration |
| 8 | Duplicate scene definitions | homepageFoundation.js | 36-114 | Consider generating from CMS |
| 9 | Complex scroll logic | OperationsSpineScene.jsx | 103-190 | Consider abstraction to custom hook |

### Priority 4: Low (Technical Debt)

| # | Issue | File | Line(s) | Recommendation |
|---|-------|------|---------|----------------|
| 10 | CSS class naming convention | OperationsSpineScene.jsx | 92-206 | Use BEM consistently across codebase |
| 11 | Missing error boundaries per card | OperationsSpineScene.jsx | N/A | Add error boundaries for card failures |
| 12 | No unit tests | OperationsSpineScene.jsx | N/A | Add tests for GSAP scroll behavior |

### Architecture Recommendations

1. **Extract Text Content to Data File**
   ```javascript
   // src/data/homepageCopy.js
   export const OPERATIONS_SPINE = {
     eyebrow: 'Delivery Framework',
     headline: 'Process pressure translated into composure at showtime.',
     body: 'Each phase locks before the next advances...',
     phases: [ ... ]
   };
   ```

2. **Create Unified Breakpoint System**
   ```javascript
   // tailwind.config.js
   theme: {
     extend: {
       screens: {
         'tiny': '420px',
         'mobile': '760px',
         // Remove conflicting defaults
       }
     }
   }
   ```

3. **Abstract GSAP Scroll Logic**
   ```javascript
   // src/hooks/usePinnedScrollScene.js
   export const usePinnedScrollScene = ({ phases, breakpoints }) => {
     // Abstract pin/spacer/refresh logic
   };
   ```

4. **Move Component CSS to Modules**
   ```
   src/components/homepage/
   ├── OperationsSpineScene.jsx
   ├── OperationsSpineScene.module.css
   └── ...
   ```

---

## Appendix A: File Reference Index

| File Path | Lines | Purpose |
|-----------|-------|---------|
| `src/pages/Home.jsx` | 1-114 | Landing page entry |
| `src/components/homepage/OperationsSpineScene.jsx` | 1-380 | Delivery Framework component |
| `src/components/homepage/HomeScenes.jsx` | 1-750 | Scene components collection |
| `src/foundation/homepageFoundation.js` | 1-207 | Scene registry and validation |
| `src/hooks/useLenisScroll.js` | 1-42 | Smooth scroll hook |
| `src/index.css` | 1-2500+ | Global styles |
| `tailwind.config.js` | 1-76 | Tailwind configuration |
| `index.html` | 1-150 | HTML entry point |

---

## Appendix B: Key Line Numbers for OperationsSpineScene.jsx

| Feature | Line(s) |
|---------|---------|
| PHASES data array | 11-45 |
| MOBILE_BREAKPOINT constant | 70 |
| TINY_BREAKPOINT constant | 71 |
| VH_PER_PHASE constant | 73 |
| PhaseCard component | 76-90 |
| Main component export | 92-380 |
| Embedded CSS | 95-206 |
| GSAP setup | 103-190 |
| ScrollTrigger config | 121-175 |
| "Delivery Framework" text | 209-214 |
| Phase cards render | 261-275 |
| Responsive CSS | 265-271 (760px), 192-202 (420px) |

---

**End of Audit Document**