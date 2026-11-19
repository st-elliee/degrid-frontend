import { Link } from 'react-router-dom';

/** Άγνωστη διαδρομή. */
export default function NotFoundPage() {
  return (
    <section className="card">
      <h1>Η σελίδα δεν βρέθηκε</h1>
      <Link to="/">Επιστροφή στην αρχική</Link>
    </section>
  );
}
