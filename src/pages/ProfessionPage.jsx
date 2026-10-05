import { CLASSES } from '../data/classes/index.js';
import { RATING_LABELS, RANKS, TYPE_LABELS, getProfession } from '../data/professions.js';
import { ClassEmblem, ProfessionEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';
import PageActions from '../components/PageActions.jsx';
import { Panel, Ratings } from '../components/ui.jsx';
import SkillPlanner from './profession/SkillPlanner.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'leveling', label: 'Leveling Guide' },
  { id: 'recipes', label: 'Recipes & Specializations' },
];

export default function ProfessionPage({ prof, tab = 'overview', nav }) {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><ProfessionEmblem id={prof.id} size={56} className="crest-img" /></div>
        <div className="hero-text">
          <div className="crumbs">
            <button onClick={nav.professions}>Professions</button>
            <span>›</span>
            <span className="here">{prof.name}</span>
          </div>
          <h1>{prof.name} <span className="h1-sub">{TYPE_LABELS[prof.type]}</span></h1>
          <p className="hero-desc">{prof.tagline}</p>
          <div className="hero-meta">
            <span className="meta-label">Pairs with</span>
            {prof.pairsWith.map((id) => (
              <button key={id} className="mini-pill link" onClick={() => nav.prof(id, tab)}>
                <ProfessionEmblem id={id} size={14} />{getProfession(id).name}
              </button>
            ))}
          </div>
        </div>
        <PageActions favKey={`prof:${prof.id}`} noteKey={`prof:${prof.id}`} nav={nav} />
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => nav.tab(t.id)}>{t.label}</button>
        ))}
      </nav>

      <div className="tab-body" key={tab}>
        {tab === 'overview' && <Overview prof={prof} nav={nav} />}
        {tab === 'leveling' && <SkillPlanner prof={prof} />}
        {tab === 'recipes' && <Recipes prof={prof} />}
      </div>
    </div>
  );
}

function Overview({ prof, nav }) {
  const ranked = [...CLASSES].sort((a, b) => prof.classFit[b.id] - prof.classFit[a.id]);
  return (
    <div className="grid-overview">
      <Panel kicker="What it does" title={`About ${prof.name}`} className="span-2">
        <p className="lead">{prof.summary}</p>
      </Panel>
      <Panel kicker="At a glance" title="Ratings">
        <Ratings ratings={prof.ratings} labels={RATING_LABELS} />
      </Panel>

      <Panel kicker="Strengths" title="Pros" className="pros-panel">
        <ul className="pc-list">
          {prof.pros.map((p) => <li key={p}><span className="pc-icon"><Icon name="check" size={13} /></span>{p}</li>)}
        </ul>
      </Panel>
      <Panel kicker="Weaknesses" title="Cons" className="cons-panel">
        <ul className="pc-list">
          {prof.cons.map((p) => <li key={p}><span className="pc-icon"><Icon name="x" size={13} /></span>{p}</li>)}
        </ul>
      </Panel>
      <Panel kicker="Who should take it" title="Class fit">
        <ul className="fit-list">
          {ranked.map((c) => (
            <li key={c.id} style={{ '--c': c.color }}>
              <button onClick={() => nav.cls(c.id)}><ClassEmblem id={c.id} size={18} />{c.name}</button>
              <span className="fit-bar">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= prof.classFit[c.id] ? 'on' : ''} />)}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel kicker="Know before you go" title="Tips" className="span-2">
        <ul className="bullets">{prof.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      </Panel>
      <Panel kicker="Training" title="Ranks & trainers">
        <ol className="rank-list">
          {RANKS.map((r) => (
            <li key={r.name}>
              <span className="rank-name">{r.name}</span>
              <span className="rank-range">{r.from}–{r.to}</span>
              <span className="rank-lvl">Lv {r.level}</span>
            </li>
          ))}
        </ol>
        <ul className="bullets small">{prof.trainers.map((t) => <li key={t}>{t}</li>)}</ul>
      </Panel>
    </div>
  );
}

function Recipes({ prof }) {
  return (
    <div className="grid-recipes">
      {prof.specializations.length > 0 && (
        <Panel kicker="Choose one" title="Specializations" className="span-full">
          <div className="spec-choices">
            {prof.specializations.map((s) => (
              <article key={s.name} className="spec-choice">
                <h4>{s.name}</h4>
                <span className="spec-req">{s.req}</span>
                <p>{s.desc}</p>
                <ul className="bullets small">{s.perks.map((p) => <li key={p}>{p}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="fine">Specializations are permanent unless you unlearn the profession, so choose based on your class and goals.</p>
        </Panel>
      )}
      {prof.specializations.length === 0 && (
        <Panel kicker="Specializations" title="None in this version" className="span-full">
          <p className="muted-text">{prof.name} has no specialization choice in Classic. Every recipe is available to every {prof.name.toLowerCase()} user.</p>
        </Panel>
      )}
      <Panel kicker="Worth working toward" title="Notable recipes & items" className="span-full">
        <div className="recipe-table-wrap">
          <table className="recipe-table">
            <thead>
              <tr><th>Recipe / Item</th><th>Skill</th><th>Source</th><th>Why it matters</th></tr>
            </thead>
            <tbody>
              {[...prof.notable].sort((a, b) => b.skill - a.skill).map((n) => (
                <tr key={n.name}>
                  <td className="rt-name">{n.name}</td>
                  <td><span className="skill-pill">{n.skill}</span></td>
                  <td className="rt-muted">{n.source}</td>
                  <td>{n.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
