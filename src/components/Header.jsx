import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const TRANSMISSIONS = [
  '▒ receiving signal from sector NGC-7293…',
  '▒ vacuum decay imminent — keep listening',
  '▒ 432.00 MHz // nessun segnale è un segnale',
  '▒ the void stares back. it has good taste.',
  '▒ aligning antenna with the great attractor…',
  '▒ attenzione: il silenzio è solo un altro mix',
  '▒ decoding drone frequencies from the boötes void…',
  '▒ transmission stable // entropy at 98.6% and rising',
  '▒ qui non c’è nessuno. solo musica.',
];

export default function Header() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % TRANSMISSIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="site-header">
      <Logo size={88} />
      <h1 className="site-title">
        <span className="glitch" data-text="SUPERVUOTO">
          SUPERVUOTO
        </span>
      </h1>
      <p className="tagline">transmissions from the super-void</p>
      <div className="transmission-bar">{TRANSMISSIONS[index]}</div>
    </header>
  );
}
