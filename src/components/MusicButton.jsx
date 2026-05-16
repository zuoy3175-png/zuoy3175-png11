export default function MusicButton({ musicOn, volume, onClick, onVolumeChange }) {
  return (
    <div className="musicControl">
      <button className="musicButton" onClick={onClick} aria-pressed={musicOn}>
        {musicOn ? 'MUSIC ON' : 'MUSIC OFF'}
      </button>
      <label className="volumeControl">
        <span>VOL {volume}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
