export default function BlackTransition({ id, chapter, title, active }) {
  return (
    <section
      id={`section-${id}`}
      className={`cinemaSection blackTransition ${active ? 'is-active' : ''}`}
      data-cinema-section
      data-key={id}
      data-transition="black"
    >
      <div className="transitionText">
        <span>{chapter}</span>
        <strong>{title}</strong>
      </div>
    </section>
  );
}
