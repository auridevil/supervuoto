#!/usr/bin/env node
/**
 * enrich-artwork.mjs — runs after parse, before vite build.
 *
 * Adds an `artwork` field (a preview image URL) to every entry in
 * src/data/mixtapes.json so the archive and share pages can show a thumbnail.
 *
 * Priority: explicit entry cover image -> platform oembed thumbnail
 * (soundcloud/youtube/mixcloud) -> null (UI falls back to a sigil).
 *
 * oembed results are cached in content/artwork-cache.json (committed), keyed
 * by the source URL, so repeat builds are instant and offline/CI builds keep
 * working even if a platform is flaky. Delete the cache to force a refresh.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src', 'data', 'mixtapes.json');
const CACHE = join(ROOT, 'content', 'artwork-cache.json');

const oembedEndpoint = (platform, url) => {
  const u = encodeURIComponent(url);
  if (platform === 'soundcloud') return `https://soundcloud.com/oembed?format=json&url=${u}`;
  if (platform === 'youtube') return `https://www.youtube.com/oembed?format=json&url=${u}`;
  if (platform === 'mixcloud') return `https://app.mixcloud.com/oembed/?format=json&url=${u}`;
  return null;
};

// Prefer soundcloud/youtube (real square/large art) over mixcloud.
const SOURCE_ORDER = ['soundcloud', 'youtube', 'mixcloud'];

function sources(entry) {
  return SOURCE_ORDER.filter((p) => entry.links?.[p]).map((platform) => ({
    platform,
    url: entry.links[platform],
  }));
}

async function fetchThumb(platform, url) {
  try {
    const res = await fetch(oembedEndpoint(platform, url), {
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    let thumb = data.thumbnail_url || data.image || null;
    // SoundCloud hands back a small default size; ask for the big square.
    if (thumb) thumb = thumb.replace(/-t\d+x\d+\./, '-t500x500.');
    return thumb;
  } catch {
    return null;
  }
}

const mixtapes = JSON.parse(readFileSync(DATA, 'utf8'));
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
let fetched = 0;

for (const entry of mixtapes) {
  // Explicit cover image always wins.
  if (entry.cover?.src) {
    entry.artwork = entry.cover.src;
    continue;
  }

  entry.artwork = null;
  for (const source of sources(entry)) {
    if (source.url in cache) {
      if (cache[source.url]) {
        entry.artwork = cache[source.url];
        break;
      }
      continue; // cached miss for this URL — try the next platform
    }
    const thumb = await fetchThumb(source.platform, source.url);
    cache[source.url] = thumb; // cache null too, so we don't retry a dead link
    if (thumb) {
      entry.artwork = thumb;
      fetched += 1;
      break;
    }
  }
  console.log(
    `[enrich-artwork] ${entry.id} ← ${entry.artwork ? entry.artwork.slice(0, 68) : 'no artwork'}`
  );
}

writeFileSync(DATA, JSON.stringify(mixtapes, null, 2) + '\n', 'utf8');
writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n', 'utf8');
console.log(
  `[enrich-artwork] ${mixtapes.length} entries enriched (${fetched} freshly fetched, rest cached/explicit)`
);
