import { useEffect, useRef, useState } from 'react';
import ActivatedWord from './ActivatedWord.jsx';

export default function WhitePortalScene({
  active,
  onDeepPulse,
  onWhiteFlash,
  onProgress,
  onWordActivate,
  onWordHover
}) {
  const sectionRef = useRef(null);
  const firedRef = useRef(new Set());
  const whiteFiredRef = useRef(false);
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
      onProgress?.(next);

      [0.25, 0.55, 0.85].forEach((point) => {
        if (next >= point && !firedRef.current.has(point)) {
          firedRef.current.add(point);
          onDeepPulse?.(point === 0.25 ? 0.8 : point === 0.55 ? 1.15 : 1.55);
        }
      });

      if (next >= 0.92 && !whiteFiredRef.current) {
        whiteFiredRef.current = true;
        onWhiteFlash?.();
      }

      if (next < 0.05) {
        firedRef.current.clear();
        whiteFiredRef.current = false;
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
  }, [onDeepPulse, onProgress, onWhiteFlash]);

  return (
    <section
      ref={sectionRef}
      id="section-white-portal"
      className={`cinemaSection whitePortal ${active ? 'is-active' : ''}`}
      data-cinema-section
      data-key="white-portal"
      style={{ '--portal-progress': progress }}
    >
      <div className="portalSticky">
        <div className="portalBackground" aria-hidden="true" />
        <p className="sectionLabel">White Portal / CALIBRATION</p>
        <div className="portalTitle">
          <ActivatedWord
            active={active && progress > 0.08}
            onActivate={onWordActivate}
            onHover={onWordHover}
          >
            被作品校准的人
          </ActivatedWord>
        </div>
      </div>
    </section>
  );
}
