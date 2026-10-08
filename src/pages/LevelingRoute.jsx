import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { mapUrl } from '../data/zoneMapsData.js';
import { BRACKETS, DUNGEONS, UNANNOUNCED, ZONES } from '../data/levelingRoute.js';
import { BETA } from '../data/foreverBeta.js';
import { isLaunched } from '../data/release.js';

// Before launch, the beta's level cap (kept current from the latest patch notes); after launch, no cap marker.
const BETA_CAP = isLaunched() ? null : BETA.current.levelCap;
import { Icon } from '../components/icons.jsx';
import { dungeonByName } from '../data/dungeons/index.js';

const MAX_LEVEL = 60;
const FACTION_KEY = 'everhart.route.faction';
const LEVEL_KEY = 'everhart.route.level';
const SIDE_NAMES = { A: 'Alliance', H: 'Horde', C: 'Contested' };

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

const fits = ([lo, hi], level) => level >= lo && level <= hi;
const visibleTo = (side, faction) => side === 'C' || side === faction;
// Dungeons inside a capital city can't be reached by the other faction.
const CAPITALS = ['Orgrimmar', 'Stormwind City', 'Undercity', 'Ironforge', 'Thunder Bluff', 'Darnassus'];
const canRun = (d, faction) => visibleTo(d.side, faction) || !CAPITALS.includes(d.where);


