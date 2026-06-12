# SUPERVUOTO

Transmissions from the void. A dark, deep-space mixtape archive — Vite 6 + React 18, plain CSS, no TypeScript.

The mixtape data lives in `content/mixtapes.md`. At dev/build time, `scripts/parse-mixtapes.mjs` parses it into `src/data/mixtapes.json` (generated — gitignored, do not edit by hand).

## Adding a mixtape

Append an entry to `content/mixtapes.md`. One `## ` heading per entry:

```markdown
## Mixtape Title

- date: 2026-01-13
- platform: youtube
- url: https://www.youtube.com/watch?v=xxxx
- tags: ambient, drone

Free-form description paragraphs until the next ## heading.
```

Rules:

- `date` — `YYYY-MM-DD` (entries are sorted newest-first).
- `platform` — one of `mixcloud`, `soundcloud`, `youtube`. Invalid entries are skipped with a warning.
- `url` — the public page URL of the mix; embeds are derived from it automatically.
- `tags` — comma-separated, optional.
- Description — optional; blank line after the fields, then paragraphs.

## Commands

```sh
npm install
npm run dev      # parse mixtapes + start dev server
npm run build    # parse mixtapes + production build (dist/)
npm run preview  # preview the production build
npm run parse    # regenerate src/data/mixtapes.json only
```

## Donations

The footer's "FEED THE VOID" button points at a placeholder PayPal link. Set your real one in `src/components/Footer.jsx` (`https://paypal.me/supervuoto` → your PayPal.me handle or hosted button link).
