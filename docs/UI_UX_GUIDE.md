# COMPREHENSIVE UI/UX VISUAL DOCUMENTATION - GHAIM UAE

**Purpose**: Complete visual reference explaining every pixel, color, animation, micro-interaction, and design decision. This document tells another AI EXACTLY what things look like and WHY they look that way.

---

# SECTION 1: HERO / LANDING SECTION (First Impression)

## 1.1 Overall Section Structure

**Location**: `src/components/Hero.jsx`
**Dimensions**: 100svh (100% of smallest viewport height - works on mobile browsers)
**Background**: Black (#000000)

The hero section is a FULL-SCREEN immersive experience that takes up the entire viewport. It's the FIRST thing users see when they land on the website.

---

## 1.2 Background Layer (The Video/Image)

### Video Element

```
- Source: /videos/background.mp4
- Format: MP4 (H.264)
- Behavior:
  * autoPlay: true (plays automatically)
  * muted: true (no sound - critical for autoplay)
  * loop: true (repeats forever)
  * playsInline: true (plays in-place on iOS, not fullscreen)
  * preload: "none" (doesn't download until needed - performance)
  * poster: event1.jpg (shows this image while video loads)
```

### Fallback Image

```
- Source: /images/event1.jpg
- Dimensions: 1920x1080 (16:9 aspect ratio)
- Purpose: Shows immediately while video loads, also serves as video poster
- loading: "eager" (high priority - above fold)
- decoding: "async" (doesn't block rendering)
```

### How Video Loading Works

1. Page loads → Image (event1.jpg) shows immediately
2. Video starts loading in background
3. When video data loads (`onLoadedData`), `videoReady` state becomes true
4. Image fades OUT (opacity: 0) over 700ms
5. Video fades IN (opacity: 100) over 700ms

**Transition**: `duration-700` = 700ms CSS transition with opacity

---

## 1.3 Dark Overlay Layer (Making Text Readable)

### Gradient Overlay

```css
/* Applied via bg-gradient-to-b */
from: black/80 (0% to 20% of section) - Very dark, 80% opacity
via: black/55 (20% to 80% of section) - Medium dark, 55% opacity
to: black/90 (80% to 100% of section) - Very dark, 90% opacity
```

**Purpose**: The video/image is busy. The overlay creates a consistent dark "canvas" so white text pops and is readable. The gradient is darker at top and bottom (where headlines are) and slightly lighter in middle.

### Radial Light Effects (The "Spotlight" Look)

```css
/* Two radial gradients layered on top */
1. Large spotlight at top-center:
   - Position: 50% horizontal, 5% from top
   - Size: 900px wide × 520px tall
   - Color: var(--color-video-overlay-accent) (rgba(26,26,26,0.22))
   - Fade: Transparent after 60%

2. Smaller spotlight at bottom-left:
   - Position: 0% horizontal, 70% from top
   - Size: 700px wide × 520px tall
   - Color: rgba(255,255,255,0.08) - subtle white glow
   - Fade: Transparent after 58%
```

**Why**: This creates that premium "corporate event" feel - like stage lighting hitting the scene. Very subtle, adds depth.

---

## 1.4 The "Eyebrow" Badge (Top Label)

```jsx
<div
  className="inline-flex items-center gap-2 rounded-full 
                border border-white/[0.2] bg-white/[0.1] px-4 py-2 
                text-xs font-semibold uppercase tracking-[0.24em] 
                text-white/90 backdrop-blur"
>
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
  UAE event production
</div>
```

### Visual Breakdown:

| Property        | Value                          | Visual Effect                |
| --------------- | ------------------------------ | ---------------------------- |
| Container       | inline-flex                    | Shrinks to fit content       |
| Border          | 1px solid white at 20% opacity | Very subtle white border     |
| Background      | white at 10% opacity           | Faint white tint, glass-like |
| Padding         | 4px horizontal, 2px vertical   | Compact, badge-like          |
| Border-radius   | rounded-full (9999px)          | Perfect circle ends          |
| Font-size       | text-xs (0.75rem / 12px)       | Small, label-like            |
| Font-weight     | font-semibold (600)            | Slightly bold                |
| Text-transform  | uppercase                      | ALL CAPS                     |
| Letter-spacing  | 0.24em (2.4px)                 | Wide spacing between letters |
| Color           | white at 90% opacity           | Almost pure white            |
| Backdrop-filter | blur                           | Frosted glass effect         |
| Gap             | 2px between dot and text       | Tight pairing                |

### The Status Dot

```
- Size: 1.5px × 1.5px (h-1.5 w-1.5)
- Shape: rounded-full (circle)
- Color: bg-emerald-400 (#34d399 - green)
- Purpose: "Live" indicator, subtle status symbol
```

---

## 1.5 Main Headline (H1)

```jsx
<h1
  className="mt-6 text-[clamp(2.6rem,5vw,4.5rem)] font-semibold 
              leading-[1.02] tracking-tight text-white font-serif"
>
  Production that keeps the room composed.
</h1>
```

### Typography Analysis:

| Property       | Value                    | Explanation                              |
| -------------- | ------------------------ | ---------------------------------------- |
| Font-family    | Fraunces (serif)         | Elegant, premium serif font              |
| Font-weight    | 600 (semibold)           | Bold but not heavy                       |
| Color          | text-white               | Pure white for contrast                  |
| Margin-top     | mt-6 (24px)              | Space from eyebrow badge                 |
| Line-height    | 1.02                     | Very tight (headlines look better tight) |
| Letter-spacing | -0.02em (tracking-tight) | Characters slightly closer               |

### Responsive Sizing (CLAMP):

```
text-[clamp(2.6rem, 5vw, 4.5rem)]

- Mobile (375px): 2.6rem (41.6px)
- Tablet (768px): 5vw = ~38px
- Desktop (1440px): 4.5rem (72px)
- Maximum: Never exceeds 4.5rem
- Minimum: Never goes below 2.6rem
```

**Why clamp?**: Creates fluid typography that scales smoothly across all devices without breakpoints.

---

## 1.6 Subheadline Paragraph

```jsx
<p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
  Senior-led crews for AV, staging, lighting, seating, and show‑day control. One
  accountable team, one timeline, no surprises.
</p>
```

### Typography Analysis:

| Property            | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| Margin-top          | mt-6 (24px)                                                   |
| Max-width           | max-w-2xl (672px) - prevents line from being too long to read |
| Font-size (mobile)  | text-base (1rem / 16px)                                       |
| Font-size (tablet+) | sm:text-lg (1.125rem / 18px)                                  |
| Line-height         | leading-relaxed (1.625) - more breathing room                 |
| Color               | white at 75% opacity (#ffffffbf) - slightly muted white       |

**Content Strategy**:

- "Senior-led crews" - emphasizes expertise
- Lists specific services: AV, staging, lighting, seating
- "One accountable team" - removes complexity
- "no surprises" - addresses client fear

---

## 1.7 CTA Buttons (Call to Action)

### Primary Button (Main CTA)

```jsx
<ScribbleButton
  className="
  group 
  inline-flex items-center justify-center gap-3 
  rounded-full 
  bg-white 
  px-7 py-3.5 
  text-sm font-semibold 
  text-black 
  shadow-[0_16px_44px_rgba(0,0,0,0.28)] 
  transition 
  hover:bg-white/90 
  hover:shadow-[0_18px_54px_rgba(0,0,0,0.34)]
  focus-visible:outline focus-visible:outline-2 
  focus-visible:outline-offset-2 focus-visible:outline-white
"
>
  Request a proposal
  <FaArrowRight
    className="transition-transform group-hover:translate-x-0.5"
    size={14}
  />
</ScribbleButton>
```

**Button Visual Breakdown:**
| Property | Value | Visual Effect |
|----------|-------|---------------|
| Background | bg-white (#ffffff) | Pure white - highest contrast |
| Text color | text-black | Pure black |
| Border-radius | rounded-full (pill shape) | Friendly, modern |
| Padding horizontal | px-7 (28px) | Wide - button looks substantial |
| Padding vertical | py-3.5 (14px) | Medium height |
| Font-size | text-sm (14px) | Standard button size |
| Font-weight | font-semibold (600) | Prominent but not aggressive |
| Gap | gap-3 (12px) | Space between text and arrow |
| Shadow | 0 16px 44px rgba(0,0,0,0.28) | Large soft shadow, 16px down, 44px blur |
| Shadow (hover) | 0 18px 54px rgba(0,0,0,0.34) | Shadow grows and gets darker |

**Hover State**:

- Background: white/90 (slightly transparent) - subtle dim
- Shadow: expands from 16px to 18px spread, more opaque
- Arrow icon: translate-x-0.5 (moves right 2px)

**Focus State** (Keyboard navigation):

- 2px white outline
- 2px offset (gap between button and outline)

### Secondary Button (Secondary CTA)

```jsx
<ScribbleButton
  className="
  inline-flex items-center justify-center 
  rounded-full 
  border border-white/[0.18] 
  bg-white/[0.08] 
  px-7 py-3.5 
  text-sm font-semibold 
  text-white/90 
  backdrop-blur 
  transition 
  hover:bg-white/[0.14]
  focus-visible:outline focus-visible:outline-2 
  focus-visible:outline-offset-2 focus-visible:outline-white
"
>
  Explore services
</ScribbleButton>
```

**Visual Contrast with Primary:**
| Property | Primary | Secondary |
|----------|---------|-----------|
| Background | Solid white | White at 8% opacity |
| Border | None | White at 18% opacity |
| Text color | Black | White at 90% opacity |
| Shadow | Yes | No |
| Backdrop-blur | No | Yes (glass effect) |

### Button Layout

```jsx
<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
```

- **Mobile**: `flex-col` (buttons stack vertically), gap-3 (12px between)
- **Desktop**: `sm:flex-row` (side by side), `sm:items-center` (vertically aligned)

---

## 1.8 Trust Indicators (Feature Bullets)

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

**Design Pattern:**

- Dotted bullets (NOT standard bullet points)
- Dots are small: 1.5px × 1.5px
- Dot color: white at 50% opacity
- Text color: white at 70% opacity (less prominent than headline)
- Layout: flex-wrap - wraps to multiple lines on mobile
- Gap: 10px horizontal, 12px vertical between items
- Font-size: 14px (small, supporting text)

---

## 1.9 Scroll Indicator (Bottom Arrow)

```jsx
<motion.button
  animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
  className="
    absolute 
    bottom-10 
    left-1/2 
    -translate-x-1/2 
    rounded-full 
    border border-white/[0.16] 
    bg-white/[0.06] 
    p-3 
    text-white/90 
    backdrop-blur 
    transition 
    hover:bg-white/[0.10]
    focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-white
  "
>
  <FaArrowDown size={18} />
</motion.button>
```

**Animation**:

- Movement: `y: [0, 10, 0]` - moves down 10px, then back up
- Duration: 2.2 seconds per cycle
- Repeat: infinite (forever)
- Easing: easeInOut (slow start, slow end)

**Visual**:

- Position: centered horizontally, 40px from bottom
- Size: padding 3 (12px) = ~44px × 44px touch target
- Icon: ArrowDown (18px)
- Background: white at 6% opacity (very subtle)
- Border: white at 16% opacity (barely visible)
- Backdrop blur: frosted glass effect
- Hover: background increases to 10% opacity

---

## 1.10 Hero Animation (Fade In)

```jsx
<motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
>
```

**Animation Details**:

- Initial state: opacity 0 (invisible), y +18px (slightly down)
- Final state: opacity 1 (visible), y 0 (natural position)
- Duration: 0.75 seconds
- Easing: [0.22, 1, 0.36, 1] - custom cubic-bezier
  - Starts fast, decelerates smoothly
  - Creates "premium" feel

**Reduced Motion**:

- If user prefers reduced motion, animation is disabled
- `shouldReduceMotion` checks `prefers-reduced-motion` media query

---

# SECTION 2: SCRIBBLE BUTTON (The Special Button)

**Location**: `src/components/ScribbleButton.jsx` + `ScribbleButton.css`

## 2.1 What Makes It Special

This is NOT a standard button. It has a HAND-DRAWN "SCRIBBLE" effect that animates on hover.

### Structure:

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │   SVG SCRIBBLE (absolute)   │   │  ← Behind text, invisible initially
│  │   (stroke-dashoffset anim)  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   TEXT + ICON (z-index 2)  │   │  ← On top, visible always
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 2.2 The SVG Scribble Effect

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
  opacity: 0.3; /* 30% opacity - subtle */
  stroke-dasharray: 12500; /* Very long dash */
  stroke-dashoffset: 12500; /* Initially hidden (offset = length) */
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scribble-button:hover .scribble-svg path {
  stroke-dashoffset: 0; /* Animate to visible */
  animation: scribble-shake 0.3s infinite linear;
}
```

**How It Works**:

1. SVG path is a hand-drawn looking squiggle
2. `stroke-dasharray` = 12500 (creates a dashed line where the dash is 12500px long)
3. `stroke-dashoffset` = 12500 (pushes the dash entirely out of view)
4. On hover: `stroke-dashoffset` animates to 0
5. The "dash" (which is actually the entire line) slides into view
6. Simultaneously: `scribble-shake` animation adds a subtle jitter

## 2.3 Shake Animation

```css
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

- Very subtle movement (1px max)
- Creates "alive" feeling
- Only runs while hovering

## 2.4 Button Click Feedback

```css
.scribble-button:active {
  transform: scale(0.98);
}
```

- Button shrinks slightly when clicked
- Provides tactile feedback
- 2% scale reduction (subtle but noticeable)

---

# SECTION 3: TRUSTBAR (Logo Strip)

**Location**: `src/components/TrustBar.jsx`

This section shows company logos/words that have worked with Ghaim - builds social proof.

---

# SECTION 4: SCROLLABLE CARDS SECTION (Services)

**Location**: `src/components/ScrollableCardSection.jsx`

## 4.1 The Concept

This is a creative SCROLL-DRIVEN horizontal scroll section:

- User scrolls DOWN vertically
- Content moves HORIZONTALLY (left)
- Creates an immersive "journey" through services

## 4.2 Mobile View (< 640px)

### Section Height

```javascript
style={{ height: '280vh' }}  // 280% of viewport height
```

The section is nearly 3x the viewport height, giving plenty of scroll distance.

### Sticky Container

```jsx
<div className="sticky top-0 h-screen flex flex-col">
```

- Sticks to top of viewport while user scrolls
- Height = screen height (100vh)
- Content inside is what the user sees

### Header

```jsx
<div className="text-center pt-10 pb-6 px-4">
  <h1 className="text-3xl font-semibold text-ink mb-2 font-serif">
    Services built for high‑stakes rooms
  </h1>
  <p className="text-base text-ink-muted">
    Production, rentals, and on‑site control designed to keep teams aligned.
  </p>
</div>
```

- Mobile: text-3xl (30px)
- Desktop: text-5xl (48px) / text-6xl (60px)
- Color: ink (#1c1c1c) - dark charcoal
- Margin-bottom: mb-2 (8px)
- Secondary text: ink-muted (#5c6470) - gray

### Card Dimensions (Mobile)

```jsx
style={{ width: '72vw', maxWidth: '320px', height: '72vh' }}
```

- Width: 72% of viewport width
- Maximum: 320px
- Height: 72% of viewport height

### Card Flip Animation

Each card is a 3D FLIP CARD:

```jsx
<div className="perspective group overflow-hidden rounded-2xl">
  <div
    className="relative w-full h-full 
                  transition-transform duration-700 
                  transform-style-preserve-3d 
                  group-hover:rotate-y-180"
  >
    {/* FRONT FACE */}
    <div className="absolute inset-0 backface-hidden ...flex flex-col">
      <img src={card.img} className="block h-3/4 w-full object-cover" />
      <div className="flex-1 flex items-center justify-center">
        <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
      </div>
    </div>

    {/* BACK FACE */}
    <div className="absolute inset-0 backface-hidden rotate-y-180 ...flex flex-col">
      {/* Details + CTA */}
    </div>
  </div>
</div>
```

**Flip Mechanics**:

- `perspective: 1200px` - creates 3D depth
- `transform-style: preserve-3d` - children maintain 3D position
- `backface-hidden` - hides back of element when rotated
- `rotate-y-180` - rotates 180 degrees (shows back)
- `duration-700` - 700ms flip animation

---

# SECTION 5: TESTIMONIALS SECTION

**Location**: `src/components/TestimonialsSection.jsx`

## 5.1 Section Background

```jsx
<section className="relative overflow-hidden bg-surface-2 py-24 sm:py-32">
```

- Background: surface-2 (#ffffff - white)
- Padding: py-24 (96px) mobile, py-32 (128px) desktop

### Decorative Radial Gradients

```css
backgroundimage:
  'radial-gradient(900px 500px at 50% -10%, rgba(155, 107, 61, 0.16), transparent 60%)',
  // Orange/brown spotlight at top
  'radial-gradient(700px 500px at 0% 65%, rgba(0, 0, 0, 0.08), transparent 55%)'; // Subtle dark glow at bottom-left
```

- Creates depth and visual interest
- Very subtle (16% and 8% opacity)

## 5.2 Section Header

```jsx
<p className="text-xs font-semibold uppercase tracking-[0.26em] text-ink-subtle">
  Testimonials
</p>

<h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl font-serif">
  {title}
</h2>

<p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
  {intro}
</p>
```

**Eyebrow**:

- text-xs (12px)
- uppercase
- tracking-[0.26em] (2.6px letter-spacing)
- color: ink-subtle (#8892a0)

**H2**:

- text-4xl (36px) mobile → text-5xl (48px) tablet → text-6xl (60px) desktop
- font-serif (Fraunces)
- mt-4 (16px) gap from eyebrow
- tracking-tight (-0.02em)

**Intro text**:

- text-base (16px) → text-lg (18px)
- text-ink-muted (#5c6470)
- mt-5 (20px) gap from H2

## 5.3 Main Testimonial Card

### Container

```jsx
<motion.figure className="overflow-hidden rounded-3xl
                        border border-border
                        bg-surface-2
                        shadow-[0_18px_60px_rgba(22,22,22,0.10)]">
```

- Border-radius: rounded-3xl (24px) - very rounded
- Border: 1px solid rgba(28,28,28,0.12)
- Shadow: 0 18px 60px rgba(22,22,22,0.10) - large soft shadow

### Status Badge

```jsx
<div
  className="inline-flex items-center gap-2 rounded-full 
                border border-border bg-surface-2 px-3 py-1 
                text-xs font-semibold text-ink-muted"
>
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
  Client feedback
</div>
```

- Similar to hero eyebrow but:
  - Emerald-500 instead of emerald-400 (slightly different green)
  - No backdrop-blur
  - Darker text (ink-muted)

### Quote Icon

```jsx
<FaQuoteLeft className="mt-10 text-4xl text-ink-subtle opacity-40" />
```

- Font-size: text-4xl (36px)
- Color: ink-subtle at 40% opacity
- Creates visual anchor for quote

### Quote Text

```jsx
<blockquote className="
  mt-6
  text-[clamp(1.25rem,2.4vw,2.125rem)]
  font-medium
  leading-[1.15]
  tracking-tight
  text-ink
">
```

- Font-size: clamp(1.25rem, 2.4vw, 2.125rem)
  - Mobile: 20px
  - Tablet: 2.4vw (scales)
  - Desktop max: 34px
- Line-height: 1.15 (very tight)
- Font-weight: 500 (medium)
- Color: ink (#1c1c1c)

### Author Section

```jsx
<figcaption className="mt-10 flex items-center gap-4">
  <div
    className="flex h-11 w-11 items-center justify-center 
                  rounded-full bg-ink text-xs font-semibold text-white"
  >
    {getInitials(active?.name)}
  </div>
  <div className="min-w-0">
    <p className="truncate text-sm font-semibold text-ink">{active?.name}</p>
    <p className="truncate text-sm text-ink-muted">
      {active?.role} • {active?.company}
    </p>
  </div>
</figcaption>
```

**Avatar**:

- Size: 44px × 44px (h-11 w-11)
- Background: ink (#1c1c1c)
- Text: white, text-xs, font-semibold
- Contains initials (e.g., "SA" for Sarah Al-Mansouri)
- Shape: rounded-full (circle)

**Name/Role**:

- text-sm (14px)
- font-semibold for name
- text-ink-muted for role
- truncate: ellipsis if too long

### Image Side

```jsx
<motion.img src={active?.image} className="h-64 w-full object-cover lg:h-full" />
<div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
```

- Height: h-64 (256px) mobile, lg:h-full desktop
- Object-fit: cover (fills container)
- Gradient overlay: dark at left, lighter at right

### Tags

```jsx
<span
  className="inline-flex items-center rounded-full 
                bg-white/[0.85] px-3 py-1 
                text-xs font-semibold text-ink-muted backdrop-blur"
>
  {tag}
</span>
```

- Background: white at 85% opacity
- Backdrop-blur: frosted glass
- Border-radius: rounded-full
- Padding: px-3 py-1

## 5.4 Navigation Controls

### Arrow Buttons

```jsx
<button
  className="
  inline-flex h-11 w-11 
  items-center justify-center 
  rounded-full 
  border border-border 
  bg-surface-2 
  text-ink-muted 
  transition 
  hover:border-ink 
  hover:bg-ink 
  hover:text-white
"
>
  <FaChevronLeft size={14} />
</button>
```

- Size: 44px × 44px (h-11 w-11) - touch target
- Border-radius: rounded-full
- Default: border-border, bg-surface-2, text-ink-muted
- Hover: border-ink, bg-ink, text-white (inverts)

### Counter

```jsx
<p className="text-sm font-semibold tabular-nums text-ink-muted">
  {String(activeIndex + 1).padStart(2, '0')} /{' '}
  {String(TESTIMONIALS.length).padStart(2, '0')}
</p>
```

- Shows: "01 / 03"
- tabular-nums: monospaced numbers (don't jitter)

## 5.5 Sidebar "More Feedback"

On desktop, there's a sidebar list of other testimonials:

```jsx
<button
  className="
  group relative w-full overflow-hidden rounded-2xl 
  border border-border bg-surface-2 p-5 text-left 
  transition hover:border-ink hover:shadow-sm
"
>
  {/* Active state background */}
  {isActive && (
    <motion.div
      layoutId="testimonialActive"
      className="absolute inset-0 bg-ink"
    />
  )}

  {/* Content with color change based on active state */}
  <div className="relative flex items-start gap-4">
    {/* Avatar */}
    <div
      className={isActive ? 'bg-white/[0.12] text-white' : 'bg-ink text-white'}
    >
      {/* Initials */}
    </div>
    {/* Text */}
    <p className={isActive ? 'text-white' : 'text-ink'}>
      {/* Name, role, headline */}
    </p>
  </div>
</button>
```

**Active State Animation**:

- Uses `layoutId="testimonialActive"` for smooth background transition
- When active: black background, white text
- When inactive: white background, dark text

---

# SECTION 6: FINAL CTA SECTION

**Location**: `src/components/FinalCta.jsx`

## 6.1 Dark Section Background

```jsx
<section className="min-h-screen flex items-center justify-center
                   bg-ink py-16 lg:py-20">
```

- Background: ink (#1c1c1c) - dark charcoal
- Min-height: 100vh (full screen minimum)
- Content centered both vertically and horizontally

## 6.2 Headline

```jsx
<motion.h1
  className="
  text-3xl sm:text-4xl md:text-5xl lg:text-7xl 
  font-semibold 
  text-white 
  mb-4 lg:mb-8 
  leading-tight 
  font-serif
"
>
  Let’s Build Your Next Event
  <br />
  <span className="text-white/70">On time, on brand, on budget</span>
</motion.h1>
```

- Responsive: 3xl → 4xl → 5xl → 7xl
- Main text: white
- Subtext: white at 70% opacity
- Line-height: leading-tight (1.1)

## 6.3 Subheadline

```jsx
<p className="text-base sm:text-lg md:text-xl lg:text-2xl
              text-white/70
              mb-8 lg:mb-16
              max-w-4xl mx-auto
              leading-relaxed">
```

- Max-width: 4xl (896px) - readable line length
- Centered: mx-auto
- Color: white at 70%
- Responsive font sizes

## 6.4 Form Container

```jsx
<div className="bg-surface-2 rounded-2xl lg:rounded-3xl
                p-5 sm:p-8 lg:p-12
                shadow-2xl
                max-w-3xl mx-auto
                border border-border">
```

- Background: white (surface-2)
- Border-radius: 2xl (16px) mobile, 3xl (24px) desktop
- Padding: 20px → 32px → 48px (scales up)
- Shadow: shadow-2xl (large prominent shadow)
- Max-width: 672px
- Border: 1px subtle border

### Form Title

```jsx
<h2
  className="text-xl lg:text-2xl xl:text-3xl font-semibold 
               text-ink mb-6 lg:mb-8 text-center font-serif"
>
  Request a Proposal
</h2>
```

## 6.5 Form Inputs

```jsx
<input
  type="text"
  className="
         w-full 
         px-4 py-3 
         border border-border 
         rounded-lg 
         bg-surface-3 
         text-ink 
         focus:outline-none 
         focus:ring-2 focus:ring-ink 
         focus:border-transparent 
         transition-all duration-200
       "
/>
```

**Input Styling**:
| State | Style |
|-------|-------|
| Default | border-border, bg-surface-3 |
| Focus | ring-2 ring-ink, border-transparent |
| Padding | px-4 (16px), py-3 (12px) |
| Border-radius | rounded-lg (8px) |

**Placeholder**:

- Same color as ink-muted

---

# SECTION 7: FOOTER

**Location**: `src/components/Footer.jsx`

## 7.1 Section Styling

```jsx
<footer className="bg-surface py-12 lg:py-16 text-ink">
```

- Background: surface (#f6f7f9) - light gray
- Padding: py-12 (48px) mobile, py-16 (64px) desktop

## 7.2 Grid Layout

```jsx
<div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
```

- Mobile: single column (grid default)
- Desktop: 5 columns, first is 1.2fr (wider for logo/about)

## 7.3 Brand Column

```jsx
<div className="flex items-center gap-3">
  <img src="logo.webp" className="h-8 w-auto brightness-0" />
  <span className="text-lg font-semibold tracking-[0.2em]">GHAIM</span>
</div>
<p className="mt-4 text-sm text-ink-muted">
  {/* Description */}
</p>
```

- Logo: h-8 (32px), brightness-0 (makes dark logo visible on light bg)
- Text: tracking-[0.2em] - wide letter spacing
- Description: text-sm, ink-muted

## 7.4 Social Icons

```jsx
<div className="mt-6 flex items-center gap-4">
  <motion.a whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }}>
    <FaFacebook className="text-lg" />
  </motion.a>
  {/* Instagram, LinkedIn */}
</div>
```

- Size: text-lg (18px)
- Hover: scale up 8%
- Tap (mobile): scale down 4%
- Color: ink-muted → ink on hover

---

# SECTION 8: HEADER / NAVIGATION

**Location**: `src/components/GhaimAEHeader.jsx`

## 8.1 Header Base

```jsx
<header className="
  fixed left-0 right-0 top-0 z-50
  border-b
  will-change-transform
  transition-[background-color,box-shadow,backdrop-filter]
  duration-300 ease-out

  // Transparent initially (on home page)
  bg-transparent border-transparent shadow-none backdrop-blur-0

  // Or solid white when scrolled/hovering
  bg-white/95 border-border shadow-lg backdrop-blur
">
```

**States**:

1. **Transparent** (home, not scrolled): bg-transparent, no shadow
2. **Solid** (scrolled or hovering): bg-white/95, shadow-lg, backdrop-blur

## 8.2 Scroll Behavior

- Threshold: 4px scroll = "scrolled"
- Hide on scroll down: hides after 6px delta
- Show on scroll up: reveals when scrolling up
- Uses requestAnimationFrame for performance

## 8.3 Mobile Menu Toggle

```jsx
<button
  className="
  flex h-10 w-10 
  flex-col items-center justify-center gap-1.5 
  rounded-full 
  transition
"
>
  <span className="block h-0.5 w-5 rounded-full bg-white" />
  <span className="block h-0.5 w-5 rounded-full bg-white" />
  <span className="block h-0.5 w-5 rounded-full bg-white" />
</button>
```

**Hamburger Animation** (when open):

- Top line: translate-y-1.5 rotate-45 (becomes X)
- Middle line: opacity-0 (disappears)
- Bottom line: -translate-y-1.5 -rotate-45 (becomes X)

---

# SECTION 9: DESIGN TOKENS (Complete Reference)

## 9.1 Color Palette

### Surface/Background Colors

| Token     | Hex     | Usage                                      |
| --------- | ------- | ------------------------------------------ |
| surface   | #f6f7f9 | Light backgrounds, alternating sections    |
| surface-2 | #ffffff | Cards, elevated surfaces, form backgrounds |
| surface-3 | #eef1f6 | Input backgrounds, hover states            |
| bg-main   | #ffffff | Primary background alias                   |
| bg-muted  | #f6f7f9 | Secondary background alias                 |

### Text Colors

| Token      | Hex     | Usage                                 |
| ---------- | ------- | ------------------------------------- |
| ink        | #1c1c1c | Primary text, headings, dark elements |
| ink-muted  | #5c6470 | Secondary text, descriptions          |
| ink-subtle | #8892a0 | Tertiary text, captions, labels       |

### Accent Colors

| Token         | Hex                 | Usage                             |
| ------------- | ------------------- | --------------------------------- |
| accent        | #1a1a1a             | Primary buttons, active states    |
| accent-strong | #0f0f0f             | Button hover states               |
| accent-soft   | rgba(26,26,26,0.12) | Subtle accents, hover backgrounds |

### Border Color

| Token  | Hex                 | Usage                 |
| ------ | ------------------- | --------------------- |
| border | rgba(28,28,28,0.12) | All borders, dividers |

### Status Colors (used sparingly)

| Token       | Hex     | Usage                         |
| ----------- | ------- | ----------------------------- |
| emerald-400 | #34d399 | Live status indicators        |
| emerald-500 | #10b981 | Active states in testimonials |

---

## 9.2 Typography Tokens

### Font Families

| Token                     | Font     | Usage                  |
| ------------------------- | -------- | ---------------------- |
| font-heading / font-serif | Fraunces | All headings (h1-h6)   |
| font-body / font-sans     | Manrope  | Body text, UI elements |

### Font Weights

| Token         | Value | Usage                  |
| ------------- | ----- | ---------------------- |
| font-regular  | 400   | Body text              |
| font-medium   | 500   | Labels, captions       |
| font-semibold | 600   | Headings, buttons, nav |

### Letter Spacing

| Token           | Value   | Usage                  |
| --------------- | ------- | ---------------------- |
| tracking-tight  | -0.02em | Headings               |
| tracking-normal | 0       | Body text              |
| tracking-widest | 0.24em+ | Labels, uppercase text |

---

## 9.3 Spacing Tokens

### Tailwind Spacing Scale

| Token   | Pixels | Rem    | Usage              |
| ------- | ------ | ------ | ------------------ |
| space-1 | 8px    | 0.5rem | Tight spacing      |
| space-2 | 16px   | 1rem   | Standard spacing   |
| space-3 | 24px   | 1.5rem | Section components |
| space-4 | 32px   | 2rem   | Between sections   |
| space-5 | 48px   | 3rem   | Large gaps         |
| space-6 | 64px   | 4rem   | Section padding    |
| space-7 | 96px   | 6rem   | Hero spacing       |
| space-8 | 128px  | 8rem   | Major sections     |

---

## 9.4 Border Radius

| Token        | Pixels | Usage                  |
| ------------ | ------ | ---------------------- |
| rounded-sm   | 4px    | Small elements, inputs |
| rounded      | 8px    | Standard elements      |
| rounded-lg   | 12px   | Cards, buttons         |
| rounded-xl   | 16px   | Larger cards           |
| rounded-2xl  | 24px   | Feature cards          |
| rounded-3xl  | 32px   | Large containers       |
| rounded-full | 9999px | Pills, circles         |

---

## 9.5 Shadows

| Token                                 | Value                        | Usage          |
| ------------------------------------- | ---------------------------- | -------------- |
| shadow-sm                             | 0 1px 2px rgba(0,0,0,0.05)   | Subtle         |
| shadow                                | 0 1px 3px rgba(0,0,0,0.1)    | Default        |
| shadow-md                             | 0 4px 6px rgba(0,0,0,0.1)    | Elevated       |
| shadow-lg                             | 0 10px 15px rgba(0,0,0,0.1)  | Cards          |
| shadow-xl                             | 0 20px 25px rgba(0,0,0,0.1)  | Modals         |
| shadow-2xl                            | 0 25px 50px rgba(0,0,0,0.25) | Hero elements  |
| shadow-[0_16px_44px_rgba(0,0,0,0.28)] | Custom                       | Primary button |

---

# SECTION 10: ANIMATION REFERENCE

## 10.1 Framer Motion Easing

### Standard Ease (Most animations)

```javascript
ease: [0.22, 1, 0.36, 1]
// Cubic-bezier: fast start, very smooth deceleration
```

### Fast Ease (Quick transitions)

```javascript
ease: [0.16, 1, 0.3, 1]
// Cubic-bezier: snappier
```

### Default CSS Easing

```javascript
ease: 'easeInOut' // Slow start/end
ease: 'easeOut' // Fast start, slow end
ease: 'easeIn' // Slow start, fast end
```

## 10.2 Animation Durations

| Class         | Duration | Usage               |
| ------------- | -------- | ------------------- |
| duration-0    | 0s       | No animation        |
| duration-75   | 75ms     | Very fast           |
| duration-150  | 150ms    | Fast (hover)        |
| duration-200  | 200ms    | Standard hover      |
| duration-300  | 300ms    | Slow hover          |
| duration-500  | 500ms    | Feature transitions |
| duration-700  | 700ms    | Page transitions    |
| duration-1000 | 1s       | Major animations    |

## 10.3 Scroll Animations

### Fade In Up

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide In Left

```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Slide In Right

```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Scale In

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Shimmer (Loading)

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

### Pulse Glow

```css
@keyframes pulseGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
```

---

# SECTION 11: RESPONSIVE BREAKPOINTS

## 11.1 Tailwind Breakpoints

| Breakpoint | Width   | Description                 |
| ---------- | ------- | --------------------------- |
| (none)     | 0-639px | Mobile                      |
| sm         | 640px+  | Large phones, small tablets |
| md         | 768px+  | Tablets, small laptops      |
| lg         | 1024px+ | Laptops, desktops           |
| xl         | 1280px+ | Large desktops              |
| 2xl        | 1536px+ | Extra large                 |

## 11.2 Custom JavaScript Breakpoints

Used in components for JavaScript logic:

```javascript
// Header mobile menu trigger
window.innerWidth >= 1024

// ScrollableCardSection mobile detection
window.innerWidth < 640
```

---

# SECTION 12: ACCESSIBILITY DETAILS

## 12.1 Focus States

### Default Focus (All browsers)

```css
:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
}
```

### Custom Focus (Component-specific)

```jsx
className="focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2 focus-visible:outline-white"
```

- 2px white outline
- 2px offset from element edge

## 12.2 Reduced Motion

### CSS Media Query

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### React Hook

```javascript
const shouldReduceMotion = useReducedMotion()
// Returns true if user prefers reduced motion
// Disable animations when true
```

## 12.3 Screen Reader Only

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

# SECTION 13: COMPONENT VARIANTS REFERENCE

## 13.1 Button Variants

### Primary Button

```
Background: bg-white
Text: text-black
Shadow: 0 16px 44px rgba(0,0,0,0.28)
Hover: bg-white/90, shadow grows
```

### Secondary Button (in Hero)

```
Background: white at 8% opacity
Border: white at 18% opacity
Text: white at 90% opacity
Backdrop-blur: true
Hover: bg white at 14%
```

### Dark Primary Button

```
Background: bg-ink (#1c1c1c)
Text: text-white
Shadow: 0 12px 30px rgba(22,22,22,0.18)
Hover: shadow grows
```

### Outline Button

```
Background: transparent
Border: border-border
Text: text-ink-muted
Hover: border-ink, text-ink
```

### Ghost Button

```
Background: transparent
Text: text-ink-muted
No border
Hover: text-ink
```

## 13.2 Card Variants

### Standard Card

```
Background: surface-2 (white)
Border: 1px border-border
Border-radius: rounded-2xl (24px)
Padding: p-6 (24px)
Shadow: 0 18px 48px rgba(22,22,22,0.08)
```

### Glass Card

```
Background: white at 70% (bg-white/70)
Border: 1px border-border
Border-radius: rounded-2xl (24px)
Padding: p-6 (24px)
Backdrop-blur: blur-sm
```

### Testimonial Card

```
Background: surface-2 (white)
Border-radius: rounded-3xl (32px)
Shadow: 0 18px 60px rgba(22,22,22,0.10)
Padding: 3rem (48px)
```

---

# SECTION 14: ICON REFERENCE

All icons from `react-icons/fa` (Font Awesome):

| Icon           | Usage            | Size            |
| -------------- | ---------------- | --------------- |
| FaArrowRight   | CTA buttons      | 14px            |
| FaArrowDown    | Scroll indicator | 18px            |
| FaChevronLeft  | Testimonial prev | 14px            |
| FaChevronRight | Testimonial next | 14px            |
| FaQuoteLeft    | Quote marks      | 36px (text-4xl) |
| FaSearch       | Search button    | 14px            |
| FaFacebook     | Social           | 18px (text-lg)  |
| FaInstagram    | Social           | 18px            |
| FaLinkedin     | Social           | 18px            |
| FaPhone        | Contact          | 14px            |
| FaEnvelope     | Contact          | 14px            |
| FaMapMarkerAlt | Contact          | 14px            |

---

# SECTION 15: MICRO-INTERACTIONS CHECKLIST

Every interactive element should have:

- [ ] **Hover state**: Visual feedback on mouse over
- [ ] **Focus state**: Clear indicator when keyboard focused
- [ ] **Active/Pressed state**: Feedback when clicked/tapped
- [ ] **Transition**: Smooth animation between states (150-300ms)
- [ ] **Touch target**: Minimum 44×44px on mobile

---

# DOCUMENT VERSION

- **Version**: 1.0
- **Last Updated**: February 2026
- **Author**: Documentation
- **Purpose**: Complete visual reference for AI systems

This document should enable another AI to recreate or modify any visual element knowing EXACTLY what it looks like and how it behaves.
