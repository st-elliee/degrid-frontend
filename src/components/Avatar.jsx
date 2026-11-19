import { useState } from 'react';

/** Στρογγυλό avatar παίκτη. Αν η εικόνα δεν φορτώσει, εμφανίζονται τα αρχικά του ονόματος. */
export default function Avatar({ src, name = '?', size = 56 }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };
  if (!src || failed) {
    return (
      <span className="avatar avatar-fallback" style={style} aria-hidden="true">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return <img className="avatar" style={style} src={src} alt="" onError={() => setFailed(true)} />;
}
