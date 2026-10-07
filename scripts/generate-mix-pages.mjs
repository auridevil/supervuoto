#!/usr/bin/env node
/**
 * generate-mix-pages.mjs — runs after `vite build`.
 *
 * Social crawlers never see the #hash of a shared URL, so hash permalinks
 * can't carry per-mix previews. This generates one tiny static page per mix
 * (dist/mix/<id>/index.html) holding that episode's Open Graph tags, which
 * immediately redirects humans to /#<id>. Share the /mix/<id>/ URLs.
 *
 * og:image priority: entry cover -> platform oembed artwork (fetched at
 * build time, best effort) -> the site-wide social card.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src', 'data', 'mixtapes.json');
const DIST = join(ROOT, 'dist');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const SITE_URL = (pkg.homepage || 'https://supervuoto.org').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/social-card.png`;

const escapeHtml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

// Artwork was resolved at the enrich step; just make it absolute for og:image.
function pageImage(entry) {
  const art = entry.artwork;
  if (!art) return DEFAULT_IMAGE;
  return art.startsWith('/') ? SITE_URL + art : art;
}

function pageDescription(entry) {
  const names = (entry.artists || []).map((a) => a.name).join(' vs ');
  const firstParagraph = (entry.description || '').split('\n\n')[0].trim();
  const parts = [
    names,
    firstParagraph || 'A transmission from the super-void.',
    `${entry.date} // ${entry.category}`,
  ].filter(Boolean);
  return parts.join(' — ');
}

const OG_TYPE = { music: 'music.song', website: 'website' };

// GoatCounter endpoint — must match the code used in index.html.
const GOATCOUNTER = 'https://supervuoto.goatcounter.com/count';

// A tiny static page carrying Open Graph tags that redirects humans to the
// SPA hash target. Written to dist/<dir>/index.html.
function writeRedirectPage({ dir, title, description, pageUrl, image, target, linkText, ogType = 'website' }) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="${OG_TYPE[ogType] || 'website'}" />
<meta property="og:site_name" content="supervuoto" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(pageUrl)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<link rel="canonical" href="${escapeHtml(pageUrl)}" />
<meta http-equiv="refresh" content="0;url=${escapeHtml(target)}" />
<script>
try {
  fetch(${JSON.stringify(GOATCOUNTER)} + '?p=' + encodeURIComponent(location.pathname),
        { mode: 'no-cors', keepalive: true });
} catch (e) {}
location.replace(${JSON.stringify(target)});
</script>
<style>body{background:#050208;color:#ece9f7;font-family:monospace;display:grid;place-items:center;min-height:100vh;margin:0}</style>
</head>
<body>
<a href="${escapeHtml(target)}">${escapeHtml(linkText)} →</a>
</body>
</html>
`;
  const outDir = join(DIST, dir);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
}

/* ------------------------------------------------------------------
   Crawlable detail pages: /mix/<line>/<title>/
   The share stubs above redirect instantly, so search engines never index
   an episode. These are the same content as real HTML — description,
   credits and the full tracklist — and they sit beside the app rather
   than replacing it: navigation is still the SPA's hash routes.
   ------------------------------------------------------------------ */

// "Artist - Title" -> { artist, title }
function splitTrack(track) {
  const s = String(track);
  const m = s.match(/^(.*?)\s+[-–—]\s+(.*)$/);
  return m ? { artist: m[1].trim(), title: m[2].trim() } : { artist: '', title: s.trim() };
}

const PLATFORM_LABEL = {
  soundcloud: 'soundcloud',
  youtube: 'youtube',
  mixcloud: 'mixcloud',
  wanderer: 'wanderer',
};

