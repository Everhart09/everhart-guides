// Builds pre-raid gear lists for every spec from Wowhead's WoW Forever item database.
// Ranks level 50+ rare/epic items (that players can actually get) per slot using each spec's weights,
// skipping raid drops, raid-linked quests and high-rank PvP gear.
// Shared by scripts/import-gear.mjs and the Electron app's in-app updater.

const BASE = 'https://www.wowhead.com/forever/items/';
const QUERY = '/min-req-level:50/quality:3:4?filter=161;1;0'; // level 50+, rare/epic, available to players
const UA = { 'User-Agent': 'Mozilla/5.0' };
const CATEGORIES = ['armor/cloth', 'armor/leather', 'armor/mail', 'armor/plate', 'armor/shields', 'armor/slot:2', 'armor/slot:11',
  'armor/slot:12', 'armor/slot:23', 'armor/librams', 'armor/idols', 'armor/totems', 'weapons'];
const TOP_N = 4; // items kept per slot
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CLASS_MASK = { warrior: 1, paladin: 2, hunter: 4, rogue: 8, priest: 16, shaman: 64, mage: 128, warlock: 256, druid: 1024 };
const ARMOR_RANK = { cloth: 1, leather: 2, mail: 3, plate: 4 };
const ARMOR_SUB = { 1: 'cloth', 2: 'leather', 3: 'mail', 4: 'plate', 6: 'shield', 7: 'libram', 8: 'idol', 9: 'totem' };
const WEAPON_SUB = { 0: 'axe1h', 1: 'axe2h', 2: 'bow', 3: 'gun', 4: 'mace1h', 5: 'mace2h', 6: 'polearm', 7: 'sword1h', 8: 'sword2h', 10: 'staff', 13: 'fist', 15: 'dagger', 16: 'thrown', 18: 'crossbow', 19: 'wand' };
const WEAPON_NAMES = { axe1h: 'One-Hand Axe', axe2h: 'Two-Hand Axe', bow: 'Bow', gun: 'Gun', mace1h: 'One-Hand Mace', mace2h: 'Two-Hand Mace', polearm: 'Polearm', sword1h: 'One-Hand Sword', sword2h: 'Two-Hand Sword', staff: 'Staff', fist: 'Fist Weapon', dagger: 'Dagger', thrown: 'Thrown', crossbow: 'Crossbow', wand: 'Wand' };
// Wowhead slot ids → our gear slots.
const ARMOR_SLOTS = { 1: 'head', 2: 'neck', 3: 'shoulders', 16: 'back', 5: 'chest', 20: 'chest', 9: 'wrist', 10: 'hands', 6: 'waist', 7: 'legs', 8: 'feet', 11: 'finger', 12: 'trinket' };
const STAT_KEYS = ['str', 'agi', 'sta', 'int', 'spi', 'atkpwr', 'rgdatkpwr', 'feratkpwr', 'splpwr', 'spldmg', 'critstrkrtng', 'hitrtng', 'hastertng',
  'exprtng', 'defrtng', 'dodgertng', 'parryrtng', 'blockrtng', 'manargn', 'armor', 'dps', 'speed'];
const SOURCE_NAMES = { 1: 'Crafted', 2: 'Drop', 3: 'PvP', 4: 'Quest', 5: 'Vendor', 6: 'Trainer', 14: 'Container' };
const PROFESSIONS = { 164: 'Blacksmithing', 165: 'Leatherworking', 171: 'Alchemy', 197: 'Tailoring', 202: 'Engineering', 333: 'Enchanting', 755: 'Jewelcrafting', 773: 'Inscription' };
const RAID_LINKED = /Onyxia|Nefarian|Dragonslayer|Bronze Dragonflight|Timeless One|Zandalar|Paragons of Power|Qiraji|Ahn'Qiraj|Ossirian|Hakkar|Nozdormu|Ragnaros|Naxxramas/i;
const PVP_RANKS = /^(Premier )?(Private|Scout|Corporal|Grunt|Sergeant|Senior Sergeant|Master Sergeant|Stone Guard|Sergeant Major|First Sergeant|Knight|Blood Guard|Knight-Lieutenant|Legionnaire|Knight-Captain|Centurion|Knight-Champion|Champion|Lieutenant Commander|Lieutenant General|Commander|General|Marshal|Warlord|Field Marshal|Grand Marshal|High Warlord)'s /;

