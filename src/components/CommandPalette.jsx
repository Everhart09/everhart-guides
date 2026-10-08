import { useEffect, useMemo, useRef, useState } from 'react';
import { CLASSES } from '../data/classes/index.js';
import { PROFESSIONS, TYPE_LABELS } from '../data/professions.js';
import { Icon } from './icons.jsx';
import { ClassEmblem, ProfessionEmblem } from './GameIcon.jsx';
import { DUNGEONS } from '../data/dungeons/index.js';
import { isLaunched } from '../data/release.js';

const ENTRIES = [
  ...CLASSES.flatMap((c) => [
    { key: c.id, label: c.name, sub: 'Class overview', color: c.color, icon: <ClassEmblem id={c.id} size={22} />, go: (nav) => nav.cls(c.id) },
    ...c.specs.map((s) => ({
      key: `${c.id}/${s.id}`,
      label: `${s.name} ${c.name}`,
      sub: `${s.role} · ${s.tagline}`,
      color: c.color,
      icon: <ClassEmblem id={c.id} size={22} />,
      go: (nav) => nav.guide(c.id, s.id),
    })),
  ]),
  { key: 'professions', label: 'All Professions', sub: 'Profession hub · pairings · class fit', color: '#d9a659', icon: <ProfessionEmblem id="blacksmithing" size={22} />, go: (nav) => nav.professions() },
  ...PROFESSIONS.map((p) => ({
    key: `prof/${p.id}`,
    label: p.name,
    sub: `${TYPE_LABELS[p.type]} profession · ${p.tagline}`,
    color: '#d9a659',
    icon: <ProfessionEmblem id={p.id} size={22} />,
    go: (nav) => nav.prof(p.id),
  })),
  ...CLASSES.flatMap((c) => [
    { key: `${c.id}/changes`, label: `What's new: ${c.name}`, sub: 'Classic vs Forever talents and abilities', color: c.color, icon: <ClassEmblem id={c.id} size={22} />, go: (nav) => nav.cls(c.id, 'changes') },
    { key: `${c.id}/trainer`, label: `${c.name} trainer checklist`, sub: 'Every ability rank and the level you learn it', color: c.color, icon: <ClassEmblem id={c.id} size={22} />, go: (nav) => nav.cls(c.id, 'trainer') },
  ]),
  { key: 'picker', label: 'Class Picker', sub: 'Answer a few questions and get class suggestions', color: '#c9a45c', icon: <Icon name="star" size={16} />, go: (nav) => nav.picker() },
  { key: 'legacy', label: 'Legacy System', sub: 'Legacy points, perk calculator and challenges', color: '#c9a45c', icon: <Icon name="star" size={16} />, go: (nav) => nav.legacy() },
  { key: 'dungeons', label: 'Dungeons & Raids', sub: 'Boss guides, abilities and loot for every beta dungeon', color: '#c9a45c', icon: <Icon name="skull" size={16} />, go: (nav) => nav.dungeons() },
  ...DUNGEONS.map((d) => ({
    key: `dungeon/${d.id}`, label: d.name, sub: `Dungeon · levels ${d.levels[0]}–${d.levels[1]}${d.isNew ? ' · new in Forever' : ''} · ${d.bosses.map((b) => b.name).join(', ')}`,
    color: '#c9a45c', icon: <Icon name="skull" size={16} />, go: (nav) => nav.dungeon(d.id),
  })),
  { key: 'patch', label: isLaunched() ? 'Patch notes' : 'News: latest beta patch notes', sub: 'WoW Forever development notes from Blizzard', color: '#c9a45c', icon: <Icon name="check" size={16} />, go: (nav) => nav.patch() },
  ...(isLaunched() ? [] : [{ key: 'beta', label: 'Beta overview', sub: 'Beta schedule, level cap, dungeons, limitations and known issues', color: '#c9a45c', icon: <Icon name="check" size={16} />, go: (nav) => nav.beta() }]),
];

export default function CommandPalette({ nav, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return ENTRIES.filter((e) => terms.every((t) => `${e.label} ${e.sub}`.toLowerCase().includes(t))).slice(0, 12);
  }, [q]);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setSel(0), [q]);

  const choose = (entry) => {
    if (!entry) return;
    entry.go(nav);
    onClose();
  };

  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') choose(results[sel]);
  };

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette-input">
          <Icon name="search" size={16} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Try “frost mage”, “healer”, or “alchemy”…" />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette-results">
          {results.map((r, i) => (
            <li key={r.key}>
              <button className={i === sel ? 'sel' : ''} onMouseEnter={() => setSel(i)} onClick={() => choose(r)}
                style={{ '--c': r.color }}>
                <span className="palette-icon">{r.icon}</span>
                <span className="palette-text">
                  <span className="palette-label">{r.label}</span>
                  <span className="palette-sub">{r.sub}</span>
                </span>
                <Icon name="arrow" size={14} className="palette-go" />
              </button>
            </li>
          ))}
          {!results.length && <li className="palette-empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
