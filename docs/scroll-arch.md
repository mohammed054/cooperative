# Scroll And Motion Architecture

## Files

- `src/layouts/ScrollLayout.tsx`
- `src/animations/fadeInUp.ts`
- `src/animations/staggerCards.ts`
- Section-level GSAP effects inside section components

## Current System

- Lenis owns smooth wheel/touch scrolling.
- GSAP ScrollTrigger is synchronized with Lenis.
- Scroll progress is shown by the fixed gold line at the top of the viewport.
- Sections use restrained reveals, parallax, and one pinned statement section.

## Motion Rules

- Motion should feel deliberate and calm.
- Avoid heavy decorative animation.
- Prefer section-level reveals and subtle media parallax.
- Keep `prefers-reduced-motion` support in `global.css`.

## Handoff Checks

- Test long-page scroll on desktop and mobile.
- Confirm pinned statement section does not trap scroll.
- Confirm hash navigation lands near the intended section.
