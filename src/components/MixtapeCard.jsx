import { getEmbedUrl } from '../lib/embeds.js';

const PLATFORM_HEIGHTS = {
  youtube: 352,
  soundcloud: 166,
  mixcloud: 120,
};

// "2026-01-13" -> "2026.01.13 // cycle 13" (cycle = day of year)
function formatVoidDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const startOfYear = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000) + 1;
  return `${dateString.replace(/-/g, '.')} // cycle ${dayOfYear}`;
}

export default function MixtapeCard({ entry }) {
  const embedUrl = getEmbedUrl(entry);
  const height = PLATFORM_HEIGHTS[entry.platform] ?? 166;
  const paragraphs = (entry.description || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="mixtape-card">
      {embedUrl && (
        <div className="card-embed">
          <iframe
            src={embedUrl}
            title={entry.title}
            loading="lazy"
            allow="autoplay; encrypted-media"
            width="100%"
            height={height}
            frameBorder="0"
          />
        </div>
      )}
      <h3 className="card-title">{entry.title}</h3>
      <time className="card-date" dateTime={entry.date}>
        {formatVoidDate(entry.date)}
      </time>
      <span className="card-platform">▸ {entry.platform.toUpperCase()}</span>
      {paragraphs.map((text, i) => (
        <p className="card-description" key={i}>
          {text}
        </p>
      ))}
      {entry.tags && entry.tags.length > 0 && (
        <ul className="tag-list">
          {entry.tags.map((tag) => (
            <li className="tag" key={tag}>
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
