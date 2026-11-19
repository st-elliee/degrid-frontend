import { Link, Outlet } from 'react-router-dom';
import { usePlayer } from '../hooks/usePlayer.js';

/** Κοινό πλαίσιο όλων των οθονών: επικεφαλίδα με τον τρέχοντα παίκτη και περιοχή περιεχομένου. */
export default function Layout() {
  const { playerId, gameId } = usePlayer();
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">Degrid</Link>
        <span className="session">
          Παίκτης #{playerId}
          {gameId ? ` · Game #${gameId}` : ''}
        </span>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
