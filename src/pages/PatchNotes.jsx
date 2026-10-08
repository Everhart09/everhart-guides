import { useMemo, useState } from 'react';
import { PATCH } from '../data/patchNotes.js';
import { CLASSES, getClass } from '../data/classes/index.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';

const CHIP_LABELS = { general: 'General', pvp: 'PvP', professions: 'Professions', quests: 'Quests', ui: 'Interface', known: 'Known issues' };
const itemText =(it) => (typeof it === 'string' ? it : [it.t, it.note, ...(it.sub ?? [])].join(' '));

function Item({ it }) {
  if (typeof it === 'string') return <li>{it}</li>;
  return (
    <li>
      {it.t}
      {it.sub && <ul className="pn-sub">{it.sub.map((s) => <li key={s}>{s}</li>)}</ul>}
      {it.note && <blockquote className="dev-note"><b>Developers&apos; notes:</b> {it.note}</blockquote>}
    </li>
  );
}

export default function PatchNotes({ nav, embedded = false }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATCH.sections
      .map((sec) => ({
        ...sec,
        groups: sec.groups
          .filter((g) => filter === 'all' || filter === sec.id || filter === g.classId)
          .map((g) => ({ ...g, items: q ? g.items.filter((it) => itemText(it).toLowerCase().includes(q)) : g.items }))
          .filter((g) => g.items.length),
      }))
      .filter((sec) => sec.groups.length);
  }, [filter, query]);

  const count = sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.items.length, 0), 0);
  const chips = [
    { id: 'all', label: 'All' },
    ...PATCH.sections.filter((s) => s.id !== 'classes').map((s) => ({ id: s.id, label: CHIP_LABELS[s.id] ?? s.title })),
  ];

  return (
    <div className={embedded ? 'news-body' : 'page'}>
      {!embedded && (<>
      <header className="hero">
        <div className="hero-bg" />
        <img className="hero-logo" src="./brand/wow-forever-logo.png" alt="World of Warcraft: Forever" />
        <div className="hero-text">
          <div className="kicker">Latest beta patch · {PATCH.build}</div>
          <h1>WoW Forever Patch Notes</h1>
          <p className="hero-desc">
            Blizzard&apos;s official beta development notes for the most recent build, posted by {PATCH.author}.
            Filter by class or category, or search for a specific change.
          </p>
          <div className="hero-meta">
            <a className="btn-ghost" href={PATCH.source} target="_blank" rel="noreferrer">
              Open the official forum post <Icon name="arrow" size={13} />
            </a>
          </div>
        </div>
      </header>
      </>)}

      <div className="pn-highlights">
        {PATCH.highlights.map((h) => (
          <div key={h.label} className="pn-highlight">
            <span className="pn-hl-label">{h.label}</span>
            <strong>{h.value}</strong>
            <span>{h.text}</span>
          </div>
        ))}
      </div>

      <div className="pn-toolbar">
        <div className="pn-chips">
          {chips.map((c) => (
            <button key={c.id} className={filter === c.id ? 'active' : ''} onClick={() => setFilter(c.id)}>{c.label}</button>
          ))}
          <span className="pn-sep" />
          {CLASSES.map((c) => (
            <button key={c.id} className={`pn-class ${filter === c.id ? 'active' : ''}`} style={{ '--c': c.color }}
              onClick={() => setFilter(filter === c.id ? 'all' : c.id)} title={c.name}>
              <ClassEmblem id={c.id} size={18} />
            </button>
          ))}
        </div>
        <label className="pn-search">
          <Icon name="search" size={14} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search changes…" />
          <span className="pn-count">{count}</span>
        </label>
      </div>

      <div className="pn-sections">
        {sections.map((sec) => (
          <section key={sec.id} className="panel pn-section">
            <header className="panel-head"><h3>{sec.title}</h3></header>
            {sec.groups.map((g, i) => {
              const cls = g.classId && getClass(g.classId);
              return (
                <div key={g.title ?? g.classId ?? i} className="pn-group" style={cls ? { '--c': cls.color } : undefined}>
                  {cls ? (
                    <div className="pn-class-head">
                      <ClassEmblem id={cls.id} size={26} />
                      <h4>{cls.name}</h4>
                      <button className="btn-ghost" onClick={() => nav.cls(cls.id)}>{cls.name} guides <Icon name="arrow" size={12} /></button>
                    </div>
                  ) : g.title && <h4 className="pn-group-title">{g.title}</h4>}
                  <ul className="pn-items">{g.items.map((it) => <Item key={itemText(it)} it={it} />)}</ul>
                </div>
              );
            })}
          </section>
        ))}
        {!sections.length && <p className="muted-text pn-empty">No changes match “{query}”.</p>}

      </div>
    </div>
  );
}
