import { useEffect, useState } from 'react';
import { PARTICIPANTS } from '../participants.js';
import { InstagramIcon, SoundcloudIcon, MixcloudIcon } from './Icons.jsx';

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
        <ul className="participant-list">
          {PARTICIPANTS.map((p) => (
            <li className="participant" key={p.name}>
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
            </li>
          ))}
        </ul>
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
