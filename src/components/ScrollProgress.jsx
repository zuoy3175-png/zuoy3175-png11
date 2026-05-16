export default function ScrollProgress({ progress, hidden }) {
  return (
    <div className={`scrollProgress ${hidden ? 'is-hidden' : ''}`} aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
