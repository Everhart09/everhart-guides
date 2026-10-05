import { Icon } from '../../components/icons.jsx';
import { Panel, Ratings } from '../../components/ui.jsx';
import { indexTalents, rankText } from '../../lib/talents.js';
import { talentIcon } from '../../lib/icons.js';
import { PROFESSIONS } from '../../data/professions.js';
import { ProfessionEmblem } from '../../components/GameIcon.jsx';

/** Profession pages mentioned in a free-text recommendation like "Mining + Blacksmithing". */
const linkedProfessions = (text) =>
  PROFESSIONS.filter((p) => text.toLowerCase().includes(p.name.toLowerCase()));

export default function OverviewTab({ cls, spec, picks, nav }) {
  const talents = indexTalents(cls);
  const signature = picks.filter((p) => p.max === 1);
  const treeName = (id) => cls.trees.find((t) => t.id === id);

  return (
    <div className="grid-overview">
      <Panel kicker="The short version" title={`Why play ${spec.name}?`} className="span-2">
        <p className="lead">{spec.summary}</p>
      </Panel>

      <Panel kicker="At a glance" title="Spec ratings">
        <Ratings ratings={spec.ratings} />
      </Panel>

      <Panel kicker="Strengths" title="Pros" className="pros-panel">
        <ul className="pc-list">
          {spec.pros.map((p) => <li key={p}><span className="pc-icon"><Icon name="check" size={13} /></span>{p}</li>)}
        </ul>
      </Panel>

      <Panel kicker="Weaknesses" title="Cons" className="cons-panel">
        <ul className="pc-list">
          {spec.cons.map((p) => <li key={p}><span className="pc-icon"><Icon name="x" size={13} /></span>{p}</li>)}
        </ul>
      </Panel>

      <Panel kicker="Build highlights" title="Signature talents"
        action={<button className="btn-ghost" onClick={() => nav.tab('talents')}>Open planner <Icon name="arrow" size={13} /></button>}>
        <ul className="sig-list">
          {signature.map((p) => {
            const t = treeName(p.tree);
            return (
              <li key={p.name} style={{ '--t': t.color }}>
                {talentIcon(cls.id, p.name)
                  ? <img className="sig-icon" src={talentIcon(cls.id, p.name)} alt="" width={34} height={34} />
                  : null}
                <span className="sig-level">Lv {p.level}</span>
                <div>
                  <strong>{p.name}</strong>
                  <span>{t.name} · {rankText(talents[p.name])}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel kicker="Character creation" title="Recommended races">
        <ul className="kv-list">
          {spec.races.map((r) => <li key={r.name}><strong>{r.name}</strong><span>{r.why}</span></li>)}
        </ul>
      </Panel>

      <Panel kicker="Crafting" title="Professions">
        <ul className="kv-list">
          {spec.professions.map((r) => (
            <li key={r.name}>
              <strong>{r.name}</strong>
              <span>{r.why}</span>
              <span className="prof-links">
                {linkedProfessions(r.name).map((p) => (
                  <button key={p.id} className="mini-pill link" onClick={() => nav.prof(p.id)}>
                    <ProfessionEmblem id={p.id} size={14} />{p.name} guide
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel kicker="Bring to raids" title="Consumables">
        <div className="chips">
          {spec.consumables.map((c) => <span key={c} className="chip">{c}</span>)}
        </div>
      </Panel>
    </div>
  );
}
