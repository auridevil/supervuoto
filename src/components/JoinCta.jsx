import { InstagramIcon } from './Icons.jsx';

const INSTAGRAM_URL = 'https://www.instagram.com/supervuoto_/';

export default function JoinCta() {
  return (
    <section className="join-cta">
      <img
        className="join-eye"
        src="/art/eye-moon.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <h2 className="join-title">
        want to be part of{' '}
        <span className="glitch" data-text="supervuoto">
          supervuoto
        </span>
        ?
      </h2>
      <p className="join-text">
        The void is always listening for new frequencies. Write me on Instagram
        and tell me more — who you are, what you play, where your signal comes
        from.
      </p>
      <a
        className="join-button"
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
      >
        <InstagramIcon /> transmit on instagram ↗
      </a>
    </section>
  );
}
