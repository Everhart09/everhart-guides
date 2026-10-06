import { talentIcon } from '../../lib/icons.js';
import { reqPoints } from '../../lib/talents.js';

const S = 46; // tile size
const G = 16; // gap
const STEP = S + G;
const WIDTH = 4 * S + 3 * G;
const HEIGHT = 7 * S + 6 * G;
const SKIP = new Set(['Improved', 'of', 'the', 'and']);

function glyph(name) {
  const words = name.replace(/[():']/g, '').split(/[\s-]+/).filter((w) => w && !SKIP.has(w));
  const g = words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2);
  return g.toUpperCase();
}

/** SVG path for a prerequisite arrow from one tile to another. */
function arrowPath(from, to) {
  const fx = from.col * STEP;
  const fy = from.row * STEP;
  const tx = to.col * STEP;
  const ty = to.row * STEP;
  if (from.col === to.col) return `M${fx + S / 2},${fy + S} L${tx + S / 2},${ty - 3}`;
  if (from.row === to.row) {
    return from.col < to.col
      ? `M${fx + S},${fy + S / 2} L${tx - 3},${ty + S / 2}`
      : `M${fx},${fy + S / 2} L${tx + S + 3},${ty + S / 2}`;
  }
  const startX = from.col < to.col ? fx + S : fx;
  return `M${startX},${fy + S / 2} L${tx + S / 2},${fy + S / 2} L${tx + S / 2},${ty - 3}`;
}

/**
 * One talent tree. Read-only by default; pass onAdd/onRemove (and canAdd) to make it a calculator.
 */
// The game's background art for a tree. Absolute URL, because a relative url() inside a CSS variable would resolve
// against the stylesheet's folder instead of the page.
const treeBackground = (classId, treeId) => new URL(`talent-bg/${classId}-${treeId}.jpg`, document.baseURI).href;

export default function TalentTree({ classId, tree, talents, ranks, finalRanks = ranks, spent, target, freshName, isMain, onTip, onAdd, onRemove, canAdd, headerAction }) {
  const interactive = Boolean(onAdd);
  const list = tree.talents.map((t) => talents[t.name]);
  const capstone = list.find((t) => t.row === 6) ?? list[list.length - 1];
  const capstoneIcon = talentIcon(classId, capstone.name);

  const showTip = (t, e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const width = 290;
    // Always to the right of the talent, aligned with its top. Only nudged inward if it would go off-screen.
    const x = Math.min(r.right + 12, window.innerWidth - width - 8);
    const y = Math.max(8, Math.min(r.top, window.innerHeight - 280));
    onTip({ talent: t, x, y });
  };

  return (
    <section className={`tree has-bg ${isMain ? 'main' : ''}`} style={{ '--t': tree.color, '--tree-bg': `url("${treeBackground(classId, tree.id)}")` }}>
      <header className="tree-head">
        <h4>
          {capstoneIcon && <img className="tree-icon" src={capstoneIcon} alt="" width={24} height={24} />}
          {tree.name}{isMain && <span className="tree-badge">Main</span>}
        </h4>
        <span className="tree-points"><b>{spent}</b>{target != null && <> / {target}</>}{headerAction}</span>
      </header>
      <div className="tree-progress"><i style={{ width: `${Math.min(100, (spent / 31) * 100)}%` }} /></div>

      <div className="tree-grid" style={{ width: WIDTH, height: HEIGHT }}>
        <svg className="tree-arrows" width={WIDTH} height={HEIGHT}>
          <defs>
            {['off', 'on'].map((k) => (
              <marker key={k} id={`ah-${tree.id}-${k}`} viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={k === 'on' ? tree.color : '#3a4152'} />
              </marker>
            ))}
          </defs>
          {list.filter((t) => t.req).map((t) => {
            const from = talents[t.req];
            const lit = (ranks[t.req] || 0) >= reqPoints(t, talents);
            return (
              <path key={t.name} d={arrowPath(from, t)} className={`arrow ${lit ? 'lit' : ''}`}
                markerEnd={`url(#ah-${tree.id}-${lit ? 'on' : 'off'})`} />
            );
          })}
        </svg>

        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div key={row} className={`tier-line ${spent >= row * 5 ? 'open' : ''}`} style={{ top: row * STEP - G / 2 }}>
            <span>{row * 5}</span>
          </div>
        ))}

        {list.map((t) => {
          const rank = ranks[t.name] || 0;
          const planned = finalRanks[t.name] || 0;
          const state = [
            'tile',
            rank > 0 && 'learned',
            rank === t.max && 'maxed',
            rank === 0 && spent < t.row * 5 && 'locked',
            planned > rank && 'planned',
            freshName === t.name && 'fresh',
            interactive && rank < t.max && canAdd?.(t.name) && 'available',
            t.max === 1 && 'ability',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={t.name}
              className={state}
              style={{ left: t.col * STEP, top: t.row * STEP, width: S, height: S }}
              onMouseEnter={(e) => showTip(t, e)}
              onMouseLeave={() => onTip(null)}
              onClick={interactive ? (e) => (e.shiftKey ? onRemove(t.name) : onAdd(t.name)) : undefined}
              onContextMenu={interactive ? (e) => { e.preventDefault(); onRemove(t.name); } : undefined}
              aria-label={`${t.name} ${rank}/${t.max}`}
            >
              {talentIcon(classId, t.name) ? (
                <img className="tile-img" src={talentIcon(classId, t.name)} alt="" draggable={false} />
              ) : (
                <>
                  <span className="tile-glyph">{glyph(t.name)}</span>
                  {t.name.startsWith('Improved') && <span className="tile-imp">+</span>}
                </>
              )}
              <span className="tile-rank">{rank}/{t.max}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
