# Degrid frontend

React (Vite) frontend του παιχνιδιού Degrid. Επικοινωνεί με το backend του project
([degrid-backend](https://github.com/st-elliee/degrid-backend)) μέσω HTTP (axios). Δεν υπάρχει login και δεν
προσομοιώνονται απαντήσεις: όλα τα δεδομένα έρχονται από το backend.

## Απαιτήσεις

- Node.js 22.12 ή νεότερο, με npm
- Το backend να τρέχει στο `http://127.0.0.1:3000` (δες το README του backend)

## Εγκατάσταση και εκκίνηση

```text
npm install
npm run dev
```

Η εφαρμογή ανοίγει στο `http://localhost:5173`. Για παραγωγικό build: `npm run build` και `npm run preview`.

Η διεύθυνση του backend ρυθμίζεται από το `.env` (αντίγραψε το `.env.example`):

```text
cp .env.example .env
```

| Μεταβλητή | Προεπιλογή | Χρήση |
|---|---|---|
| VITE_API_URL | http://127.0.0.1:3000 | Διεύθυνση του backend, χωρίς `/api` στο τέλος |

**Σημαντικό για τη δοκιμή:** το backend αδειάζει το mock game μετά από 300 δευτερόλεπτα αδράνειας και η σειρά
επιλογής διαρκεί 60 δευτερόλεπτα. Για άνετη δοκιμή, στο `.env` του **backend** βάλε
`TURN_SECONDS=3600` και `INACTIVITY_SECONDS=3600`.

## Οθόνες και endpoints

| # | Οθόνη | Αρχείο | Mockups | Endpoints |
|---|---|---|---|---|
| 1 | Home | `src/pages/HomePage.jsx` | M-1 | `POST /queue/players` |
| 2 | Queue lobby | `src/pages/QueuePage.jsx` | M-2, M-4, M-5, M-6 | `GET /queue/players`, `PUT /players/{playerId}/exit` |
| 3 | Game board | `src/pages/GameBoardPage.jsx` | M-3, M-7, M-8 | `GET /games/{gameId}/grid`, `GET /games/{gameId}/turn`, `GET /games/{gameId}/players`, `POST .../validate-input`, `PUT .../forfeit` |
| 4 | Challenge | `src/pages/ChallengePage.jsx` | M-13, M-9, M-10, M-11 | `GET /games/{gameId}/challenges/{challengeId}`, `POST .../challenge-answer` |
| 5 | Edit profile (modal) | `src/components/EditProfileModal.jsx` | M-2 | `GET /games/{gameId}/players/{playerId}`, `PUT .../profile` |

Οι οθόνες 1-5 είναι στην αρχή placeholders και υλοποιούνται στα tasks #13 (Home, Queue), #14 (Game board),
#15 (Challenge) και #16 (Edit profile).

## Δομή

```text
src/
  api/          axios client και μέθοδοι ανά resource (queue, games, players, grid, challenges, turns)
  components/   επαναχρησιμοποιήσιμα components (Layout, Loader, ErrorMessage, EditProfileModal)
  context/      PlayerContext: τρέχων παίκτης (playerId) και game (gameId)
  hooks/        usePlayer, usePolling
  pages/        μία οθόνη ανά αρχείο
  router/       διαδρομές (AppRoutes.jsx)
  styles/       μεταβλητές CSS
  utils/        σταθερές, validators, βοηθητικά για cells
```

## Κανόνες για την ομάδα

- Οι κλήσεις στο backend γίνονται **μόνο** από το `src/api/`. Οι οθόνες καλούν τις μεθόδους του (`import { getGrid } from '../api'`).
- Κάθε μέθοδος του API επιστρέφει `{ data, message }` και σε σφάλμα πετά `ApiError` με το μήνυμα του backend
  (`error.message`, `error.status`, `error.code`). Εμφάνισέ το με το component `ErrorMessage`.
- Ο παίκτης δεν κάνει login: το `playerId` επιλέγεται στο Home και κρατιέται στο `PlayerContext` (και στο `localStorage`).
  Χρήση: `const { playerId, gameId, setGameId } = usePlayer()`.
- Για περιοδική ανανέωση (grid, σειρά) υπάρχει το hook `usePolling(callback, ms)`. Για να μην αφαιρεθεί ο παίκτης λόγω
  αδράνειας, κάλεσε `getPlayer(gameId, playerId)` κάθε `HEARTBEAT_MS` (45 δευτ.).
- Το `PUT .../profile` στέλνεται ως `multipart/form-data` (το χειρίζεται η `updateProfile`).
- Το `GET .../challenges/{challengeId}` θέλει υποχρεωτικά το `playerId` (το χειρίζεται η `getChallenge`).
- `cellId = (row - 1) * 16 + column`. Βοηθητικά στο `src/utils/cells.js`.
