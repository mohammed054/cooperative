# FULL CODEBASE FORENSIC AUDIT

## Core-Level Runtime Analysis | Updated: 2026-02-21

---

## Executive Summary

| Metric                       | Previous | Current      |
| ---------------------------- | -------- | ------------ |
| **Overall Health Score**     | 3.5 / 10 | **5.5 / 10** |
| **Scroll Architecture**      | 3 / 10   | **7 / 10**   |
| **React Render Performance** | N/A      | **5 / 10**   |
| **Memory Management**        | N/A      | **6 / 10**   |
| **CSS Performance**          | N/A      | **5 / 10**   |
| **Bundle Health**            | 5 / 10   | **4 / 10**   |
| **Production Readiness**     | 3.5 / 10 | **6 / 10**   |

**Critical Blockers**: 3 runtime issues that will cause visible bugs in production
**High Severity**: 14 issues affecting performance/stability under load
**Medium Severity**: 10 maintainability/predictability issues

---

## Delta Since Last Audit

### What Improved

- **Responsive pinning**: All pinned scenes now use `ScrollTrigger.matchMedia()` with proper mobile disable at 768px
- **Scroll ownership**: Single update path via Lenis callback; wheel bridge removed
- **Asset resolution**: OperationsSpineScene uses shared `assetUrl` helper from `src/lib/assetUrl.js`
- **Internal routing**: All internal links use React Router `<Link>`; no `<a href="/...">` found
- **ScrollLockedSection performance**: Uses `useMotionValue` instead of React state for progress

### What Regressed

- **None detected** - all changes were improvements

### What Remains Unstable

- **React state in scroll handlers**: `setProgressValue` called on every scroll frame
- **THREE.js memory leak**: BufferAttribute never disposed
- **GSAP double-cleanup**: Explicit `.kill()` + `ctx.revert()` in all pinned components
- **Global smooth scroll**: Still conflicts with Lenis
- **CSS GPU overload**: 23 backdrop-filter blurs + mix-blend-mode overlays

---

## System-Level Architecture Map

### Scroll System Data Flow

```
User Input (wheel/touch)
       │
       ▼
┌──────────────────────────────────────┐
│ LENIS INSTANCE (useLenisScroll.js)   │
│   - autoRaf: false (manual control)  │
│   - syncTouch: false (desktop opt)   │
│   - lerp: 0.085 (damping)            │
└───────────────┬──────────────────────┘
                │
                ▼ lenis.on('scroll') → ScrollTrigger.update()
┌──────────────────────────────────────┐
│ SCROLLTRIGGER INSTANCES (3 active)   │
│   - CommandArrival: scrub 0.5        │
│   - SignatureReel: scrub ~1.2        │
│   - OperationsSpine: scrub 1.5       │
└──────────────────────────────────────┘
```

**VERIFIED**: Single update path, no duplicate `ScrollTrigger.update()` calls.

### Animation System Overlap

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ GSAP/ScrollTrigger│ │ Framer Motion   │ │ Three.js Canvas │
│ - Pinned scenes   │ │ - Parallax      │ │ - Particle loop │
│ - Scrub timelines │ │ - AnimatePresence│ │ - WebGL render  │
│ - matchMedia      │ │ - useTransform  │ │ - RAF loop      │
└────────┬──────────┘ └────────┬─────────┘ └────────┬────────┘
         │                     │                    │
         └─────────────────────┼────────────────────┘
                               │
                    3 separate RAF loops
                    No coordination mechanism
