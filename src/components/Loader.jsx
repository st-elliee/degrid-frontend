/** Ένδειξη φόρτωσης. */
export default function Loader({ text = 'Φόρτωση…' }) {
  return <p className="loader" role="status">{text}</p>;
}
