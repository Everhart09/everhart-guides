import { createPortal } from 'react-dom';
import { Rich } from './ui.jsx';
import { encodeBuild, orderFromBuild } from '../lib/calculator.js';
import { TALENT_META } from '../data/talents/index.js';

const ROLE_NAMES = { tank: 'Tank', healer: 'Healer', dps: 'DPS' };
const ROTATION = [['opener', 'Opener'], ['single', 'Single target'], ['aoe', 'AoE'], ['cooldowns', 'Cooldowns']];
const day = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * One-page print layout for a spec guide: build, stats, weapons and rotation. Hidden on screen; shown only when
 * printing or saving as PDF (see the print styles in styles-extras.css). Rendered outside the app shell.
 */
export default function CheatSheet({ cls, spec, picks }) {
  const ranks = {};
  for (const p of picks) ranks[p.name] = Math.max(ranks[p.name] ?? 0, p.rank);
  const code = encodeBuild(cls, orderFromBuild(spec.build));
  const split = cls.trees.map((t) => picks.filter((p) => p.tree === t.id).length).join(' / ');

  return createPortal(
    <article className="cheatsheet" aria-hidden="true">
      <header className="cs-head">
        <div>
          <div className="cs-kicker">Everhart Guides · WoW Forever cheat sheet</div>
          <h1>{spec.name} {cls.name}</h1>
          <p>{spec.tagline}</p>
        </div>
        <dl className="cs-facts">
          <div><dt>Role</dt><dd>{spec.roles.map((r) => ROLE_NAMES[r]).join(' / ')}</dd></div>
          <div><dt>Talents</dt><dd>{split}</dd></div>
          <div><dt>Build code</dt><dd className="cs-code">{code}</dd></div>
        </dl>
      </header>

      <section className="cs-talents">
        {cls.trees.map((tree) => {
          const list = tree.talents.filter((t) => ranks[t.name]);
          return (
            <div key={tree.id}>
              <h2>{tree.name} <span>{list.reduce((n, t) => n + ranks[t.name], 0)}</span></h2>
              <ul>{list.map((t) => <li key={t.name}><span>{t.name}</span><b>{ranks[t.name]}/{t.max}</b></li>)}</ul>
            </div>
          );
        })}
      </section>

      <div className="cs-cols">
        <section>
          <h2>Stat priority</h2>
          <ol className="cs-stats">{spec.stats.map((s) => <li key={s.name}><b>{s.name}</b>{s.note && <span> — {s.note}</span>}</li>)}</ol>
          <h2>Weapons</h2>
          <ul className="cs-list">{spec.weapons.map((w) => <li key={w.type}><b>{w.type}</b> ({w.tier}){w.note && ` — ${w.note}`}</li>)}</ul>
          {spec.consumables?.length > 0 && (<>
            <h2>Consumables</h2>
            <ul className="cs-list">{spec.consumables.map((c) => <li key={c}>{c}</li>)}</ul>
          </>)}
        </section>
        <section>
          {ROTATION.map(([key, label]) => spec.rotation?.[key]?.length > 0 && (
            <div key={key}>
              <h2>{label}</h2>
              <ol className="cs-list">{spec.rotation[key].map((step) => <li key={step}><Rich text={step} /></li>)}</ol>
            </div>
          ))}
        </section>
      </div>

      {spec.leveling?.length > 0 && (
        <section className="cs-tips">
          <h2>Leveling tips</h2>
          <ul className="cs-list">{spec.leveling.map((t) => <li key={t}><Rich text={t} /></li>)}</ul>
        </section>
      )}

      <footer className="cs-foot">
        Talents from the WoW Forever beta data ({TALENT_META.importedAt ?? 'bundled'}) · Printed {day(new Date())} · Import the build code in the Everhart Guides talent calculator.
      </footer>
    </article>,
    document.body,
  );
}
