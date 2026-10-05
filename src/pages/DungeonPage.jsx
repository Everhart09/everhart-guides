import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DUNGEON_META, wowheadItem, wowheadNpc } from '../data/dungeons/index.js';
import { Icon, ROLE_ICON } from '../components/icons.jsx';
import PageActions from '../components/PageActions.jsx';
import { iconByName } from '../lib/icons.js';
import { openExternal } from '../lib/updates.js';

const SIDE_NAMES = { A: 'Alliance territory', H: 'Horde territory', C: 'Contested' };
const ROLES = [['tank', 'Tank'], ['healer', 'Healer'], ['dps', 'DPS']];
const day = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

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

function Boss({ boss, index, onTip }) {
  const showTip = (item) => (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onTip({ item, x: Math.min(r.right + 12, window.innerWidth - 300), y: Math.max(8, Math.min(r.top, window.innerHeight - 280)) });
  };
  return (
    <section className="panel boss" id={`boss-${index}`}>
      <header className="boss-head">
        <span className="boss-num">{index + 1}</span>
        <div className="boss-title">
          <h3>{boss.name}</h3>
          <div className="boss-sub">
            {boss.title && <span>&lt;{boss.title}&gt;</span>}
            {boss.level && <span>Level {boss.level}</span>}
            {boss.kind && <span>{boss.kind}</span>}
            {boss.rare && <span className="chip">Rare spawn</span>}
            {boss.optional && <span className="chip">Optional</span>}
            {boss.event && <span className="chip">Event</span>}
          </div>
        </div>
        {boss.npc && <button className="gear-link" onClick={() => openExternal(wowheadNpc(boss.npc))} title="Open on Wowhead"><Icon name="arrow" size={12} /></button>}
      </header>

      <p className="boss-strategy">{boss.strategy}</p>

      <div className="boss-roles">
        {ROLES.map(([role, label]) => boss[role] && boss[role] !== '—' && (
          <div key={role} className={`boss-role ${role}`}>
            <span className="boss-role-label"><Icon name={ROLE_ICON[role]} size={12} /> {label}</span>
            <p>{boss[role]}</p>
          </div>
        ))}
      </div>

      <div className="boss-cols">
        {boss.abilities.length > 0 && (
          <div>
            <h4 className="boss-h4">Abilities</h4>
            <ul className="boss-abilities">
              {boss.abilities.map((a) => (
                <li key={a.id}>
                  {a.icon ? <img src={iconByName(a.icon)} alt="" width={28} height={28} /> : <span className="tg-noicon" />}
                  <div>
                    <strong>{a.name}</strong>{a.school && a.school !== 'Magic' && <em className="ab-school">{a.school}</em>}
                    {a.desc && <p>{a.desc}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {boss.items.length > 0 && (
          <div>
            <h4 className="boss-h4">Loot</h4>
            <ul className="boss-loot">
              {boss.items.map((it) => (
                <li key={it.id} onMouseEnter={showTip(it)} onMouseLeave={() => onTip(null)}>
                  {it.icon ? <img className={`gear-icon q${it.q}`} src={iconByName(it.icon)} alt="" width={30} height={30} /> : <span className="gear-icon" />}
                  <div className="bl-text">
                    <span className={`q${it.q}`}>{it.name}</span>
                    <span className="bl-sub">{[it.slot, it.type].filter(Boolean).join(' · ') || (it.quest ? 'Quest item' : 'Item')}{it.ilvl > 1 ? ` · i${it.ilvl}` : ''}</span>
                  </div>
                  {it.chance && <span className="bl-chance">{Math.round(it.chance)}%</span>}
                  <button className="gear-link" onClick={() => openExternal(wowheadItem(it.id))} title="Open on Wowhead"><Icon name="arrow" size={12} /></button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default function DungeonPage({ dungeon: d, nav }) {
  const [tip, setTip] = useState(null);
  const jump = (i) => document.getElementById(`boss-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
          </div>
        </div>
        <PageActions favKey={`dungeon:${d.id}`} noteKey={`dungeon:${d.id}`} nav={nav} />
      </header>

      <div className="dungeon-layout">
        <div className="dungeon-main">
          <section className="panel">
            <div className="kicker">Getting there</div>
            <p className="dg-where"><Icon name="arrow" size={14} /> {d.location}</p>
            <p className="dg-text">{d.getThere}</p>
          </section>

          {d.bosses.map((b, i) => <Boss key={b.name} boss={b} index={i} onTip={setTip} />)}
          {d.bosses.length === 0 && <section className="panel"><p className="fine">Boss guides for {d.name} are coming. Wowhead hasn&apos;t published a Forever guide yet.</p></section>}
        </div>

        <aside className="dungeon-aside">
          {d.bosses.length > 0 && (
            <section className="panel dg-bosslist">
              <div className="kicker">Bosses</div>
              <ol>
                {d.bosses.map((b, i) => (
                  <li key={b.name}>
                    <button onClick={() => jump(i)}>
                      <span className="boss-num small">{i + 1}</span>
                      <span>{b.name}</span>
                      {(b.rare || b.optional) && <em>{b.rare ? 'rare' : 'optional'}</em>}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <section className="panel">
            <div className="kicker">Tips</div>
            <ul className="dg-tips">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>
          <p className="fine dg-credit">
            Strategy written for Everhart Guides from the WoW Forever beta and Wowhead&apos;s Forever dungeon guides
            {d.guide && <> (<button className="link-btn inline" onClick={() => openExternal(d.guide)}>read the full guide</button>)</>}.
            Abilities, loot and drop chances from Wowhead&apos;s Forever database, {day(DUNGEON_META.importedAt)}.
          </p>
        </aside>
      </div>
      {tip && <LootTip tip={tip} />}
    </div>
  );
}
