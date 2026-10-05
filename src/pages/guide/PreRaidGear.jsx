import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GEAR } from '../../data/gearData.js';
import { GEAR_PROFILES, STAT_NAMES } from '../../data/gearProfiles.js';
import { Icon } from '../../components/icons.jsx';
import { iconByName } from '../../lib/icons.js';
import { openExternal } from '../../lib/updates.js';

const SLOT_ORDER = [
  ['head', 'Head'], ['neck', 'Neck'], ['shoulders', 'Shoulders'], ['back', 'Back'], ['chest', 'Chest'], ['wrist', 'Wrist'],
  ['hands', 'Hands'], ['waist', 'Waist'], ['legs', 'Legs'], ['feet', 'Feet'], ['finger', 'Rings'], ['trinket', 'Trinkets'],
];
const WEAPON_SLOTS = [['twoHand', 'Two-Hand'], ['mainHand', 'Main Hand'], ['offHand', 'Off Hand'], ['shield', 'Shield'], ['ranged', 'Ranged'], ['relic', 'Relic']];
const SETUP_NAMES = { '2h': 'Two-handed weapon', dw: 'Dual wield', '1h+shield': 'One-hander + shield', staff: 'Staff', 'one-hand': 'One-hander + off-hand' };
// Which weapon slots belong to the recommended setup (the rest are shown as alternatives).
const SETUP_SLOTS = { '2h': ['twoHand'], dw: ['mainHand', 'offHand'], '1h+shield': ['mainHand', 'shield'], staff: ['twoHand'], 'one-hand': ['mainHand', 'offHand', 'shield'] };
const SIDE = { 1: 'Alliance', 2: 'Horde' };
const wowheadUrl = (id) => `https://www.wowhead.com/forever/item=${id}`;
const day = (ymd) => new Date(ymd + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

function ItemTip({ tip }) {
  const { item, score } = tip;
  const stats = Object.entries(item.stats).filter(([k]) => k !== 'speed' && k !== 'dps');
  return createPortal(
    <div className="talent-tip item-tip" style={{ left: tip.x, top: tip.y }}>
      <div className="tt-head">
        {item.icon && <img src={iconByName(item.icon)} alt="" width={36} height={36} />}
        <div className={`tt-name q${item.quality}`}>{item.name}</div>
      </div>
      <div className="tt-rank">Item level {item.ilvl} · Requires level {item.reqlevel}</div>
      <div className="it-type">{item.typeName}{item.stats.dps ? ` · ${item.stats.dps.toFixed(1)} DPS · ${item.stats.speed?.toFixed(2)} speed` : ''}</div>
      <ul className="it-stats">
        {stats.map(([k, v]) => <li key={k}><span>{STAT_NAMES[k] ?? k}</span><b>+{v}</b></li>)}
      </ul>
      <div className="it-source">{item.source.text}</div>
      {item.forever !== 'unchanged' && <div className="it-forever">{item.forever === 'new' ? 'New in WoW Forever' : 'Changed in WoW Forever'}</div>}
      <div className="tt-levels">Score for this spec: {score}</div>
    </div>,
    document.body,
  );
}

function ItemRow({ entry, rank, onTip }) {
  const item = GEAR.items[entry.id];
  if (!item) return null;
  const show = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onTip({ item, score: entry.score, x: Math.min(r.right + 12, window.innerWidth - 300), y: Math.max(8, Math.min(r.top, window.innerHeight - 320)) });
  };
  return (
    <li className={`gear-item ${rank === 0 ? 'best' : ''}`} onMouseEnter={show} onMouseLeave={() => onTip(null)}>
      {item.icon ? <img className={`gear-icon q${item.quality}`} src={iconByName(item.icon)} alt="" width={36} height={36} /> : <span className="gear-icon" />}
      <div className="gear-text">
        <div className="gear-name">
          <span className={`q${item.quality}`}>{item.name}</span>
          {item.forever === 'new' && <em className="badge new">New</em>}
          {item.forever === 'updated' && <em className="badge changed">Changed</em>}
          {SIDE[item.side] && <em className={`badge side-${item.side}`}>{SIDE[item.side]}</em>}
        </div>
        <div className="gear-source">{item.source.text}</div>
      </div>
      <span className="gear-ilvl">i{item.ilvl}</span>
      <button className="gear-link" onClick={() => openExternal(wowheadUrl(item.id))} title="Open on Wowhead"><Icon name="arrow" size={12} /></button>
    </li>
  );
}

