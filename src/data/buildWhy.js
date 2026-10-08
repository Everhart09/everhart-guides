// "Why this build": a short explanation of each spec's talent build, shown on the guide's Talents tab.
// Keyed by "<class>/<spec>". Each entry: what the main tree gives you, why the points in the second tree, and the
// talents to prioritize while leveling.
export const BUILD_WHY = {
  'warrior/arms': {
    main: 'Arms (31) is built around Mortal Strike and big two-handed hits. Improved Rend and Deep Wounds add bleeds, Anger Management keeps rage trickling in, and Improved Execute makes the finisher cheap.',
    second: 'Fury (20) adds Cruelty for crit, Unbridled Wrath for more rage and Enrage for extra damage after being crit. The best sustain and damage for leveling.',
    early: 'Take Improved Tactical Mastery early so stance swaps for Overpower cost almost nothing.',
  },
  'warrior/fury': {
    main: 'Fury (38) is built for dual-wielding and Bloodthirst. Cruelty, Unbridled Wrath and Furious Precision make rage and crits flow, which is what keeps Fury going.',
    second: 'Arms (13) picks up Deep Wounds and Improved Charge for more rage and bleed damage from your crits.',
    early: 'Cruelty first: crit drives Flurry, Deep Wounds and Enrage.',
  },
  'warrior/protection': {
    main: 'Protection (36) adds block, avoidance and threat: Shield Specialization, Anticipation, Last Stand and Defiance, all the way down to Shield Slam.',
    second: 'Arms (15) takes Improved Tactical Mastery and Anger Management for rage, and Deep Wounds for extra threat from crits.',
    early: 'Shield Specialization makes you block more, which keeps Revenge (your cheapest threat) available.',
  },
  'paladin/retribution': {
    main: 'Retribution (31) is about Seal of Command and big two-handed swings. Conviction and Sanctified Judgement add crit and mana, and the deep talents turn Holy Strike and Judgement into one loop.',
    second: 'Holy (20) gives Divine Intellect and Healing Light, so you heal yourself efficiently between pulls, plus Divine Favor for emergencies.',
    early: 'Seal of Command early. It is the biggest jump in leveling speed.',
  },
  'paladin/holy': {
    main: 'Holy (32) maximizes healing: Divine Intellect for mana, Healing Light for bigger heals, Spiritual Focus so damage cannot interrupt you, down to Holy Shock and Light\'s Vigil.',
    second: 'Retribution (19) grabs Conviction and Sanctified Judgement for crit and mana, plus Pursuit of Justice for movement speed.',
    early: 'Divine Intellect and Spiritual Focus first. Mana and uninterrupted casts are what a healer needs most.',
  },
  'paladin/protection': {
    main: 'Protection (39) is the tanking tree: Redoubt and Anticipation for block and avoidance, Improved Righteous Fury for threat, and Holy Shield at the bottom.',
    second: 'Holy (12) takes Divine Intellect and Spiritual Focus so you can heal yourself without being interrupted.',
    early: 'Improved Righteous Fury: holding threat matters more than anything else when tanking.',
  },
  'hunter/beast-mastery': {
    main: 'Beast Mastery (31) makes your pet the star: Endurance Training, Unleashed Fury and Ferocity make it tougher and deadlier, down to Bestial Wrath.',
    second: 'Marksmanship (20) adds Improved Arcane Shot, Rapid Killing and Trueshot Aura so your own shots still matter.',
    early: 'Bestial Swiftness early: a faster pet means it reaches mobs and grabs threat before they get to you.',
  },
  'hunter/marksmanship': {
    main: 'Marksmanship (36) is about your own shots: Lethal Attacks for crit, Careful Aim for attack power, Rapid Killing for more Rapid Fires, down to Trueshot Aura and beyond.',
    second: 'Beast Mastery (15) keeps your pet useful with Endurance Training and Unleashed Fury.',
    early: 'Lethal Attacks first. Crit boosts every shot you fire.',
  },
  'hunter/survival': {
    main: 'Survival (31) makes you comfortable in melee: Savage Strikes for Raptor Strike and Mongoose Bite crits, Survivalist for health and Surefooted against snares.',
    second: 'Marksmanship (20) adds Improved Arcane Shot, Rapid Killing and Trueshot Aura for your ranged damage.',
    early: 'Savage Strikes early. Your melee attacks are a big part of Survival\'s damage.',
  },
  'rogue/combat': {
    main: 'Combat (31) is the sturdy leveling rogue: Precision for hit, Improved Sinister Strike to save energy, Dual Wield Specialization, Blade Flurry and Adrenaline Rush.',
    second: 'Assassination (20) adds Murder and Lethality for crit damage, plus Improved Slice and Dice and Relentless Strikes for more uptime and energy.',
    early: 'Improved Sinister Strike: cheaper builders mean more finishers.',
  },
  'rogue/assassination': {
    main: 'Assassination (31) is built around crits and poisons: Malice for crit, Ruthlessness for free combo points, Lethality for crit damage, down to Mutilate, Seal Fate and Venom.',
    second: 'Combat (20) takes Dual Wield Specialization and Puncturing Wounds for dagger damage.',
    early: 'Malice first. Crit powers Seal Fate later on.',
  },
  'rogue/subtlety': {
    main: 'Subtlety (31) is stealth and control: Opportunity and Improved Ambush for openers, Elusiveness and Camouflage for stealth, down to Preparation and Hemorrhage.',
    second: 'Assassination (20) adds Murder, Lethality, Relentless Strikes and Cold Blood for burst.',
    early: 'Opportunity early. Your openers do a lot of the work.',
  },
  'priest/shadow': {
    main: 'Shadow (31) is the leveling priest: Spirit Tap refills mana after kills, Shadow Focus adds hit, Mind Flay slows, and Shadowform makes everything cheaper and harder-hitting.',
    second: 'Discipline (20) adds Wand Specialization, Mental Agility to cut costs, and Inner Focus for free spells.',
    early: 'Spirit Tap 5/5 first. It is the reason Shadow levels so quickly.',
  },
  'priest/holy': {
    main: 'Holy (32) is pure healing: Improved Renew, Divine Fury for faster Greater Heals, Inspiration to reduce tank damage, down to Prayer of Mending.',
    second: 'Discipline (19) takes Improved Power Word: Shield, Mental Agility and Inner Focus for cheaper, stronger instant spells.',
    early: 'Holy Specialization and Improved Renew first for stronger everyday healing.',
  },
  'priest/discipline': {
    main: 'Discipline (35) prevents damage before it happens: Twin Disciplines and Improved Power Word: Shield, then Soul Warding, Penance and Power Infusion.',
    second: 'Holy (16) adds Improved Renew, Divine Fury and Inspiration for your direct heals.',
    early: 'Improved Power Word: Shield first. Shields are your main tool.',
  },
  'shaman/enhancement': {
    main: 'Enhancement (31) is a melee shaman: Thundering Strikes for crit, Mental Dexterity to turn Intellect into attack power, Elemental Weapons, down to Stormstrike and Maelstrom Weapon.',
    second: 'Elemental (20) adds Reverberation for faster shocks, Elemental Devastation for crit and Call of Thunder.',
    early: 'Thundering Strikes first. Crits trigger Flurry for faster attacks.',
  },
  'shaman/elemental': {
    main: 'Elemental (31) is a lightning caster: Concussion for damage, Reverberation for faster shocks, Elemental Alacrity for faster Lightning Bolts, down to Lightning Overload and Lava Burst.',
    second: 'Restoration (20) adds Tidal Focus, Water Shield and Mana Tide Totem so you can keep casting.',
    early: 'Concussion and Elemental Alacrity first: more damage per cast and faster casts.',
  },
  'shaman/restoration': {
    main: 'Restoration (44) goes very deep for healing: Improved Healing Wave, Tidal Focus, Healing Focus and Mana Tide Totem, down to Riptide.',
    second: 'Enhancement (7) takes Ancestral Knowledge for more mana and Guardian Totems.',
    early: 'Improved Healing Wave and Tidal Focus first for faster, cheaper heals.',
  },
  'mage/frost': {
    main: 'Frost (41) is the leveling mage: Improved Frostbolt and Ice Shards for faster, harder Frostbolts, Improved Frost Nova and Shatter for freeze combos, Ice Barrier for safety.',
    second: 'Arcane (10) takes Arcane Focus for hit and Arcane Concentration for free spells.',
    early: 'Improved Frostbolt first: a faster Frostbolt is more damage and safer kiting.',
  },
  'mage/fire': {
    main: 'Fire (31) is big crits and burst: Improved Fireball, Ignite to add burning to crits, Pyroblast, Incineration and Combustion.',
    second: 'Arcane (20) gives Arcane Concentration and Arcane Meditation for mana, which Fire badly needs.',
    early: 'Improved Fireball first: a faster Fireball is your main damage increase.',
  },
  'mage/arcane': {
    main: 'Arcane (31) is about mana and burst: Arcane Concentration for free spells, Arcane Impact, Presence of Mind and Arcane Power.',
    second: 'Frost (20) adds Ice Shards, Piercing Ice, Ice Lance and Shatter, so you still level with Frostbolt.',
    early: 'Arcane Focus and Arcane Concentration first for hit and free casts.',
  },
  'warlock/affliction': {
    main: 'Affliction (31) is damage over time and sustain: Improved Corruption for an instant Corruption, Improved Drains, Nightfall and Siphon Life.',
    second: 'Demonology (20) makes your Voidwalker a better tank and adds Fel Domination for quick resummons.',
    early: 'Improved Corruption first: instant Corruption works while moving.',
  },
  'warlock/demonology': {
    main: 'Demonology (31) is about your pet and your own toughness: Demonic Embrace for Stamina, Master Summoner, Fel Domination and Soul Link.',
    second: 'Affliction (20) adds Improved Drains, Improved Bane of Agony and Nightfall for more damage.',
    early: 'Demonic Embrace first. It makes you much harder to kill.',
  },
  'warlock/destruction': {
    main: 'Destruction (35) is big direct damage: Improved Shadow Bolt, Cataclysm to save mana, Ruin for crit damage, Shadowburn and Conflagrate.',
    second: 'Demonology (16) takes Demonic Sacrifice for a big damage buff and Fel Domination.',
    early: 'Improved Shadow Bolt first: faster casts mean more damage.',
  },
  'druid/feral': {
    main: 'Feral (41) covers both cat damage and bear tanking: Ferocity for cheaper attacks, Feral Swiftness for speed, Thick Hide for armor, down to Leader of the Pack and Berserk.',
    second: 'Restoration (10) takes Furor for free rage and energy when shifting, plus Naturalist.',
    early: 'Ferocity first. Cheaper Claw and Maul means faster kills.',
  },
  'druid/balance': {
    main: 'Balance (38) is a nature caster: Improved Wrath and Improved Moonfire for damage, Moonglow for mana, Nature\'s Majesty for crit, down to Eclipse and Moonkin Form.',
    second: 'Restoration (13) adds Nature\'s Focus so damage cannot interrupt your casts, plus Naturalist and Reflection.',
    early: 'Improved Wrath first: faster casts are more damage.',
  },
  'druid/restoration': {
    main: 'Restoration (38) is a heal-over-time healer: Nature\'s Focus so casts cannot be interrupted, Reflection for mana, Swiftmend and Wild Growth.',
    second: 'Balance (13) adds Moonglow for mana and Nature\'s Majesty for crit.',
    early: 'Nature\'s Focus and Reflection first: uninterrupted heals and better mana.',
  },
};
