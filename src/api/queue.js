import client, { call } from './client.js';

/** GET /queue/players: παίκτες στην ουρά, μετρητής και υπόλοιπος χρόνος. */
export const getQueue = () => call(client.get('/queue/players'));

/** POST /queue/players: προσθήκη παίκτη στην ουρά. */
export const joinQueue = (playerId) => call(client.post('/queue/players', { playerId }));
