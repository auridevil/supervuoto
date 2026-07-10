// supervuoto — embed url resolver
// An entry has `links: { youtube?, soundcloud?, mixcloud? }`.
// Each platform link resolves to an iframe src for that platform's player.

export const PLATFORM_ORDER = ['wanderer', 'soundcloud', 'mixcloud', 'youtube'];

export const PLATFORM_HEIGHTS = {
  wanderer: 460,
  youtube: 352,
  soundcloud: 166,
  mixcloud: 120,
};

function extractYouTubeId(url) {
  try {
    const u = new URL(url);

    // https://youtu.be/<id>
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }

    // https://www.youtube.com/watch?v=<id>
    const v = u.searchParams.get('v');
    if (v) return v;

    // https://www.youtube.com/embed/<id>
    const embedMatch = u.pathname.match(/\/embed\/([^/?#]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
  } catch {
    return null;
  }
}

export function getEmbedUrlFor(platform, url, { visual = false } = {}) {
  if (!url) return null;

  switch (platform) {
    // supervuoto's own immersive WebGL player — the url is already the embed.
    case 'wanderer':
      return url;

    case 'youtube': {
      const id = extractYouTubeId(url);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    case 'mixcloud': {
      try {
        const pathname = new URL(url).pathname;
        return `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodeURIComponent(pathname)}`;
      } catch {
        return null;
      }
    }

    case 'soundcloud':
      // visual=true fills the frame with the artwork (use a square frame so it
      // isn't cropped); visual=false is the classic player with the full
      // square thumbnail at the side.
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23a78bfa&auto_play=false&visual=${visual}`;

    default:
      return null;
  }
}

// Platforms an entry is available on, in preferred player order.
export function availablePlatforms(entry) {
  if (!entry || !entry.links) return [];
  return PLATFORM_ORDER.filter((p) => entry.links[p]);
}

// "2026-01-13" -> "2026.01.13 // cycle 13" (cycle = day of year)
export function formatVoidDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000) + 1;
  return `${dateString.replace(/-/g, '.')} // cycle ${dayOfYear}`;
}
