# Homepage / Landing Page Files Overview

## Core Page & Scene Registry
| File Path | Type | Description |
|-----------|------|-------------|
| `src/pages/Home.jsx` | React page | Renders the flagship cinematic homepage root, maps `HOMEPAGE_SCENE_REGISTRY` to scene components, drives ScrollTrigger refresh after fonts/load, and adjusts the `.flagship-home-cinematic` background token so each section (hero, capability, narrative, proof, conversion, footer) carries its intended tone. |
| `src/foundation/homepageFoundation.js` | Foundation / Scene registry | Authoritative scene catalog (command arrival, authority ledger, signature reel, capability matrix, operations spine, narrative bridge, proof theater, conversion chamber, global footer), tone state machine, motion tokens, and media references (hero video, case study images, gradient bridges) that guide every homepage layout and scroll transition. |
| `src/data/siteData.js` | Data module | Supplies the service blurbs, case-study metadata, and testimonial summaries plucked by the hero, capability matrix, proof theater, and other scenes plus the same data reused for meta tags and CTAs. |

## Cinematic Scene Implementations
| File Path | Type | Description |
|-----------|------|-------------|
| `src/components/homepage/HomeScenes.jsx` | React component suite | Houses every homepage scene (Command Arrival hero, Authority Ledger metrics, Signature Reel carousel, Capability Matrix cards, Narrative Bridge release, Proof Theater testimonials, Conversion Chamber form, Global Footer CTA) with GSAP/ScrollTrigger lifecycles, inline styling for gradients/overlays, and the conversion form that validates fields and wires into the lead capture stub. |
| `src/components/homepage/OperationsSpineScene.jsx` | React component | Renders the pinned delivery-timeline scene that animates vertical spine progression, rail fill, alternating phase cards, and the CTA scribble button via GSAP timelines that honor `MOBILE_BREAKPOINT` for desktop vs. mobile behavior; scroll progress also drives the visible phase indicator. |

## Scene Utilities & Meta Support
| File Path | Type | Description |
|-----------|------|-------------|
| `src/components/flagship/SceneWrapper.jsx` | Layout component | Wraps each scene with tone-aware classes, fade overlays, and sticky shell helpers so sections can control their own backgrounds while inheriting shared `flagship-scene` behavior used by HomeScenes and OperationsSpineScene. |
| `src/components/flagship/HeroAmbientCanvas.jsx` | Visual utility | Renders the WebGL particle field layered behind the hero copy (hidden when `prefers-reduced-motion` is active) to reinforce the cinematic hero stage. |
| `src/components/ScribbleButton.jsx` | CTA component | Reusable scribble-framed CTA (hero primary, capability/operations/reel CTAs, conversion submit/back-to-top, footer links) with link-aware behavior, analytics hooks, and toggleable arrow; used inside HomeScenes and OperationsSpineScene. |
| `src/components/ScribbleButton.css` | Component CSS | Defines the scribbled outline, hover pressure, disabled states, responsive sizes, and tone/variant palettes that keep the homepage CTAs consistent. |
| `src/components/SiteMetaManager.jsx` | Meta manager | Updates document title, OG/twitter/canonical tags, theme-color, and structured data whenever `location.pathname` changes; the homepage (`/`) entry points to `event1.jpg` and `country-bg.jpg`, ensuring the hero imagery and tone-strengthened palette surface in previews. |
| `src/utils/leadCapture.js` | Utility | Stubbed lead-capture helper that normalizes fields and either hits `VITE_LEAD_CAPTURE_ENDPOINT` or simulates a delay; invoked by the ConversionChamber form inside `HomeScenes.jsx`. |
| `src/lib/assetUrl.js` | Asset helper | Normalizes `public/images`/`public/videos` references to play nicely with `BASE_URL`, powering the hero video and every image reference across the homepage and meta manager. |
| `src/lib/constants.js` | Constants | Exports `MOBILE_BREAKPOINT`, which OperationsSpineScene uses to branch its GSAP timelines between desktop pinned animations and mobile stacked layouts. |

