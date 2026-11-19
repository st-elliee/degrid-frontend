/** Base URL του backend. Ρυθμίζεται από το .env (VITE_API_URL). */
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000';

/** Το grid είναι 16x16 και οι συντεταγμένες είναι 1-16. */
export const GRID_SIZE = 16;

/** Τα τέσσερα κεντρικά cells: (8,8), (8,9), (9,8), (9,9). */
export const CENTRE_CELLS = [120, 121, 136, 137];

/** Κλειδί του localStorage για τον τρέχοντα παίκτη. */
export const STORAGE_KEY = 'degrid.session';

/** Ο παίκτης που προτείνεται από προεπιλογή στο Home (οι 1-4 είναι ήδη στο game 1, ο 5-6 στην ουρά). */
export const DEFAULT_PLAYER_ID = 7;

/** Αριθμός mock παικτών του backend (IDs 1-48). */
export const PLAYER_COUNT = 48;

/** Χρόνοι ανανέωσης (ms). */
export const POLL_QUEUE_MS = 3000;
export const POLL_GAME_MS = 3000;
/** Το backend αφαιρεί παίκτη μετά από 300 δευτ. αδράνειας: κλήση ενός GET του παίκτη κάθε 45 δευτ. τον κρατά ενεργό. */
export const HEARTBEAT_MS = 45000;
