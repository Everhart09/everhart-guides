import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/icons.jsx';
import { ClassEmblem } from '../components/GameIcon.jsx';
import BackButton from '../components/BackButton.jsx';
import { iconByName } from '../lib/icons.js';
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
      for (const c of chars.filter((x) => x.fav && Date.now() - (x.data?.fetchedAt ?? 0) > REFRESH_AFTER_MS)) await refresh(c);
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

function CharacterDetail({ c, nav, busy, onRefresh, onRemove }) {
  const d = c.data;
  const cls = classOf(d);
  const spec = specOf(cls, d.talents);
  const totals = cls ? treePoints(cls, d.talents) : {};
  const spent = Object.values(totals).reduce((a, b) => a + b, 0);
  const next = nextPicks(cls, spec, d.talents, d.level);
  const [error, setError] = useState(null);

  const openGuide = (tab) => {
    if (!cls) return;
    const s = spec ?? cls.specs[0];
    try { localStorage.setItem(`everhart.level.talents.${cls.id}/${s.id}`, String(Math.max(1, d.level ?? 1))); } catch { /* fine */ }
    nav.guide(cls.id, s.id, tab);
  };
  const doRefresh = async () => {
    setError(null);
    const res = await onRefresh();
    if (!res.ok) setError(res.error);
  };

  return (
    <section className="panel ar-detail" style={{ '--c': cls?.color ?? 'var(--gold)' }}>
      <header className="ar-detail-head">
        <Portrait d={d} cls={cls} size={72} />
        <div>
          <div className="kicker">{[REGIONS.find((r) => r.id === c.region)?.label, d.ruleset, d.faction && d.faction[0] + d.faction.slice(1).toLowerCase()].filter(Boolean).join(' · ')}</div>
          <h2>{fullName(d)}</h2>
          <p>Level {d.level} {d.race} {spec ? `${spec.name} ` : ''}{d.className}{d.guild ? ` · <${d.guild}>` : ''}{d.itemLevel ? ` · item level ${d.itemLevel}` : ''}</p>
          <p className="muted">Updated {ago(d.fetchedAt)}. Blizzard updates a character a little while after you log out.</p>
        </div>
        <div className="ar-detail-actions">
          {cls && <button className="btn-primary" onClick={() => openGuide('talents')}>Open {spec ? spec.name : cls.name} talents at level {d.level} <Icon name="arrow" size={13} /></button>}
          {onRefresh && <button className="btn-ghost" disabled={busy} onClick={doRefresh}>{busy ? 'Updating…' : 'Update now'}</button>}
          <button className="btn-ghost" onClick={onRemove}>Remove</button>
        </div>
      </header>
      {error && <p className="ar-error">{error}</p>}

      <div className="ar-detail-grid">
        <div className="ar-block">
          <h3>Talents {spent > 0 && <span className="muted">{cls?.trees.map((t) => totals[t.id] ?? 0).join(' / ')}</span>}</h3>
          {spent === 0 && <p className="muted">No talent points found{d.level < 10 ? ' (talents start at level 10)' : ''}.</p>}
          {next.length > 0 && (
            <>
              <p className="ar-next-label">Next in the {spec.name} {d.level >= 60 ? 'Level 60' : 'leveling'} build:</p>
              <ul className="ar-next">
                {next.map((p) => <li key={p.level}><span className="po-level">{p.level}</span>{p.name} <span className="muted">{p.rank}/{p.max}</span></li>)}
              </ul>
            </>
          )}
          {spent > 0 && spec && next.length === 0 && <p className="muted">Every point matches the guide build.</p>}
        </div>

        <div className="ar-block">
          <h3>Professions</h3>
          {d.professions?.length ? (
            <ul className="ar-profs">
              {d.professions.map((p) => <li key={p.name}><span>{p.name}</span><b>{p.skill ?? '?'}{p.max ? ` / ${p.max}` : ''}</b></li>)}
            </ul>
          ) : <p className="muted">No professions found.</p>}
        </div>

        <div className="ar-block">
          <h3>Progress</h3>
          <ul className="ar-history">
            {[...c.history].reverse().slice(0, 8).map((h) => (
              <li key={h.at}><span className="muted">{new Date(h.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span> Level {h.level}{h.itemLevel ? ` · ilvl ${h.itemLevel}` : ''}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="ar-block">
        <h3>Equipment</h3>
        {d.items?.length ? (
          <ul className="ar-gear">
            {d.items.map((it) => (
              <li key={it.slotType || it.slot}>
                {it.icon ? <img src={iconByName(it.icon)} alt="" width={30} height={30} /> : <span className="ar-gear-empty" />}
                <div>
                  <span className={`q-${it.quality}`}>{it.name}</span>
                  <span className="muted">{it.slot}{it.itemLevel ? ` · ilvl ${it.itemLevel}` : ''}{it.enchant ? ` · ${it.enchant}` : ''}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="muted">No equipment found.</p>}
      </div>
    </section>
  );
}
