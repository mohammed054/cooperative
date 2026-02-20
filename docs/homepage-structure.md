# Homepage Phase 12 Structure + Production Notes

## Scene Order & Layout Contract

| Scene ID | Tone | Mode | Length | Layout Intent | Primary CTA | Scene Media Refs (`data-media-refs`) |
| --- | --- | --- | --- | --- | --- | --- |
| `command-arrival` | `deep` | `free` | `110vh` | authority-led hero split (copy + cinematic media chamber) | `Explore Capabilities`, `Request Proposal` | `videos/background.mp4` |
| `authority-ledger` | `dark` | `free` | `85vh` | outcome metrics and proof-led capability framing | `Explore Capabilities` | `images/event1.jpg`, `images/full-production.png` |
| `signature-reel` | `dark` | `pinned` | `220vh` | anchor reel, scroll-locked conveyor + aperture stage | `View Case Study` | `images/event1.jpg`, `images/event2.jpg`, `images/event3.jpg` |
| `capability-matrix` | `steel` | `free` | `100vh` | primary capability lane + supporting craft modules | `Explore Capabilities` | `images/full-production.png`, `images/lighting-effects.png`, `images/av-setup.png` |
| `operations-spine` | `steel` | `pinned` | `240vh` | staged process timeline with progressive step lock | `Explore Capabilities` | `images/process-bg.jpg`, `images/event-planning.png`, `images/event-planning-in-action.png`, `images/full-production.png` |
| `narrative-bridge` | `warm` | `free` | `75vh` | decompression bridge before proof concentration | `Request Proposal` | `images/country-bg.jpg` |
| `proof-theater` | `linen` | `free` | `120vh` | rectangular featured testimonial + indexed rail | `Request Proposal` | `images/event1.jpg`, `images/event2.jpg`, `images/event3.jpg` |
| `conversion-chamber` | `dark` | `free` | `120vh` | commitment close with qualified lead capture | `Submit Request` | `images/product-large.jpg` |
| `global-footer` | `deep` | `free` | `70vh` | utility closure + direct contact and proposal path | `Request Proposal` | `images/logo.webp` |

## Motion + Tone Contract

- Runtime orchestration uses Lenis (`useLenisScroll`) + GSAP ScrollTrigger pinning in `signature-reel` and `operations-spine`.
- Pinned sections use explicit pre/post friction buffers (`scene-friction-buffer`) to smooth entry and release.
- Scene transitions run on container shells (`SceneWrapper`, `ScrollLockedSection`) with `MOTION_TOKEN_CONTRACT` easing/duration.
- Transition status is explicit per scene via `data-transition-ready`.
- Light-theme default is enforced across all tones using cinematic token surfaces:
  - `surface #f6f7f9`, `surface-2 #ffffff`, `surface-3 #eef1f6`
  - `ink #1c1c1c`, `ink-muted #5c6470`, `ink-subtle #8892a0`
  - `accent #1a1a1a`, `accent-strong #0f0f0f`, `border rgba(28,28,28,0.12)`
- Tone flow remains locked to:
  `deep -> dark -> dark -> steel -> steel -> warm -> linen -> dark -> deep`.

## Ambient Layering & Hero Polish

- Hero uses layered depth planes: `AmbientDepthField` + `HeroAmbientCanvas` + volumetric/ray/particle/vignette/DOF overlays.
- Reel, operations, proof, ledger, matrix, and bridge scenes each include scene-specific ambient variants.
- Ambient motion is reduced or disabled when `prefers-reduced-motion` is active.

## Project/Testimonial/Proof Integration

- Signature reel is populated from real case studies (`caseStudies.slice(0, 3)`), with desktop conveyor and mobile snap rail.
- Testimonial rail is populated from real testimonial records (`testimonials.slice(0, 3)`), with rectangular media and keyed progression.
- Prev/Next controls and index selectors use `ScribbleButton` and bounded active-index logic.
- Client logo strip renders only when real logo assets are configured; otherwise it is omitted from output.

## Conversion & Lead Capture

- Conversion form fields: `Name`, `Email`, `Company`, `Phone`, `Budget Band`, `Event Type`, `Target Date Window`, `Project Scope`.
- Required validation enforces `Name`, `Email`, `Company`, `Budget Band`, `Event Type`, and `Project Scope`.
- Submission path:
  - Live webhook when `VITE_LEAD_WEBHOOK_URL` is configured (`submitLead`).
  - Timed stub acknowledgement when webhook is not configured.
- Success and failure states are surfaced in an ARIA-live feedback panel with clear status handling.

## Responsive + Accessibility Notes

- Signature reel mobile uses `snap-x` + `scrollIntoView` syncing and keyboard activation on cards.
- Proof theater supports touch-swipe (`threshold 46px`) and keyboard arrow navigation.
- All scene-level actions use `ScribbleButton` for consistent hover/focus/active behavior.
- Reduced-motion mode disables animated drift/ambient loops and preserves layout integrity.

## Maintainer Notes

- Scene media metadata is emitted in `SceneShell` (`data-media-type`, `data-media-key`, `data-media-refs`) from the foundation registry.
- Foundation contract now uses `scene.media` (not scaffold placeholder naming).
- To enable live lead capture in production, set:
  - `VITE_LEAD_WEBHOOK_URL`
  - optional `VITE_LEAD_WEBHOOK_KEY`
- To display client logos in footer, map organization names to logo assets in `CLIENT_LOGO_ASSET_BY_ORGANIZATION`.
