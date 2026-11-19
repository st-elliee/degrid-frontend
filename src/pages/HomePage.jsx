import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { joinQueue, listGames } from '../api';
import ErrorMessage from '../components/ErrorMessage.jsx';
import GameStatusBadge from '../components/GameStatusBadge.jsx';
import Logo from '../components/Logo.jsx';
import { usePlayer } from '../hooks/usePlayer.js';
import { usePolling } from '../hooks/usePolling.js';
import { LANGUAGES, PLAYER_COUNT, POLL_STATUS_MS } from '../utils/constants.js';
import { findGameOfPlayer } from '../utils/games.js';
import '../styles/screens.css';

/**
 * Οθόνη 1: Home (mockup M-1). Task #13.
 * Endpoint: POST /queue/players.
 * Το mockup δεν έχει login, οπότε ο παίκτης επιλέγεται από λίστα (IDs 1-48 του backend).
 * Αν ο παίκτης είναι ήδη σε game σε εξέλιξη (GET /games), στη θέση του "Join Game Queue" εμφανίζεται
 * το "Back to game", που ανοίγει το game board.
 */
export default function HomePage() {
  const { playerId, setPlayerId, language, setLanguage, setGameId } = usePlayer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLanguages, setShowLanguages] = useState(false);
  const [activeGameId, setActiveGameId] = useState(null);

  /** Ελέγχει αν ο επιλεγμένος παίκτης παίζει ήδη σε κάποιο game. */
  const checkActiveGame = useCallback(async () => {
    try {
      const { data } = await listGames();
      setActiveGameId(findGameOfPlayer(data, playerId)?.gameId ?? null);
    } catch {
      setActiveGameId(null);
    }
  }, [playerId]);

  usePolling(checkActiveGame, POLL_STATUS_MS, false);

  // Άμεσος έλεγχος όταν αλλάζει ο παίκτης (χωρίς να περιμένουμε το επόμενο polling).
  useEffect(() => {
    setActiveGameId(null);
    checkActiveGame();
  }, [checkActiveGame]);

  function handleBackToGame() {
    setGameId(activeGameId);
    navigate(`/game/${activeGameId}`);
  }

  async function handleJoin() {
    setLoading(true);
    setError(null);
    try {
      await joinQueue(playerId);
      setGameId(null);
      navigate('/queue');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen screen-home">
      <div className="screen-top">
        <GameStatusBadge />
      </div>

      <Logo size={230} />
      <h1 className="title">DeGrid</h1>
      <p className="tagline">
        Tired of studying for your degree?
        <br />
        It&apos;s time for Degrid!
      </p>

      <div className="actions">
        {activeGameId ? (
          <button type="button" className="btn btn-primary" onClick={handleBackToGame}>
            Back to game #{activeGameId}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={handleJoin} disabled={loading}>
            {loading ? 'Joining…' : 'Join Game Queue'}
          </button>
        )}
        <button type="button" className="btn btn-secondary" onClick={() => setShowLanguages((v) => !v)}>
          Change Language
        </button>
      </div>

      {showLanguages && (
        <div className="language-picker" role="group" aria-label="Profile language">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              className={`btn btn-outline ${language === code ? 'is-active' : ''}`}
              onClick={() => {
                setLanguage(code);
                setShowLanguages(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <ErrorMessage error={error} />
      {error?.status === 409 && (
        <p className="small">
          <Link to="/queue">Go to the queue</Link>
        </p>
      )}

      <div className="demo-controls">
        <label className="field-inline">
          Playing as
          <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} disabled={loading}>
            {Array.from({ length: PLAYER_COUNT }, (_, i) => i + 1).map((id) => (
              <option key={id} value={id}>
                Player {id}
              </option>
            ))}
          </select>
        </label>
        <span className="muted small">Profile language: {LANGUAGES.find((l) => l.code === language)?.label ?? language}</span>
      </div>
    </div>
  );
}
