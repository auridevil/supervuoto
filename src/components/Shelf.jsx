import { Thumb } from './EntryBits.jsx';

const artistNames = (artists) =>
  (artists || []).map((a) => a.name).join(' vs ');

// A horizontally-scrollable wall of mix covers. Tapping a cover sets the hash,
// which opens and scrolls to that mix in the transmissions list below.
export default function Shelf({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <section className="shelf">
      <div className="section-head">
        <h2 className="section-title">signals →</h2>
        <p className="section-desc">
          Newest first — scroll the wall, tap a cover to tune in.
        </p>
      </div>
      <ul className="shelf-track">
        {entries.map((entry) => (
          <li className="shelf-item" key={entry.id}>
            <a className="shelf-card" href={`#${entry.id}`}>
              <Thumb entry={entry} className="shelf-thumb" />
              <span className="shelf-title">{entry.title}</span>
              {entry.artists?.length > 0 && (
                <span className="shelf-artists">{artistNames(entry.artists)}</span>
              )}
              <span className="shelf-date">{entry.date.replace(/-/g, '.')}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
