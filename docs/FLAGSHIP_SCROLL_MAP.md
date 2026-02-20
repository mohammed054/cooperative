# Flagship Homepage Current-State Audit

Scope: `src/pages/Home.jsx`, `src/components/homepage/HomeScenes.jsx`, `src/foundation/homepageFoundation.js`, `src/components/flagship/*`, `src/components/ScribbleButton.*`, `src/index.css`, `src/data/siteData.js`, `src/utils/leadCapture.js`.

Method: Code and style inspection only. No assumptions beyond what is explicitly implemented.

## 1. Scene Structure

| Order | Scene ID | Tone Key | Scroll Mode | Pin Status | Declared Length | Implementation State | Content Types Present |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `command-arrival` | `deep` | `free` | Not pinned | `100vh` | Implemented | Video, headline, subtitle, CTA |
| 2 | `authority-ledger` | `dark` | `free` | Not pinned | `85vh` | Implemented | Metrics, capability cards, CTA |
| 3 | `signature-reel` | `dark` | `pinned` | Pinned | `220vh` | Implemented | Project rail, active case panel, CTA |
| 4 | `capability-matrix` | `steel` | `free` | Not pinned | `100vh` | Implemented | Capability media cards |
| 5 | `operations-spine` | `steel` | `pinned` | Pinned | `240vh` | Implemented | Step timeline, images, progress rail, CTA |
| 6 | `narrative-bridge` | `warm` | `free` | Not pinned | `75vh` | Implemented | Text-only bridge card |
| 7 | `proof-theater` | `linen` | `free` | Not pinned | `120vh` | Implemented | Testimonial carousel + index rail |
| 8 | `conversion-chamber` | `dark` | `free` | Not pinned | `120vh` | Implemented | Form + persuasion copy |
| 9 | `global-footer` | `deep` | `free` | Not pinned | `70vh` | Implemented | Link columns, utility row, CTAs |

Scene-level placeholders/skeletons:

| Area | Current State |
| --- | --- |
| Scene structure | Not skeleton. Full scene sequence and components are wired. |
| Media in scenes | Real asset paths from `public/images/*` and `public/videos/background.mp4`. |
| Testimonials | Populated from `src/data/siteData.js` (3 entries). |
| Project panels | Populated from `caseStudies` (first 3). |
| Client logo strip in footer | Empty in runtime: `CLIENT_LOGO_ASSET_BY_ORGANIZATION` is an empty object, so logo section does not render. |

## 2. Hero / Landing Section (`command-arrival`)

### Video and dimensions
- Hero video source resolves from scene media (`/videos/background.mp4`).
- `motion.video` is full-bleed (`absolute inset-0`, `w-full h-full`, `object-cover`).
- Scene is forced to full viewport height (`100vh`, with `100dvh` support).

### Overlay text and style
- Eyebrow: `Executive Event Command`.
- Headline: `We command public moments where failure is visible and expensive.` (scene fallback and registry value match).
- Body copy: full paragraph about narrative direction/technical systems/floor authority.
- Primary CTA: ScribbleButton text `See Signature Builds`, links to `/work`.
- Overlay stack includes: `HeroAmbientCanvas` (Three.js), volumetric/light ray/particle/vignette/DOF layers, plus `hero-command-soften-layer`.

### White gaps / blocking overlays
- Transition hook visuals are globally disabled for homepage scenes.
- Special rule removes transition hook under first scene (`command-arrival`) to avoid light band.
- Hero has multiple non-interactive visual overlays (`pointer-events: none`), plus content overlay container (`pointer-events: auto`).

### CTA and ScribbleButton usage
- CTA uses `ScribbleButton` variant `primary`, `tone="light"`, size `md`, link mode (`to`).
- ScribbleButton includes optional scribble SVG stroke animation, hover shine layer, uppercase label, optional arrow.

### Desktop vs mobile behavior
- Same scene component on both.
- Copy width changes by breakpoint (`w-[90%]` to `lg:w-[40%]`).
- Hero layout CSS has mobile adjustments (`@media (max-width: 900px)`), including narrower container and single-column behavior.

## 3. Signature Reel and Project Panels

### Project placeholders and count
- Exactly 3 project panels (`caseStudies.slice(0, 3)`).
- Each panel has image, location tag, title, subtitle, and outcome line.

### Horizontal scroll behavior
- Pinned scene progress controls selected card index: `Math.floor(progress * PROJECTS.length)` (clamped).
- Desktop (`md+`): horizontal conveyor (`motion.div`) translates by progress (`x: conveyorOffset`).
- Mobile (`<md`): native horizontal rail (`overflow-x-auto`, snap) with manual card selection + scroll sync.

### Pinned scroll implementation
- `ScrollLockedSection` uses GSAP `ScrollTrigger` pinning:
  - `pin: lockEl`
  - `pinSpacing: false`
  - `scrub` based on motion token inertia
- Pinned scenes have pre/post friction buffers (`scene-friction-buffer`) with gradient backgrounds.

