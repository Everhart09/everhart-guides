import { useState } from 'react';
import { DUNGEONS } from '../data/dungeons/index.js';
import { isBetaOver, isLaunched, stage } from '../data/release.js';
import { Icon } from '../components/icons.jsx';
import { isFavorite, usePrefs } from '../lib/prefs.js';

const SIDE_NAMES = { A: 'Alliance', H: 'Horde', C: 'Contested' };
const FILTER_KEY = 'everhart.dungeons.filter';
const LEVEL_KEY = 'everhart.dungeons.level';
const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};

const FILTERS = [['all', 'All dungeons'], ['new', 'New in Forever'], ['A', 'Alliance side'], ['H', 'Horde side'], ['fav', 'Favorites']];

export default function DungeonsHub({ nav }) {
  usePrefs();
  const [filter, setFilter] = useState(() => read(FILTER_KEY, 'all'));
  const [level, setLevel] = useState(() => Number(read(LEVEL_KEY, 0)) || '');
  const pick = (f) => { setFilter(f); write(FILTER_KEY, f); };
  const changeLevel = (v) => {
    const n = v === '' ? '' : Math.max(1, Math.min(60, Number(v) || 1));
    setLevel(n);
    write(LEVEL_KEY, n === '' ? '' : String(n));
  };

  // A dungeon fits from two levels below its range up to the top of it.
  const fits = (d) => level >= d.levels[0] - 2 && level <= d.levels[1];
  const byFilter = DUNGEONS.filter((d) => filter === 'all' ? true
    : filter === 'new' ? d.isNew
      : filter === 'fav' ? isFavorite(`dungeon:${d.id}`)
        : d.side === filter || d.side === 'C');
  // With a level entered, only the dungeons for that level are shown; clearing it brings them all back.
  const shown = level ? byFilter.filter(fits) : byFilter;

  return (
    <div className="page dungeons-hub">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="skull" size={40} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Group content</div>
          <h1>Dungeons &amp; Raids</h1>
          <p className="hero-desc">
            Boss-by-boss guides for every dungeon {stage('in the beta', 'in WoW Forever')}, including Forever&apos;s new Hall of Thanes,
            Ruins of Lordaeron and Excavation Site, with abilities, role tips and loot from the Forever data.
          </p>
        </div>
      </header>

      <div className="dh-controls">
        <div className="pn-chips">
          {FILTERS.map(([id, label]) => (
            <button key={id} className={filter === id ? 'active' : ''} onClick={() => pick(id)}>{label}</button>
          ))}
        </div>
        <label className="dh-level">
          <span>Your level</span>
          <input type="number" min={1} max={60} value={level} placeholder="—" onChange={(e) => changeLevel(e.target.value)} />
          {level !== '' && (
            <button type="button" className="dh-level-clear" onClick={() => changeLevel('')} title="Clear your level and show every dungeon" aria-label="Clear level">
              <Icon name="x" size={12} />
            </button>
          )}
        </label>
      </div>

      {level !== '' && shown.length > 0 && (
        <p className="dh-level-note">
          Showing the {shown.length} {shown.length === 1 ? 'dungeon' : 'dungeons'} that fit level {level}.{' '}
          <button type="button" onClick={() => changeLevel('')}>Show all dungeons</button>
        </p>
      )}
      {shown.length === 0 && (
        <p className="fine">
          {level !== '' && byFilter.length > 0
            ? <>No dungeons fit level {level}{filter !== 'all' ? ' with this filter' : ''}. <button type="button" className="dh-link" onClick={() => changeLevel('')}>Show all dungeons</button></>
            : <>No dungeons match. {filter === 'fav' && 'Star a dungeon on its page to add it here.'}</>}
        </p>
      )}
      <div className="dh-grid">
        {shown.map((d) => (
          <button key={d.id} className={`dh-card side-${d.side} ${d.status === 'later' ? 'later' : ''}`} onClick={() => nav.dungeon(d.id)}>
            <div className="dh-card-top">
              <span className="dh-levels">{d.levels[0]}–{d.levels[1]}</span>
              {d.isNew && <span className="chip chip-new">New</span>}
              {d.status === 'later' && <span className="chip">Not open yet</span>}
              {isFavorite(`dungeon:${d.id}`) && <Icon name="star" size={13} className="filled dh-star" />}
            </div>
            <h3>{d.name}</h3>
            <p>{d.location}</p>
            <div className="dh-card-foot">
              <span className={`route-side side-${d.side}`}>{SIDE_NAMES[d.side]}</span>
              <span>{d.bosses.length ? `${d.bosses.length} bosses` : 'Guide coming'}</span>
              {d.minLevel && !isBetaOver() && <span>Opens at {d.minLevel} in the beta</span>}
            </div>
          </button>
        ))}
      </div>

      <p className="fine dh-raids-note">
        <Icon name="skull" size={13} /> Raid guides (Molten Core, Onyxia and beyond) will be added once raids open
        {isLaunched() ? ' and can be tested.' : isBetaOver() ? ' after launch.' : " after launch. The beta stops at a low level cap, so they can't be tested yet."}
      </p>
    </div>
  );
}
