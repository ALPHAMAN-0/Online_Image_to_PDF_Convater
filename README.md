# Image to PDF Converter

A 100% client-side **Image to PDF Converter** built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. Convert JPG, PNG, WEBP, GIF, and BMP images into a single PDF — entirely in your browser. No uploads. No accounts. No cost.

> **Privacy first** — your images never leave your device. All decoding, EXIF correction, compression, and PDF generation happens locally in JavaScript.

---

## Features

- Drag-and-drop or click-to-browse uploads (JPG · PNG · WEBP · GIF · BMP, up to 25 MB each)
- Grid of thumbnails with filename, size, and page number
- Drag-and-drop reordering (mouse + keyboard, powered by `@dnd-kit`)
- Remove individual images or clear the entire list
- Full PDF settings panel:
  - **Page size** — A4, Letter, Legal, A3, or Auto (match each image's aspect)
  - **Orientation** — Portrait, Landscape, or Auto (per-image)
  - **Margin** — None, Small, Medium, Large
  - **Image fit** — Fit to page, Stretch, Original size
  - **Quality** — Low, Medium, High (controls JPEG compression + downsizing)
- Custom PDF filename
- Generate with a live progress bar and automatic download
- EXIF orientation handling — phone photos taken in portrait render upright
- Total image count + combined size shown before generation
- Toast notifications (success and error) via `sonner`
- Dark / light / system theme toggle (`next-themes`)
- Fully responsive (mobile · tablet · desktop), keyboard-navigable, ARIA-labeled
- Settings persisted to `localStorage`
- Memory-safe: blob URLs revoked on remove / clear / unmount

---

## Tech stack

| Concern | Library |
| --- | --- |
| Framework | [Next.js 14 (App Router)](https://nextjs.org/) |
| Language | TypeScript |
| Styling | [Tailwind CSS v3](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| UI primitives | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Uploads | [react-dropzone](https://react-dropzone.js.org/) |
| Reordering | [@dnd-kit](https://dndkit.com/) (`core` + `sortable` + `utilities`) |
| PDF generation | [jsPDF](https://github.com/parallax/jsPDF) |
| EXIF | [exifr](https://github.com/MikeKovarik/exifr) |
| Toasts | [sonner](https://sonner.emilkowal.ski/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |

Everything is free and open source. The app is deploy-ready on Vercel's free tier.

---

## Getting started

### Prerequisites

- **Node.js 18.18+** (Next.js 14 requirement)
- npm, pnpm, or yarn

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

```bash
npm run build       # production build
npm run start       # serve the production build
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
```

---

## How it works

1. **Upload** — `react-dropzone` accepts files, validates MIME type + size, and creates `blob:` URLs for instant thumbnails.
2. **Reorder** — `@dnd-kit/sortable` powers the grid; the array order is the page order in the final PDF.
3. **Read EXIF** — `exifr.orientation()` reads the orientation tag (1–8) from each JPEG.
4. **Decode + correct** — each file is decoded into an `<img>`, then drawn to an offscreen `<canvas>` with the appropriate rotation/flip applied so phone photos come out upright.
5. **Compress** — the canvas is exported as JPEG via `canvas.toDataURL("image/jpeg", quality)`; the longest edge is capped per quality preset to keep PDFs reasonable.
6. **Build the PDF** — `jsPDF` adds one page per image. Page size, orientation, margin, and fit are computed in millimeters using a 96 DPI pixel-to-mm conversion.
7. **Download** — the resulting `Blob` is offered as a download via a temporary `<a download>` link; the object URL is revoked shortly after.

### Module layout

```
app/                # Next.js App Router entry — layout, page, globals.css
components/         # UI: header, footer, dropzone, grid, cards, settings, generate bar
components/ui/      # shadcn primitives (button, card, input, select, …)
hooks/              # use-image-upload, use-pdf-settings, use-pdf-generator
lib/                # constants, format helpers, image-utils, pdf-generator
types/              # shared TypeScript types
```

---

## Deploying to Vercel

This project has **no backend** and **no environment variables**, so deployment is essentially one click.

### Option A — GitHub + Vercel dashboard

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Accept the defaults — Vercel auto-detects Next.js.
4. Click **Deploy**. Your app is live on a free `.vercel.app` URL within a minute.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel             # first time: link the project
vercel --prod      # production deployment
```

### Custom domain

In the Vercel dashboard, open the project → **Settings** → **Domains** → add your domain and follow the DNS instructions. SSL is automatic.

---

## Deploying to GitHub Pages

A workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds the app as a static export and publishes it to GitHub Pages on every push to `main`.

### One-time setup

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. (Optional) Trigger the first run by pushing a commit to `main` or running the **Deploy to GitHub Pages** workflow manually from the **Actions** tab.

Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

### How the workflow works

- The build job runs `npm ci && npm run build` with `NEXT_PUBLIC_BASE_PATH=/<repo-name>` set.
- [next.config.mjs](next.config.mjs) reads that env var and configures `basePath` so every asset URL is prefixed correctly.
- `output: "export"` in the config emits a static `out/` folder (no Node server needed).
- `actions/upload-pages-artifact` packs `out/` (adding `.nojekyll` automatically so Jekyll doesn't strip `_next/`).
- `actions/deploy-pages` publishes the artifact.

Locally and on Vercel, `NEXT_PUBLIC_BASE_PATH` is unset, so the app builds at `/` — no conflict.

---

## Customizing

- **Max file size**: `MAX_FILE_SIZE_BYTES` in [lib/constants.ts](lib/constants.ts).
- **Accepted file types**: `ACCEPTED_MIME_TYPES` in [lib/constants.ts](lib/constants.ts).
- **JPEG quality / max edge** per quality preset: `QUALITY_VALUES` and `MAX_IMAGE_DIMENSION` in [lib/constants.ts](lib/constants.ts).
- **Default settings**: `DEFAULT_SETTINGS` in [lib/constants.ts](lib/constants.ts).
- **Theme colors**: HSL CSS variables in [app/globals.css](app/globals.css).

---

## License

MIT — do whatever you want.
