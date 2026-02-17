# Mobile Hero Optimization Plan

## Overview

Restructure the HERO section for MOBILE ONLY while keeping desktop version PERFECT and untouched.

## Problem Statement

Current mobile hero has too many elements:

- Buttons take too much vertical space
- Extra content reduces video visibility
- Scroll indicator competes with CTAs
- Hero feels cluttered and heavy
- Video becomes background instead of emotional hook
- This reduces perceived premium quality

## Goal

Transform mobile hero into:

- Minimal
- Cinematic
- Premium
- Focused
- High-conversion
- Breathable

The video must become dominant again.

## Implementation Details

### Files to Modify

1. `/home/spikeyz/Desktop/projects/cooperative/src/components/Hero.jsx`
2. `/home/spikeyz/Desktop/projects/cooperative/src/components/ScribbleButton.jsx`
3. `/home/spikeyz/Desktop/projects/cooperative/src/components/ScribbleButton.css`

---

## Changes Summary

### 1. Hero.jsx Changes

#### Height & Spacing

- **Current:** `h-[100svh]` with `pt-20 pb-10`
- **New:** Keep height but reduce mobile padding to `pt-8 pb-6`
- **Desktop:** Unchanged (`sm:pt-24 sm:pb-14`)

#### Badge ("UAE event production")

- **Current:** Visible on all screens
- **New:** `hidden md:inline-flex` - hidden on mobile, visible desktop

#### Headline Typography

- **Current:** `text-[clamp(2.6rem,5vw,4.5rem)]` (min 41.6px)
- **New:**
  - Mobile: `text-[clamp(28px,6vw,36px)] leading-[1.1]`
  - Desktop: `md:text-[clamp(2.6rem,5vw,4.5rem)] md:leading-[1.02]`

#### Subline

- **Current:** 2 sentences: "Senior-led crews for AV, staging, lighting, seating, and show-day control. One accountable team, one timeline, no surprises."
- **New:** 1 sentence only: "Senior-led crews for AV, staging, lighting, and show-day control."
- **Mobile:** `text-sm text-white/70`
- **Desktop:** `md:text-base md:text-white/75 sm:text-lg`

#### Primary CTA Button

- **Current:** Rounded-full, large padding, heavy shadow
- **New:**
  - Mobile: `rounded` (not rounded-full), `px-5 py-3`, remove heavy shadow, `w-fit`
  - Desktop: Keep existing styling
  - Add `disableScribble` prop for mobile

#### Secondary CTA ("Explore services")

- **Current:** Full button with border, bg, padding
- **New:**
  - **Mobile:** Simple text link, no button styling
    - Font-size: 14px (`text-sm`)
    - Opacity: 0.7 (`text-white/70`)
    - Hover: `hover:text-white/90`
    - Spacing: `py-2` below primary CTA
    - Class: `md:hidden` (mobile only)
  - **Desktop:** Keep existing full button styling
    - Class: `hidden md:inline-flex` (desktop only)

#### Trust Indicators (3 items)

- **Current:** Visible on all screens
- **New:** `hidden md:flex` - hidden on mobile, visible desktop

#### Scroll Indicator

- **Current:** Large animated button at bottom
- **New:** `hidden md:block` - completely removed on mobile, kept on desktop

#### Radial Spotlights (Decorative)

- **Current:** Visible on all screens
- **New:** `hidden md:block` - removed on mobile to reduce clutter

---

### 2. ScribbleButton.jsx Changes

Add support for `disableScribble` prop:

- When `disableScribble={true}`, don't render the scribble SVG
- Pass through to CSS via data attribute or class

---

### 3. ScribbleButton.css Changes

Add media query to disable scribble animation on mobile:

```css
@media (max-width: 768px) {
  .scribble-button:hover .scribble-svg path {
    stroke-dashoffset: 12500;
    animation: none;
  }

  .scribble-button .scribble-svg {
    display: none;
  }
}
```

Alternative: Use `.no-scribble` class when prop is passed:

```css
.scribble-button.no-scribble .scribble-svg {
  display: none;
}
```

---

## Mobile Structure (Final)

```
<section>
  <video background>
  <overlay (simplified on mobile)>
  <content container>
    [HIDDEN: Badge]
    <h1>Production that keeps the room composed.</h1>
    <p>Senior-led crews for AV, staging, lighting, and show-day control.</p>
    <div class="button-group">
      <PrimaryCTA disableScribble />
      <SecondaryTextLink />
    </div>
    [HIDDEN: Trust indicators]
  </content>
  [HIDDEN: Scroll indicator]
</section>
```

---

## Responsive Breakpoints

All mobile changes wrapped in:

- Tailwind: Default classes for mobile, `md:` or `sm:` prefixes for desktop
- CSS: `@media (max-width: 768px)` for mobile-specific styles
- CSS: `@media (min-width: 769px)` or `md:` for desktop

---

## Typography Rules (Mobile Only)

| Element        | Size                     | Line Height | Other                              |
| -------------- | ------------------------ | ----------- | ---------------------------------- |
| Headline       | `clamp(28px, 6vw, 36px)` | 1.1         | Max 90% width                      |
| Subline        | 14-16px                  | Normal      | 70% opacity, max 2 lines           |
| Primary CTA    | 14px                     | Normal      | Max height 48px, clean rectangular |
| Secondary Link | 14px                     | Normal      | 70% opacity, no button styling     |

---

## Spacing Rules (Mobile Only)

- Container padding: `pt-8 pb-6 px-4`
- Gap between elements: 16-20px
- Headline margin-top: `mt-4`
- Subline margin-top: `mt-4`
- Button group margin-top: `mt-5`
- Secondary link padding: `py-2`

---

## Video Rules

- Fill entire background: `object-cover`
- Overlay: Single gradient layer `from-black/80 via-black/55 to-black/90`
- No heavy radial gradients on mobile
- Slight dark overlay allowed (rgba black 0.3-0.4)
- Video must be VISIBLE, not blocked by UI

---

## Performance (Mobile)

- Disable heavy scribble animations
- Reduce motion duration where kept
- Remove bounce effects
- Remove decorative blur filters
- Mobile = performance first

---

## Quality Checklist

After implementation, verify:

- [ ] Desktop layout identical to before
- [ ] Mobile hero height 90vh feel
- [ ] Video clearly visible behind content
- [ ] Headline max 2 lines on mobile
- [ ] Subline max 2 lines on mobile
- [ ] Primary CTA clean and rectangular
- [ ] Secondary CTA is text link only
- [ ] No scroll indicator on mobile
- [ ] No trust indicators on mobile
- [ ] No badge on mobile
- [ ] No radial spotlights on mobile
- [ ] No scribble animation on mobile
- [ ] All content fits in first fold
- [ ] Buttons don't overflow
- [ ] Typography scales properly
- [ ] Video breathes (minimal UI overlay)

---

## Commit Message

"Mobile hero simplified: removed scroll indicator, minimized secondary CTA, disabled scribble animation"

---

## Final Notes

- Do not redesign
- Do not overcomplicate
- Do not add new visual experiments
- Make it clean, controlled, premium
- Cinematic, minimal, focused on video + primary CTA