function detailHtml(entry, { pageUrl, image, appUrl }) {
  const names = (entry.artists || []).map((a) => a.name);
  const byline = names.join(' vs ');
  const title = `${entry.title} — supervuoto`;
  const description = pageDescription(entry);
  const tracks = (entry.tracklists || []).flatMap((l) => l.tracks || []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    name: entry.title,
    url: pageUrl,
    datePublished: entry.date,
    genre: entry.tags || [],
    image,
    description: (entry.description || '').split('\n\n')[0] || undefined,
    numTracks: tracks.length,
    track: tracks.map((t) => {
      const { artist, title: name } = splitTrack(t);
      return {
        '@type': 'MusicRecording',
        name,
        ...(artist ? { byArtist: { '@type': 'MusicGroup', name: artist } } : {}),
      };
    }),
  };

  const links = Object.entries(entry.links || {})
    .map(
      ([k, url]) =>
        `<a class="platform" href="${escapeHtml(url)}" rel="noopener">${escapeHtml(
          PLATFORM_LABEL[k] || k
        )}</a>`
    )
    .join('\n      ');

  const tracklistHtml = (entry.tracklists || [])
    .map(
      (list) => `
      <section class="side">
        <h2>${escapeHtml(list.label)}</h2>
        <ol>
${(list.tracks || [])
  .map((t) => {
    const { artist, title: name } = splitTrack(t);
    return artist
      ? `          <li><span class="ta">${escapeHtml(artist)}</span><span class="td">${escapeHtml(name)}</span></li>`
      : `          <li><span class="td">${escapeHtml(name)}</span></li>`;
  })
  .join('\n')}
        </ol>
      </section>`
    )
    .join('\n');

  const tagsHtml = (entry.tags || [])
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join('');

  const credit = entry.cover && entry.cover.credit;
  const creditHtml = credit
    ? `<p class="credit">cover: ${
        entry.cover.creditUrl
          ? `<a href="${escapeHtml(entry.cover.creditUrl)}" rel="noopener">${escapeHtml(credit)}</a>`
          : escapeHtml(credit)
      }</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${escapeHtml(pageUrl)}" />
<meta property="og:type" content="music.playlist" />
<meta property="og:site_name" content="supervuoto" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${escapeHtml(pageUrl)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Major+Mono+Display&family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<style>
:root{--void:#050208;--deep:#0b0618;--purple:#a78bfa;--cyan:#67e8f9;--white:#ece9f7;
--hairline:rgba(167,139,250,.18);--dim:rgba(236,233,247,.55)}
*{box-sizing:border-box}
body{margin:0;background:var(--void);color:var(--white);
font-family:'Space Grotesk',sans-serif;line-height:1.6;
background-image:radial-gradient(circle at 20% 10%,rgba(167,139,250,.08),transparent 45%),
radial-gradient(circle at 85% 75%,rgba(103,232,249,.06),transparent 40%)}
.wrap{max-width:820px;margin:0 auto;padding:40px 20px 80px}
a{color:var(--cyan)}
.home{font-family:'Major Mono Display',monospace;font-size:.85rem;color:var(--purple);
text-decoration:none;letter-spacing:.05em}
h1{font-family:'Major Mono Display',monospace;font-size:clamp(1.5rem,5vw,2.4rem);
line-height:1.25;margin:28px 0 6px;font-weight:400}
.byline{font-size:1.05rem;color:var(--purple);margin:0 0 4px}
.meta{font-family:'Major Mono Display',monospace;font-size:.78rem;color:var(--dim);
letter-spacing:.06em;margin:0 0 24px}
.cover{width:100%;max-width:420px;height:auto;border:1px solid var(--hairline);
border-radius:2px;display:block;margin:0 0 20px}
.lede{font-size:1.08rem;margin:0 0 24px}
.platforms{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 10px;padding:0}
.platform{font-family:'Major Mono Display',monospace;font-size:.8rem;text-decoration:none;
border:1px solid var(--hairline);padding:8px 14px;border-radius:2px;color:var(--cyan)}
.platform:hover{border-color:var(--cyan)}
.listen{display:inline-block;margin:14px 0 0;font-size:.92rem}
.credit{font-size:.8rem;color:var(--dim);margin:14px 0 0}
.tags{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:18px 0 0}
.tags li{font-family:'Major Mono Display',monospace;font-size:.72rem;color:var(--dim);
border:1px solid var(--hairline);padding:4px 9px;border-radius:2px}
hr{border:0;border-top:1px solid var(--hairline);margin:36px 0}
.side h2{font-family:'Major Mono Display',monospace;font-weight:400;font-size:1rem;
color:var(--purple);letter-spacing:.08em;margin:28px 0 10px}
.side ol{padding-left:2.2em;margin:0}
.side li{margin:.3em 0;padding-left:.2em}
.side li::marker{font-family:'Major Mono Display',monospace;color:rgba(167,139,250,.5);font-size:.8em}
.ta{font-weight:500}
.ta::after{content:' — ';color:var(--dim);font-weight:400}
.td{color:var(--dim)}
footer{margin-top:48px;font-size:.82rem;color:var(--dim)}
</style>
</head>
<body>
<div class="wrap">
  <a class="home" href="/">∴ supervuoto</a>

  <h1>${escapeHtml(entry.title)}</h1>
  ${byline ? `<p class="byline">${escapeHtml(byline)}</p>` : ''}
  <p class="meta">${escapeHtml(entry.date)} // ${escapeHtml(entry.category)}</p>

  ${
    entry.cover && entry.cover.src
      ? `<img class="cover" src="${escapeHtml(entry.cover.src)}" alt="${escapeHtml(entry.title)} cover" width="420" />`
      : ''
  }

  ${entry.description ? `<p class="lede">${escapeHtml(entry.description)}</p>` : ''}

  ${links ? `<div class="platforms">\n      ${links}\n    </div>` : ''}
  <a class="listen" href="${escapeHtml(appUrl)}">▶ listen in the archive player</a>
  ${creditHtml}
  ${tagsHtml ? `<ul class="tags">${tagsHtml}</ul>` : ''}

  <hr />
${tracklistHtml}

  <footer>
    Broadcast on <a href="https://backintown.it/radio-player/" rel="noopener">back in town radio</a>
    — friday 18–19 + saturday 21–22 (Italy).
    <br />
    <a href="/">← back to the archive</a>
  </footer>
</div>
<script>
try {
  fetch(${JSON.stringify(GOATCOUNTER)} + '?p=' + encodeURIComponent(location.pathname),
        { mode: 'no-cors', keepalive: true });
} catch (e) {}
</script>
</body>
</html>
`;
}

