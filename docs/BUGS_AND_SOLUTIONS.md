# FULL CODEBASE FORENSIC AUDIT

## Executive Summary
- Overall health score: **3.5 / 10**
- Current state: visually ambitious, but architecture is unstable under resize/mobile/low-end hardware.
- Main blocker: scroll ownership is fragmented across Lenis, GSAP ScrollTrigger, Framer Motion `useScroll`, CSS sticky/snap, and direct `scrollIntoView` calls.
- Production readiness: **not stable for high-traffic deployment** without refactor of scroll/pin architecture.

## System-Level Architecture Map

### Scene architecture
- Scene source of truth: `src/foundation/homepageFoundation.js:91` (`HOMEPAGE_SCENE_REGISTRY`)
- Scene component registry mapping: `src/pages/Home.jsx:21`
- Free scene wrapper path: `SceneWrapper` -> `SceneShell` (`src/components/flagship/SceneWrapper.jsx:21`, `src/components/flagship/SceneShell.jsx:23`)
- Pinned scene wrapper path: `ScrollLockedSection` -> `SceneShell` (`src/components/flagship/ScrollLockedSection.jsx:73`)
- Homepage orchestration: `src/pages/Home.jsx:135`

### Scroll ownership map
- Lenis smooth scrolling owner: `src/hooks/useLenisScroll.js:15`
- GSAP pinning owners:
  - Command arrival pinned transition: `src/components/homepage/HomeScenes.jsx:742`
  - Signature reel lock (via `ScrollLockedSection`): `src/components/flagship/ScrollLockedSection.jsx:37`
  - Operations spine pin: `src/components/homepage/OperationsSpineScene.jsx:169`
- Framer Motion scroll progress owners (`useScroll`) are spread across many scenes, e.g. `src/components/homepage/HomeScenes.jsx:952`, `src/components/TestimonialsSection.jsx:75`, etc.
- Native scroll/snap owners:
  - Global smooth scroll: `src/index.css:116`
  - Horizontal rail snap: `src/index.css:1654`
  - Direct smooth `scrollIntoView` calls in multiple components (Footer, Search, HomeScenes, ScrollToTop, etc.)

### Which system controls what
- Pinning: GSAP ScrollTrigger (`HomeScenes` + `ScrollLockedSection` + `OperationsSpineScene`)
- Progress tracking:
  - GSAP -> React state in pinned sections (`setProgress`, `setActiveIdx`)
  - Framer `scrollYProgress` for non-pinned/parallax scenes
- Horizontal scroll: native overflow rail in Signature reel mobile (`src/components/homepage/HomeScenes.jsx:591`)
- Snap: CSS scroll snap on `.cinematic-horizontal-rail` (`src/index.css:1665`)
- Touch behavior:
  - Lenis uses `syncTouch: false` (`src/hooks/useLenisScroll.js:18`), so touch and wheel behavior diverge
  - Horizontal rail forces `touchAction: 'pan-x'` (`src/components/homepage/HomeScenes.jsx:594`)

### Animation engine overlap
- GSAP + ScrollTrigger: heavy pin/timeline control
- Framer Motion: per-scene reveal/parallax/state-driven animation
- CSS transitions/animations: global cards/bridges/legacy classes
- Conflict status: **yes, active conflicts**
  - GSAP and Framer both animate transforms/opacity in same page lifecycle
  - Lenis and native smooth scroll both enabled
  - GSAP update called from multiple pathways (Lenis callback + wheel bridge)

## Critical Bugs

### 1) Asset path contract is broken for production subpath deploys
- File: `src/components/homepage/OperationsSpineScene.jsx:7`
- Snippet:
```jsx
const assetUrl =
  typeof window !== 'undefined' && window.__assetUrl
    ? window.__assetUrl
    : path => `/${path}`
```
- Why this is a bug: `window.__assetUrl` is never defined anywhere; fallback hardcodes root-relative URLs and ignores Vite `BASE_URL`. On GitHub Pages subpath deploys, these images 404.
- Severity: **Critical**
- Exact fix: replace this local helper with shared `assetUrl` from `src/lib/assetUrl.js`.

