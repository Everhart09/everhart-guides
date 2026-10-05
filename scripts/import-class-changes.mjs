// Builds the "What's new in Forever" comparison: Classic Era vs WoW Forever talents and abilities for every class.
// Classic data comes from Wowhead's Classic talent calculator; Forever data is the bundled src/data/talents.
// Writes src/data/classChanges.json.   Usage: npm run changes
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { fetchForeverData } = require('../electron/forever-data.cjs');
const { buildClassChanges } = require('../electron/class-changes.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJSON = (file) => JSON.parse(readFileSync(path.join(ROOT, file), 'utf8'));
const forever = { ...readJSON('src/data/talents/forever.json'), abilities: readJSON('src/data/talents/abilities.json') };

const classic = await fetchForeverData(() => {}, 'classic');
const changes = buildClassChanges(forever, classic);
for (const [classId, { talents: t, abilities: a }] of Object.entries(changes.classes)) {
  console.log(`${classId.padEnd(8)} talents +${t.added.length} −${t.removed.length} ~${t.changed.length} | abilities +${a.added.length} −${a.removed.length} level±${a.levelChanged.length}`);
}
writeFileSync(path.join(ROOT, 'src/data/classChanges.json'), JSON.stringify(changes, null, 1) + '\n');
console.log('Wrote src/data/classChanges.json');
