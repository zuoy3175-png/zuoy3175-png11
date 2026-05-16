import ActivatedWord from './ActivatedWord.jsx';
import CinematicSection from './CinematicSection.jsx';

export default function BigWordScene({ id, active, label, word, note, onActivate, onHover }) {
  return (
    <CinematicSection id={id} className="bigWordScene" active={active}>
      <p className="sectionLabel">{label}</p>
      <ActivatedWord active={active} className="bigWord" onActivate={onActivate} onHover={onHover}>
        {word}
      </ActivatedWord>
      {note && <span className="bigWordNote">{note}</span>}
    </CinematicSection>
  );
}
