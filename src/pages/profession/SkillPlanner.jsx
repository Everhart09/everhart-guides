import { useMemo, useState } from 'react';
import { RANKS, craftsFor } from '../../data/professions.js';
import { Icon } from '../../components/icons.jsx';

const MAX_SKILL = 300;

/** Materials still needed to go from `skill` to 300, prorating the step you're partway through. */
function remainingMaterials(steps, skill) {
  const totals = new Map();
  for (const step of steps) {
    if (!step.mats || step.to <= skill) continue;
    const start = Math.max(step.from, skill);
    const share = (step.to - start) / (step.to - step.from);
    const crafts = Math.ceil(craftsFor(step) * share);
    for (const [name, qty] of step.mats) totals.set(name, (totals.get(name) || 0) + qty * crafts);
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
}

export default function SkillPlanner({ prof }) {
  const [skill, setSkill] = useState(1);
  const isGathering = !prof.steps[0].mats;
  const rank = RANKS.find((r) => skill >= r.from && skill < r.to) ?? RANKS[RANKS.length - 1];
  const nextRank = RANKS.find((r) => r.from > skill && r.from === rank.to);
  const current = prof.steps.find((s) => skill >= s.from && skill < s.to) ?? prof.steps[prof.steps.length - 1];
  const mats = useMemo(() => (isGathering ? [] : remainingMaterials(prof.steps, skill)), [prof, skill, isGathering]);
  const pct = ((skill - 1) / (MAX_SKILL - 1)) * 100;
  const set = (v) => setSkill(Math.max(1, Math.min(MAX_SKILL, v)));

  return (
    <div className="planner">
      <section className="panel planner-head skill-head">
        <div className="planner-level">
          <span className="pl-label">Current skill</span>
          <span className="pl-value">{skill}</span>
          <span className="pl-points">{rank.name} <em>· cap {rank.to}</em></span>
        </div>

        <div className="planner-slider">
          <div className="slider-wrap">
            <div className="rank-bands">
              {RANKS.map((r) => (
                <button key={r.name} className={`band ${r === rank ? 'on' : ''}`}
                  style={{ left: `${((r.from - 1) / (MAX_SKILL - 1)) * 100}%`, width: `${((r.to - r.from) / (MAX_SKILL - 1)) * 100}%` }}
                  onClick={() => set(r.from)}>
                  {r.name}
                </button>
              ))}
            </div>
            <input type="range" min={1} max={MAX_SKILL} value={skill} className="level-range"
              style={{ '--pct': `${pct}%` }} aria-label="Profession skill"
              onChange={(e) => set(Number(e.target.value))} />
            <div className="slider-ticks">
              {[1, 75, 150, 225, 300].map((t) => (
                <button key={t} style={{ left: `${((t - 1) / (MAX_SKILL - 1)) * 100}%` }} className={t <= skill ? 'on' : ''} onClick={() => set(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="transport">
            <button onClick={() => set(current.from === skill ? skill - 1 : current.from)} title="Previous step"><Icon name="first" size={14} /></button>
            <button onClick={() => set(skill - 5)} title="-5 skill"><Icon name="minus" size={14} /></button>
            <button onClick={() => set(skill + 5)} title="+5 skill"><Icon name="plus" size={14} /></button>
            <button onClick={() => set(current.to)} title="Next step"><Icon name="last" size={14} /></button>
          </div>
        </div>

        <div className="planner-now">
          <span className="now-label">{isGathering ? 'Farm now' : 'Craft now'} · {current.from}–{current.to}</span>
          <strong style={{ color: 'var(--cls)' }}>{isGathering ? current.targets : current.item}</strong>
          <span className="now-sub">
            {isGathering ? current.zones.slice(0, 3).join(', ') : `≈ ${craftsFor(current)} crafts`}
            {nextRank && <> · train {nextRank.name} at {rank.to} (Lv {nextRank.level})</>}
          </span>
        </div>
      </section>

      <div className="skill-layout">
        <section className="panel">
          <header className="panel-head">
            <div>
              <div className="kicker">Step by step</div>
              <h3>{isGathering ? 'Where to gather' : 'What to craft'}</h3>
            </div>
            <span className="fine">Click a step to jump to it</span>
          </header>
          <ol className="steps">
            {prof.steps.map((s) => {
              const state = s === current ? 'current' : s.to <= skill ? 'past' : 'future';
              return (
                <li key={s.from}>
                  <button className={`step ${state}`} onClick={() => set(s.from)}>
                    <span className="step-range">{s.from}<i>–</i>{s.to}</span>
                    <span className="step-main">
                      <strong>{isGathering ? s.targets : s.item}</strong>
                      <span className="step-mats">
                        {isGathering
                          ? s.zones.map((z) => <span key={z} className="zone">{z}</span>)
                          : s.mats.map(([m, q]) => <span key={m} className="mat">{q}× {m}</span>)}
                      </span>
                    </span>
                    {!isGathering && <span className="step-crafts">×{craftsFor(s)}</span>}
                    {state === 'past' && <Icon name="check" size={14} className="step-done" />}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="panel shopping">
          {isGathering ? (
            <>
              <div className="kicker">Route</div>
              <h3>Best zones right now</h3>
              <ul className="zone-list">
                {current.zones.map((z) => <li key={z}><Icon name="arrow" size={12} />{z}</li>)}
              </ul>
              <p className="fine">Gather nodes that are orange or yellow for guaranteed or likely skill-ups. Grey nodes give nothing.</p>
            </>
          ) : (
            <>
              <div className="kicker">Shopping list</div>
              <h3>Materials to reach 300</h3>
              <p className="fine">From skill {skill}. Estimates; buy ~15% extra for unlucky skill-ups.</p>
              {mats.length ? (
                <ul className="mat-list">
                  {mats.map(([name, qty]) => (
                    <li key={name}><span>{name}</span><b>{qty.toLocaleString()}</b></li>
                  ))}
                </ul>
              ) : (
                <p className="done-text">Maxed out. Nothing left to buy.</p>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