## Styling & Layout
| File Path | Type | Description |
|-----------|------|-------------|
| `src/index.css` | Global CSS | Declares the typography imports, Tailwind base layers, design tokens, scroll architecture rules (no `overflow-x:hidden`, `clip` usage), and the flagship tone/background/grid utilities that every homepage scene relies on for spacing, gradient bridges, and film-grain overlays. |
| `src/cinematicPhase2.css` | Global scene CSS | Injects the light/dark background washes, hero shimmer/lens layers, CTA transitions, grain overlays, and replica classes that complement the GSAP scenes defined in `HomeScenes.jsx`. |
| `src/components/cinematicScenes.css` | Scene-specific CSS | Hosts capability-grid layouts, gradient mesh animation, authority-ledger cards, form utilities, and typography helpers (`lux-*` classes) referenced by the hero, metrics, proof theater, and conversion form. |
| `src/components/homepage/OperationsSpineScene.module.css` | Module CSS | Styles the vertical spine grid, sticky panel, progress rail, shimmering phase cards, responsive adjustments, and reduced-motion overrides unique to the Operations Spine scene. |
| `src/styles/critical.css` | Critical CSS | Provides inlined hero and page-intro styling (hero layout, CTA pills, trust points) loaded early to prevent layout jumps at the start of the homepage experience. |

## Media Assets
| File Path | Type | Description |
|-----------|------|-------------|
| `public/videos/background.mp4` | Hero video | The command-arrival hero background footage referenced by `homepageFoundation` and played inside the sticky hero stage, layering behind the ambient canvas, gradient tints, and overlay masks. |
| `public/images/...` | Media assets | Shared imagery for the homepage: `event1.jpg`, `event2.jpg`, `event3.jpg` (hero metrics + proof theater), `full-production.png`, `lighting-effects.png`, `av-setup.png` (capability matrix/operations media), `process-bg.jpg`, `event-planning.png`, `event-planning-in-action.png` (operations storyboard), `product-large.jpg`/`product-small.jpg`, `country-bg.jpg`, `logo.webp`, `seating.png`, plus related stills used by `SiteMetaManager` and OG cards. |

## Documentation
| File Path | Type | Description |
|-----------|------|-------------|
| `docs/scenes.md` | Architecture doc | Cinematic scroll-architecture spec enumerating every homepage scene's height, tone, pinned/free behavior, animation cues, and the "no secondary scroll engines" constraints that the code enforces. |
-----------------------------------------------------------------------------------------------
# Homepage / Landing Page Current Problems Checklist

## General Scroll & Section Behavior
- Scroll bar should stay fixed; content moves upward while sections stick.
- Each section must stick until the next section appears.
- Fade overlays are applied inside the content box; should be outside the section.
- Sections appear out of sync (e.g., hero blank until scroll, last section disappears after scrolling past).
- Incorrect section background transitions (dark → light flashes black).
- Content pre-appears before scroll (images/text appear too early).
- Massive gaps / air above sections (e.g., "Request Proposal" section).
- Transitions between sections are abrupt; should be smooth fade-out/fade-in.

## Hero / First Section
- Hero text is positioned too low in the viewport.
- Hero content missing initial fade-in; should appear on load without scrolling.

## Projects / Signature Reel (Scene 3)
- Project images transition too quickly; first image should remain while next slowly takes over.
- Panel transitions don’t match scroll; scrolling changes panels prematurely.
- Content vs image timing is off; images appear fully before text reveal.

## Capability / Technical Depth Section (Scene 4)
- Fade applied inside the section; should fade around the box.
- Incorrect background fade (previous dark section flashes black before content appears).
- Content appears too fast; half scroll triggers everything immediately.
- Section below should appear light, not dark.

## Proof / Testimonial Section
- Scroll-to-reveal text missing; text should appear gradually as user scrolls.
- Section should stick; currently content disappears or scrolls past.
- Animation cadence too fast; should reveal one word at a time for cinematic effect.

## Request Proposal / Conversion Chamber
- Section doesn’t stick properly; scroll allows it to jump or flash.
- Massive black air gap above/below section breaks scroll continuity.
- Invisible or low-opacity text; some helper text/CTA is hard to read.
- Background flashes black before fading to intended color.

## Additional Issues
- No cinematic scroll effect; site still feels like a normal page scroll.
- Content pre-appearance; sections’ content should not appear until user scroll triggers it.
- Section highlight/reveal missing; text, cards, images should reveal progressively.
- Project images should animate slowly, with smooth transitions between each.