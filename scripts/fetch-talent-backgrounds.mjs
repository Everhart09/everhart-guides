// Downloads the in-game background art for every talent tree (the images behind each tree in the game's talent
// window) from Wowhead's CDN into public/talent-bg/<class>-<tree>.jpg.   Usage: npm run talent-bg
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { latestDataUrl, TREES } = require('../electron/forever-data.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'talent-bg');
const CDN = 'https://wow.zamimg.com/images/wow/talents/backgrounds/classic/';
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' };
const force = process.argv.includes('--force');

// The talent data lists each tree's id next to its in-game name (e.g. 161 → "WarriorArms").
const data = await (await fetch(await latestDataUrl(), { headers: UA })).text();
const idOf = {};
for (const m of data.matchAll(/\{"id":(\d+),"description":"([A-Za-z]+)"/g)) idOf[m[2]] = Number(m[1]);

mkdirSync(OUT, { recursive: true });
let saved = 0;
for (const [wowName, classId, treeId] of TREES) {
  const id = idOf[wowName];
  const file = path.join(OUT, `${classId}-${treeId}.jpg`);
  if (!id) { console.warn(`No tree id for ${wowName}`); continue; }
  if (existsSync(file) && !force) continue;
  const res = await fetch(`${CDN}${id}.jpg`, { headers: UA });
  if (!res.ok) { console.warn(`${wowName} (${id}): HTTP ${res.status}`); continue; }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  saved++;
  console.log(`${classId}-${treeId}.jpg  ← ${wowName} (${id})`);
}
console.log(`${saved} backgrounds downloaded to public/talent-bg.`);
