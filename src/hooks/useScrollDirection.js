import { useEffect, useRef, useState } from 'react';

export default function useScrollDirection() {
  const lastYRef = useRef(0);
  const timeoutRef = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const currentY = window.scrollY;
      const goingDown = currentY > lastYRef.current && currentY > 80;
      setHidden(goingDown);
      lastYRef.current = currentY;

      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setHidden(true), 1200);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return hidden;
}
