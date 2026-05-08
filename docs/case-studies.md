# Case Studies

## Components

- Home section: `src/sections/CaseStudies.tsx`
- Projects route: `src/pages/Projects.tsx`

## Content Source

All case-study content lives in `src/data/site.ts` under `caseStudies`.

Each case study includes:

- Title, category, location, and year
- Image
- Summary
- Metric and impact
- Timeline
- Private note
- Scope
- Deliverables

## Interaction

- Category filters on the home Work section.
- Featured case opens a modal with deeper detail.
- Project index route shows all engagements in a scannable format.

## Handoff Checks

- Confirm all filter buttons still leave at least one case visible.
- Confirm the modal opens, scrolls, and closes on desktop and mobile.
- Confirm all case-study images have meaningful alt text.
