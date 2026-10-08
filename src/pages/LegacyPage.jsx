import { useState } from 'react';
import {
  LEGACY_CAP, LEGACY_CHALLENGES, LEGACY_SOURCE_NOTE, LEGACY_TRACK, LEGACY_TREES,
  LEGACY_META, blockReason, canRemove, decodeLegacy, encodeLegacy, perkById, perkEffect, perkIcon, spentIn, totalSpent,
} from '../data/legacy.js';
import { Icon } from '../components/icons.jsx';
import { iconByName } from '../lib/icons.js';

const BUILD_KEY = 'everhart.legacy.build';
const DONE_KEY = 'everhart.legacy.challenges';
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

function Perk({ perk, ranks, cap, onAdd, onRemove }) {
  const r = ranks[perk.id] ?? 0;
  const block = blockReason(ranks, perk, cap);
  const state = r >= perk.max ? 'maxed' : r > 0 ? 'partial' : block ? 'locked' : 'open';
  return (
    <li
      className={`lg-perk ${state}`}
      role="button"
      tabIndex={0}
      aria-label={`${perk.name}, ${r} of ${perk.max}`}
      onClick={() => !block && onAdd(perk)}
      onContextMenu={(e) => { e.preventDefault(); if (canRemove(ranks, perk)) onRemove(perk); }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !block) { e.preventDefault(); onAdd(perk); }
        if ((e.key === 'Backspace' || e.key === 'Delete' || e.key === '-') && canRemove(ranks, perk)) { e.preventDefault(); onRemove(perk); }
      }}
      title={block && state !== 'maxed' ? block : 'Click to add a point'}
    >
      <div className="lg-perk-head">
        {perkIcon(perk) && <img className="lg-perk-icon" src={iconByName(perkIcon(perk))} alt="" width={26} height={26} />}
        <strong>{perk.name}</strong>
        <span className="lg-rank">{r}/{perk.max}</span>
        {r > 0 && (
          <button
            className="lg-minus"
            onClick={(e) => { e.stopPropagation(); if (canRemove(ranks, perk)) onRemove(perk); }}
            disabled={!canRemove(ranks, perk)}
            title={canRemove(ranks, perk) ? 'Remove a point' : 'Another perk needs this one'}
            aria-label={`Remove a point from ${perk.name}`}
          >−</button>
        )}
      </div>
      <p className="lg-effect">{perkEffect(perk, r)}</p>
      {r > 0 && r < perk.max && <p className="lg-next">Max rank: {perkEffect(perk, perk.max)}</p>}
      {(perk.gate > 0 || perk.requires) && (
        <p className="lg-req">
          {perk.gate > 0 && (
            <span className={spentIn(ranks, perk.tree) >= perk.gate ? 'met' : 'unmet'}>Needs {perk.gate} points in this tree</span>
          )}
          {perk.gate > 0 && perk.requires && ' · '}
          {perk.requires && (
            <span className={(ranks[perk.requires[0]] ?? 0) >= perk.requires[1] ? 'met' : 'unmet'}>
              {perkById[perk.requires[0]].name} {perk.requires[1]}/{perk.requires[1]}
            </span>
          )}
        </p>
      )}
      <div className="lg-pips">{Array.from({ length: perk.max }, (_, i) => <i key={i} className={i < r ? 'on' : ''} />)}</div>
    </li>
  );
}

