import Placeholder from '../components/Placeholder.jsx';

/** Οθόνη 2: Queue lobby (mockups M-2, M-4, M-5, M-6). Task #13. */
export default function QueuePage() {
  return (
    <Placeholder
      title="Queue lobby"
      task="#13"
      endpoints={['GET /queue/players', 'PUT /players/{playerId}/exit']}
    />
  );
}
