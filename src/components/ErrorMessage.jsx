/** Εμφανίζει το μήνυμα σφάλματος του backend (ή του δικτύου). Δεν εμφανίζει τίποτα αν δεν υπάρχει σφάλμα. */
export default function ErrorMessage({ error }) {
  if (!error) return null;
  const text = typeof error === 'string' ? error : error.message;
  return <p className="error" role="alert">{text}</p>;
}
