import { CLASSES } from '../data/classes/index.js';
import { PAIRINGS, PROFESSIONS, RANKS, TYPE_COLORS, TYPE_LABELS, getProfession } from '../data/professions.js';
import { ClassEmblem, ProfessionEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';
import { Panel } from '../components/ui.jsx';

const GROUPS = ['gathering', 'crafting', 'secondary'];
const GROUP_BLURB = {
  gathering: 'Collect raw materials from the world. Great for gold while leveling.',
  crafting: 'Turn materials into gear and consumables. You can learn two primary professions.',
  secondary: 'Everyone can learn all three alongside their primaries.',
};
const PRIMARY = PROFESSIONS.filter((p) => p.type !== 'secondary');

export default function ProfessionsHub({ nav }) {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><ProfessionEmblem id="blacksmithing" size={56} className="crest-img" /></div>
        <div className="hero-text">
          <div className="kicker">Profession Compendium</div>
          <h1>Professions</h1>
          <p className="hero-desc">
            Choose two primary professions and learn all three secondary ones. Each guide has a skill slider from
            1 to 300 that shows what to craft or where to farm, plus a materials calculator for the rest of the way.
            You'll also find specializations, key recipes and how well each profession suits your class.
          </p>
          <div className="rank-strip">
            {RANKS.map((r) => (
              <div key={r.name}>
                <strong>{r.name}</strong>
                <span>Skill {r.from}–{r.to} · Lv {r.level}+</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {GROUPS.map((g) => (
        <section key={g}>
          <div className="section-title">
            <h2>{TYPE_LABELS[g]}</h2>
            <span className="section-blurb">{GROUP_BLURB[g]}</span>
            <span className="rule" />
          </div>
          <div className="prof-grid">
            {PROFESSIONS.filter((p) => p.type === g).map((p) => (
              <button key={p.id} className="prof-card" style={{ '--c': TYPE_COLORS[p.type] }} onClick={() => nav.prof(p.id)}>
                <span className="prof-card-icon"><ProfessionEmblem id={p.id} size={44} /></span>
                <span className="prof-card-body">
                  <span className="prof-card-name">{p.name}</span>
                  <span className="prof-card-tag">{p.tagline}</span>
                  <span className="prof-card-pairs">
                    {p.pairsWith.slice(0, 3).map((id) => (
                      <span key={id} className="mini-pill"><ProfessionEmblem id={id} size={14} />{getProfession(id).name}</span>
                    ))}
                  </span>
                </span>
                <Icon name="chevron" size={14} className="prof-card-go" />
              </button>
            ))}
          </div>
        </section>
      ))}

      <div className="section-title">
        <h2>Recommended Pairings</h2>
        <span className="rule" />
      </div>
      <div className="pairings">
        {PAIRINGS.map((pr) => {
          const a = getProfession(pr.a);
          const b = getProfession(pr.b);
          return (
            <article key={pr.a + pr.b} className="pairing">
              <div className="pairing-icons">
                <button onClick={() => nav.prof(a.id)} title={a.name}><ProfessionEmblem id={a.id} size={36} /></button>
                <span>+</span>
                <button onClick={() => nav.prof(b.id)} title={b.name}><ProfessionEmblem id={b.id} size={36} /></button>
              </div>
              <div>
                <div className="pairing-names">{a.name} + {b.name}</div>
                <h4>{pr.title}</h4>
                <p>{pr.why}</p>
                <span className="pairing-for">Best for: {pr.for}</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="section-title">
        <h2>Class Fit</h2>
        <span className="section-blurb">How useful each primary profession is for each class (1–5)</span>
        <span className="rule" />
      </div>
      <Panel className="matrix-panel">
        <div className="matrix-scroll">
          <table className="matrix">
            <thead>
              <tr>
                <th />
                {PRIMARY.map((p) => (
                  <th key={p.id}>
                    <button onClick={() => nav.prof(p.id)} title={p.name}>
                      <ProfessionEmblem id={p.id} size={26} />
                      <span>{p.name}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASSES.map((c) => (
                <tr key={c.id}>
                  <th style={{ color: c.color }}>
                    <button onClick={() => nav.cls(c.id)}><ClassEmblem id={c.id} size={20} />{c.name}</button>
                  </th>
                  {PRIMARY.map((p) => {
                    const v = p.classFit[c.id];
                    return <td key={p.id}><span className={`heat heat-${v}`}>{v}</span></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
