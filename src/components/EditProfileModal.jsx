import { useEffect, useRef, useState } from 'react';
import { getPlayer, updateProfile } from '../api';
import Avatar from './Avatar.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Loader from './Loader.jsx';
import { usePlayer } from '../hooks/usePlayer.js';
import { AVATAR_MAX_BYTES, AVATAR_TYPES, LANGUAGES } from '../utils/constants.js';
import '../styles/profile.css';

/**
 * Modal προβολής και επεξεργασίας προφίλ (οθόνη 5, task #16).
 * Endpoints: GET /games/{gameId}/players/{playerId}, PUT /games/{gameId}/players/{playerId}/profile (form-data).
 * Το backend δέχεται το προφίλ μόνο για παίκτη που ανήκει ήδη σε game.
 * @param {{open: boolean, gameId: number|null, playerId: number, onClose: () => void,
 *   onSaved?: (player: object) => void}} props
 */
export default function EditProfileModal({ open, gameId, playerId, onClose, onSaved }) {
  const { setLanguage } = usePlayer();
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState('');
  const [language, setLanguageValue] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  // Φόρτωση του προφίλ κάθε φορά που ανοίγει το modal.
  useEffect(() => {
    if (!open) return undefined;
    setError(null);
    setSaved(false);
    setAvatarFile(null);
    if (!gameId) return undefined;
    let cancelled = false;
    setLoading(true);
    getPlayer(gameId, playerId)
      .then(({ data }) => {
        if (cancelled) return;
        setPlayer(data);
        setUsername(data.username);
        setLanguageValue(data.language);
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [open, gameId, playerId]);

  // Προεπισκόπηση της νέας εικόνας πριν την αποθήκευση.
  useEffect(() => {
    if (!avatarFile) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  // Κλείσιμο με Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, saving, onClose]);

  if (!open) return null;

  function handleFile(event) {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    if (file && !AVATAR_TYPES.includes(file.type)) {
      setError('The avatar must be a PNG, JPEG, GIF or WebP image.');
      event.target.value = '';
      return;
    }
    if (file && file.size > AVATAR_MAX_BYTES) {
      setError('The avatar must be up to 1 MB.');
      event.target.value = '';
      return;
    }
    setAvatarFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const name = username.trim();
    const lang = language.trim();
    if (!name || !lang) {
      setError('Username and language are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data } = await updateProfile(gameId, playerId, { username: name, language: lang, avatar: avatarFile });
      setPlayer(data);
      setAvatarFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setLanguage(data.language);
      setSaved(true);
      onSaved?.(data);
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  const languageOptions = LANGUAGES.some((l) => l.code === language)
    ? LANGUAGES
    : [...LANGUAGES, { code: language, label: language }];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="modal modal-light profile-modal">
        <h2 id="profile-title">Edit profile</h2>

        {!gameId && <p>Your profile can be edited once the game starts.</p>}
        {loading && <Loader text="Loading your profile…" />}

        {gameId && player && !loading && (
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-avatar">
              <Avatar src={preview ?? player.avatar} name={username || player.username} size={96} />
              <label className="btn btn-outline profile-file">
                Change avatar
                <input ref={fileRef} type="file" accept={AVATAR_TYPES.join(',')} onChange={handleFile} hidden />
              </label>
              {avatarFile && <span className="small">{avatarFile.name}</span>}
            </div>

            <label className="profile-field">
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={100} required />
            </label>

            <label className="profile-field">
              Language
              <select value={language} onChange={(e) => setLanguageValue(e.target.value)}>
                {languageOptions.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <p className="profile-meta small">
              Player #{player.playerId} · {player.cells} cells · {player.isConnected ? 'connected' : 'disconnected'}
            </p>

            <ErrorMessage error={error} />
            {saved && !error && <p className="profile-saved" role="status">Profile saved.</p>}

            <div className="modal-actions">
              <button type="button" className="btn btn-soft" onClick={onClose} disabled={saving}>
                Close
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {(!gameId || !player || loading) && (
          <>
            <ErrorMessage error={error} />
            <div className="modal-actions">
              <button type="button" className="btn btn-soft" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
