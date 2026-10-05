import { useState } from 'react';
import { DUNGEONS, RAIDS } from '../data/dungeons/index.js';
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

  const shown = DUNGEONS.filter((d) => filter === 'all' ? true
    : filter === 'new' ? d.isNew
      : filter === 'fav' ? isFavorite(`dungeon:${d.id}`)
        : d.side === filter || d.side === 'C');
  const fits = (d) => level && level >= d.levels[0] - 2 && level <= d.levels[1];

  return (
    <div className="page dungeons-hub">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="skull" size={40} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Group content</div>
          <h1>Dungeons &amp; Raids</h1>
          <p className="hero-desc">
            Boss-by-boss guides for every dungeon in the beta, including Forever&apos;s new Hall of Thanes, Ruins of Lordaeron and
            Excavation Site, with abilities, role tips and loot from the Forever data.
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
        </label>
      </div>

      {shown.length === 0 && <p className="fine">No dungeons match. {filter === 'fav' && 'Star a dungeon on its page to add it here.'}</p>}
      <div className="dh-grid">
        {shown.map((d) => (
          <button key={d.id} className={`dh-card side-${d.side} ${d.status === 'later' ? 'later' : ''} ${fits(d) ? 'fits' : ''}`} onClick={() => nav.dungeon(d.id)}>
            <div className="dh-card-top">
              <span className="dh-levels">{d.levels[0]}–{d.levels[1]}</span>
              {d.isNew && <span className="chip chip-new">New</span>}
              {d.status === 'later' && <span className="chip">Not open yet</span>}
              {fits(d) && <span className="chip dh-fit">Your level</span>}
              {isFavorite(`dungeon:${d.id}`) && <Icon name="star" size={13} className="filled dh-star" />}
            </div>
            <h3>{d.name}</h3>
            <p>{d.location}</p>
            <div className="dh-card-foot">
              <span className={`route-side side-${d.side}`}>{SIDE_NAMES[d.side]}</span>
              <span>{d.bosses.length ? `${d.bosses.length} bosses` : 'Guide coming'}</span>
              {d.minLevel && <span>Opens at {d.minLevel}</span>}
            </div>
          </button>
        ))}
      </div>

      <section className="panel dh-raids">
        <div className="kicker">Raids</div>
        <h3 className="route-aside-title">Not in the beta yet</h3>
        <p className="lead small">
          The beta is capped at level 30, so raids aren&apos;t open. They&apos;re in WoW Forever&apos;s data and guides will be added once
          they can be tested.
        </p>
        <ul className="dh-raid-list">
          {RAIDS.map((r) => (
            <li key={r.id}>
              <Icon name="skull" size={16} />
              <span><b>{r.name}</b><em>{r.location}</em></span>
              <span className="dh-raid-size">{r.players}-player · level {r.levels[0]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
