import axios from 'axios';
import { API_URL } from '../utils/constants.js';

/** Σφάλμα API με το μήνυμα του backend (πεδίο "message") και τον κωδικό (πεδίο "error"). */
export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/** Κοινός axios client για όλο το frontend. Οι κλήσεις στο backend γίνονται ΜΟΝΟ από το src/api/. */
const client = axios.create({ baseURL: API_URL, timeout: 10000 });

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
    const message =
      body?.message ||
      (error.response
        ? `Το αίτημα απέτυχε (${error.response.status}).`
        : 'Δεν είναι δυνατή η επικοινωνία με τον server. Τρέχει το backend;');
    return Promise.reject(new ApiError(message, error.response?.status, body?.error));
  },
);

/**
 * Εκτελεί ένα αίτημα και επιστρέφει το περιεχόμενο της απάντησης του backend.
 * Όλες οι απαντήσεις έχουν τη μορφή { success, data, error, message }.
 * @param {Promise} request axios promise
 * @returns {Promise<{data: *, message: string}>}
 */
export async function call(request) {
  const response = await request;
  return { data: response.data.data, message: response.data.message };
}

export default client;
