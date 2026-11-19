import client, { call } from './client.js';

/** GET /games/{gameId}/players: παίκτες και cells τους (leaderboard). */
export const getPlayers = (gameId) => call(client.get(`/games/${gameId}/players`));

/** GET /games/{gameId}/players/{playerId}: στοιχεία ενός παίκτη. Λειτουργεί και ως heartbeat αδράνειας. */
export const getPlayer = (gameId, playerId) =>
  call(client.get(`/games/${gameId}/players/${playerId}`));

/**
 * PUT /games/{gameId}/players/{playerId}/profile: ενημέρωση προφίλ.
 * Στέλνεται ως multipart/form-data (όχι JSON).
 * @param {{username: string, language: string, avatar?: File}} profile
 */
export function updateProfile(gameId, playerId, { username, language, avatar }) {
  const form = new FormData();
  form.append('username', username);
  form.append('language', language);
  if (avatar) form.append('avatar', avatar);
  return call(client.put(`/games/${gameId}/players/${playerId}/profile`, form));
}

/** PUT /players/{playerId}/exit: αποχώρηση του παίκτη (ουρά ή game). */
export const exitPlayer = (playerId, exit = true) =>
  call(client.put(`/players/${playerId}/exit`, { exit }));

/** PUT /games/{gameId}/players/{playerId}/forfeit: ο παίκτης παραιτείται από το game. */
export const forfeit = (gameId, playerId, inGame = false) =>
  call(client.put(`/games/${gameId}/players/${playerId}/forfeit`, { inGame }));

/** PUT /games/{gameId}/players/{playerId}/rematch-vote: ψήφος για rematch. */
export const voteRematch = (gameId, playerId, rematchVote) =>
  call(client.put(`/games/${gameId}/players/${playerId}/rematch-vote`, { rematchVote }));

/** POST /games/{gameId}/players/{playerId}/popup: μήνυμα popup προς τον παίκτη. */
export const sendPopup = (gameId, playerId, message) =>
  call(client.post(`/games/${gameId}/players/${playerId}/popup`, { message }));

/** DELETE /games/{gameId}/players/{playerId}: διαγραφή παίκτη από το game. */
export const removePlayer = (gameId, playerId, params = {}) =>
  call(client.delete(`/games/${gameId}/players/${playerId}`, { params }));
