#!/usr/bin/env node
/**
 * parse-mixtapes.mjs
 *
 * Reads content/mixtapes.md and generates src/data/mixtapes.json.
 * Zero dependencies — node builtins only.
 *
 * Entry format (one '## ' heading per entry):
 *
 *   ## Mixtape Title
 *   - date: 2026-01-13
 *   - category: dark matter            (optional; default "supervuoto")
 *   - artist: Artist Name              (optional)
 *   - artist-instagram: https://...    (optional)
 *   - artist-soundcloud: https://...   (optional)
 *   - youtube: https://www.youtube.com/watch?v=xxxx     (one or more
 *   - soundcloud: https://soundcloud.com/...             platform links;
 *   - mixcloud: https://www.mixcloud.com/...             at least one required)
 *   - cover: /covers/void-01.svg       (optional; url or /public path)
 *   - cover-credit: photo by X         (optional)
 *   - cover-credit-url: https://...    (optional)
 *   - tags: ambient, drone             (optional)
 *
 *   Free-form description paragraphs until the next ## heading.
 *
 *   The `artist:` field is repeatable — declare an artist, then its
 *   artist-instagram / artist-soundcloud lines, then the next artist:
 *
 *     - artist: elmozzo
 *     - artist-instagram: https://www.instagram.com/supervuoto_/
 *     - artist: bozzystep
 *     - artist-instagram: https://www.instagram.com/samuelebozzy/
 *
 *   After the description, optional `### label` sections hold tracklists
 *   (one `- Artist - Track` list item per line):
 *
 *     ### elmozzo
 *     - Andi Otto - Bangalore Whispers
 *
 * Legacy fields `platform:` + `url:` are still accepted and folded into links.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'content', 'mixtapes.md');
const OUT_DIR = join(ROOT, 'src', 'data');
const OUT_FILE = join(OUT_DIR, 'mixtapes.json');

const PLATFORMS = ['wanderer', 'youtube', 'soundcloud', 'mixcloud'];
const FIELD_NAMES = [
  'date',
  'category',
  'artist',
  'artist-instagram',
  'artist-soundcloud',
  'artist-mixcloud',
  'artist-from',
  'wanderer',
  'youtube',
  'soundcloud',
  'mixcloud',
  'cover',
  'cover-credit',
  'cover-credit-url',
  'tags',
  // legacy
  'platform',
  'url',
];

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isUrl(value) {
  return /^https?:\/\//.test(value || '');
}

function parse(markdown) {
  // Normalize CRLF -> LF.
  const text = markdown.replace(/\r\n?/g, '\n');
  const lines = text.split('\n');

  const entries = [];
  let current = null;

  const flush = () => {
    if (current) {
      current.descriptionLines = current.descriptionLines || [];
      entries.push(current);
      current = null;
    }
  };

  const fieldPattern = new RegExp(
    `^-\\s*(${FIELD_NAMES.join('|')})\\s*:\\s*(.*)$`,
    'i'
  );

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const heading = line.match(/^##\s+(?!#)(.+)$/);
    if (heading) {
      flush();
      current = {
        title: heading[1].trim(),
        fields: {},
        artists: [],
        descriptionLines: [],
      };
      continue;
    }

    if (!current) continue; // preamble before first heading

    const field = line.match(fieldPattern);
    if (field && current.descriptionLines.length === 0) {
      const name = field[1].toLowerCase();
      const value = field[2].trim();

      // artist fields are repeatable; socials attach to the last artist declared
      if (name === 'artist') {
        if (value)
          current.artists.push({
            name: value,
            instagram: null,
            soundcloud: null,
            mixcloud: null,
            from: null,
          });
        continue;
      }
      if (
        name === 'artist-instagram' ||
        name === 'artist-soundcloud' ||
        name === 'artist-mixcloud' ||
        name === 'artist-from'
      ) {
        const last = current.artists[current.artists.length - 1];
        if (!last) {
          console.warn(
            `[parse-mixtapes] WARN: "${current.title}" — ${name} appears before any artist: line; ignored`
          );
          continue;
        }
        if (name === 'artist-from') {
          if (value) last.from = value;
        } else if (isUrl(value)) {
          const key = name.slice('artist-'.length); // instagram | soundcloud | mixcloud
          last[key] = value;
        }
        continue;
      }

      current.fields[name] = value;
      continue;
    }

    // Description body (skip leading blank lines).
    if (line === '' && current.descriptionLines.length === 0) continue;
    current.descriptionLines.push(line);
  }
  flush();

  const mixtapes = [];
  for (const entry of entries) {
    const { title, fields, artists, descriptionLines } = entry;
    const date = fields.date || '';

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.warn(
        `[parse-mixtapes] WARN: skipping "${title}" — invalid or missing date "${date}" (expected YYYY-MM-DD)`
      );
      continue;
    }

    // Platform links — explicit fields, plus legacy platform/url pair.
    const links = {};
    for (const platform of PLATFORMS) {
      if (isUrl(fields[platform])) links[platform] = fields[platform];
    }
    const legacyPlatform = (fields.platform || '').toLowerCase();
    if (PLATFORMS.includes(legacyPlatform) && isUrl(fields.url) && !links[legacyPlatform]) {
      links[legacyPlatform] = fields.url;
    }
    if (Object.keys(links).length === 0) {
      console.warn(
        `[parse-mixtapes] WARN: skipping "${title}" — no valid platform link (need at least one of: ${PLATFORMS.join(' | ')})`
      );
      continue;
    }

    const category = (fields.category || 'supervuoto').toLowerCase();

    // A cover can be image + credit, or credit alone (when the artwork lives
    // in the platform embed but still deserves attribution).
    const coverSrc = fields.cover || '';
    const validSrc = isUrl(coverSrc) || coverSrc.startsWith('/');
    const coverCredit = fields['cover-credit'] || null;
    const cover =
      (coverSrc && validSrc) || coverCredit
        ? {
            src: validSrc ? coverSrc : null,
            credit: coverCredit,
            creditUrl: isUrl(fields['cover-credit-url'])
              ? fields['cover-credit-url']
              : null,
          }
        : null;

    const tags = (fields.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Body: description paragraphs, then optional '### label' tracklist sections.
    const bodyLines = [];
    const tracklists = [];
    let currentTracklist = null;
    for (const line of descriptionLines) {
      const section = line.match(/^###\s+(.+)$/);
      if (section) {
        currentTracklist = { label: section[1].trim(), tracks: [] };
        tracklists.push(currentTracklist);
        continue;
      }
      if (currentTracklist) {
        const item = line.match(/^[-*]\s+(.+)$/);
        if (item) currentTracklist.tracks.push(item[1].trim());
        continue;
      }
      bodyLines.push(line);
    }

    // Collapse description: trim outer blank lines, normalize paragraph breaks.
    const description = bodyLines
      .join('\n')
      .trim()
      .replace(/\n{3,}/g, '\n\n');

    mixtapes.push({
      id: slugify(title),
      title,
      date,
      category,
      artists,
      links,
      cover,
      description,
      tags,
      tracklists: tracklists.filter((t) => t.tracks.length > 0),
    });
  }

  // Newest first.
  mixtapes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return mixtapes;
}

let markdown;
try {
  markdown = readFileSync(SOURCE, 'utf8');
} catch (err) {
  console.error(`[parse-mixtapes] ERROR: cannot read ${SOURCE}: ${err.message}`);
  process.exit(1);
}

const mixtapes = parse(markdown);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(mixtapes, null, 2) + '\n', 'utf8');

const categories = [...new Set(mixtapes.map((m) => m.category))];
console.log(
  `[parse-mixtapes] wrote ${mixtapes.length} mixtape(s) [${categories.join(', ')}] -> ${OUT_FILE}`
);
