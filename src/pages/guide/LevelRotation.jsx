import { useMemo } from 'react';
import { useSavedLevel } from '../../lib/useSavedLevel.js';
import { Icon } from '../../components/icons.jsx';
import { Rich } from '../../components/ui.jsx';
import { rotationStages } from '../../data/levelRotations.js';

const MAX_LEVEL = 60;
const abilitiesIn = (steps) => new Set(steps.flatMap((s) => s.text.split('**').filter((_, i) => i % 2)));

export default function LevelRotation({ cls, spec }) {
  const stages = useMemo(() => rotationStages(cls, spec), [cls, spec]);
  const [level, setLevel] = useSavedLevel(`rotation.${cls.id}/${spec.id}`, 1);

  const index = stages.reduce((found, s, i) => (s.level <= level ? i : found), 0);
  const stage = stages[index];
  const next = stages[index + 1];
  const known = index > 0 ? abilitiesIn(stages.slice(0, index).flatMap((s) => s.steps)) : new Set();
  const fresh = [...abilitiesIn(stage.steps)].filter((a) => !known.has(a));
  const pct = ((level - 1) / (MAX_LEVEL - 1)) * 100;
  const set = (v) => setLevel(Math.max(1, Math.min(MAX_LEVEL, v)));

  return (
    <section className="panel level-rotation span-2">
      <header className="panel-head">
        <div>
          <div className="kicker">Rotation by level</div>
          <h3>What to press at level {level}</h3>
        </div>
        <div className="lr-nav">
          <button onClick={() => set(stages[Math.max(0, index - 1)].level)} disabled={index === 0} title="Previous stage">
            <Icon name="first" size={13} />
          </button>
          <button onClick={() => next && set(next.level)} disabled={!next} title="Next stage">
            <Icon name="last" size={13} />
          </button>
        </div>
      </header>

      <div className="slider-wrap lr-slider">
        <div className="slider-markers">
          {stages.map((s, i) => (
            <button key={s.level + s.title} className={`marker ${i <= index ? 'on' : ''}`}
              style={{ left: `${((s.level - 1) / (MAX_LEVEL - 1)) * 100}%`, '--t': 'var(--cls)' }}
              onClick={() => set(s.level)} title={`Lv ${s.level} · ${s.title}`}>
              <span className="marker-label">Lv {s.level} · {s.title}</span>
            </button>
          ))}
        </div>
        <input type="range" min={1} max={MAX_LEVEL} value={level} className="level-range"
          style={{ '--pct': `${pct}%` }} aria-label="Character level for rotation"
          onChange={(e) => set(Number(e.target.value))} />
        <div className="slider-ticks">
          {[1, 10, 20, 30, 40, 50, 60].map((t) => (
            <button key={t} style={{ left: `${((t - 1) / (MAX_LEVEL - 1)) * 100}%` }} className={t <= level ? 'on' : ''} onClick={() => set(t)}>{t}</button>
          ))}
        </div>
      </div>

      <div className="lr-body" key={stage.level + stage.title}>
        <div className="lr-stage">
          <span className="lr-range">
            Levels {stage.level}–{next ? next.level - 1 : MAX_LEVEL}
          </span>
          <h4>{stage.title}</h4>
          {stage.summary && <p className="lr-summary">{stage.summary}</p>}
          {fresh.length > 0 && (
            <div className="lr-new">
              <span className="lr-new-label">New</span>
              {fresh.map((a) => <span key={a} className="ability">{a}</span>)}
            </div>
          )}
          {stage.tip && <p className="lr-tip"><Rich text={stage.tip} /></p>}
          {next && <p className="lr-next">Next change at level {next.level}: <b>{next.title}</b></p>}
        </div>
        <ol className="prio lr-prio">
          {stage.steps.map((s, i) => (
            <li key={s.text}>
              <span className="prio-n">{i + 1}</span>
              <span className="lr-step">
                <span className="lr-step-text"><Rich text={s.text} /></span>
                {s.why && <span className="lr-step-why">{s.why}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
