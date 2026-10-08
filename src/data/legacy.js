// WoW Forever Legacy System: account-wide Legacy Points from challenges, spent per character in three perk trees.
// Perk text and icons come from the official perk spells in the WoW Forever game data (legacyDb.json via `npm run legacy`,
// refreshed in-app by Settings → Check for updates). Ranks, tree requirements and challenges are from beta coverage
// (foreverdb.net, Warcraft Tavern, Icy Veins). The `effect` functions are fallbacks if the game data is unavailable.
import BUNDLED_DB from './legacyDb.json' with { type: 'json' };

export const LEGACY_CAP = 16; // points one character can spend at launch
export const LEGACY_SOURCE_NOTE = 'Based on the WoW Forever beta. Perk values and the point cap may change before launch.';

// gate: points needed in this tree first. requires: [perkId, rank] that must be maxed/reached first.
// effect(rank) describes the bonus at a given rank.
export const LEGACY_TREES = [
  {
    id: 'professions', name: 'Professions', color: '#d9a659', icon: 'trade_engineering',
    blurb: 'Faster tradeskill leveling, more materials and cheaper vendors.',
    perks: [
      { id: 'working-overtime', spell: 1225451, name: 'Working Overtime', max: 5, gate: 0, effect: (r) => `+${2 * r}% chance for skill increases from any tradeskill.` },
      { id: 'bountiful-harvest', spell: 1225435, name: 'Bountiful Harvest', max: 5, gate: 0, effect: (r) => `${20 * r}% more Scarce materials from Mining, Herbalism and Skinning.` },
      { id: 'bartering', spell: 1225459, name: 'Bartering', max: 2, gate: 5, effect: (r) => `${5 * r}% discount when buying from vendors.` },
      { id: 'master-chef', spell: 1225457, name: 'Master Chef', max: 5, gate: 5, effect: (r) => `${6 * r}% chance to create an extra result when cooking.` },
      { id: 'luremaster', spell: 1225455, name: 'Luremaster', max: 2, gate: 5, effect: (r) => `${25 * r}% chance to catch an extra fish while a lure is active.` },
      { id: 'performance-bonus', spell: 1225456, name: 'Performance Bonus', max: 3, gate: 5, requires: ['bountiful-harvest', 5], effect: (r) => `${5 * r}% chance for 100% more Merchant's Favor from crates.` },
      { id: 'dedicated-study', spell: 1225469, name: 'Dedicated Study', max: 1, gate: 10, requires: ['bartering', 2], effect: () => 'Once a day: +1 skill in your lowest tradeskill, or 2–4 random Elemental Essences.' },
    ],
  },
  {
    id: 'adventure', name: 'Adventure', color: '#6fcf8e', icon: 'inv_misc_map_01',
    blurb: 'Faster leveling, quicker recovery and cheaper travel.',
    perks: [
      { id: 'well-rested', spell: 1225478, name: 'Well Rested', max: 5, gate: 0, effect: (r) => `Rested XP builds ${4 * r}% faster and its cap is ${4 * r}% higher.` },
      { id: 'thrill-of-adventure', spell: 1225472, name: 'Thrill of Adventure', max: 5, gate: 0, effect: (r) => `Killing blows restore ${r}% of max health and mana over 10 sec.` },
      { id: 'field-medicine', spell: 1225475, name: 'Field Medicine', max: 2, gate: 5, effect: (r) => `Recently Bandaged lasts ${5 * r} sec less.` },
      { id: 'high-alert', spell: 1225477, name: 'High Alert', max: 2, gate: 5, effect: (r) => `Detect stealth as if you were ${r} level${r > 1 ? 's' : ''} higher.` },
      { id: 'field-guide', spell: 1225479, name: 'Field Guide', max: 3, gate: 5, effect: (r) => `${Math.round((25 / 3) * r)}% shorter cooldown on adding camp features.` },
      { id: 'talented', spell: 1225474, ownRanks: true, name: 'Talented', max: 5, gate: 5, requires: ['well-rested', 5], effect: (r) => `Talent points start at level ${10 - r} instead of 10 (still 51 in total).` },
      { id: 'frequent-flier', spell: 1225490, name: 'Frequent Flier', max: 1, gate: 10, requires: ['field-guide', 3], effect: () => 'Flight paths cost 50% less and fly 20% faster.' },
    ],
  },
  {
    id: 'resourcefulness', name: 'Resourcefulness', color: '#6a9de0', icon: 'inv_misc_bag_10',
    blurb: 'Longer buffs, cheaper deaths and better reputation and Honor gains.',
    perks: [
      { id: 'gourmand', spell: 1225499, name: 'Gourmand', max: 3, gate: 0, effect: (r) => `Food buffs last ${Math.round((100 / 3) * r)}% longer.` },
      { id: 'quick-and-dead', spell: 1225500, name: 'The Quick and the Dead', max: 2, gate: 0, effect: (r) => `${5 * r}% faster while dead${r === 2 ? '; helpful abilities cost nothing for 2 min after you are resurrected' : ''}.` },
      { id: 'reinforce', spell: 1225497, name: 'Reinforce', max: 5, gate: 0, effect: (r) => `${4 * r}% less durability lost when you die.` },
      { id: 'for-great-honor', spell: 1225501, name: 'For Great Honor', max: 5, gate: 5, effect: (r) => `+${2 * r}% Honor gained.` },
      { id: 'diplomat', spell: 1225485, name: 'Diplomat', max: 5, gate: 5, effect: (r) => `+${2 * r}% reputation from all sources.` },
      { id: 'permanence', spell: 1225502, name: 'Permanence', max: 2, gate: 5, requires: ['gourmand', 3], effect: (r) => `Party and raid buffs, and camp benefits, last ${50 * r}% longer.` },
      { id: 'reagent-economy', spell: 1225503, name: 'Reagent Economy', max: 1, gate: 10, requires: ['quick-and-dead', 2], effect: () => 'Class abilities no longer need reagents you buy from vendors.' },
    ],
  },
];

