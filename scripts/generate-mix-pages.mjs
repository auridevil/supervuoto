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

async function oembedThumbnail(entry) {
  const endpoints = [];
  if (entry.links.soundcloud)
    endpoints.push(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(entry.links.soundcloud)}`
    );
  if (entry.links.youtube)
    endpoints.push(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(entry.links.youtube)}`
    );
  if (entry.links.mixcloud)
    endpoints.push(
      `https://app.mixcloud.com/oembed/?format=json&url=${encodeURIComponent(entry.links.mixcloud)}`
    );

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) continue;
      const data = await res.json();
      const thumb = data.thumbnail_url || data.image;
      if (thumb) return thumb;
    } catch {
      // offline or platform hiccup — fall through to the default card
    }
  }
  return null;
}

function pageImage(entry, oembedThumb) {
  if (entry.cover?.src) {
    return entry.cover.src.startsWith('/')
      ? SITE_URL + entry.cover.src
      : entry.cover.src;
  }
  return oembedThumb || DEFAULT_IMAGE;
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

const mixtapes = JSON.parse(readFileSync(DATA, 'utf8'));
let generated = 0;

for (const entry of mixtapes) {
  const thumb = await oembedThumbnail(entry);
  const image = pageImage(entry, thumb);
  const title = `${entry.title} — supervuoto`;
  const description = pageDescription(entry);
  const pageUrl = `${SITE_URL}/mix/${entry.id}/`;
  const target = `/#${entry.id}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="music.song" />
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
<script>location.replace(${JSON.stringify(target)});</script>
<style>body{background:#050208;color:#ece9f7;font-family:monospace;display:grid;place-items:center;min-height:100vh;margin:0}</style>
</head>
<body>
<a href="${escapeHtml(target)}">tuning into ${escapeHtml(entry.title)} →</a>
</body>
</html>
`;

  const dir = join(DIST, 'mix', entry.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  generated += 1;
  console.log(
    `[mix-pages] ${entry.id} ← ${image === DEFAULT_IMAGE ? 'default card' : image.slice(0, 70)}`
  );
}

console.log(`[mix-pages] generated ${generated} share page(s) under dist/mix/`);
