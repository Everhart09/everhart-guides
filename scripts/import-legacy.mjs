// Refreshes the bundled Legacy System perk text and icons from the WoW Forever game data (Wowhead tooltips).
// Writes src/data/legacyDb.json and downloads missing icons into public/icons.   Usage: npm run legacy
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { buildLegacyData } = require('../electron/forever-legacy.cjs');
const { latestDataUrl } = require('../electron/forever-data.cjs');
const { dbFromUrl } = require('../electron/forever-gear.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { LEGACY_SPELL_IDS } = await import(pathToFileURL(path.join(ROOT, 'src', 'data', 'legacy.js')).href);
const db = dbFromUrl(await latestDataUrl());
const { data, icons, missing } = await buildLegacyData({ spellIds: LEGACY_SPELL_IDS, db });
console.log(`${Object.keys(data.spells).length} of ${LEGACY_SPELL_IDS.length} perks (data build ${db}).`);
if (missing.length) console.warn('Not found:', missing.join(', '));

const ICON_DIR = path.join(ROOT, 'public', 'icons');
mkdirSync(ICON_DIR, { recursive: true });
let got = 0;
for (const icon of icons) {
  const file = path.join(ICON_DIR, `${icon}.jpg`);
  if (existsSync(file)) continue;
  const res = await fetch(`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`);
  if (res.ok) { writeFileSync(file, Buffer.from(await res.arrayBuffer())); got++; }
}
console.log(`Icons: ${icons.length} needed, ${got} downloaded.`);
writeFileSync(path.join(ROOT, 'src', 'data', 'legacyDb.json'), JSON.stringify(data, null, 1) + '\n');
console.log('Wrote src/data/legacyDb.json');
