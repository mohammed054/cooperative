# Flagship Scroll Map

This map defines the cinematic narrative flow, motion rhythm, and conversion sequence for the flagship homepage.

## Motion Token References

- `duration.base`: `0.6s`
- `duration.slow`: `0.9s`
- `ease.cinematic`: `cubic-bezier(0.22,0.61,0.36,1)`
- `distance.fadeUp`: `40px`
- `blur.entry`: `8px -> 0px`
- `stagger.card`: `0.12s`
- `stagger.word`: `0.06s`
- `overlay.fade`: `0.5s`

## Scene Sequence

| Scene Name               | Scene ID                   | Scroll Behavior           | Background                                             | Motion & Entrance                                                                                                  | Transition Bridge                              | CTA Placement                                                    | Placeholder Media                                                 | Core Copy                                                                        |
| ------------------------ | -------------------------- | ------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Hero Authority           | `hero`                     | Free (`min-height:100vh`) | Deep cinematic gradient + ambient volumetric particles | Primary headline word-stagger (`stagger.word`), secondary stat fade-up (`distance.fadeUp`), ambient Three.js drift | Downward soft veil into lighter layer          | Soft CTA overlay with scribble button: **"We Engineer Moments"** | Hero video (`public/videos/background.mp4`) + dark fallback image | "Production direction for rooms that cannot slip."                               |
| Brand Positioning        | `brand-positioning`        | Free (`min-height:100vh`) | Warm neutral gradient                                  | Split-layout text fade-up + logo band stagger (`stagger.card`)                                                     | Light-to-neutral gradient bridge               | Secondary CTA: "See Signature Builds"                            | Editorial image panel                                             | "Studio-grade execution, senior-led from design to show call."                   |
| Signature Showcase       | `signature-showcase`       | Free (`min-height:100vh`) | High-contrast dark texture + glow accents              | MediaReveal cards with staggered scale/opacity, subtle parallax                                                    | Dark bridge with bloom edge                    | Inline CTA chip on featured case                                 | Showcase gallery cards                                            | "Flagship launches, summits, and private experiences engineered with precision." |
| Capability Establishment | `capability-establishment` | Scroll-locked (`240vh`)   | Dark-to-steel gradient                                 | Pinned card deck with GSAP timeline; card progression at `0.12s` cadence                                           | Mid-scene overlay fade (`overlay.fade`)        | Sticky side CTA: "Discuss Your Scope"                            | Capability cards + iconography                                    | "AV, lighting, scenic, and show control under one accountable command."          |
| Process Depth            | `process-depth`            | Scroll-locked (`260vh`)   | Deep charcoal to graphite                              | Pinned step timeline with headline swaps and progress rail                                                         | Neutral release bridge toward cinematic finale | Micro CTA after step 3                                           | Process diagram + checklist panel                                 | "Diagnose. Design. Deploy. Direct."                                              |
| Cinematic Finale         | `cinematic-finale`         | Free (`min-height:110vh`) | Light-meets-dark blended gradient                      | Heroic statement deblur (`blur.entry`) + phrase stagger                                                            | Soft dissolve to social proof                  | CTA pulse: "View Client Outcomes"                                | Full-width reveal media                                           | "Every cue feels effortless because control is invisible."                       |
| Social Proof             | `social-proof`             | Free (`min-height:100vh`) | Elegant warm surface                                   | Testimonial cards fade-up + logo strip marquee                                                                     | Warm-to-cool bridge                            | CTA in proof rail: "Read More Testimonials"                      | Testimonial portrait + logos                                      | "Trusted by teams who cannot miss."                                              |
| Global Presence          | `global-presence`          | Free (`min-height:100vh`) | Atmospheric world-map gradient                         | Region markers stagger in, counters count-up, subtle map drift                                                     | Cool gradient bridge to conversion             | CTA near stats: "Check UAE Coverage"                             | Stylized map + metrics                                            | "UAE-wide production reach with local operational intelligence."                 |
| Conversion Gravity       | `conversion-gravity`       | Free (`min-height:100vh`) | Premium dark panel with spotlight overlays             | Form and headline reveal in sequence (`duration.base` then `duration.slow`)                                        | Fade into footer                               | High-intent CTA scribble: **"Request a Private Consultation"**   | Conversion panel + lead form                                      | "Share event type, budget, and target date. We respond within 24 hours."         |
| Footer Continuation      | `footer`                   | Free (`min-height:auto`)  | Soft editorial neutral                                 | Subtle fade-in lists and legal links                                                                               | N/A                                            | Utility CTA: "Schedule Intro Call"                               | Brand mark + link columns                                         | "Built for high-stakes events, delivered with composure."                        |

## Conversion Psychology Placement

- Early soft CTA appears in `hero` as low-friction directional action.
- Qualification fields appear only in `conversion-gravity` to preserve premium flow:
  - Event type dropdown (lead qualification intent)
  - Budget selector (lead fit scoring)
- Form friction remains minimal (name, email, optional phone, event type, budget, brief).

## Scroll Rhythm Summary

- Free narrative scenes: `hero`, `brand-positioning`, `signature-showcase`, `cinematic-finale`, `social-proof`, `global-presence`, `conversion-gravity`, `footer`
- Locked depth scenes: `capability-establishment` (`240vh`), `process-depth` (`260vh`)
- Bridge overlays between dark/light contexts to avoid hard visual cuts.
