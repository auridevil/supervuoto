import { useState } from 'react';
import { getEmbedUrl, PLATFORM_HEIGHTS, formatVoidDate } from '../lib/embeds.js';

function ArchiveRow({ entry }) {
  const [open, setOpen] = useState(false);
  const embedUrl = getEmbedUrl(entry);
  const height = PLATFORM_HEIGHTS[entry.platform] ?? 166;
  const paragraphs = (entry.description || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <li className="archive-row">
      <button
        type="button"
        className="row-head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <time className="row-date" dateTime={entry.date}>
          {entry.date.replace(/-/g, '.')}
        </time>
        <span className="row-title">{entry.title}</span>
        <span className="row-platform">{entry.platform}</span>
        <span className="row-toggle">{open ? '↘' : '→'}</span>
      </button>
      {open && (
        <div className="row-body">
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
          <time className="meta-date" dateTime={entry.date}>
            {formatVoidDate(entry.date)}
          </time>
          {paragraphs.map((text, i) => (
            <p className="row-description" key={i}>
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
      )}
    </li>
  );
}

export default function ArchiveList({ entries }) {
  if (!entries || entries.length === 0) return null;
  return (
    <section className="archive">
      <div className="section-head">
        <h2 className="section-title">archive →</h2>
        <p className="section-desc">
          Ogni trasmissione resta nel vuoto. Apri una riga per ascoltare.
        </p>
      </div>
      <ul className="archive-list">
        {entries.map((entry) => (
          <ArchiveRow entry={entry} key={entry.id} />
        ))}
      </ul>
    </section>
  );
}
