import client, { call } from './client.js';

/** GET /games: λίστα των games με τους παίκτες τους. */
export const listGames = () => call(client.get('/games'));

/** POST /games: δημιουργία game ({ players, language?, maxPlayers? }). */
export const createGame = (body) => call(client.post('/games', body));

/** POST /games/{gameId}/profiles: δημιουργία προφίλ παίκτη στο game. */
export const createProfile = (gameId, playerId) =>
  call(client.post(`/games/${gameId}/profiles`, { playerId }));
