// Small shared pieces of an entry: category badge, artist line, cover figure.

import { InstagramIcon, SoundcloudIcon, MixcloudIcon } from './Icons.jsx';

// Square preview image for an entry (archive rows, cards). Falls back to a
// category-tinted sigil when no artwork/cover could be resolved.
export function Thumb({ entry, className = '' }) {
  const src = entry.cover?.src || entry.artwork || null;
  if (src) {
    return (
      <span className={'thumb ' + className}>
        <img src={src} alt={`artwork for ${entry.title}`} loading="lazy" />
      </span>
    );
  }
  return (
    <span
      className={'thumb thumb--empty ' + className}
      data-category={entry.category}
      aria-hidden="true"
    >
      <span className="thumb-sigil">⊘</span>
    </span>
  );
}

export function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span className="category-badge" data-category={category}>
      {category}
    </span>
  );
}

export function ArtistLine({ artists }) {
  if (!artists || artists.length === 0) return null;
  return (
    <div className="artist-line">
      <span className="artist-by">by</span>
      {artists.map((artist, i) => (
        <span className="artist" key={artist.name}>
          {i > 0 && <span className="artist-vs">vs</span>}
          <span className="artist-name">{artist.name}</span>
        </span>
      ))}
    </div>
  );
}

// Footer of an entry's detail: per-artist credit lines (socials, origin).
export function ArtistCredits({ artists }) {
  const credited = (artists || []).filter(
    (a) => a.instagram || a.soundcloud || a.from
  );
  if (credited.length === 0) return null;
  return (
    <div className="artist-credits">
      {credited.map((artist) => (
        <div className="artist-credit" key={artist.name}>
          <span className="credit-name">⟢ {artist.name}</span>
          {artist.instagram && (
            <a
              className="artist-link"
              href={artist.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon /> instagram ↗
            </a>
          )}
          {artist.soundcloud && (
            <a
              className="artist-link"
              href={artist.soundcloud}
              target="_blank"
              rel="noreferrer"
            >
              <SoundcloudIcon /> soundcloud ↗
            </a>
          )}
          {artist.mixcloud && (
            <a
              className="artist-link"
              href={artist.mixcloud}
              target="_blank"
              rel="noreferrer"
            >
              <MixcloudIcon /> mixcloud ↗
            </a>
          )}
          {artist.from && <span className="credit-from">from {artist.from}</span>}
        </div>
      ))}
    </div>
  );
}

export function Tracklist({ tracklists }) {
  if (!tracklists || tracklists.length === 0) return null;
  return (
    <details className="tracklist">
      <summary>tracklist →</summary>
      <div className="tracklist-sides">
        {tracklists.map((side) => (
          <div className="tracklist-side" key={side.label}>
            <h4 className="tracklist-label">⟢ {side.label}</h4>
            <ol>
              {side.tracks.map((track, i) => (
                <li key={i}>{track}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </details>
  );
}

export function Cover({ cover, title }) {
  if (!cover) return null;

  const credit = cover.credit && (
    <>
      cover ∴{' '}
      {cover.creditUrl ? (
        <a href={cover.creditUrl} target="_blank" rel="noreferrer">
          {cover.credit}
        </a>
      ) : (
        cover.credit
      )}
    </>
  );

  // Credit-only: the artwork lives in the platform embed, credit still shown.
  if (!cover.src) {
    return credit ? <div className="cover-credit">{credit}</div> : null;
  }

  return (
    <figure className="cover">
      <img src={cover.src} alt={`cover artwork for ${title}`} loading="lazy" />
      {credit && <figcaption className="cover-credit">{credit}</figcaption>}
    </figure>
  );
}

export function TagList({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li className="tag" key={tag}>
          #{tag}
        </li>
      ))}
    </ul>
  );
}
