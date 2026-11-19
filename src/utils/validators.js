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

/**
 * Διαβάζει συντεταγμένες της μορφής "x , y" (x = στήλη, y = γραμμή, όπως στα mockups M-7 και M-8).
 * @param {string} text
 * @returns {{row: number, column: number}|null} null αν η μορφή ή οι τιμές δεν είναι έγκυρες
 */
export function parseCoordinates(text) {
  const match = /^\s*(\d+)\s*[,\s]\s*(\d+)\s*$/.exec(text);
  if (!match) return null;
  const [column, row] = [Number(match[1]), Number(match[2])];
  if (!isValidCoordinate(column) || !isValidCoordinate(row)) return null;
  return { row, column };
}