const mixtapes = JSON.parse(readFileSync(DATA, 'utf8'));
let generated = 0;

const detailUrls = [];
const takenPaths = new Set();

for (const entry of mixtapes) {
  const image = pageImage(entry);

  // 1. the share stub at /mix/<id>/ — unchanged, still redirects into the app
  //    so every link already published keeps working exactly as before.
  writeRedirectPage({
    dir: join('mix', entry.id),
    title: `${entry.title} — supervuoto`,
    description: pageDescription(entry),
    pageUrl: `${SITE_URL}/mix/${entry.id}/`,
    image,
    target: `/#${entry.id}`,
    linkText: `tuning into ${entry.title}`,
    ogType: 'music',
  });
  generated += 1;

  // 2. the crawlable detail page at /mix/<line>/<title>/
  //    entry.path comes from parse-mixtapes.mjs, so the app's share button and
  //    this generator can never disagree about the URL.
  const relPath = `mix/${entry.path}`;
  takenPaths.add(relPath);

  // A line slug must never shadow an episode stub at /mix/<id>/.
  const line = entry.path.split('/')[0];
  if (mixtapes.some((m) => m.id === line)) {
    console.warn(`[mix-pages] WARN: line "${line}" collides with an episode id — check /mix/${line}/`);
  }

  const pageUrl = `${SITE_URL}/${relPath}/`;
  const outDir = join(DIST, relPath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, 'index.html'),
    detailHtml(entry, { pageUrl, image, appUrl: `/#${entry.id}` }),
    'utf8'
  );
  detailUrls.push({ loc: pageUrl, lastmod: entry.date, priority: '0.8' });

  console.log(
    `[mix-pages] ${entry.id} ← ${image === DEFAULT_IMAGE ? 'default card' : image.slice(0, 50)}  +  /${relPath}/`
  );
}

// /collective/ — hardlink that opens the collective modal (#collective).
writeRedirectPage({
  dir: 'collective',
  title: 'the collective — supervuoto',
  description:
    'The voices behind supervuoto — resident and guest transmitters, and the lens.',
  pageUrl: `${SITE_URL}/collective/`,
  image: DEFAULT_IMAGE,
  target: '/#collective',
  linkText: 'entering the collective',
});
console.log('[mix-pages] generated /collective/ hardlink');

console.log(`[mix-pages] generated ${generated} share page(s) under dist/mix/`);

// sitemap.xml — every indexable URL, so search engines can find the episodes
// without crawling the hash routes (which they never see).
// Only the detail pages go in: /mix/<id>/ and /collective/ are redirects, which
// a crawler follows rather than indexes.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, lastmod: today, priority: '1.0' },
  ...detailUrls,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, priority }) =>
      `  <url>\n    <loc>${escapeHtml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8');
console.log(`[mix-pages] generated sitemap.xml (${urls.length} urls)`);
