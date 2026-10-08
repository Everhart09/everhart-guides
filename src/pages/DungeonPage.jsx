import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DUNGEON_META, portraitUrl, wowheadItem, wowheadNpc } from '../data/dungeons/index.js';
import { Icon, ROLE_ICON } from '../components/icons.jsx';
import PageActions from '../components/PageActions.jsx';
import { iconByName } from '../lib/icons.js';
import { openExternal } from '../lib/updates.js';

const SIDE_NAMES = { A: 'Alliance territory', H: 'Horde territory', C: 'Contested' };
const ROLES = [['tank', 'Tank'], ['healer', 'Healer'], ['dps', 'DPS']];
const day = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const jump = (i) => document.getElementById(`boss-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

function LootTip({ tip }) {
  const { item } = tip;
  return createPortal(
    <div className="talent-tip item-tip" style={{ left: tip.x, top: tip.y }}>
      <div className="tt-head">
        {item.icon && <img src={iconByName(item.icon)} alt="" width={36} height={36} />}
        <div className={`tt-name q${item.q}`}>{item.name}</div>
      </div>
      <div className="tt-rank">Item level {item.ilvl}{item.req ? ` · Requires level ${item.req}` : ''}</div>
      <div className="it-type">{[item.bind === 'BoP' ? 'Binds when picked up' : item.bind === 'BoE' ? 'Binds when equipped' : null, item.slot, item.type].filter(Boolean).join(' · ')}</div>
      <ul className="dl-stats">{item.stats.map((s) => <li key={s} className={/^(Equip|Use|Chance)/.test(s) ? 'eq' : ''}>{s}</li>)}</ul>
      {item.chance && <div className="tt-levels">Drop chance {item.chance}%</div>}
    </div>,
    document.body,
  );
}

function Portrait({ boss, size = 'lg' }) {
  const [failed, setFailed] = useState(false);
  const src = portraitUrl(boss.model);
  return (
    <div className={`boss-portrait ${size}`}>
      {src && !failed ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} /> : <Icon name="skull" size={size === 'lg' ? 48 : 22} />}
    </div>
  );
}

/** The boss roster at the top of the page: portraits you click to jump to that boss. */
function Roster({ bosses }) {
  return (
    <nav className="boss-roster" aria-label="Bosses">
      {bosses.map((b, i) => (
        <button key={b.name} className="roster-card" onClick={() => jump(i)}>
          <Portrait boss={b} size="sm" />
          <span className="roster-num">{i + 1}</span>
          <span className="roster-name">{b.name}</span>
          {(b.rare || b.optional || b.event) && <span className="roster-tag">{b.rare ? 'Rare' : b.event ? 'Event' : 'Optional'}</span>}
        </button>
      ))}
    </nav>
  );
}

function Boss({ boss, index, total, onTip }) {
  const showTip = (item) => (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onTip({ item, x: Math.max(8, r.left - 300), y: Math.max(8, Math.min(r.top, window.innerHeight - 280)) });
  };
  const roles = ROLES.filter(([role]) => boss[role] && boss[role] !== '—');

  return (
    <section className="boss-section" id={`boss-${index}`}>
      <header className="bs-head">
        <Portrait boss={boss} />
        <div className="bs-title">
          <div className="kicker">Boss {index + 1} of {total}{boss.rare ? ' · Rare spawn' : ''}{boss.optional ? ' · Optional' : ''}{boss.event ? ' · Event' : ''}</div>
          <h2>{boss.name}</h2>
          <div className="bs-facts">
            {boss.title && <span>&lt;{boss.title}&gt;</span>}
            {boss.level && <span>Level {boss.level}</span>}
            {boss.kind && <span>{boss.kind}</span>}
            {boss.npc && <button className="link-btn inline" onClick={() => openExternal(wowheadNpc(boss.npc))}>Wowhead <Icon name="arrow" size={11} /></button>}
          </div>
          <p className="bs-summary">{boss.strategy}</p>
        </div>
      </header>

      <div className="bs-grid">
        <div className="bs-card">
          <h3 className="bs-card-title"><Icon name="sword" size={14} /> Mechanics</h3>
          {boss.abilities.length ? (
            <ul className="bs-abilities">
              {boss.abilities.map((a) => (
                <li key={a.id}>
                  {a.icon ? <img src={iconByName(a.icon)} alt="" width={32} height={32} /> : <span className="tg-noicon" />}
                  <div>
                    <strong>{a.name}</strong>{a.school && a.school !== 'Magic' && <em className="ab-school">{a.school}</em>}
                    <p>{a.desc || 'No description in the game data.'}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="fine">No special abilities: a straightforward fight.</p>}
        </div>

        <div className="bs-card">
          <h3 className="bs-card-title"><Icon name="shield" size={14} /> What to watch out for</h3>
          {roles.length ? (
            <ul className="bs-watch">
              {roles.map(([role, label]) => (
                <li key={role} className={role}>
                  <span className="bs-role"><Icon name={ROLE_ICON[role]} size={13} /> {label}</span>
                  <p>{boss[role]}</p>
                </li>
              ))}
            </ul>
          ) : <p className="fine">Mechanics aren&apos;t known yet. This boss isn&apos;t in the beta.</p>}
        </div>

        <div className="bs-card">
          <h3 className="bs-card-title"><Icon name="star" size={14} /> Drops</h3>
          {boss.items.length ? (
            <ul className="bs-loot">
              {boss.items.map((it) => (
                <li key={it.id} onMouseEnter={showTip(it)} onMouseLeave={() => onTip(null)}>
                  {it.icon ? <img className={`gear-icon q${it.q}`} src={iconByName(it.icon)} alt="" width={34} height={34} /> : <span className="gear-icon" />}
                  <div className="bl-text">
                    <span className={`q${it.q}`}>{it.name}</span>
                    <span className="bl-sub">{[it.slot, it.type].filter(Boolean).join(' · ') || (it.quest ? 'Quest item' : 'Item')}{it.ilvl > 1 ? ` · i${it.ilvl}` : ''}</span>
                  </div>
                  {it.chance && <span className="bl-chance">{Math.round(it.chance)}%</span>}
                  <button className="gear-link" onClick={() => openExternal(wowheadItem(it.id))} title="Open on Wowhead"><Icon name="arrow" size={12} /></button>
                </li>
              ))}
            </ul>
          ) : <p className="fine">No notable drops listed.</p>}
        </div>
      </div>
    </section>
  );
}

export default function DungeonPage({ dungeon: d, nav }) {
  const [tip, setTip] = useState(null);

  return (
    <div className="page dungeon-page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="skull" size={40} /></div>
        <div className="hero-text">
          <div className="crumbs">
            <button onClick={nav.dungeons}>Dungeons &amp; Raids</button>
            <span>›</span>
            <span className="here">{d.name}</span>
          </div>
          <h1>{d.name}</h1>
          <p className="hero-desc">{d.summary}</p>
          <div className="hero-meta">
            <span className="meta-pill">Levels {d.levels[0]}–{d.levels[1]}</span>
            {d.minLevel && <span className="meta-pill">Opens at {d.minLevel} in the beta</span>}
            <span className={`route-side side-${d.side}`}>{SIDE_NAMES[d.side]}</span>
            {d.isNew && <span className="chip chip-new">New in Forever</span>}
            {d.status === 'later' && <span className="chip">Not open in the beta yet</span>}
            {d.bosses.length > 0 && <span className="meta-pill">{d.bosses.length} bosses</span>}
          </div>
        </div>
        <PageActions favKey={`dungeon:${d.id}`} noteKey={`dungeon:${d.id}`} nav={nav} />
      </header>

      {d.bosses.length > 0 && <Roster bosses={d.bosses} />}

      <div className="dg-intro">
        <section className="panel">
          <div className="kicker">Getting there</div>
          <p className="dg-where"><Icon name="arrow" size={14} /> {d.location}</p>
          <p className="dg-text">{d.getThere}</p>
        </section>
        <section className="panel">
          <div className="kicker">Before you go</div>
          <ul className="dg-tips">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      </div>

      {d.bosses.map((b, i) => <Boss key={b.name} boss={b} index={i} total={d.bosses.length} onTip={setTip} />)}
      {d.bosses.length === 0 && <section className="panel"><p className="fine">Boss guides for {d.name} are coming. Wowhead hasn&apos;t published a Forever guide yet.</p></section>}

      <p className="fine dg-credit">
        Strategy written for Everhart Guides from the WoW Forever beta and Wowhead&apos;s Forever dungeon guides
        {d.guide && <> (<button className="link-btn inline" onClick={() => openExternal(d.guide)}>read the full guide</button>)</>}.
        Abilities, loot, drop chances and boss models from Wowhead&apos;s Forever database, {day(DUNGEON_META.importedAt)}.
      </p>
      {tip && <LootTip tip={tip} />}
    </div>
  );
}
