// How each spec values gear in WoW Forever. Used by scripts/import-gear.mjs to rank items.
//
// Weights use Forever's item stat keys (from Wowhead's Forever data). They're based on Wowhead's
// Forever weight presets, converted from Classic's "% crit / % hit" to Forever's ratings
// (≈14 crit rating and ≈10 hit rating per 1%). Physical specs are scaled to 1 Attack Power,
// casters to 1 Spell Power. `dps` is the value of 1 weapon DPS on the main weapon(s).
//
// weapons.plan:  '2h' | 'dw' | '1h+shield' | 'caster' (best of staff, 1H + off-hand, or 1H + shield
//                when shield is allowed) | 'melee-any' (best of two-hander or dual wield)
// Weapon subclasses: axe1h axe2h bow gun mace1h mace2h polearm sword1h sword2h staff fist dagger thrown crossbow wand

const MELEE_1H = ['axe1h', 'sword1h', 'mace1h', 'fist', 'dagger'];
const MELEE_2H = ['axe2h', 'sword2h', 'mace2h', 'polearm'];
const RANGED_PHYS = ['bow', 'gun', 'crossbow', 'thrown'];

export const CLASS_GEAR = {
  warrior: { armor: 'plate' },
  paladin: { armor: 'plate', relic: 'libram' },
  hunter: { armor: 'mail' },
  rogue: { armor: 'leather' },
  priest: { armor: 'cloth' },
  shaman: { armor: 'mail', relic: 'totem' },
  mage: { armor: 'cloth' },
  warlock: { armor: 'cloth' },
  druid: { armor: 'leather', relic: 'idol' },
};

