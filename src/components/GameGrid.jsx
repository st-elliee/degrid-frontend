import { GRID_SIZE } from '../utils/constants.js';
import { colourToCss, isCentreCell } from '../utils/cells.js';

const NUMBERS = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);

/**
 * Το grid 16x16 (mockup M-3). Η γραμμή 16 είναι πάνω και η στήλη 1 αριστερά, με αρίθμηση στους άξονες.
 * Κάθε cell παίρνει το χρώμα του ιδιοκτήτη του (cellColour). Τα τέσσερα κεντρικά cells είναι ο στόχος.
 * @param {{grid: {cells: Array}, selectedCellId?: number|null, highlightCellId?: number|null,
 *   onCellClick?: (cell: object) => void, cellTitle?: (cell: object) => string}} props
 */
export default function GameGrid({ grid, selectedCellId = null, highlightCellId = null, onCellClick, cellTitle }) {
  return (
    <div className="game-grid" role="grid" aria-label="Game grid">
      {grid.cells.map((cell) => {
        const colour = colourToCss(cell.cellColour);
        const classes = ['grid-cell'];
        if (isCentreCell(cell.cellId) && cell.owner === null) classes.push('is-centre');
        if (cell.cellId === selectedCellId) classes.push('is-selected');
        if (cell.cellId === highlightCellId) classes.push('is-acquired');
        if (onCellClick) classes.push('is-clickable');
        return (
          <button
            key={cell.cellId}
            type="button"
            role="gridcell"
            className={classes.join(' ')}
            style={{
              gridRow: GRID_SIZE - cell.row + 1,
              gridColumn: cell.column + 1,
              ...(colour ? { background: colour } : {}),
            }}
            title={cellTitle ? cellTitle(cell) : `(${cell.column}, ${cell.row})`}
            onClick={onCellClick ? () => onCellClick(cell) : undefined}
          />
        );
      })}

      {/* Τα τέσσερα κεντρικά cells: (8,8), (8,9), (9,8), (9,9). */}
      <span className="grid-centre-icon" aria-hidden="true" style={{ gridRow: '8 / span 2', gridColumn: '9 / span 2' }}>
        🎓
      </span>

      {NUMBERS.map((n) => (
        <span key={`r${n}`} className="grid-label" style={{ gridRow: GRID_SIZE - n + 1, gridColumn: 1 }}>
          {n}
        </span>
      ))}
      {NUMBERS.map((n) => (
        <span key={`c${n}`} className="grid-label" style={{ gridRow: GRID_SIZE + 1, gridColumn: n + 1 }}>
          {n}
        </span>
      ))}
    </div>
  );
}