export const ALL_PERKS = LEGACY_TREES.flatMap((t) => t.perks.map((p) => ({ ...p, tree: t.id })));
export const perkById = Object.fromEntries(ALL_PERKS.map((p) => [p.id, p]));

const CLASSES = ['Druid', 'Hunter', 'Mage', 'Paladin', 'Priest', 'Rogue', 'Shaman', 'Warlock', 'Warrior'];
const CRAFTS = ['Alchemy', 'Blacksmithing', 'Enchanting', 'Engineering', 'Leatherworking', 'Tailoring'];

// 65 challenges, one Legacy Point each, earned once per account.
export const LEGACY_CHALLENGES = [
  { id: 'classes', name: 'Classes', blurb: 'Reach levels 25, 45 and 60 with each class.',
    items: CLASSES.flatMap((c) => [25, 45, 60].map((l) => ({ id: `class-${c.toLowerCase()}-${l}`, name: `${c} level ${l}` }))) },
  { id: 'tradeskills', name: 'Tradeskills', blurb: 'Reach 150, 225 and 300 in each crafting profession.',
    items: CRAFTS.flatMap((p) => [150, 225, 300].map((s) => ({ id: `trade-${p.toLowerCase()}-${s}`, name: `${p} ${s}` }))) },
  { id: 'pvp', name: 'Player vs. Player', blurb: 'Honor ranks, battleground reputations and Field of Honor weeks.',
    items: [
      { id: 'pvp-rank-3', name: 'Honor rank 3 (Sergeant)' },
      { id: 'pvp-rank-7', name: 'Honor rank 7 (Knight-Lieutenant / Blood Guard)' },
      { id: 'pvp-rank-10', name: 'Honor rank 10 (Lieutenant Commander / Champion)' },
      { id: 'pvp-rank-13', name: 'Honor rank 13 (Field Marshal / Warlord)' },
      { id: 'pvp-rank-14', name: 'Honor rank 14 (Grand Marshal / High Warlord)' },
      { id: 'pvp-av', name: 'Exalted with Alterac Valley' },
      { id: 'pvp-ab', name: 'Exalted with Arathi Basin' },
      { id: 'pvp-wsg', name: 'Exalted with Warsong Gulch' },
      { id: 'pvp-darkspear', name: 'Exalted with Darkspear Islands' },
      { id: 'pvp-honor-4', name: 'Field of Honor: week 4' },
      { id: 'pvp-honor-7', name: 'Field of Honor: week 7' },
      { id: 'pvp-honor-10', name: 'Field of Honor: week 10' },
    ] },
  { id: 'adventure', name: 'Adventure', blurb: 'Story and exploration.',
    items: [{ id: 'adv-valthalak', name: 'Complete the Lord Valthalak questline' }, { id: 'adv-explore', name: 'Explore the entire world map' }] },
  { id: 'dungeons', name: 'Dungeons', blurb: 'Clear every dungeon in a level range.',
    items: [
      { id: 'dng-novice', name: 'Novice Spelunker: all level 15–25 dungeons' },
      { id: 'dng-experienced', name: 'Experienced Spelunker: all level 26–45 dungeons' },
      { id: 'dng-master', name: 'Master Spelunker: all level 46–60 dungeons' },
    ] },
  { id: 'raids', name: 'Raids', blurb: 'Defeat every boss in a raid.',
    items: [
      { id: 'raid-hyjal', name: 'Conqueror of the Wilds: all 13 Hyjal Summit bosses' },
      { id: 'raid-barrow', name: 'Conqueror of the Deeps: all 8 Barrow Deeps bosses' },
      { id: 'raid-onyxia', name: 'Conqueror of the Lair: defeat Onyxia' },
    ] },
];

