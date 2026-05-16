export default function ImpactCut({ active }) {
  return <div className={`impactCut ${active ? 'is-cutting' : ''}`} aria-hidden="true" />;
}
