# COMPREHENSIVE HERO / LANDING SECTION DOCUMENTATION - GHAIM UAE

**Purpose**: Complete technical and visual reference for the Hero section (landing section). This document explains every behavior, pixel, state, animation, layer, element, and mobile responsiveness consideration.

**Version**: 1.0
**Last Updated**: February 2026
**Location**: `src/components/Hero.jsx`

---

# TABLE OF CONTENTS

1. [Section Overview](#1-section-overview)
2. [Layer Architecture](#2-layer-architecture)
3. [Background Layer (Video/Image)](#3-background-layer-videoimage)
4. [Dark Overlay Layer](#4-dark-overlay-layer)
5. [Radial Spotlight Effects](#5-radial-spotlight-effects)
6. [Content Container](#6-content-container)
7. [Eyebrow Badge](#7-eyebrow-badge)
8. [Main Headline (H1)](#8-main-headline-h1)
9. [Subheadline Paragraph](#9-subheadline-paragraph)
10. [CTA Buttons](#10-cta-buttons)
11. [Trust Indicators](#11-trust-indicators)
12. [Scroll Indicator](#12-scroll-indicator)
13. [Scribble Button Component](#13-scribble-button-component)
14. [Animations & Motion](#14-animations--motion)
15. [State Management](#15-state-management)
16. [Accessibility (A11y)](#16-accessibility-a11y)
17. [Mobile Responsiveness Analysis](#17-mobile-responsiveness-analysis)
18. [Issues & Recommendations](#18-issues--recommendations)
19. [Browser-Specific Notes](#19-browser-specific-notes)
20. [Performance Considerations](#20-performance-considerations)

---

# 1. SECTION OVERVIEW

## 1.1 Purpose

The Hero section is the **first thing users see** when they land on the website. It serves multiple purposes:

1. **First Impression**: Establishes the premium, corporate brand identity immediately
2. **Value Proposition**: Communicates what the company does in seconds
3. **Call to Action**: Guides users toward conversion (request proposal)
4. **Navigation**: Scroll indicator suggests there's more content below

## 1.2 Key Characteristics

| Property             | Value                                        |
| -------------------- | -------------------------------------------- |
| Full viewport height | `h-[100svh]` (100% smallest viewport height) |
| Background           | Black with video/image                       |
| Text color           | White (for contrast)                         |
| Primary CTA          | "Request a proposal" (white button)          |
| Secondary CTA        | "Explore services" (ghost button)            |
| Animation            | Fade-in on load, continuous scroll bounce    |

## 1.3 Component Location

```javascript
// File: src/components/Hero.jsx
// Lines: 137 total

const Hero = () => {
  // ... component code
}

export default Hero
```

---

# 2. LAYER ARCHITECTURE

## 2.1 Layer Stack (Bottom to Top)

The Hero section is composed of **5 layers** stacked on top of each other using `position: absolute`:

```
┌─────────────────────────────────────────────┐
│ LAYER 5: CONTENT (z-10)                   │
│  - Eyebrow badge                          │
│  - Headline (H1)                          │
│  - Subheadline                            │
│  - CTA buttons                            │
│  - Trust indicators                       │
│  - Scroll indicator                       │
└─────────────────────────────────────────────┘
│ LAYER 4: SPOTLIGHT EFFECTS (z-0)         │
│  - Radial gradient #1 (top center)         │
│  - Radial gradient #2 (bottom left)        │
└─────────────────────────────────────────────┘
│ LAYER 3: DARK OVERLAY (z-0)              │
│  - Linear gradient: black/80 → black/55   │
│    → black/90                             │
└─────────────────────────────────────────────┘
│ LAYER 2: VIDEO (z-0)                     │
│  - Auto-playing, muted, looped MP4        │
│  - Fades in when ready                    │
└─────────────────────────────────────────────┘
│ LAYER 1: FALLBACK IMAGE (z-0)            │
│  - Static JPEG shown while video loads    │
│  - Fades out when video is ready          │
└─────────────────────────────────────────────┘
│ LAYER 0: SECTION CONTAINER (relative)     │
│  - Black background (#000000)             │
│  - Fixed to viewport (100svh)             │
│  - Overflow hidden                        │
└─────────────────────────────────────────────┘
```

## 2.2 Z-Index Management

| Layer             | z-index            | Purpose                      |
| ----------------- | ------------------ | ---------------------------- |
| Section container | relative           | Establishes stacking context |
| Background image  | absolute (inset-0) | Bottom layer                 |
| Video             | absolute (inset-0) | Above image                  |
| Dark overlay      | absolute (inset-0) | Above video                  |
| Spotlights        | absolute (inset-0) | Above overlay                |
| Content           | relative, z-10     | Above all layers             |

---

# 3. BACKGROUND LAYER (VIDEO/IMAGE)

## 3.1 Container

```jsx
<div className="absolute inset-0 h-full w-full" style={{ aspectRatio: '16/9' }}>
  {/* Image and Video go here */}
</div>
```

**Properties**:

- `absolute inset-0`: Covers entire parent
- `h-full w-full`: Full height and width
- `aspectRatio: '16/9'`: Maintains 16:9 aspect ratio
- This ensures consistent sizing regardless of video/image dimensions

## 3.2 Fallback Image

```jsx
<img
  src={assetUrl('images/event1.jpg')}
  alt="Event production in the UAE"
  className={`absolute inset-0 h-full w-full object-cover 
              transition-opacity duration-700 
              ${videoReady ? 'opacity-0' : 'opacity-100'}`}
  loading="eager"
  decoding="async"
  width="1920"
  height="1080"
/>
```

### Image Properties

| Property | Value                         | Explanation                |
| -------- | ----------------------------- | -------------------------- |
| Source   | `/images/event1.jpg`          | Event production photo     |
| Alt text | "Event production in the UAE" | Descriptive for a11y       |
| loading  | "eager"                       | High priority - above fold |
| decoding | "async"                       | Non-blocking decode        |
| width    | 1920                          | Explicit dimensions        |
| height   | 1080                          | For aspect ratio           |

### Display Logic

| State           | Class         | Opacity      |
| --------------- | ------------- | ------------ |
| Video NOT ready | `opacity-100` | 100% visible |
| Video ready     | `opacity-0`   | Hidden       |

### Transition

```css
transition-opacity duration-700
```

- **Duration**: 700ms (0.7 seconds)
- **Property**: opacity only
- **Effect**: Smooth fade between image and video

## 3.3 Video Element

```jsx
<video
  className={`absolute inset-0 h-full w-full object-cover 
              transition-opacity duration-700 
              ${videoReady ? 'opacity-100' : 'opacity-0'}`}
  autoPlay={!shouldReduceMotion}
  muted
  loop={!shouldReduceMotion}
  playsInline
  preload="none"
  poster={assetUrl('images/event1.jpg')}
  onLoadedData={() => setVideoReady(true)}
  aria-hidden="true"
  width="1920"
  height="1080"
>
  <source src={assetUrl('videos/background.mp4')} type="video/mp4" />
</video>
```

### Video Attributes

| Attribute    | Value               | Purpose                                                 |
| ------------ | ------------------- | ------------------------------------------------------- |
| autoPlay     | !shouldReduceMotion | Play automatically unless reduced motion                |
| muted        | true                | Required for autoplay (browsers block unmuted autoplay) |
| loop         | !shouldReduceMotion | Repeat unless reduced motion                            |
| playsInline  | true                | Play in-place on iOS (not fullscreen)                   |
| preload      | "none"              | Don't download until needed (performance)               |
| poster       | event1.jpg          | Thumbnail shown while loading                           |
| aria-hidden  | true                | Screen readers ignore (decorative)                      |
| width/height | 1920/1080           | Explicit dimensions                                     |

### Video States

| State           | Class         | Opacity |
| --------------- | ------------- | ------- |
| Video NOT ready | `opacity-0`   | Hidden  |
| Video ready     | `opacity-100` | Visible |

### Transition Logic

```javascript
const [videoReady, setVideoReady] = useState(false)

// When video data loads:
onLoadedData={() => setVideoReady(true)}
```

1. Page loads → `videoReady = false`
2. Image shows (opacity-100)
3. Video starts loading in background
4. Video data ready → `setVideoReady(true)`
5. Both image and video transition (700ms)
6. Final: Image opacity-0, Video opacity-100

### Display Properties

```css
className="absolute inset-0 h-full w-full object-cover"
```

- `absolute inset-0`: Covers container
- `h-full w-full`: Full size
- `object-cover`: Scales to fill while preserving aspect ratio

---

# 4. DARK OVERLAY LAYER

## 4.1 Gradient Overlay

```jsx
<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90" />
```

### Gradient Stops

| Stop | Value    | Position     | Opacity |
| ---- | -------- | ------------ | ------- |
| from | black/80 | Start (0%)   | 80%     |
| via  | black/55 | Middle (50%) | 55%     |
| to   | black/90 | End (100%)   | 90%     |

### Gradient Direction

```
bg-gradient-to-b = Top to Bottom
```

**Visual Effect**:

```
┌────────────────────────────┐
│   ██ 80% black (top) ██   │ ← Darkest at top
│   ██ 65% black ████       │
│   ██ 55% black (middle) ██│ ← Lightest in middle
│   ██ 65% black ████       │
│   ██ 90% black (bottom) ██ │ ← Very dark at bottom
└────────────────────────────┘
```

### Why This Gradient?

1. **Top (80%)**: Header area is darkest to make logo/nav readable
2. **Middle (55%)**: Slightly lighter to let video show through
3. **Bottom (90%)**: Dark again where content sits (headline, CTAs)

## 4.2 Visual Purpose

The gradient serves multiple purposes:

| Purpose          | Explanation                                       |
| ---------------- | ------------------------------------------------- |
| Text readability | Ensures white text pops against any video content |
| Consistency      | Creates uniform "canvas" regardless of video      |
| Depth            | Darker edges draw attention to center             |
| Professionalism  | Premium, corporate feel                           |

---

# 5. RADIAL SPOTLIGHT EFFECTS

## 5.1 Implementation

```jsx
<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-0 opacity-80"
  style={{
    backgroundImage: `
      radial-gradient(
        900px 520px at 50% 5%, 
        var(--color-video-overlay-accent), 
        transparent 60%
      ), 
      radial-gradient(
        700px 520px at 0% 70%, 
        rgba(255,255,255,0.08), 
        transparent 58%
      )
    `,
  }}
/>
```

## 5.2 First Radial Gradient (Main Spotlight)

| Property | Value                             |
| -------- | --------------------------------- |
| Shape    | Ellipse                           |
| Width    | 900px                             |
| Height   | 520px                             |
| Position | 50% horizontal, 5% from top       |
| Color    | var(--color-video-overlay-accent) |
| Fade     | Transparent after 60%             |

### CSS Variable Value

```css
--color-video-overlay-accent: rgba(26, 26, 26, 0.22);
```

So the gradient is:

```
rgba(26, 26, 26, 0.22) at center → transparent at 60%
```

### Position Visualization

```
┌─────────────────────────────────────────────┐
│                    ○                       │ ← 900×520px at 50%, 5%
│               (spotlight)                  │
│                                             │
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

## 5.3 Second Radial Gradient (Subtle White Glow)

| Property | Value                                |
| -------- | ------------------------------------ |
| Shape    | Ellipse                              |
| Width    | 700px                                |
| Height   | 520px                                |
| Position | 0% horizontal (left), 70% from top   |
| Color    | rgba(255,255,255,0.08) - white at 8% |
| Fade     | Transparent after 58%                |

### Position Visualization

```
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                             │
│                                             │
│  ○                                         │ ← 700×520px at 0%, 70%
│                                             │
└─────────────────────────────────────────────┘
```

## 5.4 Combined Effect

```
                    ┌─────────────────┐
                    │   ◯ DARK SPOT   │  ← Top center (dark accent)
                    │    (900×520)    │
                    └─────────────────┘


  ◯ WHITE GLOW
  (700×520)

   ───────────────────────────────────────────

   Content Area (darkest for readability)
```

## 5.5 Why These Effects?

| Effect                   | Purpose                           |
| ------------------------ | --------------------------------- |
| Top spotlight            | Simulates overhead stage lighting |
| Bottom-left glow         | Subtle ambient light              |
| 80% opacity on container | Subtle enough to not distract     |
| pointer-events-none      | Click-through to video            |

---

# 6. CONTENT CONTAINER

## 6.1 Container Structure

```jsx
<div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 pb-10 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8">
  <motion.div className="w-full max-w-3xl">
    {/* All content goes here */}
  </motion.div>
</div>
```

## 6.2 Container Properties

### Outer Div

```css
/* Positioning */
position: relative;
z-index: 10; /* Above all background layers */

/* Layout */
display: flex;
align-items: center; /* Vertically center content */
justify-content: center;

/* Sizing */
height: 100%; /* Full height of section */

/* Container */
max-width: 1280px; /* max-w-7xl */
margin-left: auto;
margin-right: auto;

/* Responsive padding */
padding-left: 16px; /* mobile */
padding-right: 16px;

padding-left: 24px; /* sm: (640px+) */
padding-right: 24px;

padding-left: 32px; /* lg: (1024px+) */
padding-right: 32px;

/* Vertical padding */
padding-bottom: 40px; /* pb-10 (mobile) */
padding-bottom: 56px; /* sm:pb-14 (tablet+) */
padding-top: 80px; /* pt-20 (mobile) */
padding-top: 96px; /* sm:pt-24 (tablet+) */
```

### Responsive Padding Summary

| Breakpoint | Width   | Padding-X | Padding-Top | Padding-Bottom |
| ---------- | ------- | --------- | ----------- | -------------- |
| Default    | <640px  | 16px      | 80px        | 40px           |
| sm         | 640px+  | 24px      | 96px        | 56px           |
| lg         | 1024px+ | 32px      | 96px        | 56px           |

**Why this padding?**

- Top padding accounts for fixed header (76px) + breathing room
- Bottom padding creates space above scroll indicator
- More top padding on mobile because header is prominent

## 6.3 Motion Div (Content Wrapper)

```css
/* Sizing */
width: 100%;
max-width: 672px; /* max-w-3xl */

/* Animation handled by Framer Motion */
```

---

# 7. EYEBROW BADGE

## 7.1 Structure

```jsx
<div
  className="inline-flex items-center gap-2 rounded-full 
                border border-white/[0.2] bg-white/[0.1] 
                px-4 py-2 text-xs font-semibold uppercase 
                tracking-[0.24em] text-white/90 backdrop-blur"
>
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
  UAE event production
</div>
```

## 7.2 Visual Breakdown

### Container Layout

```css
display: inline-flex;
align-items: center;
gap: 8px; /* gap-2 */
```

- `inline-flex`: Shrinks to fit content (not full width)
- `items-center`: Vertically center
- `gap-2`: 8px between dot and text

### Border

```css
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 9999px; /* rounded-full */
```

| Property | Value        | Visual           |
| -------- | ------------ | ---------------- |
| Width    | 1px          | Thin, subtle     |
| Color    | white at 20% | Very faint white |
| Radius   | 9999px       | Pill shape       |

### Background

```css
background: rgba(255, 255, 255, 0.1);
```

| Property | Value                   |
| -------- | ----------------------- |
| Color    | white at 10% opacity    |
| Effect   | Glass-like, subtle tint |

### Padding

```css
padding-left: 16px; /* px-4 */
padding-right: 16px;
padding-top: 8px; /* py-2 */
padding-bottom: 8px;
```

- Compact, badge-like sizing

### Typography

```css
font-size: 12px; /* text-xs */
font-weight: 600; /* font-semibold */
text-transform: uppercase; /* uppercase */
letter-spacing: 0.24em; /* tracking-[0.24em] ≈ 2.88px */
color: rgba(255, 255, 255, 0.9); /* text-white/90 */
```

| Property  | Value          | Effect                  |
| --------- | -------------- | ----------------------- |
| Size      | 12px           | Small, label-like       |
| Weight    | 600 (semibold) | Slightly bold           |
| Transform | uppercase      | ALL CAPS                |
| Spacing   | 2.88px wide    | Premium, editorial feel |
| Color     | 90% white      | Almost full white       |

### Backdrop Blur

```css
backdrop-filter: blur(...);
```

- Creates frosted glass effect
- Makes badge readable over video

## 7.3 Status Dot

```jsx
<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
```

### Properties

| Property | Value                    |
| -------- | ------------------------ |
| Width    | 1.5 × 1.5px (6px)        |
| Shape    | Circle (rounded-full)    |
| Color    | bg-emerald-400 (#34d399) |
| Purpose  | "Live" indicator         |

### Color: Emerald-400

```
HEX: #34d399
RGB: 52, 211, 153
```

This is a **bright green** that:

- Indicates "live" or "active" status
- Provides color contrast to the dark background
- Subtle but noticeable

## 7.4 Full Visual

```
┌────────────────────────────────────┐
│  ● UAE EVENT PRODUCTION           │ ← White text, emerald dot
└────────────────────────────────────┘
```

---

# 8. MAIN HEADLINE (H1)

## 8.1 Structure

```jsx
<h1
  className="mt-6 text-[clamp(2.6rem,5vw,4.5rem)] 
              font-semibold leading-[1.02] 
              tracking-tight text-white font-serif"
>
  Production that keeps the room composed.
</h1>
```

## 8.2 Typography Properties

### Font Family

```css
font-family: 'Fraunces', serif;
```

- **Font**: Fraunces (Google Fonts)
- **Category**: Serif
- **Usage**: All headings
- **Feel**: Elegant, premium, editorial

### Font Size (Responsive)

```css
font-size: clamp(2.6rem, 5vw, 4.5rem);
```

**Responsive Behavior**:

| Viewport         | Calculation | Size          |
| ---------------- | ----------- | ------------- |
| 320px (mobile)   | 2.6rem      | 41.6px        |
| 500px            | 5vw         | 25px          |
| 768px (tablet)   | 5vw         | 38.4px        |
| 900px            | 5vw         | 45px (capped) |
| 1440px (desktop) | 4.5rem      | 72px          |

### Clamp Explanation

```
clamp(min, preferred, max)

min:    2.6rem  = 41.6px  (never smaller than this)
preferred: 5vw    = 5% of viewport width (scales with width)
max:    4.5rem  = 72px   (never larger than this)
```

### Why Clamp?

- Creates **fluid typography** that scales smoothly
- No breakpoints needed for font size changes
- Consistent experience across all devices

### Font Weight

```css
font-weight: 600; /* semibold */
```

| Weight   | Value | Usage                     |
| -------- | ----- | ------------------------- |
| Regular  | 400   | Body text                 |
| Medium   | 500   | Labels                    |
| Semibold | 600   | Headings, buttons         |
| Bold     | 700   | (Not used in this design) |

### Line Height

```css
line-height: 1.02;
```

- **1.02** = 102% of font size
- Very tight, headline-style
- Prevents excessive vertical spacing
- Makes text feel cohesive

### Letter Spacing

```css
letter-spacing: -0.02em; /* tracking-tight */
```

- **-0.02em** = characters drawn 2% closer together
- Creates more formal, premium feel
- Standard for headlines

### Color

```css
color: white; /* text-white */
```

- Pure white for maximum contrast
- Ensures readability over dark background

## 8.3 Margin

```css
margin-top: 24px; /* mt-6 */
```

- 24px space from eyebrow badge
- Consistent vertical rhythm

## 8.4 Full Visual

```
┌──────────────────────────────────────────────────────────────┐
│  ● UAE EVENT PRODUCTION                                     │
│                                                              │
│  Production that keeps the room composed.                   │ ← H1 (41-72px, white, Fraunces serif)
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

# 9. SUBHEADLINE PARAGRAPH

## 9.1 Structure

```jsx
<p
  className="mt-6 max-w-2xl text-base leading-relaxed 
              text-white/75 sm:text-lg"
>
  Senior-led crews for AV, staging, lighting, seating, and show‑day control. One
  accountable team, one timeline, no surprises.
</p>
```

## 9.2 Typography Properties

### Font Size

```css
font-size: 16px; /* text-base (mobile) */
font-size: 18px; /* sm:text-lg (640px+) */
```

| Breakpoint | Size |
| ---------- | ---- |
| <640px     | 16px |
| 640px+     | 18px |

### Line Height

```css
line-height: 1.625; /* leading-relaxed */
```

- **1.625** = 162.5% of font size
- More "relaxed" spacing for readability
- Good for paragraph text

### Color

```css
color: rgba(255, 255, 255, 0.75); /* text-white/75 */
```

- **75% opacity white** (#ffffffbf)
- Slightly muted compared to headline
- Reduces visual weight while remaining readable

### Max Width

```css
max-width: 42rem; /* max-w-2xl = 672px */
```

- Prevents line from being too long to read comfortably
- Optimal line length for readability: 45-75 characters

### Margin

```css
margin-top: 24px; /* mt-6 */
```

- Same as H1 (maintains vertical rhythm)

## 9.3 Content Analysis

```
Senior-led crews for AV, staging, lighting, seating, and show‑day control.
One accountable team, one timeline, no surprises.
```

### Message Breakdown

| Phrase                         | Meaning                                |
| ------------------------------ | -------------------------------------- |
| Senior-led crews               | Experienced professionals, not juniors |
| AV, staging, lighting, seating | Specific services listed               |
| Show‑day control               | On-site management                     |
| One accountable team           | Single point of contact                |
| One timeline                   | Simplified coordination                |
| No surprises                   | Reliability promise                    |

### Communication Strategy

1. **Authority**: "Senior-led" establishes expertise
2. **Specificity**: Lists exact services
3. **Simplicity**: "One team, one timeline"
4. **Reassurance**: "No surprises" addresses client fears

---

# 10. CTA BUTTONS

## 10.1 Container

```jsx
<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
```

### Layout Properties

| Breakpoint       | Layout                          |
| ---------------- | ------------------------------- |
| <640px (default) | `flex-col` (stacked vertically) |
| 640px+ (sm:)     | `flex-row` (side by side)       |

### Spacing

```css
margin-top: 32px; /* mt-8 */
gap: 12px; /* gap-3 (vertical stack) */
```

- **Mobile**: Gap between stacked buttons = 12px
- **Desktop**: Gap between side-by-side = 12px
- **Alignment (desktop)**: `sm:items-center` (vertically aligned)

## 10.2 Primary Button (Main CTA)

```jsx
<ScribbleButton
  onClick={() => scrollToSection('get-started')}
  ariaLabel="Request a proposal"
  analyticsLabel="hero-request-proposal"
  className="group inline-flex items-center justify-center gap-3 
             rounded-full bg-white px-7 py-3.5 text-sm font-semibold 
             text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)] 
             transition hover:bg-white/90 
             hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)]
             focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-white"
>
  Request a proposal
  <FaArrowRight
    className="transition-transform group-hover:translate-x-0.5"
    size={14}
  />
</ScribbleButton>
```

### Button Properties

| Property           | Value                |
| ------------------ | -------------------- |
| Background         | bg-white (#ffffff)   |
| Text color         | text-black (#000000) |
| Border radius      | rounded-full (pill)  |
| Padding horizontal | px-7 (28px)          |
| Padding vertical   | py-3.5 (14px)        |
| Font size          | text-sm (14px)       |
| Font weight        | font-semibold (600)  |
| Gap (icon)         | gap-3 (12px)         |

### Shadow

```css
/* Default */
box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28);

/* Hover */
box-shadow: 0 18px 54px rgba(0, 0, 0, 0.34);
```

| State   | Shadow                         | Effect         |
| ------- | ------------------------------ | -------------- |
| Default | 16px y, 44px blur, 28% opacity | Subtle lift    |
| Hover   | 18px y, 54px blur, 34% opacity | More prominent |

### Hover State

```css
/* Background */
hover:bg-white/90     /* 90% opacity white */

/* Shadow */
hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)]
```

### Focus State

```css
focus-visible:outline
focus-visible:outline-2      /* 2px white outline */
focus-visible:outline-offset-2 /* 2px gap from button */
```

### Arrow Icon

```jsx
<FaArrowRight
  className="transition-transform group-hover:translate-x-0.5"
  size={14}
/>
```

| Property     | Value                       |
| ------------ | --------------------------- |
| Icon         | FaArrowRight                |
| Size         | 14px                        |
| Transition   | transform on hover          |
| Hover effect | translate-x-0.5 (2px right) |

## 10.3 Secondary Button (Ghost)

```jsx
<ScribbleButton
  onClick={() => scrollToSection('services')}
  ariaLabel="Explore services"
  analyticsLabel="hero-explore-services"
  className="inline-flex items-center justify-center gap-3 
             rounded-full border border-white/[0.18] 
             bg-white/[0.08] px-7 py-3.5 text-sm font-semibold 
             text-white/90 backdrop-blur transition 
             hover:bg-white/[0.14]
             focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-white"
>
  Explore services
</ScribbleButton>
```

### Differences from Primary

| Property      | Primary          | Secondary        |
| ------------- | ---------------- | ---------------- |
| Background    | bg-white (solid) | bg-white/8%      |
| Border        | none             | border-white/18% |
| Text color    | text-black       | text-white/90    |
| Shadow        | Yes (prominent)  | No               |
| Backdrop blur | No               | Yes              |

### Secondary Properties

```css
/* Border */
border: 1px solid rgba(255, 255, 255, 0.18);

/* Background */
background: rgba(255, 255, 255, 0.08);

/* Text */
color: rgba(255, 255, 255, 0.9);

/* Hover */
hover:bg-white/14   /* 14% opacity */

/* Backdrop */
backdrop-filter: blur(...);  /* Glass effect */
```

## 10.4 Button Placement Visualization

### Mobile (<640px)

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │   REQUEST A PROPOSAL     →  │   │ ← Primary (white)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      EXPLORE SERVICES       │   │ ← Secondary (ghost)
│  └─────────────────────────────┘   │
│                                     │
│  Gap: 12px (gap-3)                  │
└─────────────────────────────────────┘
```

### Desktop (640px+)

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ REQUEST A PROPOSAL →  │  │ EXPLORE SERVICES │  │
│  └──────────────────────┘  └──────────────────┘  │
│                                                     │
│  Side by side, vertically centered                │
└─────────────────────────────────────────────────────┘
```

---

# 11. TRUST INDICATORS

## 11.1 Structure

```jsx
<div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-white/70">
  <p className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
    UAE‑wide coverage
  </p>
  <p className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
    Show‑day command
  </p>
  <p className="flex items-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
    White‑glove rentals
  </p>
</div>
```

## 11.2 Layout Properties

```css
margin-top: 32px; /* mt-8 */
display: flex;
flex-wrap: wrap; /* Allows wrapping on mobile */

/* Gap between items */
gap-x: 40px; /* gap-x-10 (horizontal) */
gap-y: 12px; /* gap-y-3 (vertical when wrapped) */
```

| Property       | Value                             |
| -------------- | --------------------------------- |
| Flex wrap      | wrap (new lines on small screens) |
| Horizontal gap | 40px                              |
| Vertical gap   | 12px                              |

## 11.3 Individual Item

### Container

```css
display: flex;
align-items: center;
gap: 8px; /* gap-2 */
```

### Bullet Dot

```jsx
<span className="h-1.5 w-1.5 rounded-full bg-white/50" />
```

| Property | Value                |
| -------- | -------------------- |
| Width    | 1.5 × 1.5px (6px)    |
| Shape    | Circle               |
| Color    | white at 50% opacity |

### Text

```css
font-size: 14px; /* text-sm */
color: rgba(255, 255, 255, 0.7); /* text-white/70 */
```

| Property | Value     |
| -------- | --------- |
| Size     | 14px      |
| Color    | 70% white |

## 11.4 Three Trust Points

| Point               | Meaning                      |
| ------------------- | ---------------------------- |
| UAE‑wide coverage   | Service anywhere in UAE      |
| Show‑day command    | On-site management expertise |
| White‑glove rentals | Premium, careful handling    |

## 11.5 Visual

```
┌────────────────────────────────────────────────────────────┐
│  ○ UAE‑wide coverage    ○ Show‑day command    ○ White‑glove rentals │
│    (white dot)           (white dot)           (white dot)           │
└────────────────────────────────────────────────────────────┘
```

---

# 12. SCROLL INDICATOR

## 12.1 Structure

```jsx
<motion.button
  type="button"
  aria-label="Scroll to services"
  animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
  transition={
    shouldReduceMotion
      ? undefined
      : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
  }
  className="absolute bottom-10 left-1/2 z-10 
             -translate-x-1/2 rounded-full 
             border border-white/[0.16] bg-white/[0.06] p-3 
             text-white/90 backdrop-blur transition 
             hover:bg-white/[0.10]
             focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 focus-visible:outline-white"
  onClick={() => scrollToSection('services')}
>
  <FaArrowDown size={18} />
</motion.button>
```

## 12.2 Position

```css
position: absolute;
bottom: 40px; /* bottom-10 */
left: 50%; /* left-1/2 */
transform: translateX(-50%); /* Center horizontally */
z-index: 10; /* Above content */
```

| Property   | Value                      |
| ---------- | -------------------------- |
| Position   | Absolute                   |
| Bottom     | 40px from section bottom   |
| Horizontal | Centered (50% + translate) |
| Z-index    | 10 (above content)         |

## 12.3 Button Properties

### Size

```css
padding: 12px; /* p-3 */
```

- Total size: ~44×44px (including icon)
- Meets 44px minimum touch target

### Background

```css
background: rgba(255, 255, 255, 0.06); /* bg-white/6% */
```

- Very subtle, almost transparent

### Border

```css
border: 1px solid rgba(255, 255, 255, 0.16);
```

- 16% white, barely visible

### Hover

```css
hover: bg-white/10; /* Slightly more opaque on hover */
```

## 12.4 Icon

```jsx
<FaArrowDown size={18} />
```

| Property | Value       |
| -------- | ----------- |
| Icon     | FaArrowDown |
| Size     | 18px        |

## 12.5 Animation

```javascript
{
  animate: { y: [0, 10, 0] },
  transition: {
    duration: 2.2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
}
```

### Animation Breakdown

| Property | Value                      |
| -------- | -------------------------- |
| Movement | 0 → 10px down → 0          |
| Duration | 2.2 seconds per cycle      |
| Repeat   | Infinite (forever)         |
| Easing   | easeInOut (slow start/end) |

### Visual

```
    ┌───┐
    │ ↓ │ ← Move down 10px
    └───┘
     ↕
     ↕
     ↕
    ┌───┐
    │ ↓ │ ← Return to start
    └───┘
     ↕ (2.2s cycle)
```

## 12.6 Reduced Motion

```javascript
animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
```

- If user prefers reduced motion: no animation
- Respects accessibility preferences

---

# 13. SCRIBBLE BUTTON COMPONENT

**Location**: `src/components/ScribbleButton.jsx` + `ScribbleButton.css`

## 13.1 What Makes It Special

The ScribbleButton is NOT a standard button. It has a **hand-drawn "scribble" effect** that animates on hover.

## 13.2 Component Architecture

### Structure Layers

```
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │  SVG SCRIBBLE PATH              │   │ ← z-index: 1 (behind text)
│  │  (absolute positioned)          │   │
│  │  Animates on hover              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  TEXT + ICON                    │   │ ← z-index: 2 (on top)
│  │  (visible always)               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 13.3 SVG Scribble Effect (CSS)

```css
.scribble-svg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 180%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.scribble-svg path {
  stroke: currentColor; /* Inherits text color */
  stroke-width: 280; /* VERY thick stroke */
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  opacity: 0.3; /* 30% opacity */
  stroke-dasharray: 12500; /* Long dash */
  stroke-dashoffset: 12500; /* Initially hidden */
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 13.4 How the Animation Works

### Step 1: Initial State

```css
stroke-dasharray: 12500; /* Dash is 12,500px long */
stroke-dashoffset: 12500; /* Offset by 12,500px = fully hidden */
```

**Visual**: No visible scribble

### Step 2: Hover State

```css
.scribble-button:hover .scribble-svg path {
  stroke-dashoffset: 0; /* Offset = 0 = fully visible */
}
```

### Step 3: Animation

```css
transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
```

- Dash offset animates from 12,500 → 0 over 800ms
- Creates "drawing" effect

### Step 4: Shake on Hover

```css
.scribble-button:hover .scribble-svg path {
  animation: scribble-shake 0.3s infinite linear;
}

@keyframes scribble-shake {
  0% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(1px, -0.5px);
  }
  66% {
    transform: translate(-0.5px, 1px);
  }
  100% {
    transform: translate(0, 0);
  }
}
```

- Very subtle jitter (1px max movement)
- Creates "alive" feeling

## 13.5 Click Feedback

```css
.scribble-button:active {
  transform: scale(0.98);
}
```

- Button shrinks 2% when clicked
- Provides tactile feedback

## 13.6 Component Props

```javascript
const ScribbleButton = ({
  children,          // Button text
  onClick,          // Click handler
  className = '',   // Additional classes
  type = 'button',  // Button type
  ariaLabel,        // Accessible label
  to,               // React Router path
  href,             // External link
  target,           // Link target
  rel,              // Link rel
  showArrow,       // Show arrow icon
  arrowSize = 14,   // Arrow icon size
  analyticsLabel,  // Analytics tracking
  ...rest           // Other props
})
```

### Dynamic Component Selection

```javascript
const Component = isLink ? Link : isAnchor ? 'a' : 'button'
```

- If `to` prop: Render React Router `<Link>`
- If `href` prop: Render HTML `<a>`
- Otherwise: Render `<button>`

---

# 14. ANIMATIONS & MOTION

## 14.1 Content Fade-In Animation

### Motion Div

```jsx
<motion.div
  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={transition}
  className="w-full max-w-3xl"
>
```

### Initial State

```javascript
{
  opacity: 0,    // Invisible
  y: 18         // 18px down from final position
}
```

### Final State

```javascript
{
  opacity: 1,   // Fully visible
  y: 0          // Natural position
}
```

### Transition

```javascript
const transition = shouldReduceMotion
  ? { duration: 0 } // Instant if reduced motion
  : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
```

### Easing Curve: [0.22, 1, 0.36, 1]

```
Cubic-bezier(0.22, 1, 0.36, 1)

Control Point 1: (0.22, 1)    - Starts very fast
Control Point 2: (0.36, 1)    - Ends very fast (no deceleration)
```

**Visual Feel**:

- Fast start, slow end
- Premium, confident feel
- Not bouncy

## 14.2 All Animation Timings

| Animation              | Duration | Easing             | Trigger     |
| ---------------------- | -------- | ------------------ | ----------- |
| Content fade-in        | 750ms    | [0.22, 1, 0.36, 1] | Page load   |
| Image/Video transition | 700ms    | CSS default        | Video ready |
| Button hover           | 200ms    | CSS default        | Mouse enter |
| Scroll bounce          | 2200ms   | easeInOut          | Continuous  |
| Scribble draw          | 800ms    | cubic-bezier       | Hover       |

## 14.3 Reduced Motion Support

### React Hook

```javascript
const shouldReduceMotion = useReducedMotion()
```

- Returns `true` if user has `prefers-reduced-motion` enabled
- Disables all animations when true

### Applied Throughout

```javascript
// Hero content
initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
transition={shouldReduceMotion ? { duration: 0 } : { ... }}

// Video
autoPlay={!shouldReduceMotion}
loop={!shouldReduceMotion}

// Scroll indicator
animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
```

### CSS Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 15. STATE MANAGEMENT

## 15.1 All State Variables

```javascript
const [videoReady, setVideoReady] = useState(false)
const shouldReduceMotion = useReducedMotion() // Hook, not state
```

### videoReady State

| State           | Value   | Effect                 |
| --------------- | ------- | ---------------------- |
| false (initial) | Loading | Show image, hide video |
| true            | Ready   | Hide image, show video |

### shouldReduceMotion

| State | Value                  | Effect             |
| ----- | ---------------------- | ------------------ |
| true  | Prefers reduced motion | Disable animations |
| false | Normal                 | Enable animations  |

## 15.2 Scroll Function

```javascript
const scrollToSection = sectionId => {
  const element = document.getElementById(sectionId)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}
```

### Behavior

1. Find element by ID
2. If found, scroll smoothly to it
3. Used for "Request a proposal" → `#get-started`
4. Used for "Explore services" → `#services`

---

# 16. ACCESSIBILITY (A11y)

## 16.1 Semantic HTML

```jsx
<section id="hero">
  <h1>...</h1>
  <p>...</p>
  <button>...</button>
</section>
```

- Proper `<section>` landmark
- `<h1>` for main headline
- `<p>` for paragraphs
- `<button>` for interactive elements

## 16.2 ARIA Attributes

### Section

```jsx
<section id="hero" ...>
```

- `id="hero"` for navigation targeting

### Buttons

```jsx
<button aria-label="Request a proposal">...</button>
<button aria-label="Explore services">...</button>
<button aria-label="Scroll to services">...</button>
```

- All buttons have descriptive labels

### Decorative Elements

```jsx
<div aria-hidden="true">...</div>
<video aria-hidden="true">...</video>
```

- Overlays hidden from screen readers
- Video is decorative (content described elsewhere)

## 16.3 Focus Management

### Focus Visible

```css
:focus-visible {
  outline: 2px solid white;
  outline-offset: 2px;
}
```

- White outline for visibility on dark background
- 2px offset from element

## 16.4 Keyboard Navigation

| Key         | Action              |
| ----------- | ------------------- |
| Tab         | Navigate to buttons |
| Enter/Space | Activate button     |
| Escape      | (Not used in hero)  |

## 16.5 Color Contrast

### Text Contrast

| Element     | Color    | Background  | Contrast   |
| ----------- | -------- | ----------- | ---------- |
| Headline    | white    | black/80-90 | 20:1 (AAA) |
| Subheadline | white/75 | black/55-80 | 10:1 (AAA) |
| Button text | black    | white       | 19:1 (AAA) |
| Button text | white/90 | white/8     | 11:1 (AAA) |

All meet WCAG AAA (7:1 minimum).

## 16.6 Screen Reader Considerations

- Alt text on fallback image: "Event production in the UAE"
- Buttons have aria-labels
- Headings follow hierarchy (h1)
- No text-only information (all icons have text alternatives)

---

# 17. MOBILE RESPONSIVENESS ANALYSIS

## 17.1 Layout by Breakpoint

### Below 640px (Mobile)

```css
/* Container */
padding: 80px 16px 40px;

/* Buttons */
flex-direction: column;  /* Stack vertically */
gap: 12px;

/* Trust indicators */
flex-wrap: wrap;
gap-x: 40px;
gap-y: 12px;

/* Font sizes */
h1: clamp(2.6rem, 5vw, 4.5rem)  // 41-66px
p: 16px
buttons: 14px
trust: 14px
```

### 640px - 1023px (Tablet)

```css
/* Container */
padding: 96px 24px 56px;

/* Buttons */
flex-direction: row;      /* Side by side */
align-items: center;

/* Font sizes */
h1: clamp(2.6rem, 5vw, 4.5rem)  // 38-66px
p: 18px
```

### 1024px+ (Desktop)

```css
/* Container */
padding: 96px 32px 56px;
max-width: 1280px;

/* Font sizes */
h1: clamp(2.6rem, 5vw, 4.5rem); // 50-72px
```

## 17.2 Viewport Units

```css
height: 100svh; /* 100% smallest viewport height */
```

### Why svh Instead of vh?

| Unit | Description                    | Issue                             |
| ---- | ------------------------------ | --------------------------------- |
| vh   | 1% of viewport height          | Changes as browser UI shows/hides |
| svh  | 1% of smallest viewport height | More consistent                   |
| dvh  | 1% of dynamic viewport height  | May cause jumps                   |

**Browser Support**: 90%+ (safe to use)

## 17.3 Touch Targets

### Button Sizes

| Button           | Height               | Width  | Meets 44px? |
| ---------------- | -------------------- | ------ | ----------- |
| Primary CTA      | 44px (py-3.5 + font) | ~180px | ✓ Yes       |
| Secondary CTA    | 44px (py-3.5 + font) | ~160px | ✓ Yes       |
| Scroll indicator | 44px (p-3)           | 44px   | ✓ Yes       |

### Recommendation

All buttons meet the 44×44px minimum for touch targets.

## 17.4 Potential Mobile Issues

### Issue 1: Very Large Headline on Small Screens

```css
h1: clamp(2.6rem, 5vw, 4.5rem);
```

At 320px viewport:

- 5vw = 16px
- clamp(41.6px, 16px, 72px) = 41.6px

**Result**: Headline may be too large on very small screens (iPhone SE)

**Recommendation**: Consider adjusting clamp:

```css
text-[clamp(2rem,5vw,4.5rem)]  /* Lower minimum */
```

### Issue 2: Long Trust Indicator Text

```
"UAE‑wide coverage" (17 chars)
"Show‑day command" (15 chars)
"White‑glove rentals" (18 chars)
```

- On small screens, may wrap awkwardly
- `flex-wrap: wrap` handles this gracefully

### Issue 3: Video Loading on Slow Connections

```css
preload="none"
```

- Video doesn't preload
- May show static image for a while on slow 3G
- Poster image helps, but may feel slow

---

# 18. ISSUES & RECOMMENDATIONS

## 18.1 HIGH: Headline Size on Small Screens

### Issue

```css
text-[clamp(2.6rem,5vw,4.5rem)]
```

At 320px: 2.6rem = 41.6px (too large for small screen)

### Recommendation

```css
/* Option 1: Reduce minimum */
text-[clamp(2rem,5vw,4.5rem)]

/* Option 2: Use viewport-based minimum */
text-[clamp(1.75rem,6vw,4.5rem)]
```

## 18.2 MEDIUM: Video Preload Strategy

### Issue

```css
preload="none"
```

- No preload means slow start on slow connections
- Users on 3G may not see video at all

### Recommendation

```jsx
// Option 1: Preload metadata only
preload = 'metadata'

// Option 2: Lazy load with intersection observer
// Only load video when near viewport
```

## 18.3 LOW: Aspect Ratio Container

### Issue

```jsx
<div style={{ aspectRatio: '16/9' }}>
```

- Forces 16:9 aspect ratio
- May crop on extreme aspect ratios (very tall phones)

### Recommendation

Consider removing aspectRatio and letting content determine height, or use different ratios per breakpoint.

## 18.4 LOW: Hardcoded Colors in Gradient

### Issue

```jsx
'radial-gradient(700px 520px at 0% 70%, rgba(255,255,255,0.08), transparent 58%)'
```

- Uses raw rgba instead of CSS variable
- Inconsistent with design tokens

### Recommendation

```jsx
// Add to CSS variables
--color-spotlight-glow: rgba(255, 255, 255, 0.08);

// Use variable
radial-gradient(..., var(--color-spotlight-glow), ...)
```

---

# 19. BROWSER-SPECIFIC NOTES

## 19.1 iOS Safari

### playsInline

```jsx
<video playsInline ...>
```

Required for video to play in-place rather than forcing fullscreen.

### SVH Support

```css
height: 100svh;
```

- Works in iOS Safari 15+
- Falls back to 100vh on older versions

### Safe Areas

Not currently handled. For notched devices, consider:

```css
padding-top: calc(80px + env(safe-area-inset-top));
```

## 19.2 Mobile Chrome

### Video Autoplay

```jsx
autoPlay={!shouldReduceMotion}
muted={true}
```

- Chrome requires both muted AND autoplay for autoplay to work
- This implementation is correct

### SVH Support

- Works in Chrome 76+
- Fallback: vh (may cause layout shifts)

## 19.3 Firefox

### Backdrop Filter

```css
backdrop-filter: blur(...);
```

- Supported in Firefox 103+
- Older versions: backdrop won't blur

---

# 20. PERFORMANCE CONSIDERATIONS

## 20.1 Video Optimization

### Current Implementation

```jsx
preload = 'none'
poster = 'event1.jpg'
```

- Video only loads when needed
- Poster shows immediately
- Good for initial page load

### Recommendations

| Aspect      | Current | Better                            |
| ----------- | ------- | --------------------------------- |
| Format      | MP4     | WebM + MP4 (fallback)             |
| Compression | Unknown | H.264/H.265 with high compression |
| File size   | Unknown | <2MB recommended                  |
| Poster      | JPEG    | WebP                              |

## 20.2 Image Optimization

### Current Implementation

```jsx
<img src="event1.jpg" loading="eager" decoding="async" />
```

- loading="eager": Correct for above-fold
- decoding="async": Good for non-blocking decode

### Recommendations

- Use WebP format
- Compress to <100KB
- Consider responsive images (srcset)

## 20.3 Font Loading

### Current Implementation

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces...');
```

- Uses @import (not optimal)
- font-display not specified in import

### Recommendation

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces..."
  rel="stylesheet"
/>
```

Or use `font-display: swap` in CSS.

## 20.4 Animation Performance

### Current

- Uses Framer Motion (React-based)
- GPU-accelerated transforms

### Potential Issues

- May cause jank on low-end devices
- Reduced motion check helps

### Recommendation

Test on low-end Android devices (e.g., Moto G) to ensure smooth 60fps.

---

# APPENDIX A: COMPLETE PROPS & STATE REFERENCE

## A.1 Component Props

```javascript
// Hero component - no props passed from parent
const Hero = () => { ... }
```

## A.2 Internal State

```javascript
const [videoReady, setVideoReady] = useState(false)
```

## A.3 Hooks Used

```javascript
const shouldReduceMotion = useReducedMotion()
```

---

# APPENDIX B: COLOR REFERENCE

## B.1 Colors Used in Hero

| Element        | Color   | Hex                    | Opacity |
| -------------- | ------- | ---------------------- | ------- |
| Section bg     | Black   | #000000                | 100%    |
| Gradient top   | Black   | -                      | 80%     |
| Gradient mid   | Black   | -                      | 55%     |
| Gradient bot   | Black   | -                      | 90%     |
| Spotlight 1    | Accent  | rgba(26,26,26,0.22)    | 22%     |
| Spotlight 2    | White   | rgba(255,255,255,0.08) | 8%      |
| Headline       | White   | #ffffff                | 100%    |
| Subheadline    | White   | #ffffff                | 75%     |
| Eyebrow text   | White   | #ffffff                | 90%     |
| Eyebrow dot    | Emerald | #34d399                | 100%    |
| Button primary | White   | #ffffff                | 100%    |
| Button text    | Black   | #000000                | 100%    |
| Button 2 text  | White   | #ffffff                | 90%     |
| Trust text     | White   | #ffffff                | 70%     |
| Trust dot      | White   | #ffffff                | 50%     |
| Scroll icon    | White   | #ffffff                | 90%     |

---

# APPENDIX C: TYPOGRAPHY REFERENCE

## C.1 Font Families

| Usage    | Font     | Category   |
| -------- | -------- | ---------- |
| Headline | Fraunces | Serif      |
| Body/UI  | Manrope  | Sans-serif |

## C.2 Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
| ------- | -------------- | ------------- | ------ | ----------- |
| Eyebrow | 12px           | 12px          | 600    | 1.4         |
| H1      | 72px           | 42px          | 600    | 1.02        |
| Subhead | 18px           | 16px          | 400    | 1.625       |
| Buttons | 14px           | 14px          | 600    | 1.4         |
| Trust   | 14px           | 14px          | 400    | 1.4         |

---

# APPENDIX D: ANIMATION REFERENCE

## D.1 Easing Curves

| Animation       | Ease               | Description          |
| --------------- | ------------------ | -------------------- |
| Content fade-in | [0.22, 1, 0.36, 1] | Fast start, slow end |
| Scroll bounce   | easeInOut          | Standard sine curve  |
| Button hover    | default            | Standard CSS ease    |
| Scribble draw   | [0.4, 0, 0.2, 1]   | Draw-on effect       |

## D.2 Durations

| Animation             | Duration |
| --------------------- | -------- |
| Content fade-in       | 750ms    |
| Image/Video crossfade | 700ms    |
| Button hover          | 200ms    |
| Scroll bounce cycle   | 2200ms   |
| Scribble draw         | 800ms    |

---

# APPENDIX E: ACCESSIBILITY CHECKLIST

- [x] Semantic HTML (section, h1, p, button)
- [x] Alt text on fallback image
- [x] ARIA labels on icon-only buttons
- [x] Focus visible styles (white outline)
- [x] Reduced motion support
- [x] Sufficient color contrast (AAA)
- [x] Touch targets >= 44px
- [x] Keyboard navigable
- [x] Screen reader friendly

---

# DOCUMENT END

This document provides complete technical reference for the Ghaim UAE Hero section. For questions or clarifications, refer to the source code at `src/components/Hero.jsx`.