### 2) Operations pin mode is frozen at mount; resize/orientation breaks behavior
- File: `src/components/homepage/OperationsSpineScene.jsx:134`, `src/components/homepage/OperationsSpineScene.jsx:282`
- Snippet:
```jsx
const isMobile = window.innerWidth < 768
...
}, [reducedMotion])
```
- Why this is a bug: mode is decided once and never reinitialized on viewport class change. Desktop->mobile keeps desktop pin logic active; mobile->desktop never enables it.
- Severity: **Critical**
- Exact fix: use `ScrollTrigger.matchMedia` or a debounced resize listener that fully tears down/recreates triggers on breakpoint crossing.

### 3) ScrollTrigger update is duplicated, causing jitter and wasted frames
- Files: `src/hooks/useLenisScroll.js:24`, `src/components/homepage/HomeScenes.jsx:687`
- Snippets:
```jsx
lenis.on('scroll', syncScrollTrigger)
```
```jsx
window.addEventListener('wheel', handleWheelForLenis, { passive: true })
```
- Why this is a bug: ScrollTrigger is updated from Lenis scroll callback and from a wheel RAF bridge, producing competing update cadence and visible stutter under wheel input.
- Severity: **Critical**
- Exact fix: keep one synchronization path only (Lenis scroll callback), remove wheel bridge, verify with performance trace.

### 4) Pinned architecture on mobile is not consistently disabled
- Files: `src/components/homepage/HomeScenes.jsx:742`, `src/components/flagship/ScrollLockedSection.jsx:37`
- Snippet:
```jsx
pin: true
```
```jsx
ScrollTrigger.create({ ... pin: lockEl ... })
```
- Why this is a bug: CommandArrival and SignatureReel pin logic still run on mobile (only OperationsSpine has explicit mobile bypass). This is a direct source of jumpy layout and sticky failures.
- Severity: **Critical**
- Exact fix: introduce centralized mobile pin policy for all pinned scenes (prefer `matchMedia` and degrade to free-flow scenes below tablet breakpoints).

### 5) Internal route navigation forces full page reload in key flows
- Files: `src/components/homepage/OperationsSpineScene.jsx:347`, `src/components/OurProjects.jsx:74`, `src/components/OurProjects.jsx:183`
- Snippet:
```jsx
<a href="/process" ...>
```
```jsx
<motion.a href="/work" ...>
```
- Why this is a bug: bypasses React Router and resets app state/scroll systems; expensive and user-visible navigation instability.
- Severity: **Critical**
- Exact fix: replace with `<Link to="...">` for internal routes.

## High Severity Issues

### 6) Search data contract mismatch drops testimonial relevance
- Files: `src/hooks/useSearch.js:39`, `src/hooks/useSearch.js:41`, `src/data/siteData.js:184`
- Snippet:
```jsx
title: testimonial.client,
content: testimonial.content,
```
- Why this is a bug: data model uses `name` and `quote`; current keys are undefined.
- Severity: **High**
- Exact fix: map to `testimonial.name` and `testimonial.quote`.

### 7) Global smooth scroll conflicts with Lenis and manual smooth calls
- Files: `src/index.css:116`, `src/components/homepage/HomeScenes.jsx:469`, `src/components/Footer.jsx:27`, `src/components/FinalCta.jsx:48`
- Snippet:
```css
html { scroll-behavior: smooth; }
```
- Why this is a bug: native smooth + Lenis + explicit smooth calls stack easing systems and produce inconsistent travel time/jank.
- Severity: **High**
- Exact fix: disable global `scroll-behavior: smooth` when Lenis is active; route all programmatic scroll via Lenis API.

