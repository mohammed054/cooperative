GHAIM Landing Page – Blueprint
1. Project Overview

Tech Stack

React 18+ (functional components, hooks)
Vite + TypeScript (fast dev & type safety)
TailwindCSS (utility-first styling + custom variables)
Framer Motion (hover micro-interactions & subtle animations)
GSAP + ScrollTrigger (scroll-based staggered reveals & section transitions)
PostCSS (optional, advanced CSS processing)
Markdown-driven structure for content & architecture (agent-ready)

Design Philosophy

Authoritative, corporate, premium — not ultra-modern or trendy.
Smooth scroll, staggered content reveal, micro-interactions that signal trust.
Full viewport sections (100vh × 100vw) — clear top & bottom, intentional pacing.
Typography, spacing, and color hierarchy designed for legibility, credibility, and authority.
Depth via layering, shadows, and subtle motion — never cluttered or “decorative.”
Trust-building elements (case studies, stats, testimonials) prioritized in flow.
2. Folder Structure
ghaime-landing/
│
├─ public/
│   ├─ videos/          # Hero background video(s)
│   ├─ images/          # Static assets, logos, icons
│   └─ favicon.ico
│
├─ src/
│   ├─ assets/          # Fonts, SVGs, static images
│   ├─ components/      # Reusable components: Button, Card, Navbar
│   ├─ sections/        # 100vh sections: Hero, About, Testimonials, CaseStudies
│   ├─ layouts/         # Scroll wrappers, layout scaffolds
│   ├─ hooks/           # Custom hooks
│   ├─ animations/      # GSAP & Framer Motion presets
│   ├─ styles/
│   │   ├─ tailwind.css
│   │   ├─ variables.css  # CSS variables: colors, spacing, shadows
│   │   └─ global.css
│   ├─ utils/           # Helper functions
│   ├─ App.tsx
│   └─ main.tsx
│
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ postcss.config.js
└─ tailwind.config.js
3. CSS Variables (variables.css)
:root {
  /* Color Palette */
  --color-primary: #1A1A1A;      /* Obsidian – primary base */
  --color-accent-1: #C5A059;     /* Champagne Gold – highlights */
  --color-accent-2: #E5E5E5;     /* Platinum – secondary text */
  --color-bg: #F9F9F9;           /* Off-White – background */

  /* Typography */
  --font-heading: 'DM Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-size-base: 16px;
  --font-size-lg: 1.25rem;
  --font-size-xl: 2rem;
  --font-size-xxl: 3rem;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 32px;
  --space-xl: 64px;

  /* Shadow / Layering */
  --shadow-light: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-medium: 0 6px 16px rgba(0,0,0,0.1);
  --shadow-deep: 0 12px 32px rgba(0,0,0,0.15);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Animation Timing */
  --anim-fast: 0.3s;
  --anim-medium: 0.6s;
  --anim-slow: 1s;
  --anim-delay-stagger: 0.15s;
}
4. Tailwind Config Highlights (tailwind.config.js)
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [tailwindcss],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent1: 'var(--color-accent-1)',
        accent2: 'var(--color-accent-2)',
        bg: 'var(--color-bg)',
      },
      boxShadow: {
        light: 'var(--shadow-light)',
        medium: 'var(--shadow-medium)',
        deep: 'var(--shadow-deep)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      transitionDuration: {
        fast: 'var(--anim-fast)',
        medium: 'var(--anim-medium)',
        slow: 'var(--anim-slow)',
      },
    },
  },
});
5. Animation & Micro-Interaction Guidelines

Framer Motion:

Hover: subtle lift, scale, opacity
Buttons & Cards respond with deliberate micro-feedback

GSAP + ScrollTrigger:

Staggered reveal for section content
Section transitions triggered by scroll, slow & smooth

Animation Principles:

Staggered entrance: 0.1–0.2s per element
Easing: ease-in-out or cubic-bezier for premium pacing
No flashy or fast movements — authority > playfulness
Scroll should feel natural, not like moving a page
6. Layering & Visual Depth
Hero video at base layer, text overlay with high z-index
Cards, case studies, and portfolio items: medium shadows to lift visually
Subtle gradients or soft overlays for depth, never distracting
Typography hierarchy: headings over subtext, CTAs prominent
Depth created via z-index + shadows + staggered animation
7. Naming & Component Conventions
Components: PascalCase
Button.tsx, Card.tsx, Navbar.tsx
Sections: PascalCase
Hero.tsx, About.tsx, Testimonials.tsx, CaseStudies.tsx
Animations: camelCase, descriptive
fadeInUp.ts, staggerCards.ts
CSS:
variables.css (brand styling, spacing, shadows)
global.css (resets)
tailwind.css (base Tailwind directives)
8. Development Workflow
Scaffold Hero + Navbar first for initial look & feel
Layer in each 100vh section one by one
Apply scroll-triggered staggered reveals via GSAP
Add Framer Motion micro-interactions on buttons, cards, images
Test visual hierarchy, typography, color contrast, spacing
Hand off Markdown-driven guides for AI or human developers

💡 Note: Every design decision reinforces trust, authority, and premium experience.
The blueprint is the foundation for $50k+ UI/UX quality — every section, motion, and visual layer should feel deliberate, not decorative.