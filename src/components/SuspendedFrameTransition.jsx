import { useEffect, useRef, useState } from 'react';

export default function SuspendedFrameTransition({ active, onImpact }) {
  const sectionRef = useRef(null);
  const firedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
      const next = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(next);

      if (next > 0.82 && !firedRef.current) {
        firedRef.current = true;
        onImpact?.();
      }

      if (next < 0.08) {
        firedRef.current = false;
      }
    };

    const request = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [onImpact]);

  return (
    <section
      ref={sectionRef}
      id="section-suspended"
      className={`cinemaSection suspendedFrame ${active ? 'is-active' : ''}`}
      data-cinema-section
      data-key="suspended"
      style={{ '--suspend-progress': progress }}
    >
      <div className="suspendedSticky">
        <div className="blackFrame">
          <span className="frameLine" />
          <p>CHAPTER 03</p>
          <strong>THE VERDICT / 判定</strong>
        </div>
      </div>
    </section>
  );
}
