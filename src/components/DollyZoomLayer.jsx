export default function DollyZoomLayer({ variant = 'default' }) {
  return (
    <div className={`dollyLayer dolly-${variant}`} aria-hidden="true">
      <span />
    </div>
  );
}
