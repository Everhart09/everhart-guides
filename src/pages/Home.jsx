import { useState } from 'react';
import { CLASSES, ROLE_LABELS } from '../data/classes/index.js';
import { Icon, ROLE_ICON } from '../components/icons.jsx';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { RoleChip } from '../components/ui.jsx';
import { CountdownHero } from '../components/Countdown.jsx';
import ContinueRow from '../components/ContinueRow.jsx';

const ALL_SPECS = CLASSES.flatMap((c) => c.specs.map((s) => ({ cls: c, spec: s })));

const ROLE_FILTERS = ['all', 'dps', 'tank', 'healer'];
const FILTER_KEY = 'everhart.roleFilter';

function loadFilter() {
  try {
    const f = localStorage.getItem(FILTER_KEY);
    return ROLE_FILTERS.includes(f) ? f : 'all';
  } catch {
    return 'all';
  }
}

const matches = (spec, role) => role === 'all' || spec.roles.includes(role);

function topBy(key, role, n = 4) {
  return ALL_SPECS.filter(({ spec }) => matches(spec, role))
    .sort((a, b) => b.spec.ratings[key] - a.spec.ratings[key] || a.spec.difficulty - b.spec.difficulty)
    .slice(0, n);
}

const PICKS = [
  { key: 'leveling', title: 'Fastest to level', blurb: 'Low downtime, strong solo tools' },
  { key: 'raid', title: 'Raid powerhouses', blurb: 'Highest demand in endgame raids' },
  { key: 'pvp', title: 'PvP terrors', blurb: 'Burst, control and survivability' },
];

export default function Home({ nav }) {
  const [role, setRole] = useState(loadFilter);
  const roles = (c) => [...new Set(c.specs.flatMap((s) => s.roles))];
  const visible = CLASSES.map((c) => ({ cls: c, specs: c.specs.filter((s) => matches(s, role)) }))
    .filter(({ specs }) => specs.length);
  const specCount = visible.reduce((n, v) => n + v.specs.length, 0);

  const pickRole = (r) => {
    setRole(r);
    try {
      localStorage.setItem(FILTER_KEY, r);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <div className="page home">
      <section className="home-hero">
        <div className="home-hero-glow" />
        <img className="home-hero-logo" src="./brand/wow-forever-logo.png" alt="World of Warcraft: Forever" />
        <div className="home-hero-text">
        <div className="kicker">WoW Forever · Class Compendium</div>
        <h1>Choose your path</h1>
        <p>
          Every class and spec, from level 1 to 60. Talent builds you can scrub level by level, stat and weapon
          priorities, rotations, and honest pros & cons, so you can pick the spec that fits how you like to play.
        </p>
        <div className="home-stats">
          <div><strong>{CLASSES.length}</strong><span>Classes</span></div>
          <div><strong>{ALL_SPECS.length}</strong><span>Specs</span></div>
          <div><strong>51</strong><span>Talent points</span></div>
          <div><strong>1–60</strong><span>Level range</span></div>
        </div>
        </div>
      </section>

      <ContinueRow nav={nav} />

      <CountdownHero onPatchNotes={nav.patch} />

      <div className="section-title">
        <h2>The Classes</h2>
        <span className="rule" />
      </div>
      <div className="role-filter" role="group" aria-label="Filter by role">
        {ROLE_FILTERS.map((r) => (
          <button key={r} className={`role-filter-btn ${r !== 'all' ? 'role-' + r : ''} ${role === r ? 'active' : ''}`}
            aria-pressed={role === r} onClick={() => pickRole(r)}>
            {r !== 'all' && <Icon name={ROLE_ICON[r]} size={14} />}
            {r === 'all' ? 'All roles' : ROLE_LABELS[r]}
          </button>
        ))}
        <span className="role-filter-count">
          {visible.length} {visible.length === 1 ? 'class' : 'classes'} · {specCount} {specCount === 1 ? 'spec' : 'specs'}
        </span>
      </div>
      <div className="class-grid">
        {visible.map(({ cls: c, specs }) => (
          <article key={c.id} className="class-card" style={{ '--c': c.color }}>
            <button className="class-card-main" onClick={() => nav.cls(c.id)}>
              <span className="class-card-icon"><ClassEmblem id={c.id} size={40} /></span>
              <span className="class-card-name">{c.name}</span>
              <span className="class-card-meta">{c.armor} · {c.resource}</span>
              <span className="class-card-roles">{roles(c).map((r) => <RoleChip key={r} role={r} />)}</span>
            </button>
            <div className="class-card-specs">
              {specs.map((s) => (
                <button key={s.id} onClick={() => nav.guide(c.id, s.id)}>
                  {s.name}
                  <Icon name="chevron" size={12} />
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="section-title">
        <h2>Quick Picks</h2>
        <span className="rule" />
      </div>
      <div className="picks">
        {PICKS.map((p) => (
          <section key={p.key} className="pick-col">
            <h3>{p.title}</h3>
            <p>{p.blurb}</p>
            <ol>
              {topBy(p.key, role).map(({ cls, spec }) => (
                <li key={cls.id + spec.id}>
                  <button onClick={() => nav.guide(cls.id, spec.id)} style={{ '--c': cls.color }}>
                    <ClassEmblem id={cls.id} size={20} />
                    <span className="pick-name">{spec.name} <em>{cls.name}</em></span>
                    <span className="pick-score">{spec.ratings[p.key]}/5</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