function sliceAt(s, start) {
  const open = s[start], close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true; else if (c === open) depth++; else if (c === close && --depth === 0) return s.slice(start, i + 1);
  }
  return null;
}

async function getText(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers: UA });
    if (res.ok) return res.text();
    if (attempt === 3) throw new Error(`${url} → HTTP ${res.status}`);
    await sleep(5000 * attempt);
  }
}

/** Items from one listing page: listview rows (sources, slots) merged with tooltip data (icons, stats). */
async function fetchCategory(cat) {
  const html = await getText(BASE + cat + QUERY);
  const rowsSrc = sliceAt(html, html.indexOf('[', html.indexOf('var listviewitems')));
  const rows = rowsSrc ? new Function(`return ${rowsSrc}`)() : [];
  const g = html.indexOf('WH.Gatherer.addData(3, ');
  const info = g >= 0 ? JSON.parse(sliceAt(html, html.indexOf('{', g))) : {};
  return rows.map((r) => ({ row: r, info: info[r.id] ?? {} }));
}

function itemKind(row) {
  if (row.classs === 2) return { family: 'weapon', type: WEAPON_SUB[row.subclass] };
  return { family: 'armor', type: ARMOR_SUB[row.subclass] ?? 'misc' };
}

function statsOf(info) {
  const eq = info.jsonequip ?? {};
  const out = {};
  for (const k of STAT_KEYS) if (eq[k]) out[k] = eq[k];
  return out;
}

const scoreOf = (item, profile) => Object.entries(profile.weights).reduce((s, [k, w]) => s + (item.stats[k] || 0) * w, 0);
const usableBy = (item, classId) => !item.classes || (item.classes & CLASS_MASK[classId]) !== 0;

/** Best n items, keeping only the highest-scoring version of items that share a name. */
function top(list, n = TOP_N) {
  const seen = new Set();
  return list.sort((a, b) => b.score - a.score)
    .filter((x) => !seen.has(x.item.name) && seen.add(x.item.name))
    .slice(0, n).map((x) => ({ id: x.item.id, score: Math.round(x.score) }));
}

function buildSpec(cls, profile, items, classId) {
  const mine = items.filter((it) => usableBy(it, classId));
  const slots = {};

  for (const slot of ['head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet', 'finger', 'trinket']) {
    const options = mine.filter((it) => it.slot === slot && (it.family !== 'armor' || !(it.type in ARMOR_RANK) || slot === 'back'
      || ARMOR_RANK[it.type] <= ARMOR_RANK[cls.armor]));
    slots[slot] = top(options.map((item) => ({ item, score: scoreOf(item, profile) })), slot === 'finger' || slot === 'trinket' ? TOP_N + 1 : TOP_N);
  }

  const weaponScore = (item, dpsWeight) => scoreOf(item, profile) + (item.stats.dps || 0) * dpsWeight;
  const allowed = new Set(profile.weapons.types);
  const twoH = mine.filter((it) => it.wslot === '2h' && allowed.has(it.type));
  const oneH = mine.filter((it) => (it.wslot === '1h' || it.wslot === 'mh') && allowed.has(it.type));
  const offWeapons = mine.filter((it) => (it.wslot === '1h' || it.wslot === 'oh') && allowed.has(it.type));
  const shields = mine.filter((it) => it.wslot === 'shield');
  const held = mine.filter((it) => it.wslot === 'held');
  const best = (list, w) => top(list.map((item) => ({ item, score: weaponScore(item, w) })));
  const plan = profile.weapons.plan;
  const dps = profile.dps ?? 0;
  const offDps = profile.offhandDps ?? dps / 2;

  if (plan === '2h' || plan === 'melee-any' || plan === 'caster') slots.twoHand = best(twoH, dps);
  if (plan === 'dw' || plan === 'melee-any') { slots.mainHand = best(oneH, dps); slots.offHand = best(offWeapons, offDps); }
  if (plan === '1h+shield') { slots.mainHand = best(oneH, dps); slots.shield = top(shields.map((item) => ({ item, score: scoreOf(item, profile) }))); }
  if (plan === 'caster') {
    slots.mainHand = best(oneH.filter((it) => it.type !== 'staff'), 0);
    slots.offHand = top(held.map((item) => ({ item, score: scoreOf(item, profile) })));
    if (profile.shield) slots.shield = top(shields.map((item) => ({ item, score: scoreOf(item, profile) })));
  }

  if (profile.ranged) {
    const types = new Set(profile.ranged.types);
    slots.ranged = top(mine.filter((it) => it.family === 'weapon' && types.has(it.type))
      .map((item) => ({ item, score: scoreOf(item, profile) + (item.stats.dps || 0) * profile.ranged.weight })));
  }
  if (cls.relic) {
    slots.relic = top(mine.filter((it) => it.type === cls.relic).map((item) => ({ item, score: scoreOf(item, profile) + 1 })));
  }

  // Recommended weapon setup: compare the best two-hander with the best one-hand combination.
  const sum = (...lists) => lists.reduce((s, l) => s + (l?.[0]?.score ?? 0), 0);
  let setup = plan;
  if (plan === 'melee-any') setup = sum(slots.twoHand) >= sum(slots.mainHand, slots.offHand) ? '2h' : 'dw';
  if (plan === 'caster') {
    const oneHand = sum(slots.mainHand) + Math.max(sum(slots.offHand), profile.shield ? sum(slots.shield) : 0);
    setup = sum(slots.twoHand) >= oneHand ? 'staff' : 'one-hand';
  }
  for (const k of Object.keys(slots)) if (!slots[k].length) delete slots[k];
  return { setup, slots };
}

