# Homepage Final Cinematic Handoff

## Status
Homepage is configured as a production cinematic flow using the established registry order and light-theme tone system.

## Final Scene Map

1. `command-arrival` - full-viewport hero film + left authority overlay + `See Signature Builds` CTA.
2. `authority-ledger` - metrics and capability proof with service CTA.
3. `signature-reel` - pinned 3-project horizontal conveyor with scroll + manual navigation.
4. `capability-matrix` - free asymmetric capability chapter.
5. `operations-spine` - pinned timeline spine with progressive state reveal.
6. `narrative-bridge` - transition chapter into proof.
7. `proof-theater` - testimonial rail with rectangular media, arrows, and progress feedback.
8. `conversion-chamber` - qualified form flow with success/error feedback.
9. `global-footer` - 4-column utility + legal/support row + final proposal CTA.

## Asset Integration

- Hero media: `videos/background.mp4`
- Signature reel media: `images/event1.jpg`, `images/event2.jpg`, `images/event3.jpg`
- Proof media: mapped from case assets to testimonial rail cards
- Capability/process media: sourced from available production image set in `public/images`

## Interaction Completion

- All scene-level CTAs and chapter nav controls use `ScribbleButton`.
- Prev/Next in signature reel and proof theater are active and bounded.
- Mobile rail snapping and `scrollIntoView` targeting are active for project cards.
- Conversion form validates required fields and submits to live webhook (when configured) or controlled stub fallback.

## Motion / Scroll Completion

- Lenis smooth scroll enabled globally.
- Pinned sequences keep pre/post friction buffers.
- Chapter transitions use subtle fade/parallax continuity under light theme.
- Reduced-motion fallback disables nonessential loops while preserving layout and function.

## Theme Completion

- Default light palette is enforced across all scenes.
- Shadows, gradients, and overlays are restrained for depth without dark-heavy treatment.
- Tone flow preserved: `deep -> dark -> dark -> steel -> steel -> warm -> linen -> dark -> deep`.

## Runtime Metadata

SceneShell emits final runtime attributes for QA/analytics tracing:
- `data-scene-shell`
- `data-scroll-mode`
- `data-pin-behavior`
- `data-layout`
- `data-media-type`
- `data-media-key`
- `data-media-refs`