### Testimonial rail layout and media styling
- `proof-theater` is free-scroll, not pinned.
- Left panel: active testimonial image (`h-56`, cover), quote, identity, progress bar, prev/next micro CTAs.
- Right panel: index rail of testimonial buttons with small preview images.
- Supports keyboard arrows and touch swipe threshold for carousel navigation.

## 4. Conversion Chamber (`conversion-chamber`)

### Form fields present
- Hidden: `source_scene`, `source_path`, honeypot `website`.
- Visible required: `name`, `email`, `company`, `budget_band`, `event_type`, `scope`.
- Visible optional: `phone`, `target_window`.

### Submission behavior
- Client validation blocks submit if required fields are empty.
- If lead capture env is configured: submits to webhook via `submitLead`.
- If not configured: uses stub delay (`680ms`) and returns success mode `stub`.
- Success and error messages render in animated feedback panel.

### CTA implementation
- Submit button is `ScribbleButton` variant `primary`, tone `light`.
- Label toggles to `Submitting Request...` while submitting.

## 5. Footer (`global-footer` scene)

### Column structure
- Top message card (`Next Move`).
- Optional client logo strip (currently not rendered because no logos).
- Four utility columns:
  - Company links
  - Services links
  - Case Work links
  - Direct Contact
- Utility row with copyright, policy links, and micro CTA.
- Final standalone CTA button (`Request Proposal`).

### Placeholders / skeleton / unstyled
- No skeleton wrappers.
- Client logo block is conditionally empty due no mapped logo assets.
- All rendered footer blocks have explicit styling via scene cards and typography classes.

## 6. Motion & Tonal System

### Motion patterns and triggers
- Page-level smooth scrolling via Lenis (`useLenisScroll`) unless reduced motion.
- Scene entry wrappers animate with opacity + Y translate (`SceneWrapper`, `ScrollLockedSection`).
- Repeated reveal helpers:
  - `revealLift`: fade + upward translate
  - `revealSide`: fade + lateral translate
  - `revealMask`: clip-path reveal
  - `sequence`: stagger orchestration
- Ambient layers in multiple scenes animate infinitely (opacity, x/y drift, mild scale).
- Pinned sections: `signature-reel` and `operations-spine` use GSAP pinning and progress-driven UI state.

### Repeated fadeUp + blur patterns
- Repeated fade/slide-up is pervasive (`revealLift` and in-view motion blocks).
- Blur usage is mostly visual-surface blur (`backdrop-filter`) on cards/fields/hero layers, not repeated text blur transitions.

### Tonal enforcement vs rendered colors
- Foundation tone keys: `deep`, `dark`, `steel`, `warm`, `linen`.
- Tone flow is validated in code against registry.
- Actual rendered scene palettes are all light-mode token sets (`--color-ink` dark text on light surfaces) even for `dark`/`deep` keys.
- `theme="light"` is passed to all scenes and hooks.

## 7. Typography & Hierarchy

### Fonts
- Heading font: `Fraunces`.
- Body font: `Manrope`.
- Loaded via Google Fonts import + local `@font-face` declarations.

### Heading/body style tendencies
- Headlines: serif, negative tracking, clamp-based responsive sizes.
- Body: smaller neutral sans styles (`text-sm`/clamped body scales).
- Eyebrows: uppercase, high letter-spacing, micro sizes.

### Copy and CTA text character
- Tone is assertive/authority-driven and consistent across sections.
- Copy is authored content, not lorem ipsum.
- CTA labels are specific and repeated across sections (`See Signature Builds`, `Explore Capabilities`, `Submit Request`, `Request Proposal`, etc.).

## 8. Gaps and Issues (Current-State Only)

- Client logo proof strip in footer does not render because logo map is empty.
- Scene metadata/data attributes are present throughout DOM (`data-scene-id`, `data-scroll-mode`, `data-pin-behavior`, media refs, transition flags). These are not visually styled as debug UI, but they are visible in markup.
- Tone naming (`dark`, `deep`) does not correspond to dark visual rendering; scene backgrounds remain light gradients.
- Pre/post friction buffers around pinned scenes add visible gradient bands between sections by design.
- Several CSS classes exist for hero card/grid variants (`hero-command-grid`, `hero-command-copy-card`, `hero-command-accent-card`) but the hero JSX currently renders a simpler overlay composition.

## 9. Overall Assessment

- Current state classification: **partially fleshed production scaffold**.
- Not a bare skeleton: all 9 scenes render structured content, media, and interaction.
- Most production-ready areas: hero, pinned signature reel mechanics, operations spine mechanics, conversion form behavior, and global footer utility structure.
- Placeholder/unfinished indicators that remain:
  - Footer client logo module is effectively empty at runtime.
  - Some structural CSS scaffolding exists without matching scene JSX usage.
- Critical visual/functional state notes:
  - Pinned/free choreography is implemented and functional in code.
  - Theme/tone semantics and actual rendered palette are currently light-first across all scenes.
