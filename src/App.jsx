import mixtapes from './data/mixtapes.json';
import Ticker from './components/Ticker.jsx';
import Header from './components/Header.jsx';
import OnAir from './components/OnAir.jsx';
import Featured from './components/Featured.jsx';
import Statement from './components/Statement.jsx';
import ArchiveList from './components/ArchiveList.jsx';
import About from './components/About.jsx';
import Participants from './components/Participants.jsx';
import JoinCta from './components/JoinCta.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [latest, ...rest] = mixtapes;

  return (
    <div className="app">
      <div className="starfield" aria-hidden="true">
        <div className="stars stars-1" />
        <div className="stars stars-2" />
        <div className="stars stars-3" />
      </div>
      <Ticker latest={latest} />
      <Header />
      <OnAir />
      <Featured entry={latest} />
      <Statement />
      <ArchiveList entries={rest} />
      <About />
      <Participants />
      <JoinCta />
      <Footer />
    </div>
  );
}