export const GEAR_PROFILES = {
  warrior: {
    arms: {
      weights: { str: 2.2, agi: 1.2, sta: 0.3, atkpwr: 1, critstrkrtng: 1.6, hitrtng: 2.0, exprtng: 1.6, hastertng: 1.0, armor: 0.01 },
      dps: 14, weapons: { plan: '2h', types: MELEE_2H }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
    fury: {
      weights: { str: 2.2, agi: 1.3, sta: 0.3, atkpwr: 1, critstrkrtng: 1.8, hitrtng: 2.4, exprtng: 1.8, hastertng: 1.2, armor: 0.01 },
      dps: 12, offhandDps: 7, weapons: { plan: 'dw', types: MELEE_1H }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
    protection: {
      weights: { sta: 1.5, defrtng: 1.8, dodgertng: 1.6, parryrtng: 1.4, blockrtng: 0.9, armor: 0.06, str: 0.6, agi: 0.9, hitrtng: 0.6, exprtng: 0.6, atkpwr: 0.1 },
      dps: 2, weapons: { plan: '1h+shield', types: MELEE_1H }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
  },
  paladin: {
    retribution: {
      weights: { str: 2.2, agi: 1.1, int: 0.4, sta: 0.3, atkpwr: 1, critstrkrtng: 1.6, hitrtng: 1.8, exprtng: 1.4, hastertng: 0.9, splpwr: 0.4, spldmg: 0.4 },
      dps: 14, weapons: { plan: '2h', types: MELEE_2H },
    },
    holy: {
      weights: { splpwr: 1, int: 1.0, critstrkrtng: 0.9, manargn: 1.8, spi: 0.2, sta: 0.1, hastertng: 0.6 },
      dps: 0, weapons: { plan: '1h+shield', types: ['mace1h', 'sword1h', 'axe1h'] },
    },
    protection: {
      weights: { sta: 1.5, defrtng: 1.8, dodgertng: 1.6, parryrtng: 1.4, blockrtng: 1.0, armor: 0.06, splpwr: 0.6, spldmg: 0.6, int: 0.4, str: 0.4, hitrtng: 0.5 },
      dps: 2, weapons: { plan: '1h+shield', types: ['mace1h', 'sword1h', 'axe1h'] },
    },
  },
  hunter: {
    'beast-mastery': {
      weights: { agi: 2.2, atkpwr: 1, rgdatkpwr: 1, critstrkrtng: 1.6, hitrtng: 2.0, hastertng: 1.0, int: 0.4, sta: 0.2 },
      dps: 0.3, weapons: { plan: '2h', types: ['axe2h', 'sword2h', 'polearm', 'staff'] }, ranged: { types: ['bow', 'gun', 'crossbow'], weight: 14 },
    },
    marksmanship: {
      weights: { agi: 2.2, atkpwr: 1, rgdatkpwr: 1, critstrkrtng: 1.8, hitrtng: 2.2, hastertng: 1.0, int: 0.5, sta: 0.2 },
      dps: 0.3, weapons: { plan: '2h', types: ['axe2h', 'sword2h', 'polearm', 'staff'] }, ranged: { types: ['bow', 'gun', 'crossbow'], weight: 16 },
    },
    survival: {
      weights: { agi: 2.4, atkpwr: 1, rgdatkpwr: 0.5, critstrkrtng: 1.6, hitrtng: 2.0, hastertng: 1.0, exprtng: 0.8, int: 0.3, sta: 0.4 },
      dps: 8, offhandDps: 5, weapons: { plan: 'melee-any', types: ['axe1h', 'sword1h', 'fist', 'dagger', 'axe2h', 'sword2h', 'polearm', 'staff'] },
      ranged: { types: ['bow', 'gun', 'crossbow'], weight: 6 },
    },
  },
  rogue: {
    combat: {
      weights: { agi: 2.0, str: 1.0, atkpwr: 1, critstrkrtng: 1.5, hitrtng: 2.4, exprtng: 2.0, hastertng: 1.3, sta: 0.2 },
      dps: 12, offhandDps: 7, weapons: { plan: 'dw', types: ['sword1h', 'axe1h', 'fist', 'mace1h'] }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
    assassination: {
      weights: { agi: 2.0, str: 1.0, atkpwr: 1, critstrkrtng: 2.0, hitrtng: 2.2, exprtng: 1.6, hastertng: 1.1, sta: 0.2 },
      dps: 10, offhandDps: 8, weapons: { plan: 'dw', types: ['dagger'] }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
    subtlety: {
      weights: { agi: 2.0, str: 1.0, atkpwr: 1.2, critstrkrtng: 1.4, hitrtng: 2.0, exprtng: 1.5, hastertng: 1.1, sta: 0.6 },
      dps: 10, offhandDps: 6, weapons: { plan: 'dw', types: ['dagger', 'sword1h', 'axe1h', 'fist', 'mace1h'] }, ranged: { types: RANGED_PHYS, weight: 0.3 },
    },
  },
  priest: {
    shadow: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.4, critstrkrtng: 0.6, hastertng: 0.9, int: 0.35, spi: 0.3, sta: 0.25 },
      dps: 0, weapons: { plan: 'caster', types: ['mace1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
    holy: {
      weights: { splpwr: 1, int: 0.8, spi: 0.6, manargn: 1.6, critstrkrtng: 0.6, hastertng: 0.6, sta: 0.1 },
      dps: 0, weapons: { plan: 'caster', types: ['mace1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.1 },
    },
    discipline: {
      weights: { splpwr: 1, int: 1.0, spi: 0.4, manargn: 1.4, critstrkrtng: 0.8, hastertng: 0.7, sta: 0.2 },
      dps: 0, weapons: { plan: 'caster', types: ['mace1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.1 },
    },
  },
  shaman: {
    elemental: {
      weights: { splpwr: 1, spldmg: 1, critstrkrtng: 0.9, hitrtng: 1.3, hastertng: 0.9, int: 0.4, manargn: 0.8, sta: 0.15 },
      dps: 0, shield: true, weapons: { plan: 'caster', types: ['mace1h', 'axe1h', 'dagger', 'fist', 'staff'] },
    },
    enhancement: {
      weights: { str: 2.0, agi: 1.6, atkpwr: 1, int: 0.6, critstrkrtng: 1.7, hitrtng: 2.0, exprtng: 1.5, hastertng: 1.2, splpwr: 0.3, sta: 0.3 },
      dps: 14, weapons: { plan: '2h', types: ['axe2h', 'mace2h', 'staff'] },
    },
    restoration: {
      weights: { splpwr: 1, int: 0.8, manargn: 1.8, critstrkrtng: 0.6, hastertng: 0.7, spi: 0.2, sta: 0.1 },
      dps: 0, shield: true, weapons: { plan: 'caster', types: ['mace1h', 'axe1h', 'dagger', 'fist', 'staff'] },
    },
  },
  mage: {
    frost: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.3, critstrkrtng: 0.7, hastertng: 0.9, int: 0.35, spi: 0.1, sta: 0.15 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
    fire: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.4, critstrkrtng: 0.9, hastertng: 0.9, int: 0.35, spi: 0.1, sta: 0.1 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
    arcane: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.2, critstrkrtng: 0.8, hastertng: 0.9, int: 0.6, spi: 0.3, sta: 0.1 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
  },
  warlock: {
    affliction: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.3, critstrkrtng: 0.5, hastertng: 0.9, sta: 0.3, int: 0.3, spi: 0.2 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
    demonology: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.2, critstrkrtng: 0.6, hastertng: 0.8, sta: 0.6, int: 0.3, spi: 0.1 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
    destruction: {
      weights: { splpwr: 1, spldmg: 1, hitrtng: 1.4, critstrkrtng: 0.9, hastertng: 0.9, sta: 0.2, int: 0.3, spi: 0.05 },
      dps: 0, weapons: { plan: 'caster', types: ['sword1h', 'dagger', 'staff'] }, ranged: { types: ['wand'], weight: 0.6 },
    },
  },
  druid: {
    feral: {
      weights: { agi: 2.0, str: 1.6, sta: 0.6, atkpwr: 1, feratkpwr: 1, critstrkrtng: 1.5, hitrtng: 1.8, exprtng: 1.4, hastertng: 1.0, armor: 0.02, defrtng: 0.4, dodgertng: 0.4 },
      dps: 0, weapons: { plan: '2h', types: ['staff', 'mace2h'] },
    },
    balance: {
      weights: { splpwr: 1, spldmg: 1, critstrkrtng: 0.9, hitrtng: 1.3, hastertng: 0.9, int: 0.4, spi: 0.2, sta: 0.15 },
      dps: 0, weapons: { plan: 'caster', types: ['mace1h', 'dagger', 'fist', 'staff'] },
    },
    restoration: {
      weights: { splpwr: 1, int: 0.7, spi: 0.7, manargn: 1.6, critstrkrtng: 0.4, hastertng: 0.7, sta: 0.1 },
      dps: 0, weapons: { plan: 'caster', types: ['mace1h', 'dagger', 'fist', 'staff'] },
    },
  },
};

/** Readable names for the stat keys shown in the app. */
export const STAT_NAMES = {
  str: 'Strength', agi: 'Agility', sta: 'Stamina', int: 'Intellect', spi: 'Spirit',
  atkpwr: 'Attack Power', splpwr: 'Spell Power', spldmg: 'Spell Damage', critstrkrtng: 'Crit Rating',
  hitrtng: 'Hit Rating', hastertng: 'Haste Rating', exprtng: 'Expertise Rating', defrtng: 'Defense Rating',
  dodgertng: 'Dodge Rating', parryrtng: 'Parry Rating', blockrtng: 'Block Rating', manargn: 'Mana per 5',
  rgdatkpwr: 'Ranged Attack Power', feratkpwr: 'Feral Attack Power', armor: 'Armor', dps: 'Weapon DPS', speed: 'Speed',
};
