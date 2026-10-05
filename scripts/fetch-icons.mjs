// Looks up the in-game icon for every talent (via Wowhead's Classic search) and downloads
// all icons into public/icons so the app works offline. Safe to re-run: known icons are skipped.
// Usage: npm run icons
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLASS_DIR = path.join(ROOT, 'src', 'data', 'classes');
const MAP_FILE = path.join(ROOT, 'src', 'data', 'icons.json');
const ICON_DIR = path.join(ROOT, 'public', 'icons');
const SEARCH = 'https://www.wowhead.com/classic/search/suggestions-template?q=';
const CDN = 'https://wow.zamimg.com/images/wow/icons/large/';
const UA = { 'User-Agent': 'Mozilla/5.0 (EverhartGuides icon fetcher)' };

// Icons that aren't talents: classes, professions and a few UI glyphs.
const STATIC_ICONS = {
  'class/warrior': 'classicon_warrior', 'class/paladin': 'classicon_paladin', 'class/hunter': 'classicon_hunter',
  'class/rogue': 'classicon_rogue', 'class/priest': 'classicon_priest', 'class/shaman': 'classicon_shaman',
  'class/mage': 'classicon_mage', 'class/warlock': 'classicon_warlock', 'class/druid': 'classicon_druid',
  'prof/alchemy': 'trade_alchemy', 'prof/blacksmithing': 'trade_blacksmithing', 'prof/enchanting': 'trade_engraving',
  'prof/engineering': 'trade_engineering', 'prof/herbalism': 'spell_nature_naturetouchgrow', 'prof/leatherworking': 'inv_misc_armorkit_17',
  'prof/mining': 'trade_mining', 'prof/skinning': 'inv_misc_pelt_wolf_01', 'prof/tailoring': 'trade_tailoring',
  'prof/cooking': 'inv_misc_food_15', 'prof/first-aid': 'spell_holy_sealofsacrifice', 'prof/fishing': 'trade_fishing',
  // Talents Wowhead's search doesn't match by name.
  'mage/Shatter': 'spell_frost_frostshock',
  'paladin/Eye for an Eye': 'spell_holy_eyeforaneye',
  'warlock/Improved Succubus': 'spell_shadow_summonsuccubus',
  'warlock/Improved Enslave Demon': 'spell_shadow_enslavedemon',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const map = existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, 'utf8')) : {};
Object.assign(map, STATIC_ICONS);

async function lookup(name, className) {
  const res = await fetch(SEARCH + encodeURIComponent(name), { headers: UA });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const spells = ((await res.json()).results || []).filter((r) => r.typeName === 'Spell' && r.icon && r.name === name);
  const crumbs = (r) => r.pinBreadcrumb || [];
  const pick =
    spells.find((r) => crumbs(r)[0] === 'Talents' && crumbs(r)[1] === className) ||
    spells.find((r) => crumbs(r).includes(className)) ||
    spells.find((r) => crumbs(r)[0] === 'Talents');
  return pick?.icon ?? null;
}

const missing = [];
for (const file of readdirSync(CLASS_DIR).filter((f) => f.endsWith('.js') && f !== 'index.js')) {
  const cls = (await import(pathToFileURL(path.join(CLASS_DIR, file)).href)).default;
  for (const tree of cls.trees) {
    for (const { name } of tree.talents) {
      const key = `${cls.id}/${name}`;
      if (map[key]) continue;
      try {
        const icon = await lookup(name, cls.name);
        if (icon) map[key] = icon;
        else missing.push(key);
      } catch (e) {
        missing.push(`${key} (${e.message})`);
        if (e.message.includes('403')) await sleep(15000); // rate limited — back off
      }
      await sleep(1500);
    }
    process.stdout.write(`  ${cls.name}/${tree.name} done\n`);
  }
}

writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');

mkdirSync(ICON_DIR, { recursive: true });
let downloaded = 0;
for (const icon of new Set(Object.values(map))) {
  const out = path.join(ICON_DIR, `${icon}.jpg`);
  if (existsSync(out)) continue;
  const res = await fetch(CDN + icon + '.jpg', { headers: UA });
  if (!res.ok) { missing.push(`image ${icon} (HTTP ${res.status})`); continue; }
  writeFileSync(out, Buffer.from(await res.arrayBuffer()));
  downloaded++;
  await sleep(60);
}

console.log(`\n${Object.keys(map).length} icons mapped, ${downloaded} images downloaded.`);
if (missing.length) console.log(`No icon found for:\n  ${missing.join('\n  ')}`);
