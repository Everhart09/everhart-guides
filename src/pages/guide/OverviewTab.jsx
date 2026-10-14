import { Icon } from '../../components/icons.jsx';
import { Panel, Ratings } from '../../components/ui.jsx';
import { indexTalents, rankText } from '../../lib/talents.js';
import { talentIcon } from '../../lib/icons.js';
import { PROFESSIONS } from '../../data/professions.js';
import { ProfessionEmblem } from '../../components/GameIcon.jsx';
import { bestBySide, standouts } from '../../lib/races.js';

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

      <Panel kicker="Character creation" title="Best races">
        <BestRaces cls={cls} spec={spec} nav={nav} />
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

/** Best Alliance and Horde race for dungeons & raids, plus the PvP pick when it differs. Full rankings live on the Best Race page. */
function BestRaces({ cls, spec, nav }) {
  const pve = bestBySide(cls, spec, 'pve');
  const pvp = bestBySide(cls, spec, 'pvp');
  return (
    <>
      <ul className="kv-list">
        {[['A', 'Alliance'], ['H', 'Horde']].map(([side, label]) => {
          const b = pve[side];
          const p = pvp[side];
          if (!b) return <li key={side}><strong>{label}</strong><span>{cls.name}s can&apos;t be {label} in WoW Forever.</span></li>;
          return (
            <li key={side}>
              <strong>{b.race.name} <span className={`route-side side-${side}`}>{label}</span></strong>
              <span>Dungeons &amp; raids: {standouts(b)}.{p && p.race.id !== b.race.id ? ` For PvP, ${p.race.name} (${standouts(p)}).` : ''}</span>
            </li>
          );
        })}
      </ul>
      <button className="link-btn" onClick={() => nav.races(cls.id, spec.id)}>Every race ranked, with why <Icon name="arrow" size={12} /></button>
    </>
  );
}
