// Which talent build the guides show: the leveling build (10–59) or the level 60 build you respec into.
// One choice for every guide, remembered between sessions.
import { useEffect, useState } from 'react';

const KEY = 'everhart.buildMode';
const EVENT = 'everhart:buildmode';
export const BUILD_MODES = [
  { id: 'leveling', label: 'Leveling' },
  { id: 'endgame', label: 'Level 60' },
];

export function readBuildMode() {
  try {
    return localStorage.getItem(KEY) === 'endgame' ? 'endgame' : 'leveling';
  } catch {
    return 'leveling';
  }
}

/** [mode, setMode] shared by every component that uses it. */
export function useBuildMode() {
  const [mode, setModeState] = useState(readBuildMode);
  useEffect(() => {
    const sync = () => setModeState(readBuildMode());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const setMode = (m) => {
    try {
      localStorage.setItem(KEY, m);
    } catch {
      /* storage unavailable: the choice lasts for this session only */
    }
    setModeState(m);
    window.dispatchEvent(new Event(EVENT));
  };
  return [mode, setMode];
}
