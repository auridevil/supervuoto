import { InstagramIcon } from './Icons.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="donate-note">
        supervuoto is not a business — no ads, no profit, nothing to sell. it
        runs on donations alone. what you give keeps the signal alive: servers,
        bandwidth, and the quiet infrastructure that beams these transmissions
        back out of the void.
      </p>
      {/* OWNER: replace with your real PayPal.me link or hosted button id */}
      <a
        className="donate-button"
        href="https://paypal.me/supervuoto"
        target="_blank"
        rel="noreferrer"
      >
        FEED THE VOID ⟶ donate
      </a>
      <div className="footer-links">
        <a
          href="https://www.instagram.com/supervuoto_/"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon /> instagram ∴ @supervuoto_
        </a>
      </div>
      <p className="footer-credit">
        supervuoto artwork ∴{' '}
        <a
          href="https://www.instagram.com/ilmagofrensis/"
          target="_blank"
          rel="noreferrer"
        >
          @ilmagofrensis
        </a>
      </p>
      <div className="footer-sigil">✦ ⊘ ✦</div>
      <p>© {year} supervuoto — broadcast from nowhere</p>
    </footer>
  );
}
