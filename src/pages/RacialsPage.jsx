import { useState } from 'react';
import { CLASSES, getClass } from '../data/classes/index.js';
import { RACES, RACIALS, RACIALS_AS_OF } from '../data/races.js';
import { iconByName } from '../lib/icons.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';
import BackButton from '../components/BackButton.jsx';

const KEY = 'everhart.racials';
const SIDE_NAMES = { A: 'Alliance', H: 'Horde' };
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
};
const write = (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
};

/** Every race's four racials in one place, with what Blizzard changed late in the beta. */
export default function RacialsPage({ nav }) {
  const [filters, setFilters] = useState(() => ({ side: 'all', classId: null, ...read() }));
  const set = (patch) => setFilters((f) => {
    const next = { ...f, ...patch };
    write(next);
    return next;
  });
  const cls = getClass(filters.classId);
  const races = RACES.filter((r) => (filters.side === 'all' || r.side === filters.side) && (!cls || r.classes.includes(cls.id)));
  const changedCount = Object.values(RACIALS).filter((r) => r.changed).length;

  return (
    <div className="page racials-page">
      <BackButton nav={nav} />
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="star" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Every race</div>
          <h1>Racials</h1>
          <p className="hero-desc">
            Every race in WoW Forever gets four racials: two you activate and two that are always on. Here they all are side by side,
            as of the {RACIALS_AS_OF}. Blizzard reworked {changedCount} of them late in the beta; those are marked with what changed.
          </p>
        </div>
      </header>

      <section className="panel rl-controls">
        <div className="seg" role="radiogroup" aria-label="Faction">
          {[['all', 'All races'], ['A', 'Alliance'], ['H', 'Horde']].map(([id, label]) => (
            <button key={id} role="radio" aria-checked={filters.side === id} className={filters.side === id ? 'active' : ''} onClick={() => set({ side: id })}>{label}</button>
          ))}
        </div>
        <div className="rl-classes" role="radiogroup" aria-label="Races that can play a class">
          <span className="rl-label">Can play</span>
          <button role="radio" aria-checked={!cls} className={!cls ? 'active' : ''} onClick={() => set({ classId: null })}>Any class</button>
          {CLASSES.map((c) => (
            <button key={c.id} role="radio" aria-checked={cls?.id === c.id} className={cls?.id === c.id ? 'active' : ''} style={{ '--c': c.color }}
              onClick={() => set({ classId: cls?.id === c.id ? null : c.id })} title={c.name}>
              <ClassEmblem id={c.id} size={22} />
            </button>
          ))}
        </div>
      </section>

      {cls && <p className="rl-note">Showing the {races.length} races that can be {cls.name}s. <button onClick={() => nav.races(cls.id, cls.specs[0].id)}>See which is best for each {cls.name} spec <Icon name="arrow" size={12} /></button></p>}

      <div className="rl-grid">
        {races.map((race) => (
          <article key={race.id} className={`panel rl-race side-${race.side}`}>
            <header className="rl-race-head">
              <div>
                <h3>{race.name}</h3>
                <div className="rc-badges">
                  <span className={`route-side side-${race.side}`}>{SIDE_NAMES[race.side]}</span>
                  {race.skyborne && <span className="chip">Upgrade pack</span>}
                </div>
              </div>
              <div className="rl-race-classes" aria-label="Classes">
                {race.classes.map((id) => (
                  <span key={id} className={race.newClasses.includes(id) ? 'new' : ''} title={`${getClass(id).name}${race.newClasses.includes(id) ? ' (new in Forever)' : ''}`}>
                    <ClassEmblem id={id} size={20} />
                  </span>
                ))}
              </div>
            </header>
            <p className="rc-blurb">{race.blurb}</p>
            <ul className="rl-racials">
              {race.racials.map((key) => {
                const r = RACIALS[key];
                return (
                  <li key={key}>
                    <img src={iconByName(r.icon)} alt="" width={36} height={36} />
                    <div>
                      <div className="rc-racial-head">
                        <b>{r.name}</b>
                        <span className={`rl-kind ${r.active ? 'active' : ''}`}>{r.active ? `Active${r.cd ? ` · ${r.cd}` : ''}` : 'Passive'}</span>
                      </div>
                      <p className="rl-text">{r.text}</p>
                      {r.changed && <p className="rl-changed"><span>Changed</span> {r.changed}</p>}
                      {r.source === 'notes' && <p className="rl-source">From Blizzard&apos;s patch notes; not in the game data on Wowhead yet.</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      <div className="rc-footer">
        <button className="btn-ghost" onClick={() => nav.races()}>Best race for your spec <Icon name="arrow" size={13} /></button>
        <p className="fine">
          Racial text follows the official WoW Forever spell tooltips, updated with Blizzard&apos;s final pre-launch racial changes
          from the beta development notes. Class icons with a green ring are race and class combinations new in Forever.
        </p>
      </div>
    </div>
  );
}
