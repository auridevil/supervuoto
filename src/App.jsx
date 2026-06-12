import mixtapes from './data/mixtapes.json';
import Header from './components/Header.jsx';
import MixtapeGrid from './components/MixtapeGrid.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <div className="app">
      <div className="starfield" aria-hidden="true">
        <div className="stars stars-1" />
        <div className="stars stars-2" />
        <div className="stars stars-3" />
      </div>
      <Header />
      <MixtapeGrid entries={mixtapes} />
      <About />
      <Footer />
    </div>
  );
}