### 8) `ScrollLockedSection` causes high-frequency React rerenders during scroll
- File: `src/components/flagship/ScrollLockedSection.jsx:54`
- Snippet:
```jsx
setProgress(previous => {
  const blend = 0.2 + momentumGain
  return previous + (nextProgress - previous) * blend
})
```
- Why this is a bug: state updates on every ScrollTrigger update frame re-render heavy scene trees.
- Severity: **High**
- Exact fix: use motion values for progress and derive UI transforms without React state churn.

### 9) Mobile viewport instability from `100vh`/`h-screen` pinning
- Files: `src/components/homepage/HomeScenes.jsx:707`, `src/index.css:2080`, `src/index.css:2122`
- Snippet:
```jsx
height: '100vh'
```
```css
height: 100vh;
```
- Why this is a bug: iOS/Safari dynamic chrome changes viewport height; pinned sections jump/clip on scroll/orientation.
- Severity: **High**
- Exact fix: standardize on `dvh/svh` strategy and avoid JS hardcoded `100vh` inline writes.

### 10) `100vw` hero stage causes hidden horizontal overflow
- Files: `src/index.css:2121`, `src/index.css:117`
- Snippet:
```css
width: 100vw;
overflow-x: hidden;
```
- Why this is a bug: `100vw` includes scrollbar width and creates latent overflow; hidden globally masks real layout faults.
- Severity: **High**
- Exact fix: use `width: 100%` and remove global overflow masking where possible.

### 11) Error boundary fallback distorts scene rhythm after failures
- File: `src/pages/Home.jsx:84`
- Snippet:
```jsx
style={{ minHeight: '100vh' }}
```
- Why this is a bug: all scene failures collapse to one-height fallback, but scenes have variable lengths (`75vh` to `240vh`) and pinned semantics.
- Severity: **High**
- Exact fix: fallback height should derive from scene registry `length` and mode.

### 12) `history.scrollRestoration` at module scope breaks SSR/prerender portability
- File: `src/main.jsx:11`
- Snippet:
```jsx
history.scrollRestoration = 'manual'
```
- Why this is a bug: unguarded browser global at module eval time.
- Severity: **High**
- Exact fix: wrap in `if (typeof window !== 'undefined' && 'scrollRestoration' in history)`.

### 13) Breakpoint system is inconsistent across CSS, JS, and Tailwind
- Files: `src/index.css:1772`, `src/index.css:2446`, `src/index.css:2604`, `src/components/homepage/OperationsSpineScene.jsx:53`, `tailwind.config.js:1`
- Snippet:
```css
@media (min-width: 780px)
@media (max-width: 900px)
@media (min-width: 960px)
@media (min-width: 1080px)
```
- Why this is a bug: mixed, non-tokenized breakpoints produce unpredictable layout transitions and JS/CSS desync.
- Severity: **High**
- Exact fix: establish a single breakpoint contract exported for JS and reflected in CSS/Tailwind tokens.

### 14) Legacy and current Operations systems are duplicated
- Files: `src/index.css:2567`, `src/components/homepage/OperationsSpineScene.module.css:1`
- Snippet:
```css
.ops-spine-*   (global legacy)
.osv2*         (current CSS module)
```
- Why this is a bug: two parallel style systems for the same feature increases drift and debugging ambiguity.
- Severity: **High**
- Exact fix: remove legacy `.ops-spine-*` block after verifying no runtime consumers.

### 15) Large main bundle remains despite route lazy loading
- Evidence: `npm run build` output (`assets/index.js` ~939k minified, chunk warning)
- Related files: `src/App.jsx:15`, `src/utils/routePreload.js:1`
- Why this is a bug: landing performance is constrained; heavy home scenes stay in entry chunk.
- Severity: **High**
- Exact fix: lazy-load Home route and scene bundles; split homepage scene groups into async chunks.

### 16) Vite manual chunk config includes unused `swiper` chunk
- File: `vite.config.js:63`
- Snippet:
```js
carousel: ['swiper']
```
- Why this is a bug: build emits empty chunk warning and unnecessary configuration complexity.
- Severity: **High**
- Exact fix: remove manual chunk and dependency if Swiper is not used.

