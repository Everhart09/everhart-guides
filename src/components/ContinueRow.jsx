import { useMemo } from 'react';
import { usePrefs } from '../lib/prefs.js';
import { pageInfo } from '../lib/pages.js';
import { topPicks } from '../lib/classPicker.js';
import { QUESTIONS } from '../data/classPicker.js';
import { ClassEmblem, ProfessionEmblem } from './GameIcon.jsx';
import { Icon } from './icons.jsx';

const pickerAnswers = () => {
  try {
    const a = JSON.parse(localStorage.getItem('everhart.picker')) ?? {};
    return QUESTIONS.every((q) => a[q.id]) ? a : null;
  } catch {
    return null;
  }
};

function PageIcon({ info }) {
  if (info.classId) return <ClassEmblem id={info.classId} size={34} />;
  if (info.profId) return <ProfessionEmblem id={info.profId} size={34} />;
  return <span className="cr-glyph"><Icon name={info.dungeonId ? 'skull' : 'arrow'} size={18} /></span>;
}

/** Home page row: your recent pages, favorites and Class Picker result, so you can jump straight back in. */
export default function ContinueRow({ nav }) {
  const { recent = [], favorites = [] } = usePrefs();
  const pick = useMemo(() => { const a = pickerAnswers(); return a ? topPicks(a, 1)[0] : null; }, []);

  const cards = [];
  const seen = new Set();
  const add = (key, tag) => {
    if (seen.has(key)) return;
    const info = pageInfo(key);
    if (!info) return;
    seen.add(key);
    cards.push({ key, info, tag });
  };
  recent.slice(0, 4).forEach((k) => add(k, 'Recent'));
  favorites.forEach((k) => add(k, 'Favorite'));
  const shown = cards.slice(0, 6);

  if (!shown.length && !pick) return null;

  return (
    <section className="continue-row">
      <div className="section-title"><h2>Pick up where you left off</h2><span className="rule" /></div>
      <div className="cr-grid">
        {pick && (
          <button className="cr-card cr-pick" style={{ '--c': pick.cls.color }} onClick={() => nav.guide(pick.cls.id, pick.spec.id)}>
            <ClassEmblem id={pick.cls.id} size={34} />
            <span className="cr-text"><b>{pick.spec.name} {pick.cls.name}</b><em>Your Class Picker match · {pick.pct}%</em></span>
          </button>
        )}
        {shown.map(({ key, info, tag }) => (
          <button key={key} className="cr-card" style={{ '--c': info.color }} onClick={() => info.go(nav)}>
            <PageIcon info={info} />
            <span className="cr-text"><b>{info.label}</b><em>{tag} · {info.sub}</em></span>
          </button>
        ))}
      </div>
    </section>
  );
}
