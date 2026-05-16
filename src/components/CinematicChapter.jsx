import ActivatedWord from './ActivatedWord.jsx';
import CinematicSection from './CinematicSection.jsx';
import DollyZoomLayer from './DollyZoomLayer.jsx';

function Lines({ lines, className = '' }) {
  return (
    <p className={`copyLines ${className}`}>
      {lines.map((line, index) =>
        line ? <span key={`${line}-${index}`}>{line}</span> : <i key={index} aria-hidden="true" />
      )}
    </p>
  );
}

export default function CinematicChapter({
  id,
  active,
  chapter,
  label,
  title,
  lines = [],
  keyword,
  keywordClass = '',
  variant = 'push',
  aside = false,
  children,
  onActivate,
  onHover
}) {
  return (
    <CinematicSection id={id} className={`chapterScene cinematicChapter chapter-${variant}`} active={active}>
      <DollyZoomLayer variant={variant} />
      {aside && (
        <aside className="chapterRail">
          <span>{chapter}</span>
          <b>{label}</b>
        </aside>
      )}
      <div className="chapterCopy">
        <p className="sectionLabel">
          CHAPTER {chapter} / {label}
        </p>
        <h2>{title}</h2>
        {lines.length > 0 && <Lines lines={lines} />}
        {keyword && (
          <ActivatedWord
            active={active}
            className={`chapterKeyword ${keywordClass}`}
            onActivate={onActivate}
            onHover={onHover}
          >
            {keyword}
          </ActivatedWord>
        )}
        {children}
      </div>
    </CinematicSection>
  );
}
