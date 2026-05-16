import { useEffect, useState } from 'react';

export default function useInView(onEnter) {
  const [activeKey, setActiveKey] = useState('cover');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const key = visible.target.dataset.key;
        setActiveKey(key);
        onEnter?.(key);
      },
      { threshold: [0.42, 0.58, 0.74] }
    );

    document.querySelectorAll('[data-cinema-section]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onEnter]);

  return activeKey;
}
