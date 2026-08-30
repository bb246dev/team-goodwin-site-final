# Team Goodwin — Mission America

Polished responsive handoff for the Team Goodwin Mission America website. The default branch contains the complete source, generated static build, route/map behavior, FAQ interaction, and the restrained scroll-driven background treatment.

## Preview locally

Requirements: Node.js and Python 3.

```bash
node build-offline.mjs
python3 -m http.server 4173 --directory dist
```

Open <http://localhost:4173/live-tracking.html>.

## Where to work

- `source-html/live-tracking.html` — page structure and content.
- `assets/tracker-base.css` — original site styling and layout.
- `assets/tracker-base.js` — route, tracking, FAQ, and page interactions.
- `assets/ambient-scroll.css` — polished visual overrides and responsive treatment.
- `assets/ambient-scroll.js` — restrained scroll-driven background behavior and contrast selection.
- `build-offline.mjs` — regenerates `dist/` from the source files.

After making changes, run `node build-offline.mjs` and review desktop, tablet, and mobile layouts before committing both source and regenerated `dist/` output.
