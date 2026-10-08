import { foreverTrees } from '../talents/index.js';

// Build: ordered list of [talent name, points]. The first point lands at level 10, one per level after.
export default {
  id: 'druid',
  name: 'Druid',
  color: '#FF7C0A',
  resource: 'Mana / Rage / Energy',
  armor: 'Leather',
  weaponsUsable: 'Staves, maces, daggers, fist weapons (stats only in forms)',
  description:
    'The ultimate hybrid. Druids shapeshift into a bear to tank, a cat to deal melee damage, a moonkin to cast, or stay in caster form to heal. Travel Form, Aquatic Form and Innervate make them one of the most versatile classes in the game.',
  milestones: [
    [1, 'Wrath & Healing Touch', 'Mark of the Wild'],
    [4, 'Moonfire & Rejuvenation', ''],
    [10, 'Bear Form', 'Class quest — your first shapeshift'],
    [16, 'Aquatic Form', 'Class quest — fast swimming, water breathing'],
    [20, 'Cat Form & Rebirth', 'Stealth, energy and combo points'],
    [30, 'Travel Form', '40% faster — a free mount until 40'],
    [40, 'Dire Bear Form & Tranquility', 'Innervate too'],
    [50, 'Hurricane', 'Big AoE channel'],
  ],
  trees: foreverTrees('druid'),
  specs: [
    {
      id: 'feral', tree: 'feral', name: 'Feral', role: 'Tank / Melee DPS', roles: ['tank', 'dps'],
      tagline: 'Bear when you need to tank, cat when you need to kill.',
      difficulty: 3,
      ratings: { leveling: 5, solo: 5, group: 4, pvp: 3, raid: 3 },
      summary:
        'Feral is the fastest and most flexible druid leveling spec. Cat Form deals solid damage with stealth openers, Bear Form tanks dungeons, and Shifting Power turns mana into instant energy. Primal Bite (Forever\'s Mangle) is a big threat tool for bears, Rend and Tear rewards keeping bleeds up, and the 31-point Berserk makes Primal Bite cleave. At 60 Feral druids are excellent off-tanks and bring Leader of the Pack to their group.',
      pros: [
        'Can tank AND DPS with one spec — great for dungeons',
        'Stealth in Cat Form for skipping mobs and picking fights',
        'Travel Form & Feral Swiftness = fast movement',
        'Leader of the Pack is a strong group buff',
      ],
      cons: [
        'Weapon damage is ignored — only stats on weapons matter',
        'Rage/energy management across forms has a learning curve',
        'Shapeshifting costs mana; long fights drain you',
        'Raid spots are limited compared to warriors/rogues',
      ],
      stats: [
        { name: 'Strength / Attack Power', weight: 100, note: 'Cat damage; Predatory Strikes adds AP per level' },
        { name: 'Agility', weight: 90, note: 'Crit, dodge and armor' },
        { name: 'Hit (to 9%)', weight: 75, note: '' },
        { name: 'Stamina', weight: 70, note: 'Bear tanking' },
        { name: 'Armor', weight: 60, note: 'Bear Form multiplies armor' },
        { name: 'Intellect', weight: 30, note: 'Mana for powershifting' },
      ],
      weapons: [
        { type: 'Staff / Two-Hand Mace (stats)', tier: 'Best', note: 'Weapon DPS is irrelevant in forms — pick by Str/Agi/AP' },
        { type: 'One-Hand + Off-hand (stats)', tier: 'Good', note: '' },
        { type: 'Feral AP items', tier: 'Best', note: 'Items like Warden Staff and Manual Crowd Pummeler' },
      ],
      rotation: {
        opener: ['Cat Form → **Prowl**', '**Ravage** or **Pounce** from behind', '**Shred** from behind or **Claw**'],
        single: ['**Rake** and **Rip** bleeds up — Rend and Tear boosts damage on bleeding targets', '**Claw**/**Shred** to 5 combo points', '**Ferocious Bite** or **Rip** at 5 points', '**Shifting Power** when energy is low — converts mana into 40 energy'],
        aoe: ['Bear Form: **Swipe** + **Demoralizing Roar**', '**Primal Bite** for big threat (cleaves during **Berserk**)', '**Maul** as a rage dump', '**Feral Charge** to interrupt casters'],
        cooldowns: ['**Barkskin** (caster form)', '**Frenzied Regeneration** in Bear Form', '**Innervate** a healer at 40+'],
        notes: ['Keep **Mark of the Wild** and **Thorns** up; **Omen of Clarity** is baseline at 20', 'Shift out & heal yourself between pulls'],
      },
      leveling: [
        'Bear Form from 10–20, then Cat Form from 20 onwards',
        'Shift to caster form to heal yourself and avoid eating',
        'Travel Form at 30 — no mount needed until 40',
        'Tank dungeons in Bear Form for fast groups',
      ],
      races: [
        { name: 'Tauren', why: '+5% health & War Stomp' },
        { name: 'Night Elf', why: 'Shadowmeld, +1% dodge' },
      ],
      professions: [
        { name: 'Skinning + Leatherworking', why: 'Wolfshead Helm & Devilsaur' },
        { name: 'Engineering', why: 'PvP' },
      ],
      consumables: ['Elixir of the Mongoose', 'Juju Power', 'Elixir of Superior Defense', 'Major Mana Potion (powershifting)'],
      build: [
        ['Ferocity', 5], ['Feral Swiftness', 2], ['Thick Hide', 3], ['Sharpened Claws', 2],
        ['Savage Fury', 2], ['Feral Charge', 1], ['Predatory Strikes', 3], ['Blood Frenzy', 2],
        ['Leader of the Pack', 1], ['Predatory Instincts', 2], ['Primal Bite', 1], ['Heart of the Wild', 1],
        ['Rend and Tear', 5], ['Berserk', 1], ['Heart of the Wild', 4], ['Shredding Attacks', 3],
        ['Shifting Power', 1], ['Improved Shifting Power', 2], ['Furor', 5], ['Natural Shapeshifter', 3],
        ['Naturalist', 2],
      ],
    },
    {
      id: 'balance', tree: 'balance', name: 'Balance', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Moonkin Form, Starfire crits and root-kiting.',
      difficulty: 3,
      ratings: { leveling: 3, solo: 3, group: 3, pvp: 4, raid: 2 },
      summary:
        'Balance turns the druid into a caster. Moonkin Form adds armor and a party crit aura, Vengeance makes Starfire crits hit enormously hard, Eclipse lets Wrath speed up your next Starfires, and Nature\'s Grace speeds up your casting. Fun and bursty in PvP, but mana-hungry and limited in raid demand.',
      pros: [
        'Big Starfire crits — strong burst',
        'Moonkin Form armor makes you sturdy for a caster',
        'Party crit aura is valued by casters',
        'Still able to heal and battle-res',
      ],
      cons: [
        'Mana-inefficient; runs dry fast',
        'Can\'t heal in Moonkin Form',
        'Rarely wanted in raids',
        'Weak gear availability for Balance',
      ],
      stats: [
        { name: 'Spell Damage (Arcane/Nature)', weight: 100, note: '' },
        { name: 'Spell Critical', weight: 80, note: 'Vengeance & Nature\'s Grace' },
        { name: 'Spell Hit', weight: 75, note: '' },
        { name: 'Intellect', weight: 65, note: '' },
        { name: 'Mana per 5 sec', weight: 45, note: '' },
      ],
      weapons: [
        { type: 'Staff', tier: 'Best', note: '' },
        { type: 'Mace / Dagger + Off-hand', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['**Entangling Roots** from range (vs melee)', '**Starfire**', '**Moonfire** + **Insect Swarm**'],
        single: ['**Moonfire** + **Insect Swarm** up', '**Wrath** to build Eclipse charges', '**Starfire** with Eclipse charges for fast big hits'],
        aoe: ['**Hurricane** (40)', 'Root kiting with **Entangling Roots**'],
        cooldowns: ['**Nature\'s Swiftness** isn\'t in this build — use **Barkskin** for defense', '**Innervate** yourself when dry'],
        notes: ['Keep **Mark of the Wild** & **Thorns** up', 'Stand in Moonkin Form for the party crit aura'],
      },
      leveling: [
        'Balance is fine until ~20, but Feral is faster afterwards',
        'Root + Starfire is strong against melee mobs',
      ],
      races: [
        { name: 'Night Elf', why: 'Shadowmeld' },
        { name: 'Tauren', why: 'War Stomp' },
      ],
      professions: [
        { name: 'Tailoring', why: 'Cloth caster gear works' },
        { name: 'Alchemy', why: 'Mana potions' },
      ],
      consumables: ['Greater Arcane Elixir', 'Major Mana Potion', 'Brilliant Wizard Oil'],
      build: [
        ['Improved Wrath', 5], ['Moonglow', 3], ['Improved Moonfire', 2], ["Nature's Majesty", 2],
        ["Nature's Splendor", 1], ['Genesis', 2], ['Vengeance', 5], ["Nature's Grace", 1],
        ['Eclipse', 3], ['Insect Swarm', 1], ['Moonfury', 5], ['Moonkin Form', 1],
        ['Improved Starfire', 5], ["Nature's Reach", 2], ["Nature's Focus", 5], ['Naturalist', 5],
        ['Reflection', 3],
      ],
    },
    {
      id: 'restoration', tree: 'restoration', name: 'Restoration', role: 'Healer', roles: ['healer'],
      tagline: 'HoTs, Nature\'s Swiftness and Swiftmend.',
      difficulty: 3,
      ratings: { leveling: 2, solo: 2, group: 5, pvp: 4, raid: 4 },
      summary:
        'Restoration druids are strong healers with excellent heal-over-time spells, instant emergency heals (Nature\'s Swiftness and Swiftmend), the 31-point Wild Growth party HoT, Innervate and battle-res. A versatile raid and PvP healer who can still shift to escape.',
      pros: [
        'Great tank healer with HoTs and big Healing Touch',
        'Nature\'s Swiftness + Healing Touch = instant emergency heal',
        'Battle-res and Innervate are raid-defining utilities',
        'Shapeshifting breaks snares in PvP',
      ],
      cons: [
        'Slow solo leveling',
        'Fewer group heals than priests or shamans (Tranquility is long cooldown)',
        'Mana issues without proper Spirit gear',
      ],
      stats: [
        { name: '+Healing', weight: 100, note: '' },
        { name: 'Intellect', weight: 75, note: '' },
        { name: 'Spirit', weight: 70, note: 'Reflection regen while casting' },
        { name: 'Mana per 5 sec', weight: 70, note: '' },
        { name: 'Stamina', weight: 30, note: '' },
      ],
      weapons: [
        { type: 'Healing Mace / Dagger + Off-hand', tier: 'Best', note: '' },
        { type: 'Staff', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['**Rejuvenation** on the tank before pull', '**Regrowth** when damage starts'],
        single: ['Keep **Rejuvenation** up on tanks', '**Healing Touch** (down-ranked) for big heals', '**Regrowth** for burst + HoT', '**Swiftmend** to consume a HoT instantly'],
        aoe: ['**Wild Growth** on the most damaged group', '**Tranquility** for heavy group-wide damage', 'Rolling **Rejuvenation** on multiple targets'],
        cooldowns: ['**Nature\'s Swiftness** + max-rank **Healing Touch**', '**Innervate** your best healer or yourself', '**Rebirth** a dead healer/tank'],
        notes: ['Keep **Mark of the Wild** / **Gift of the Wild** on everyone', '**Remove Curse** & **Abolish Poison** are your dispels'],
      },
      leveling: [
        'Level Feral and respec Resto at 60',
        'In dungeons, Resto druids can heal everything up to Scholomance easily',
      ],
      races: [
        { name: 'Tauren', why: 'War Stomp & +5% HP for PvP' },
        { name: 'Night Elf', why: 'Shadowmeld to drink safely' },
      ],
      professions: [
        { name: 'Herbalism + Alchemy', why: 'Flasks and potions' },
        { name: 'Leatherworking', why: 'Healing leather gear' },
      ],
      consumables: ['Flask of Distilled Wisdom', 'Mageblood Potion', 'Major Mana Potion', 'Brilliant Mana Oil'],
      build: [
        ["Nature's Focus", 5], ['Naturalist', 5], ['Reflection', 3], ['Gift of Nature', 2],
        ['Improved Rejuvenation', 3], ['Swiftmend', 1], ['Tranquil Spirit', 1], ["Nature's Swiftness", 1],
        ['Living Spirit', 3], ['Gift of the Earthmother', 1], ['Improved Regrowth', 5], ['Wild Growth', 1],
        ['Gift of Nature', 3], ['Tranquil Spirit', 4], ['Genesis', 5], ['Moonglow', 3],
        ["Nature's Majesty", 2], ["Nature's Splendor", 1], ['Improved Moonfire', 2],
      ],
    },
  ],
};
