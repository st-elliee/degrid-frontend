import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext.jsx';
import AppRoutes from './router/AppRoutes.jsx';

/** Ριζικό component: router και context του παίκτη. */
export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </PlayerProvider>
  );
}
