# GHAIM Landing Page

Premium React landing page for a private event command office.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | TailwindCSS 3 + CSS Variables |
| Scroll Motion | GSAP + ScrollTrigger + Lenis |
| Micro Motion | Framer Motion 11 |
| Fonts | Cormorant Garamond + DM Sans |

## Getting Started

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run build
```

## Handoff

See `docs/handoff.md` for final QA, deployment, and local review notes.

## Project Structure

```text
src/
  animations/      GSAP and Framer Motion presets
  components/      Navbar, loading screen, reusable controls
  data/            Site content, case studies, services, process, trust proof
  hooks/           Scroll and viewport helpers
  layouts/         Smooth scroll wrapper
  pages/           Projects index
  sections/        Hero, Statement, About, OperatingSystem, CaseStudies, Testimonials, Contact, Footer
  styles/          CSS variables, global styling, Tailwind directives
  utils/           Base path and helpers
```

## Rebuild Notes

The site has been repositioned from a decorative event template into a higher-value private command office experience:

- Richer service architecture and operating principles.
- Dedicated operating-system section for risk, protocol, and delivery control.
- Expanded case studies with scope, timeline, impact, and private notes.
- Stronger trust surface with proof metrics and more specific testimonials.
- Multi-field private briefing flow with generated email handoff.
- Cleaned metadata, responsive layout, and build-ready source structure.
