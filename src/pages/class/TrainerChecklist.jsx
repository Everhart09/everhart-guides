import { useMemo, useState } from 'react';
import { classAbilities } from '../../data/talents/index.js';
import { indexTalents } from '../../lib/talents.js';
import { iconUrl } from '../../lib/icons.js';
import { Icon } from '../../components/icons.jsx';

const MAX_LEVEL = 60;
const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Every ability rank the class can train, with the level it unlocks — tick them off as you train. */
export default function TrainerChecklist({ cls }) {
  const levelKey = `everhart.trainer.${cls.id}.level`;
  const doneKey = `everhart.trainer.${cls.id}.done`;
  const [level, setLevel] = useState(() => read(levelKey, 10));
  const [done, setDone] = useState(() => new Set(read(doneKey, [])));
  const [filter, setFilter] = useState('soon'); // soon | todo | all

  const talentNames = useMemo(() => new Set(Object.keys(indexTalents(cls))), [cls]);
  // Talent abilities: rank 1 comes from the talent point, so only later (trainable) ranks are listed.
  const entries = useMemo(() => classAbilities(cls.id).flatMap(([name, , ranks = []]) => {
    const talent = talentNames.has(name);
    return ranks
      .map((lvl, i) => ({ key: `${name}#${i + 1}`, name, rank: i + 1, ranks: ranks.length, level: lvl, talent }))
      .filter((e) => !(talent && e.rank === 1));
  }), [cls, talentNames]);

  const saveDone = (next) => {
    setDone(next);
    write(doneKey, [...next]);
  };
  const toggle = (key) => {
    const next = new Set(done);
    if (next.has(key)) next.delete(key); else next.add(key);
    saveDone(next);
  };
  const setLvl = (v) => {
    const n = Math.max(1, Math.min(MAX_LEVEL, Number(v) || 1));
    setLevel(n);
    write(levelKey, n);
  };
  const markUpToLevel = () => saveDone(new Set([...done, ...entries.filter((e) => e.level <= level && !e.talent).map((e) => e.key)]));

  const available = entries.filter((e) => e.level <= level && !done.has(e.key) && !e.talent);
  const nextLevel = entries.filter((e) => e.level > level).reduce((m, e) => Math.min(m, e.level), Infinity);
  const nextUp = entries.filter((e) => e.level === nextLevel);
  const shown = entries.filter((e) => (filter === 'all' ? true : filter === 'todo' ? !done.has(e.key) : e.level <= level + 6 && !done.has(e.key)));
  const groups = shown.reduce((m, e) => ((m[e.level] ||= []).push(e), m), {});
  const trainedCount = entries.filter((e) => done.has(e.key)).length;

  return (
    <div className="trainer">
      <section className="panel trainer-head">
        <div className="trainer-level">
          <span className="pl-label">Your level</span>
          <div className="trainer-stepper">
            <button onClick={() => setLvl(level - 1)} aria-label="Level down"><Icon name="minus" size={14} /></button>
            <input type="number" min={1} max={MAX_LEVEL} value={level} onChange={(e) => setLvl(e.target.value)} aria-label="Your level" />
            <button onClick={() => setLvl(level + 1)} aria-label="Level up"><Icon name="plus" size={14} /></button>
          </div>
        </div>
        <div className="trainer-stat">
          <b className={available.length ? 'warn' : 'good'}>{available.length}</b>
          <span>{available.length ? 'ready to train now' : 'all caught up'}</span>
        </div>
        <div className="trainer-stat">
          <b>{nextUp.length || '—'}</b>
          <span>{Number.isFinite(nextLevel) ? `new at level ${nextLevel}` : 'nothing left to learn'}</span>
        </div>
        <div className="trainer-stat">
          <b>{trainedCount}</b>
          <span>of {entries.length} ranks trained</span>
        </div>
        <div className="trainer-actions">
          <button className="btn-ghost" onClick={markUpToLevel}>Mark all up to level {level} trained</button>
          <button className="btn-ghost danger" onClick={() => saveDone(new Set())} disabled={!done.size}>Reset</button>
        </div>
      </section>

      <div className="pn-chips trainer-filter">
        {[['soon', 'Now & next 6 levels'], ['todo', 'Everything not trained'], ['all', 'All ranks']].map(([id, label]) => (
          <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      <div className="trainer-groups">
        {Object.keys(groups).length === 0 && <p className="fine">Nothing to show — try another filter.</p>}
        {Object.entries(groups).sort((a, b) => a[0] - b[0]).map(([lvl, list]) => {
          const state = Number(lvl) <= level ? 'now' : Number(lvl) === nextLevel ? 'next' : 'later';
          return (
            <section key={lvl} className={`trainer-group ${state}`}>
              <header>
                <span className="tg-level">Level {lvl}</span>
                {state === 'now' && <span className="tg-tag now">Available</span>}
                {state === 'next' && <span className="tg-tag next">Next</span>}
              </header>
              <ul>
                {list.map((e) => (
                  <li key={e.key} className={done.has(e.key) ? 'done' : ''}>
                    <label>
                      <input type="checkbox" checked={done.has(e.key)} onChange={() => toggle(e.key)} />
                      {iconUrl(`ability/${cls.id}/${e.name}`)
                        ? <img src={iconUrl(`ability/${cls.id}/${e.name}`)} alt="" width={26} height={26} />
                        : <span className="tg-noicon" />}
                      <span className="tg-name">{e.name}</span>
                      {e.ranks > 1 && <span className="tg-rank">Rank {ROMAN[e.rank] ?? e.rank}</span>}
                      {e.talent && <span className="tg-talent" title="Requires the talent first">Talent</span>}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="fine">
        Ability levels come from the WoW Forever data. Abilities marked Talent need the talent first; later ranks are bought from your
        trainer. Your checklist is saved on this computer.
      </p>
    </div>
  );
}
