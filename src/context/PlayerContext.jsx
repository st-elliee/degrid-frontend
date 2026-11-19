import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, DEFAULT_PLAYER_ID, STORAGE_KEY } from '../utils/constants.js';

export const PlayerContext = createContext(null);

/** Διαβάζει τη συνεδρία από το localStorage (αν δεν είναι διαθέσιμο, επιστρέφει προεπιλογές). */
function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { playerId, gameId, language } = JSON.parse(raw);
      return {
        playerId: Number(playerId) || DEFAULT_PLAYER_ID,
        gameId: gameId ? Number(gameId) : null,
        language: language || DEFAULT_LANGUAGE,
      };
    }
  } catch {
    // Το localStorage μπορεί να μην είναι διαθέσιμο: συνεχίζουμε με προεπιλογές.
  }
  return { playerId: DEFAULT_PLAYER_ID, gameId: null, language: DEFAULT_LANGUAGE };
}

/** Κρατά τον τρέχοντα παίκτη (playerId), το game του (gameId) και τη γλώσσα προφίλ. Δεν υπάρχει login. */
export function PlayerProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Αγνοείται: η εφαρμογή δουλεύει και χωρίς αποθήκευση.
    }
  }, [session]);

  const setPlayerId = useCallback((playerId) => setSession((s) => ({ ...s, playerId: Number(playerId) })), []);
  const setGameId = useCallback((gameId) => setSession((s) => ({ ...s, gameId: gameId ? Number(gameId) : null })), []);
  const setLanguage = useCallback((language) => setSession((s) => ({ ...s, language })), []);
  const reset = useCallback(
    () => setSession((s) => ({ playerId: s.playerId, gameId: null, language: s.language })),
    [],
  );

  const value = useMemo(
    () => ({
      playerId: session.playerId,
      gameId: session.gameId,
      language: session.language,
      setPlayerId,
      setGameId,
      setLanguage,
      reset,
    }),
    [session, setPlayerId, setGameId, setLanguage, reset],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
