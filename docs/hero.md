# Hero Section

## Goal

The hero must immediately communicate that GHAIM handles events where reputation, timing, and discretion matter.

## Current Implementation

- Component: `src/sections/Hero.tsx`
- Uses `public/background.mp4` with `public/event1.jpg` as poster fallback.
- Uses `brand`, `clients`, and `stats` from `src/data/site.ts`.
- Primary CTAs link to selected work and the private briefing form.

## Quality Notes

- Text sits over a controlled dark overlay for readability.
- The hero maintains a strong first-viewport brand signal.
- The client strip creates immediate trust without crowding the headline.
- GSAP adds restrained media parallax during scroll.

## Edit Safely

- Update headline and support copy in `Hero.tsx`.
- Update proof metrics and client names in `src/data/site.ts`.
- Keep the hero background asset local for reliable deployment.
