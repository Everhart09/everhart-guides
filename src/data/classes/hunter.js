import { foreverTrees } from '../talents/index.js';

// Build: ordered list of [talent name, points]. The first point lands at level 10, one per level after.
export default {
  id: 'hunter',
  name: 'Hunter',
  color: '#AAD372',
  resource: 'Mana',
  armor: 'Leather → Mail (40)',
  weaponsUsable: 'Axes, swords, polearms, staves, daggers, fist weapons; bows, guns, crossbows & thrown',
  description:
    'A ranged marksman with a loyal pet. Hunters tame beasts to fight alongside them, kite enemies with traps and stings, and deal heavy physical damage from range. Widely considered the easiest class to level solo.',
  milestones: [
    [1, 'Raptor Strike & Auto Shot', 'Ranged weapon needed'],
    [4, "Serpent Sting & Hunter's Mark", ''],
    [10, 'Tame Beast', 'Class quest — your pet tanks for you'],
    [12, 'Wing Clip & Mend Pet', 'Melee snare'],
    [16, 'Mongoose Bite', 'Melee counter after dodging'],
    [20, 'Aspect of the Cheetah & Multi-Shot', 'Freezing Trap at 20'],
    [30, 'Feign Death', 'Drop threat and escape'],
    [40, 'Mail armor & Volley', 'Big survivability upgrade'],
  ],
  trees: foreverTrees('hunter'),
  specs: [
    {
      id: 'beast-mastery', tree: 'beast-mastery', name: 'Beast Mastery', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Your pet does the heavy lifting — the easiest leveling in the game.',
      difficulty: 1,
      ratings: { leveling: 5, solo: 5, group: 3, pvp: 4, raid: 3 },
      summary:
        'Beast Mastery makes your pet a monster. Unleashed Fury, Ferocity and Frenzy multiply pet damage, Bestial Swiftness keeps them running at your side, and Bestial Wrath lets your pet go berserk. The safest, fastest way to level a hunter — and a solid world PvP spec.',
      pros: [
        'Easiest leveling experience in the game',
        'Pet tanks everything while you shoot',
        'Bestial Wrath + Intimidation make the pet a PvP threat',
        'Low gear requirements',
      ],
      cons: [
        'Pets die in raid AoE, cutting your DPS',
        'Lower personal damage than Marksmanship at 60',
        'Pet happiness and feeding are an extra chore',
      ],
      stats: [
        { name: 'Agility', weight: 100, note: '1 Agi = 2 ranged AP + crit' },
        { name: 'Ranged Weapon DPS', weight: 90, note: '' },
        { name: 'Hit (to 9%)', weight: 80, note: '' },
        { name: 'Attack Power', weight: 70, note: '' },
        { name: 'Intellect', weight: 40, note: 'Mana for longer fights' },
        { name: 'Stamina', weight: 35, note: '' },
      ],
      weapons: [
        { type: 'Bow / Crossbow / Gun', tier: 'Best', note: 'Your real weapon — highest DPS available' },
        { type: 'Two-Hand Stat Stick', tier: 'Good', note: 'Staves/polearms for Agility' },
        { type: 'Dual One-Handers', tier: 'Usable', note: 'Fine when stats are better' },
      ],
      rotation: {
        opener: ["**Hunter's Mark**", 'Send pet, wait for it to grab threat', '**Serpent Sting**', '**Arcane Shot** / **Aimed Shot**'],
        single: ['**Auto Shot** never stops', '**Arcane Shot** on cooldown', '**Serpent Sting** on longer fights', '**Mend Pet** when the pet takes damage'],
        aoe: ['**Multi-Shot** on cooldown', 'Pet holds the main target'],
        cooldowns: ['**Bestial Wrath** for burst', '**Intimidation** to stun', '**Rapid Fire** at 26', '**Feign Death** to drop threat'],
        notes: ['Keep **Aspect of the Hawk** up (Monkey when tanking)', 'Use **Freezing Trap** on adds'],
      },
      leveling: [
        'Tame a good pet early: cats or boars for leveling, Broken Tooth if you can get it',
        'Train your pet\'s Growl and keep it on',
        'Always carry ammo and pet food',
        'Use Aspect of the Cheetah between pulls — no mount needed until 40',
      ],
      races: [
        { name: 'Night Elf', why: 'Shadowmeld, +1% dodge' },
        { name: 'Dwarf', why: '+5 Gun skill, Stoneform' },
        { name: 'Orc', why: 'Command: +pet damage' },
        { name: 'Troll', why: '+5 Bow skill, Berserking' },
      ],
      professions: [
        { name: 'Skinning + Leatherworking', why: 'Devilsaur & quivers' },
        { name: 'Engineering', why: 'Scopes, bombs, guns' },
      ],
      consumables: ['Elixir of the Mongoose', 'Major Mana Potion', 'Jagged Arrows / Thorium Shells', 'Pet food stock'],
      build: [
        ['Deadly Aspects', 5], ['Focused Fire', 2], ['Endurance Training', 3], ['Bestial Swiftness', 1],
        ['Unleashed Fury', 5], ['Ferocity', 5], ['Intimidation', 1], ['Bestial Discipline', 2],
        ['Summon Hawk', 1], ['Frenzy', 5], ['Bestial Wrath', 1], ['Lethal Attacks', 5],
        ['Efficiency', 3], ['Improved Stings', 2], ['Improved Arcane Shot', 5], ['Rapid Killing', 2],
        ['Trueshot Aura', 1], ['Careful Aim', 2],
      ],
    },
    {
      id: 'marksmanship', tree: 'marksmanship', name: 'Marksmanship', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Trueshot Aura and big crits — the raid hunter.',
      difficulty: 2,
      ratings: { leveling: 4, solo: 4, group: 4, pvp: 4, raid: 5 },
      summary:
        'Marksmanship focuses on personal ranged damage. Lethal Attacks, Careful Aim and Mortal Shots make crits hit hard, Ranged Weapon Specialization boosts every shot, and Trueshot Aura buffs your whole party. Sniper Shot is a long-range 31-point finisher. The standard raiding spec, and Aimed Shot + Scatter Shot are strong in PvP.',
      pros: [
        'Highest hunter raid DPS',
        'Trueshot Aura is a valuable party buff',
        'Scatter Shot gives PvP control',
        'Less reliant on pet survival',
      ],
      cons: [
        'Mana-hungry in long fights',
        'Requires a great ranged weapon',
        'Dead zone (5–8 yards) is punishing in PvP',
      ],
      stats: [
        { name: 'Agility', weight: 100, note: '' },
        { name: 'Hit (to 9%)', weight: 95, note: '' },
        { name: 'Ranged Weapon DPS', weight: 90, note: 'Aimed Shot scales with weapon damage' },
        { name: 'Critical Strike', weight: 70, note: 'Mortal Shots' },
        { name: 'Attack Power', weight: 65, note: '' },
        { name: 'Intellect', weight: 40, note: '' },
      ],
      weapons: [
        { type: 'Slow Bow / Crossbow / Gun', tier: 'Best', note: 'High damage per shot for Aimed Shot' },
        { type: 'Two-Hand Stat Stick', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ["**Hunter's Mark**", '**Aimed Shot**', '**Multi-Shot**', '**Arcane Shot**'],
        single: ['**Auto Shot** never stops', '**Aimed Shot** between Auto Shots', '**Multi-Shot** on cooldown', '**Arcane Shot** while moving'],
        aoe: ['**Multi-Shot** with Barrage', '**Volley** for large packs'],
        cooldowns: ['**Rapid Fire** + trinkets', '**Feign Death** to drop aggro', '**Scatter Shot** → trap in PvP'],
        notes: ['**Tranquilizing Shot** on enraged bosses', 'Keep pet alive with **Mend Pet**'],
      },
      leveling: [
        'Very viable to level as MM — big Aimed Shot openers',
        'Deadly Aspects (Beast Mastery row 1) is a strong early pick for faster leveling',
      ],
      races: [
        { name: 'Night Elf', why: 'Shadowmeld' },
        { name: 'Dwarf', why: '+Gun skill' },
        { name: 'Troll', why: '+Bow skill & Berserking' },
        { name: 'Orc', why: 'Blood Fury' },
      ],
      professions: [
        { name: 'Engineering', why: 'Scopes & Biznicks' },
        { name: 'Leatherworking', why: 'Quivers & leather gear' },
      ],
      consumables: ['Elixir of the Mongoose', 'Juju Might', 'Major Mana Potion', 'Thorium Headed Arrows'],
      build: [
        ['Lethal Attacks', 5], ['Careful Aim', 5], ['Rapid Killing', 2], ['Improved Arcane Shot', 3],
        ['Mortal Shots', 5], ['Trueshot Aura', 1], ['Barrage', 3], ['Scatter Shot', 1],
        ['Ranged Weapon Specialization', 5], ['Sniper Shot', 1], ['Efficiency', 5], ['Deadly Aspects', 5],
        ['Focused Fire', 2], ['Endurance Training', 3], ['Unleashed Fury', 5],
      ],
    },
    {
      id: 'survival', tree: 'survival', name: 'Survival', role: 'Ranged DPS / PvP', roles: ['dps'],
      tagline: 'Mongoose Bite, Predator\'s Edge and traps — the melee-and-ranged hybrid.',
      difficulty: 3,
      ratings: { leveling: 4, solo: 4, group: 3, pvp: 5, raid: 3 },
      summary:
        'Survival in WoW Forever is a hybrid melee hunter. Predator\'s Edge boosts melee crits and off-hand damage, Expose Prey procs Mongoose Bite off Hunter\'s Mark, and Lacerating Strikes adds a bleed. Deterrence, Counterattack and Strider Kick keep you alive and mobile, and Lightning Reflexes adds 10% Agility.',
      pros: [
        'Strong in melee range — the classic hunter dead zone stops being a weakness',
        'Excellent survivability with Deterrence, Survivalist and Counterattack',
        'Traps hit harder and come back faster (Clever Traps, Survivalist\'s Discipline)',
        'Lightning Reflexes makes Agility gear hit harder',
      ],
      cons: [
        'Needs good melee weapons as well as a ranged weapon',
        'Pet is weaker than in Beast Mastery',
        'Melee uptime can be hard against kiting classes',
      ],
      stats: [
        { name: 'Agility', weight: 100, note: 'Lightning Reflexes adds 10%' },
        { name: 'Attack Power', weight: 75, note: 'Feeds both melee and ranged' },
        { name: 'Hit', weight: 70, note: 'Surefooted covers 3%' },
        { name: 'Melee Weapon DPS', weight: 65, note: 'Mongoose Bite & Raptor Strike scale with it' },
        { name: 'Stamina', weight: 55, note: 'Survivalist adds 10% health' },
        { name: 'Intellect', weight: 30, note: 'Resourcefulness cuts melee/trap costs' },
      ],
      weapons: [
        { type: 'Dual one-handers (axes, swords, fist)', tier: 'Best', note: "Predator's Edge adds 50% off-hand damage" },
        { type: 'Two-Hand Polearm / Staff', tier: 'Good', note: 'Big Raptor Strike and Mongoose Bite hits' },
        { type: 'Bow / Crossbow / Gun', tier: 'Good', note: 'Still your opener and kiting tool' },
      ],
      rotation: {
        opener: ['**Freezing Trap** pre-placed', "**Hunter's Mark** (enables Expose Prey procs)", '**Aimed Shot** → **Arcane Shot** as they close'],
        single: ['**Mongoose Bite** whenever it lights up — Lacerating Strikes adds a bleed', '**Raptor Strike** on cooldown', '**Counterattack** after a parry', '**Wing Clip** runners; **Strider Kick** to catch up'],
        aoe: ['**Explosive Trap** + **Multi-Shot**', '**Volley** at range'],
        cooldowns: ['**Deterrence** when focused by melee', '**Feign Death** → **Freezing Trap** reset', '**Rapid Fire** for ranged burst'],
        notes: ['Keep **Hunter\'s Mark** on your target at all times', 'Use **Aspect of the Beast** (30) in melee, **Aspect of the Hawk** at range'],
      },
      leveling: [
        'Survival levels well — Mongoose Bite and Raptor Strike handle mobs that reach you',
        'Pick up Deterrence early for emergencies',
      ],
      races: [
        { name: 'Night Elf', why: 'Shadowmeld' },
        { name: 'Dwarf', why: 'Stoneform & +Gun skill' },
        { name: 'Tauren', why: 'War Stomp & HP' },
      ],
      professions: [
        { name: 'Engineering', why: 'PvP essential' },
        { name: 'Leatherworking', why: 'Gear' },
      ],
      consumables: ['Elixir of the Mongoose', 'Free Action Potion', 'Major Mana Potion'],
      build: [
        ['Improved Tracking', 5], ['Savage Strikes', 2], ['Survivalist', 3], ['Surefooted', 3],
        ['Deterrence', 1], ['Clever Traps', 1], ["Predator's Edge", 5], ['Counterattack', 1],
        ['Expose Prey', 2], ['Resourcefulness', 2], ['Lightning Reflexes', 5], ['Lacerating Strikes', 1],
        ['Lethal Attacks', 5], ['Efficiency', 3], ['Careful Aim', 2], ['Improved Arcane Shot', 3],
        ['Rapid Killing', 2], ['Trueshot Aura', 1], ['Hawk Eye', 3], ['Improved Concussive Shot', 1],
      ],
    },
  ],
};
