import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import HomePage from '../pages/HomePage.jsx';
import QueuePage from '../pages/QueuePage.jsx';
import GameBoardPage from '../pages/GameBoardPage.jsx';
import ChallengePage from '../pages/ChallengePage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

/** Όλες οι διαδρομές της εφαρμογής. Κάθε οθόνη είναι ξεχωριστό αρχείο στο src/pages/. */
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/game/:gameId" element={<GameBoardPage />} />
        <Route path="/game/:gameId/challenge/:challengeId" element={<ChallengePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
