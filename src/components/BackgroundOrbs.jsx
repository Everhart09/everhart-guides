import { usePrefs } from '../lib/prefs.js';

// Colors from the WoW Forever logo: the teal-blue center, the bronze and gold frame, and the cream lettering.
const ORBS = [
  { color: '#1d9ec4', size: 620, x: '8%', y: '6%', dur: 46, delay: 0 },
  { color: '#c9a45c', size: 520, x: '72%', y: '-4%', dur: 54, delay: -12 },
  { color: '#0d5f86', size: 700, x: '62%', y: '58%', dur: 62, delay: -30 },
  { color: '#a8743a', size: 460, x: '-6%', y: '64%', dur: 50, delay: -20 },
  { color: '#f0dcae', size: 340, x: '40%', y: '30%', dur: 58, delay: -40 },
  { color: '#3fc2df', size: 300, x: '86%', y: '78%', dur: 44, delay: -8 },
];

/** Slow-drifting blurred orbs behind the page content (not the sidebar). Purely decorative. */
export default function BackgroundOrbs() {
  const { orbs } = usePrefs();
  if (orbs === false) return null;
  return (
    <div className="bg-orbs" aria-hidden="true">
      {ORBS.map((o, i) => (
        <span
          key={i}
          className={`orb orb-${i % 3}`}
          style={{ '--orb': o.color, width: o.size, height: o.size, left: o.x, top: o.y, animationDuration: `${o.dur}s`, animationDelay: `${o.delay}s` }}
        />
      ))}
    </div>
  );
}
