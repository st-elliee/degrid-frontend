import { useEffect, useState } from 'react';
import { isMuted, onMutedChange, setMuted } from '../utils/sounds.js';

/** Εικονίδιο μουσικής πάνω δεξιά (mockups M-1 και M-2). Ανοίγει και κλείνει τους ήχους του παιχνιδιού. */
export default function MusicIcon() {
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => onMutedChange(setMutedState), []);

  return (
    <button
      type="button"
      className={`music-btn ${muted ? 'is-muted' : ''}`}
      onClick={() => setMuted(!muted)}
      aria-pressed={muted}
      aria-label={muted ? 'Turn the sound on' : 'Turn the sound off'}
      title={muted ? 'Sound is off' : 'Sound is on'}
    >
      <svg className="music-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6.5" cy="18" r="2.6" />
        <circle cx="16.5" cy="16" r="2.6" />
        <path d="M9.1 18V6.5L19.1 4.5V16" />
        {muted && <path d="M3 3L21 21" />}
      </svg>
    </button>
  );
}
