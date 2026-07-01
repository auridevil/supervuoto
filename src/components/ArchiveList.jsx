import { useEffect, useRef, useState } from 'react';
import { formatVoidDate } from '../lib/embeds.js';
import Player from './Player.jsx';
import {
  CategoryBadge,
  ArtistLine,
  ArtistCredits,
  Cover,
  TagList,
  Thumb,
  Tracklist,
} from './EntryBits.jsx';

const artistNames = (artists) =>
  (artists || []).map((a) => a.name).join(' vs ');

const currentHash = () =>
  typeof window === 'undefined' ? '' : window.location.hash.slice(1);

function ArchiveRow({ entry }) {
  // Each mix is a hard link: opening a row puts #<id> in the URL, and
  // landing on (or navigating to) #<id> opens and scrolls to the row.
  const [open, setOpen] = useState(() => currentHash() === entry.id);
  const ref = useRef(null);

  useEffect(() => {
    const onHashChange = () => {
      if (currentHash() === entry.id) {
        setOpen(true);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (currentHash() === entry.id) {
      ref.current?.scrollIntoView({ block: 'start' });
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [entry.id]);

  const toggle = () => {
    setOpen((o) => {
      const next = !o;
      if (next) {
        window.history.pushState(null, '', `#${entry.id}`);
      } else if (currentHash() === entry.id) {
        window.history.pushState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
      return next;
    });
  };

  const paragraphs = (entry.description || '')
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <li
      className={'archive-row' + (open ? ' is-open' : '')}
      id={entry.id}
      ref={ref}
    >
      <button
        type="button"
        className="row-head"
        aria-expanded={open}
        onClick={toggle}
      >
        <Thumb entry={entry} className="row-thumb" />
        <span className="row-main">
          <span className="row-title">{entry.title}</span>
          {entry.artists?.length > 0 && (
            <span className="row-artists">{artistNames(entry.artists)}</span>
          )}
        </span>
        <span className="row-meta">
          <time className="row-date" dateTime={entry.date}>
            {entry.date.replace(/-/g, '.')}
          </time>
          <CategoryBadge category={entry.category} />
        </span>
        <span className="row-toggle">{open ? '↘' : '→'}</span>
      </button>
      {open && (
        <div className="row-body">
          <Player entry={entry} />
          <div className="meta-row">
            <time className="meta-date" dateTime={entry.date}>
              {formatVoidDate(entry.date)}
            </time>
          </div>
          <ArtistLine artists={entry.artists} />
          {paragraphs.map((text, i) => (
            <p className="row-description" key={i}>
              {text}
            </p>
          ))}
          <Tracklist tracklists={entry.tracklists} />
          <TagList tags={entry.tags} />
          <Cover cover={entry.cover} title={entry.title} />
          <ArtistCredits artists={entry.artists} />
        </div>
      )}
    </li>
  );
}

export default function ArchiveList({ entries }) {
  const [filter, setFilter] = useState('all');
  if (!entries || entries.length === 0) return null;

  const categories = [...new Set(entries.map((e) => e.category))];
  const visible =
    filter === 'all' ? entries : entries.filter((e) => e.category === filter);

  return (
    <section className="archive">
      <div className="section-head">
        <h2 className="section-title">archive →</h2>
        <p className="section-desc">
          Every transmission remains in the void. Open a row to listen — some
          signals travel on more than one channel.
        </p>
      </div>
      {categories.length > 1 && (
        <div className="category-filter">
          {['all', ...categories].map((cat) => (
            <button
              key={cat}
              type="button"
              className={'filter-chip' + (filter === cat ? ' is-active' : '')}
              data-category={cat}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'all frequencies' : cat}
            </button>
          ))}
        </div>
      )}
      <ul className="archive-list">
        {visible.map((entry) => (
          <ArchiveRow entry={entry} key={entry.id} />
        ))}
      </ul>
    </section>
  );
}
