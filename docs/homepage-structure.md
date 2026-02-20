# Homepage Phase 4 Structure + Cinematic Notes

## Scene Order & Layout Contract

| Scene ID | Tone | Mode | Length | Layout Intent | Primary CTA Surface |
| --- | --- | --- | --- | --- | --- |
| `command-arrival` | `deep` | `free` | `110vh` | two-column authority hero + media chamber | `View Signature Work`, `Start Confidential Brief` |
| `authority-ledger` | `dark` | `free` | `85vh` | proof-first metrics + capability cards | none (information-first) |
| `signature-reel` | `dark` | `pinned` | `220vh` | anchor moment, scroll-locked aperture + horizontal conveyor | `Previous Case`, `Next Case`, `Review Full Case` |
| `capability-matrix` | `steel` | `free` | `100vh` | primary capability lane + secondary tracks | none (information-first) |
| `operations-spine` | `steel` | `pinned` | `240vh` | process timeline with friction-led staged entries | `Review Full Process Architecture` |
| `narrative-bridge` | `warm` | `free` | `75vh` | decompression bridge before proof | none |
| `proof-theater` | `linen` | `free` | `120vh` | rectangular featured testimonial + indexed rail | `Previous`, `Next` |
| `conversion-chamber` | `deep` | `free` | `120vh` | two-column close: commitment copy + real lead form | `Request Executive Production Consult` |
| `global-footer` | `deep` | `free` | `70vh` | 4-column utility + final command CTA | `Request Executive Command Consult` |

## Motion & Tone Contract Usage

- Motion timing/easing/distance/stagger are sourced from `MOTION_TOKEN_CONTRACT` and parsed via `parseBezier`.
- Scroll orchestration uses Lenis + GSAP ScrollTrigger pinning for `signature-reel` and `operations-spine`.
- Pinned scenes run with explicit pre/post friction buffers to reduce pin-entry jump.
- Tone arc is enforced by registry sequencing:
  `deep -> dark -> dark -> steel -> steel -> warm -> linen -> deep -> deep`.
- Cinematic scene styling is routed through `.flagship-home-cinematic` tone tokens and per-scene mesh overlays in `src/index.css`.

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
