import { useEffect, useState } from 'react';

/**
 * Αντίστροφη μέτρηση που ξεκινά από την αρχή κάθε φορά που αλλάζει το resetKey (π.χ. ο αριθμός σειράς).
 * @param {number} totalSeconds διάρκεια σε δευτερόλεπτα
 * @param {*} resetKey όταν αλλάζει, η μέτρηση ξαναρχίζει (null = σταματημένη)
 * @returns {number} υπόλοιπα δευτερόλεπτα (0 όταν λήξει)
 */
export function useCountdown(totalSeconds, resetKey) {
  const [deadline, setDeadline] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (resetKey == null) {
      setDeadline(null);
      return;
    }
    setDeadline(Date.now() + totalSeconds * 1000);
    setNow(Date.now());
  }, [resetKey, totalSeconds]);

  useEffect(() => {
    if (deadline == null) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [deadline]);

  if (deadline == null) return totalSeconds;
  return Math.max(0, (deadline - now) / 1000);
}
