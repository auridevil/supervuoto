const PHRASES = [
  'receiving signal from sector NGC-7293…',
  'vacuum decay imminent — keep listening',
  '432.00 MHz // nessun segnale è un segnale',
  'the void stares back. it has good taste.',
  'aligning antenna with the great attractor…',
  'attenzione: il silenzio è solo un altro mix',
  'decoding drone frequencies from the boötes void…',
  'qui non c’è nessuno. solo musica.',
];

export default function Ticker({ latest }) {
  const items = [
    latest ? `in onda → ${latest.title}` : null,
    ...PHRASES,
  ].filter(Boolean);

  const line = items.join('  ✦  ') + '  ✦  ';

  return (
    <div className="ticker" aria-hidden="true">
      <span className="ticker-label">
        <span className="ticker-dot" /> live from nowhere
      </span>
      <div className="ticker-track">
        <span className="ticker-content">{line}</span>
        <span className="ticker-content">{line}</span>
      </div>
    </div>
  );
}
