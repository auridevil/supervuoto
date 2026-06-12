export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* OWNER: replace with your real PayPal.me link or hosted button id */}
      <a
        className="donate-button"
        href="https://paypal.me/supervuoto"
        target="_blank"
        rel="noreferrer"
      >
        FEED THE VOID ⟶ donate
      </a>
      <div className="footer-sigil">✦ ⊘ ✦</div>
      <p>© {year} supervuoto — broadcast from nowhere</p>
    </footer>
  );
}
