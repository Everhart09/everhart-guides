import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CLASSES, getClass, getSpec } from '../data/classes/index.js';
import { TALENT_META } from '../data/talents/index.js';
import { ClassEmblem } from '../components/GameIcon.jsx';
import { Icon } from '../components/icons.jsx';
import { talentIcon } from '../lib/icons.js';
import { TOTAL_POINTS, indexTalents, rankText, reqPoints } from '../lib/talents.js';
import {
  addBlocker, decodeBuild, encodeBuild, isLegal, legalOrder, levelForPoints, orderFromBuild,
  ranksOf, removeBlocker, removeLast,
} from '../lib/calculator.js';
import TalentTree from './guide/TalentTree.jsx';

const SAVED_KEY = 'everhart.calc.saved';
const stateKey = (classId) => `everhart.calc.${classId}`;

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/** A guide build as a calculator order. Points that don't fit the current trees are skipped. */
function specOrder(talents, spec) {
  const order = [];
  const ranks = {};
  for (const name of orderFromBuild(spec.build)) {
    if (!talents[name] || addBlocker(talents, ranks, name)) continue;
    ranks[name] = (ranks[name] || 0) + 1;
    order.push(name);
  }
  return order;
}

function initialOrder(cls, talents, fromSpec) {
  const spec = fromSpec && getSpec(cls, fromSpec);
  if (spec) return specOrder(talents, spec);
  const saved = readJSON(stateKey(cls.id), []);
  const order = Array.isArray(saved) ? saved.filter((n) => talents[n]) : [];
  return isLegal(talents, ranksOf(order)) ? legalOrder(talents, order) : [];
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  }
}

