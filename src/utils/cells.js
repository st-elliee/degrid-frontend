import { CENTRE_CELLS, GRID_SIZE } from './constants.js';

/** Υπολογίζει το cellId από γραμμή και στήλη (1-16). */
export function toCellId(row, column) {
  return (row - 1) * GRID_SIZE + column;
}

/** Υπολογίζει γραμμή και στήλη από το cellId. */
export function fromCellId(cellId) {
  return { row: Math.floor((cellId - 1) / GRID_SIZE) + 1, column: ((cellId - 1) % GRID_SIZE) + 1 };
}

/** Είναι το cell ένα από τα τέσσερα κεντρικά; */
export function isCentreCell(cellId) {
  return CENTRE_CELLS.includes(cellId);
}

/** Μετατρέπει το cellColour (ακέραιος) σε CSS χρώμα. Το 0 σημαίνει "χωρίς χρώμα". */
export function colourToCss(cellColour) {
  if (!cellColour) return null;
  return `#${Number(cellColour).toString(16).padStart(6, '0')}`;
}

/** Το χρώμα (CSS) ενός παίκτη, όπως φαίνεται στα cells του στο grid. null αν δεν έχει cells. */
export function playerColour(grid, playerId) {
  const cell = grid?.cells.find((c) => c.owner === playerId && c.cellColour);
  return cell ? colourToCss(cell.cellColour) : null;
}
