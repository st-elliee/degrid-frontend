import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { forfeit, getGrid, getPlayer, getPlayers, getTurn, listGames, validateInput } from '../api';
import CountdownRing from '../components/CountdownRing.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import GameGrid from '../components/GameGrid.jsx';
import GameStatusBadge from '../components/GameStatusBadge.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import Loader from '../components/Loader.jsx';
import Logo from '../components/Logo.jsx';
import { useCountdown } from '../hooks/useCountdown.js';
import { usePlayer } from '../hooks/usePlayer.js';
import { usePolling } from '../hooks/usePolling.js';
import { APPROVED_DELAY_MS, HEARTBEAT_MS, POLL_GAME_MS, TURN_SECONDS } from '../utils/constants.js';
import { parseCoordinates } from '../utils/validators.js';
import { toCellId } from '../utils/cells.js';
import '../styles/screens.css';
import '../styles/game.css';

/**
 * Οθόνη 3: Game board (mockups M-3, M-7, M-8). Task #14.
 * Endpoints: GET /games/{gameId}/grid, GET /games/{gameId}/turn, GET /games/{gameId}/players,
 * POST /games/{gameId}/players/{playerId}/validate-input, PUT /games/{gameId}/players/{playerId}/forfeit.
 * Το GET /games χρησιμοποιείται μόνο για να φανεί αν το game τελείωσε.
 */