function MapViewer({ zone, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return createPortal(
    <div className="modal-backdrop map-viewer" onMouseDown={onClose}>
      <figure onMouseDown={(e) => e.stopPropagation()}>
        <img src={mapUrl(zone.zone)} alt={`Map of ${zone.name}`} />
        <figcaption>
          <b>{zone.name}</b> · levels {zone.levels[0]}–{zone.levels[1]}
          <button className="ub-close" onClick={onClose} title="Close (Esc)"><Icon name="x" size={16} /></button>
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}

function ZoneCard({ zone, level, selected, onSelect }) {
  const [lo, hi] = zone.levels;
  const pct = Math.min(100, Math.max(0, ((level - lo) / Math.max(1, hi - lo)) * 100));
  return (
    <article
      className={`route-card side-${zone.side} ${selected ? 'selected' : ''}`}
      role="button" tabIndex={0} title={`Show the ${zone.name} map`}
      onClick={onSelect} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
    >
      <header>
        <h4>{zone.name}</h4>
        {zone.isNew && <em className="badge new">New in Forever</em>}
      </header>
      <div className="route-levels">Levels {lo}–{hi}</div>
      <div className="route-meter"><i style={{ width: `${pct}%` }} /></div>
      <div className="route-meta">
        <span className={`route-side side-${zone.side}`}>{SIDE_NAMES[zone.side]}</span>
        {zone.note && <span>{zone.note}</span>}
      </div>
    </article>
  );
}

function DungeonRow({ d, level, nav }) {
  const locked = d.opens && level < d.opens;
  const guide = dungeonByName(d.name);
  return (
    <li className={`route-dungeon ${locked ? 'locked' : ''}`}>
      <span className="rd-levels">{d.levels[0]}–{d.levels[1]}</span>
      <div className="rd-text">
        <strong>{d.name}{d.isNew && <em className="badge new">New</em>}</strong>
        <span>{d.where}{d.side !== 'C' ? ` · ${SIDE_NAMES[d.side]} territory` : ''}{d.opens ? ` · opens at ${d.opens} in Forever` : ''}</span>
      </div>
      {guide && nav && (
        <button className="rd-guide" onClick={() => nav.dungeon(guide.id)} title={`Open the ${guide.name} guide`}>
          Guide <Icon name="chevron" size={12} />
        </button>
      )}
    </li>
  );
}

/** Zones and dungeons by level and faction. Shown in every spec guide's "Leveling & Route" tab. */
export default function LevelingRoute({ nav }) {
  const [faction, setFaction] = useState(() => read(FACTION_KEY, 'A'));
  const [level, setLevel] = useState(() => Number(read(LEVEL_KEY, 10)) || 10);
  const set = (v) => {
    const next = Math.max(1, Math.min(MAX_LEVEL, v));
    setLevel(next);
    write(LEVEL_KEY, String(next));
  };
  const pickFaction = (f) => {
    setFaction(f);
    write(FACTION_KEY, f);
  };

  const zonesNow = ZONES.filter((z) => visibleTo(z.side, faction) && fits(z.levels, level))
    .sort((a, b) => Math.abs((a.levels[0] + a.levels[1]) / 2 - level) - Math.abs((b.levels[0] + b.levels[1]) / 2 - level));
  const dungeonsNow = DUNGEONS.filter((d) => canRun(d, faction) && fits(d.levels, level));
  const upcoming = ZONES.filter((z) => visibleTo(z.side, faction) && z.levels[0] > level && z.levels[0] <= level + 6);
  const [picked, setPicked] = useState(null);
  const [zoomed, setZoomed] = useState(null);
  const mapZone = zonesNow.find((z) => z.name === picked) ?? zonesNow[0] ?? null;
  const bracket = BRACKETS.find((b) => level >= b.from && level <= b.to) ?? BRACKETS[BRACKETS.length - 1];
  const pct = ((level - 1) / (MAX_LEVEL - 1)) * 100;

  return (
    <div className="route-embedded">
      <section className="panel route-intro">
        <div>
          <div className="kicker">Leveling route</div>
          <h3>Where to level</h3>
          <p className="lead small">
            Pick your faction and level to see the best zones to quest in and the dungeons to run, including Forever&apos;s new
            zones and dungeons.
          </p>
        </div>
        <div className="faction-toggle" role="group" aria-label="Faction">
          {['A', 'H'].map((f) => (
            <button key={f} className={`faction-btn side-${f} ${faction === f ? 'active' : ''}`} onClick={() => pickFaction(f)}>
              {SIDE_NAMES[f]}
            </button>
          ))}
        </div>
      </section>

      <section className="panel route-slider-panel">
        <div className="planner-level">
          <span className="pl-label">Your level</span>
          <span className="pl-value">{level}</span>
          <span className="pl-points">{bracket.title}</span>
        </div>
        <div className="planner-slider">
          <div className="slider-wrap">
            {BETA_CAP && <div className="beta-cap-mark" style={{ left: `calc(11px + (100% - 22px) * ${(BETA_CAP - 1) / (MAX_LEVEL - 1)})` }} title="Beta level cap">
              <span>Beta cap {BETA_CAP}</span>
            </div>}
            <input type="range" min={1} max={MAX_LEVEL} value={level} className="level-range"
              style={{ '--pct': `${pct}%` }} aria-label="Your level" onChange={(e) => set(Number(e.target.value))} />
            <div className="slider-ticks">
              {[1, 10, 20, 30, 40, 50, 60].map((t) => (
                <button key={t} style={{ left: `${((t - 1) / (MAX_LEVEL - 1)) * 100}%` }} className={t <= level ? 'on' : ''} onClick={() => set(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="transport">
            <button onClick={() => set(level - 1)} title="Level down"><Icon name="minus" size={14} /></button>
            <button onClick={() => set(level + 1)} title="Level up"><Icon name="plus" size={14} /></button>
          </div>
        </div>
        <p className="route-tip">{bracket.tip}</p>
      </section>

      {BETA_CAP && level > BETA_CAP && (
        <p className="route-beta-note">The beta currently stops at level {BETA_CAP} — content past that can&apos;t be tested until launch.</p>
      )}

      <div className="route-layout">
        <section className="panel">
          <header className="panel-head">
            <div>
              <div className="kicker">Quest here</div>
              <h3>Zones for level {level}</h3>
            </div>
          </header>
          {zonesNow.length ? (
            <>
              <div className="route-grid">
                {zonesNow.map((z) => <ZoneCard key={z.name} zone={z} level={level} selected={z.name === mapZone?.name} onSelect={() => setPicked(z.name)} />)}
              </div>
              {mapZone?.zone && (
                <figure className="route-map">
                  <button className="route-map-img" onClick={() => setZoomed(mapZone)} title="View full size">
                    <img src={mapUrl(mapZone.zone)} alt={`Map of ${mapZone.name}`} loading="lazy" />
                    <span className="route-map-zoom"><Icon name="search" size={14} /> Full size</span>
                  </button>
                  <figcaption>
                    <b>{mapZone.name}</b> · levels {mapZone.levels[0]}–{mapZone.levels[1]}
                    {zonesNow.length > 1 && <span> · click a zone above to switch maps</span>}
                  </figcaption>
                </figure>
              )}
            </>
          ) : (
            <p className="fine">No zones listed for this level yet.</p>
          )}
          {upcoming.length > 0 && (
            <div className="route-upcoming">
              <span className="kicker">Coming up</span>
              <div className="chips">
                {upcoming.map((z) => (
                  <button key={z.name} className="chip" onClick={() => set(z.levels[0])}>
                    {z.name} <b>{z.levels[0]}+</b>{z.isNew && ' · new'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="panel">
          <div className="kicker">Group up</div>
          <h3 className="route-aside-title">Dungeons for level {level}</h3>
          {dungeonsNow.length ? (
            <ul className="route-dungeons">{dungeonsNow.map((d) => <DungeonRow key={d.name} d={d} level={level} nav={nav} />)}</ul>
          ) : (
            <p className="fine">No dungeons at this level — keep questing.</p>
          )}
          <p className="fine">Dungeons inside an enemy capital are hidden; for the rest, territory just tells you how easy they are to reach.</p>
        </aside>
      </div>

      <section className="panel">
        <header className="panel-head">
          <div>
            <div className="kicker">Full route · {SIDE_NAMES[faction]}</div>
            <h3>1 to 60 at a glance</h3>
          </div>
        </header>
        <ol className="route-timeline">
          {BRACKETS.map((b) => {
            const mid = Math.round((b.from + b.to) / 2);
            const zones = ZONES.filter((z) => visibleTo(z.side, faction) && z.levels[0] <= b.to && z.levels[1] >= b.from && z.levels[0] >= b.from - 6);
            const dungeons = DUNGEONS.filter((d) => canRun(d, faction) && d.levels[0] >= b.from && d.levels[0] <= b.to);
            return (
              <li key={b.from} className={level >= b.from && level <= b.to ? 'current' : ''}>
                <button className="rt-head" onClick={() => set(mid)}>
                  <span className="rt-range">{b.from}–{b.to}</span>
                  <strong>{b.title}</strong>
                </button>
                <div className="rt-body">
                  <div className="chips">
                    {zones.map((z) => <span key={z.name} className={`chip ${z.isNew ? 'chip-new' : ''}`}>{z.name}</span>)}
                  </div>
                  {dungeons.length > 0 && (
                    <div className="rt-dungeons">Dungeons: {dungeons.map((d) => d.name + (d.isNew ? ' (new)' : '')).join(', ')}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel">
        <header className="panel-head">
          <div>
            <div className="kicker">Coming in WoW Forever</div>
            <h3>New areas without announced levels</h3>
          </div>
        </header>
        <ul className="route-unannounced">
          {UNANNOUNCED.map((u) => (
            <li key={u.name}><em className="badge new">New</em><strong>{u.name}</strong><span>{u.kind} · {u.where}</span></li>
          ))}
        </ul>
        <p className="fine">These are in Wowhead&apos;s WoW Forever data but Blizzard hasn&apos;t published their level ranges yet. They&apos;ll be added to the route once announced.</p>
      </section>
      {zoomed && <MapViewer zone={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  );
}
