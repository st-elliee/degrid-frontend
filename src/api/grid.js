import client, { call } from './client.js';

/** GET /games/{gameId}/grid: ολόκληρο το grid (256 cells με cellId, row, column, owner, cellColour). */
export const getGrid = (gameId) => call(client.get(`/games/${gameId}/grid`));

/**
 * PUT /games/{gameId}/players/{playerId}/cells/{cellId}: ο παίκτης επιλέγει cell.
 * Η απάντηση περιέχει το challengeId που πρέπει να ολοκληρώσει.
 */
export const selectCell = (gameId, playerId, cellId) =>
  call(client.put(`/games/${gameId}/players/${playerId}/cells/${cellId}`));

/** PUT /games/{gameId}/grid/cells/{cellId}/colour: αλλαγή χρώματος cell (λειτουργία συστήματος). */
export const setCellColour = (gameId, cellId, cellColour) =>
  call(client.put(`/games/${gameId}/grid/cells/${cellId}/colour`, { cellColour }));
