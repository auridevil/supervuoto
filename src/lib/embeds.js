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

export default getEmbedUrl;
