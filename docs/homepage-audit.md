# Homepage Production Handoff Audit (Phase 12)

## Final Runtime Status

- Homepage runs as a light-default cinematic experience.
- Pinned sequences are limited to `signature-reel` and `operations-spine` with friction buffers and scrub progression.
- Scene shells expose production media metadata through `data-media-refs` for traceability.
- Scaffold/debug runtime markers (`data-home-skeleton`, scene meta overlays, skeleton CSS namespace) are removed.

## Scene Order, Tone, Scroll Mode, CTA

| Order | Scene ID | Tone | Scroll Mode | Transition Ready | Primary CTA |
| --- | --- | --- | --- | --- | --- |
| 1 | `command-arrival` | `deep` | `free` | `true` | `Explore Capabilities`, `Request Proposal` |
| 2 | `authority-ledger` | `dark` | `free` | `true` | `Explore Capabilities` |
| 3 | `signature-reel` | `dark` | `pinned` | `true` | `View Case Study` |
| 4 | `capability-matrix` | `steel` | `free` | `true` | `Explore Capabilities` |
| 5 | `operations-spine` | `steel` | `pinned` | `true` | `Explore Capabilities` |
| 6 | `narrative-bridge` | `warm` | `free` | `true` | `Request Proposal` |
| 7 | `proof-theater` | `linen` | `free` | `true` | `Request Proposal` |
| 8 | `conversion-chamber` | `dark` | `free` | `true` | `Submit Request` |
| 9 | `global-footer` | `deep` | `free` | `true` | `Request Proposal` |

## Project/Testimonial/Media References

### Signature Reel (3 real projects)
- `Skyline Investor Summit` -> `images/event1.jpg`
- `Prestige Brand Launch` -> `images/event2.jpg`
- `Elite VIP Gala` -> `images/event3.jpg`

### Proof Theater (3 real testimonials)
- `Sarah Al-Mansouri, CEO, Skyline Ventures`
- `James Mitchell, Marketing Director, Prestige Group`
- `Layla Hassan, Events Manager, Elite Hospitality`
- Rectangular media rails map to case imagery (`event1.jpg`, `event2.jpg`, `event3.jpg`).

### Hero + Core Media
- Hero video: `videos/background.mp4`
- Capability/operations/narrative/conversion media refs are registry-backed and emitted per scene shell.

## Interaction & Conversion Integrity

- Scene-level actionable controls are standardized on `ScribbleButton`.
- Signature reel and testimonial rails support Prev/Next controls and bounded active-index logic.
- Mobile rails support snap behavior and programmatic scroll targeting.
- Conversion capture validates required fields (`Name`, `Company`, `Email`, `Budget Band`, `Event Type`) and returns explicit success/error feedback.
- Lead submission path uses live webhook when configured, with controlled stub fallback when not configured.

## Tone & Motion Contract

- Light token palette is enforced globally across scene tones.
- Tone arc is registry-locked: `deep -> dark -> dark -> steel -> steel -> warm -> linen -> dark -> deep`.
- Motion values are sourced from `MOTION_TOKEN_CONTRACT`; pinned mechanics are GSAP/ScrollTrigger with Lenis smoothing.
- Ambient layering and section transitions degrade safely under reduced-motion preference.

## Maintainer Notes

- Foundation contract key is `scene.media` (type/key/ref). Avoid reintroducing scaffold-era `mediaPlaceholder` naming.
- Scene media traceability is available via scene shell attributes:
  - `data-media-type`
  - `data-media-key`
  - `data-media-refs`
- Footer client logo strip is intentionally conditional and renders only when approved logo assets are mapped.
- Live lead capture requires `VITE_LEAD_WEBHOOK_URL` and optional `VITE_LEAD_WEBHOOK_KEY`.