export default function TalentCalculator({ classId, fromSpec, nav }) {
  const cls = getClass(classId) ?? CLASSES[0];
  const talents = useMemo(() => indexTalents(cls), [cls]);
  const [order, setOrder] = useState(() => initialOrder(cls, talents, fromSpec));
  const [tip, setTip] = useState(null);
  const [notice, setNotice] = useState(null);
  const [importText, setImportText] = useState('');
  const [saveName, setSaveName] = useState('');
  const [saved, setSaved] = useState(() => readJSON(SAVED_KEY, []));

  const ranks = useMemo(() => ranksOf(order), [order]);
  const totals = useMemo(() => {
    const t = {};
    for (const [name, r] of Object.entries(ranks)) t[talents[name].tree] = (t[talents[name].tree] || 0) + r;
    return t;
  }, [ranks, talents]);
  const spent = order.length;
  const code = encodeBuild(cls, order);
  const treeById = Object.fromEntries(cls.trees.map((t) => [t.id, t]));
  const mainTree = cls.trees.reduce((best, t) => ((totals[t.id] || 0) > (totals[best.id] || 0) ? t : best), cls.trees[0]);
  const fromSpecName = fromSpec && getSpec(cls, fromSpec)?.name;

  useEffect(() => writeJSON(stateKey(cls.id), order), [cls.id, order]);
  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(id);
  }, [notice]);

  const flash = (text, kind = 'info') => setNotice({ text, kind });

  const add = (name) => {
    const blocker = addBlocker(talents, ranks, name);
    if (blocker) return flash(`${name}: ${blocker}`, 'warn');
    setOrder([...order, name]);
  };
  const remove = (name) => {
    const blocker = removeBlocker(talents, ranks, name);
    if (blocker) return flash(`${name}: ${blocker}`, 'warn');
    setOrder(legalOrder(talents, removeLast(order, name)));
  };
  const resetTree = (treeId) => setOrder(legalOrder(talents, order.filter((n) => talents[n].tree !== treeId)));
  const loadSpec = (spec) => {
    setOrder(specOrder(talents, spec));
    flash(`Loaded the ${spec.name} guide build`);
  };
  const doImport = () => {
    const result = decodeBuild(cls, importText);
    if (result.error) return flash(result.error, 'warn');
    setOrder(result.order);
    setImportText('');
    flash('Build imported');
  };
  const doSave = () => {
    const name = saveName.trim() || `${mainTree.name} ${cls.name} (${spent} pts)`;
    const entry = { id: Date.now().toString(36), name, classId: cls.id, code, savedAt: new Date().toISOString() };
    const next = [entry, ...saved].slice(0, 50);
    setSaved(next);
    writeJSON(SAVED_KEY, next);
    setSaveName('');
    flash(`Saved "${name}"`);
  };
  const loadSaved = (entry) => {
    const result = decodeBuild(cls, entry.code);
    if (result.error) return flash(`Can't load "${entry.name}": ${result.error}`, 'warn');
    setOrder(result.order);
    flash(`Loaded "${entry.name}"`);
  };
  const deleteSaved = (entry) => {
    const next = saved.filter((s) => s.id !== entry.id);
    setSaved(next);
    writeJSON(SAVED_KEY, next);
  };

  const mySaved = saved.filter((s) => s.classId === cls.id);
  const tipRank = tip ? ranks[tip.talent.name] || 0 : 0;
  const tipBlocker = tip ? addBlocker(talents, ranks, tip.talent.name) : null;

  return (
    <div className="page calc" style={{ '--cls': cls.color }}>
      <header className="calc-head">
        <div>
          <div className="kicker">WoW Forever · Talent Calculator</div>
          <h1>{cls.name} <span className="h1-sub">{spent ? `${mainTree.name}` : 'talents'}</span></h1>
          <p className="calc-hint">
            Click a talent to add a point, right-click (or Shift-click) to remove one. All the rules of the
            real Forever trees are enforced.
          </p>
        </div>
        <div className="calc-classes" role="tablist" aria-label="Class">
          {CLASSES.map((c) => (
            <button key={c.id} className={`pn-class ${c.id === cls.id ? 'active' : ''}`} style={{ '--c': c.color }}
              onClick={() => nav.calc(c.id)} title={c.name} aria-selected={c.id === cls.id}>
              <ClassEmblem id={c.id} size={26} />
            </button>
          ))}
        </div>
      </header>

      <section className="panel calc-bar">
        <div className="calc-stat">
          <span className="pl-label">Points</span>
          <span className="calc-big">{spent}<em> / {TOTAL_POINTS}</em></span>
          <span className="calc-sub">{TOTAL_POINTS - spent} left</span>
        </div>
        <div className="calc-stat">
          <span className="pl-label">Required level</span>
          <span className="calc-big">{levelForPoints(spent) ?? '—'}</span>
          <span className="calc-sub">First point at 10</span>
        </div>
        <div className="calc-stat">
          <span className="pl-label">Split</span>
          <span className="calc-split">
            {cls.trees.map((t) => <span key={t.id} style={{ '--t': t.color }} title={t.name}>{totals[t.id] || 0}</span>)}
          </span>
          <span className="calc-sub">{cls.trees.map((t) => t.name).join(' / ')}</span>
        </div>
        <div className="calc-actions">
          <label className="calc-select">
            <span>Load guide build</span>
            <select value="" onChange={(e) => { const s = getSpec(cls, e.target.value); if (s) loadSpec(s); }}>
              <option value="" disabled>Choose a spec…</option>
              {cls.specs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <button className="btn-ghost" onClick={() => setOrder(order.slice(0, -1))} disabled={!spent}>
            <Icon name="first" size={12} /> Undo
          </button>
          <button className="btn-ghost danger" onClick={() => setOrder([])} disabled={!spent}>
            <Icon name="x" size={12} /> Reset all
          </button>
        </div>
      </section>

      {fromSpecName && (
        <p className="calc-from">
          Started from the <b>{fromSpecName}</b> guide build — change anything you like.
          <button className="link-btn" onClick={() => nav.guide(cls.id, fromSpec, 'talents')}>Back to the guide</button>
        </p>
      )}

      <div className="trees">
        {cls.trees.map((tree) => (
          <TalentTree
            key={tree.id}
            classId={cls.id}
            tree={tree}
            talents={talents}
            ranks={ranks}
            spent={totals[tree.id] || 0}
            target={null}
            freshName={order[order.length - 1]}
            isMain={spent > 0 && tree.id === mainTree.id}
            onTip={setTip}
            onAdd={add}
            onRemove={remove}
            canAdd={(name) => addBlocker(talents, ranks, name) === null}
            headerAction={(totals[tree.id] || 0) > 0 && (
              <button className="tree-reset" onClick={() => resetTree(tree.id)} title={`Reset ${tree.name}`}>
                <Icon name="x" size={11} />
              </button>
            )}
          />
        ))}
      </div>

      <div className="calc-lower">
        <section className="panel">
          <header className="panel-head">
            <div>
              <div className="kicker">Share</div>
              <h3>Build code</h3>
            </div>
          </header>
          <div className="code-row">
            <input readOnly value={code} onFocus={(e) => e.target.select()} aria-label="Build code" />
            <button className="btn-primary" onClick={async () => flash((await copyText(code)) ? 'Code copied' : 'Copy failed — select the code and press Ctrl+C', 'info')}>
              Copy
            </button>
          </div>
          <div className="code-row">
            <input value={importText} onChange={(e) => setImportText(e.target.value)} placeholder={`Paste a ${cls.name} code, e.g. ${cls.id}:0552…`}
              onKeyDown={(e) => e.key === 'Enter' && doImport()} aria-label="Import code" />
            <button className="btn-ghost" onClick={doImport} disabled={!importText.trim()}>Import</button>
          </div>
          <p className="fine">Codes store ranks only; the level order is rebuilt automatically when you import.</p>
        </section>

        <section className="panel">
          <header className="panel-head">
            <div>
              <div className="kicker">Your builds</div>
              <h3>Saved {cls.name} builds</h3>
            </div>
          </header>
          <div className="code-row">
            <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Name this build (optional)"
              onKeyDown={(e) => e.key === 'Enter' && spent && doSave()} aria-label="Build name" />
            <button className="btn-primary" onClick={doSave} disabled={!spent}>Save</button>
          </div>
          {mySaved.length ? (
            <ul className="saved-list">
              {mySaved.map((s) => (
                <li key={s.id}>
                  <button className="saved-load" onClick={() => loadSaved(s)}>
                    <strong>{s.name}</strong>
                    <span>{s.code.split(':')[1] || 'empty'} · {new Date(s.savedAt).toLocaleDateString()}</span>
                  </button>
                  <button className="saved-del" onClick={() => deleteSaved(s)} title="Delete"><Icon name="x" size={12} /></button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="fine">No saved builds for {cls.name} yet. Builds are stored on this computer.</p>
          )}
        </section>
      </div>

      <section className="panel">
        <header className="panel-head">
          <div>
            <div className="kicker">Level by level</div>
            <h3>Pick order</h3>
          </div>
          <span className="fine">Trees: {TALENT_META.origin === 'downloaded' ? 'downloaded update' : 'bundled'} · {TALENT_META.importedAt}</span>
        </header>
        {order.length ? (
          <ol className="pick-order">
            {order.map((name, i) => {
              const rank = order.slice(0, i + 1).filter((n) => n === name).length;
              return (
                <li key={i}>
                  <button className="past" style={{ '--t': treeById[talents[name].tree].color }} onClick={() => remove(name)}
                    title="Click to remove the last point in this talent">
                    <span className="po-level">{levelForPoints(i + 1)}</span>
                    <span className="po-name">{name}</span>
                    <span className="po-rank">{rank}/{talents[name].max}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="fine">Spend a point to start your build — or load a guide build above.</p>
        )}
      </section>

      {notice && <div className={`calc-toast ${notice.kind}`}>{notice.text}</div>}

      {tip && createPortal(
        <div className="talent-tip" style={{ left: tip.x, top: tip.y }}>
          <div className="tt-head">
            {talentIcon(cls.id, tip.talent.name) && <img src={talentIcon(cls.id, tip.talent.name)} alt="" width={36} height={36} />}
            <div className="tt-name">{tip.talent.name}</div>
          </div>
          <div className="tt-rank">Rank {tipRank}/{tip.talent.max}</div>
          {tip.talent.row > 0 && (
            <div className={`tt-req ${(totals[tip.talent.tree] || 0) >= tip.talent.row * 5 ? 'met' : ''}`}>
              Requires {tip.talent.row * 5} points in {treeById[tip.talent.tree].name}
            </div>
          )}
          {tip.talent.req && (
            <div className={`tt-req ${(ranks[tip.talent.req] || 0) >= reqPoints(tip.talent, talents) ? 'met' : ''}`}>
              Requires {reqPoints(tip.talent, talents)} points in {tip.talent.req}
            </div>
          )}
          <p className="tt-desc">{rankText(tip.talent, tipRank || 1)}</p>
          {tipRank > 0 && tipRank < tip.talent.max && (
            <p className="tt-next"><b>Next rank:</b> {rankText(tip.talent, tipRank + 1)}</p>
          )}
          <div className="tt-levels">
            {tipBlocker && tipBlocker !== 'Maxed' ? tipBlocker : tipRank < tip.talent.max ? 'Click to learn' : 'Right-click to unlearn'}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
