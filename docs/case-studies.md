GHAIM Landing Page – Gallery / Case Studies Section (Ultimate MD)
1. Purpose
Build instant trust through high-end event imagery.
Let users explore visually instead of reading text.
Maintain authoritative, premium feel: smooth, deliberate, and luxurious.
2. Section Layout & Hierarchy

Full viewport height (100vh) per “scene”

Top Hero Image / Teaser:
Full-width key event image, eye-level focus.
Slight parallax on scroll (image moves slower than page).
Transparent headline + call-to-action overlay, centered vertically.
Masonry / Overlapping Grid (secondary images):
Three to five images per horizontal row at desktop.
Layered stacking: some images overlap 5–10px with subtle shadow (medium/deep).
Vary image sizes: one large “hero” per row, others smaller to create rhythm.
Scroll reveal animation (GSAP / Framer Motion):
Fade + scale up + slight upward movement.
Staggered: 0.15–0.25s per image.
Hover Micro-Interactions:
Scale: 1.02–1.05 on hover
Shadow deepens slightly
Optional tint overlay (low-opacity brand accent)
Smooth transition: 0.3–0.5s
3. Scroll-Driven Behavior (Interaction Arch)
Initial viewport: Top hero image + headline.
User scrolls slightly: secondary images fade in individually, staggered.
Parallax effect:
Images slide up slower than scroll, giving depth.
Some images shift horizontally ±10px for “organic” stacking.
Focus-on-demand:
Hover triggers micro-zoom, text overlay appears.
Clicking opens lightbox with full image, smooth zoom-in & fade.
4. Layering & Stacking Rules
Element	Z-Index / Layer	Shadow	Notes
Hero Image	10	medium	Full-width, under headline
Overlay Text/CTA	20	none	Always on top
Featured Grid Img	15–18	light–medium	Staggered depth; overlapping slightly
Background Gradients	5	subtle	Optional for depth, low opacity
Hover / Focus img	21	deep	Comes on top of everything during hover/lightbox
5. Mobile Responsiveness
Single column scroll (vertical stacking) for small screens.
Images full-width or 90% width with margin auto.
Touch-friendly hover effects:
Tap = scale-up + overlay
Swipe to next image in lightbox
Maintain parallax effect subtly, so scrolling feels premium even on touch devices.
6. Image Guidelines & Composition
Image quality: High-res, no pixelation
Consistent color grading: Cool/neutral tones matching brand palette (#1A1A1A base, #C5A059 accents)
Content curation:
Top row = marquee/highest prestige events
Middle rows = supporting visuals (tables, setups, stage shots)
Optional captions: tiny, italic, semi-transparent on hover
Layering principle: “magazine editorial” — larger images anchor the row, smaller ones float and overlap subtly
7. Micro-Interaction Details
Scroll-triggered animations: staggered fade/scale + parallax
Hover: smooth lift + shadow deepening
Click/Focus: smooth lightbox zoom-in, overlay fade
Timing:
Stagger: 0.15–0.25s
Animation duration: 0.4–0.6s
Ease: cubic-bezier(.25,.1,.25,1) for smoothness
8. Additional Considerations
Whitespace: generous padding/margins to avoid clutter, preserve luxury feel
Accessibility: alt text for every image
Navigation hints: subtle arrows or scroll indicators for mobile
Performance: lazy-load images, only preload hero/above-the-fold

💡 Summary:

Primary impression = gallery
Scroll should feel like exploration, discovery, and exclusivity
Hover, scroll, and click all reinforce authority, premium quality, and attention to detail
Works seamlessly desktop → tablet → mobile