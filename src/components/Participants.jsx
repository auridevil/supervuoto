import { useEffect, useState } from 'react';
import mixtapes from '../data/mixtapes.json';
import { PARTICIPANTS } from '../participants.js';
import { InstagramIcon, SoundcloudIcon, MixcloudIcon } from './Icons.jsx';

const GROUPS = [
  { kind: 'dj', label: 'transmitters' },
  { kind: 'lens', label: 'lens' },
];

// Episodes a participant appears in — as a DJ (artist) or as the cover
// photographer (cover credit). Derived from the mix data, newest first.
function episodesFor(name) {
  const key = name.toLowerCase();
  return mixtapes
    .filter(
      (e) =>
        (e.artists || []).some((a) => a.name.toLowerCase() === key) ||
        (e.cover?.credit || '').toLowerCase() === key
    )
    .map((e) => {
      const num = (e.title.match(/episode\s+(\d+)/i) || [])[1];
      const name = (e.title.split(/BIT\s*-\s*/i)[1] || e.title).trim();
      return { id: e.id, label: num ? `ep${num} · ${name}` : name };
    });
}

function Participant({ p, onClose }) {
  const episodes = p.resident ? [] : episodesFor(p.name);
  return (
    <li className="participant">
      <div className="participant-head">
        <span className="participant-name">{p.name}</span>
        {p.from && <span className="participant-from">from {p.from}</span>}
      </div>
      {p.role && <p className="participant-role">{p.role}</p>}
      <div className="participant-links">
        {p.instagram && (
          <a href={p.instagram} target="_blank" rel="noreferrer">
            <InstagramIcon /> instagram ↗
          </a>
        )}
        {p.soundcloud && (
          <a href={p.soundcloud} target="_blank" rel="noreferrer">
            <SoundcloudIcon /> soundcloud ↗
          </a>
        )}
        {p.mixcloud && (
          <a href={p.mixcloud} target="_blank" rel="noreferrer">
            <MixcloudIcon /> mixcloud ↗
          </a>
        )}
      </div>
      {episodes.length > 0 && (
        <div className="participant-eps">
          {episodes.map((ep) => (
            <a key={ep.id} className="episode-tag" href={`#${ep.id}`} onClick={onClose}>
              {ep.label}
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

function Modal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="the collective"
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="close"
        >
          ✕
        </button>
        <h2 className="modal-title">⊘ the collective</h2>
        <p className="modal-intro">
          Voices that have passed through the super-void. The array is open —
          new signals welcome.
        </p>
        {GROUPS.map((group) => {
          const members = PARTICIPANTS.filter((p) => p.kind === group.kind);
          if (members.length === 0) return null;
          return (
            <div className="participant-group" key={group.kind}>
              <h3 className="participant-group-title">⟢ {group.label}</h3>
              <ul className="participant-list">
                {members.map((p) => (
                  <Participant p={p} key={p.name} onClose={onClose} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Participants() {
  const [open, setOpen] = useState(false);
  return (
    <section className="collective">
      <div className="section-head">
        <h2 className="section-title">the collective →</h2>
        <p className="section-desc">
          Who transmits from the void — resident and guests.
        </p>
      </div>
      <button
        type="button"
        className="collective-button"
        onClick={() => setOpen(true)}
      >
        who transmits ⟶
      </button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </section>
  );
}
