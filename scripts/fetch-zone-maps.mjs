// Downloads the WoW Forever world map for every zone on the leveling route (Wowhead's Forever map images) into
// public/maps/<zone id>.jpg, so the Leveling & Route tab can show them offline.   Usage: npm run maps [-- --force]
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'maps');
// "classicplus" is Wowhead's internal name for WoW Forever; its maps include Forever's new zones.
const CDN = 'https://wow.zamimg.com/images/wow/classicplus/maps/enus/zoom/';
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' };
const force = process.argv.includes('--force');

const { ZONES } = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'levelingRoute.js')).href);
mkdirSync(OUT, { recursive: true });
let saved = 0;
for (const z of ZONES) {
  if (!z.zone) { console.warn(`${z.name}: no zone id`); continue; }
  const file = path.join(OUT, `${z.zone}.jpg`);
  if (existsSync(file) && !force) continue;
  const res = await fetch(`${CDN}${z.zone}.jpg`, { headers: UA });
  if (!res.ok) { console.warn(`${z.name} (${z.zone}): HTTP ${res.status}`); continue; }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  saved++;
  await new Promise((r) => setTimeout(r, 150));
}
// Record which Wowhead data build these maps match, so the app knows when to offer a map update.
const require = createRequire(import.meta.url);
const { latestDataUrl } = require('../electron/forever-data.cjs');
const db = (await latestDataUrl()).match(/[?&]db=(\d+)/)?.[1] ?? null;
writeFileSync(path.join(ROOT, 'src', 'data', 'zoneMaps.json'), JSON.stringify({ db, importedAt: new Date().toISOString().slice(0, 10), count: ZONES.filter((z) => z.zone).length }, null, 1) + '\n');
console.log(`${saved} maps downloaded to public/maps (data build ${db}).`);
