// Dungeon guide game data: boss abilities (spell tooltips), loot (item tooltips) and boss info (NPC tooltips) from
// Wowhead's WoW Forever tooltip API. Used by `npm run dungeons` and by the desktop app's updater.

const API = 'https://nether.wowhead.com/forever/tooltip/';
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const text = (html) => html
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(tr|div|table)>|<table[^>]*>/gi, '\n')
  .replace(/<\/t[dh]>\s*<t[dh][^>]*>/gi, '\t')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
  .split('\n').map((l) => l.trim()).filter(Boolean);

function parseItem(j) {
  const t = j.tooltip ?? '';
  const lines = text(t.split('<div class="whtt-sellprice">')[0]);
  const [slot, type] = (lines.find((l) => /^(Head|Neck|Shoulder|Back|Chest|Shirt|Tabard|Wrist|Hands|Waist|Legs|Feet|Finger|Trinket|One-Hand|Two-Hand|Main Hand|Off Hand|Held In Off-hand|Ranged|Thrown|Relic)\b/.test(l)) ?? '').split('\t');
  const stats = lines.filter((l) => /^(\+|\d+ Armor|\d+ - \d+( \w+)? Damage|\(\d|Equip:|Use:|Chance on hit:|\d+ Block)/.test(l)).map((l) => l.replace(/\t/g, ' · '));
  const chance = t.match(/Drop Chance: ([\d.]+)%/);
  return {
    name: j.name, q: j.quality, icon: j.icon,
    ilvl: +(t.match(/<!--ilvl-->(\d+)/) || [])[1] || null,
    req: +(t.match(/<!--rlvl-->(\d+)/) || [])[1] || null,
    slot: slot || null, type: type || null,
    bind: /Binds when picked up/.test(t) ? 'BoP' : /Binds when equipped/.test(t) ? 'BoE' : null,
    unique: /Unique/.test(t) || undefined,
    quest: /Quest Item|This Item Begins a Quest/.test(t) || undefined,
    stats,
    chance: chance ? +chance[1] : null,
  };
}

function parseSpell(j) {
  const t = j.tooltip ?? '';
  const desc = (t.match(/<div class="q">([\s\S]*?)<\/div>/) || [])[1];
  const head = text(t.split('<div class="q">')[0]).slice(1); // after the name: range, cast time, cooldown
  const school = (j.buff ?? '').match(/<th class="q"><b class="q">([^<]+)<\/b><\/th>/)?.[1] ?? null;
  return { name: j.name, icon: j.icon || null, desc: desc ? text(desc).join(' ') : '', meta: head.join(' · ').replace(/\t/g, ' · '), school };
}

function parseNpc(j) {
  const lines = text(j.tooltip ?? '');
  const info = lines.find((l) => /(Elite|Boss|Rare|Humanoid|Undead|Beast|Demon|Dragonkin|Elemental|Giant|Mechanical|Critter)/.test(l)) ?? '';
  return {
    name: j.name,
    title: lines.length > 2 && !/Level|Elite/.test(lines[1]) ? lines[1] : null,
    level: (info.match(/Level (\d+(?: - \d+)?|\?\?)/) || [])[1] ?? null,
    kind: info.replace(/Level (\d+(?: - \d+)?|\?\?)\s*/, '') || null,
  };
}

async function get(kind, id) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(API + kind + '/' + id, { headers: UA });
    if (res.ok) return res.json();
    if (res.status === 404) return null;
    await sleep(2000 * (attempt + 1));
  }
  throw new Error(`${kind} ${id}: request failed`);
}

/** Spell, item and NPC ids used by the dungeon catalog. */
function catalogIds(catalog) {
  const ids = { spells: new Set(), items: new Set(), npcs: new Set() };
  for (const d of catalog) for (const b of d.bosses) {
    b.spells.forEach((s) => ids.spells.add(s));
    b.loot.forEach((i) => ids.items.add(i));
    if (b.npc) ids.npcs.add(b.npc);
  }
  return { spells: [...ids.spells], items: [...ids.items], npcs: [...ids.npcs] };
}

/**
 * Fetches tooltips for every id. ids: { spells, items, npcs } arrays. db: the Wowhead data build this matches.
 * previous + force=false reuses already-known entries (used by the script for quick reruns).
 * Returns { data: { meta, spells, items, npcs }, icons, missing }.
 */
async function buildDungeonData({ ids, db = null, previous = null, force = true, onProgress = () => {}, delay = 250 }) {
  const data = { meta: { importedAt: new Date().toISOString().slice(0, 10), db, source: 'Wowhead WoW Forever tooltips' }, spells: {}, items: {}, npcs: {} };
  const parsers = { spells: ['spell', parseSpell, 'abilities'], items: ['item', parseItem, 'loot'], npcs: ['npc', parseNpc, 'bosses'] };
  const total = ids.spells.length + ids.items.length + ids.npcs.length;
  const missing = [];
  let done = 0;
  for (const [group, [kind, parse, label]] of Object.entries(parsers)) {
    for (const id of ids[group]) {
      done++;
      if (!force && previous?.[group]?.[id]) { data[group][id] = previous[group][id]; continue; }
      onProgress(done / total, `Downloading dungeon ${label} (${done} of ${total})…`);
      const j = await get(kind, id);
      if (j?.name) data[group][id] = parse(j);
      else missing.push(`${kind} ${id}`);
      await sleep(delay);
    }
  }
  const icons = [...new Set([...Object.values(data.spells), ...Object.values(data.items)].map((x) => x.icon).filter(Boolean))];
  return { data, icons, missing };
}

module.exports = { buildDungeonData, catalogIds };
