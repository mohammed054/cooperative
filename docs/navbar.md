GHAIM Landing Page – Premium Navbar Section
1. Purpose
Provides top-level navigation without feeling cluttered.
Immediately communicates authority, polish, and trust.
Acts as a micro-interactive hub: hover triggers subtle animations, previews, search, and mini-project cards.
Works seamlessly across desktop, tablet, and mobile.
2. Structure / Layout

Desktop Layout:

Area	Content / Behavior	Notes
Left	Logo (portrait-square)	High z-index, remains anchored. Scales slightly on hover. Optional subtle shadow for layering.
Center	Primary nav links	Horizontal list: About / Services / Case Studies / Contact. Hover effect changes font color, subtle underline animation.
Right	Utility / Interactive Items	Search icon, hamburger (for mobile), optional user/action button.

Mega Menu / Hover Dropdown (for example: Case Studies):

On hover: link expands smoothly; plus icon rotates to “X”.
Dropdown can contain:
Search bar at the top (placeholder: “Search Projects…”)
3–4 preview cards with image thumbnail, project title, and hover lift animation
Scrollable if >4 projects
Dropdown background slightly elevated (#FFFFFF with shadow) to separate from main content

Mobile Layout:

Hamburger menu triggers full-screen overlay nav
Logo remains on top
Dropdowns slide in/out with smooth motion
Tap-friendly buttons, spacing increased for touch (60–70px targets)
3. Visual Style
Typography: DM Sans / Inter; medium weight for links, bold for logo.
Colors:
Default link: #1A1A1A (Obsidian)
Hover / active: #C5A059 (Champagne Gold)
Dropdown BG: #F9F9F9 (Off-White)
Shadow: var(--shadow-medium) for dropdowns and hover overlays
Hover / Micro-Interactions:
Link text: opacity 0.85 → 1, underline slide-in from left (Framer Motion)
Plus → X rotation: 0 → 45° with easing 0.3s
Dropdown cards: lift 4–6px, shadow deepens slightly on hover
4. Scroll & Interaction Principles
Navbar is transparent over hero video; solid background appears after scroll (smooth opacity fade).
Sticky behavior:
Always visible after initial scroll
Optional shrinking height or reduced padding on scroll
Dropdowns react to mouse position: cards can slightly scale/fade based on hover position for premium micro-feel
Search bar: as you type, instant project previews appear with micro-staggered animation (GSAP / Framer Motion)
5. Layering & Depth
Element	Z-Index	Motion / Notes
Navbar BG	10	Fade in on scroll, slight shadow
Logo	20	Slight scale / shadow on hover
Nav Links	20	Smooth color/underline animations
Dropdown / Mega Menu	25	Layered above all, subtle shadow, motion staggered
Dropdown Cards	30	Slight lift on hover, subtle opacity transition
6. Mobile Responsiveness
Hamburger menu triggers full-screen overlay with smooth slide down
Dropdown cards become stacked vertically
Search bar remains at top; can expand full width
Logo resizes proportionally (portrait shape preserved)
Spacing scaled appropriately for tap interaction
7. Micro-Interaction Guidelines
Plus → X rotation (hover on parent menu)
Card hover: scale 1 → 1.05, shadow deepens, opacity lifts
Dropdown entrance: staggered fade + slide (0.1–0.15s per item)
Search field: subtle focus glow (#C5A059), placeholder fades out smoothly
Sticky transition: navbar background fades from transparent → solid over 0.5s
8. Final Thoughts
Logo is portrait-square: anchor left, slightly larger than typical for authority.
Hover-triggered dropdowns with live previews communicate premium quality.
Micro interactions on everything: hover, click, focus, scroll.
Navbar isn’t just navigation—it’s a micro-experience that signals the quality of the entire site.
Every motion and delay should feel intentional, deliberate, and calm—no flashy or “gimmicky” behavior.

This navbar is the backbone of authority for the page. Every user interaction here — hover, dropdown, scroll transition — screams high-end quality without being loud.