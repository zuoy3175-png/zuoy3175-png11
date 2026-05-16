import { useEffect, useRef } from 'react';

export default function ActivatedWord({
  children,
  active = false,
  className = '',
  onActivate,
  onHover,
  as: Tag = 'span'
}) {
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      onActivate?.();
    }
    wasActiveRef.current = active;
  }, [active, onActivate]);

  return (
    <Tag
      className={`activatedWord ${active ? 'is-word-active' : ''} ${className}`}
      tabIndex={0}
      onMouseEnter={onHover}
      onFocus={onHover}
    >
      {children}
    </Tag>
  );
}
