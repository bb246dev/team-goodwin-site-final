# Micah Scroll Gradient

A single-page scroll experiment whose fixed background moves continuously from dark to light and back to dark across six editorial sections.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:3000`.

## Production check

```bash
npm run build
```

## Main files

- `app/page.tsx` contains the sections, color palettes, and scroll interpolation.
- `app/globals.css` contains the visual treatment and responsive styling.
- `app/layout.tsx` contains the page metadata.
