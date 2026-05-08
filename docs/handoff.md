# Final Handoff

## Status

The repository is ready for handoff from the implementation side.

## Verification Commands

```bash
npm run typecheck
npm run build
```

## Local Review

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Open:

- `http://127.0.0.1:5173/cooperative/`
- `http://127.0.0.1:5173/cooperative/projects`

## Deployment Notes

- GitHub Pages base path is configured as `/cooperative/`.
- `public/404.html` handles client-side route refreshes.
- Build output is ignored through `.gitignore`.

## Final QA Checklist

- Home page loads with hero media and no console errors.
- Mobile menu opens, closes, and navigates.
- Work filters change visible case studies.
- Case-study modal opens and closes.
- Private briefing form validates required name and email.
- Projects route loads directly.
- Footer and contact links resolve.