export const LEGACY_TRACK = [
  { level: 15, name: 'Holstered Replica Ironforge Air Rifle', kind: 'Toy' },
  { level: 25, name: 'Spectral Bear Cub', kind: 'Pet' },
  { level: 40, name: 'Spectral Bear Tabard', kind: 'Tabard' },
  { level: 55, name: 'Reins of the Spectral Bear', kind: 'Mount' },
];

// ── Rules ─────────────────────────────────────────────────────────────────────────────────────────────────────────
export const spentIn = (ranks, treeId) => ALL_PERKS.filter((p) => p.tree === treeId).reduce((n, p) => n + (ranks[p.id] ?? 0), 0);
export const totalSpent = (ranks) => Object.values(ranks).reduce((a, b) => a + b, 0);

/** Why a rank can't be added right now, or null if it can. */
export function blockReason(ranks, perk, cap = LEGACY_CAP) {
  const r = ranks[perk.id] ?? 0;
  if (r >= perk.max) return 'Maxed';
  if (totalSpent(ranks) >= cap) return `You've spent all ${cap} points`;
  if (spentIn(ranks, perk.tree) < perk.gate) return `Needs ${perk.gate} points in this tree`;
  if (perk.requires) {
    const [id, need] = perk.requires;
    if ((ranks[id] ?? 0) < need) return `Needs ${perkById[id].name} ${need}/${need}`;
  }
  return null;
}

/** Whether a rank can be removed without breaking another perk's requirements. */
export function canRemove(ranks, perk) {
  const r = ranks[perk.id] ?? 0;
  if (!r) return false;
  const next = { ...ranks, [perk.id]: r - 1 };
  return ALL_PERKS.every((p) => {
    if (!next[p.id]) return true;
    if (p.tree === perk.tree && spentIn(next, p.tree) - next[p.id] < p.gate) return false;
    if (p.requires && p.requires[0] === perk.id && next[perk.id] < p.requires[1]) return false;
    return true;
  });
}

// Share codes: one digit per perk in tree order, trees separated by "-", e.g. "50000-5003-000".
export const encodeLegacy = (ranks) => LEGACY_TREES.map((t) => t.perks.map((p) => ranks[p.id] ?? 0).join('').replace(/0+$/, '')).join('-');
export function decodeLegacy(code) {
  const parts = String(code).trim().split('-');
  if (parts.length > 3 || parts.some((x) => !/^\d*$/.test(x))) return null;
  const ranks = {};
  LEGACY_TREES.forEach((t, i) => t.perks.forEach((p, j) => {
    const v = Number((parts[i] ?? '')[j] ?? 0);
    if (v) ranks[p.id] = Math.min(v, p.max);
  }));
  return ranks;
}

// ── Official perk text from the game data ──────────────────────────────────────────────────────────────────────────
const downloaded = (() => {
  try {
    const d = globalThis.everhart?.getLegacyOverride?.();
    return d?.spells && d?.meta ? d : null;
  } catch {
    return null;
  }
})();
export const LEGACY_DB = downloaded ?? BUNDLED_DB;
export const LEGACY_META = { ...LEGACY_DB.meta, origin: downloaded ? 'downloaded' : 'bundled' };
export const LEGACY_SPELL_IDS = ALL_PERKS.map((p) => p.spell).filter(Boolean);

/** The perk's icon name from the game data, if known. */
export const perkIcon = (perk) => LEGACY_DB.spells[perk.spell]?.icon ?? null;

/**
 * What a perk does at a given rank. The game data describes the max rank, so lower ranks scale its main number
 * (e.g. Diplomat "10%" at 5/5 → "4%" at 2/5). Perks whose ranks work differently (Talented) use their own text below max.
 */
export function perkEffect(perk, rank) {
  const r = Math.max(1, rank);
  const official = LEGACY_DB.spells[perk.spell]?.desc;
  if (!official) return perk.effect(r);
  if (r >= perk.max || perk.max === 1) return official;
  if (perk.ownRanks) return perk.effect(r);
  return official.replace(/(\d+(?:\.\d+)?)/, (n) => {
    const v = (Number(n) * r) / perk.max;
    return String(Math.round(v));
  });
}
