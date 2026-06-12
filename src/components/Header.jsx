import Logo from './Logo.jsx';

export default function Header() {
  return (
    <header className="site-header">
      <Logo size={88} />
      <h1 className="site-title">
        <span className="glitch" data-text="SUPERVUOTO">
          SUPERVUOTO
        </span>
      </h1>
      <p className="tagline">transmissions from the super-void</p>
    </header>
  );
}
