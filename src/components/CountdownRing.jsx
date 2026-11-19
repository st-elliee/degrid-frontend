/** Μορφοποιεί δευτερόλεπτα ως mm:ss. */
export function formatSeconds(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Κυκλικό χρονόμετρο (mockups M-3 και M-12): ο κύκλος αδειάζει όσο περνά ο χρόνος.
 * @param {{seconds: number, total: number, size?: number}} props
 */
export default function CountdownRing({ seconds, total, size = 96 }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? Math.min(1, Math.max(0, seconds / total)) : 0;
  return (
    <div className="countdown" style={{ width: size, height: size }} role="timer" aria-label="Remaining time">
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <circle cx="50" cy="50" r={radius} className="countdown-track" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="countdown-progress"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="countdown-text">{formatSeconds(seconds)}</span>
    </div>
  );
}
