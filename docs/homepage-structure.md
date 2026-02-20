# Homepage Phase 4 Structure + Cinematic Notes

## Scene Order & Layout Contract

| Scene ID | Tone Key | Mode | Length | Layout Intent | Transition Flag |
| --- | --- | --- | --- | --- | --- |
| `command-arrival` | `deep` | `free` | `110vh` | two-column authority hero + media chamber | `data-transition-ready="false"` |
| `authority-ledger` | `dark` | `free` | `85vh` | proof-first metrics + capability cards | `data-transition-ready="false"` |
| `signature-reel` | `dark` | `pinned` | `220vh` | anchor moment, scroll-locked aperture + horizontal conveyor | `data-transition-ready="false"` |
| `capability-matrix` | `steel` | `free` | `100vh` | primary capability lane + secondary tracks | `data-transition-ready="false"` |
| `operations-spine` | `steel` | `pinned` | `240vh` | process timeline with friction-led staged entries | `data-transition-ready="false"` |
| `narrative-bridge` | `warm` | `free` | `75vh` | decompression bridge before proof | `data-transition-ready="false"` |
| `proof-theater` | `linen` | `free` | `120vh` | rectangular featured testimonial + indexed rail | `data-transition-ready="false"` |
| `conversion-chamber` | `deep` | `free` | `120vh` | two-column close: commitment copy + real lead form | `data-transition-ready="false"` |
| `global-footer` | `deep` | `free` | `70vh` | 4-column utility + final command CTA | `data-transition-ready="false"` |

## Motion & Tone Contract Usage

- Motion timing/easing/distance/stagger are sourced from `MOTION_TOKEN_CONTRACT` and parsed via `parseBezier`.
- Scroll orchestration uses Lenis + GSAP ScrollTrigger pinning for `signature-reel` and `operations-spine`.
- Pinned scenes run with explicit pre/post friction buffers to reduce pin-entry jump.
- Scene metadata now ships with `data-theme="light"` and `data-transition-ready="false"` on both free and pinned scenes.
- Tone arc is enforced by registry sequencing:
  `deep -> dark -> dark -> steel -> steel -> warm -> linen -> deep -> deep`.
- Cinematic scene styling is routed through `.flagship-home-cinematic` tone tokens and per-scene mesh overlays in `src/index.css`.
- Default runtime palette is enforced as light across all tone keys:
  - `surface`: `#f6f7f9`
  - `surface-2`: `#ffffff`
  - `surface-3`: `#eef1f6`
  - `bg-main`: `#ffffff`
  - `bg-muted`: `#f6f7f9`
  - `ink`: `#1c1c1c`
  - `ink-muted`: `#5c6470`
  - `ink-subtle`: `#8892a0`
  - `accent`: `#1a1a1a`
  - `accent-strong`: `#0f0f0f`
  - `accent-soft`: `rgba(26,26,26,0.12)`
  - `border`: `rgba(28,28,28,0.12)`

## Scene Transition Hooks

- Added `scene-transition-hook` elements after every scene.
- Added baseline scene entry transitions at container level (`SceneWrapper` and `ScrollLockedSection`) using motion-token timing/easing.
- Current status: chapter-level transition cues remain placeholder fade gradients with pending marker line while bespoke cross-scene dissolve/parallax handoff is still unimplemented.
- Pinned scenes keep existing friction buffers plus transition hooks for smooth lock release staging.

## Hero + Ambient Polish

- Hero now runs layered depth planes:
  `AmbientDepthField` (background/mid/foreground), `HeroAmbientCanvas`, volumetric haze, directional light rays, and particle field.
- Hero media receives graded overlay and slow parallax drift tied to scroll progress.
- Hero copy is client-facing authority language, not internal/skeleton phrasing.
- Optional audio cue toggle remains intentional and explicitly labeled.

## Ambient Depth Across Scenes

- `signature-reel`, `operations-spine`, and `proof-theater` now include scene-specific ambient variants.
- Ambient layers are pointer-safe, low-opacity, and non-blocking to CTAs.
- Parallax depth is split into three planes with independent motion cadences.
- Reduced-motion path disables ambient animation and transform drift.

## Project/Testimonial Content Status

- Project reel pulls exactly 3 real case studies (`caseStudies.slice(0, 3)`), no synthetic logo pills.
- Testimonial rail pulls real entries from `testimonials` with rectangular media treatment.
- Featured proof panel includes name, role, organization, quote, progress bar, and indexed selectors.
- Placeholder policy:
  - No fake metrics, fake logos, or generated pending testimonials are in use.
  - Remaining content dependencies are media quality upgrades only (hero master grade, optional higher-res case stills), not structural placeholders.

## CTA Micro-Polish Notes

- `ScribbleButton` now uses pressure-like behavior:
  hover lift + slight scale-up, press compression, refined shadow drop, and controlled stroke-draw animation.
- Micro variant has lower lift and tighter press scale to prevent noisy motion in dense UI zones.
- Reduced-motion handling removes pressure animation and keeps immediate, stable state changes.

## Responsive & Interaction Notes

- Signature reel desktop: conveyor track tied to pinned progress.
- Signature reel mobile: `snap-x` horizontal track with manual `scrollIntoView` targeting.
- Proof theater mobile: touch-swipe gesture support (left/right threshold) on featured card.
- Ambient layer intensity is reduced under `max-width: 900px`.
- Scroll smoothing and pinned behavior are bypassed under reduced-motion for accessibility.

## Final QA + Deployment Checklist

- `npm run build` must pass before deploy.
- Manual QA required in browser for:
  - pinned lock/release behavior (`signature-reel`, `operations-spine`)
  - horizontal reel touch/drag behavior on mobile
  - testimonial swipe + nav button parity
  - ScribbleButton hover/press/focus states
- Lead capture requires configured webhook (`VITE_LEAD_WEBHOOK_URL`) for production submissions.
- Deploy target can be Netlify, Vercel, or internal host once manual QA items are cleared.
