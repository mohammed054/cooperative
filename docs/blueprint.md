# GHAIM Site Blueprint

## Purpose

GHAIM is positioned as a private event command office for high-stakes corporate and private events. The site should feel operationally mature, not merely decorative: every section must show control over protocol, production, hospitality, timing, and risk.

## Stack

- React 18 + TypeScript
- Vite 5
- TailwindCSS with global CSS variables
- GSAP + ScrollTrigger for scroll-driven reveals
- Lenis for smooth scrolling
- Framer Motion for micro-interactions
- React Router with GitHub Pages base path support

## Primary Routes

- `/` home experience
- `/projects` portfolio index

The Vite base path is `/cooperative/` in `vite.config.ts`, and `public/404.html` supports direct GitHub Pages route reloads.

## Source Structure

```text
src/
  animations/      Motion presets and GSAP helpers
  components/      Navbar, loading screen, reusable primitives
  data/            Single source of truth for content
  hooks/           Scroll and viewport helpers
  layouts/         Smooth scroll wrapper
  pages/           Projects route
  sections/        Home page sections
  styles/          Variables, global CSS, Tailwind entry
  utils/           Base path and generic helpers
```

## Handoff Priorities

- Keep content changes inside `src/data/site.ts` when possible.
- Keep visual system changes inside `src/styles/variables.css` and `src/styles/global.css`.
- Run `npm run typecheck` and `npm run build` before delivery.
- Smoke-test `/cooperative/` and `/cooperative/projects` after deployment.
