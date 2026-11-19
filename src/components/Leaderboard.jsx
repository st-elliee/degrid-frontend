import Avatar from './Avatar.jsx';
import { playerColour } from '../utils/cells.js';

/**
 * Leaderboard του game (mockup M-3): avatar, όνομα και πλήθος cells κάθε παίκτη.
 * Το backend επιστρέφει τη λίστα ήδη ταξινομημένη (GET /games/{gameId}/players).
 * @param {{players: Array, grid: object|null, playerId: number, currentPlayerId?: number, actions?: import('react').ReactNode}} props
 */
export default function Leaderboard({ players, grid, playerId, currentPlayerId, actions }) {
  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <h2 id="leaderboard-title" className="leaderboard-title">Leaderboard</h2>
      <div className="leaderboard-table">
        <div className="leaderboard-head">
          <span>Player name</span>
          <span>cells</span>
        </div>
        <ul className="leaderboard-list">
          {players.map((p) => {
            const me = p.playerId === playerId;
            const colour = playerColour(grid, p.playerId);
            return (
              <li
                key={p.playerId}
                className={`leaderboard-row ${p.playerId === currentPlayerId ? 'is-turn' : ''}`}
                title={p.playerId === currentPlayerId ? 'Playing now' : undefined}
              >
                <Avatar src={p.avatar} name={p.username} size={44} />
                <span className="leaderboard-name">
                  {p.username}
                  {me ? ' (Me)' : ''}
                </span>
                {me && actions}
                <span className="leaderboard-cells" style={colour ? { color: colour } : undefined}>
                  {p.cells}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
