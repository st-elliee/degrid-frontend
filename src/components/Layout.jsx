import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import EditProfileModal from './EditProfileModal.jsx';
import { usePlayer } from '../hooks/usePlayer.js';

/**
 * Κοινό πλαίσιο όλων των οθονών: επικεφαλίδα με τον τρέχοντα παίκτη και περιοχή περιεχομένου.
 * Το "Game #N" είναι link προς το game board του παίκτη και το "Profile" ανοίγει το modal προφίλ (task #16).
 */
export default function Layout() {
  const { playerId, gameId } = usePlayer();
  const [profileOpen, setProfileOpen] = useState(false);
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
          <button
            type="button"
            className="header-btn"
            onClick={() => setProfileOpen(true)}
            title={gameId ? 'Edit your profile' : 'Available when you are in a game'}
          >
            Profile
          </button>
        </span>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <EditProfileModal
        open={profileOpen}
        gameId={gameId}
        playerId={playerId}
        onClose={() => setProfileOpen(false)}
      />
    </div>
  );
}
