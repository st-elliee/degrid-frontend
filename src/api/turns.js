import client, { call } from './client.js';

/** GET /games/{gameId}/turn: currentPlayerId, turnNumber, turnOrder. */
export const getTurn = (gameId) => call(client.get(`/games/${gameId}/turn`));

/** PUT /games/{gameId}/turn-order: ορισμός σειράς παικτών. */
export const setTurnOrder = (gameId, turnOrder) =>
  call(client.put(`/games/${gameId}/turn-order`, { turnOrder }));
