#!/usr/bin/env node
/**
 * soundcloud-descriptions.mjs — ready-to-paste SoundCloud / Mixcloud copy.
 *
 * SoundCloud descriptions are the archive's best long-tail search surface:
 * people look for tracklists by name. The tracklists already live in
 * content/mixtapes.md, so generate the paste-ready text instead of retyping it.
 *
 *   npm run sc-copy      # writes copy/soundcloud/<id>.txt
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'src', 'data', 'mixtapes.json');
const OUT_DIR = join(ROOT, 'copy', 'soundcloud');

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const SITE_URL = (pkg.homepage || 'https://supervuoto.org').replace(/\/$/, '');

const RADIO = 'back in town radio — friday 18–19 + saturday 21–22 (Italy)';

function block(entry) {
  const names = (entry.artists || []).map((a) => a.name).join(' vs ');
  const tags = entry.tags || [];

  const lines = [];
  lines.push(entry.title);
  if (names) lines.push(names);
  lines.push('');

  if (entry.description) {
    lines.push(entry.description.trim());
    lines.push('');
  }

  lines.push(`Originally broadcast on ${RADIO}.`);
  lines.push(`Full archive + tracklist: ${SITE_URL}/mix/${entry.id}/`);
  lines.push('');

  for (const list of entry.tracklists || []) {
    lines.push(`--- ${list.label} ---`);
    for (const track of list.tracks || []) {
      const t = typeof track === 'string' ? track : [track.artist, track.title].filter(Boolean).join(' - ');
      lines.push(t);
    }
    lines.push('');
  }

  if (tags.length) lines.push(tags.map((t) => `#${t.replace(/[^a-z0-9]/gi, '')}`).join(' '));

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

const mixtapes = JSON.parse(readFileSync(DATA, 'utf8'));
mkdirSync(OUT_DIR, { recursive: true });

for (const entry of mixtapes) {
  const file = join(OUT_DIR, `${entry.id}.txt`);
  writeFileSync(file, block(entry), 'utf8');
  console.log(`[sc-copy] ${entry.id}.txt`);
}
console.log(`[sc-copy] wrote ${mixtapes.length} description(s) to copy/soundcloud/`);