```

**WARNING**: Three independent animation systems with separate RAF loops.

### Scene Architecture

- Scene source of truth: `src/foundation/homepageFoundation.js:91`
- Scene component registry: `src/pages/Home.jsx:21`
- Free scene wrapper: `SceneWrapper` → `SceneShell`
- Pinned scene wrapper: `ScrollLockedSection` → `SceneShell`

---

## 🚨 CRITICAL RUNTIME ISSUES

### C1: React State Updates on Every Scroll Frame

**Severity**: CRITICAL
**File**: `src/components/homepage/HomeScenes.jsx:499-501`

```jsx
useMotionValueEvent(progress, 'change', latest => {
  setProgressValue(latest) // React re-render on every frame!
})
```

**Impact**: Every scroll frame triggers:

1. React state update
2. Component re-render
3. All children re-render
4. Derived value recomputation (lines 503-525)

**Fix**: Use `useTransform` for derived values:

```jsx
const selectedIndex = useTransform(progress, [0, 1], [0, PROJECTS.length - 1])
```

---

### C2: GSAP Double-Cleanup Anti-Pattern

**Severity**: CRITICAL
**Files**: `HomeScenes.jsx:1029-1042`, `OperationsSpineScene.jsx:268-284`, `ScrollLockedSection.jsx:77-86`

```jsx
// INSIDE matchMedia cleanup
return () => {
  if (timeline?.scrollTrigger) timeline.scrollTrigger.kill() // KILL #1
}

