import { formatVoidDate } from '../lib/embeds.js';
import Player from './Player.jsx';
import {
  CategoryBadge,
  ArtistLine,
  ArtistCredits,
  Cover,
  TagList,
  Tracklist,
} from './EntryBits.jsx';

export default function Featured({ entry }) {
  if (!entry) return null;
  const paragraphs = (entry.description || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="featured">
      <div className="section-head">
        <h2 className="section-title">latest transmission →</h2>
        <p className="section-desc">
          The newest signal intercepted from the super-void. Volume up, lights
          off, third eye open.
        </p>
      </div>
      <article className="featured-inner" id={entry.id}>
        <div className="featured-player">
          <Player entry={entry} minHeight={240} squareArt />
        </div>
        <div className="featured-meta">
          <div className="meta-row">
            <CategoryBadge category={entry.category} />
            <time className="meta-date" dateTime={entry.date}>
              {formatVoidDate(entry.date)}
            </time>
          </div>
          <h3 className="featured-title">{entry.title}</h3>
          <ArtistLine artists={entry.artists} />
          {paragraphs.map((text, i) => (
            <p className="featured-description" key={i}>
              {text}
            </p>
          ))}
          <Tracklist tracklists={entry.tracklists} />
          <TagList tags={entry.tags} />
          <Cover cover={entry.cover} title={entry.title} />
          <ArtistCredits artists={entry.artists} />
        </div>
      </article>
    </section>
  );
}
