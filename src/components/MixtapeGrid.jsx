import MixtapeCard from './MixtapeCard.jsx';

export default function MixtapeGrid({ entries }) {
  return (
    <section className="mixtape-grid">
      {entries.map((entry) => (
        <MixtapeCard key={entry.id} entry={entry} />
      ))}
    </section>
  );
}
