# Degrid frontend

React (Vite) frontend του παιχνιδιού **Degrid**, ενός πολυπαικτικού στρατηγικού παιχνιδιού με σειρές σε grid 16×16.
Οι παίκτες μπαίνουν σε ουρά (4 έως 36), δημιουργείται game, και ο καθένας με τη σειρά του ζητά ένα cell, απαντά σε
ερώτηση μέσα σε χρονικό όριο και, αν απαντήσει σωστά, κερδίζει το cell. Στόχος είναι η κατάκτηση των τεσσάρων
κεντρικών cells.

Το frontend επικοινωνεί με το backend ([degrid-backend](https://github.com/st-elliee/degrid-backend)) μέσω HTTP
(axios). Δεν προσομοιώνονται απαντήσεις: όλα τα δεδομένα έρχονται από το backend.

## Απαιτήσεις

- Node.js 22.12 ή νεότερο, με npm.
- Το backend (degrid-backend) να τρέχει στο `http://127.0.0.1:3000`.

## Γρήγορη εκκίνηση

Χρειάζονται δύο τερματικά.

**1. Backend** (στο repo `degrid-backend`):

```text
npm install
printf "TURN_SECONDS=3600\nINACTIVITY_SECONDS=3600\n" > .env
npm start
```

Το `.env` είναι προαιρετικό αλλά **συνιστάται για δοκιμή**. Χωρίς αυτό η σειρά κάθε παίκτη διαρκεί 60 δευτερόλεπτα και
το backend αφαιρεί όποιον δεν κάνει καμία κίνηση μέσα σε 300 δευτερόλεπτα. Επειδή στη δοκιμή παίζει συνήθως μόνο ένας
παίκτης, οι υπόλοιποι αφαιρούνται και το mock game αδειάζει.

**2. Frontend** (σε αυτό το repo):

```text
npm install
cp .env.example .env
npm run dev
```

Η εφαρμογή ανοίγει στο `http://localhost:5173`. Για παραγωγικό build: `npm run build` και `npm run preview`.

Αν στο backend έβαλες `TURN_SECONDS=3600`, βάλε το ίδιο και στο `.env` του frontend (`VITE_TURN_SECONDS=3600`).

## Ρυθμίσεις (`.env`)

| Μεταβλητή | Προεπιλογή | Χρήση |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:3000` | Διεύθυνση του backend, χωρίς `/api` στο τέλος. |
| `VITE_TURN_SECONDS` | `60` | Διάρκεια σειράς **μόνο για το χρονόμετρο που εμφανίζεται** στο game board. Να είναι ίδια με το `TURN_SECONDS` του backend. Δεν επηρεάζει το backend. |

## Πώς δοκιμάζεται

### Ο παίκτης και η αρχική οθόνη

Δεν υπάρχει login. Στην αρχική οθόνη (Home) ο χρήστης διαλέγει από τη λίστα **Playing as** έναν από τους 48 παίκτες του
backend (IDs 1–48). Η επιλογή παίζει το ρόλο της σύνδεσης και αποθηκεύεται στο `localStorage` του browser. Κάθε browser
είναι ένας παίκτης.

### Αρχικά δεδομένα του backend

| Παίκτες | Κατάσταση | Τι δοκιμάζεται |
|---|---|---|
| 1–4 | Βρίσκονται ήδη στο game 1 (σε εξέλιξη) | Game board, challenge, προφίλ, forfeit. Στο Home εμφανίζεται το κουμπί **Back to game**. |
| 5, 6 | Βρίσκονται ήδη στην ουρά | Οθόνη ουράς. Το Join Game Queue δίνει σφάλμα 409 (είναι ήδη στην ουρά). |
| 7–48 | Ελεύθεροι | Είσοδος στην ουρά με **Join Game Queue**. |

Όλα τα δεδομένα είναι στη μνήμη του backend. Με κάθε επανεκκίνηση του backend επανέρχονται στην αρχική κατάσταση.

### Σενάριο 1: κανονική κίνηση (game 1)

1. Στο Home επίλεξε **Player 1** και πάτα **Back to game #1**.
2. Στο game board ο Player 1 έχει τη σειρά. Γράψε συντεταγμένες στη μορφή `x , y` (στήλη, γραμμή, τιμές 1–16), για
   παράδειγμα `4 , 6`, και πάτα **Request cell**. Εναλλακτικά κάνε κλικ σε ελεύθερο cell του grid.
3. Στο challenge διάλεξε μια απάντηση. Η σωστή απάντηση σου δίνει το cell (αυξάνεται ο αριθμός στο leaderboard). Η λάθος
   απάντηση ή η λήξη του χρόνου δεν δίνουν cell. Και στις τρεις περιπτώσεις η σειρά περνά στον επόμενο παίκτη.
4. Με **Edit** ή **Profile** ανοίγει το modal προφίλ: αλλαγή ονόματος, γλώσσας και προαιρετικά avatar (PNG, JPEG, GIF
   ή WebP έως 1 MB).
5. Το **forfeit current game** αφαιρεί τον παίκτη από το game. Δοκίμασέ το τελευταίο.

Για άκυρες συντεταγμένες (π.χ. `20 , 3`) εμφανίζεται το μήνυμα «The coordinates have NOT been approved».

### Σενάριο 2: δύο παίκτες ταυτόχρονα

Οι υπόλοιποι παίκτες του game παίζουν με τη σειρά τους. Για να παίξεις ως Player 2, επίλεξέ τον στο Home και πάτα **Back
to game**. Για να δεις δύο παίκτες ταυτόχρονα, άνοιξε το δεύτερο παίκτη σε **παράθυρο ανώνυμης περιήγησης**. Τα δύο
tabs του ίδιου παραθύρου μοιράζονται το `localStorage`, οπότε το ένα θα αλλάζει τον παίκτη του άλλου.

### Σενάριο 3: ουρά και δημιουργία game

1. Στο Home επίλεξε έναν ελεύθερο παίκτη (π.χ. **Player 9**) και πάτα **Join Game Queue**. Στην ουρά εμφανίζονται οι
   παίκτες 5, 6 και ο επιλεγμένος, με το «(Me)», ο μετρητής και ο χρόνος που απομένει.
2. Για να ξεκινήσει game χρειάζονται τουλάχιστον 4 παίκτες. Πρόσθεσε άλλους τρεις σε τρίτο τερματικό:

   ```text
   for i in 10 11 12; do curl -s -X POST http://127.0.0.1:3000/queue/players -H "Content-Type: application/json" -d "{\"playerId\":$i}"; done
   ```

3. Σε λίγα δευτερόλεπτα εμφανίζεται «THE GAME STARTS NOW!» και ο παίκτης μεταφέρεται στο game board του νέου game.
4. Με το **Exit** ο παίκτης φεύγει από την ουρά και επιστρέφει στο Home.

Στο νέο game οι παίκτες παίζουν με τη σειρά. Ο παίκτης που δεν έχει σειρά βλέπει «Waiting for … to play…» και το κουμπί
Request cell είναι απενεργοποιημένο.

Στο game που δημιουργείται από την ουρά, πρώτος παίζει ο παίκτης που μπήκε πρώτος στην ουρά (π.χ. ο 5).

### Γνωστοί περιορισμοί

- Τα endpoints του προφίλ του backend δουλεύουν μόνο για παίκτες που ανήκουν ήδη σε game. Γι' αυτό το **Edit profile**
  στην ουρά είναι ανενεργό μέχρι να δημιουργηθεί το game.
- Το endpoint ανταλλαγής cells (`inputcoordinates`) δεν μεταφέρει ιδιοκτησία και δεν έχει οθόνη στο frontend.
- Το avatar των παικτών προέρχεται από εξωτερική υπηρεσία εικόνων. Αν δεν φορτώσει, εμφανίζονται τα αρχικά του ονόματος.

## Οθόνες και endpoints

| # | Οθόνη | Αρχείο | Mockups | Endpoints του backend |
|---|---|---|---|---|
| 1 | Home | `src/pages/HomePage.jsx` | M-1 | `POST /queue/players`, `GET /games` |
| 2 | Queue lobby | `src/pages/QueuePage.jsx` | M-2, M-4, M-5, M-6 | `GET /queue/players`, `GET /games`, `PUT /players/{playerId}/exit` |
| 3 | Game board | `src/pages/GameBoardPage.jsx` | M-3, M-7, M-8 | `GET /games/{gameId}/grid`, `GET /games/{gameId}/turn`, `GET /games/{gameId}/players`, `GET /games`, `POST /games/{gameId}/players/{playerId}/validate-input`, `PUT /games/{gameId}/players/{playerId}/cells/{cellId}`, `PUT /games/{gameId}/players/{playerId}/forfeit` |
| 4 | Challenge | `src/pages/ChallengePage.jsx` | M-13, M-9, M-10, M-11 | `GET /games/{gameId}/challenges/{challengeId}`, `POST /games/{gameId}/players/{playerId}/challenge-answer` |
| 5 | Edit profile (modal) | `src/components/EditProfileModal.jsx` | M-2 | `GET /games/{gameId}/players/{playerId}`, `PUT /games/{gameId}/players/{playerId}/profile` |

Συνολικά το frontend χρησιμοποιεί 14 διαφορετικά endpoints του backend. Οι οθόνες υλοποιήθηκαν στα tasks #13 (Home,
Queue), #14 (Game board), #15 (Challenge) και #16 (Edit profile).

## Συμπεριφορά της εφαρμογής

- **Ανανέωση:** το game board ανανεώνει grid, σειρά και leaderboard κάθε 3 δευτερόλεπτα. Η ουρά ανανεώνεται κάθε 3
  δευτερόλεπτα.
- **Heartbeat:** το game board καλεί `GET /games/{gameId}/players/{playerId}` κάθε 45 δευτερόλεπτα, ώστε ο παίκτης που
  έχει ανοιχτό browser να μη θεωρηθεί αδρανής από το backend.
- **Σειρά:** το Request cell είναι ενεργό μόνο όταν είναι η σειρά του παίκτη. Στο challenge ο χρόνος μετρά αντίστροφα από
  το `timeLimit` που επιστρέφει το backend. Όταν λήξει, το frontend στέλνει κενή απάντηση για να λάβει το αποτέλεσμα.
- **Σφάλματα:** κάθε οθόνη δείχνει το μήνυμα που επιστρέφει το backend (400, 404, 409, `TURN_CONFLICT`) και κατάσταση
  φόρτωσης.
- **Έλεγχοι φορμών:** συντεταγμένες 1–16, υποχρεωτικό όνομα και γλώσσα στο προφίλ, τύπος και μέγεθος του avatar.

## Δομή

```text
src/
  api/          axios client και μέθοδοι ανά resource (queue, games, players, grid, challenges, turns)
  components/   Avatar, CountdownRing, EditProfileModal, ErrorMessage, GameGrid, GameStatusBadge, Layout,
                Leaderboard, Loader, Logo
  context/      PlayerContext: τρέχων παίκτης (playerId), game (gameId) και γλώσσα προφίλ
  hooks/        usePlayer, usePolling, useCountdown
  pages/        μία οθόνη ανά αρχείο
  router/       διαδρομές (AppRoutes.jsx)
  styles/       μεταβλητές CSS και στυλ ανά οθόνη
  utils/        σταθερές, validators, βοηθητικά για cells και games
```

## Κανόνες για την ομάδα

- Οι κλήσεις στο backend γίνονται **μόνο** από το `src/api/`. Οι οθόνες καλούν τις μεθόδους του
  (`import { getGrid } from '../api'`).
- Κάθε μέθοδος του API επιστρέφει `{ data, message }`. Σε σφάλμα πετά `ApiError` με το μήνυμα του backend
  (`error.message`, `error.status`, `error.code`), που εμφανίζεται με το component `ErrorMessage`.
- Ο παίκτης επιλέγεται στο Home και κρατιέται στο `PlayerContext` (και στο `localStorage`).
  Χρήση: `const { playerId, gameId, setGameId } = usePlayer()`.
- Το `PUT .../profile` στέλνεται ως `multipart/form-data` (το χειρίζεται η `updateProfile`).
- Το `GET .../challenges/{challengeId}` θέλει υποχρεωτικά το `playerId` (το χειρίζεται η `getChallenge`).
- `cellId = (row - 1) * 16 + column`. Βοηθητικά στο `src/utils/cells.js`.

## Branches

- `main`: η τελική έκδοση.
- Ένα branch ανά μέλος της ομάδας (`dev-elisavet`, `dev-sotiris`, `dev-anastasia`). Οι αλλαγές περνούν στο `main` με
  Pull Request.
