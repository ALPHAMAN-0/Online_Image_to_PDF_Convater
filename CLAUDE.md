# CLAUDE.md

## Commands (package.json scripts)
- Dev: `npm run dev` (next dev)
- Build: `npm run build` (next build)
- Start: `npm run start` (next start)
- Lint: `npm run lint` (next lint)
- Type-check: `npm run type-check` (tsc --noEmit)

No test script is defined in package.json.

## Rules
- 100% client-side app: no backend, no environment variables (README.md L3-5, L110) — don't assume a server-side data layer exists.
- GitHub Pages deploy uses `output: "export"` in next.config.mjs with `NEXT_PUBLIC_BASE_PATH` (README.md L146-154) — don't assume a Node server is always present.

## Read first
- README.md — features, module layout, "How it works", customization points
- lib/constants.ts — MAX_FILE_SIZE_BYTES, ACCEPTED_MIME_TYPES, QUALITY_VALUES, MAX_IMAGE_DIMENSION, DEFAULT_SETTINGS (README.md L160-163)
- app/page.tsx — App Router page entry, composes hooks and components

Architecture: see ARCHITECTURE.md — read before structural changes
