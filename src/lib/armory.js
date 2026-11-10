// Characters saved on the Armory page: the latest lookup from Blizzard plus a short progress history.
// Saved on this computer only.
import { useSyncExternalStore } from 'react';
import { CLASSES } from '../data/classes/index.js';
import { expandBuild, indexTalents } from './talents.js';

const KEY = 'everhart.armory';
const HISTORY_MAX = 200;
export const REGIONS = [
  { id: 'us', label: 'Americas' },
  { id: 'eu', label: 'Europe' },
  { id: 'kr', label: 'Korea' },
  { id: 'tw', label: 'Taiwan' },
];

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
let chars = read();
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
function save(next) {
  chars = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(chars));
  } catch {
    /* storage unavailable: kept for this session */
  }
  emit();
}

export const useCharacters = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => chars);
export const charKey = (c) => `${c.region}/${c.slug}`;

/** Adds or updates a character from a lookup, recording progress when something changed. */
export function upsertCharacter(data) {
  const key = charKey(data);
  const existing = chars.find((c) => charKey(c) === key);
  const point = { at: data.fetchedAt, level: data.level, itemLevel: data.itemLevel, talentPoints: Object.values(data.talents ?? {}).reduce((a, b) => a + b, 0) };
  const history = [...(existing?.history ?? [])];
  const last = history.at(-1);
  if (!last || last.level !== point.level || last.itemLevel !== point.itemLevel || last.talentPoints !== point.talentPoints) history.push(point);
  const entry = { region: data.region, slug: data.slug, fav: existing?.fav ?? false, added: existing?.added ?? Date.now(), data, history: history.slice(-HISTORY_MAX) };
  save(existing ? chars.map((c) => (charKey(c) === key ? entry : c)) : [...chars, entry]);
}

export const toggleCharacterFav = (key) => save(chars.map((c) => (charKey(c) === key ? { ...c, fav: !c.fav } : c)));
export const removeCharacter = (key) => save(chars.filter((c) => charKey(c) !== key));

// --- Linking a character to the guides ------------------------------------------------------------

export const classOf = (data) => CLASSES.find((c) => c.name.toLowerCase() === (data?.className ?? '').toLowerCase()) ?? null;

/** Points per tree (by our tree ids) from the character's talent ranks. */
export function treePoints(cls, talents) {
  const T = indexTalents(cls);
  const totals = {};
  for (const [name, rank] of Object.entries(talents ?? {})) if (T[name]) totals[T[name].tree] = (totals[T[name].tree] ?? 0) + rank;
  return totals;
}

/** The spec whose main tree has the most of the character's points (or the class's first spec with none spent). */
export function specOf(cls, talents) {
  if (!cls) return null;
  const totals = treePoints(cls, talents);
  const best = cls.trees.reduce((a, t) => ((totals[t.id] ?? 0) > (totals[a.id] ?? 0) ? t : a), cls.trees[0]);
  return (totals[best.id] ?? 0) > 0 ? cls.specs.find((s) => s.tree === best.id) ?? null : null;
}

/**
 * The guide's next talent picks the character hasn't taken yet, following the leveling build below 60
 * and the level 60 build at 60: [{ name, rank, max, level }].
 */
export function nextPicks(cls, spec, talents, level, count = 3) {
  if (!cls || !spec) return [];
  const picks = expandBuild(cls, spec, level >= 60 ? 'endgame' : 'leveling');
  const have = { ...talents };
  const out = [];
  for (const p of picks) {
    if ((have[p.name] ?? 0) >= p.rank) continue;
    out.push(p);
    if (out.length >= count) break;
  }
  return out;
}
