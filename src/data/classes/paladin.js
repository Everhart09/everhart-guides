import { foreverTrees } from '../talents/index.js';

// Build: ordered list of [talent name, points]. The first point lands at level 10, one per level after.
export default {
  id: 'paladin',
  name: 'Paladin',
  color: '#F48CBA',
  resource: 'Mana',
  armor: 'Mail → Plate (40)',
  weaponsUsable: 'Swords, maces, axes, polearms (one & two-handed)',
  description:
    'A holy warrior who blends plate armor, healing and powerful Blessings. Paladins are almost impossible to kill thanks to Divine Shield and Lay on Hands, buff entire raids with Blessings, and are the Alliance\'s premier healers.',
  milestones: [
    [1, 'Seal of Righteousness & Holy Light', 'Devotion Aura'],
    [4, 'Judgement & Blessing of Might', ''],
    [6, 'Divine Protection', 'Your first bubble'],
    [8, 'Hammer of Justice', 'A 6 sec stun'],
    [10, 'Lay on Hands', 'Full heal'],
    [20, 'Flash of Light & Exorcism', 'Fast heal'],
    [34, 'Divine Shield', 'Full immunity for 12 sec'],
    [40, 'Charger & Plate', 'Class quest mount — free epic-feel mount at 60'],
  ],
  trees: foreverTrees('paladin'),
  specs: [
    {
      id: 'retribution', tree: 'retribution', name: 'Retribution', role: 'Melee DPS', roles: ['dps'],
      tagline: 'Seal of Command crits with a giant two-hander.',
      difficulty: 2,
      ratings: { leveling: 4, solo: 4, group: 3, pvp: 4, raid: 2 },
      summary:
        'Retribution is the paladin leveling spec. A slow two-handed weapon with Seal of Command produces big Holy procs, Vengeance boosts damage after crits, and Repentance gives you a CC. You can still heal yourself and bubble, so you rarely die — just level a little slower than pure DPS classes.',
      pros: [
        'Extremely hard to die — heals, bubble, Lay on Hands',
        'Seal of Command + slow weapon = huge burst crits',
        'Repentance adds a CC for PvP',
        'Can still heal dungeons in a pinch',
      ],
      cons: [
        'Low sustained damage and limited raid demand',
        'Mana-dependent; long fights drain you',
        'Few gap closers — kiting classes are a problem',
      ],
      stats: [
        { name: 'Weapon DPS / Speed', weight: 100, note: 'Slow two-handers (3.5+) for Seal of Command' },
        { name: 'Strength', weight: 85, note: 'Divine Strength boosts it' },
        { name: 'Critical Strike', weight: 70, note: 'Vengeance uptime' },
        { name: 'Hit', weight: 65, note: '' },
        { name: 'Intellect', weight: 45, note: 'Mana for seals and heals' },
        { name: 'Stamina', weight: 40, note: '' },
      ],
      weapons: [
        { type: 'Slow Two-Handed Sword / Mace / Axe', tier: 'Best', note: 'Speed 3.5+ — Arcanite Reaper, Ashkandi, etc.' },
        { type: 'Polearm', tier: 'Good', note: '' },
        { type: 'One-Hand + Shield', tier: 'Avoid', note: 'Ret talents reward two-handers' },
      ],
      rotation: {
        opener: ['**Seal of the Crusader** → **Judgement**', '**Seal of Command** active', '**Holy Strike** on the pull'],
        single: ['Keep **Seal of Command** up', '**Holy Strike** on cooldown — Sacred Arbiter refreshes your Judgements', '**Judgement** on cooldown, then re-seal', '**Hammer of Wrath** on low-health targets (44)', '**Exorcism** on undead and demons'],
        aoe: ['**Consecration** (baseline in Forever)', '**Holy Wrath** on undead/demon packs (50)', '**Retribution Aura** for passive damage'],
        cooldowns: ['**Divine Shield** + heal when in trouble', '**Lay on Hands** for a full heal', '**Repentance** to CC a target'],
        notes: ['Twist of Light: swapping seals gives an Echo — your next swing still applies the old seal', '**Blessing of Might** on yourself; **Blessing of Freedom** vs snares'],
      },
      leveling: [
        'Seal of Righteousness early, Seal of Command from the talent at 20',
        'Judge Wisdom to regain mana while fighting',
        'Group up — paladins boost every party they join',
        'Charger class quest at 60 saves 1,000 gold',
      ],
      races: [
        { name: 'Human', why: '+5 Sword/Mace skill, Perception' },
        { name: 'Dwarf', why: 'Stoneform & Frost resist' },
      ],
      professions: [
        { name: 'Mining + Blacksmithing', why: 'Plate and two-handers' },
        { name: 'Engineering', why: 'PvP' },
      ],
      consumables: ['Elixir of the Mongoose', 'Elixir of Giants', 'Major Mana Potion', 'Dense Sharpening Stone'],
      build: [
        ['Benediction', 5], ['Improved Judgement', 2], ['Conviction', 3], ['Seal of Command', 1],
        ['Sanctified Judgement', 3], ['Vindication', 1], ['Eye for an Eye', 2], ['Sacred Arbiter', 1],
        ['Conviction', 2], ['Two-Handed Weapon Specialization', 3], ['Vengeance', 3], ['Repentance', 1],
        ['Champion of the Light', 3], ['Twist of Light', 1], ['Divine Strength', 5], ['Improved Seals', 3],
        ['Healing Light', 2], ['Purifying Power', 2], ['Voice of Truth', 1], ['Unyielding Faith', 2],
        ['Divine Favor', 1], ['Divine Intellect', 4],
      ],
    },
    {
      id: 'holy', tree: 'holy', name: 'Holy', role: 'Healer', roles: ['healer'],
      tagline: 'Illumination mana returns and huge single-target heals.',
      difficulty: 2,
      ratings: { leveling: 2, solo: 2, group: 5, pvp: 3, raid: 5 },
      summary:
        'Holy paladins are fantastic single-target healers. Illumination refunds mana on crits, Holy Power adds crit chance, and Holy Light hits hard while Flash of Light is incredibly efficient. A raid staple for tank healing, with Blessing of Kings support.',
      pros: [
        'Extremely mana-efficient tank healer',
        'Plate armor and bubble make you hard to kill',
        'Blessings are prized raid buffs',
        'Cleanse removes poison, disease and magic',
      ],
      cons: [
        'No group heals in Classic',
        'Slow solo leveling',
        'Healing is mostly limited to Holy Light / Flash of Light',
      ],
      stats: [
        { name: '+Healing', weight: 100, note: '' },
        { name: 'Intellect', weight: 85, note: 'Divine Intellect & crit' },
        { name: 'Spell Critical', weight: 80, note: 'Illumination mana refunds' },
        { name: 'Mana per 5 sec', weight: 65, note: '' },
        { name: 'Stamina', weight: 25, note: '' },
      ],
      weapons: [
        { type: 'Healing Mace / Sword + Shield or Off-hand', tier: 'Best', note: '' },
        { type: 'Healing Two-Hander', tier: 'Usable', note: 'Shield adds armor safety' },
      ],
      rotation: {
        opener: ['Blessing assignments (**Blessing of Kings**, **Blessing of Wisdom**)', "**Light's Vigil** on the tank", 'Pre-cast **Flash of Light** on the tank'],
        single: ['**Flash of Light** — efficient filler', '**Holy Light** (down-ranked) for big hits; Infusion of Light crits speed it up', '**Holy Shock** instant heal'],
        aoe: ["**Holy Shock** on a **Light's Vigil** target heals their whole party", '**Cleanse** liberally'],
        cooldowns: ['**Divine Favor** + **Holy Light** for a guaranteed big crit', '**Voice of Truth** to heal through silences and interrupts', '**Lay on Hands** on a dying tank', '**Blessing of Protection** for a dying clothie'],
        notes: ['Illumination refunds mana on crits — Holy Power makes them frequent', 'Cleanse is one of your most valuable spells'],
      },
      leveling: [
        'Level as Retribution and respec at 60',
        'Holy is fine for dungeon healing while leveling',
      ],
      races: [
        { name: 'Human', why: 'Spirit bonus' },
        { name: 'Dwarf', why: 'Stoneform' },
      ],
      professions: [
        { name: 'Herbalism + Alchemy', why: 'Flasks & potions' },
        { name: 'Tailoring', why: 'Cloth healing gear is common for paladins' },
      ],
      consumables: ['Flask of Distilled Wisdom', 'Mageblood Potion', 'Major Mana Potion', 'Brilliant Mana Oil'],
      build: [
        ['Divine Intellect', 5], ['Healing Light', 3], ['Spiritual Focus', 2], ['Reverence', 3],
        ['Voice of Truth', 1], ['Purifying Power', 1], ['Illumination', 5], ['Divine Favor', 1],
        ['Infusion of Light', 2], ['Holy Shock', 1], ['Unyielding Faith', 1], ['Holy Power', 5],
        ["Light's Vigil", 1], ['Unyielding Faith', 1], ['Benediction', 5], ['Improved Judgement', 2],
        ['Holy Conduit', 2], ['Conviction', 1], ['Sanctified Judgement', 3], ['Pursuit of Justice', 2],
        ['Eye for an Eye', 2], ['Deflection', 2],
      ],
    },
    {
      id: 'protection', tree: 'protection', name: 'Protection', role: 'Tank', roles: ['tank'],
      tagline: 'Holy Shield and Consecration AoE tanking.',
      difficulty: 3,
      ratings: { leveling: 3, solo: 3, group: 4, pvp: 2, raid: 2 },
      summary:
        'Protection paladins excel at holding many mobs at once thanks to Consecration, Holy Shield and Righteous Fury. Fantastic for dungeons and AoE farming, but lacking a taunt in Classic makes main-tanking raids difficult.',
      pros: [
        'Outstanding AoE threat — great for dungeons',
        'Blessing of Kings & Sanctuary',
        'Very durable with Holy Shield and Redoubt',
        'AoE farming of instances is lucrative',
      ],
      cons: [
        'No taunt in Classic — hard to main tank raids',
        'Mana-dependent threat; running out = losing aggro',
        'Not wanted for most raid roles',
      ],
      stats: [
        { name: 'Stamina', weight: 100, note: '' },
        { name: 'Defense', weight: 90, note: '' },
        { name: 'Spell Damage', weight: 70, note: 'Boosts Holy Shield & Consecration threat' },
        { name: 'Armor', weight: 65, note: '' },
        { name: 'Intellect', weight: 60, note: 'Mana for threat' },
        { name: 'Block', weight: 50, note: 'Redoubt & Shield Specialization' },
      ],
      weapons: [
        { type: 'One-Hand + Shield', tier: 'Best', note: 'Spell-damage weapons boost threat' },
        { type: 'Two-Hander', tier: 'Avoid', note: 'No Holy Shield without a shield' },
      ],
      rotation: {
        opener: ['**Righteous Fury** on', '**Seal of Fury** active', 'Gather mobs → **Consecration**'],
        single: ['**Holy Shield** always up', '**Holy Strike** on cooldown — Iron Creed adds threat and damage reduction', '**Judgement** + re-seal; **Swift Judgement** for a free extra Judgement', '**Consecration** for extra threat'],
        aoe: ['**Consecration** + **Holy Shield** + **Retribution Aura**', '**Holy Strike** the main target'],
        cooldowns: ["**Templar's Bulwark** — absorbs damage equal to your max health", '**Divine Shield** only as a last resort (drops threat)', '**Lay on Hands**', '**Hammer of Justice** stops casters'],
        notes: ['Manage mana — Shield Specialization blocks restore mana', 'Improved Seal of Fury restores mana when the shield breaks'],
      },
      leveling: [
        'Prot leveling via AoE tanking pulls is viable with a spell-damage weapon',
        'Pair with a healer friend for very fast dungeon runs',
      ],
      races: [
        { name: 'Human', why: 'Perception & skill' },
        { name: 'Dwarf', why: 'Stoneform' },
      ],
      professions: [
        { name: 'Mining + Blacksmithing', why: 'Plate tanking gear' },
        { name: 'Engineering', why: 'Fire reflector' },
      ],
      consumables: ['Elixir of Fortitude', 'Elixir of Superior Defense', 'Greater Arcane Elixir', 'Major Mana Potion'],
      build: [
        ['Redoubt', 5], ['Precision', 3], ['Anticipation', 2], ['Improved Seal of Fury', 1],
        ['Improved Righteous Fury', 3], ['Shield Specialization', 3], ['One-Handed Weapon Specialization', 3], ['Swift Judgement', 1],
        ["Templar's Bulwark", 1], ['Reckoning', 3], ['Iron Creed', 5], ['Holy Shield', 1],
        ['Toughness', 5], ['Anticipation', 3], ['Divine Intellect', 5], ['Improved Seals', 3],
        ['Spiritual Focus', 2], ['Reverence', 2],
      ],
    },
  ],
};
