export default function About() {
  return (
    <section className="about-section">
      <div className="about-grid">
        <div className="about-text">
          <h2 className="about-title">ABOUT / THE VOID</h2>
          <p className="about-definition">
            <strong>supervuoto</strong> <em>sost. masch.</em> — (vuoto) ciò in
            cui nulla è, privo di materia. (astronomia) un vuoto molto grosso,
            specialmente uno privo di supercluster.
          </p>
          <p>
            supervuoto is a one-person transmission array bolted to the edge of
            the cosmic void, broadcasting mixtapes back toward whatever is
            still listening. stranger frequencies — gathered from the static
            between stars, sorted by hand, beamed out on a loop.
          </p>
          <p>
            there is no algorithm, no destination. only signal. the void asked
            for music; we were polite enough not to argue. press play and
            drift — the vacuum carries sound just fine, if the sound is good
            enough.
          </p>
          <p>
            twice a week the array couples to a terrestrial antenna: supervuoto
            is on air every friday 18:00–19:00 and every saturday 21:00–22:00
            on{' '}
            <a
              href="https://backintown.it/radio-player/"
              target="_blank"
              rel="noreferrer"
            >
              back in town radio
            </a>
            .
          </p>
          <blockquote className="about-quote">
            “Cosmic void in the paradox of the future and the self meditating
            and contemplating. That in which nothing is, devoid of matter in
            zero point energy.”
          </blockquote>
        </div>
        <figure className="about-figure">
          <img
            src="/art/meditator.png"
            alt="the supervuoto meditator — a pink four-armed figure contemplating the void"
            loading="lazy"
          />
          <figcaption>from the original supervuoto tape</figcaption>
        </figure>
      </div>
    </section>
  );
}