## Medium Issues

### 17) `useScrollSnap` has timeout leak risk and hot-path event churn
- File: `src/hooks/useScrollSnap.js:37`, `src/hooks/useScrollSnap.js:66`, `src/hooks/useScrollSnap.js:113`, `src/hooks/useScrollSnap.js:159`
- Snippet:
```jsx
setTimeout(() => { isScrolling.current = false }, 1000)
...
}, [currentSection, sectionIds])
```
- Why this is a bug: timeouts are never tracked/cleared; effect rebinds global listeners every state change.
- Severity: **Medium**
- Exact fix: store timeout IDs and clear on cleanup; stabilize handlers and depend only on immutable refs.

### 18) Header mobile animation lock uses wrong event (`onAnimationEnd`)
- File: `src/components/HeaderMobile.jsx:200`
- Snippet:
```jsx
onAnimationEnd={() => setIsAnimating(false)}
```
- Why this is a bug: drawer uses CSS transition, not animation; lock release path is unreliable.
- Severity: **Medium**
- Exact fix: switch to `onTransitionEnd` or remove lock state and gate by actual open state.

### 19) Skip link scrolling is smoothed, not instant
- Files: `src/components/SkipToContent.jsx:9`, `src/index.css:116`
- Snippet:
```jsx
mainContent.scrollIntoView()
```
- Why this is a bug: accessibility skip links should jump immediately; smooth motion delays focus target arrival.
- Severity: **Medium**
- Exact fix: call `scrollIntoView({ behavior: 'auto', block: 'start' })` and avoid global smooth for assistive flows.

### 20) Resize listeners are unthrottled on expensive work
- Files: `src/components/flagship/HeroAmbientCanvas.jsx:101`, `src/components/SceneCapabilityEstablishment.jsx:175`, `src/components/GhaimAEHeader.jsx:133`
- Snippet:
```jsx
window.addEventListener('resize', resize)
```
- Why this is a bug: can trigger heavy layout/renderer operations repeatedly during drag/orientation.
- Severity: **Medium**
- Exact fix: throttle/debounce and batch with `requestAnimationFrame`.

### 21) Async form handlers can set state after unmount
- Files: `src/hooks/useLeadSubmission.js:62`, `src/components/homepage/HomeScenes.jsx:1345`
- Snippet:
```jsx
await submitLead(...)
setStatus('success')
```
- Why this is a bug: unresolved async task races route changes/unmount.
- Severity: **Medium**
- Exact fix: track mounted flag or use abortable request in hook and guard state updates.

### 22) CTA enablement depends on cross-layer DOM data attribute side-effect
- Files: `src/components/homepage/HomeScenes.jsx:775`, `src/index.css:3016`
- Snippet:
```jsx
transitionWrapper.dataset.pinReleased = 'true'
```
```css
[data-pin-released="true"] .authority-ledger-cta { pointer-events: auto; }
```
- Why this is a bug: behavior depends on imperative DOM mutation + global selector coupling.
- Severity: **Medium**
- Exact fix: manage CTA state in React, not global style side-effect selectors.

### 23) Motion token systems are split and inconsistent
- Files: `src/motion/tokens.js:1`, `src/motion/motionTokenContract.js:6`
- Snippet:
```js
export const MOTION_EASE ...
export const MOTION_TOKEN_CONTRACT ...
```
- Why this is a bug: two token contracts are both active in runtime components, causing drift.
- Severity: **Medium**
- Exact fix: consolidate into one contract and migrate all imports.

### 24) Debug/legacy comments indicate drift from actual constants
- File: `src/components/homepage/OperationsSpineScene.jsx:160`
- Snippet:
```jsx
// FIX: ... MOBILE_BREAKPOINT (760)
const MOBILE_BREAKPOINT = 768
```
- Why this is a bug: comment/documentation drift in fragile scroll codebase increases misconfiguration risk.
- Severity: **Medium**
- Exact fix: remove stale commentary and codify breakpoints in shared constants.

