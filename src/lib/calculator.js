// Talent calculator rules. A build is an ordered list of talent names (one entry per point), so the
// calculator also knows the level each point is spent at.
import { FIRST_TALENT_LEVEL, TOTAL_POINTS, indexTalents, reqPoints } from './talents.js';

export function ranksOf(order) {
  const ranks = {};
  for (const name of order) ranks[name] = (ranks[name] || 0) + 1;
  return ranks;
}

function treeTotals(talents, ranks) {
  const totals = {};
  for (const [name, r] of Object.entries(ranks)) totals[talents[name].tree] = (totals[talents[name].tree] || 0) + r;
  return totals;
}

/** True when every spent point respects tier gates, prerequisites and max ranks. */
export function isLegal(talents, ranks) {
  let total = 0;
  for (const [name, r] of Object.entries(ranks)) {
    const t = talents[name];
    if (!t || r > t.max) return false;
    total += r;
    if (t.req && (ranks[t.req] || 0) < reqPoints(t, talents)) return false;
    // Points spent in rows above this talent must unlock its row.
    let above = 0;
    for (const [n2, r2] of Object.entries(ranks)) {
      const t2 = talents[n2];
      if (t2.tree === t.tree && t2.row < t.row) above += r2;
    }
    if (above < t.row * 5) return false;
  }
  return total <= TOTAL_POINTS;
}

/** Why a talent can't take another point right now, or null if it can. */
export function addBlocker(talents, ranks, name) {
  const t = talents[name];
  const spent = Object.values(ranks).reduce((a, b) => a + b, 0);
  if (spent >= TOTAL_POINTS) return 'All 51 points are spent';
  if ((ranks[name] || 0) >= t.max) return 'Maxed';
  const inTree = treeTotals(talents, ranks)[t.tree] || 0;
  if (inTree < t.row * 5) return `Requires ${t.row * 5} points in this tree`;
  if (t.req && (ranks[t.req] || 0) < reqPoints(t, talents)) return `Requires ${reqPoints(t, talents)} points in ${t.req}`;
  return null;
}

/** Why a point can't be removed (other talents depend on it), or null if it can. */
export function removeBlocker(talents, ranks, name) {
  if (!ranks[name]) return 'No points to remove';
  const next = { ...ranks, [name]: ranks[name] - 1 };
  if (!next[name]) delete next[name];
  return isLegal(talents, next) ? null : 'Other talents depend on this point';
}

/** Remove the most recent point spent in `name`. */
export function removeLast(order, name) {
  const i = order.lastIndexOf(name);
  return i < 0 ? order : [...order.slice(0, i), ...order.slice(i + 1)];
}

/**
 * Re-orders points so that each one is legal at the moment it's spent (keeps the player's order
 * where possible). Used after removals and imports so the level-by-level list stays valid.
 */
export function legalOrder(talents, order) {
  const remaining = [...order];
  const result = [];
  const ranks = {};
  while (remaining.length) {
    const i = remaining.findIndex((name) => addBlocker(talents, ranks, name) === null);
    if (i < 0) break; // shouldn't happen for a legal final state
    const [name] = remaining.splice(i, 1);
    ranks[name] = (ranks[name] || 0) + 1;
    result.push(name);
  }
  return result;
}

export const orderFromBuild = (build) => build.flatMap(([name, n]) => Array(n).fill(name));
export const levelForPoints = (n) => (n ? FIRST_TALENT_LEVEL + n - 1 : null);

/**
 * Share codes: "<class>:<tree1>-<tree2>-<tree3>" where each tree is a digit per talent (rank) in tree
 * order, with trailing zeros trimmed. Ranks only — the level order is rebuilt on import.
 */
export function encodeBuild(cls, order) {
  const ranks = ranksOf(order);
  const trees = cls.trees.map((tree) => tree.talents.map((t) => ranks[t.name] || 0).join('').replace(/0+$/, ''));
  return `${cls.id}:${trees.join('-').replace(/-+$/, '')}`;
}

/** Parses a share code for this class. Returns { order } or { error }. */
export function decodeBuild(cls, code) {
  const trimmed = (code || '').trim();
  const [prefix, body] = trimmed.includes(':') ? trimmed.split(':') : [cls.id, trimmed];
  if (prefix !== cls.id) return { error: `That code is for a ${prefix} build, not ${cls.name}.` };
  if (!/^[0-9-]*$/.test(body)) return { error: 'Codes only contain digits and dashes.' };
  const parts = body.split('-');
  if (parts.length > 3) return { error: 'A code has at most three tree sections.' };
  const talents = indexTalents(cls);
  const order = [];
  for (let i = 0; i < cls.trees.length; i++) {
    const digits = parts[i] || '';
    const tree = cls.trees[i];
    if (digits.length > tree.talents.length) return { error: `The ${tree.name} section is too long.` };
    [...digits].forEach((d, j) => {
      for (let k = 0; k < Number(d); k++) order.push(tree.talents[j].name);
    });
  }
  const ranks = ranksOf(order);
  if (!isLegal(talents, ranks)) return { error: 'That build breaks the talent rules for the current trees.' };
  return { order: legalOrder(talents, order) };
}
