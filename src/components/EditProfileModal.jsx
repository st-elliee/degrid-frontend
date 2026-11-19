/**
 * Modal επεξεργασίας προφίλ (οθόνη 5, task #16): ΠΡΟΣΩΡΙΝΟ placeholder.
 * Endpoints: GET /games/{gameId}/players/{playerId}, PUT /games/{gameId}/players/{playerId}/profile (form-data).
 * Η υλοποίηση χρησιμοποιεί τα getPlayer και updateProfile από src/api/players.js.
 */
export default function EditProfileModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>Επεξεργασία προφίλ</h2>
        <p className="muted">Placeholder: θα υλοποιηθεί στο task #16.</p>
        <button type="button" onClick={onClose}>Κλείσιμο</button>
      </div>
    </div>
  );
}
