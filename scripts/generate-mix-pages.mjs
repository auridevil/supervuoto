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

const mixtapes = JSON.parse(readFileSync(DATA, 'utf8'));
let generated = 0;

for (const entry of mixtapes) {
  const image = pageImage(entry);
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
  console.log(
    `[mix-pages] ${entry.id} ← ${image === DEFAULT_IMAGE ? 'default card' : image.slice(0, 70)}`
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
