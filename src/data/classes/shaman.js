import { foreverTrees } from '../talents/index.js';

// Build: ordered list of [talent name, points]. The first point lands at level 10, one per level after.
export default {
  id: 'shaman',
  name: 'Shaman',
  color: '#0070DD',
  resource: 'Mana',
  armor: 'Leather → Mail (40)',
  weaponsUsable: 'Staves, maces, axes, daggers, fist weapons (one & two-handed with talent)',
  description:
    'A spiritual guide who calls on the elements. Shamans drop totems that empower their party, hurl lightning, imbue weapons with Windfury, and heal with Chain Heal. The Horde\'s answer to paladins, and one of the most versatile hybrids in the game.',
  milestones: [
    [1, 'Lightning Bolt & Healing Wave', 'Rockbiter Weapon'],
    [4, 'Earth Shock & Earth Totem', 'Class quest for Earth Totem'],
    [10, 'Fire Totem', 'Class quest — Searing Totem & Flame Shock'],
    [20, 'Ghost Wolf & Water Totem', 'Faster travel, Lesser Healing Wave'],
    [30, 'Air Totem, Windfury & Reincarnation', 'Huge leveling spike'],
    [32, 'Chain Lightning', 'Multi-target burst'],
    [40, 'Chain Heal & Mail', 'Best group heal in Classic'],
    [50, 'Healing Way talent peaks', 'Mana Tide (resto)'],
  ],
  trees: foreverTrees('shaman'),
  specs: [
    {
      id: 'enhancement', tree: 'enhancement', name: 'Enhancement', role: 'Melee DPS', roles: ['dps'],
      tagline: 'Windfury crits and Stormstrike burst with a big two-hander.',
      difficulty: 2,
      ratings: { leveling: 5, solo: 4, group: 3, pvp: 4, raid: 2 },
      summary:
        'Enhancement is the shaman leveling and world-PvP spec. A slow two-handed axe or mace with Windfury Weapon creates huge burst, Flurry boosts attack speed after crits, Stormstrike sets up big Earth Shocks, Maelstrom Weapon turns melee hits into fast, cheap Lightning Bolts, and Rage of the Farseer is a 31-point attack speed cooldown. You can still heal yourself between pulls.',
      pros: [
        'Windfury procs deliver massive burst',
        'Self-healing means low downtime',
        'Strong world PvP with Stormstrike + Earth Shock',
        'Totems buff your group in dungeons',
      ],
      cons: [
        'RNG-dependent damage (Windfury procs)',
        'Mana-limited in long fights',
        'Rarely wanted as DPS in raids',
      ],
      stats: [
        { name: 'Weapon DPS / Speed', weight: 100, note: 'Slow two-hander (3.5+) for Windfury' },
        { name: 'Strength', weight: 85, note: '' },
        { name: 'Critical Strike', weight: 70, note: 'Flurry uptime' },
        { name: 'Hit', weight: 65, note: '' },
        { name: 'Agility', weight: 50, note: '' },
        { name: 'Intellect', weight: 35, note: 'Shocks and heals' },
      ],
      weapons: [
        { type: 'Slow Two-Handed Axe / Mace', tier: 'Best', note: 'Slow weapons make Windfury and Stormstrike hit harder' },
        { type: 'Staff', tier: 'Good', note: 'Before the two-hander talent' },
        { type: 'One-Hand + Shield', tier: 'Usable', note: 'Safer leveling early on' },
      ],
      rotation: {
        opener: ['**Lightning Bolt** pull', 'Drop **Searing Totem** / **Strength of Earth Totem**', '**Stormstrike** → **Earth Shock**'],
        single: ['**Windfury Weapon** on your weapon', '**Stormstrike** on cooldown', '**Earth Shock** after Stormstrike / to interrupt', '**Lightning Bolt** at 5 Maelstrom Weapon stacks (instant-ish and cheap)', '**Flame Shock** for DoT if mana allows'],
        aoe: ['**Magma Totem** / **Fire Nova**', '**Chain Lightning** at range'],
        cooldowns: ['**Rage of the Farseer** — 30% attack speed for 25 sec', '**Reincarnation** saves your life (30)', '**Grounding Totem** in PvP'],
        notes: ['Keep **Lightning Shield** up', 'Use **Purge** on enemy buffs in PvP'],
      },
      leveling: [
        'Rockbiter Weapon until 30, then Windfury',
        'Flurry (from 25) and Stormstrike (30) are your big leveling spikes',
        'Shield + mace is fine pre-20',
        'Drink and heal yourself rather than eating',
      ],
      races: [
        { name: 'Orc', why: '+5 Axe skill, Blood Fury' },
        { name: 'Tauren', why: 'War Stomp, +5% HP' },
        { name: 'Troll', why: 'Berserking' },
      ],
      professions: [
        { name: 'Mining + Blacksmithing', why: 'Two-handers' },
        { name: 'Skinning + Leatherworking', why: 'Gear' },
      ],
      consumables: ['Elixir of the Mongoose', 'Juju Power', 'Major Mana Potion', 'Elemental Sharpening Stone'],
      build: [
        ['Thundering Strikes', 5], ['Mental Dexterity', 3], ['Improved Ghost Wolf', 2], ['Elemental Weapons', 3],
        ['Shamanistic Focus', 1], ['Anticipation', 1], ['Flurry', 5], ['Stormstrike', 1],
        ['Mental Quickness', 2], ['Improved Stormstrike', 2], ['Maelstrom Weapon', 5], ['Rage of the Farseer', 1],
        ['Concussion', 5], ['Reverberation', 5], ['Elemental Devastation', 3], ['Elemental Focus', 1],
        ['Elemental Alacrity', 3], ['Call of Thunder', 1], ['Eye of the Storm', 2],
      ],
    },
    {
      id: 'elemental', tree: 'elemental', name: 'Elemental', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Lightning Overload, Elemental Fury crits and Lava Burst.',
      difficulty: 2,
      ratings: { leveling: 3, solo: 3, group: 3, pvp: 5, raid: 2 },
      summary:
        'Elemental turns the shaman into a lightning caster. Call of Thunder and Elemental Fury create devastating crits, Elemental Alacrity speeds up casts, Lightning Overload fires free extra bolts, and the 31-point Lava Burst hits hardest on targets with Flame Shock. Infamous in PvP for its burst — Chain Lightning + Earth Shock can kill in seconds.',
      pros: [
        'Huge PvP burst with Lava Burst and Lightning Overload',
        'Earth Shock is a fast, instant interrupt',
        'Ranged caster that can still heal',
        'Totems benefit groups',
      ],
      cons: [
        'Very mana-hungry',
        'Few raid spots as DPS',
        'Squishy until mail at 40',
      ],
      stats: [
        { name: 'Spell Damage (Nature)', weight: 100, note: '' },
        { name: 'Spell Critical', weight: 85, note: 'Elemental Fury doubles crit bonus' },
        { name: 'Spell Hit', weight: 75, note: '' },
        { name: 'Intellect', weight: 65, note: '' },
        { name: 'Mana per 5 sec', weight: 50, note: '' },
      ],
      weapons: [
        { type: 'Spell Mace / Dagger + Shield', tier: 'Best', note: 'Shield adds safety' },
        { type: 'Staff', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['**Flame Shock**', '**Lava Burst** (bonus damage with Flame Shock up)', '**Chain Lightning**', '**Lightning Bolt**'],
        single: ['**Lightning Bolt** filler', '**Earth Shock** / **Flame Shock** while moving', '**Chain Lightning** when off cooldown'],
        aoe: ['**Chain Lightning**', '**Fire Nova** / **Magma Totem**'],
        cooldowns: ['**Lava Burst** on cooldown after **Flame Shock**', '**Mana Tide Totem** when mana runs low', '**Grounding Totem**'],
        notes: ['Use **Mana Spring Totem** for regen', 'Down-rank Lightning Bolt to save mana'],
      },
      leveling: [
        'Viable but mana-hungry — many level Enhancement and respec',
        'Lightning Bolt pull → Earth Shock finish is efficient',
      ],
      races: [
        { name: 'Orc', why: 'Blood Fury & stun resistance' },
        { name: 'Troll', why: 'Berserking' },
        { name: 'Tauren', why: 'War Stomp' },
      ],
      professions: [
        { name: 'Engineering', why: 'PvP' },
        { name: 'Tailoring', why: 'Caster cloth gear works' },
      ],
      consumables: ['Greater Arcane Elixir', 'Major Mana Potion', 'Brilliant Wizard Oil', 'Free Action Potion'],
      build: [
        ['Concussion', 5], ['Call of Flame', 3], ['Reverberation', 2], ['Elemental Alacrity', 3],
        ['Elemental Focus', 1], ['Convection', 1], ['Call of Thunder', 1], ['Eye of the Storm', 3],
        ['Convection', 1], ['Lightning Overload', 3], ['Elemental Reach', 2], ['Elemental Fury', 5],
        ['Lava Burst', 1], ['Totemic Focus', 5], ['Tidal Focus', 5], ['Mindfulness', 3],
        ['Water Shield', 1], ['Healing Focus', 1], ['Restorative Totems', 3], ['Mana Tide Totem', 1],
        ['Natural Grace', 1],
      ],
    },
    {
      id: 'restoration', tree: 'restoration', name: 'Restoration', role: 'Healer', roles: ['healer'],
      tagline: 'Chain Heal, Mana Tide and party-wide totems.',
      difficulty: 2,
      ratings: { leveling: 2, solo: 2, group: 5, pvp: 4, raid: 5 },
      summary:
        'Restoration shamans have the best group healing in the game with Chain Heal, plus Mana Tide Totem and Nature\'s Swiftness for emergencies. Healing Way makes Healing Wave strong on tanks, Water Shield returns mana, and the 31-point Riptide is a big instant heal that empowers Chain Heal. A raid staple and a durable PvP healer in mail armor.',
      pros: [
        'Chain Heal is the best group heal in the game',
        'Mana Tide Totem helps the whole party',
        'Mail armor and Earth Shock make you a durable PvP healer',
        'Windfury and other totems buff melee groups',
      ],
      cons: [
        'Totem placement adds complexity',
        'Slow solo leveling',
        'Mana management is critical',
      ],
      stats: [
        { name: '+Healing', weight: 100, note: '' },
        { name: 'Mana per 5 sec', weight: 80, note: '' },
        { name: 'Intellect', weight: 75, note: '' },
        { name: 'Spell Critical', weight: 50, note: 'Ancestral Healing armor buff' },
        { name: 'Stamina', weight: 30, note: '' },
      ],
      weapons: [
        { type: 'Healing Mace + Shield', tier: 'Best', note: '' },
        { type: 'Healing Staff', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['**Water Shield** up', 'Drop **Mana Spring Totem**, **Windfury Totem**/**Grace of Air Totem** and **Strength of Earth Totem**'],
        single: ['**Riptide** on the tank on cooldown', '**Healing Wave** on tanks (Healing Way stacks)', '**Lesser Healing Wave** for emergencies'],
        aoe: ['**Chain Heal** on the most injured — it jumps to 2 more targets', '**Healing Stream Totem**'],
        cooldowns: ['**Mana Tide Totem** for party mana', "**Nature's Swiftness** + **Healing Wave**", '**Reincarnation** if you die'],
        notes: ['**Purge** and **Cure Poison** / **Cure Disease** in PvP and raids', 'Down-rank Chain Heal for efficiency'],
      },
      leveling: [
        'Level Enhancement and respec at 60',
        'Resto shamans are in high demand for dungeons at all levels',
      ],
      races: [
        { name: 'Tauren', why: 'War Stomp & HP' },
        { name: 'Orc', why: 'Stun resistance' },
        { name: 'Troll', why: 'Berserking (faster heals)' },
      ],
      professions: [
        { name: 'Herbalism + Alchemy', why: 'Flasks & potions' },
        { name: 'Leatherworking', why: 'Healing mail/leather' },
      ],
      consumables: ['Flask of Distilled Wisdom', 'Mageblood Potion', 'Major Mana Potion', 'Brilliant Mana Oil'],
      build: [
        ['Improved Healing Wave', 5], ['Tidal Focus', 5], ['Water Shield', 1], ['Healing Focus', 2],
        ['Ancestral Healing', 2], ['Tidal Mastery', 5], ['Healing Way', 3], ["Nature's Swiftness", 1],
        ['Mana Tide Totem', 1], ['Purification', 5], ['Riptide', 1], ['Restorative Totems', 5],
        ['Totemic Focus', 5], ['Mindfulness', 3], ['Ancestral Knowledge', 5], ['Guardian Totems', 2],
      ],
    },
  ],
};
