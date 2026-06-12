import { getEmbedUrl, PLATFORM_HEIGHTS, formatVoidDate } from '../lib/embeds.js';

export default function Featured({ entry }) {
  if (!entry) return null;
  const embedUrl = getEmbedUrl(entry);
  const height = Math.max(PLATFORM_HEIGHTS[entry.platform] ?? 166, 240);
  const paragraphs = (entry.description || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="featured">
      <div className="section-head">
        <h2 className="section-title">latest transmission →</h2>
        <p className="section-desc">
          L’ultimo segnale intercettato dal super-vuoto. Volume alto, luci spente.
        </p>
      </div>
      <article className="featured-inner">
        {embedUrl && (
          <div className="featured-embed">
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
        <div className="featured-meta">
          <time className="meta-date" dateTime={entry.date}>
            {formatVoidDate(entry.date)}
          </time>
          <h3 className="featured-title">{entry.title}</h3>
          <span className="meta-platform">▸ {entry.platform.toUpperCase()}</span>
          {paragraphs.map((text, i) => (
            <p className="featured-description" key={i}>
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
        </div>
      </article>
    </section>
  );
}