/**
 * Downloads the Forever item database and builds gear lists.
 * @param profiles   GEAR_PROFILES from src/data/gearProfiles.js
 * @param classGear  CLASS_GEAR from src/data/gearProfiles.js
 * @param db         Wowhead database build id (stored so the app can tell when gear is out of date)
 * @param onProgress (fraction 0–1, label)
 * @param log        optional logger for the command-line script
 * Returns { meta, items, specs, icons } where icons is the list of item icon names to download.
 */
async function buildGearData({ profiles, classGear, db = null, onProgress = () => {}, log = () => {} }) {
  const zoneCache = {};
  const zoneInfo = async (id) => {
    if (!id || id < 0) return null;
    if (!(id in zoneCache)) {
      try {
        const res = await fetch(`https://nether.wowhead.com/forever/tooltip/zone/${id}`, { headers: UA });
        const j = await res.json();
        zoneCache[id] = { name: j.name, type: j.tooltip?.match(/Type: ([A-Za-z ]+)/)?.[1]?.trim() ?? 'Zone' };
      } catch {
        zoneCache[id] = { name: `Zone ${id}`, type: 'Zone' };
      }
      await sleep(250);
    }
    return zoneCache[id];
  };
  const zoneTypeOf = (name) => Object.values(zoneCache).find((z) => z?.name === name)?.type;

  const describeSource = async (row) => {
    const kind = row.source?.[0];
    const more = row.sourcemore?.[0] ?? {};
    if (!kind) return { text: 'Source not listed yet (new or changed in Forever)', type: 'unknown', raid: false };
    const zone = await zoneInfo(more.z ?? (kind === 4 ? more.c : undefined));
    const raid = zone?.type === 'Raid';
    const where = zone ? zone.name : null;
    switch (kind) {
      case 2: return { text: more.n ? `Drop: ${more.n}${where ? ` (${where})` : ''}` : `Drop${where ? `: ${where}` : ' (world drop)'}`, type: 'drop', zone: where, raid };
      case 4: return { text: `${more.n ? `Quest: ${more.n}` : 'Quest reward'}${where ? ` (${where})` : ''}`, type: 'quest', zone: where, raid };
      case 1: return { text: `Crafted: ${PROFESSIONS[more.s] ?? 'profession'}`, type: 'crafted', raid: false };
      case 5: return { text: more.n ? `Vendor: ${more.n}` : 'Vendor', type: 'vendor', raid: false };
      case 3: return { text: 'PvP reward', type: 'pvp', raid: false };
      default: return { text: SOURCE_NAMES[kind] ?? 'Other', type: 'other', zone: where, raid };
    }
  };

  // 1. Download item categories (0–60%).
  const raw = new Map();
  for (const [i, cat] of CATEGORIES.entries()) {
    onProgress((0.6 * i) / CATEGORIES.length, `Downloading gear (${i + 1} of ${CATEGORIES.length})…`);
    const entries = await fetchCategory(cat);
    for (const e of entries) raw.set(e.row.id, e);
    log(`  ${cat}: ${entries.length} items`);
    await sleep(1500);
  }

  // 2. Read sources and look up zones (60–90%).
  const items = [];
  let raidSkipped = 0;
  const rows = [...raw.values()];
  for (const [i, { row, info }] of rows.entries()) {
    if (i % 100 === 0) onProgress(0.6 + (0.3 * i) / rows.length, 'Finding where each item comes from…');
    const { family, type } = itemKind(row);
    let slot = ARMOR_SLOTS[row.slot] ?? null;
    let wslot = null;
    if (family === 'weapon') {
      wslot = { 13: '1h', 21: 'mh', 22: 'oh', 17: '2h', 15: 'ranged', 25: 'ranged', 26: 'ranged' }[row.slot] ?? null;
      slot = 'weapon';
    } else if (row.slot === 14) { wslot = 'shield'; slot = 'weapon'; }
    else if (row.slot === 23) { wslot = 'held'; slot = 'weapon'; }
    else if (row.slot === 28) { slot = 'relic'; }
    if (!slot) continue;
    const source = await describeSource(row);
    if (source.raid) { raidSkipped++; continue; }
    items.push({
      id: row.id,
      name: row.name,
      icon: info.icon ?? null,
      quality: row.quality,
      ilvl: row.level,
      reqlevel: row.reqlevel,
      family, type, slot, wslot,
      typeName: family === 'weapon' ? WEAPON_NAMES[type] : type,
      classes: info.jsonequip?.classes ?? row.reqclass ?? 0,
      side: row.side ?? 0,
      stats: statsOf(info),
      source,
      forever: row.envChange?.status ?? 'unchanged',
    });
  }

  // 3. Pre-raid cutoff: the best item level that drops from regular dungeons. Above that is raid, high-rank
  //    PvP or endgame gear. Also drop rewards that need a raid (Onyxia, AQ, ZG quest lines, etc.).
  onProgress(0.92, 'Ranking items for every spec…');
  const dungeonIlvls = items.filter((it) => it.source.type === 'drop' && it.source.zone && zoneTypeOf(it.source.zone) === 'Dungeon').map((it) => it.ilvl);
  const maxIlvl = dungeonIlvls.length ? Math.max(...dungeonIlvls) : 63;
  const beforeCap = items.length;
  for (let i = items.length - 1; i >= 0; i--) {
    const it = items[i];
    const raidLinked = RAID_LINKED.test(it.name) || RAID_LINKED.test(it.source.text);
    if (it.ilvl > maxIlvl || raidLinked) items.splice(i, 1);
    else if (PVP_RANKS.test(it.name)) {
      const vendor = it.source.type === 'vendor' && it.source.text !== 'Vendor' ? it.source.text.replace(/^Vendor: /, '') : null;
      it.source = { ...it.source, text: vendor ? `PvP: Honor rank reward (${vendor})` : 'PvP: Honor rank reward', type: 'pvp' };
    }
  }
  log(`\nPre-raid item level cap: ${maxIlvl} (best regular dungeon drop). Removed ${beforeCap - items.length} raid/endgame items.`);
  log(`${items.length} candidate items (${raidSkipped} raid drops skipped), ${Object.keys(zoneCache).length} zones looked up.`);

  // 4. Rank per spec.
  const specs = {};
  const used = new Set();
  for (const [classId, specProfiles] of Object.entries(profiles)) {
    for (const [specId, profile] of Object.entries(specProfiles)) {
      const result = buildSpec(classGear[classId], profile, items, classId);
      specs[`${classId}/${specId}`] = result;
      for (const list of Object.values(result.slots)) for (const { id } of list) used.add(id);
    }
  }

  const itemMap = {};
  for (const it of items) {
    if (!used.has(it.id)) continue;
    const { family, wslot, classes, ...rest } = it;
    itemMap[it.id] = rest;
  }
  onProgress(1, 'Gear lists ready');
  return {
    meta: {
      source: 'Wowhead WoW Forever item database',
      importedAt: new Date().toISOString().slice(0, 10),
      db,
      minLevel: 50,
      maxItemLevel: maxIlvl,
      items: Object.keys(itemMap).length,
    },
    items: itemMap,
    specs,
    icons: [...new Set(Object.values(itemMap).map((i) => i.icon).filter(Boolean))],
  };
}

/** Wowhead database build id from a Wowhead data URL (the "db=" parameter). */
const dbFromUrl = (url) => url?.match(/[?&]db=(\d+)/)?.[1] ?? null;

module.exports = { buildGearData, dbFromUrl };
