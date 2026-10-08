import { Panel, Rich } from '../../components/ui.jsx';
import LevelRotation from './LevelRotation.jsx';
import { rotationWhy } from '../../data/rotationExplain.js';

/** A rotation step with its one-line explanation underneath. */
function Step({ text, why }) {
  return (
    <span className="lr-step">
      <span className="lr-step-text"><Rich text={text} /></span>
      {why && <span className="lr-step-why">{why}</span>}
    </span>
  );
}

export default function RotationTab({ cls, spec }) {
  const r = spec.rotation;
  const why = (step) => rotationWhy(cls.id, spec.id, step);
  return (
    <div className="grid-rotation">
      <LevelRotation cls={cls} spec={spec} />

      <div className="section-title span-2 rot-divider">
        <h2>Level 60 Rotation</h2>
        <span className="rule" />
      </div>

      <Panel kicker="Start strong" title="Opener" className="span-2">
        <ol className="opener opener-explained">
          {r.opener.map((step, i) => (
            <li key={i}>
              <span className="step-n">{i + 1}</span>
              <Step text={step} why={why(step)} />
            </li>
          ))}
        </ol>
      </Panel>

      <Panel kicker="Priority list" title="Single target">
        <ol className="prio lr-prio">
          {r.single.map((s, i) => <li key={i}><span className="prio-n">{i + 1}</span><Step text={s} why={why(s)} /></li>)}
        </ol>
      </Panel>

      <Panel kicker="Multiple enemies" title="AoE & adds">
        <ol className="prio alt lr-prio">
          {r.aoe.map((s, i) => <li key={i}><span className="prio-n">{i + 1}</span><Step text={s} why={why(s)} /></li>)}
        </ol>
      </Panel>

      <Panel kicker="Big buttons" title="Cooldowns & defensives">
        <ul className="bullets explained">
          {r.cooldowns.map((s, i) => <li key={i}><Step text={s} why={why(s)} /></li>)}
        </ul>
      </Panel>

      <Panel kicker="Don't forget" title="Notes">
        <ul className="bullets">
          {r.notes.map((s, i) => <li key={i}><Rich text={s} /></li>)}
        </ul>
      </Panel>
    </div>
  );
}