### 25) Internal SEO metadata updates ignore query changes
- File: `src/components/SiteMetaManager.jsx:276`
- Snippet:
```jsx
}, [location.pathname])
```
- Why this is a bug: canonical/meta remain stale on same-path query transitions.
- Severity: **Medium**
- Exact fix: include `location.search` when route-level query semantics matter.

## Low / Technical Debt

### 26) `console.error` shipped in homepage error boundary
- File: `src/pages/Home.jsx:75`
- Snippet:
```jsx
console.error(...)
```
- Severity: **Low**
- Fix: route through centralized monitoring and remove console noise in production builds.

### 27) Dead component inventory (unused in app graph)
- Files:
  - `src/components/AnimatedArrow.jsx`
  - `src/components/CurvedArrow.jsx`
  - `src/components/SceneBridgeDusk.jsx`
  - `src/components/SceneExitBridge.jsx`
  - `src/components/SceneNarrativeBreak.jsx`
  - `src/components/SceneNarrativeRelease.jsx`
  - `src/components/SceneProcessDepth.jsx`
  - `src/components/Button.jsx`
  - `src/hooks/useScrollSnap.js`
  - `src/motion/hooks/useMagneticMotion.js`
  - `src/motion/hooks/useSceneProgress.js`
  - `src/components/flagship/MotionText.jsx`
  - `src/components/flagship/MediaReveal.jsx`
  - `src/components/flagship/GradientBridge.jsx`
- Severity: **Low**
- Fix: remove or move to experimental folder and exclude from production bundle paths.

### 28) Unused dependency overhead
- Files: `package.json:32-37`, `vite.config.js:63`
- Example: `swiper`, `react-intersection-observer`, `react-lazy-load-image-component` not used by `src`.
- Severity: **Low**
- Fix: uninstall unused packages and simplify manualChunks.

### 29) Legacy Vite template CSS remains
- File: `src/App.css:9`
- Why this matters: dead style surface area increases confusion.
- Severity: **Low**
- Fix: delete unused file or import intentionally.

### 30) Duplicate selector typo
- File: `src/index.css:1602`
- Snippet:
```css
.flagship-home-cinematic .flagship-scene-content,
.flagship-home-cinematic .flagship-scene-content {
```
- Severity: **Low**
- Fix: remove duplicate selector.

## Scroll & Animation System Analysis
- Current reality: there is no single scroll runtime contract.
- Jitter sources:
  - Duplicate ScrollTrigger updates (Lenis callback + wheel bridge)
  - Frequent React state updates from GSAP `onUpdate`
  - Simultaneous GSAP pin + Framer transform + CSS transitions
- Duplication sources:
  - Legacy `.ops-spine-*` plus current `.osv2*`
  - Multiple motion token contracts
  - Dead alternate scene family still in codebase
- Resize jump sources:
  - Mount-time-only mobile checks in operations spine
  - Heavy `100vh` inline writes in pinned transitions
  - Mixed sticky/pinSpacing policies (`pinSpacing: true` and `false`)
- Mobile breakage sources:
  - Multiple pinned sections with no global mobile downgrade
  - `syncTouch: false` divergence between touch and wheel behavior
  - Hard viewport heights and fixed overlays

### Architectural fixes
1. Create one `ScrollRuntimeProvider` that owns Lenis, ScrollTrigger lifecycle, breakpoint policies, reduced-motion behavior.
2. Move pin configuration to registry-level declarative config (`enabledByBreakpoint`, `pinSpacing`, `endStrategy`).
3. Replace React state-based per-frame progress updates with MotionValue streams.
4. Remove global smooth scroll and route all programmatic scroll through one API.

