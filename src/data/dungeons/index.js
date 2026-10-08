// Dungeon guides: hand-written strategy (catalog.js) joined with WoW Forever game data. Bundled data is db.json
// (from `npm run dungeons`); the desktop app downloads newer data from Settings → Check for updates, which wins.
import BUNDLED from './db.json' with { type: 'json' };
import { CATALOG, RAIDS } from './catalog.js';

const override = (() => {
  try {
    const data = globalThis.everhart?.getDungeonOverride?.();
    return data?.spells && data?.items && data?.npcs && data?.meta ? data : null;
  } catch {
    return null;
  }
})();
const DB = override ?? BUNDLED;

export const DUNGEON_DB = DB;
export const DUNGEON_META = { ...DB.meta, origin: override ? 'downloaded' : 'bundled' };

/** Every spell, item and NPC id the guides use, so the updater knows what to download. */
export const DUNGEON_IDS = (() => {
  const ids = { spells: new Set(), items: new Set(), npcs: new Set(), models: new Set() };
  for (const d of CATALOG) for (const b of d.bosses) {
    if (b.model) ids.models.add(b.model);
    b.spells.forEach((s) => ids.spells.add(s));
    b.loot.forEach((i) => ids.items.add(i));
    if (b.npc) ids.npcs.add(b.npc);
  }
  return { spells: [...ids.spells], items: [...ids.items], npcs: [...ids.npcs], models: [...ids.models] };
})();

const DESKTOP = Boolean(globalThis.everhart?.isDesktop);
/** Render of a boss's in-game model. In the desktop app, portraits downloaded by updates take priority. */
export const portraitUrl = (model) => (model ? (DESKTOP ? `ehicon://portraits/${model}.webp` : new URL(`portraits/${model}.webp`, document.baseURI).href) : null);

const npcLevel = (npc) => (npc?.level && npc.level !== '??' ? npc.level : null);

// Bosses whose mechanics aren't known yet are listed by name only, not given an empty section.
const isUnknown = (b) => /not known yet|unknown/i.test(b.strategy ?? '') && !b.spells.length;

const ALL = CATALOG.map((d) => ({
  ...d,
  pendingBosses: d.bosses.filter(isUnknown).map((b) => b.name),
  bosses: d.bosses.filter((b) => !isUnknown(b)).map((b) => {
    const npc = b.npc ? DB.npcs[b.npc] : null;
    return {
      ...b,
      title: npc?.title ?? null,
      level: npcLevel(npc),
      kind: npc?.kind ?? null,
      abilities: b.spells.map((id) => (DB.spells[id] ? { id, ...DB.spells[id] } : null)).filter(Boolean)
        .filter((s, i, all) => all.findIndex((x) => x.name === s.name) === i), // same-named ranks shown once
      items: b.loot.map((id) => (DB.items[id] ? { id, ...DB.items[id] } : null)).filter(Boolean),
    };
  }),
}));

/** Dungeons with a guide to show. Ones without any boss guides yet (e.g. Uldaman) stay hidden until they get one. */
export const DUNGEONS = ALL.filter((d) => d.bosses.length > 0);

export { RAIDS };
export const getDungeon = (id) => DUNGEONS.find((d) => d.id === id) ?? null;
/** The guide for a dungeon name as the leveling route spells it (e.g. "Hall of Thanes", "Scarlet Monastery"). */
export function dungeonByName(name) {
  const n = name.toLowerCase().replace(/^the /, '');
  return DUNGEONS.find((d) => d.name.toLowerCase().replace(/^the /, '') === n)
    ?? DUNGEONS.find((d) => d.group?.toLowerCase() === n)
    ?? DUNGEONS.find((d) => d.name.toLowerCase().replace(/^the /, '').startsWith(n.split(':')[0]))
    ?? null;
}
export const wowheadItem = (id) => `https://www.wowhead.com/forever/item=${id}`;
export const wowheadSpell = (id) => `https://www.wowhead.com/forever/spell=${id}`;
export const wowheadNpc = (id) => `https://www.wowhead.com/forever/npc=${id}`;
