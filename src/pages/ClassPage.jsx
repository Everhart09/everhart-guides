import { Icon } from '../components/icons.jsx';
import PageActions from '../components/PageActions.jsx';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Difficulty, Panel, Ratings, RoleChip } from '../components/ui.jsx';
import ClassChanges from './class/ClassChanges.jsx';
import TrainerChecklist from './class/TrainerChecklist.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'changes', label: "What's new in Forever" },
  { id: 'trainer', label: 'Trainer checklist' },
];

export default function ClassPage({ cls, tab = 'overview', nav }) {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><ClassEmblem id={cls.id} size={56} className="crest-img" /></div>
        <div className="hero-text">
          <div className="kicker">Class Overview</div>
          <h1>{cls.name}</h1>
          <p className="hero-desc">{cls.description}</p>
          <dl className="facts">
            <div><dt>Armor</dt><dd>{cls.armor}</dd></div>
            <div><dt>Resource</dt><dd>{cls.resource}</dd></div>
            <div><dt>Weapons</dt><dd>{cls.weaponsUsable}</dd></div>
          </dl>
        </div>
        <PageActions favKey={`class:${cls.id}`} noteKey={`class:${cls.id}`} nav={nav} />
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => nav.tab(t.id)}>{t.label}</button>
        ))}
      </nav>

      {tab === 'changes' && <ClassChanges cls={cls} nav={nav} />}
      {tab === 'trainer' && <TrainerChecklist key={cls.id} cls={cls} />}
      {tab === 'overview' && (<>
      <div className="section-title">
        <h2>Compare Specs</h2>
        <span className="rule" />
      </div>
      <div className="spec-compare">
        {cls.specs.map((s) => (
          <article key={s.id} className="spec-card">
            <header>
              <div className="spec-card-roles">{s.roles.map((r) => <RoleChip key={r} role={r} />)}</div>
              <h3>{s.name}</h3>
              <p>{s.tagline}</p>
              <Difficulty value={s.difficulty} />
            </header>
            <Ratings ratings={s.ratings} compact />
            <ul className="mini-list pros">
              {s.pros.slice(0, 2).map((p) => <li key={p}><Icon name="check" size={13} />{p}</li>)}
            </ul>
            <ul className="mini-list cons">
              {s.cons.slice(0, 2).map((p) => <li key={p}><Icon name="x" size={13} />{p}</li>)}
            </ul>
            <button className="btn-primary" onClick={() => nav.guide(cls.id, s.id)}>
              Open {s.name} guide <Icon name="arrow" size={14} />
            </button>
          </article>
        ))}
      </div>

      <Panel kicker="Leveling" title="Key class milestones">
        <ol className="timeline">
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
      </>)}
    </div>
  );
}
