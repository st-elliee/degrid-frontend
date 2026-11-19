import client, { call } from './client.js';

/**
 * POST /games/{gameId}/players/{playerId}/validate-input: επιλογή cell με συντεταγμένες.
 * Αν είναι έγκυρο, η απάντηση περιέχει το cellId και το challengeId.
 */
export const validateInput = (gameId, playerId, row, column) =>
  call(client.post(`/games/${gameId}/players/${playerId}/validate-input`, { row, column }));

/** POST /games/{gameId}/players/{playerId}/inputcoordinates: αξιολόγηση ανταλλαγής (δεν μεταφέρει ιδιοκτησία). */
export const inputCoordinates = (gameId, playerId, row, column) =>
  call(client.post(`/games/${gameId}/players/${playerId}/inputcoordinates`, { row, column }));

/**
 * GET /games/{gameId}/challenges/{challengeId}?playerId=...: ερώτηση (question, options, timeLimit).
 * Το playerId είναι υποχρεωτικό. Η σωστή απάντηση δεν επιστρέφεται ποτέ.
 */
export const getChallenge = (gameId, challengeId, playerId) =>
  call(client.get(`/games/${gameId}/challenges/${challengeId}`, { params: { playerId } }));

/** POST /games/{gameId}/players/{playerId}/challenge-answer: υποβολή απάντησης (κείμενο). */
export const answerChallenge = (gameId, playerId, challengeId, answer) =>
  call(
    client.post(`/games/${gameId}/players/${playerId}/challenge-answer`, {
      challengeId,
      answer: String(answer),
    }),
  );
