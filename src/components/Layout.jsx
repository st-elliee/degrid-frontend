import { Link, Outlet } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.js';

/**
 * Κοινό πλαίσιο όλων των οθονών: επικεφαλίδα με τον τρέχοντα παίκτη και περιοχή περιεχομένου.
 * Το "Game #N" είναι link προς το game board του παίκτη.
 */
export default function Layout() {
  const { playerId, gameId } = usePlayer();
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">Degrid</Link>
        <span className="session">
          Παίκτης #{playerId}
          {gameId && (
            <>
              {' · '}
              <Link to={`/game/${gameId}`}>Game #{gameId}</Link>
            </>
          )}
        </span>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
