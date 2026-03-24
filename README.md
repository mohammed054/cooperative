# GHAIM — Landing Page

Luxury Corporate Event Management · Premium React Landing Page

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | TailwindCSS 3 + CSS Variables |
| Animation (scroll) | GSAP + ScrollTrigger |
| Animation (micro) | Framer Motion 11 |
| Fonts | Cormorant Garamond (display) · DM Sans (body) |

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Project Structure

```
src/
  animations/     GSAP & Framer Motion presets
  assets/         Fonts, SVGs, static images
  components/     Button, Card, Navbar
  hooks/          useScrollProgress, useInView
  layouts/        ScrollLayout (root scroll wrapper)
  sections/       Hero ✅  |  About 🔲  |  CaseStudies 🔲  |  Testimonials 🔲  |  Contact 🔲
  styles/         variables.css · global.css · tailwind.css
  utils/          cn, clamp, mapRange, lerp
```

---

## Sprint Status

| Section | Status |
|---|---|
| **Hero** | ✅ Complete |
| About / Brand Story | 🔲 Next sprint |
| Case Studies / Portfolio | 🔲 Pending |
| Testimonials / Trust | 🔲 Pending |
| Contact / CTA | 🔲 Pending |

---

## Video Assets

Place hero video files in `/public/videos/`:
- `hero.mp4` (primary, H.264)
- `hero.webm` (fallback, VP9)
- `/public/images/hero-poster.jpg` (first-frame poster)

If no video is present, the dark overlay still renders correctly.

---

## Design Tokens

All brand values live in `src/styles/variables.css`.  
Tailwind extends them via `tailwind.config.js`.

| Token | Value |
|---|---|
| `--color-primary` | `#0E0E0E` Deep Obsidian |
| `--color-accent-1` | `#C5A059` Champagne Gold |
| `--color-accent-2` | `#D6D0C4` Warm Platinum |
| `--font-display` | Cormorant Garamond |
| `--font-body` | DM Sans |

---

> Every design decision reinforces trust, authority, and premium experience.
