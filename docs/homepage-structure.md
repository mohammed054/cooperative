# Homepage Final Production Structure

## Scene Registry Order (Locked)

| Order | Scene ID | Mode | Tone | Length | Core Purpose |
| --- | --- | --- | --- | --- | --- |
| 1 | `command-arrival` | `free` | `deep` | `110vh` | full-viewport hero film with authority overlay and primary CTA |
| 2 | `authority-ledger` | `free` | `dark` | `85vh` | outcome metrics, capability signals, and supporting CTA |
| 3 | `signature-reel` | `pinned` | `dark` | `220vh` | horizontal project conveyor with progress-driven reveal |
| 4 | `capability-matrix` | `free` | `steel` | `100vh` | asymmetric capability layout and craft depth |
| 5 | `operations-spine` | `pinned` | `steel` | `240vh` | staged process spine with friction and scrub progression |
| 6 | `narrative-bridge` | `free` | `warm` | `75vh` | narrative decompression into proof chapter |
| 7 | `proof-theater` | `free` | `linen` | `120vh` | testimonial showcase (rectangular media + controlled nav) |
| 8 | `conversion-chamber` | `free` | `dark` | `120vh` | qualified lead capture with success/error feedback |
| 9 | `global-footer` | `free` | `deep` | `70vh` | 4-column utility + legal/support utility row + final CTA |

## Hero / Command Arrival

- Hero is full viewport (`100vh`) with edge-to-edge background video (`autoplay`, `muted`, `loop`, `playsInline`).
- Left-aligned authority stack contains eyebrow, headline, subcopy, and primary CTA `See Signature Builds`.
- Right column is a restrained accent stack (briefing + control notes) to preserve hierarchy.
- Hero exit includes bottom fade plus scene transition hook to carry a smooth light-to-light handoff.

## Authority Ledger

- Free-scroll chapter with metric band and capability cards.
- Uses real media where available from scene media contract.
- Includes `ScribbleButton` CTA to services/capabilities.

## Signature Reel

- Pinned conveyor with exactly 3 real project panels (rectangular image + title + summary/outcome).
- Scroll progress updates active project; desktop conveyor animates with progress offset.
- Prev/Next controls use `ScribbleButton`.
- Mobile rail uses `snap-x` and `scrollIntoView` to preserve deterministic selection.

## Capability Matrix + Operations Spine

- Capability matrix remains free-scroll with asymmetric card composition.
- Operations spine remains pinned with active-step logic, progress rail, and staged spring transitions.
- Friction buffers remain in place before and after pinned chapters.

## Narrative Bridge + Proof + Conversion

- Narrative bridge copy is client-facing and transitions to proof without internal naming leaks.
- Proof theater uses rectangular media, named clients/roles, quote rotation, arrow navigation, and animated progress bar.
- Conversion chamber validates Name, Company, Budget, Event Type, Email; submits via webhook when configured or controlled stub when not.

## Global Footer

- Four primary columns: Company, Services, Work, Contact.
- Utility row includes legal/support links and a utility CTA.
- Final high-intent CTA remains `Request Proposal`.

## Motion + Interaction Contract

- Lenis smooth scroll is active globally.
- Pinned chapters run via ScrollTrigger scrub with momentum-aware progression.
- Motion vocabulary mixes reveal lift, side reveal, mask reveal, spring timeline entries, and ambient parallax layers.
- `ScribbleButton` is used for scene-level actions and chapter navigation controls.

## Theme Contract (Default Light)

- `surface #f6f7f9`
- `surface-2 #ffffff`
- `surface-3 #eef1f6`
- `bg-main #ffffff`
- `ink #1c1c1c`
- `ink-muted #5c6470`
- `ink-subtle #8892a0`
- `accent #1a1a1a`
- `border rgba(28, 28, 28, 0.12)`

## Production Integrity Notes

- SceneShell emits final runtime metadata (`data-scene-shell`, `data-media-*`, `data-scroll-mode`, `data-pin-behavior`).
- No debug overlays or scaffold metadata are rendered in scene UI.
- Scene order, pinned/free behavior, and tone flow remain aligned with foundation registry.
