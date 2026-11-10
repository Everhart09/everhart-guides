import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/icons.jsx';
import { ClassEmblem } from '../components/GameIcon.jsx';
import BackButton from '../components/BackButton.jsx';
import { iconByName, professionIcon, talentIcon } from '../lib/icons.js';
import { treePoints, specOf, nextPicks, classOf, charKey, useCharacters, upsertCharacter, toggleCharacterFav, removeCharacter, REGIONS } from '../lib/armory.js';

const bridge = () => globalThis.everhart?.armory ?? null;
const REFRESH_AFTER_MS = 30 * 60 * 1000;
const REGION_KEY = 'everhart.armory.region';
const SELECTED_KEY = 'everhart.armory.selected';
const store = {
  get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

function ago(ms) {
  if (!ms) return 'never';
  const m = Math.round((Date.now() - ms) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
const fullName = (d) => [d.name, d.surname].filter(Boolean).join(' ');

/** Your WoW Forever characters, looked up from Blizzard with your own API key. */
export default function ArmoryPage({ nav }) {
  const api = bridge();
  const chars = useCharacters();
  const [hasKey, setHasKey] = useState(null);
  const [selected, setSelected] = useState(() => store.get(SELECTED_KEY, null));
  const [busy, setBusy] = useState({}); // charKey -> true while refreshing

  useEffect(() => { api?.hasKey().then(setHasKey); }, [api]);

  const select = (k) => { setSelected(k); store.set(SELECTED_KEY, k ?? ''); };
  const refresh = async (c) => {
    const k = charKey(c);
    setBusy((b) => ({ ...b, [k]: true }));
    const res = await api.lookup({ region: c.region, name: c.slug });
    setBusy((b) => ({ ...b, [k]: false }));
    if (res.ok) upsertCharacter(res.character);
    return res;
  };

  // Favorites refresh themselves when the page opens, if they're more than half an hour old.
  const autoRan = useRef(false);
  useEffect(() => {
    if (!api || !hasKey || autoRan.current) return;
    autoRan.current = true;
    (async () => {
      // Characters saved before the character sheet (no stats yet) also refresh once.
      const stale = (x) => !x.data?.stats || (x.fav && Date.now() - (x.data?.fetchedAt ?? 0) > REFRESH_AFTER_MS);
      for (const c of chars.filter(stale)) await refresh(c);
    })();
  }, [api, hasKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = useMemo(() => [...chars].sort((a, b) => (b.fav - a.fav) || ((b.data?.level ?? 0) - (a.data?.level ?? 0))), [chars]);
  const current = chars.find((c) => charKey(c) === selected) ?? sorted[0] ?? null;

  return (
    <div className="page armory-page">
      <BackButton nav={nav} />
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="heart" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">WoW Forever · Your characters</div>
          <h1>Armory</h1>
          <p className="hero-desc">
            Add your characters to see their level, gear, talents and professions straight from Blizzard, follow their progress,
            and jump to the right guide at the right level. Favorites update by themselves each time you open this page.
          </p>
        </div>
      </header>

      {!api && (
        <section className="panel"><p className="muted">The Armory needs the desktop app: it signs in to Blizzard with your API key on your computer.</p></section>
      )}

      {api && hasKey !== null && <KeyPanel hasKey={hasKey} onChange={setHasKey} />}
      {api && hasKey && <AddCharacter onAdded={(c) => select(charKey(c))} />}

      {sorted.length > 0 && (
        <div className="ar-grid">
          {sorted.map((c) => (
            <CharacterCard key={charKey(c)} c={c} active={current && charKey(c) === charKey(current)} busy={busy[charKey(c)]}
              onSelect={() => select(charKey(c))} onRefresh={hasKey ? () => refresh(c) : null} />
          ))}
        </div>
      )}

      {current && <CharacterDetail c={current} nav={nav} busy={busy[charKey(current)]} onRefresh={hasKey ? () => refresh(current) : null}
        onRemove={() => { removeCharacter(charKey(current)); select(null); }} />}
    </div>
  );
}

function KeyPanel({ hasKey, onChange }) {
  const [open, setOpen] = useState(!hasKey);
  const [id, setId] = useState('');
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState(null);
  const api = bridge();
  const link = (url) => (e) => { e.preventDefault(); globalThis.everhart?.openExternal?.(url); };

  const saveKey = async () => {
    setStatus({ busy: true });
    const res = await api.setKey({ id, secret });
    setStatus(res.ok ? { ok: 'Key saved. You can add characters now.' } : { error: res.error });
    if (res.ok) { setId(''); setSecret(''); setOpen(false); onChange(true); }
  };
  const removeKey = async () => {
    await api.setKey(null);
    onChange(false);
    setOpen(true);
    setStatus(null);
  };

  if (hasKey && !open) {
    return (
      <section className="panel ar-key ar-key-ok">
        <Icon name="check" size={15} />
        <span>Blizzard API key saved on this computer.</span>
        <button className="btn-ghost" onClick={() => setOpen(true)}>Change</button>
        <button className="btn-ghost" onClick={removeKey}>Remove</button>
      </section>
    );
  }
  return (
    <section className="panel ar-key">
      <div className="kicker">One-time setup</div>
      <h3>Connect your Blizzard API key</h3>
      <ol className="ar-steps">
        <li>Open <a href="https://develop.battle.net/access/clients" onClick={link('https://develop.battle.net/access/clients')}>develop.battle.net/access/clients</a> and sign in with your Battle.net account.</li>
        <li>Click <b>Create Client</b>. Any name works (for example "Everhart Guides"); leave the redirect URL empty and the service URL blank or any website.</li>
        <li>Copy the <b>Client ID</b> and <b>Client Secret</b> into the boxes below.</li>
      </ol>
      <p className="muted ar-note">The key is stored encrypted on this computer and is only sent to Blizzard. It reads public character data; it can't see or change anything on your account.</p>
      <div className="ar-key-form">
        <input type="text" placeholder="Client ID" value={id} onChange={(e) => setId(e.target.value)} spellCheck={false} />
        <input type="password" placeholder="Client Secret" value={secret} onChange={(e) => setSecret(e.target.value)} spellCheck={false} />
        <button className="btn-primary" disabled={!id.trim() || !secret.trim() || status?.busy} onClick={saveKey}>{status?.busy ? 'Checking…' : 'Save key'}</button>
        {hasKey && <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>}
      </div>
      {status?.error && <p className="ar-error">{status.error}</p>}
      {status?.ok && <p className="ar-ok">{status.ok}</p>}
    </section>
  );
}

function AddCharacter({ onAdded }) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState(() => store.get(REGION_KEY, 'us'));
  const [status, setStatus] = useState(null);
  const add = async (e) => {
    e.preventDefault();
    setStatus({ busy: true });
    const res = await bridge().lookup({ region, name });
    if (!res.ok) { setStatus({ error: res.error }); return; }
    upsertCharacter(res.character);
    onAdded(res.character);
    setName('');
    setStatus(null);
  };
  return (
    <form className="panel ar-add" onSubmit={add}>
      <input type="text" placeholder="Character name, e.g. Morgan Ladimore" value={name} onChange={(e) => setName(e.target.value)} spellCheck={false} />
      <div className="seg" role="radiogroup" aria-label="Region">
        {REGIONS.map((r) => (
          <button type="button" key={r.id} role="radio" aria-checked={region === r.id} className={region === r.id ? 'active' : ''}
            onClick={() => { setRegion(r.id); store.set(REGION_KEY, r.id); }}>{r.label}</button>
        ))}
      </div>
      <button className="btn-primary" type="submit" disabled={!name.trim() || status?.busy}>{status?.busy ? 'Looking up…' : 'Add character'}</button>
      {status?.error && <p className="ar-error">{status.error}</p>}
    </form>
  );
}

function Portrait({ d, cls, size }) {
  const [broken, setBroken] = useState(false);
  const src = d.images?.avatar;
  if (src && !broken) return <img className="ar-avatar" src={src} alt="" width={size} height={size} onError={() => setBroken(true)} />;
  return <span className="ar-avatar ar-avatar-fallback" style={{ width: size, height: size }}>{cls ? <ClassEmblem id={cls.id} size={size * 0.7} /> : null}</span>;
}

function CharacterCard({ c, active, busy, onSelect, onRefresh }) {
  const d = c.data;
  const cls = classOf(d);
  return (
    <article className={`ar-card ${active ? 'active' : ''}`} style={{ '--c': cls?.color ?? 'var(--gold)' }} onClick={onSelect}>
      <Portrait d={d} cls={cls} size={52} />
      <div className="ar-card-text">
        <strong>{fullName(d)}</strong>
        <span>Level {d.level} {d.race} {d.className}</span>
        <span className="ar-card-sub">{[d.guild && `<${d.guild}>`, REGIONS.find((r) => r.id === c.region)?.label].filter(Boolean).join(' · ')}</span>
      </div>
      <div className="ar-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className={`ar-fav ${c.fav ? 'on' : ''}`} title={c.fav ? 'Remove from favorites' : 'Add to favorites'} onClick={() => toggleCharacterFav(charKey(c))}><Icon name="star" size={15} /></button>
        {onRefresh && <button title={`Update from Blizzard (last ${ago(d.fetchedAt)})`} disabled={busy} onClick={onRefresh}><Icon name="download" size={15} /></button>}
      </div>
    </article>
  );
}


// --- Character sheet (laid out like the in-game character panel) ----------------------------------

const LEFT_SLOTS = ['HEAD', 'NECK', 'SHOULDER', 'BACK', 'CHEST', 'SHIRT', 'TABARD', 'WRIST'];
const RIGHT_SLOTS = ['HANDS', 'WAIST', 'LEGS', 'FEET', 'FINGER_1', 'FINGER_2', 'TRINKET_1', 'TRINKET_2'];
const BOTTOM_SLOTS = ['MAIN_HAND', 'OFF_HAND', 'RANGED'];
const SLOT_ICON = {
  HEAD: 'head', NECK: 'neck', SHOULDER: 'shoulder', BACK: 'chest', CHEST: 'chest', SHIRT: 'shirt', TABARD: 'tabard', WRIST: 'wrists',
  HANDS: 'hands', WAIST: 'waist', LEGS: 'legs', FEET: 'feet', FINGER_1: 'finger', FINGER_2: 'finger', TRINKET_1: 'trinket', TRINKET_2: 'trinket',
  MAIN_HAND: 'mainhand', OFF_HAND: 'offhand', RANGED: 'ranged',
};
const SLOT_NAME = { FINGER_1: 'Finger', FINGER_2: 'Finger', TRINKET_1: 'Trinket', TRINKET_2: 'Trinket', MAIN_HAND: 'Main Hand', OFF_HAND: 'Off Hand' };
const CASTERS = ['mage', 'warlock', 'priest'];

function Slot({ type, item, side }) {
  const icon = item?.icon ? iconByName(item.icon) : iconByName(`inventoryslot_${SLOT_ICON[type]}`);
  return (
    <div className={`ar-slot ar-slot-${side} ${item ? `has q-border-${item.quality}` : 'empty'}`}>
      <span className="ar-slot-icon"><img src={icon} alt="" width={44} height={44} /></span>
      {item && (
        <span className="ar-slot-text">
          <span className={`q-${item.quality}`}>{item.name}</span>
          {item.itemLevel != null && <em>{item.itemLevel}</em>}
        </span>
      )}
      {item && (
        <div className="ar-tip" role="tooltip">
          <b className={`q-${item.quality}`}>{item.name}</b>
          {item.itemLevel != null && <span className="ar-tip-gold">Item Level {item.itemLevel}</span>}
          {(item.lines ?? []).map((l, i) => <span key={i} className={l.kind ? `ar-tip-${l.kind}` : ''}>{l.text}</span>)}
          {!item.lines && item.enchant && <span className="ar-tip-green">{item.enchant}</span>}
        </div>
      )}
      {!item && <div className="ar-tip ar-tip-small" role="tooltip"><span>{SLOT_NAME[type] ?? type[0] + type.slice(1).toLowerCase()} (empty)</span></div>}
    </div>
  );
}

function Stat({ icon, color, value, label }) {
  if (value == null) return null;
  return (
    <div className="ar-stat" style={{ '--s': color }}>
      <span className="ar-stat-ring"><Icon name={icon} size={20} /></span>
      <span><b>{value}</b><em>{label}</em></span>
    </div>
  );
}

function CharacterDetail({ c, nav, busy, onRefresh, onRemove }) {
  const d = c.data;
  const cls = classOf(d);
  const spec = specOf(cls, d.talents);
  const totals = cls ? treePoints(cls, d.talents) : {};
  const spent = d.spec?.spent ?? Object.values(totals).reduce((a, b) => a + b, 0);
  const next = nextPicks(cls, spec, d.talents, d.level);
  const [error, setError] = useState(null);
  const bySlot = Object.fromEntries((d.items ?? []).map((it) => [it.slotType, it]));
  const s = d.stats ?? {};
  const crit = cls && CASTERS.includes(cls.id) ? s.spellCrit : cls?.id === 'hunter' ? s.rangedCrit : s.meleeCrit;
  const faction = (d.faction ?? '').toLowerCase();
  const tree = spec && cls.trees.find((t) => t.id === spec.tree);
  const capstone = tree && [...tree.talents].sort((a, b) => b.row - a.row)[0];

  const openGuide = (tab) => {
    if (!cls) return;
    const sp = spec ?? cls.specs[0];
    try { localStorage.setItem(`everhart.level.talents.${cls.id}/${sp.id}`, String(Math.max(1, d.level ?? 1))); } catch { /* fine */ }
    nav.guide(cls.id, sp.id, tab);
  };
  const doRefresh = async () => {
    setError(null);
    const res = await onRefresh();
    if (!res.ok) setError(res.error);
  };

  return (
    <section className={`ar-sheet faction-${faction || 'none'}`} style={{ '--c': cls?.color ?? 'var(--gold)' }}>
      <header className="ar-sheet-head">
        {(faction === 'horde' || faction === 'alliance') && <img className="ar-crest" src={`./brand/${faction}.png`} alt={d.faction} />}
        <div className="ar-sheet-title">
          <h2>{fullName(d)}</h2>
          <p>
            {d.itemLevel != null && <span className="ar-ilvl">{d.itemLevel} ILVL</span>}
            <span>{d.level} {d.race} {d.className}</span>
            {d.guild && <span className="ar-guild">&lt;{d.guild}&gt;</span>}
            {d.ruleset && <span>· {d.ruleset}</span>}
          </p>
        </div>
        <div className="ar-detail-actions">
          {onRefresh && <button className="btn-ghost" disabled={busy} onClick={doRefresh}>{busy ? 'Updating…' : 'Update now'}</button>}
          <button className="btn-ghost" onClick={onRemove}>Remove</button>
        </div>
      </header>
      {error && <p className="ar-error">{error}</p>}

      <div className="ar-doll">
        <div className="ar-doll-col">{LEFT_SLOTS.map((t) => <Slot key={t} type={t} item={bySlot[t]} side="left" />)}</div>
        <div className="ar-doll-center">
          {d.images?.main ? <img className="ar-render" src={d.images.main} alt="" /> : <span className="ar-render-none">{cls && <ClassEmblem id={cls.id} size={96} />}</span>}
        </div>
        <div className="ar-doll-col">{RIGHT_SLOTS.map((t) => <Slot key={t} type={t} item={bySlot[t]} side="right" />)}</div>
        <div className="ar-doll-bottom">{BOTTOM_SLOTS.map((t, i) => <Slot key={t} type={t} item={bySlot[t]} side={i === 0 ? 'left' : 'right'} />)}</div>
        <span className="ar-updated">Updated {ago(d.fetchedAt)} · Blizzard updates a character a little while after you log out</span>
      </div>

      {d.stats && (
        <div className="ar-stats">
          <Stat icon="heart" color="#2fd16a" value={s.health} label="Health" />
          <Stat icon="star" color={s.powerType === 'Rage' ? '#e5484d' : s.powerType === 'Energy' ? '#f5d042' : '#3b8cf0'} value={s.power} label={s.powerType ?? 'Mana'} />
          <Stat icon="sword" color="#e5484d" value={s.strength} label="Strength" />
          <Stat icon="info" color="#e05cc4" value={s.intellect} label="Intellect" />
          <Stat icon="arrow" color="#f5c242" value={s.agility} label="Agility" />
          <Stat icon="shield" color="#f08a3c" value={s.stamina} label="Stamina" />
          <Stat icon="plus" color="#e5484d" value={crit != null ? `${crit}%` : null} label="Critical Strike" />
          <Stat icon="sun" color="#8fb4ff" value={s.spirit} label="Spirit" />
        </div>
      )}

      <div className="ar-sections">
        <div className="ar-block">
          <h3>Specialization</h3>
          <div className="ar-spec-card">
            {capstone && <img src={talentIcon(cls.id, capstone.name)} alt="" width={46} height={46} />}
            <div>
              <em>Active specialization</em>
              <b>{d.spec?.name ?? spec?.name ?? 'None yet'}</b>
              <span>{spent} Points Spent{cls && spent > 0 ? ` · ${cls.trees.map((t) => totals[t.id] ?? 0).join(' / ')}` : ''}</span>
            </div>
          </div>
          {next.length > 0 && (
            <>
              <p className="ar-next-label">Next in the {spec.name} {d.level >= 60 ? 'Level 60' : 'leveling'} build:</p>
              <ul className="ar-next">
                {next.map((p) => <li key={p.level}><span className="po-level">{p.level}</span>{p.name} <span className="muted">{p.rank}/{p.max}</span></li>)}
              </ul>
            </>
          )}
          {cls && <button className="btn-link" onClick={() => openGuide('talents')}>View talent details at level {d.level} <Icon name="arrow" size={12} /></button>}
        </div>

        <div className="ar-block">
          <h3>Professions</h3>
          {d.professions?.length ? (
            <div className="ar-prof-grid">
              {d.professions.map((p) => {
                const id = p.name.toLowerCase().replace(/\s+/g, '-');
                const pct = p.max ? Math.min(100, (100 * (p.skill ?? 0)) / p.max) : 0;
                return (
                  <div key={p.name} className="ar-prof">
                    <span className="ar-prof-name">{professionIcon(id) && <img src={professionIcon(id)} alt="" width={22} height={22} />}{p.name}</span>
                    <span className="ar-bar"><span style={{ width: `${pct}%` }} /><b>{p.skill ?? '?'}{p.max ? ` / ${p.max}` : ''}</b></span>
                  </div>
                );
              })}
            </div>
          ) : <p className="muted">No professions found.</p>}
        </div>
      </div>

      <div className="ar-sections">
        {d.pvp && (
          <div className="ar-block">
            <h3>Player vs Player</h3>
            <div className="ar-pvp">
              <div><b>{d.pvp.honorableKills}</b><em>Honorable Kills</em></div>
              <div><b>{d.pvp.rank}</b><em>Rank</em></div>
            </div>
          </div>
        )}
        <div className="ar-block">
          <h3>Progress</h3>
          <ul className="ar-history">
            {[...c.history].reverse().slice(0, 8).map((h) => (
              <li key={h.at}><span className="muted">{new Date(h.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span> Level {h.level}{h.itemLevel ? ` · ilvl ${h.itemLevel}` : ''}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
