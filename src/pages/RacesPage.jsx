import { useState } from 'react';
import { CLASSES, getClass, getSpec } from '../data/classes/index.js';
import { MODES } from '../data/races.js';
import { bestBySide, rankRaces, standouts } from '../lib/races.js';
import { iconByName } from '../lib/icons.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';

const KEY = 'everhart.races';
const SIDE_NAMES = { A: 'Alliance', H: 'Horde' };
const TAG_LABELS = { key: 'Key', useful: 'Useful', minor: 'Minor', none: 'No real use' };
const MODE_WORDS = { pve: 'dungeons and raids', pvp: 'PvP', leveling: 'leveling' };
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

/** Best race for every spec: rankings per mode, with every racial explained for that spec. */
export default function RacesPage({ classId, specId, nav }) {
  const saved = read();
  const [state, setState] = useState(() => {
    const cls = getClass(classId) ?? getClass(saved.classId) ?? CLASSES[0];
    const spec = getSpec(cls, specId) ?? getSpec(cls, saved.specId) ?? cls.specs[0];
    return { classId: cls.id, specId: spec.id, mode: MODES.some(([m]) => m === saved.mode) ? saved.mode : 'pve', side: saved.side ?? 'both' };
  });
  const set = (patch) => setState((s) => {
    const next = { ...s, ...patch };
    write(next);
    return next;
  });
  const cls = getClass(state.classId);
  const spec = getSpec(cls, state.specId) ?? cls.specs[0];
  const ranked = rankRaces(cls, spec, state.mode);
  const best = bestBySide(cls, spec, state.mode);
  const shown = ranked.filter((r) => state.side === 'both' || r.race.side === state.side);
  const top = ranked[0]?.score || 1;

  return (
    <div className="page races-page" style={{ '--cls': cls.color }}>
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="shield" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Character creation</div>
          <h1>Best race for your spec</h1>
          <p className="hero-desc">
            Forever reworked every race: four racials each, weapon racials that give crit, no more resistances, and the new Skyborne.
            Pick a spec to see every race it can be, ranked, with what each racial does for that spec and why.
          </p>
        </div>
      </header>

      <section className="panel rc-controls">
        <div className="rc-classes" role="tablist" aria-label="Class">
          {CLASSES.map((c) => (
            <button key={c.id} role="tab" aria-selected={c.id === cls.id} className={c.id === cls.id ? 'active' : ''} style={{ '--c': c.color }}
              onClick={() => set({ classId: c.id, specId: c.specs[0].id })} title={c.name}>
              <ClassEmblem id={c.id} size={26} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
        <div className="rc-row">
          <div className="seg" role="radiogroup" aria-label="Spec">
            {cls.specs.map((s) => (
              <button key={s.id} role="radio" aria-checked={s.id === spec.id} className={s.id === spec.id ? 'active' : ''} onClick={() => set({ specId: s.id })}>{s.name}</button>
            ))}
          </div>
          <div className="seg" role="radiogroup" aria-label="What you'll do most">
            {MODES.map(([id, label]) => (
              <button key={id} role="radio" aria-checked={state.mode === id} className={state.mode === id ? 'active' : ''} onClick={() => set({ mode: id })}>{label}</button>
            ))}
          </div>
          <div className="seg" role="radiogroup" aria-label="Faction">
            {[['both', 'Both factions'], ['A', 'Alliance'], ['H', 'Horde']].map(([id, label]) => (
              <button key={id} role="radio" aria-checked={state.side === id} className={state.side === id ? 'active' : ''} onClick={() => set({ side: id })}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="rc-verdicts">
        {['A', 'H'].filter((side) => state.side === 'both' || state.side === side).map((side) => {
          const b = best[side];
          return (
            <article key={side} className={`panel rc-verdict side-${side}`}>
              <div className="kicker">Best {SIDE_NAMES[side]} {spec.name} {cls.name} for {MODE_WORDS[state.mode]}</div>
              {b ? (
                <>
                  <h3>{b.race.name}</h3>
                  <p>
                    {standouts(b) === 'small, mostly utility racials'
                      ? `No ${SIDE_NAMES[side]} race stands out for this; ${b.race.name} edges ahead on small, mostly utility racials.`
                      : <>Mainly for <b>{standouts(b)}</b>. {b.racials[0].why}</>}
                  </p>
                  <div className="rc-verdict-icons">
                    {b.racials.filter((r) => r.value >= 3).map((r) => (
                      <img key={r.key} src={iconByName(r.racial.icon)} alt="" width={28} height={28} title={r.racial.name} />
                    ))}
                  </div>
                </>
              ) : <p className="fine">{cls.name}s can&apos;t be {SIDE_NAMES[side]} in WoW Forever.</p>}
            </article>
          );
        })}
      </div>

      <div className="section-title"><h2>Every race, ranked</h2><span className="rule" /></div>
      <div className="rc-list">
        {shown.map((r) => (
          <article key={r.race.id} className={`panel rc-race side-${r.race.side}`}>
            <header className="rc-race-head">
              <span className="rc-rank">#{r.rank}</span>
              <div className="rc-race-title">
                <h3>{r.race.name}</h3>
                <div className="rc-badges">
                  <span className={`route-side side-${r.race.side}`}>{SIDE_NAMES[r.race.side]}</span>
                  {r.race.newClasses.includes(cls.id) && <span className="chip chip-new">New in Forever</span>}
                  {r.race.skyborne && <span className="chip">Upgrade pack</span>}
                </div>
              </div>
              <span className={`rc-tier tier-${r.tier.toLowerCase()}`}>{r.tier}</span>
            </header>
            <div className="rc-bar" title={`Score ${r.score}`}><i style={{ width: `${Math.max(4, (r.score / top) * 100)}%` }} /></div>
            <p className="rc-blurb">{r.race.blurb}</p>
            <ul className="rc-racials">
              {r.racials.map((x) => (
                <li key={x.key} className={`tag-${x.tag}`}>
                  <img src={iconByName(x.racial.icon)} alt="" width={34} height={34} />
                  <div>
                    <div className="rc-racial-head">
                      <b>{x.racial.name}</b>
                      <span className="rc-kind">{x.racial.active ? `Active${x.racial.cd ? ` · ${x.racial.cd}` : ''}` : 'Passive'}</span>
                      <span className={`rc-tag tag-${x.tag}`}>{TAG_LABELS[x.tag]}</span>
                    </div>
                    <p className="rc-why">{x.why}</p>
                    <p className="rc-text">In game: {x.racial.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="rc-footer">
        <button className="btn-ghost" onClick={() => nav.guide(cls.id, spec.id)}>Open the {spec.name} {cls.name} guide <Icon name="arrow" size={13} /></button>
        <p className="fine">
          Rankings weigh how much each racial helps this spec in the mode you picked: permanent bonuses count for more than short
          cooldowns, and weapon racials only count if the spec actually uses that weapon. Close scores mean a small difference, so
          pick the race you&apos;ll enjoy. Racial text and numbers come from the official WoW Forever spell data; race and class
          combinations follow Forever&apos;s character creation.
        </p>
      </div>
    </div>
  );
}
