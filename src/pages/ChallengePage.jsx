import { useParams } from 'react-router-dom';
import Placeholder from '../components/Placeholder.jsx';

/** Οθόνη 4: Challenge (mockups M-13, M-9, M-10, M-11). Task #15. */
export default function ChallengePage() {
  const { gameId, challengeId } = useParams();
  return (
    <Placeholder
      title={`Challenge #${challengeId} (game #${gameId})`}
      task="#15"
      endpoints={[
        'GET /games/{gameId}/challenges/{challengeId}?playerId=...',
        'POST /games/{gameId}/players/{playerId}/challenge-answer',
      ]}
    />
  );
}
