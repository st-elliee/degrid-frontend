import { useEffect, useRef } from 'react';

/**
 * Καλεί περιοδικά μια συνάρτηση (π.χ. ανανέωση grid ή σειράς). Καθαρίζει το διάστημα στο unmount.
 * @param {() => (void|Promise<void>)} callback συνάρτηση που εκτελείται κάθε intervalMs
 * @param {number|null} intervalMs διάστημα σε ms (null = απενεργοποιημένο)
 * @param {boolean} [immediate=true] αν θα εκτελεστεί αμέσως στην πρώτη φόρτωση
 */
export function usePolling(callback, intervalMs, immediate = true) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (intervalMs == null) return undefined;
    if (immediate) saved.current();
    const id = setInterval(() => saved.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, immediate]);
}
