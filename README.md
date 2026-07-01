# SUPERVUOTO

Transmissions from the void. A dark, deep-space mixtape archive — Vite 6 + React 18, plain CSS, no TypeScript.

The mixtape data lives in `content/mixtapes.md`. At dev/build time, `scripts/parse-mixtapes.mjs` parses it into `src/data/mixtapes.json` (generated — gitignored, do not edit by hand).

## Adding a mixtape

Append an entry to `content/mixtapes.md`. One `## ` heading per entry:

```markdown
## Mixtape Title

- date: 2026-01-13
- category: dark matter
- artist: Artist Name
- artist-instagram: https://www.instagram.com/artist/
- artist-soundcloud: https://soundcloud.com/artist
- youtube: https://www.youtube.com/watch?v=xxxx
- soundcloud: https://soundcloud.com/artist/mix
- mixcloud: https://www.mixcloud.com/artist/mix/
- cover: /covers/my-cover.jpg
- cover-credit: photo by Someone
- cover-credit-url: https://www.instagram.com/someone/
- tags: ambient, drone

Free-form description paragraphs until the next ## heading.
```

Rules:

- `date` — required, `YYYY-MM-DD` (entries are sorted newest-first).
- `youtube` / `soundcloud` / `mixcloud` — public page URLs; at least one is
  required, all three may be present. Embeds are derived automatically and the
  player shows a tab per platform.
- `category` — optional, defaults to `supervuoto`. Current frequencies:
  `supervuoto`, `dark matter`, `lab` — any new value just works and shows up
  in the archive filter automatically.
- `artist`, `artist-instagram`, `artist-soundcloud`, `artist-from` — optional
  artist credit. `artist:` is repeatable for b2b/vs episodes: declare an
  artist, then its social/origin lines, then the next `artist:`. The byline
  shows only the names ("elmozzo vs bozzystep"); socials and origin render as
  credit lines at the bottom of the entry detail.
- `cover` — optional cover image: a full URL or a path under `public/`
  (e.g. drop `me.jpg` into `public/covers/` and use `/covers/me.jpg`).
- `cover-credit` / `cover-credit-url` — optional credit line (and link).
  Works without `cover` too, for when the artwork lives in the platform
  embed but still deserves attribution.
- `tags` — comma-separated, optional.
- Description — optional; blank line after the fields, then paragraphs.
- Tracklists — optional; after the description add one `### label` section per
  side (e.g. `### elmozzo`), each followed by `- Artist - Track` list items.
  They render as a collapsible "tracklist →" block.

Every mix is hard-linkable: opening an archive row sets `#<entry-id>` in the
URL (the id is the slugified title), and visiting that URL opens and scrolls
to the mix.

## Sharing on socials

Social crawlers can't see `#hash` URLs, so the build also generates one static
page per mix under `dist/mix/<id>/` carrying that episode's Open Graph tags
(title, artists, artwork — the entry cover, or the platform's artwork fetched
at build time, or the site card as fallback). These pages instantly redirect
to `/#<id>`. **Share the `https://supervuoto.org/mix/<id>/` URLs on socials**
— the "⎘ share" button under each player copies that URL.

`https://supervuoto.org/collective/` is a hardlink that opens the "collective"
participants modal (it redirects to `/#collective`, which the app detects).

The site-wide card is `public/social-card.png`, generated from
`scripts/social-card.html` (regeneration instructions inside). The canonical
domain lives in `package.json` → `homepage` and `src/lib/site.js`.

Entries with no valid date or no valid platform link are skipped with a warning at build time.

## Commands

```sh
npm install
npm run dev      # parse mixtapes + start dev server
npm run build    # parse mixtapes + production build (dist/)
npm run preview  # preview the production build
npm run parse    # regenerate src/data/mixtapes.json only
```

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
site (markdown parse → vite → social share pages) and publishes `dist/` to
GitHub Pages. Nothing built is committed to the repo.

- Custom domain: `public/CNAME` (supervuoto.org). DNS must point the apex
  domain at GitHub Pages (A records: 185.199.108.153, 185.199.109.153,
  185.199.110.153, 185.199.111.153) and `www` via CNAME to
  `<github-user>.github.io`.
- One-time repo setup: Settings → Pages → Source: "GitHub Actions".

## Links to set

- **Donations** — the footer's "FEED THE VOID" button points at a placeholder
  PayPal link. Set your real one in `src/components/Footer.jsx`
  (`https://paypal.me/supervuoto` → your PayPal.me handle or hosted button link).
- **Instagram** — `https://www.instagram.com/supervuoto_/` is used by the
  "want to be part of supervuoto?" section (`src/components/JoinCta.jsx`) and
  the footer.
- **Radio schedule** — the on-air strip, ticker and about section advertise the
  live show (friday 18–19, saturday 21–22 Italy time on
  [back in town radio](https://backintown.it/radio-player/)). Edit
  `src/lib/onair.js` (`SCHEDULE`, `RADIO_URL`) if the slots change — the
  "on air now" live state is derived from it automatically (Europe/Rome time).
