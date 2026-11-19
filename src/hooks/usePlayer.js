import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext.jsx';

/** Επιστρέφει { playerId, gameId, language, setPlayerId, setGameId, setLanguage, reset }. */
export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer πρέπει να χρησιμοποιείται μέσα στο PlayerProvider.');
  return ctx;
}
