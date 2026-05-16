export default function CinematicSection({ id, className = '', active, children }) {
  return (
    <section
      id={`section-${id}`}
      className={`cinemaSection ${className} ${active ? 'is-active' : ''}`}
      data-cinema-section
      data-key={id}
    >
      <div className="filmGrain" aria-hidden="true" />
      <div className="redAura" aria-hidden="true" />
      {children}
    </section>
  );
}
