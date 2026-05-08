# Navigation

## Component

`src/components/Navbar.tsx`

## Behavior

- Transparent over the hero.
- Elevated background after scroll or on non-home routes.
- Desktop navigation includes Studio, System, Work, Trust, and Projects.
- Work link opens a compact preview menu with selected case-study cards.
- Mobile navigation uses a full-screen overlay menu.

## Data Dependencies

- Brand details from `src/data/site.ts`.
- Work preview cards from `caseStudies`.

## Handoff Checks

- Confirm all hash links scroll correctly on the deployed `/cooperative/` path.
- Confirm `/projects` opens correctly from desktop and mobile nav.
- Confirm the mobile menu locks body scroll and closes after navigation.
