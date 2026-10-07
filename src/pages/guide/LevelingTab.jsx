import { Panel } from '../../components/ui.jsx';
import { stateAtLevel } from '../../lib/talents.js';
import LevelingRoute from '../LevelingRoute.jsx';

const CHECKPOINTS = [20, 30, 40, 50, 60];

export default function LevelingTab({ cls, spec, picks, nav }) {
  const checkpoints = CHECKPOINTS.map((lvl, i) => {
    const prev = i === 0 ? 9 : CHECKPOINTS[i - 1];
    const gained = picks.filter((p) => p.level > prev && p.level <= lvl);
    const unlocked = [...new Set(gained.map((p) => p.name))];
    return { lvl, totals: stateAtLevel(picks, lvl).treeTotals, unlocked };
  });

  return (
    <>
    <div className="grid-leveling">
      <Panel kicker="1 – 60" title="Leveling tips" className="span-2">
        <ul className="bullets big">
          {spec.leveling.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </Panel>

      <Panel kicker="Talents" title="Build checkpoints" className="span-2">
        <div className="checkpoints">
          {checkpoints.map((c) => (
            <div className="checkpoint" key={c.lvl}>
              <div className="cp-level">Level {c.lvl}</div>
              <div className="cp-split">
                {cls.trees.map((t) => (
                  <span key={t.id} style={{ '--t': t.color }} title={t.name}>{c.totals[t.id] || 0}</span>
                ))}
              </div>
              <ul>
                {c.unlocked.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Panel>

      <Panel kicker={cls.name} title="Class milestones" className="span-2">
        <ol className="timeline horizontal">
          {cls.milestones.map(([lvl, name, note]) => (
            <li key={lvl + name}>
              <span className="tl-level">{lvl}</span>
              <div>
                <strong>{name}</strong>
                {note && <span>{note}</span>}
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
    <LevelingRoute nav={nav} />
    </>
  );
}
