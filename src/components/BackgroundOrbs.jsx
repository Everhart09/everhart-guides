import { usePrefs } from '../lib/prefs.js';

// Orb colors per theme. Current: the WoW Forever logo's teal, bronze and cream. Horde: crimson, ember and dark red.
// Alliance: royal blue, gold and pale blue.
const PALETTES = {
  dark: ['#1d9ec4', '#c9a45c', '#0d5f86', '#a8743a', '#f0dcae', '#3fc2df'],
  horde: ['#b3261e', '#e0662a', '#6e1410', '#c8372d', '#f0a060', '#8a1c14'],
  alliance: ['#2f6fd6', '#e0b84a', '#163a7a', '#4a8ff0', '#f2dc9a', '#1d4fa8'],
};
const LAYOUT = [
  { size: 620, x: '8%', y: '6%', dur: 46, delay: 0 },
  { size: 520, x: '72%', y: '-4%', dur: 54, delay: -12 },
  { size: 700, x: '62%', y: '58%', dur: 62, delay: -30 },
  { size: 460, x: '-6%', y: '64%', dur: 50, delay: -20 },
  { size: 340, x: '40%', y: '30%', dur: 58, delay: -40 },
  { size: 300, x: '86%', y: '78%', dur: 44, delay: -8 },
];
const CREST = { horde: 'brand/horde.png', alliance: 'brand/alliance.png' };

/** Slow-drifting blurred orbs (and, on faction themes, the faction crest) behind the pages. Purely decorative. */
export default function BackgroundOrbs() {
  const { orbs, theme } = usePrefs();
  const colors = PALETTES[theme] ?? PALETTES.dark;
  const crest = CREST[theme];
  if (orbs === false && !crest) return null;
  return (
    <div className="bg-orbs" aria-hidden="true">
      {crest && <img key={theme} className="bg-crest" src={new URL(crest, document.baseURI).href} alt="" />}
      {orbs !== false && LAYOUT.map((o, i) => (
        <span
          key={`${theme}-${i}`}
          className={`orb orb-${i % 3}`}
          style={{ '--orb': colors[i], width: o.size, height: o.size, left: o.x, top: o.y, animationDuration: `${o.dur}s`, animationDelay: `${o.delay}s` }}
        />
      ))}
    </div>
  );
}