## Responsive System Analysis
- Hardcoded viewport and width risks are widespread (`100vh`, `h-screen`, `100vw`, fixed px paddings/gaps).
- Breakpoint contract is inconsistent (`780`, `900`, `960`, `1080`, Tailwind `768/1024`, JS checks `768/1024`).
- Mixed layout systems (Tailwind + large global CSS + module CSS + inline style objects) create override unpredictability.
- Missing fluid guardrails:
  - many media blocks lack `width/height` attributes (CLS risk)
  - no shared `clamp` typography contract across all pages
  - multiple scene lengths in raw `vh` without mobile correction factors

## Performance Analysis
- Build output flags:
  - `assets/index.js` ~939k minified (too large)
  - empty chunk `carousel`
  - dynamic+static import conflict for Home
- Runtime hotspots:
  - Scroll frame state updates in `ScrollLockedSection`
  - Heavy animation layers: GSAP + Framer + Three.js canvas on landing
  - resize handlers without throttling
- Asset risks:
  - image-heavy scenes with no responsive `srcset`
  - large hero video + multiple overlays

### Improvement roadmap
1. Split Home scene groups into lazy chunks.
2. Remove dead code/dependencies and legacy CSS.
3. Convert scroll progress to MotionValue/store (not React state per frame).
4. Add image dimension hints and responsive sources.
5. Profile and cap Three.js workload on low-power devices.

## Architectural Maturity Assessment
- Classification: **Experimental**
- Why:
  - No unified scroll orchestration boundary
  - Multiple parallel animation/layout systems with side effects
  - Runtime behavior depends on fragile imperative DOM mutations
  - Significant dead code and duplicate implementation layers

## Dead Code & Redundancy
- Unused scene family files (bridge/break/release/process variants) coexist with active homepage scene stack.
- Unused UI primitives (`Button.jsx`) and motion hooks remain exported.
- Legacy operations styles remain in global CSS after migration to CSS module implementation.
- Route preload includes `loadHome` but App statically imports Home.

## Production Risk Assessment

### What breaks first
- Scroll rhythm and pin release on mid-tier mobile and small tablets.

### What crashes on low-end mobile
- Composite load from GSAP pinning + Framer transforms + Three.js ambient canvas + large media.

### What fails on Safari
- `100vh` pinned sections and sticky combinations during browser chrome expand/collapse.

### What fails on orientation change
- Operations spine mode mismatch due mount-time width check.

### What fails on resize
- Pin ownership and measured offsets drift; sections can jump or retain stale mode.

### What fails on dynamic content injection
- Any changed card heights/text lengths can desync progress mapping and end calculations in pinned scenes.

## Cleanup Roadmap (Priority Order)
1. Unify scroll runtime ownership and remove duplicate ScrollTrigger update pathways.
2. Fix BASE_URL asset resolution in OperationsSpine and replace all internal `<a href="/...">` route links.
3. Implement breakpoint-driven pin enable/disable for all pinned scenes.
4. Replace per-frame React state updates in scroll handlers with MotionValue/store-based progress.
5. Remove legacy ops CSS and dead scene/component/hook files.
6. Align breakpoint tokens across Tailwind, CSS, and JS.
7. Rework viewport units (`dvh/svh`) and eliminate hardcoded `100vh` writes.
8. Cut bundle size via Home lazy loading and dependency cleanup.

## Safe Refactor Order
1. Introduce non-breaking `ScrollRuntimeProvider` behind feature flag.
2. Migrate CommandArrival pin to provider-managed lifecycle.
3. Migrate SignatureReel/ScrollLockedSection progress to MotionValue.
4. Migrate OperationsSpine with responsive matchMedia lifecycle.
5. Remove legacy pathways (wheel bridge, old ops CSS, unused scenes/hooks).
6. Final pass: simplify CSS, re-audit breakpoints, and run cross-device QA matrix.

## Estimated Stability After Fixes
- After top 4 roadmap items: **7.2 / 10** expected stability.
- After full cleanup roadmap: **8.3 / 10** expected stability.
