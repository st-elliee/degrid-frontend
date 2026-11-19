/** Προσωρινή οθόνη μέχρι να υλοποιηθεί το αντίστοιχο task. */
export default function Placeholder({ title, task, endpoints = [] }) {
  return (
    <section className="card">
      <h1>{title}</h1>
      <p className="muted">Placeholder: θα υλοποιηθεί στο task {task}.</p>
      {endpoints.length > 0 && (
        <>
          <p>Endpoints που θα χρησιμοποιεί:</p>
          <ul>
            {endpoints.map((e) => (
              <li key={e}><code>{e}</code></li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
