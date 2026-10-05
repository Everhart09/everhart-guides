// Fills in the dungeon guides with WoW Forever game data: boss abilities, loot and boss info from Wowhead's Forever
// tooltip API, and downloads any missing icons into public/icons. The desktop app can do the same from
// Settings → Check for updates. Writes src/data/dungeons/db.json.   Usage: npm run dungeons [-- --force]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { buildDungeonData, catalogIds } = require('../electron/forever-dungeons.cjs');
const { latestDataUrl } = require('../electron/forever-data.cjs');
const { dbFromUrl } = require('../electron/forever-gear.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'dungeons', 'db.json');
const ICON_DIR = path.join(ROOT, 'public', 'icons');
const CDN = 'https://wow.zamimg.com/images/wow/icons/large/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { CATALOG } = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'dungeons', 'catalog.js')).href);
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null;
const db = dbFromUrl(await latestDataUrl());

let lastPct = -1;
const { data, icons, missing } = await buildDungeonData({
  ids: catalogIds(CATALOG),
  db,
  previous,
  force: process.argv.includes('--force'),
  onProgress: (f, label) => {
    const pct = Math.floor(f * 10) * 10;
    if (pct !== lastPct) { lastPct = pct; console.log(`  ${pct}% ${label}`); }
  },
});
console.log(`Abilities ${Object.keys(data.spells).length}, items ${Object.keys(data.items).length}, bosses ${Object.keys(data.npcs).length} (Wowhead data build ${db}).`);
if (missing.length) console.warn('Not found on Wowhead Forever:', missing.join(', '));

mkdirSync(ICON_DIR, { recursive: true });
let fetched = 0;
for (const icon of icons) {
  const file = path.join(ICON_DIR, `${icon}.jpg`);
  if (existsSync(file)) continue;
  const res = await fetch(CDN + icon + '.jpg');
  if (res.ok) { writeFileSync(file, Buffer.from(await res.arrayBuffer())); fetched++; }
  await sleep(120);
}
console.log(`Icons: ${icons.length} needed, ${fetched} downloaded.`);

writeFileSync(OUT, JSON.stringify(data) + '\n');
console.log('Wrote src/data/dungeons/db.json');
