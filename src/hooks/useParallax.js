import { useEffect, useState } from 'react';

export default function useParallax() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = max > 0 ? window.scrollY / max : 0;
      setProgress(scrollProgress);
      document.documentElement.style.setProperty('--parallax-y', `${window.scrollY * 0.5}px`);
    };

    const request = () => {
      if (!raf) {
        raf = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return progress;
}
