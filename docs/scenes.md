🎬 Ghaim UAE Homepage — Cinematic Scroll Architecture Specification (Production Lock)
0️⃣ Scroll Architecture Contract (Non-Negotiable)
Scroll Authority

Native window scroll only.

GSAP + ScrollTrigger are the only scroll controllers.

❌ No Lenis.

❌ No Framer useScroll.

❌ No IntersectionObserver.

❌ No secondary scroll engines.

❌ No nested scroll containers.

Scroll Root

body is the only scroll root.

No overflow: hidden on html/body/root/main wrappers.

No transformed parent containers (transform, will-change, filter) above sections.

Animation Ownership

Scroll-linked animations → GSAP timelines.

Pinned scenes → One master GSAP timeline per scene.

Free scroll entrances → ScrollTrigger with toggleActions.

Framer Motion allowed only for:

Hover states

Micro UI transitions

Non-scroll interactions

Initialization Order

Register GSAP + ScrollTrigger.

Build all timelines.

Call ScrollTrigger.refresh().

On resize → ScrollTrigger.refresh() (debounced).

No manual RAF loops outside GSAP.

1️⃣ Global Motion Rules
Default Easing

Entrances: "power3.out"

Fades: "power2.out"

Scrubbed timelines: "none"

Cinematic scrub delay: scrub: 1.2

Default Stagger

0.15s per element

Reduced Motion

If prefers-reduced-motion:

Disable pin.

Disable scrub.

Replace horizontal scroll with vertical stacked layout.

Replace long transitions with simple fade + translate.

Maintain layout integrity.

2️⃣ Layout System Rules
Section Structure Pattern

Every section follows:

<section class="relative w-full">
  <div class="scene-container">
    <div class="scene-inner">
      <!-- content -->
    </div>
  </div>
</section>
Pinned Sections

For pinned scenes:

Outer section height = pinDuration (vh)

Inner wrapper height = 100vh

Pin applied to inner wrapper

No transforms on outer container

Example:

220vh pin → outer = 220vh, inner = 100vh

3️⃣ Scene Breakdown
Scene 1 — command-arrival

Type: Hero
Height: 100vh
Tone: Light

Visual

Bright daylight cinematic video

Subtle linen overlay

Text: text-ink

CTA: white ScribbleButton, shadow [0_8px_24px_rgba(0,0,0,0.2)]

Animation (Non-Scroll)

Timeline runs on mount:

eyebrow:
  opacity: 0 → 1
  y: 10px → 0
  duration: 0.6
  delay: 0.2

headline:
  opacity: 0 → 1
  y: 12px → 0
  scale: 0.98 → 1
  duration: 0.8
  delay: 0.4

subcopy:
  opacity: 0 → 1
  y: 8px → 0
  duration: 0.6
  delay: 0.6

cta:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.6
  delay: 0.8

heroVideo:
  scale: 1.02 → 1
  duration: 20s
  ease: linear
Scene 2 — authority-ledger

Type: Free Scroll
Height: 85vh
Tone: Light

Trigger
start: "top 80%"
toggleActions: "play none none reverse"
Animation
metricCard:
  opacity: 0 → 1
  y: 10px → 0
  duration: 0.35
  stagger: 0.15

numbers:
  count: 0 → value
  duration: 0.6

ctaButton:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.5
Scene 3 — signature-reel

Type: Pinned Horizontal
Height: 220vh
Tone: Dark
Pin: Yes
Scrub: 1.2

Structure

Outer container: 220vh

Inner pinned wrapper: 100vh

Panels in flex row

Width = panelCount * 100vw

No transforms on parent container

ScrollTrigger
pin: true
scrub: 1.2
anticipatePin: 1
start: "top top"
end: "+=220%"
Master Timeline Mapping (0 → 1)
0.0–0.7
  xPercent: 0 → -200 (for 3 panels)

0.1–0.3
  panel 1 content reveal

0.4–0.6
  panel 2 content reveal

0.7–0.9
  panel 3 content reveal

0.9–1.0
  slight scale normalize 0.98 → 1
  fade overlay

No nested ScrollTriggers inside.

Scene 4 — capability-matrix

Type: Free Scroll
Height: 100vh
Tone: Light

Trigger
start: "top 75%"
toggleActions: "play none none reverse"
Animation
card:
  opacity: 0 → 1
  y: 10px → 0
  duration: 0.35
  stagger: 0.15

ctaButton:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.5
Scene 5 — operations-spine

Type: Pinned Vertical Timeline
Height: 240vh
Tone: Dark
Pin: Yes
Scrub: 1.2

Structure

Outer container: 240vh

Inner pinned wrapper: 100vh

Vertical spine centered

ScrollTrigger
pin: true
scrub: 1.2
anticipatePin: 1
start: "top top"
end: "+=240%"
Master Timeline Mapping (0 → 1)
0.0–0.15
  spine draw (scaleY 0 → 1)

0.15–0.35
  step 1 reveal

0.35–0.55
  step 2 reveal

0.55–0.75
  step 3 reveal

0.75–0.9
  fade previous steps slightly (opacity 1 → 0.7)

0.9–1.0
  upward micro-shift y: 20px → 0

No nested triggers.

Scene 6 — narrative-bridge

Type: Free Scroll
Height: 75vh
Tone: Light

Trigger
start: "top 80%"
toggleActions: "play none none reverse"
Animation
copy:
  opacity: 0 → 1
  y: 8px → 0
  stagger: 0.15
  duration: 0.5

ctaButton:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.5
Scene 7 — proof-theater

Type: Free Scroll
Height: 120vh
Tone: Light

Trigger
start: "top 75%"
toggleActions: "play none none reverse"
Animation
testimonialCard:
  opacity: 0 → 1
  y: 10px → 0
  stagger: 0.15
  duration: 0.35

arrowNav:
  opacity: 0 → 1
  scale: 1 → 1.02
  duration: 0.3

progressBar:
  width: 0 → 100%
  duration: 0.6
Scene 8 — conversion-chamber

Type: Free Scroll
Height: 120vh
Tone: Light

Trigger
start: "top 80%"
toggleActions: "play none none reverse"
Animation
formField:
  opacity: 0 → 1
  y: 8px → 0
  stagger: 0.1
  duration: 0.35

validationError:
  x: 0 → ±4px
  repeat: 2
  yoyo: true
  duration: 0.3

successState:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.6

ctaButton:
  opacity: 0 → 1
  y: 5px → 0
  duration: 0.5
Scene 9 — global-footer

Type: Free Scroll
Height: 70vh
Tone: Light

Trigger
start: "top 85%"
toggleActions: "play none none reverse"
Animation
column:
  opacity: 0 → 1
  y: 8px → 0
  stagger: 0.2
  duration: 0.35

links underline:
  scaleX: 0 → 1
  duration: 0.25

No further transitions.

4️⃣ Layering Strategy
hero: z-10
horizontal reel: z-20
timeline: z-30
overlays: z-40

Every section root: position: relative
No transforms on section roots.

5️⃣ Cinematic Integrity Rules

No random fade-ins.

No animation without scroll intent.

No scroll-driven effect outside GSAP.

Each pinned section = one master timeline.

No independent ScrollTriggers inside pinned scenes.

Explicit heights for pinned containers.

ScrollTrigger.refresh() after fonts load.