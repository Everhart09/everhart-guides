// A level slider value that's remembered per page, so leaving and coming back keeps it where you left it.
import { useCallback, useEffect, useRef, useState } from 'react';

const read = (key, fallback) => {
  try {
    const v = Number(localStorage.getItem(key));
    return Number.isFinite(v) && v >= 1 ? v : fallback;
  } catch {
    return fallback;
  }
};

/** Like useState for a level, saved under `everhart.level.<key>`. Starts at `fallback` (level 1) the first time. */
export function useSavedLevel(key, fallback = 1) {
  const storageKey = `everhart.level.${key}`;
  const [level, setLevelState] = useState(() => read(storageKey, fallback));

  // Switching to another spec in the same component loads that spec's saved level.
  const lastKey = useRef(storageKey);
  useEffect(() => {
    if (lastKey.current !== storageKey) {
      lastKey.current = storageKey;
      setLevelState(read(storageKey, fallback));
    }
  }, [storageKey, fallback]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(level));
    } catch {
      /* storage unavailable */
    }
  }, [storageKey, level]);

  const setLevel = useCallback((v) => setLevelState((prev) => (typeof v === 'function' ? v(prev) : v)), []);
  return [level, setLevel];
}
