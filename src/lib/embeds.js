// supervuoto — embed url resolver
// Turns a mixtape entry into an iframe src for its platform's player.

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

export function getEmbedUrl(entry) {
  if (!entry || !entry.url) return null;

  switch (entry.platform) {
    case 'youtube': {
      const id = extractYouTubeId(entry.url);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    case 'mixcloud': {
      try {
        const pathname = new URL(entry.url).pathname;
        return `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=0&feed=${encodeURIComponent(pathname)}`;
      } catch {
        return null;
      }
    }

    case 'soundcloud':
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(entry.url)}&color=%23a78bfa&auto_play=false&visual=true`;

    default:
      return null;
  }
}

export const PLATFORM_HEIGHTS = {
  youtube: 352,
  soundcloud: 166,
  mixcloud: 120,
};

// "2026-01-13" -> "2026.01.13 // cycle 13" (cycle = day of year)
export function formatVoidDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000) + 1;
  return `${dateString.replace(/-/g, '.')} // cycle ${dayOfYear}`;
}

export default getEmbedUrl;
