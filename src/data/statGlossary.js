// Plain-English descriptions of the stats used in the spec guides' stat priorities. Matched by the start of the
// stat name, so "Spell Hit (to 10%)" uses the "Spell Hit" entry. More specific names come first.
const GLOSSARY = [
  ['Spell Damage', 'Adds to the damage of your spells. Items may boost all schools or only one, such as Shadow or Frost.'],
  ['Spell Hit', 'Lowers the chance your spells miss. Higher-level targets resist more often, so it matters most against bosses.'],
  ['Spell Critical', 'The chance your spells crit for extra damage or healing.'],
  ['+Healing', 'Increases the size of your heals.'],
  ['Mana per 5', 'Mana restored every 5 seconds, even while casting. Keeps you healing through long fights.'],
  ['Melee Weapon DPS', 'The weapon\'s damage per second. Most of your abilities scale with it.'],
  ['Ranged Weapon DPS', 'Your bow, gun or crossbow\'s damage per second, which drives Auto Shot and your shots.'],
  ['Weapon DPS', 'The weapon\'s damage per second; slower weapons also make each special attack hit harder.'],
  ['Weapon Skill', 'Lowers misses and glancing blows against higher-level targets.'],
  ['Strength / Attack Power', 'Strength turns into attack power, which raises all your physical damage.'],
  ['Strength', 'Turns into attack power for most melee classes, and increases how much your shield blocks.'],
  ['Attack Power', 'Directly raises all your physical damage.'],
  ['Agility', 'Adds crit chance, armor and dodge. For rogues, hunters and Feral druids it also adds attack power.'],
  ['Stamina', 'More health. Always valuable for tanks and in PvP.'],
  ['Intellect', 'A bigger mana pool and more spell crit chance.'],
  ['Spirit', 'Faster health and mana regeneration out of combat. Mostly a leveling stat.'],
  ['Critical Strike', 'The chance your attacks crit for double damage.'],
  ['Hit', 'Lowers the chance your attacks miss. Dual-wielders need more of it, and bosses dodge more often.'],
  ['Defense', 'Lowers your chance to be hit, crit or crushed. Tanks need enough to avoid crits from raid bosses.'],
  ['Dodge / Parry / Block', 'Avoidance: attacks that miss you entirely, or are partly blocked.'],
  ['Block', 'Lets your shield stop part of an incoming hit. Some abilities, like Revenge, react to blocks.'],
  ['Armor', 'Reduces physical damage taken.'],
];

/** A short description for a stat name from a spec's stat priority, or ''. */
export function statDescription(name) {
  return GLOSSARY.find(([prefix]) => name.startsWith(prefix))?.[1] ?? '';
}

export const TIER_MEANING = {
  Best: 'What you should aim for.',
  Good: 'Solid if you find a better item of this type.',
  Usable: 'Fine while leveling or until you upgrade.',
  Avoid: 'Works against how this spec plays.',
};