export default function LegacyPage() {
  const [ranks, setRanks] = useState(() => read(BUILD_KEY, {}));
  const [done, setDone] = useState(() => new Set(read(DONE_KEY, [])));
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState(null);

  const earned = done.size;
  const cap = LEGACY_CAP;
  const spent = totalSpent(ranks);
  const save = (next) => { setRanks(next); write(BUILD_KEY, next); };
  const add = (perk) => save({ ...ranks, [perk.id]: (ranks[perk.id] ?? 0) + 1 });
  const remove = (perk) => {
    const next = { ...ranks, [perk.id]: ranks[perk.id] - 1 };
    if (!next[perk.id]) delete next[perk.id];
    save(next);
  };
  const toggle = (id) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id); else next.add(id);
    setDone(next);
    write(DONE_KEY, [...next]);
  };
  const copy = async () => {
    const c = encodeLegacy(ranks);
    try { await navigator.clipboard.writeText(c); setMsg(`Copied ${c}`); } catch { setMsg(c); }
  };
  const load = () => {
    const r = decodeLegacy(code);
    if (!r || totalSpent(r) > cap) { setMsg("That code isn't a valid Legacy build."); return; }
    save(r);
    setMsg('Build loaded.');
  };

  return (
    <div className="page legacy-page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="star" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Account progression</div>
          <h1>Legacy System</h1>
          <p className="hero-desc">
            WoW Forever replaces achievements with Legacy. Complete challenges across your account to earn Legacy Points, then
            spend them on each character for permanent perks like faster rested XP, extra gathering and cheaper flights.
          </p>
        </div>
      </header>

      <section className="lg-how">
        {[
          ['1', 'Earn points', '65 challenges (leveling classes, professions, PvP, dungeons, raids and exploring) give 1 Legacy Point each. Points are shared by every character on your account.'],
          ['2', 'Unlock it', 'The system opens with your first point, usually your first character reaching level 25, a crafting profession at 150, or exploring the whole world map.'],
          ['3', 'Spend per character', `Each character spends its own copy of your points, up to ${cap} at launch, across three trees. Deeper perks need 5 or 10 points in their tree first.`],
          ['4', 'Plan ahead', 'One character alone can earn about 29 points, so alts and professions are how you fill your trees. Hardcore points count for normal characters, not the reverse.'],
        ].map(([n, t, d]) => (
          <div key={n} className="lg-step"><span className="lg-step-n">{n}</span><div><b>{t}</b><p>{d}</p></div></div>
        ))}
      </section>

      <section className="panel lg-calc">
        <header className="lg-calc-head">
          <div>
            <div className="kicker">Calculator</div>
            <h3>Plan a character&apos;s perks</h3>
            <p className="fine">Click a perk to add a point; use − (or right-click) to remove one.</p>
          </div>
          <div className="lg-points">
            <b className={spent >= cap ? 'full' : ''}>{spent}</b><span>/ {cap} points spent</span>
            {earned > 0 && <em>{earned} earned{earned < cap ? `, so you can spend ${earned} right now` : ''}</em>}
          </div>
          <div className="lg-actions">
            <button className="btn-ghost" onClick={copy} disabled={!spent}>Copy build code</button>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste a code" aria-label="Legacy build code" />
            <button className="btn-ghost" onClick={load} disabled={!code.trim()}>Load</button>
            <button className="btn-ghost danger" onClick={() => save({})} disabled={!spent}>Reset</button>
          </div>
        </header>
        {msg && <p className="lg-msg">{msg}</p>}
        {earned > 0 && spent > earned && <p className="lg-warn">This build uses {spent} points but you&apos;ve only ticked {earned} challenges below.</p>}

        <div className="lg-trees">
          {LEGACY_TREES.map((t) => {
            const inTree = spentIn(ranks, t.id);
            return (
              <div key={t.id} className="lg-tree" style={{ '--t': t.color }}>
                <div className="lg-tree-head">
                  <img src={iconByName(t.icon)} alt="" width={34} height={34} />
                  <div><h4>{t.name}</h4><p>{t.blurb}</p></div>
                  <span className="lg-tree-pts">{inTree}</span>
                </div>
                {[0, 5, 10].map((gate) => (
                  <div key={gate} className={`lg-tier ${inTree >= gate ? 'open' : ''}`}>
                    <span className="lg-tier-label">{gate ? `${gate} points in ${t.name}` : 'Available from the start'}</span>
                    <ul>
                      {t.perks.filter((p) => p.gate === gate).map((p) => (
                        <Perk key={p.id} perk={{ ...p, tree: t.id }} ranks={ranks} cap={cap} onAdd={add} onRemove={remove} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <div className="lg-bottom">
        <section className="panel lg-challenges">
          <div className="kicker">Your account</div>
          <h3 className="route-aside-title">Legacy challenges <span className="lg-count">{earned} / 65</span></h3>
          <p className="fine">Tick what your account has done to see how many points you can spend. Saved on this computer.</p>
          {LEGACY_CHALLENGES.map((c) => {
            const got = c.items.filter((i) => done.has(i.id)).length;
            return (
              <details key={c.id} className="lg-cat">
                <summary><b>{c.name}</b><span>{got} / {c.items.length}</span><em>{c.blurb}</em></summary>
                <ul>
                  {c.items.map((i) => (
                    <li key={i.id}>
                      <label><input type="checkbox" checked={done.has(i.id)} onChange={() => toggle(i.id)} /> {i.name}</label>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </section>

        <section className="panel">
          <div className="kicker">Legacy track</div>
          <h3 className="route-aside-title">Rewards</h3>
          <p className="fine">The Legacy track levels up as you play and gives cosmetic rewards along the way.</p>
          <ul className="lg-track">
            {LEGACY_TRACK.map((r) => (
              <li key={r.level}><span className="lg-track-lvl">{r.level}</span><div><b>{r.name}</b><em>{r.kind}</em></div></li>
            ))}
          </ul>
          <p className="fine lg-note">
            {LEGACY_SOURCE_NOTE} Perk effects come from the WoW Forever game data
            {LEGACY_META.importedAt ? ` (${LEGACY_META.origin === 'downloaded' ? 'updated in-app' : 'bundled'} ${new Date(LEGACY_META.importedAt + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})` : ''} and refresh with Settings → Check for updates.
          </p>
        </section>
      </div>
    </div>
  );
}
