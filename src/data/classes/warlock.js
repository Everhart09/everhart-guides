import { foreverTrees } from '../talents/index.js';

// Build: ordered list of [talent name, points]. The first point lands at level 10, one per level after.
export default {
  id: 'warlock',
  name: 'Warlock',
  color: '#8788EE',
  resource: 'Mana & Soul Shards',
  armor: 'Cloth',
  weaponsUsable: 'Staves, one-handed swords, daggers & wands',
  description:
    'A dark caster who commands demons and rots enemies with curses and damage-over-time spells. Warlocks trade health for mana with Life Tap, summon a demon companion, and offer summons, Healthstones and Soulstones to their group.',
  milestones: [
    [1, 'Shadow Bolt & Imp', 'Your first demon'],
    [4, 'Corruption', 'Core DoT'],
    [10, 'Voidwalker', 'Class quest — your leveling tank'],
    [14, 'Drain Life', 'Huge self-sustain'],
    [20, 'Succubus & Health Funnel', 'Seduce for CC'],
    [26, 'Fear chains & Howl of Terror soon', 'Death Coil at 42'],
    [30, 'Felhunter', 'Spell Lock & Devour Magic'],
    [40, 'Felsteed', 'Free mount class quest'],
  ],
  trees: foreverTrees('warlock'),
  specs: [
    {
      id: 'affliction', tree: 'affliction', name: 'Affliction', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'DoT everything, drain it dry, never stop moving.',
      difficulty: 2,
      ratings: { leveling: 5, solo: 5, group: 3, pvp: 4, raid: 3 },
      summary:
        'Affliction is the best warlock leveling spec. Instant Corruption, Siphon Life and Drain Life keep you topped off while your Voidwalker tanks, so you almost never stop to eat. Nightfall procs give free instant Shadow Bolts, Pandemic and Malevolence let DoTs crit hard, and the 31-point Wrack amplifies all your other DoTs. Strong in PvP with lots of pressure.',
      pros: [
        'Near-zero downtime leveling with Drain Life & Siphon Life',
        'Instant-cast DoTs work while moving',
        'Multi-dotting lets you fight several mobs at once',
        'Wrack amplifies all your other DoTs for a big burst window',
      ],
      cons: [
        'Debuff slot limits in raids constrain DoTs',
        'Slow kill speed on single targets compared to burst specs',
        'DoTs are dispellable in PvP',
      ],
      stats: [
        { name: 'Spell Damage (Shadow)', weight: 100, note: 'DoTs scale well with +damage' },
        { name: 'Stamina', weight: 75, note: 'More HP = more Life Tap mana' },
        { name: 'Spell Hit', weight: 70, note: 'No Suppression in this build — get hit from gear (Suppression gives 1% per point)' },
        { name: 'Intellect', weight: 50, note: '' },
        { name: 'Spirit', weight: 25, note: 'Leveling only' },
      ],
      weapons: [
        { type: 'Staff', tier: 'Best', note: 'Leveling' },
        { type: 'Dagger / Sword + Off-hand', tier: 'Good', note: 'Endgame spell power' },
        { type: 'Wand', tier: 'Best', note: 'Finishing mobs while DoTs tick' },
      ],
      rotation: {
        opener: ['Send in **Voidwalker**', '**Bane of Agony**', '**Corruption** (instant)', '**Siphon Life**', '**Immolate** if time allows'],
        single: ['Keep **Corruption**, **Bane of Agony** and **Siphon Life** up', '**Drain Life** to heal & finish', 'Instant **Shadow Bolt** on Nightfall procs', 'Wand when DoTs are ticking & mana is low'],
        aoe: ['DoT 2–3 mobs, Voidwalker holds them', '**Fear** extras', '**Hellfire** / **Rain of Fire** for big packs'],
        cooldowns: ['**Death Coil** — instant fear & heal (42)', '**Life Tap** for mana (Improved Life Tap / Soul Harvest help)', 'Healthstone & Voidwalker **Sacrifice** shield'],
        notes: ['Drain Soul the last 25% of a mob to collect shards', 'Keep **Demon Armor** up'],
      },
      leveling: [
        'Voidwalker tanks almost every pull from level 10',
        'Don\'t over-farm shards — Drain Soul only when needed',
        'Life Tap → Drain Life cycle means you rarely drink',
        'Felsteed at 40 (class quest) saves 100 gold',
      ],
      races: [
        { name: 'Undead', why: 'Will of the Forsaken, Shadow resist' },
        { name: 'Orc', why: 'Command (pet damage) & stun resist' },
        { name: 'Gnome', why: 'Escape Artist, +Int' },
        { name: 'Human', why: 'Perception, Spirit' },
      ],
      professions: [
        { name: 'Tailoring + Enchanting', why: 'Felcloth bags, cloth gear' },
        { name: 'Engineering', why: 'PvP' },
      ],
      consumables: ['Elixir of Shadow Power', 'Greater Arcane Elixir', 'Major Mana Potion', 'Elixir of Fortitude'],
      build: [
        ['Improved Corruption', 5], ['Malediction', 3], ['Improved Drains', 2], ['Improved Bane of Agony', 2],
        ['Amplify Curse', 1], ['Fel Concentration', 2], ['Nightfall', 2], ['Malevolence', 3],
        ['Siphon Life', 1], ['Soul Siphon', 3], ['Malediction', 1], ['Shadow Mastery', 5],
        ['Wrack', 1], ['Demonic Embrace', 5], ['Improved Health Funnel', 2], ['Improved Voidwalker', 3],
        ['Fel Vitality', 3], ['Master Summoner', 2], ['Fel Domination', 1], ['Unholy Power', 4],
      ],
    },
    {
      id: 'demonology', tree: 'demonology', name: 'Demonology', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Soul Link and a stronger demon — the most durable warlock.',
      difficulty: 2,
      ratings: { leveling: 4, solo: 5, group: 3, pvp: 4, raid: 2 },
      summary:
        'Demonology empowers your pets and makes you extremely tanky. Soul Link sends 30% of your damage taken to your demon, Master Demonologist adds bonuses per pet, Demonic Knowledge adds spell damage while a demon is out, and Demonic Pact lets you keep your Demonic Sacrifice buff while using another pet. Demonic Embrace boosts Stamina. Amazing for solo content and world PvP survivability.',
      pros: [
        'Incredibly durable — Soul Link + Demonic Embrace',
        'Pets hit harder and live longer',
        'Fel Domination for instant pet resummon in PvP',
        'Very relaxed solo play',
      ],
      cons: [
        'Lowest raid damage of the three specs',
        'If your pet dies, much of your power goes with it',
        'Pet management adds complexity',
      ],
      stats: [
        { name: 'Stamina', weight: 100, note: 'Demonic Embrace multiplies it' },
        { name: 'Spell Damage', weight: 85, note: '' },
        { name: 'Spell Hit', weight: 60, note: '' },
        { name: 'Intellect', weight: 50, note: '' },
        { name: 'Spirit', weight: 15, note: 'Demonic Embrace reduces Spirit' },
      ],
      weapons: [
        { type: 'Staff', tier: 'Best', note: '' },
        { type: 'Dagger + Off-hand', tier: 'Good', note: '' },
        { type: 'Wand', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['Pet attacks first', '**Bane of Agony** + **Corruption**', '**Shadow Bolt** spam'],
        single: ['Keep DoTs up', '**Shadow Bolt** filler', '**Health Funnel** your pet when needed', '**Drain Life** for sustain'],
        aoe: ['**Fear** and **Seduce** extra targets', '**Rain of Fire** if the pet holds threat'],
        cooldowns: ['**Soul Link** is always up', '**Fel Domination** to resummon a dead pet fast', '**Death Coil** for emergencies'],
        notes: ['Felhunter for PvP vs casters, Voidwalker for leveling, Succubus for damage'],
      },
      leveling: [
        'Very smooth leveling thanks to strong pets',
        'Voidwalker for most content; Succubus for faster kills when comfortable',
      ],
      races: [
        { name: 'Orc', why: 'Command: +pet damage' },
        { name: 'Undead', why: 'Will of the Forsaken' },
        { name: 'Gnome', why: 'Escape Artist' },
      ],
      professions: [
        { name: 'Tailoring', why: 'Gear' },
        { name: 'Engineering', why: 'PvP' },
      ],
      consumables: ['Elixir of Fortitude', 'Greater Arcane Elixir', 'Major Mana Potion'],
      build: [
        ['Demonic Embrace', 5], ['Improved Voidwalker', 3], ['Fel Vitality', 2], ['Master Summoner', 2],
        ['Demonic Sacrifice', 1], ['Improved Sayaad', 2], ['Fel Domination', 1], ['Unholy Power', 4],
        ['Soul Link', 1], ['Demonic Knowledge', 3], ['Improved Felhunter', 1], ['Master Demonologist', 5],
        ['Demonic Pact', 1], ['Improved Corruption', 5], ['Malediction', 3], ['Improved Drains', 2],
        ['Improved Bane of Agony', 2], ['Amplify Curse', 1], ['Fel Concentration', 2], ['Nightfall', 2],
        ['Malevolence', 3],
      ],
    },
    {
      id: 'destruction', tree: 'destruction', name: 'Destruction', role: 'Ranged DPS', roles: ['dps'],
      tagline: 'Shadow Bolt crits with Ruin — the raid nuker.',
      difficulty: 2,
      ratings: { leveling: 3, solo: 3, group: 4, pvp: 4, raid: 5 },
      summary:
        'Destruction (DS/Ruin) is the classic raid warlock spec: sacrifice your Succubus for 15% shadow damage, then Shadow Bolt with Ruin doubling your crit damage. In Forever, Conflagrate, Shadow and Flame and the 31-point Incinerate add a Fire side: Immolate → Conflagrate boosts your Shadow damage. Shadowburn adds an instant execute for PvP.',
      pros: [
        'Top raid damage with a simple rotation',
        'Ruin + Improved Shadow Bolt crit synergy',
        'Shadowburn instant execute',
        'Demonic Sacrifice removes pet micromanagement',
      ],
      cons: [
        'Squishy — no pet to tank when sacrificed',
        'High threat; easy to pull aggro',
        'Long casts are easy to interrupt in PvP',
      ],
      stats: [
        { name: 'Spell Hit (to 16%)', weight: 100, note: 'Boss hit cap' },
        { name: 'Spell Damage (Shadow)', weight: 95, note: '' },
        { name: 'Spell Critical', weight: 80, note: 'Ruin & Improved Shadow Bolt' },
        { name: 'Stamina', weight: 45, note: 'Life Tap fuel' },
        { name: 'Intellect', weight: 40, note: '' },
      ],
      weapons: [
        { type: 'Dagger / Sword + Off-hand', tier: 'Best', note: 'Endgame spell power' },
        { type: 'Staff', tier: 'Good', note: '' },
        { type: 'Wand', tier: 'Good', note: '' },
      ],
      rotation: {
        opener: ['Summon **Succubus** → **Demonic Sacrifice**', '**Curse of the Elements** assigned by raid (Shadow/Elements/Recklessness)', '**Shadow Bolt** spam'],
        single: ['**Shadow Bolt** — the entire rotation', '**Life Tap** when mana is low', '**Shadowburn** on low targets', '**Corruption** on long fights if debuff slots allow'],
        aoe: ['**Rain of Fire** / **Hellfire**'],
        cooldowns: ['Trinkets & potions with long burn windows', 'Soulstone a healer before pulls'],
        notes: ['Watch threat closely', 'Re-sacrifice the Succubus after a wipe'],
      },
      leveling: [
        'Level Affliction, then respec into Destruction for raids',
        'Shadowburn is a strong finisher while leveling too',
      ],
      races: [
        { name: 'Undead', why: 'Shadow resist & WotF' },
        { name: 'Gnome', why: '+Int' },
        { name: 'Orc', why: 'Blood Fury' },
      ],
      professions: [
        { name: 'Tailoring', why: 'Felheart/Felcloth gear' },
        { name: 'Alchemy', why: 'Flasks' },
      ],
      consumables: ['Elixir of Shadow Power', 'Greater Arcane Elixir', 'Flask of Supreme Power', 'Brilliant Wizard Oil'],
      build: [
        ['Improved Shadow Bolt', 5], ['Cataclysm', 3], ['Aftermath', 2], ['Ruin', 5],
        ['Shadowburn', 1], ['Agonizing Flames', 3], ['Conflagrate', 1], ['Bane of Havoc', 1],
        ['Fire and Brimstone', 3], ['Bane', 1], ['Shadow and Flame', 5], ['Incinerate', 1],
        ['Bane', 4], ['Demonic Embrace', 5], ['Improved Voidwalker', 3], ['Fel Vitality', 2],
        ['Master Summoner', 2], ['Demonic Sacrifice', 1], ['Improved Sayaad', 2], ['Fel Domination', 1],
      ],
    },
  ],
};
