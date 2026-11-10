// "Why this build": a short explanation of each spec's talent build, shown on the guide's Talents tab.
// Keyed by "<class>/<spec>". Each entry: what the main tree gives you, why the points in the second tree, and the
// talents to prioritize while leveling.
export const BUILD_WHY = {
  'warrior/arms': {
    main: 'Arms (32) is built around Mortal Strike and big two-handed hits. Improved Rend and Bloodthrill turn your bleeds into extra Overpowers, Deep Wounds and Impale add crit damage, Weaponmaster rewards your weapon type, and Improved Slam leads into Mortal Strike.',
    second: 'Fury (17) adds Cruelty for crit, Unbridled Wrath for more rage, Enrage for damage after being crit, and Reckless Swings and Improved Execute. Protection (2) takes Improved Bloodrage for more rage at the start of a fight.',
    early: 'Improved Heroic Strike, Improved Rend and Improved Tactical Mastery first: cheaper attacks, a stronger bleed and almost free stance swaps for Overpower.',
    leveling: {
      main: "Arms (34) for leveling: cheaper Heroic Strikes and a stronger Rend first, Improved Charge so every pull starts with rage, then Deep Wounds, Two-Handed Weapon Specialization and Sweeping Strikes at 30. Mortal Strike arrives at 40.",
      second: "Fury (17) comes last: Cruelty for crit, Unbridled Wrath for rage, Blood Craze to heal after crits on you, and Enrage.",
      early: "Improved Charge early: starting every fight with extra rage means faster kills and less downtime.",
    },
    respec: "At 60, Improved Charge and Blood Craze come out. Those points go into Improved Bloodrage, Reckless Swings and Improved Execute for steady rage and a cheaper finisher in raids.",
  },
  'warrior/fury': {
    main: 'Fury (34) is built for dual-wielding and Bloodthirst. Cruelty, Unbridled Wrath and Furious Precision make rage and crits flow, Dual Wield Specialization and Improved Whirlwind add damage, and Death Wish, Flurry and Bloodthirst finish the tree.',
    second: 'Arms (17) picks up Improved Heroic Strike, Improved Rend, Improved Charge and Improved Tactical Mastery for rage, plus Anger Management, Deep Wounds and Impale for crit damage.',
    early: 'Cruelty first: crit drives Flurry, Deep Wounds and Enrage.',
    leveling: {
      main: "Fury (34) for leveling: Cruelty, Unbridled Wrath and Enrage first, then Blood Craze 3/3 so you heal while you fight, Dual Wield Specialization, Death Wish at 33, Flurry and Bloodthirst at 40.",
      second: "Arms (17) waits until 44: Improved Heroic Strike, Improved Rend, Improved Charge, Improved Tactical Mastery, Anger Management, Deep Wounds and Impale.",
      early: "Cruelty first: crit drives Flurry, Enrage and Blood Craze.",
    },
    respec: "At 60, one point of Blood Craze moves into Improved Berserker Rage for more rage in raids.",
  },
  'warrior/protection': {
    main: 'Protection (38) adds block, avoidance and threat: Shield Specialization, Anticipation and Last Stand, Master of Defense and Focused Rage for rage, Bastion for 10% more damage with a shield, down to Shield Slam.',
    second: 'Arms (13) takes Deflection for parry, Improved Heroic Strike and Improved Tactical Mastery for cheaper attacks and stance swaps, and Anger Management for steady rage.',
    early: 'Shield Specialization makes you block more, which keeps Revenge (your cheapest threat) available.',
    leveling: {
      main: "Protection (37) for leveling as a tank: Shield Specialization, Improved Revenge and Improved Thunder Clap for cheap AoE threat, Vanguard so you can Charge in Defensive Stance, then Concussion Blow, Focused Rage, Bastion for 10% more damage, and Shield Slam at 40.",
      second: "Arms (14) at the end: Improved Heroic Strike, Deflection, Improved Charge, Improved Tactical Mastery and Anger Management.",
      early: "Shield Specialization and Improved Revenge first: blocks give rage and Revenge does most of your damage.",
    },
    respec: "At 60, Vanguard, Improved Thunder Clap and one point of Improved Charge come out for Iron Will, so stuns and fears wear off faster on raid bosses.",
  },
  'paladin/retribution': {
    main: 'Retribution (31) is about Seal of Command and big two-handed swings. Conviction and Sanctified Judgement add crit and mana, Sacred Arbiter makes Holy Strike refresh your Judgements, Champion of the Light turns Intellect into spell damage, and Unsealed Wrath at the bottom rewards switching Seals.',
    second: 'Holy (12) gives Divine Strength, Improved Seals and Holy Conduit for cheaper Consecration and Exorcism. Protection (8) picks up Divine Intellect, which moved there in Forever, and Precision for hit.',
    early: 'Benediction and Improved Judgement first for cheaper spells and more Judgements, then Seal of Command.',
    leveling: {
      main: "Retribution (33) for leveling: Benediction, Improved Judgement and Conviction, Seal of Command at 20, and Pursuit of Justice for 15% movement speed. Then Two-Handed Weapon Specialization, Vengeance, Champion of the Light and Unsealed Wrath at 40.",
      second: "Holy (10) for Divine Strength and Improved Seals, and Protection (8) for Divine Intellect and Precision, come after 40.",
      early: "Seal of Command at 20 is the biggest jump in leveling speed.",
    },
    respec: "At 60, Pursuit of Justice comes out for Holy Conduit, so Consecration and Exorcism cost much less mana in long fights.",
  },
  'paladin/holy': {
    main: 'Holy (31) maximizes healing: Spiritual Focus so damage cannot interrupt you, Healing Light for bigger heals, Illumination for mana, Oath of Light on your tank, down to Holy Shock, Boundless Light and Light\'s Vigil.',
    second: 'Retribution (15) grabs Conviction and Sanctified Judgement for crit and mana, Unyielding Faith, and Pursuit of Justice for movement speed. Protection (5) takes Divine Intellect for mana.',
    early: 'Spiritual Focus and Healing Light first. Uninterrupted, bigger heals are what a healer needs most.',
    leveling: {
      main: "Holy (33) starts at 21, after Seal of Command: Spiritual Focus and Healing Light for dungeon healing, Divine Favor, Illumination, Holy Shock at 41, Consecrated Ground for AoE questing, then Holy Power and Light's Vigil.",
      second: "Retribution (13) comes first: Benediction, Improved Judgement, Conviction and Seal of Command by 20, so you quest like a Retribution paladin. Pursuit of Justice and Divine Intellect come later.",
      early: "Seal of Command at 20 makes questing much faster; your heals are still strong without talents.",
    },
    respec: "At 60, Seal of Command, Consecrated Ground and two points of Conviction come out for Sanctified Judgement and Unyielding Faith: more mana and less fear in raids.",
  },
  'paladin/protection': {
    main: 'Protection (44) is the tanking tree: Redoubt and Anticipation for block and avoidance, Templar\'s Bulwark and Sacred Duty for emergencies, Improved Righteous Fury and Iron Creed for threat, Reckoning, Holy Shield, and Shieldsworn at the bottom so Holy Strike triggers your shield. Divine Intellect now lives here too.',
    second: 'Retribution (7) takes Deflection for parry and Benediction for cheaper spells.',
    early: 'Redoubt and Divine Intellect first for block and a bigger mana pool, then Precision for hit.',
    leveling: {
      main: "Protection (41) for leveling as a tank: Divine Intellect and Precision, Redoubt and Templar's Bulwark, Improved Righteous Fury, Holy Shield at 30, Reckoning for extra attacks, and Shieldsworn at 40.",
      second: "Retribution (10) at the end: Benediction 5/5 for cheaper spells while you pull big packs, and Deflection.",
      early: "Divine Intellect first: a bigger mana pool lets you keep Consecration going pack after pack.",
    },
    respec: "At 60, three points of Benediction go into Stoicism and the last point of Anticipation for raid tanking.",
  },
  'hunter/beast-mastery': {
    main: 'Beast Mastery (31) makes your pet the star: Deadly Aspects, Focused Fire and Unleashed Fury for damage, Endurance Training to keep it alive, Ferocity and Frenzy for crits, Summon Hawk and Intimidation, down to Bestial Wrath.',
    second: 'Marksmanship (20) adds Lethal Attacks, Careful Aim and Mortal Shots so your own shots crit often and hard, plus Improved Stings and Rapid Killing.',
    early: 'Deadly Aspects first: faster Auto Shots with Aspect of the Hawk from level 10.',
    leveling: {
      main: "Beast Mastery (31) for leveling: Deadly Aspects, Focused Fire and Endurance Training first, Unleashed Fury at 20, Ferocity, Summon Hawk, Spirit Bond so you and your pet heal between pulls, then Frenzy and Bestial Wrath at 40.",
      second: "Marksmanship (20) after 40: Lethal Attacks, Careful Aim, Improved Stings, Rapid Killing and Mortal Shots.",
      early: "Deadly Aspects first: faster Auto Shots with Aspect of the Hawk from level 10.",
    },
    respec: "At 60, Spirit Bond comes out for Bestial Discipline, which gives your pet more Focus in long fights.",
  },
  'hunter/marksmanship': {
    main: 'Marksmanship (41) is about your own shots: Lethal Attacks for crit, Careful Aim for attack power, Efficiency for mana, Improved Arcane Shot, Trueshot Aura, Barrage and Ranged Weapon Specialization, down to Sniper Shot.',
    second: 'Beast Mastery (5) takes Deadly Aspects for faster Auto Shots, and Survival (5) takes Improved Tracking for damage against tracked targets.',
    early: 'Lethal Attacks first. Crit boosts every shot you fire.',
    leveling: {
      main: "Marksmanship (39) for leveling keeps your pet: Lethal Attacks and Careful Aim, Improved Stings, Efficiency for mana, Trueshot Aura at 25, then Improved Arcane Shot, Mortal Shots and Sniper Shot at 45.",
      second: "Beast Mastery (7) takes Deadly Aspects at 26 and Focused Fire for your pet. Survival (5) takes Improved Tracking at the end.",
      early: "Lethal Attacks first. Crit boosts every shot you fire.",
    },
    respec: "At 60 you dismiss your pet: Focused Fire comes out for Lone Wolf (20% more damage with no pet) and the last point of Rapid Recuperation.",
  },
  'hunter/survival': {
    main: 'Survival (33) makes you comfortable in melee: Savage Strikes and Predator\'s Edge for melee crits, Survivalist for health, Surefooted against snares, Expose Prey for extra Mongoose Bites and Lacerating Strikes to make them bleed.',
    second: 'Marksmanship (13) adds Lethal Attacks, Careful Aim and Rapid Killing for your ranged damage, plus Lone Wolf for 20% more damage when you fight without a pet. Beast Mastery (5) takes Deadly Aspects.',
    early: 'Improved Tracking and Savage Strikes early: more damage on tracked targets and harder melee crits.',
    leveling: {
      main: "Survival (32) for leveling: Improved Tracking, Savage Strikes and Survivalist first, Deterrence at 20 for emergencies, Surefooted and Clever Traps, Predator's Edge, Expose Prey, Strider Kick and Lacerating Strikes at 40.",
      second: "Marksmanship (12) adds Lethal Attacks, Careful Aim and Rapid Killing after 40. Beast Mastery (7) takes Deadly Aspects and Focused Fire, because the leveling build keeps your pet.",
      early: "Improved Tracking and Savage Strikes first: more damage on tracked targets and harder melee crits.",
    },
    respec: "At 60, Deterrence and Focused Fire come out for Survival Tactics and Lone Wolf (20% more damage with no pet).",
  },
  'rogue/combat': {
    main: 'Combat (35) is the steady, sturdy rogue: Coup de Grace for a bigger Eviscerate, Efficient Strikes for a cheaper Sinister Strike, Precision for hit, Hack and Slash for your weapon type, Flash of Steel to make Shank give more Energy, Blade Flurry and Adrenaline Rush.',
    second: 'Assassination (16) adds Malice and Lethality for crit, Ruthlessness and Improved Slice and Dice for free combo points and uptime, Remorseless Attacks and Cold Blood.',
    early: 'Lightning Reflexes, Coup de Grace and Efficient Strikes first: more dodge, a bigger Eviscerate and cheaper builders.',
    leveling: {
      main: "Combat (35) for leveling: Efficient Strikes and Coup de Grace first for cheap Sinister Strikes and big Eviscerates, Precision for hit, Endurance for twice as many Sprints and Evasions, Riposte, Aggression, Blade Flurry at 31 and Adrenaline Rush at 40.",
      second: "Assassination (16) after 40: Malice, Ruthlessness, Improved Slice and Dice, Remorseless Attacks, Lethality and Cold Blood.",
      early: "Efficient Strikes first: a cheaper Sinister Strike means more finishers.",
    },
    respec: "At 60, one point of Endurance goes into Composure for a cheaper opener after Poised.",
  },
  'rogue/assassination': {
    main: 'Assassination (36) is built around crits and poisons: Malice for crit, Ruthlessness for free combo points, Lethality for crit damage, Vile Poisons and Improved Poisons, Relentless Strikes for energy, Venom (through Shank), Seal Fate and Mutilate.',
    second: 'Combat (13) takes Coup de Grace for Eviscerate, Puncturing Wounds for Backstab and Mutilate crits, Precision for hit and Composure for Poised. Subtlety (2) takes Opportunity for dagger damage.',
    early: 'Malice first. Crit powers Seal Fate later on.',
    leveling: {
      main: "Assassination (38) for leveling: Malice, Ruthlessness and Lethality first, Cold Blood at 25, Vile and Improved Poisons, Venom, Seal Fate at 36 and Mutilate at 40, then Remorseless Attacks for a crit after every kill.",
      second: "Combat (13) at the end: Coup de Grace, Lightning Reflexes, Puncturing Wounds, Precision, Endurance and Composure.",
      early: "Malice first. Crit powers Seal Fate later on.",
    },
    respec: "At 60, Remorseless Attacks (a questing talent) comes out for Opportunity.",
  },
  'rogue/subtlety': {
    main: 'Subtlety (29) is stealth and control: Setup and Master of Deception, Opportunity and Improved Ambush for openers, Dirty Deeds, Initiative and Premeditation for fast combo points, Serrated Blades, Elusiveness, Preparation and Hemorrhage.',
    second: 'Combat (17) adds Coup de Grace, Lightning Reflexes, Precision, Improved Sprint, Endurance and Improved Kick for PvP survival and control. Assassination (5) takes Malice for crit.',
    early: 'Opportunity and Master of Deception early. Your openers do a lot of the work.',
    leveling: {
      main: "Subtlety (31) for leveling: Opportunity 5/5 and Improved Ambush for big openers, Dirty Deeds, Premeditation at 20, Serrated Blades, Initiative, Ghostly Strike, Hemorrhage at 30 and Preparation, plus Camouflage to move faster in Stealth.",
      second: "Assassination (5) for Malice and Combat (15) for Coup de Grace, Lightning Reflexes, Precision, Improved Sprint and Endurance after 40.",
      early: "Opportunity first: your openers do most of the work while leveling.",
    },
    respec: "At 60 the build turns to PvP: three points of Opportunity and Camouflage go into Heightened Senses and Improved Kick.",
  },
  'priest/shadow': {
    main: 'Shadow (31) is the leveling priest: Spirit Tap refills mana after kills, Shadow Focus adds hit, Mind Flay slows, and Shadowform makes everything cheaper and harder-hitting.',
    second: 'Discipline (20) adds Wand Specialization, Mental Agility to cut costs, and Inner Focus for free spells.',
    early: 'Spirit Tap 5/5 first. It is the reason Shadow levels so quickly.',
  },
  'priest/holy': {
    main: 'Holy (34) is pure healing: Holy Specialization and Improved Renew, Divine Fury for faster Greater Heals, Inspiration to reduce tank damage, Litany of Light for mana, Spiritual Guidance and Spiritual Healing, down to Prayer of Mending.',
    second: 'Discipline (17) takes Twin Disciplines, Mental Strength, Mental Agility, Inner Focus and Meditation for cheaper spells and mana while casting.',
    early: 'Holy Specialization and Improved Renew first for stronger everyday healing.',
    leveling: {
      main: "Holy (34) for leveling puts damage first: Holy Specialization and Divine Fury for faster, harder Smites, Holy Nova and Searing Light, then healing talents from Improved Healing to Spirit of Redemption and Prayer of Mending at 50.",
      second: "Discipline (17): Wand Specialization and Twin Disciplines in the 20s for questing, then Mental Strength, Mental Agility, Inner Focus and Meditation.",
      early: "Holy Specialization and Divine Fury first: Smite crits more and casts faster, and both help your heals too.",
    },
    respec: "At 60, Wand Specialization and Searing Light (questing damage) come out for Silent Resolve and Litany of Light, so you hold less threat and keep more mana in raids.",
  },
  'priest/discipline': {
    main: 'Discipline (31) prevents damage before it happens: Twin Disciplines and Improved Power Word: Shield, Meditation for mana, then Soul Warding, Penance, Renewed Hope, Divine Aegis and Power Infusion.',
    second: 'Holy (20) adds Twilight Focus so damage does not slow your casts, Holy Specialization, Divine Fury, Inspiration, Improved Healing and Holy Binding.',
    early: 'Twin Disciplines first: stronger instant spells, including your shields.',
    leveling: {
      main: "Discipline (31) for leveling: Twin Disciplines and Wand Specialization first, Improved Power Word: Shield at 20, Mental Agility, Inner Focus, Penance at 31, Renewed Hope, Divine Aegis and Power Infusion at 40.",
      second: "Holy (20) after 40: Holy Specialization, Divine Fury, Holy Nova, Twilight Focus, Searing Light and Improved Healing.",
      early: "Twin Disciplines first: stronger Shadow Word: Pain, Renew and shields.",
    },
    respec: "At 60, Wand Specialization, Searing Light and Holy Nova come out for Silent Resolve, Inspiration and Holy Binding.",
  },
  'shaman/enhancement': {
    main: 'Enhancement (33) is a melee shaman: Thundering Strikes for crit, Ancestral Knowledge and Mental Dexterity to turn Intellect into attack power, Elemental Weapons, Flurry, Stormstrike with Improved Stormstrike, Maelstrom Weapon and Rage of the Farseer.',
    second: 'Elemental (8) adds Concussion and Elemental Devastation for melee crit after your spells crit. Restoration (10) takes Tidal Focus for hit and cheaper spells, and Totemic Focus because you drop a full set of totems every fight.',
    early: 'Thundering Strikes first. Crits trigger Flurry for faster attacks.',
    leveling: {
      main: 'Enhancement (34) for leveling puts damage first: Thundering Strikes, then Mental Dexterity (150% of your Intellect as attack power) before the rest of Ancestral Knowledge. Stormstrike arrives at 25, Flurry is done by 30 and Rage of the Farseer comes at 40. Improved Ghost Wolf makes Ghost Wolf almost instant and usable indoors, which saves a lot of time between quests.',
      second: 'Elemental (9) adds Concussion and Elemental Devastation, plus a point in Call of Flame for Flame Shock. Restoration (8) takes Tidal Focus for hit and Mindfulness, so your mana keeps coming back while you heal yourself between pulls.',
      early: 'Mental Dexterity right after Thundering Strikes: it is far more damage per point than Ancestral Knowledge at low levels.',
    },
    respec: 'At 60 the questing comfort comes out: Improved Ghost Wolf, Call of Flame and Mindfulness. Those points go into Ancestral Knowledge and Totemic Focus, which matter more in dungeons and raids where you drop every totem each pull.',
  },
  'shaman/elemental': {
    main: 'Elemental (32) is a lightning caster: Concussion and Convection for damage and mana, Reverberation for faster shocks, Elemental Alacrity, Call of Thunder and Lightning Overload, Elemental Fury for crits, down to Lightning Mastery for burst.',
    second: 'Restoration (14) adds Tidal Focus, Totemic Focus, Mindfulness and Natural Grace so you can keep casting. Enhancement (5) takes Thundering Strikes.',
    early: 'Concussion and Convection first: more damage per cast for less mana.',
    leveling: {
      main: "Elemental (32) for leveling: Concussion and Elemental Alacrity first, Convection for mana, Elemental Focus, Reverberation, Eye of the Storm so mobs hitting you do not slow your casts, Lightning Overload at 30, Elemental Fury and Lightning Mastery at 40.",
      second: "Enhancement (5) takes Thundering Strikes, and Restoration (14) takes Tidal Focus, Mindfulness, Improved Reincarnation and Totemic Focus after 40.",
      early: "Concussion and Elemental Alacrity first: more damage per cast and faster casts.",
    },
    respec: "At 60, Eye of the Storm and Improved Reincarnation come out for Call of Flame and Natural Grace: more Flame Shock damage and less threat in groups.",
  },
  'shaman/restoration': {
    main: 'Restoration (46) goes very deep for healing: Improved Healing Wave, Tidal Focus, Healing Focus, Restorative Totems, Mana Tide Totem, Nature\'s Swiftness and Purification, down to Riptide.',
    second: 'Enhancement (5) takes Thundering Strikes for crit.',
    early: 'Improved Healing Wave and Tidal Focus first for faster, cheaper heals.',
    leveling: {
      main: "Restoration (41) starts at 20: Improved Healing Wave, Tidal Focus, Mindfulness, Healing Focus, Water Shield, Tidal Mastery, Mana Tide Totem, Nature's Swiftness, Healing Way and Riptide at 50.",
      second: "Enhancement (10) comes first, from 10 to 19: Thundering Strikes, Mental Dexterity and Ancestral Knowledge make you a decent melee shaman for questing.",
      early: "Mental Dexterity early: with all your Intellect it turns into a lot of attack power for questing.",
    },
    respec: "At 60, the Enhancement points except Thundering Strikes come out for Ancestral Healing and the rest of Restorative Totems.",
  },
  'mage/frost': {
    main: 'Frost (41) is the leveling mage: Improved Frostbolt and Ice Shards for faster, harder Frostbolts, Improved Frost Nova and Shatter for freeze combos, Ice Barrier for safety.',
    second: 'Arcane (10) takes Arcane Resilience for armor and Arcane Concentration for free spells. Hit now comes from Precision in the Frost tree.',
    early: 'Improved Frostbolt first: a faster Frostbolt is more damage and safer kiting.',
  },
  'mage/fire': {
    main: 'Fire (31) is big crits and burst: Accelerant for a faster Fireball, Ignite to add burning to crits, Pyroblast, Incineration and Combustion.',
    second: 'Arcane (18) gives Arcane Concentration and Arcane Meditation for mana, which Fire badly needs, plus Missile Barrage procs from Fireball. Frost (2) takes Precision for hit.',
    early: 'Accelerant first: a faster Fireball is your main damage increase.',
    leveling: {
      main: "Fire (31) for leveling: Accelerant and Ignite first, Pyroblast at 20, Incineration, Burning Soul so damage does not slow your casts, Heating Up, Master of Elements, Critical Mass, Blast Wave and Combustion at 40.",
      second: "Arcane (18) after 40 for Arcane Concentration and Arcane Meditation, and Frost (2) for Precision.",
      early: "Accelerant first: a faster Fireball is your main damage increase.",
    },
    respec: "At 60, Burning Soul comes out for Improved Scorch, the raid debuff that makes every Fire spell hit harder.",
  },
  'mage/arcane': {
    main: 'Arcane (36) is about mana and burst: Improved Channeling so damage cannot slow your Arcane spells, Arcane Concentration for free spells, Missile Barrage, Arcane Impact, Arcane Blast and Arcane Wrath, Presence of Mind, Arcane Mind and Arcane Power.',
    second: 'Fire (15) adds Incineration for Arcane Blast crits, Ignite, Flame Throwing and Improved Fire Blast.',
    early: 'Improved Channeling first: steady casts while mobs hit you.',
  },
  'warlock/affliction': {
    main: 'Affliction (40) is damage over time and sustain: Improved Corruption for an instant Corruption, Suppression for hit, Improved Drains, Malevolence and Pandemic for crits, Nightfall, Siphon Life, Soul Siphon, Shadow Mastery and Wrack.',
    second: 'Demonology (11) takes Demonic Embrace and Fel Vitality to make you and your pet tougher, Demonic Aegis for a stronger Demon Armor, and Demonic Sacrifice.',
    early: 'Improved Corruption first: instant Corruption works while moving.',
    leveling: {
      main: "Affliction (40) for leveling: Improved Corruption and Improved Drains first, Fel Concentration so Drain Life is not interrupted, Nightfall at 25, Siphon Life at 30, Soul Siphon, Shadow Mastery and Wrack at 40. Suppression comes late because hit matters little against questing mobs.",
      second: "Demonology (11) at the end: Demonic Embrace, Improved Voidwalker for your leveling tank, Fel Vitality and Demonic Sacrifice.",
      early: "Improved Corruption first: instant Corruption works while moving.",
    },
    respec: "At 60, two points of Fel Concentration and Improved Voidwalker come out for Grim Reach and Demonic Aegis.",
  },
  'warlock/demonology': {
    main: 'Demonology (30) is about your pet and your own toughness: Demonic Embrace for Stamina, Unholy Power for pet damage, Fel Vitality, Demonic Energies, Decimation, Soul Link, Demonic Knowledge and Master Demonologist.',
    second: 'Destruction (16) adds Improved Shadow Bolt, Bane for faster casts, Ruin for crit damage and Agonizing Flames. Affliction (5) takes Suppression for hit.',
    early: 'Demonic Embrace first. It makes you much harder to kill.',
    leveling: {
      main: "Demonology (30) for leveling: Demonic Embrace and Unholy Power first, Fel Vitality, Improved Voidwalker for a sturdier tank, Demonic Energies, Demonic Sacrifice, Soul Link at 31, Demonic Knowledge and Master Demonologist.",
      second: "Affliction (5) takes Suppression at 40, then Destruction (16) for Bane, Improved Shadow Bolt, Ruin and Agonizing Flames.",
      early: "Demonic Embrace first. It makes you much harder to kill.",
    },
    respec: "At 60, Improved Voidwalker comes out for Improved Sayaad, since the Succubus is the damage pet for groups.",
  },
  'warlock/destruction': {
    main: 'Destruction (35) is big direct damage: Improved Shadow Bolt, Cataclysm to save mana, Ruin for crit damage, Shadowburn and Conflagrate.',
    second: 'Demonology (16) takes Demonic Sacrifice for a big damage buff and Fel Domination.',
    early: 'Improved Shadow Bolt first: faster casts mean more damage.',
  },
  'druid/feral': {
    main: 'Feral (41) covers both cat damage and bear tanking: Ferocity for cheaper attacks, Furor for free rage and energy when shifting, Thick Hide for armor, Lacerate and Natural Instinct, down to Leader of the Pack and Primal Bite.',
    second: 'Restoration (10) takes Heart of the Wild for Intellect and bear Stamina, Natural Shapeshifter for cheaper shifting, and Naturalist.',
    early: 'Ferocity first. Cheaper Claw and Maul means faster kills.',
  },
  'druid/balance': {
    main: 'Balance (41) is a nature caster: Improved Wrath, Genesis and Improved Moonfire for damage, Moonglow for mana, Vengeance and Improved Starfire for crits, Nature\'s Grace, Eclipse, Moonfury and Moonkin Form.',
    second: 'Restoration (10) adds Nature\'s Focus so damage cannot interrupt your casts, and Naturalist.',
    early: 'Improved Wrath first: faster casts are more damage.',
    leveling: {
      main: "Balance (42) for leveling: Improved Wrath, Improved Moonfire and Moonglow first, Improved Entangling Roots at 20 so roots hold mobs while you cast, Insect Swarm, Vengeance, Nature's Grace, Improved Starfire, Moonkin Form at 40 and Eclipse.",
      second: "Restoration (9) at the end: Nature's Focus and Naturalist.",
      early: "Improved Wrath first: faster casts are more damage.",
    },
    respec: "At 60, Improved Entangling Roots comes out for Nature's Reach and the last point of Naturalist.",
  },
  'druid/restoration': {
    main: 'Restoration (45) is a heal-over-time healer: Nature\'s Focus so casts cannot be interrupted, Reflection for mana, Gift of Nature, Bloom for extra healing when your heals expire, Swiftmend, Living Spirit, Improved Regrowth and Wild Growth.',
    second: 'Balance (6) takes Genesis for stronger heals over time and Nature\'s Majesty.',
    early: 'Nature\'s Focus and Heart of the Wild first: uninterrupted heals and more Intellect.',
    leveling: {
      main: "Restoration (40) starts at 20: Nature's Focus, Heart of the Wild, Naturalist, Swiftmend at 35, Reflection, Improved Rejuvenation, Gift of Nature, Living Spirit and Wild Growth at 50.",
      second: "Balance (11): Improved Wrath and Genesis from 10 to 19 for questing damage, and Nature's Majesty at the end.",
      early: "Improved Wrath first: you quest with Wrath until your healing talents start at 20.",
    },
    respec: "At 60, Improved Wrath comes out for Tranquil Spirit, so Healing Touch and Tranquility cost less.",
  },
};
