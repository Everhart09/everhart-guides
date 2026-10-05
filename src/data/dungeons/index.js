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
  const ids = { spells: new Set(), items: new Set(), npcs: new Set() };
  for (const d of CATALOG) for (const b of d.bosses) {
    b.spells.forEach((s) => ids.spells.add(s));
    b.loot.forEach((i) => ids.items.add(i));
    if (b.npc) ids.npcs.add(b.npc);
  }
  return { spells: [...ids.spells], items: [...ids.items], npcs: [...ids.npcs] };
})();

const npcLevel = (npc) => (npc?.level && npc.level !== '??' ? npc.level : null);

export const DUNGEONS = CATALOG.map((d) => ({
  ...d,
  bosses: d.bosses.map((b) => {
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
