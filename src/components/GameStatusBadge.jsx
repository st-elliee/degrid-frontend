import { useState } from 'react';
import { listGames } from '../api';
import MusicIcon from './MusicIcon.jsx';
import { usePolling } from '../hooks/usePolling.js';
import { hasGameInProgress } from '../utils/games.js';
import { POLL_STATUS_MS } from '../utils/constants.js';

/** Ένδειξη πάνω δεξιά: "Game in progress" (κόκκινο) ή "No game in progress" (πράσινο). Βλ. mockups M-1 και M-2. */
export default function GameStatusBadge() {
  const [active, setActive] = useState(null);

  usePolling(async () => {
    try {
      const { data } = await listGames();
      setActive(hasGameInProgress(data));
    } catch {
      setActive(null);
    }
  }, POLL_STATUS_MS);

  const badge =
    active === null ? (
      <span className="status-badge status-unknown">Connecting…</span>
    ) : (
      <span className={`status-badge ${active ? 'status-live' : 'status-idle'}`}>
        <span className="status-dot" aria-hidden="true" />
        {active ? 'Game in progress' : 'No game in progress'}
      </span>
    );
  return (
    <span className="status-group">
      <MusicIcon />
      {badge}
    </span>
  );
}
