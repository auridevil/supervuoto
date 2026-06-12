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
 *   - platform: youtube
 *   - url: https://www.youtube.com/watch?v=xxxx
 *   - tags: ambient, drone
 *
 *   Free-form description paragraphs until the next ## heading.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'content', 'mixtapes.md');
const OUT_DIR = join(ROOT, 'src', 'data');
const OUT_FILE = join(OUT_DIR, 'mixtapes.json');

const VALID_PLATFORMS = new Set(['mixcloud', 'soundcloud', 'youtube']);

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      flush();
      current = { title: heading[1].trim(), fields: {}, descriptionLines: [] };
      continue;
    }

    if (!current) continue; // preamble before first heading

    const field = line.match(/^-\s*(date|platform|url|tags)\s*:\s*(.*)$/i);
    if (field && current.descriptionLines.length === 0) {
      current.fields[field[1].toLowerCase()] = field[2].trim();
      continue;
    }

    // Description body (skip leading blank lines).
    if (line === '' && current.descriptionLines.length === 0) continue;
    current.descriptionLines.push(line);
  }
  flush();

  const mixtapes = [];
  for (const entry of entries) {
    const { title, fields, descriptionLines } = entry;
    const platform = (fields.platform || '').toLowerCase();
    const date = fields.date || '';
    const url = fields.url || '';

    if (!VALID_PLATFORMS.has(platform)) {
      console.warn(
        `[parse-mixtapes] WARN: skipping "${title}" — invalid platform "${fields.platform || ''}" (expected mixcloud | soundcloud | youtube)`
      );
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.warn(
        `[parse-mixtapes] WARN: skipping "${title}" — invalid or missing date "${date}" (expected YYYY-MM-DD)`
      );
      continue;
    }
    if (!/^https?:\/\//.test(url)) {
      console.warn(
        `[parse-mixtapes] WARN: skipping "${title}" — invalid or missing url "${url}"`
      );
      continue;
    }

    const tags = (fields.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Collapse description: trim outer blank lines, normalize paragraph breaks.
    const description = descriptionLines
      .join('\n')
      .trim()
      .replace(/\n{3,}/g, '\n\n');

    mixtapes.push({
      id: slugify(title),
      title,
      date,
      platform,
      url,
      description,
      tags,
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

console.log(`[parse-mixtapes] wrote ${mixtapes.length} mixtape(s) -> ${OUT_FILE}`);
