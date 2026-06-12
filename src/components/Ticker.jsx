import { useEffect, useState } from 'react';
import { isOnAirNow } from '../lib/onair.js';

const PHRASES = [
  'receiving signal from sector NGC-7293…',
  'vacuum decay imminent — keep listening',
  '432.00 MHz // no signal is also a signal',
  'the void stares back. it has good taste.',
  'aligning antenna with the great attractor…',
  'attention: silence is just another mix',
  'decoding drone frequencies from the boötes void…',
  'nobody is here. only music.',
  'on air every friday 18–19 + saturday 21–22 on back in town radio',
  'that in which nothing is — devoid of matter, zero point energy',
  'against perfection. against definition. slop against slop.',
];

export default function Ticker({ latest }) {
  const [live, setLive] = useState(() => isOnAirNow());

  useEffect(() => {
    const interval = setInterval(() => setLive(isOnAirNow()), 60000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    live ? 'WE ARE ON AIR RIGHT NOW → backintown.it' : null,
    latest ? `now transmitting → ${latest.title}` : null,
    ...PHRASES,
  ].filter(Boolean);

  const line = items.join('  ✦  ') + '  ✦  ';

  return (
    <div className={'ticker' + (live ? ' is-live' : '')} aria-hidden="true">
      <span className="ticker-label">
        <span className="ticker-dot" /> {live ? 'on air now' : 'live from nowhere'}
      </span>
      <div className="ticker-track">
        <span className="ticker-content">{line}</span>
        <span className="ticker-content">{line}</span>
      </div>
    </div>
  );
}
