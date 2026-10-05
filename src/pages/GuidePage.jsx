import { useMemo } from 'react';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Difficulty, RoleChip } from '../components/ui.jsx';
import { expandBuild, validateClass } from '../lib/talents.js';
import { Icon } from '../components/icons.jsx';
import OverviewTab from './guide/OverviewTab.jsx';
import TalentPlanner from './guide/TalentPlanner.jsx';
import GearTab from './guide/GearTab.jsx';
import RotationTab from './guide/RotationTab.jsx';
import LevelingTab from './guide/LevelingTab.jsx';
import PageActions from '../components/PageActions.jsx';
import CheatSheet from '../components/CheatSheet.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'talents', label: 'Talents' },
  { id: 'gear', label: 'Stats & Gear' },
  { id: 'rotation', label: 'Rotation' },
  { id: 'leveling', label: 'Leveling' },
];

export default function GuidePage({ cls, spec, tab = 'overview', nav }) {
  const picks = useMemo(() => expandBuild(cls, spec), [cls, spec]);
  const split = cls.trees.map((t) => picks.filter((p) => p.tree === t.id).length).join(' / ');
  const buildProblems = useMemo(() => validateClass(cls).filter((e) => e.startsWith(`${cls.name}/${spec.name}:`)), [cls, spec]);

  return (
    <div className="page guide">
      <header className="hero guide-hero">
        <div className="hero-bg" />
        <div className="hero-crest"><ClassEmblem id={cls.id} size={56} className="crest-img" /></div>
        <div className="hero-text">
          <div className="crumbs">
            <button onClick={nav.home}>Classes</button>
            <span>›</span>
            <button onClick={() => nav.cls(cls.id)}>{cls.name}</button>
            <span>›</span>
            <span className="here">{spec.name}</span>
          </div>
          <h1>{spec.name} <span className="h1-sub">{cls.name}</span></h1>
          <p className="hero-desc">{spec.tagline}</p>
          <div className="hero-meta">
            {spec.roles.map((r) => <RoleChip key={r} role={r} />)}
            <Difficulty value={spec.difficulty} />
            <span className="meta-pill" title="Talent split at level 60">{split}</span>
          </div>
        </div>
        <div className="spec-switch">
          {cls.specs.map((s) => (
            <button key={s.id} className={s.id === spec.id ? 'active' : ''} onClick={() => nav.guide(cls.id, s.id, tab)}>
              {s.name}
            </button>
          ))}
        </div>
        <PageActions favKey={`guide:${cls.id}/${spec.id}`} noteKey={`guide:${cls.id}/${spec.id}`} nav={nav} exportName={`${spec.name} ${cls.name} - Everhart cheat sheet`} />
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => nav.tab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      {buildProblems.length > 0 && (
        <div className="build-warning">
          <Icon name="x" size={14} />
          <span>
            <b>The beta talent trees changed since this build was written.</b> {buildProblems.length} build
            {buildProblems.length === 1 ? ' issue' : ' issues'} found — talents that no longer fit are skipped in the planner.
          </span>
          <button className="btn-ghost" onClick={() => nav.calc(cls.id, spec.id)}>Fix it in the calculator</button>
        </div>
      )}

      <div className="tab-body" key={tab}>
        {tab === 'overview' && <OverviewTab cls={cls} spec={spec} picks={picks} nav={nav} />}
        {tab === 'talents' && <TalentPlanner cls={cls} spec={spec} picks={picks} onCustomize={() => nav.calc(cls.id, spec.id)} />}
        {tab === 'gear' && <GearTab cls={cls} spec={spec} />}
        {tab === 'rotation' && <RotationTab cls={cls} spec={spec} />}
        {tab === 'leveling' && <LevelingTab cls={cls} spec={spec} picks={picks} />}
      </div>
      <CheatSheet cls={cls} spec={spec} picks={picks} />
    </div>
  );
}
