/**
 * Βρίσκει το game στο οποίο συμμετέχει ο παίκτης (status "in_progress" και inGame = true).
 * @param {Array} games απάντηση του GET /games
 * @param {number} playerId
 * @returns {object|null}
 */
export function findGameOfPlayer(games, playerId) {
  return (
    games.find(
      (game) =>
        game.status === 'in_progress' &&
        game.players.some((p) => p.playerId === playerId && p.inGame),
    ) || null
  );
}

/** Υπάρχει έστω ένα game σε εξέλιξη; */
export function hasGameInProgress(games) {
  return games.some((game) => game.status === 'in_progress');
}