// OUTSIDE matchMedia - final cleanup
return () => {
  context.revert() // KILL #2 - kills same trigger again
}
```

**Impact**: Console errors, race conditions in StrictMode, HMR failures

**Fix**: Remove explicit `.kill()` calls — `ctx.revert()` handles ALL cleanup:

```jsx
// CORRECT: Only ctx.revert() at the top level
useEffect(() => {
  const ctx = gsap.context(() => {
    ScrollTrigger.matchMedia({ ... })
  }, element)
  return () => ctx.revert()  // This alone kills everything
}, [deps])
```

---

### C3: ScrollTrigger.getAll() Global Kill

**Severity**: CRITICAL
**File**: `src/components/homepage/OperationsSpineScene.jsx:121-125`

```jsx
ScrollTrigger.getAll().forEach(trigger => {
  if (trigger.trigger === outer || trigger.pin === sticky) {
    trigger.kill()
  }
})
```

**Impact**: Kills triggers from OTHER components that happen to match conditions. Can destroy scroll behavior for unrelated sections.

**Fix**: Remove entirely — `gsap.context()` with proper scoping handles cleanup.

---

## 🔴 HIGH SEVERITY ISSUES

### H1: THREE.js BufferAttribute Memory Leak

**File**: `src/components/flagship/HeroAmbientCanvas.jsx:48, 106-108`
**Severity**: HIGH

```jsx
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// NEVER DISPOSED in cleanup
```

**Impact**: WebGL buffer leaks on every effect re-run (e.g., `shouldReduceMotion` toggle). GPU memory accumulation.

**Fix**:

```jsx
return () => {
  window.removeEventListener('resize', resize)
  window.cancelAnimationFrame(animationFrameId)
  if (geometry.attributes.position) {
    geometry.attributes.position.array = null
  }
  geometry.dispose()
  pointsMaterial.dispose()
  renderer.dispose()
}
```

---

### H2: Orphaned GSAP Tween in ScrollTrigger Callback

**File**: `src/components/homepage/OperationsSpineScene.jsx:254-264`
**Severity**: HIGH

```jsx
onEnter() {
  gsap.fromTo(cursor, { y: 72, opacity: 0 }, { ... })
  // Tween created but never stored — no cleanup possible
}
```

**Impact**: If component unmounts during animation, tween continues orphaned.

---

### H3: Fixed-Position Blend-Mode Overlay

**File**: `src/index.css:1550-1565`
**Severity**: HIGH

```css
.flagship-home-cinematic::after {
  position: fixed;
  inset: 0;
  mix-blend-mode: soft-light;
}
```

**Impact**: Forces repaint on every scroll frame across entire viewport. `mix-blend-mode` disables GPU compositing.

---

### H4: 23 Instances of Backdrop-Filter Blur

**Files**: `src/index.css`, `src/components/ScribbleButton.css`
**Severity**: HIGH

GPU-intensive blur applied to:

- Glass panels (16px)
- Stat cards (8px)
- Conversion form (10px)
- Hero cards (5-7px)
- DOF layer (0.9px on full viewport)

**Impact**: Each blur forces GPU rasterization of background content. Stacked blurs compound exponentially.

---

### H5: Box-Shadow in Transition Properties

**Files**: `src/index.css:1647-1650`, `src/components/ScribbleButton.css:39-45`
**Severity**: HIGH

```css
transition: box-shadow var(--cine-transition-medium);
```

**Impact**: Box-shadow changes trigger repaint + recomposite. Frame drops during hover animations.

---

### H6: Main Bundle 939KB (Home Statically Imported)

**File**: `src/App.jsx:15`
**Severity**: HIGH

```jsx
import Home from './pages/Home' // STATIC IMPORT
```

Build output:

```
assets/index.js    939.95 kB │ gzip: 271.86 kB
(!) Some chunks are larger than 500 kB
```

**Impact**: Landing page loads entire homepage scene tree + dependencies before interaction.

---

### H7: Search Testimonial Data Key Mismatch

**File**: `src/hooks/useSearch.js:39-41`
**Severity**: HIGH

```jsx
title: testimonial.client,    // WRONG - data has 'name'
content: testimonial.content, // WRONG - data has 'quote'
```

**Impact**: Testimonials not searchable — silently fails.

---

### H8: setTimeout Without Cleanup

**File**: `src/hooks/useScrollSnap.js:37, 66, 113`
**Severity**: MEDIUM-HIGH

```jsx
setTimeout(() => {
  isScrolling.current = false
}, 1000)
// No timeout ID stored, no cleanup
```

**Impact**: If component unmounts during timeout, callback still executes.

---

### H9: History.scrollRestoration Unguarded

**File**: `src/main.jsx:11`
**Severity**: HIGH

```jsx
history.scrollRestoration = 'manual' // No window check
```

**Impact**: Crashes in SSR/prerender environments.

---

### H10: 100vw Hero Causes Horizontal Overflow

**File**: `src/index.css:2121`
**Severity**: HIGH

```css
.scene-depth-stage-hero-full {
  width: 100vw; /* Includes scrollbar width */
}
```

**Impact**: Hidden horizontal overflow on pages with scrollbars.

---

### H11: Event Listener Re-attachment on State Change

**File**: `src/components/GhaimAEHeader.jsx:145-167`
**Severity**: MEDIUM-HIGH

```jsx
useEffect(() => {
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [mobileOpen, activeMenu, searchOpen]) // Re-runs on every state change
```

**Impact**: Event listener removed/re-added frequently during normal use.

---

### H12: Global Smooth Scroll Conflicts with Lenis

**File**: `src/index.css:116`
**Severity**: HIGH

```css
html {
  scroll-behavior: smooth;
}
```

**Impact**: Double smoothing — Lenis + native browser smooth scroll both active.

---

### H13: Async Form Handlers Without Mounted Guards

**Files**: `src/hooks/useLeadSubmission.js:62-83`, `src/components/homepage/HomeScenes.jsx:1853-1866`
**Severity**: HIGH

```jsx
const submit = useCallback(async formElement => {
  await submitLead(fields, {...})
  setStatus('success')  // No mounted check
}, [...])
```

**Impact**: "Can't perform a React state update on an unmounted component" warnings. Potential memory leaks.

---

### H14: ProgressContext Inline Object Value

**File**: `src/components/flagship/ProgressContext.jsx:35`
**Severity**: MEDIUM-HIGH

```jsx
<ProgressContext.Provider value={{ progress, reduced }}>
```

**Impact**: New object reference on every render causes all consumers to re-render unnecessarily.

**Fix**:

```jsx
const value = useMemo(() => ({ progress, reduced }), [progress, reduced])
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### M1: Motion Token Systems Duplicated

**Files**: `src/motion/tokens.js`, `src/motion/motionTokenContract.js`

Both export similar constants — `MOTION_EASE` vs `MOTION_TOKEN_CONTRACT.easing`

---

### M2: Breakpoint Inconsistency

- **JS**: `MOBILE_BREAKPOINT = 768` (`constants.js`)
- **Tailwind**: `md: 768px`
- **CSS**: `@media (min-width: 780px)`, `900px`, `960px`, `1080px`

---

### M3: will-change Overuse

**Files**: `src/index.css` (13 instances)

Some on non-animating elements, causing unnecessary GPU layer promotion.

---

### M4: AnimatePresence Exit Animation Gap

**File**: `src/components/homepage/HomeScenes.jsx:1606-1615`

```jsx
exit={reduced ? undefined : { opacity: 0, ... }}
```

When `reduced` is true, exit is undefined — can cause orphaned elements.

---

### M5: No WebGL Context Loss Handling

**File**: `src/components/flagship/HeroAmbientCanvas.jsx`

No handlers for `webglcontextlost` / `webglcontextrestored` — canvas permanently broken on GPU reset.

---

### M6: ResizeObserver + Window Resize Redundancy

**File**: `src/components/SceneCapabilityEstablishment.jsx:168-178`

Both `ResizeObserver` and `window.resize` listener update same state.

---

### M7: SEO Metadata Ignores Query Changes

**File**: `src/components/SiteMetaManager.jsx:276`

```jsx
}, [location.pathname])  // Missing location.search
```

---

### M8: Console.error in Production Code

**File**: `src/pages/Home.jsx:75`

```jsx
console.error(`[SceneErrorBoundary] ...`)
```

---

### M9: Direct DOM Style Manipulation

**Files**: `src/components/CurvedArrow.jsx:14-15`, `src/components/AnimatedArrow.jsx:14-15`, `src/components/OurProjects.jsx:353-354`

```jsx
pathRef.current.style.strokeDasharray = length
e.currentTarget.style.color = '#1c1c1c'
```

**Impact**: Bypasses React's virtual DOM, can cause hydration mismatches.

---

### M10: Stale Closure in useScrollSnap

**File**: `src/hooks/useScrollSnap.js:26-29`

Handlers reference `currentSection` state directly which can become stale. Effect re-runs on every state change.

---

## ✅ VERIFIED FIXED ISSUES

| #   | Issue                                   | Status   | Evidence                                                    |
| --- | --------------------------------------- | -------- | ----------------------------------------------------------- |
| 1   | Asset path contract broken              | ✅ FIXED | `OperationsSpineScene.jsx:6` imports from `assetUrl` helper |
| 2   | Operations pin mode frozen at mount     | ✅ FIXED | Uses `ScrollTrigger.matchMedia()` at line 134               |
| 3   | ScrollTrigger update duplicated         | ✅ FIXED | Single path via Lenis callback; wheel bridge removed        |
| 4   | Pinned architecture on mobile           | ✅ FIXED | All pinned scenes use matchMedia at 768px                   |
| 5   | Internal route navigation forces reload | ✅ FIXED | All internal links use `<Link>`                             |

---

## ✅ WHAT'S WORKING WELL

### G1: Lenis-ScrollTrigger Synchronization

Single update path via `lenis.on('scroll', () => ScrollTrigger.update())`. No duplicate calls per frame.

### G2: Responsive Pinning

All pinned sections use `ScrollTrigger.matchMedia()` with proper mobile disable at 768px.

### G3: ScrollLockedSection Progress

Uses `useMotionValue` instead of React state — no re-renders on scroll.

### G4: Event Listener Cleanup

All `addEventListener` calls have matching `removeEventListener`.

### G5: Lenis Lifecycle

Proper `.on()`, `.off()`, `.destroy()` cleanup.

### G6: Context Provider Stability (AnalyticsContext)

AnalyticsContext uses `useMemo` for stable value reference.

### G7: AbortController in leadCapture

Proper timeout and abort handling in fetch calls.

---

## 📊 PRODUCTION RISK ASSESSMENT

### What Breaks First Under Load

1. **Scroll performance** on low-end mobile — triple animation systems (GSAP + Framer + Three.js)
2. **Memory** on long sessions — THREE.js buffer leak + possible GSAP orphaned tweens
3. **GPU** on integrated graphics — backdrop-filter + mix-blend-mode + Three.js particles

### What Crashes on Low-End Mobile

- Composite load from GSAP pinning + Framer transforms + Three.js canvas + backdrop-filter blur

### What Fails on Safari

- `100vh` pinned sections during browser chrome expand/collapse
- `backdrop-filter` performance regression

### What Fails on Orientation Change

- Currently handled via `matchMedia()` — should work correctly now

### What Fails on Resize

- GSAP `invalidateOnRefresh: true` set — should recalculate correctly

---

## 📈 RECOMMENDED FIXES (Priority Order)

### Immediate (Blocks Production)

| #   | Issue                              | File                           | Fix                                 |
| --- | ---------------------------------- | ------------------------------ | ----------------------------------- |
| 1   | React state in scroll handler      | `HomeScenes.jsx:499`           | Use `useTransform` instead of state |
| 2   | GSAP double-cleanup                | All pinned components          | Remove explicit `.kill()` calls     |
| 3   | ScrollTrigger.getAll() global kill | `OperationsSpineScene.jsx:121` | Remove entirely                     |

### High Impact Performance

| #   | Issue                         | File                       | Fix                               |
| --- | ----------------------------- | -------------------------- | --------------------------------- |
| 4   | THREE.js BufferAttribute leak | `HeroAmbientCanvas.jsx:48` | Add disposal in cleanup           |
| 5   | Home static import            | `App.jsx:15`               | Lazy import with `React.lazy()`   |
| 6   | Fixed blend-mode overlay      | `index.css:1550`           | Remove or simplify                |
| 7   | Box-shadow in transitions     | `index.css:1647`           | Remove from transition properties |
| 8   | Async setState without guard  | `useLeadSubmission.js:62`  | Add `isMountedRef` guard          |
| 9   | Search data keys              | `useSearch.js:39`          | Use `name` and `quote` fields     |

### Maintainability

| #   | Issue                         | Fix                          |
| --- | ----------------------------- | ---------------------------- |
| 10  | ProgressContext inline object | Wrap in `useMemo`            |
| 11  | Breakpoint system             | Consolidate to single source |
| 12  | Motion tokens                 | Merge into single contract   |

---

## 📈 ESTIMATED STABILITY AFTER FIXES

| Category            | Current    | After Top 5 | After All  |
| ------------------- | ---------- | ----------- | ---------- |
| Scroll Architecture | 7/10       | 8/10        | 8.5/10     |
| React Performance   | 5/10       | 8/10        | 8.5/10     |
| Memory Management   | 6/10       | 8/10        | 8.5/10     |
| CSS Performance     | 5/10       | 7/10        | 8/10       |
| Bundle Health       | 4/10       | 7/10        | 8/10       |
| **Overall**         | **5.5/10** | **7.5/10**  | **8.3/10** |

---

## Architectural Maturity Assessment

- Classification: **Experimental → Maturing**
- Progress:
  - ✅ Unified scroll update path (Lenis → ScrollTrigger)
  - ✅ Responsive pinning with matchMedia
  - ⚠️ Multiple parallel animation systems remain
  - ⚠️ React state still used in scroll hot paths
  - ❌ Memory management gaps (THREE.js, async guards)

---

## Cleanup Roadmap (Priority Order)

1. **[CRITICAL]** Fix React state in scroll handlers → use MotionValue transforms
2. **[CRITICAL]** Remove GSAP double-cleanup pattern
3. **[CRITICAL]** Remove `ScrollTrigger.getAll()` global kill
4. **[HIGH]** Add THREE.js BufferAttribute disposal
5. **[HIGH]** Add mounted guards to async form submissions
6. **[HIGH]** Fix search testimonial data mapping
7. **[MEDIUM]** Lazy load Home route
8. **[MEDIUM]** Remove fixed blend-mode overlay or simplify
9. **[MEDIUM]** Consolidate breakpoint tokens
10. **[LOW]** Remove unused dependencies and dead code
