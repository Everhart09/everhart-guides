export const FIRST_TALENT_LEVEL = 10;
export const MAX_LEVEL = 60;
export const TOTAL_POINTS = MAX_LEVEL - FIRST_TALENT_LEVEL + 1; // 51

/** Talents keyed by name across all three trees, each tagged with its tree id. */
export function indexTalents(cls) {
  const byName = {};
  for (const tree of cls.trees) {
    for (const t of tree.talents) byName[t.name] = { ...t, tree: tree.id };
  }
  return byName;
}

/** Points that must be in `req` before a talent can be taken (Forever sets this per talent). */
export const reqPoints = (talent, talents) => talent.reqQty ?? talents[talent.req]?.max ?? 0;

/** Description for a rank (1-based); falls back to the max rank. */
export const rankText = (talent, rank) => talent.ranks[Math.max(0, Math.min(talent.max, rank || talent.max) - 1)];

/** Expand a spec build into one entry per talent point: { level, name, tree, rank, max }. */
export function expandBuild(cls, spec) {
  const talents = indexTalents(cls);
  const ranks = {};
  const picks = [];
  for (const [name, count] of spec.build) {
    if (!talents[name]) continue; // not a Forever talent — skipped until the build is updated
    for (let i = 0; i < count; i++) {
      ranks[name] = (ranks[name] || 0) + 1;
      picks.push({
        level: FIRST_TALENT_LEVEL + picks.length,
        name,
        tree: talents[name]?.tree,
        rank: ranks[name],
        max: talents[name]?.max,
      });
    }
  }
  return picks;
}

/** Talent ranks and per-tree point totals at a given character level. */
export function stateAtLevel(picks, level) {
  const ranks = {};
  const treeTotals = {};
  let last = null;
  for (const p of picks) {
    if (p.level > level) break;
    ranks[p.name] = p.rank;
    treeTotals[p.tree] = (treeTotals[p.tree] || 0) + 1;
    last = p;
  }
  return { ranks, treeTotals, last, spent: last ? last.level - FIRST_TALENT_LEVEL + 1 : 0 };
}

/** Returns a list of human-readable problems with a class's talent data and builds (empty when valid). */
export function validateClass(cls) {
  const errors = [];
  const talents = indexTalents(cls);

  for (const tree of cls.trees) {
    const cells = new Set();
    for (const t of tree.talents) {
      const cell = `${t.row},${t.col}`;
      if (cells.has(cell)) errors.push(`${cls.name}/${tree.name}: two talents at ${cell}`);
      cells.add(cell);
      if (t.req && talents[t.req]?.tree !== tree.id) errors.push(`${cls.name}: "${t.name}" requires unknown "${t.req}"`);
    }
  }

  for (const spec of cls.specs) {
    const label = `${cls.name}/${spec.name}`;
    const ranks = {};
    const totals = {};
    let points = 0;
    for (const [name, count] of spec.build) {
      const t = talents[name];
      if (!t) { errors.push(`${label}: "${name}" is not a WoW Forever talent`); continue; }
      for (let i = 0; i < count; i++) {
        points++;
        const spentInTree = totals[t.tree] || 0;
        if (spentInTree < t.row * 5) {
          errors.push(`${label}: "${name}" (point ${points}) needs ${t.row * 5} in ${t.tree}, has ${spentInTree}`);
        }
        if (t.req && (ranks[t.req] || 0) < reqPoints(t, talents)) {
          errors.push(`${label}: "${name}" needs ${reqPoints(t, talents)} points in "${t.req}" first`);
        }
        ranks[name] = (ranks[name] || 0) + 1;
        if (ranks[name] > t.max) errors.push(`${label}: "${name}" exceeds ${t.max} ranks`);
        totals[t.tree] = spentInTree + 1;
      }
    }
    if (points !== TOTAL_POINTS) errors.push(`${label}: build has ${points} points, expected ${TOTAL_POINTS}`);
    if (!cls.trees.some((tr) => tr.id === spec.tree)) errors.push(`${label}: unknown tree "${spec.tree}"`);
  }
  return errors;
}

/** **Bolded** names in guide text that aren't a Forever ability or talent for the class. */
export function unknownAbilityMentions(texts, knownNames) {
  const known = new Set([...knownNames].map((n) => n.toLowerCase()));
  const unknown = new Set();
  for (const text of texts) {
    text.split('**').forEach((part, i) => {
      if (i % 2 && !known.has(part.toLowerCase())) unknown.add(part);
    });
  }
  return [...unknown];
}
