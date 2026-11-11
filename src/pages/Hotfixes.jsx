import { useEffect, useMemo, useState } from 'react';
import BUNDLED from '../data/hotfixes.json';
import { CLASSES, getClass } from '../data/classes/index.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';
import { PatchItem, itemText } from './PatchNotes.jsx';

const SEEN_KEY = 'everhart.hotfixes.seen';
const readSeen = () => { try { return localStorage.getItem(SEEN_KEY) ?? ''; } catch { return ''; } };
const writeSeen = (v) => { try { localStorage.setItem(SEEN_KEY, v); } catch { /* storage unavailable */ } };
const CHIPS = [['all', 'All'], ['general', 'General'], ['professions', 'Professions'], ['quests', 'Quests'], ['pvp', 'PvP'], ['other', 'Other']];
const KNOWN = ['general', 'classes', 'professions', 'quests', 'pvp'];

/** Blizzard's WoW Forever hotfixes, one panel per day, newest first. Fetched fresh when the tab opens. */
export default function Hotfixes({ nav }) {
  const [data, setData] = useState(BUNDLED);
  const [status, setStatus] = useState({ loading: !!globalThis.everhart?.getHotfixes });
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [seen] = useState(readSeen); // days newer than this were posted since the last visit

  const load = async (force) => {
    const get = globalThis.everhart?.getHotfixes;
    if (!get) return;
    setStatus({ loading: true });
    const res = await get(force);
    if (res?.data?.days?.length) setData(res.data);
    setStatus({ error: res?.error ?? null });
  };
  useEffect(() => { load(false); }, []);
  useEffect(() => { if (data.days[0]) writeSeen(data.days[0].date); }, [data]);

  const days = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.days.map((day) => ({
      ...day,
      sections: day.sections
        .map((sec) => ({
          ...sec,
          groups: sec.groups
            .filter((g) => filter === 'all' || filter === sec.id || filter === g.classId || (filter === 'other' && !KNOWN.includes(sec.id)))
            .map((g) => ({ ...g, items: q ? g.items.filter((it) => itemText(it).toLowerCase().includes(q)) : g.items }))
            .filter((g) => g.items.length),
        }))
        .filter((sec) => sec.groups.length),
    })).filter((day) => day.sections.length);
  }, [data, filter, query]);

  const count = days.reduce((n, d) => n + d.sections.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0), 0), 0);

  return (
    <div className="news-body">
      <div className="hf-bar">
        <span className="muted">
          {status.loading ? 'Checking Blizzard for new hotfixes…' : status.error ? `Couldn't reach the forums (${status.error}); showing the last saved hotfixes.` : `${data.days.length} days of hotfixes · checked ${new Date(data.fetchedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
        </span>
        {globalThis.everhart?.getHotfixes && <button className="btn-ghost" disabled={status.loading} onClick={() => load(true)}>Check now</button>}
        <a className="btn-ghost" href={data.source} target="_blank" rel="noreferrer">Forum thread <Icon name="arrow" size={12} /></a>
      </div>

      <div className="pn-toolbar">
        <div className="pn-chips">
          {CHIPS.map(([id, label]) => (
            <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>
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
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hotfixes…" />
          <span className="pn-count">{count}</span>
        </label>
      </div>

      {days.map((day) => (
        <section key={day.date} className="hf-day">
          <header className="hf-day-head">
            <h2>{day.title}</h2>
            {seen && day.date > seen && <span className="hf-new">New</span>}
            <span className="rule" />
            <a className="btn-ghost" href={day.source} target="_blank" rel="noreferrer">Official post <Icon name="arrow" size={12} /></a>
          </header>
          <div className="pn-sections">
            {day.sections.map((sec) => (
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
                      <ul className="pn-items">{g.items.map((it) => <PatchItem key={itemText(it)} it={it} />)}</ul>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        </section>
      ))}
      {!days.length && <p className="muted-text pn-empty">No hotfixes match{query ? ` “${query}”` : ' this filter'}.</p>}
    </div>
  );
}
