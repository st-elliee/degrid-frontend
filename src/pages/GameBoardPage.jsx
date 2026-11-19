import { useParams } from 'react-router-dom';
import Placeholder from '../components/Placeholder.jsx';

/** Οθόνη 3: Game board (mockups M-3, M-7, M-8). Task #14. */
export default function GameBoardPage() {
  const { gameId } = useParams();
  return (
    <Placeholder
      title={`Game board (game #${gameId})`}
      task="#14"
      endpoints={[
        'GET /games/{gameId}/grid',
        'GET /games/{gameId}/turn',
        'GET /games/{gameId}/players',
        'POST /games/{gameId}/players/{playerId}/validate-input',
        'PUT /games/{gameId}/players/{playerId}/forfeit',
      ]}
    />
  );
}