function SlotCard({ label, list, picks = 1, recommended = true, onTip }) {
  const [open, setOpen] = useState(false);
  const shown = open ? list : list.slice(0, picks);
  return (
    <section className={`gear-slot ${recommended ? '' : 'alt-setup'}`}>
      <header>
        <h4>{label}</h4>
        {!recommended && <span className="gear-alt-tag">Alternative setup</span>}
      </header>
      <ol>{shown.map((e, i) => <ItemRow key={e.id} entry={e} rank={i < picks ? 0 : 1} onTip={onTip} />)}</ol>
      {list.length > picks && (
        <button className="gear-more" onClick={() => setOpen(!open)}>
          {open ? 'Show less' : `${list.length - picks} more option${list.length - picks === 1 ? '' : 's'}`}
        </button>
      )}
    </section>
  );
}

export default function PreRaidGear({ cls, spec }) {
  const [tip, setTip] = useState(null);
  const data = GEAR.specs[`${cls.id}/${spec.id}`];
  if (!data) return null;
  const setupSlots = SETUP_SLOTS[data.setup] ?? [];

  return (
    <section className="panel pre-raid span-full">
      <header className="panel-head">
        <div>
          <div className="kicker">From the WoW Forever item database</div>
          <h3>Pre-raid gear</h3>
        </div>
        <div className="gear-meta">
          <span className="meta-pill">Best setup: {SETUP_NAMES[data.setup] ?? data.setup}</span>
          <span className="fine">Item level ≤ {GEAR.meta.maxItemLevel} · updated {day(GEAR.meta.importedAt)}</span>
        </div>
      </header>
      <p className="gear-intro">
        The best items you can get before raiding — dungeons, quests, crafting, reputation and honor — ranked for {spec.name}{' '}
        {cls.name} using Forever stat weights for this spec (listed at the bottom). Hover an item for its stats; the arrow opens it on Wowhead.
      </p>

      <div className="gear-grid">
        {SLOT_ORDER.filter(([k]) => data.slots[k]).map(([k, label]) => (
          <SlotCard key={k} label={label} list={data.slots[k]} picks={k === 'finger' || k === 'trinket' ? 2 : 1} onTip={setTip} />
        ))}
      </div>

      <h4 className="gear-sub">Weapons</h4>
      <div className="gear-grid">
        {WEAPON_SLOTS.filter(([k]) => data.slots[k]).map(([k, label]) => (
          <SlotCard key={k} label={label} list={data.slots[k]} recommended={k === 'ranged' || k === 'relic' || setupSlots.includes(k)} onTip={setTip} />
        ))}
      </div>

      <p className="fine gear-notes">
        Trinkets are ranked by their stats only — on-use and proc effects aren&apos;t scored, so check those yourself. Items marked
        Alliance/Horde are faction-only. Raid drops, raid-linked quests and high-rank PvP gear are left out. Rankings use the stat
        weights below and will update as the beta item data changes.
      </p>
      <div className="gear-weights">
        <span className="kicker">How items are scored</span>
        <div className="chips">
          {Object.entries(GEAR_PROFILES[cls.id]?.[spec.id]?.weights ?? {}).sort((a, b) => b[1] - a[1]).map(([k, w]) => (
            <span key={k} className="chip">{STAT_NAMES[k] ?? k} <b>{w}</b></span>
          ))}
          {GEAR_PROFILES[cls.id]?.[spec.id]?.dps > 0 && <span className="chip">Weapon DPS <b>{GEAR_PROFILES[cls.id][spec.id].dps}</b></span>}
        </div>
      </div>
      {tip && <ItemTip tip={tip} />}
    </section>
  );
}
