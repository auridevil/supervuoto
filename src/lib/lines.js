// The supervuoto lines and their sigils — the same glyphs as the "le linee"
// document (social/supervuoto-lines.html). Plain strings so both the app and
// the build scripts (detail pages) draw exactly the same marks.
//
// `category` in content/mixtapes.md picks the line. `supervuoto` is the
// mother line, bit; `dark matter` is the old name of background radiations.

const SIGILS = {
  bit: `<circle cx="50" cy="50" r="38" stroke="#ece9f7" stroke-width="3.5"/>
<line x1="6" y1="50" x2="94" y2="50" stroke="#67e8f9" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="50" cy="50" r="5" fill="#67e8f9"/>`,
  'background radiations': `<circle cx="50" cy="50" r="38" stroke="#a78bfa" stroke-width="3" opacity="0.55"/>
<circle cx="50" cy="50" r="26" fill="#0b0618" stroke="#a78bfa" stroke-width="3.5"/>`,
  lab: `<circle cx="50" cy="50" r="38" stroke="#ece9f7" stroke-width="3.5"/>
<ellipse cx="50" cy="50" rx="44" ry="17" stroke="#67e8f9" stroke-width="2.5" transform="rotate(-30 50 50)" opacity="0.85"/>
<circle cx="83" cy="32" r="5.5" fill="#67e8f9"/>`,
  'alte energie': `<circle cx="50" cy="50" r="38" stroke="#ece9f7" stroke-width="3.5"/>
<path d="M58 14 L34 52 L50 52 L42 86 L70 44 L52 44 Z" fill="#f0abfc" stroke="#f0abfc" stroke-width="2" stroke-linejoin="round"/>`,
  monography: `<circle cx="50" cy="50" r="38" stroke="#a78bfa" stroke-width="3.5"/>
<circle cx="50" cy="50" r="7" fill="#a78bfa"/>`,
};

const ALIASES = {
  supervuoto: 'bit',
  'dark matter': 'background radiations',
};

// category -> line key, or null if it isn't one of the five lines
export function lineFor(category) {
  const key = String(category || 'supervuoto').toLowerCase();
  const line = ALIASES[key] || key;
  return SIGILS[line] ? line : null;
}

// Inner SVG markup for a category's sigil (viewBox 0 0 100 100), or null.
export function sigilMarkup(category) {
  const line = lineFor(category);
  return line ? SIGILS[line] : null;
}

// A complete inline <svg> string, for static HTML.
export function sigilSvg(category, { size = 16, className = 'line-sigil' } = {}) {
  const inner = sigilMarkup(category);
  if (!inner) return '';
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" aria-hidden="true">${inner}</svg>`;
}
