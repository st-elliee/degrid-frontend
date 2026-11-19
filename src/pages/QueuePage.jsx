import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { exitPlayer, getQueue, listGames } from '../api';
import Avatar from '../components/Avatar.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import GameStatusBadge from '../components/GameStatusBadge.jsx';
import Loader from '../components/Loader.jsx';
import Logo from '../components/Logo.jsx';
import { usePlayer } from '../hooks/usePlayer.js';
import { usePolling } from '../hooks/usePolling.js';
import { GAME_START_DELAY_MS, POLL_QUEUE_MS } from '../utils/constants.js';
import { findGameOfPlayer } from '../utils/games.js';
import '../styles/screens.css';

/**
 * Οθόνη 2: Queue lobby (mockups M-2, M-4, M-5, M-6). Task #13.
 * Endpoints: GET /queue/players, GET /games (για να βρεθεί το game όταν δημιουργηθεί), PUT /players/{playerId}/exit.
 * Το "Edit profile" ανοίγει το modal της οθόνης 5. Τα endpoints προφίλ του backend δουλεύουν μόνο για παίκτες που
 * ανήκουν ήδη σε game, γι' αυτό το κουμπί ενεργοποιείται μόλις δημιουργηθεί το game (mockup M-4).
 */
export default function QueuePage() {
  const { playerId, setGameId } = usePlayer();
  const navigate = useNavigate();

  const [queue, setQueue] = useState(null);
  const [queueMessage, setQueueMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedGameId, setStartedGameId] = useState(null);
  const [error, setError] = useState(null);
  const [waitDialog, setWaitDialog] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const lastRemaining = useRef(null);

  /** Ανανεώνει την ουρά και ελέγχει αν ο παίκτης μπήκε σε game. */
  async function refresh() {
    try {
      const [queueResult, gamesResult] = await Promise.all([getQueue(), listGames()]);
      setError(null);

      const game = findGameOfPlayer(gamesResult.data, playerId);
      if (game) {
        setGameId(game.gameId);
        setStartedGameId(game.gameId);
        return;
      }

      const q = queueResult.data;
      setQueue(q);
      setQueueMessage(queueResult.message);
      setSecondsLeft(q.remainingTime);

      // Αν με λιγότερους από 4 παίκτες ο χρόνος ξαναρχίζει (ή φτάσει στο 0), εμφανίζεται το μήνυμα του M-6.
      const previous = lastRemaining.current;
      if (q.count < q.minPlayers && q.count > 0 && (q.remainingTime === 0 || (previous !== null && q.remainingTime > previous + 5))) {
        setWaitDialog(true);
      }
      lastRemaining.current = q.remainingTime;
    } catch (err) {
      setError(err);
    }
  }

  usePolling(refresh, startedGameId ? null : POLL_QUEUE_MS);

  // Αντίστροφη μέτρηση ανά δευτερόλεπτο ανάμεσα στις ανανεώσεις.
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  // Όταν δημιουργηθεί το game, εμφανίζεται για λίγο το "THE GAME STARTS NOW!" και μετά ανοίγει το game board.
  useEffect(() => {
    if (!startedGameId) return undefined;
    const id = setTimeout(() => navigate(`/game/${startedGameId}`), GAME_START_DELAY_MS);
    return () => clearTimeout(id);
  }, [startedGameId, navigate]);

  async function handleExit() {
    try {
      await exitPlayer(playerId);
      setGameId(null);
      navigate('/');
    } catch (err) {
      setError(err);
    }
  }

  const inQueue = queue?.players.some((p) => p.playerId === playerId);
  const players = queue?.players ?? [];

  return (
    <div className="screen screen-queue">
      <div className="screen-top screen-top-queue">
        <Logo size={72} />
        <div className="top-right">
          <button type="button" className="icon-btn" onClick={handleExit} aria-label="Exit queue" title="Exit queue">
            Exit
          </button>
          <GameStatusBadge />
        </div>
      </div>

      <ErrorMessage error={error} />
      {!queue && !startedGameId && !error && <Loader text="Loading the queue…" />}

      {(queue || startedGameId) && (
        <>
          <div className="counter-box">
            {startedGameId ? (
              <>
                <div>Players in game: {players.length || 4}+</div>
                <strong className="game-starts">THE GAME STARTS NOW!</strong>
              </>
            ) : (
              <div>
                Players in queue: {queue.count}/{queue.maxPlayers}
              </div>
            )}
          </div>

          {!startedGameId && !inQueue && (
            <div className="card notice">
              <p>You are not in the queue.</p>
              <Link to="/">Back to Home</Link>
            </div>
          )}

          {!startedGameId && (
            <ul className="player-list" aria-label="Players in the queue">
              {players.map((p) => {
                const me = p.playerId === playerId;
                return (
                  <li key={p.playerId} className="player-row">
                    <Avatar src={p.avatar} name={p.username} />
                    <span className="player-name">
                      {p.username}
                      {me ? ' (Me)' : ''}
                    </span>
                    {me && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setProfileOpen(true)}
                        disabled={!startedGameId}
                        title="Available when the game starts"
                      >
                        Edit profile
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {startedGameId && (
            <p className="muted center">Opening the game board…</p>
          )}

          <div className="screen-bottom">
            <p className="encouragement">
              You&apos;ve waited years to get your degree,
              <br />
              surely you can wait a few more seconds to enter the DeGrid…
            </p>
            <div className="remaining">
              <span>Remaining time:</span>
              <strong>{startedGameId ? 0 : secondsLeft} s</strong>
            </div>
          </div>
          {queueMessage && !startedGameId && <p className="muted small center">{queueMessage}</p>}
        </>
      )}

      {waitDialog && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="wait-title">
          <div className="modal modal-light">
            <h2 id="wait-title">Not Enough Players in the Queue!</h2>
            <p>You have to wait a little longer for the game to start.</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={() => setWaitDialog(false)}>
                I&apos;ll wait
              </button>
              <button type="button" className="btn btn-soft" onClick={handleExit}>
                Exit queue
              </button>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal
        open={profileOpen}
        gameId={startedGameId}
        playerId={playerId}
        onClose={() => setProfileOpen(false)}
        onSaved={refresh}
      />
    </div>
  );
}
