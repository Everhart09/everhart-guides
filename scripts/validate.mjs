// Checks every class: builds are legal on the WoW Forever talent trees (tier gates, prerequisites,
// max ranks, 51 points), and warns about **abilities** in guide text that don't exist in Forever.
import { CLASSES } from '../src/data/classes/index.js';
import { classAbilities } from '../src/data/talents/index.js';
import { LEVEL_ROTATIONS } from '../src/data/levelRotations.js';
import { indexTalents, unknownAbilityMentions, validateClass } from '../src/lib/talents.js';

// Bolded terms that are fine even though they aren't spells (stances/forms by name, item uses, etc.).
const ALLOWED = ['Auto Shot', 'Auto-attack', 'Powershift',
  // Warlock pets and pet abilities
  'Imp', 'Voidwalker', 'Succubus', 'Incubus', 'Felhunter', 'Sacrifice', 'Seduce', 'Seduction', 'Spell Lock', 'Devour Magic'];

let failed = 0;
let warned = 0;
for (const cls of CLASSES) {
  const errors = validateClass(cls);
  const known = [...classAbilities(cls.id).map(([n]) => n), ...Object.keys(indexTalents(cls)), ...ALLOWED];
  const lr = LEVEL_ROTATIONS[cls.id] ?? {};
  const warnings = [];
  for (const spec of cls.specs) {
    const r = spec.rotation;
    const texts = [...r.opener, ...r.single, ...r.aoe, ...r.cooldowns, ...r.notes,
      ...[...(lr.shared ?? []), ...(lr[spec.id] ?? [])].flatMap(([, , steps, tip]) => [...steps, tip ?? ''])];
    const unknown = unknownAbilityMentions(texts, known);
    if (unknown.length) warnings.push(`${spec.name}: ${unknown.join(', ')}`);
  }
  if (errors.length) {
    failed += errors.length;
    errors.forEach((e) => console.log('  ✗ ' + e));
  } else {
    console.log(`  ✓ ${cls.name} builds`);
  }
  warned += warnings.length;
  warnings.forEach((w) => console.log(`  ⚠ ${cls.name}/${w} — not found in WoW Forever`));
}

if (failed) {
  console.log(`\n${failed} build problem(s) found.`);
  process.exit(1);
}
console.log(warned ? `\nBuilds valid. ${warned} spec(s) mention abilities to review.` : '\nAll class data valid.');