export default function GameBoardPage() {
  const gameId = Number(useParams().gameId);
  const { playerId, gameId: sessionGameId, setGameId, reset } = usePlayer();
  const navigate = useNavigate();

  const [grid, setGrid] = useState(null);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(null);
  const [status, setStatus] = useState('in_progress');
  const [error, setError] = useState(null);
  const [notInGame, setNotInGame] = useState(false);

  const [coordinates, setCoordinates] = useState('');
  const [busy, setBusy] = useState(false);
  const [approved, setApproved] = useState(null);
  const [rejected, setRejected] = useState(null);
  const [confirmForfeit, setConfirmForfeit] = useState(false);
  const inputRef = useRef(null);

  // Το game της διεύθυνσης γίνεται το game της συνεδρίας (π.χ. αν ο παίκτης άνοιξε απευθείας το link).
  useEffect(() => {
    if (gameId && gameId !== sessionGameId) setGameId(gameId);
  }, [gameId, sessionGameId, setGameId]);

  /** Ανανεώνει grid, σειρά, leaderboard και κατάσταση του game. */
  const refresh = useCallback(async () => {
    try {
      const [gridResult, turnResult, playersResult, gamesResult] = await Promise.all([
        getGrid(gameId),
        getTurn(gameId),
        getPlayers(gameId),
        listGames(),
      ]);
      setGrid(gridResult.data);
      setTurn(turnResult.data);
      setPlayers(playersResult.data);
      const game = gamesResult.data.find((g) => g.gameId === gameId);
      if (game) setStatus(game.status);
      setNotInGame(!playersResult.data.some((p) => p.playerId === playerId));
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [gameId, playerId]);

  usePolling(refresh, approved ? null : POLL_GAME_MS);

  // Heartbeat: το backend αφαιρεί τον παίκτη μετά από 300 δευτ. χωρίς αίτημα που τον αφορά.
  usePolling(
    async () => {
      try {
        await getPlayer(gameId, playerId);
      } catch {
        // Το σφάλμα φαίνεται ήδη από την ανανέωση της οθόνης.
      }
    },
    notInGame || status === 'finished' ? null : HEARTBEAT_MS,
  );

  const finished = status === 'finished';
  const isMyTurn = !finished && !notInGame && turn?.currentPlayerId === playerId;
  const secondsLeft = useCountdown(TURN_SECONDS, finished ? null : turn?.turnNumber ?? null);
  const currentPlayer = players.find((p) => p.playerId === turn?.currentPlayerId);

  /** Request cell: έλεγχος των συντεταγμένων από το backend (M-7 ή M-8). */
  async function handleRequest(event) {
    event.preventDefault();
    const parsed = parseCoordinates(coordinates);
    if (!parsed) {
      setRejected('Write the coordinates as "x , y" with values from 1 to 16.');
      return;
    }
    setBusy(true);
    try {
      const { data } = await validateInput(gameId, playerId, parsed.row, parsed.column);
      setApproved(data);
    } catch (err) {
      setRejected(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Μετά το "approved" ανοίγει το challenge (task #15).
  useEffect(() => {
    if (!approved) return undefined;
    const id = setTimeout(
      () => navigate(`/game/${gameId}/challenge/${approved.challengeId}`),
      APPROVED_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [approved, gameId, navigate]);

  function closeRejected() {
    setRejected(null);
    setCoordinates('');
    inputRef.current?.focus();
  }

  async function handleForfeit() {
    setBusy(true);
    try {
      await forfeit(gameId, playerId, false);
      reset();
      navigate('/');
    } catch (err) {
      setError(err);
      setConfirmForfeit(false);
    } finally {
      setBusy(false);
    }
  }

  if (!grid && !error) return <Loader text="Loading the game…" />;

  const selected = parseCoordinates(coordinates);
  const turnMessage = finished
    ? 'The game is over.'
    : isMyTurn
      ? 'Your time is running out, choose your action wisely!'
      : `Waiting for ${currentPlayer?.username ?? 'the next player'} to play…`;

  return (
    <div className="screen screen-game">
      <div className="game-top">
        <Logo size={56} />
        <div className="turn-info">
          {turn && !finished && <CountdownRing seconds={secondsLeft} total={TURN_SECONDS} size={88} />}
          <p className={`turn-message ${isMyTurn ? 'is-mine' : ''}`}>{turnMessage}</p>
        </div>
        <GameStatusBadge />
      </div>

      <ErrorMessage error={error} />
      {notInGame && (
        <div className="card notice">
          <p>You are no longer a player in this game.</p>
          <Link to="/" onClick={reset}>Back to Home</Link>
        </div>
      )}
      {finished && (
        <div className="card notice">
          <p>The game has finished. {players[0] ? `${players[0].username} leads with ${players[0].cells} cells.` : ''}</p>
          <Link to="/" onClick={reset}>Back to Home</Link>
        </div>
      )}

      {grid && (
        <div className="game-layout">
          <aside className="game-side">
            <Leaderboard players={players} grid={grid} playerId={playerId} currentPlayerId={turn?.currentPlayerId} />

            <form className="coordinates-form" onSubmit={handleRequest}>
              <label className="coordinates-box">
                <span>Enter cell coordinates</span>
                <input
                  ref={inputRef}
                  value={coordinates}
                  onChange={(e) => setCoordinates(e.target.value)}
                  placeholder="x value , y value"
                  disabled={!isMyTurn || busy}
                  inputMode="numeric"
                  autoComplete="off"
                />
              </label>
              <div className="coordinates-actions">
                <button type="submit" className="btn btn-primary btn-game" disabled={!isMyTurn || busy || !coordinates.trim()}>
                  Request cell
                </button>
              </div>
              {!isMyTurn && !finished && !notInGame && (
                <p className="muted small">You can request a cell when it is your turn.</p>
              )}
            </form>

            {!finished && !notInGame && (
              <button type="button" className="btn btn-forfeit" onClick={() => setConfirmForfeit(true)} disabled={busy}>
                forfeit current game
              </button>
            )}
          </aside>

          <GameGrid
            grid={grid}
            selectedCellId={selected ? toCellId(selected.row, selected.column) : null}
            onCellClick={isMyTurn ? (cell) => setCoordinates(`${cell.column} , ${cell.row}`) : undefined}
          />
        </div>
      )}

      {approved && (
        <div className="game-overlay" role="alertdialog" aria-modal="true" aria-labelledby="approved-title">
          <div className="overlay-card">
            <h2 id="approved-title">The coordinates have been approved.</h2>
            <p>
              The cell is yours for the taking.
              <br />
              Your challenge will soon commence…
            </p>
          </div>
        </div>
      )}

      {rejected && (
        <div className="game-overlay" role="alertdialog" aria-modal="true" aria-labelledby="rejected-title">
          <div className="overlay-card">
            <h2 id="rejected-title">
              The coordinates have <span className="not">NOT</span> been approved.
            </h2>
            <p className="overlay-reason">{rejected}</p>
            <p>
              Maybe try again in the future,
              <br />
              if you make it that far…
            </p>
            <button type="button" className="btn btn-overlay" onClick={closeRejected} autoFocus>
              Input new coordinates
            </button>
          </div>
        </div>
      )}

      {confirmForfeit && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="forfeit-title">
          <div className="modal modal-light">
            <h2 id="forfeit-title">Forfeit the game?</h2>
            <p>You will leave the game and lose all your cells.</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-soft" onClick={() => setConfirmForfeit(false)} disabled={busy}>
                Keep playing
              </button>
              <button type="button" className="btn btn-primary" onClick={handleForfeit} disabled={busy}>
                {busy ? 'Leaving…' : 'Forfeit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
