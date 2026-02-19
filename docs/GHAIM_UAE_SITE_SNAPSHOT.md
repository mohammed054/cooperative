# Ghaim UAE Website Snapshot

## Table of Contents
- [Experience Frame (Global)](#experience-frame-global)
- [Section 01 - Initial Loading Screen](#section-01---initial-loading-screen)
- [Section 02 - Fixed Header / Navigation](#section-02---fixed-header--navigation)
- [Section 03 - Hero Authority](#section-03---hero-authority)
- [Section 04 - Capability Establishment](#section-04---capability-establishment)
- [Section 05 - Depth and Process](#section-05---depth-and-process)
- [Section 06 - Narrative Break](#section-06---narrative-break)
- [Section 07 - Narrative Release](#section-07---narrative-release)
- [Section 08 - Social Proof Elevation (Testimonials)](#section-08---social-proof-elevation-testimonials)
- [Section 09 - Conversion Gravity (Final CTA)](#section-09---conversion-gravity-final-cta)
- [Section 10 - Cinematic Exit](#section-10---cinematic-exit)
- [Section 11 - Footer](#section-11---footer)
- [Section 12 - Mobile CTA Dock](#section-12---mobile-cta-dock)
- [End Summary](#end-summary)

---

## Experience Frame (Global)
### Scene Name / Component: Core Shell and Scroll Rules
- Section ID / name: `CinematicPage` shell (`.home-cinematic`, `.cinematic-shell-linen`) with `Home` scenes.
- Purpose:
  - Establish a stitched cinematic scroll narrative rather than isolated blocks.
  - Keep fixed header + mobile dock outside scene flow.
- Background type:
  - Global linen gradient in shell, then scene-specific background overrides.
- Section height / spacing:
  - Scene rhythm utilities exist globally (`hero`, `dense`, `medium`, `airy`, `anchor`, `quiet`) but home scenes force `!pt-0 !pb-0`.
  - Home scenes disable global overlap offsets (`margin-top/padding-top` resets to zero).
- Typography:
  - Heading font: `Fraunces` (`--font-heading`).
  - Body font: `Manrope` (`--font-body`).
  - Root body letter spacing: `-0.01em`.
- Motion / animation:
  - Route transitions: fade in/out (`0.34s`, ease `[0.22,1,0.36,1]`).
  - Reduced-motion paths are implemented in most scenes.
- Scroll behavior:
  - `html { scroll-behavior: smooth; }`.
  - Anchor sections get `scroll-margin-top: 96px`.
  - Route changes call `window.scrollTo({ top: 0, behavior: 'auto' })` unless hash exists.
- Visual depth:
  - Frequent soft glass layers, subtle borders (`black/[0.06-0.1]`), controlled shadows.
- Mobile vs desktop:
  - Global fixed header on all sizes.
  - Mobile CTA dock appears only under `md`.
- Narrative/emotional role:
  - *Editorial luxury pacing with operational confidence language.*
- Observed UX/luxury issues:
  - **A few gradients and section backgrounds transition abruptly between very dark and linen ranges.**
  - **Typography/spacing systems are mostly coherent, but some components use inline pixel styles outside the Tailwind rhythm.**

```css
:root {
  --font-heading: 'Fraunces', serif;
  --font-body: 'Manrope', system-ui, sans-serif;
}
html { scroll-behavior: smooth; }
section[id] { scroll-margin-top: 96px; }
```

---

## Section 01 - Initial Loading Screen
### Scene Name / Component: Fullscreen Intro Loader
- Section ID / name: `InitialLoadingScreen`.
- Visual description:
  - Full viewport warm gradient (`#f8f4ee -> #ece6db`), centered brand text and progress bar.
- Layout & grid:
  - Single centered column, max width `max-w-sm`.
- Typography & hierarchy:
  - Eyebrow: uppercase `Ghaim UAE` (small, wide tracking).
  - Heading: “Crafting your event”.
  - Supporting status: “Loading experience...”.
- Animation / motion:
  - Screen fade in/out.
  - Sliding bar loop.
  - Pulsing opacity text loop.
  - Minimum visible duration on app side: `700ms` (unless reduced motion).
- Cards/media:
  - No cards. No media image/video.
- CTA analysis:
  - No CTA.
- Mobile behavior:
  - Same structure, text scales (`text-3xl` to `sm:text-4xl`).
- Narrative/emotional role:
  - *Sets a polished, ceremonial prelude before content reveal.*
- Observed UX/luxury issues:
  - **Loader copy is functional and generic compared with the high-end tone used later.**

---

## Section 02 - Fixed Header / Navigation
### Scene Name / Component: Desktop Header Bar + Mega Menu
- Section ID / name: `GhaimAEHeader`, `HeaderDesktop`, `MegaMenu`.
- Visual description:
  - Fixed top bar, transparent on hero until scrolled/hovered, then frosted white (`bg-white/95`, blur, shadow).
- Layout & grid:
  - Max-width container (`max-w-7xl`), logo left, nav center/right, search + CTA right.
  - Mega menu: large dropdown panel with content grid and featured column.
- Typography & hierarchy:
  - Nav labels: uppercase, `13px`, `0.08em` tracking.
  - Logo wordmark uses uppercase with tighter luxury spacing.
- Animation / motion:
  - Header hides on downward velocity and reveals on reverse scroll.
  - Mega menu entrance: slight fade/translate/scale.
  - Underline and chevron transitions on nav hover/open.
- Cards/media:
  - Mega menu uses bordered cards for submenu entries.
- CTA analysis:
  - Desktop CTA: rounded white “Contact” button (high contrast).
  - Secondary action: search trigger.
- Mobile behavior:
  - Desktop nav hidden on mobile (`lg:flex` only).

### Scene Name / Component: Mobile Drawer Navigation
- Section ID / name: `HeaderMobile`.
- Visual description:
  - Circular hamburger morphs to close icon; right-side drawer (`85vw`, max `420px`) with dim overlay.
- Layout & grid:
  - Vertical nav with accordions (Services, Company), sticky bottom CTA panel.
- Typography & hierarchy:
  - Primary rows `text-lg`; subrows `text-base`.
- Animation / motion:
  - Drawer slide-in (`0.38s` cubic-bezier).
  - Plus icon rotates to X in accordion headers.
- CTA analysis:
  - Drawer CTA: full-width “Get in touch”.
- Mobile behavior:
  - Focus management and outside click close logic present.
- Narrative/emotional role:
  - *Maintains premium clarity while shifting to utility-first mobile wayfinding.*
- Observed UX/luxury issues:
  - **Desktop mega menu is denser and more editorial than mobile drawer; parity in perceived richness is lower on mobile.**

---

## Section 03 - Hero Authority
### Scene Name / Component: Full-Viewport Hero
- Section ID / name: `scene-01-hero-authority`, inner `#hero`.
- Visual description:
  - Full-screen image + autoplay muted video background, dark veil gradient, subtle bloom effect on desktop, light gradient at bottom bridging into linen scenes.
- Background type:
  - Media stack: image poster + video + overlay gradient + bloom radial + bottom blend gradient.
- Section height / padding / spacing:
  - `min-h-[100svh]`, content vertically centered.
  - Container padding: `pt-10/pb-10`, up to `sm:pt-24`.
- Layout & grid:
  - Single-column narrative block, max text width `max-w-3xl`.
- Content types:
  - Eyebrow badge (“Ultra-premium event production”).
  - H1 headline.
  - Divider rule.
  - Supporting paragraph.
  - Primary CTA.
  - Desktop-only trust micro-list.
- Typography:
  - H1: serif, `clamp(2rem, 5.5vw, 4.5rem)`, `leading 1.05`.
  - Body copy: `clamp(14px, 1.8vw, 18px)`.
  - Eyebrow: `10px`, `0.2em`, uppercase.
- Animation / motion:
  - Scroll-linked media scale, copy y-shift, veil opacity, bloom fade.
  - Staggered reveal of content elements.
  - Desktop scroll indicator pulse at bottom.
- Shadow/border/depth:
  - CTA uses strong dark shadow stack.
  - Eyebrow chip uses translucent border + blur.
- CTA placement/type/style:
  - Left-aligned primary filled pill “Request a proposal”.
  - Click scrolls to `#get-started`.
- Mobile behavior:
  - Desktop-only badge and trust list hidden.
  - Copy wraps earlier; bottom scroll indicator hidden on mobile.
- Narrative/emotional role:
  - *Authority and composure opening shot.*
- Luxury perception:
  - 9/10.
- Observed UX/luxury issues:
  - **Video fallback handling is robust, but text contrast depends on varying underlying media luminance.**

```jsx
<section id="hero" className="relative min-h-[100svh] overflow-hidden bg-black">
  <video autoPlay muted loop playsInline ... />
</section>
```

---

## Section 04 - Capability Establishment
### Scene Name / Component: Sticky Split Narrative + Vertical Capability Track
- Section ID / name: `scene-02-capability-establishment`, inner `#scene-capability-establishment`.
- Visual description:
  - Light editorial canvas with left narrative rail and right stacked capability cards moving vertically as user scrolls.
- Background type:
  - Transparent section against global light gradient.
- Section height / spacing:
  - Section height `540vh`, sticky viewport `h-screen`.
  - Internal vertical paddings: `py-10` to `md:py-14`.
- Layout & grid:
  - Desktop `12-col` split: left `5`, right `7`.
  - Mobile collapses to one column.
- Content types:
  - Eyebrow, H2, supporting paragraph.
  - Vertical progress rail + “Service sequence” label.
  - Bullet list (3 items).
  - Capability cards (5 cards).
- Typography:
  - Eyebrow: `10px`, uppercase, `0.22em`.
  - H2: `clamp(1.9rem,4vw,3.2rem)`.
  - Body: `15px`.
  - Card titles: serif `clamp(1.1rem,1.8vw,1.45rem)`.
- Animation / motion:
  - Scroll progress drives:
    - Rail fill (`scaleY`).
    - Card track vertical translation.
    - Per-card opacity/y/scale/border intensity.
  - End position aligns final card near top of viewport via runtime measurement.
- Cards/media:
  - 5 capability cards, each with image + text split.
  - Glass-like card finish (`bg-white/[0.74]`, slight blur).
- CTA analysis:
  - No direct CTA; persuasive capability proof block.
- Mobile behavior:
  - Cards become single-column image-first.
  - Track viewport heights reduce (`50-55vh`).
- Narrative/emotional role:
  - *Capability proof and operational control statement.*
- Luxury perception:
  - 8/10.
- Observed UX/luxury issues:
  - **Very long scroll duration (`540vh`) can feel mechanically extended on smaller screens.**
  - **Similar card styling here and in later sections introduces modular repetition.**

| Capability Cards | Count | Structure |
|---|---:|---|
| Event production leadership | 1 | Image + text |
| Technical systems | 1 | Image + text |
| Staging and scenic | 1 | Image + text |
| Furniture and rentals | 1 | Image + text |
| Show-day command | 1 | Image + text |

---

## Section 05 - Depth and Process
### Scene Name / Component: Sticky Process Timeline + Scrolling Step Cards
- Section ID / name: `scene-03-depth-and-process`, inner `#scene-process-depth`.
- Visual description:
  - Continuation of light editorial tone; left side explains process, right side scrolls four process cards.
- Background type:
  - Transparent over same light gradient family as previous scene.
- Section height / spacing:
  - Section height `430vh`, sticky `h-screen`.
  - Internal paddings `py-10` to `md:py-12`.
- Layout & grid:
  - Desktop `5/7` split.
  - One-column stack on mobile.
- Content types:
  - Eyebrow, H2, paragraph.
  - Sequence rail.
  - Desktop-only support image panel.
  - 4 process step cards.
- Typography:
  - H2: `clamp(1.8rem,4vw,3.1rem)`.
  - Step labels: `10px` uppercase tracking.
  - Step titles: serif `clamp(1.15rem,2vw,1.55rem)`.
- Animation / motion:
  - Scroll drives rail fill, image scale/parallax, card-track translate, per-card transform states.
- Cards/media:
  - 4 text cards with soft translucent white background.
  - 1 image frame on desktop (`event-planning-in-action`).
- CTA analysis:
  - No direct CTA.
- Mobile behavior:
  - Left-side image hidden (`lg:block` only).
  - Process remains card-first.
- Narrative/emotional role:
  - *Methodical depth following capability claims.*
- Luxury perception:
  - 8/10.
- Observed UX/luxury issues:
  - **Long sticky storytelling sequence after another long sticky sequence can feel rhythmically repetitive.**

---

## Section 06 - Narrative Break
### Scene Name / Component: Dark Interlude with Word-by-Word Reveal
- Section ID / name: `scene-04-narrative-break`.
- Visual description:
  - Full dark intermission with grain texture and single large serif sentence revealing progressively by word.
- Background type:
  - Animated tone shift (`#17191d` to `#0f1013`) + grain overlay.
- Section height / spacing:
  - `h-[300vh]` with sticky `h-screen`.
- Layout & grid:
  - Centered text block in `max-w-5xl` frame.
- Content types:
  - Eyebrow (“Narrative break”).
  - One marquee sentence.
- Typography:
  - Main line: serif `clamp(2rem,4.8vw,4rem)`, tight leading.
  - Eyebrow: `10px`, uppercase.
- Animation / motion:
  - Word opacity reveal mapped to scroll window (`0.16` to `0.58` progress).
  - Panel y/opacity micro drift near end.
- Cards/media:
  - No cards.
- CTA analysis:
  - None.
- Mobile behavior:
  - Same mechanism; wraps into multiple lines due viewport width.
- Narrative/emotional role:
  - *Intentional pause and dramatic tonal reset.*
- Luxury perception:
  - 9/10.
- Observed UX/luxury issues:
  - **Long dark hold between lighter sections may feel abrupt for users expecting faster informational progression.**

---

## Section 07 - Narrative Release
### Scene Name / Component: Gradient Release with Floating Copy
- Section ID / name: `scene-05-narrative-release`.
- Visual description:
  - Vertical gradient from dark into warm ivory; central typographic statement with glow particles and grain.
- Background type:
  - Multi-stop linear gradient, two animated radial glows, grain overlay.
- Section height / spacing:
  - `h-[145vh]`, sticky inner viewport.
- Layout & grid:
  - Centered single-column copy, `max-w-5xl`.
- Content types:
  - Primary statement.
  - Secondary supporting sentence.
  - Horizontal line accent.
- Typography:
  - Primary: serif `clamp(1.8rem,4.2vw,3.3rem)`.
  - Secondary: `clamp(14px,1.55vw,17px)` medium weight.
- Animation / motion:
  - Scroll-linked blur-to-sharp reveal, color morph dark-to-warm, slight scale arc.
  - Supporting line and copy reveal delayed.
  - Glow layers drift in y and opacity.
- Cards/media:
  - None.
- CTA analysis:
  - None.
- Mobile behavior:
  - Maintains structure with reduced width and natural wrap.
- Narrative/emotional role:
  - *Transitions from tension to confidence and warmth before proof/conversion.*
- Luxury perception:
  - 9/10.
- Observed UX/luxury issues:
  - **Complex text color interpolation across gradient may produce brief lower-contrast moments on some displays.**

---

## Section 08 - Social Proof Elevation (Testimonials)
### Scene Name / Component: Interactive Testimonial Showcase
- Section ID / name: `scene-06-social-proof-elevation`, inner `#testimonials`.
- Visual description:
  - Light luxury editorial panel with large active testimonial card, image side, selector rail, bullet proof stack, and control arrows.
- Background type:
  - Home mode gradient (`#f4efe7 -> #ece7de`).
- Section height / spacing:
  - Home mode: `min-h-screen`.
  - Container: `py-10/12`; desktop uses full-height flex arrangement.
- Layout & grid:
  - Desktop grid `12 cols`:
    - Left `7`: active testimonial figure.
    - Right `5`: selector list + “Why teams come back”.
  - Mobile:
    - Selector chips move below card.
    - Content stacks vertically.
- Content types:
  - Eyebrow, heading, intro paragraph.
  - Rotating testimonial quote, profile, image tags.
  - Side selector list.
  - Proof bullet list.
  - Text CTA link (“Request a proposal”).
  - Prev/next arrow controls and pagination.
- Typography:
  - H2: `clamp(1.6rem,4vw,2.6rem)`.
  - Quote: `clamp(1rem,1.25vw,1.16rem)`, medium.
  - Micro labels: `10-12px`.
- Animation / motion:
  - In-view header reveal.
  - Active testimonial transition via `AnimatePresence` with clip-path motion.
  - Word-level quote reveal animation.
  - Image drift and scale transitions.
  - Selector active background uses shared layout animation.
- Cards/media:
  - 3 testimonials total.
  - Each has image, tags, quote, identity metadata.
- CTA analysis:
  - Inline textual CTA in side proof panel.
  - Additional navigation arrows as interaction CTA.
- Mobile behavior:
  - Tablist simplified to horizontal chips.
  - Side rail collapses below main card.
- Narrative/emotional role:
  - *Social validation and trust reinforcement after abstract narrative scenes.*
- Luxury perception:
  - 8/10.
- Observed UX/luxury issues:
  - **Component density is higher than surrounding scenes, creating a noticeable complexity jump.**
  - **Quote word-by-word animation can feel ornamental if users cycle quickly between testimonials.**

| Testimonial Items | Count | Interaction |
|---|---:|---|
| Client stories | 3 | Select by chips/list/arrows |
| Proof bullets | 3 | Static |
| Image tags per testimonial | 3 each | Static badges |

---

## Section 09 - Conversion Gravity (Final CTA)
### Scene Name / Component: Dark Conversion Split + Lead Form
- Section ID / name: `scene-07-conversion-gravity`, inner `#get-started`.
- Visual description:
  - Dark gradient section with grain overlay; left persuasive copy, right warm-light form card.
- Background type:
  - `linear-gradient(180deg,#1a1e26 -> #11141b)` + grain texture.
- Section height / spacing:
  - Not fixed-height; content-based.
  - Container `py-16`, `sm:py-24`, `lg:py-28`.
- Layout & grid:
  - Two-column desktop layout (`lg:grid-cols-2`, large inter-column gap).
  - One-column mobile stack.
- Content types:
  - Left: eyebrow, H2, paragraph, 3 bullets, direct phone/email channels, availability status.
  - Right: full proposal form.
  - Bottom: “Back to top” micro-button.
- Typography:
  - H2: `clamp(1.9rem,4.6vw,3.2rem)`.
  - Body: `15px`.
  - Form labels: `10px` uppercase.
- Animation / motion:
  - Scroll reveal transforms for intro and form blocks.
  - Back-to-top follows reduced y transform.
- Cards/media:
  - Form card: rounded-xl, warm background `#f8f6f2`, strong drop shadow.
- CTA analysis:
  - Primary conversion CTA is submit button (“Submit request”).
  - Additional direct channel CTAs (`tel`, `mailto`).
  - Ancillary micro CTA: back to top.
- Mobile behavior:
  - Form fields stack; two-up grids become single column at narrow widths.
  - Mobile CTA dock remains visible below main content (except on `/contact`).
- Narrative/emotional role:
  - *Decision moment: confidence translated to inquiry.*
- Luxury perception:
  - 8/10.
- Observed UX/luxury issues:
  - **Form card feels function-first compared with more cinematic treatment in narrative scenes.**
  - **Transition from storytelling to utility form is intentionally sharp but perceptibly abrupt.**

```tailwind
className="rounded-xl border border-black/10 bg-[#f8f6f2] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.16)]"
```

---

## Section 10 - Cinematic Exit
### Scene Name / Component: Final Dark Exit Statement
- Section ID / name: `scene-08-cinematic-exit`.
- Visual description:
  - Dark, minimal close with grain overlay and single statement plus outline CTA.
- Background type:
  - Solid dark (`#101114`) + grain.
- Section height / spacing:
  - `min-h-[62vh]`, padding `py-20` to `lg:py-28`.
- Layout & grid:
  - Single-column centered container (`max-w-7xl`).
- Content types:
  - Eyebrow.
  - H2 declaration.
  - Link CTA to contact.
- Typography:
  - H2: serif `clamp(1.8rem,3.8vw,3.2rem)`.
  - Eyebrow: `10px`, uppercase tracking.
- Animation / motion:
  - In-view staggered fade-up sequence.
- Cards/media:
  - None.
- CTA analysis:
  - Outlined pill “Start a confidential planning call”.
- Mobile behavior:
  - Same composition; copy wraps and button remains inline.
- Narrative/emotional role:
  - *Post-conversion epilogue reinforcing engineered precision.*
- Luxury perception:
  - 8/10.
- Observed UX/luxury issues:
  - **Runs after a complete CTA/form section, so conversion intent appears duplicated in close succession.**

---

## Section 11 - Footer
### Scene Name / Component: Multi-Column Utility Footer
- Section ID / name: `#site-footer`.
- Visual description:
  - Warm light gradient footer with optional top dark fade bridge when on home page.
- Background type:
  - Home: `linear-gradient(180deg, #f2eee7 -> #f3eee5)` + dark top overlay fade.
  - Non-home: lighter neutral gradient with subtle border-top.
- Section height / spacing:
  - Home top padding `76px`; non-home `48px`.
- Layout & grid:
  - Mobile: 2-column grid.
  - Desktop: 5-column grid (`1.4fr 1fr 1fr 1fr 1fr`).
- Content types:
  - Brand block + description + social icons.
  - Services list.
  - Work list.
  - Company list.
  - Contact list + CTA button.
  - Bottom legal/meta row.
- Typography:
  - Section headings: `10px` uppercase.
  - Links mostly `13px`; legal `11px`.
- Animation / motion:
  - In-view stagger fade-up for columns and bottom row.
- Cards/media:
  - No card containers; list-based structure.
- CTA analysis:
  - Footer “Request a proposal” button.
  - “Start a project” text button in legal row.
- Mobile behavior:
  - Brand block spans full width first.
  - Columns wrap into 2-column flow.
- Narrative/emotional role:
  - *Utility/completion layer after cinematic story.*
- Luxury perception:
  - 7/10.
- Observed UX/luxury issues:
  - **Heavier utility density and many links reduce the cinematic premium tone established above.**

---

## Section 12 - Mobile CTA Dock
### Scene Name / Component: Fixed Bottom Mobile Action Tray
- Section ID / name: `MobileCtaDock`.
- Visual description:
  - Floating frosted tray fixed to bottom on mobile only, with two high-priority actions.
- Background type:
  - Semi-opaque warm panel (`bg-[#f8f4ee]/95`) with blur and heavy shadow.
- Section height / spacing:
  - Bottom safe-area padding support (`env(safe-area-inset-bottom)`).
- Layout & grid:
  - 2-column equal action buttons.
- Content types:
  - “Call now” and “Request proposal”.
- Typography:
  - `11px`, uppercase, high tracking.
- Animation / motion:
  - Entrance fade-up on mount.
- CTA analysis:
  - Primary direct conversion shortcut on mobile.
- Mobile behavior:
  - Hidden on `md+`.
  - Hidden on `/contact`, `/privacy`, `/terms`.
- Narrative/emotional role:
  - *Persistent conversion pressure layer.*
- Luxury perception:
  - 7/10.
- Observed UX/luxury issues:
  - **Persistent dock can compete with in-flow section CTAs and reduce visual quiet on mobile.**

---

## End Summary
- Overall scroll experience:
  - Alternates between immersive sticky storytelling and practical conversion blocks.
  - Smooth mechanical scroll is consistent; most transitions are motion-linked and intentional.
- Visual flow & continuity:
  - Strong continuity in typography and neutral-warm palette.
  - Most continuity breaks occur at dark-to-light gradient handoffs and at storytelling-to-form transitions.
- Luxury perception rating (1-10):
  - 8/10 overall.
- Key issues preventing ultimate experience:
  - **Repeated long sticky sections in sequence can feel mechanically prolonged.**
  - **Some scene transitions are tonally abrupt (dark interludes to warm utility).**
  - **Utility-heavy footer/dock layers soften the cinematic premium finish.**
  - **Interaction density spikes in testimonials compared to adjacent scenes.**
- Recommendations for fixing scroll & luxury feel:
  - *Reserved for redesign phase; this snapshot is intentionally observational-only.*

