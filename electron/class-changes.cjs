// Builds the "What's new in Forever" comparison: Classic Era vs WoW Forever talents and abilities for every class.
// Used by `npm run changes` (bundled data) and by the desktop app's updater (downloaded data).

const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
// Classic Wowhead lists rank variants, poisons, quest mounts and internal passives as trainer abilities — skip those.
const NOISE = /\(|\b(I|II|III|IV|V|VI)$|Poison|Powder|Racial|Tuning|Passive|Explorer Imp|Felsteed|Dreadsteed|Homunculi|Eye of the Void|^Poisons$/;
// Level-1 abilities that really are starting spells (other level-1 entries in Classic data are Season of Discovery runes).
const STARTING = new Set(['Battle Shout', 'Battle Stance', 'Heroic Strike', 'Seal of Righteousness', 'Holy Light', 'Devotion Aura',
  'Auto Shot', 'Raptor Strike', 'Track Beasts', 'Sinister Strike', 'Eviscerate', 'Stealth', 'Lesser Heal', 'Power Word: Fortitude',
  'Smite', 'Healing Wave', 'Lightning Bolt', 'Rockbiter Weapon', 'Fireball', 'Frost Armor', 'Arcane Intellect', 'Shadow Bolt',
  'Demon Skin', 'Immolate', 'Summon Imp', 'Healing Touch', 'Mark of the Wild', 'Wrath']);
// Abilities Forever renamed (shown as renames rather than removed + added).
const RENAMES = { 'Curse of Agony': 'Bane of Agony', 'Curse of Doom': 'Bane of Doom', Mangle: 'Primal Bite', 'Hot Streak': 'Heating Up', 'Soul Harvesting': 'Soul Harvest' };

const index = (trees) => {
  const m = {};
  for (const tree of trees) for (const t of tree.talents) m[t.name] = { ...t, tree: tree.name };
  return m;
};

function compareClass(classId, forever, classic) {
  const f = index(forever.classes[classId]);
  const c = index(classic.classes[classId] ?? []);

  const added = Object.values(f).filter((t) => !c[t.name])
    .map((t) => ({ name: t.name, tree: t.tree, max: t.max, desc: t.ranks[t.max - 1] }));
  const removed = Object.values(c).filter((t) => !f[t.name])
    .map((t) => ({ name: t.name, tree: t.tree, max: t.max, desc: t.ranks[t.max - 1] }));
  const changed = [];
  for (const t of Object.values(f)) {
    const old = c[t.name];
    if (!old) continue;
    const notes = [];
    if (old.tree !== t.tree) notes.push(`Moved from ${old.tree} to ${t.tree}`);
    if (old.max !== t.max) notes.push(`Ranks ${old.max} → ${t.max}`);
    if (old.tree === t.tree && old.row !== t.row) notes.push(`Row ${old.row + 1} → ${t.row + 1}`);
    const before = norm(old.ranks[old.max - 1]);
    const after = norm(t.ranks[t.max - 1]);
    const effectChanged = before !== after;
    if (effectChanged) notes.push('Effect changed');
    if (notes.length) changed.push({ name: t.name, tree: t.tree, notes, ...(effectChanged ? { before, after } : {}) });
  }

  const fa = Object.fromEntries((forever.abilities[classId] ?? []).map(([n, l]) => [n, l]));
  const ca = Object.fromEntries((classic.abilities[classId] ?? [])
    .filter(([n, l]) => !NOISE.test(n) && (l > 1 || STARTING.has(n))) // drop SoD runes (listed at level 1), variants, poisons, mounts
    .map(([n, l]) => [n, l]));
  const renamed = Object.entries(RENAMES).filter(([from, to]) => from in ca && to in fa).map(([from, to]) => ({ from, to, level: fa[to] }));
  const renamedFrom = new Set(renamed.map((r) => r.from));
  const renamedTo = new Set(renamed.map((r) => r.to));
  const classicRaw = Object.fromEntries((classic.abilities[classId] ?? []).map(([n, l]) => [n, l]));
  const abilities = {
    // New in Forever — including Season of Discovery rune spells that are now trained normally.
    added: Object.entries(fa).filter(([n]) => !(n in ca) && !renamedTo.has(n))
      .map(([name, level]) => ({ name, level, ...(classicRaw[name] === 1 ? { note: 'Was a Season of Discovery rune — now learned from your trainer' } : {}) }))
      .sort((x, y) => x.level - y.level),
    removed: Object.entries(ca).filter(([n]) => !(n in fa) && !renamedFrom.has(n))
      .map(([name, level]) => ({ name, level, ...(f[name] ? { note: `Now a ${f[name].tree} talent` } : {}) }))
      .sort((x, y) => x.level - y.level),
    renamed,
    levelChanged: Object.entries(fa).filter(([n, l]) => n in ca && ca[n] !== l).map(([name, level]) => ({ name, from: ca[name], to: level }))
      .sort((x, y) => x.to - y.to),
  };
  // Talents that became trainer abilities (e.g. Divine Spirit) aren't really "removed".
  for (const t of removed) if (t.name in fa) t.note = `Now a baseline ability at level ${fa[t.name]}`;

  return { talents: { added, removed, changed }, abilities };
}

/**
 * forever: { classes, abilities, meta } (bundled or downloaded WoW Forever data); classic: the same shape for Classic Era.
 * Returns the classChanges.json structure.
 */
function buildClassChanges(forever, classic) {
  const classes = {};
  for (const classId of Object.keys(forever.classes)) classes[classId] = compareClass(classId, forever, classic);
  return {
    meta: { importedAt: new Date().toISOString().slice(0, 10), classic: classic.meta.dataUrl, forever: forever.meta.dataUrl },
    classes,
  };
}

module.exports = { buildClassChanges };
