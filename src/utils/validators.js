import { GRID_SIZE } from './constants.js';

/** Έγκυρη συντεταγμένη: ακέραιος 1-16. */
export function isValidCoordinate(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= GRID_SIZE;
}

/** Έγκυρο playerId: θετικός ακέραιος. */
export function isValidPlayerId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1;
}
