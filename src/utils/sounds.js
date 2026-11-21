/**
 * Ήχοι του παιχνιδιού (user stories S-1 και S-4). Παράγονται με το Web Audio API, επομένως δεν χρειάζονται αρχεία ήχου.
 * - playSuccess(): ήχος επιτυχίας όταν ο παίκτης κερδίζει το κελί.
 * - playClown(): "clown sound" όταν η απάντηση είναι λάθος ή λήξει ο χρόνος.
 * - startWaitingMusic() / stopWaitingMusic(): μουσική όσο εμφανίζεται το μήνυμα "Not Enough Players in the Queue!".
 * Ο ήχος μπορεί να κλείσει από το εικονίδιο μουσικής (η επιλογή αποθηκεύεται στο localStorage).
 */

const MUTE_KEY = 'degrid.muted';

let context = null;
let musicTimer = null;
let musicGain = null;
const listeners = new Set();

/** Επιστρέφει true αν ο ήχος είναι κλειστός. */
export function isMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Ανοίγει ή κλείνει τον ήχο και ενημερώνει όσους παρακολουθούν την κατάσταση.
 * @param {boolean} muted Η νέα κατάσταση.
 */
export function setMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // Χωρίς localStorage η επιλογή ισχύει μόνο για αυτή τη φόρτωση.
  }
  if (muted) stopWaitingMusic();
  listeners.forEach((listener) => listener(muted));
}

/**
 * Εγγράφεται στις αλλαγές της κατάστασης ήχου.
 * @param {(muted: boolean) => void} listener Καλείται όταν αλλάξει η κατάσταση.
 * @returns {() => void} Συνάρτηση που ακυρώνει την εγγραφή.
 */
export function onMutedChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Δημιουργεί (ή συνεχίζει) το AudioContext. Επιστρέφει null αν ο browser δεν υποστηρίζει ήχο. */
function getContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!context) context = new AudioContextClass();
  if (context.state === 'suspended') context.resume().catch(() => {});
  return context;
}

/**
 * Παίζει μία νότα.
 * @param {AudioContext} ctx Το AudioContext.
 * @param {AudioNode} destination Ο κόμβος προορισμού.
 * @param {{freq: number, start: number, duration: number, type?: OscillatorType, volume?: number, endFreq?: number}} note Η νότα.
 */
function tone(ctx, destination, { freq, start, duration, type = 'sine', volume = 0.2, endFreq }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (endFreq) osc.frequency.linearRampToValueAtTime(endFreq, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Ήχος επιτυχίας: ανοδικό τρίο νοτών (ντο, μι, σολ, ντο). */
export function playSuccess() {
  if (isMuted()) return;
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tone(ctx, ctx.destination, { freq, start: t + i * 0.12, duration: 0.25, type: 'triangle', volume: 0.25 });
  });
}

/** "Clown sound": κατιούσες νότες τύπου "wah wah wah waaah". */
export function playClown() {
  if (isMuted()) return;
  const ctx = getContext();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [
    { freq: 392, endFreq: 370, start: t, duration: 0.28 },
    { freq: 370, endFreq: 349, start: t + 0.3, duration: 0.28 },
    { freq: 349, endFreq: 330, start: t + 0.6, duration: 0.28 },
    { freq: 311, endFreq: 196, start: t + 0.9, duration: 0.7 },
  ];
  notes.forEach((note) => tone(ctx, ctx.destination, { ...note, type: 'sawtooth', volume: 0.18 }));
}

/** Μία επανάληψη της μουσικής αναμονής. Διαρκεί 4 δευτερόλεπτα. */
const MELODY = [392, 440, 523.25, 440, 392, 330, 392, 0, 440, 523.25, 587.33, 523.25, 440, 392, 330, 0];
const BEAT = 0.25;

/** Ξεκινά τη μουσική αναμονής σε επανάληψη, αν δεν παίζει ήδη. */
export function startWaitingMusic() {
  if (isMuted() || musicTimer) return;
  const ctx = getContext();
  if (!ctx) return;
  musicGain = ctx.createGain();
  musicGain.gain.value = 0.5;
  musicGain.connect(ctx.destination);

  const playLoop = () => {
    const t = ctx.currentTime + 0.05;
    MELODY.forEach((freq, i) => {
      if (freq) tone(ctx, musicGain, { freq, start: t + i * BEAT, duration: BEAT * 0.9, type: 'triangle', volume: 0.22 });
    });
  };
  playLoop();
  musicTimer = setInterval(playLoop, MELODY.length * BEAT * 1000);
}

/** Σταματά τη μουσική αναμονής. */
export function stopWaitingMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
  if (musicGain) {
    musicGain.disconnect();
    musicGain = null;
  }
}
