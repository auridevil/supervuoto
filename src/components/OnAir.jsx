import { useEffect, useState } from 'react';
import { RADIO_URL, RADIO_NAME, isOnAirNow } from '../lib/onair.js';

export default function OnAir() {
  const [live, setLive] = useState(() => isOnAirNow());

  useEffect(() => {
    const interval = setInterval(() => setLive(isOnAirNow()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={'onair' + (live ? ' is-live' : '')}>
      <span className="onair-status">{live ? '● on air now' : '◌ on air'}</span>
      <span className="onair-schedule">
        every friday 18–19 ∴ every saturday 21–22{' '}
        <span className="onair-tz">italy time</span>
      </span>
      <a className="onair-button" href={RADIO_URL} target="_blank" rel="noreferrer">
        {live ? 'tune in now ↗' : `${RADIO_NAME} ↗`}
      </a>
    </section>
  );
}
