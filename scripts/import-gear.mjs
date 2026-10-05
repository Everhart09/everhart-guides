// Builds the bundled pre-raid gear lists (src/data/gear.json) from Wowhead's WoW Forever item database
// and downloads item icons. The desktop app can also do this itself from Settings → Check for updates.
// Usage: npm run gear
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CLASS_GEAR, GEAR_PROFILES } from '../src/data/gearProfiles.js';

const require = createRequire(import.meta.url);
const { buildGearData, dbFromUrl } = require('../electron/forever-gear.cjs');
const { latestDataUrl, fetchIcon } = require('../electron/forever-data.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'src', 'data', 'gear.json');
const ICON_DIR = path.join(ROOT, 'public', 'icons');

const db = dbFromUrl(await latestDataUrl());
const { icons, ...gear } = await buildGearData({ profiles: GEAR_PROFILES, classGear: CLASS_GEAR, db, log: console.log });
writeFileSync(OUT_FILE, JSON.stringify(gear, null, 1) + '\n');

mkdirSync(ICON_DIR, { recursive: true });
let downloaded = 0;
for (const icon of icons) {
  const out = path.join(ICON_DIR, `${icon}.jpg`);
  if (existsSync(out)) continue;
  const img = await fetchIcon(icon);
  if (img) { writeFileSync(out, img); downloaded++; }
}
console.log(`Wrote gear lists for ${Object.keys(gear.specs).length} specs (${gear.meta.items} items, database ${db}). ${downloaded} new icons downloaded.`);
