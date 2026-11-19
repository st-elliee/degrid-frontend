/**
 * Απλό λογότυπο (grid 4x4 με τα κεντρικά cells τονισμένα). Για το πραγματικό λογότυπο του project
 * βάλε το αρχείο στο public/ και αντικατάστησε το περιεχόμενο με <img src="/logo.png" ... />.
 */
export default function Logo({ size = 96 }) {
  const cells = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 4; c += 1) {
      const centre = (r === 1 || r === 2) && (c === 1 || c === 2);
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={4 + c * 14}
          y={4 + r * 14}
          width="11"
          height="11"
          rx="2"
          fill={centre ? 'var(--accent)' : 'none'}
          stroke={centre ? 'var(--accent)' : '#fff'}
          strokeWidth="1.5"
        />,
      );
    }
  }
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Degrid">
      {cells}
    </svg>
  );
}
