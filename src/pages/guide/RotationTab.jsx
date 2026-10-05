import { Panel, Rich } from '../../components/ui.jsx';
import LevelRotation from './LevelRotation.jsx';

export default function RotationTab({ cls, spec }) {
  const r = spec.rotation;
  return (
    <div className="grid-rotation">
      <LevelRotation cls={cls} spec={spec} />

      <div className="section-title span-2 rot-divider">
        <h2>Level 60 Rotation</h2>
        <span className="rule" />
      </div>

      <Panel kicker="Start strong" title="Opener" className="span-2">
        <ol className="opener">
          {r.opener.map((step, i) => (
            <li key={i}>
              <span className="step-n">{i + 1}</span>
              <span className="step-t"><Rich text={step} /></span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel kicker="Priority list" title="Single target">
        <ol className="prio">
          {r.single.map((s, i) => <li key={i}><span className="prio-n">{i + 1}</span><span><Rich text={s} /></span></li>)}
        </ol>
      </Panel>

      <Panel kicker="Multiple enemies" title="AoE & adds">
        <ol className="prio alt">
          {r.aoe.map((s, i) => <li key={i}><span className="prio-n">{i + 1}</span><span><Rich text={s} /></span></li>)}
        </ol>
      </Panel>

      <Panel kicker="Big buttons" title="Cooldowns & defensives">
        <ul className="bullets">
          {r.cooldowns.map((s, i) => <li key={i}><Rich text={s} /></li>)}
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
