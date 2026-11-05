// "Why this build": a short explanation of each spec's talent build, shown on the guide's Talents tab.
// Keyed by "<class>/<spec>". Each entry: what the main tree gives you, why the points in the second tree, and the
// talents to prioritize while leveling.
export const BUILD_WHY = {
  'warrior/arms': {
    main: 'Arms (32) is built around Mortal Strike and big two-handed hits. Improved Rend and Bloodthrill turn your bleeds into extra Overpowers, Deep Wounds and Impale add crit damage, Weaponmaster rewards your weapon type, and Improved Slam leads into Mortal Strike.',
    second: 'Fury (17) adds Cruelty for crit, Unbridled Wrath for more rage, Enrage for damage after being crit, and Reckless Swings and Improved Execute. Protection (2) takes Improved Bloodrage for more rage at the start of a fight.',
    early: 'Improved Heroic Strike, Improved Rend and Improved Tactical Mastery first: cheaper attacks, a stronger bleed and almost free stance swaps for Overpower.',
  },
  'warrior/fury': {
    main: 'Fury (34) is built for dual-wielding and Bloodthirst. Cruelty, Unbridled Wrath and Furious Precision make rage and crits flow, Dual Wield Specialization and Improved Whirlwind add damage, and Death Wish, Flurry and Bloodthirst finish the tree.',
    second: 'Arms (17) picks up Improved Heroic Strike, Improved Rend, Improved Charge and Improved Tactical Mastery for rage, plus Anger Management, Deep Wounds and Impale for crit damage.',
    early: 'Cruelty first: crit drives Flurry, Deep Wounds and Enrage.',
  },
  'warrior/protection': {
    main: 'Protection (38) adds block, avoidance and threat: Shield Specialization, Anticipation and Last Stand, Master of Defense and Focused Rage for rage, Bastion for 10% more damage with a shield, down to Shield Slam.',
    second: 'Arms (13) takes Deflection for parry, Improved Heroic Strike and Improved Tactical Mastery for cheaper attacks and stance swaps, and Anger Management for steady rage.',
    early: 'Shield Specialization makes you block more, which keeps Revenge (your cheapest threat) available.',
  },
  'paladin/retribution': {
    main: 'Retribution (31) is about Seal of Command and big two-handed swings. Conviction and Sanctified Judgement add crit and mana, Sacred Arbiter makes Holy Strike refresh your Judgements, Champion of the Light turns Intellect into spell damage, and Unsealed Wrath at the bottom rewards switching Seals.',
    second: 'Holy (12) gives Divine Strength, Improved Seals and Holy Conduit for cheaper Consecration and Exorcism. Protection (8) picks up Divine Intellect, which moved there in Forever, and Precision for hit.',
    early: 'Benediction and Improved Judgement first for cheaper spells and more Judgements, then Seal of Command.',
  },
  'paladin/holy': {
    main: 'Holy (31) maximizes healing: Spiritual Focus so damage cannot interrupt you, Healing Light for bigger heals, Illumination for mana, Oath of Light on your tank, down to Holy Shock, Boundless Light and Light\'s Vigil.',
    second: 'Retribution (15) grabs Conviction and Sanctified Judgement for crit and mana, Unyielding Faith, and Pursuit of Justice for movement speed. Protection (5) takes Divine Intellect for mana.',
    early: 'Spiritual Focus and Healing Light first. Uninterrupted, bigger heals are what a healer needs most.',
  },
  'paladin/protection': {
    main: 'Protection (44) is the tanking tree: Redoubt and Anticipation for block and avoidance, Templar\'s Bulwark and Sacred Duty for emergencies, Improved Righteous Fury and Iron Creed for threat, Reckoning, Holy Shield, and Shieldsworn at the bottom so Holy Strike triggers your shield. Divine Intellect now lives here too.',
    second: 'Retribution (7) takes Deflection for parry and Benediction for cheaper spells.',
    early: 'Redoubt and Divine Intellect first for block and a bigger mana pool, then Precision for hit.',
  },
  'hunter/beast-mastery': {
    main: 'Beast Mastery (31) makes your pet the star: Deadly Aspects, Focused Fire and Unleashed Fury for damage, Endurance Training to keep it alive, Ferocity and Frenzy for crits, Summon Hawk and Intimidation, down to Bestial Wrath.',
    second: 'Marksmanship (20) adds Lethal Attacks, Careful Aim and Mortal Shots so your own shots crit often and hard, plus Improved Stings and Rapid Killing.',
    early: 'Deadly Aspects first: faster Auto Shots with Aspect of the Hawk from level 10.',
  },
  'hunter/marksmanship': {
    main: 'Marksmanship (41) is about your own shots: Lethal Attacks for crit, Careful Aim for attack power, Efficiency for mana, Improved Arcane Shot, Trueshot Aura, Barrage and Ranged Weapon Specialization, down to Sniper Shot.',
    second: 'Beast Mastery (5) takes Deadly Aspects for faster Auto Shots, and Survival (5) takes Improved Tracking for damage against tracked targets.',
    early: 'Lethal Attacks first. Crit boosts every shot you fire.',
  },
  'hunter/survival': {
    main: 'Survival (33) makes you comfortable in melee: Savage Strikes and Predator\'s Edge for melee crits, Survivalist for health, Surefooted against snares, Expose Prey for extra Mongoose Bites and Lacerating Strikes to make them bleed.',
    second: 'Marksmanship (13) adds Lethal Attacks, Careful Aim and Rapid Killing for your ranged damage, plus Lone Wolf for 20% more damage when you fight without a pet. Beast Mastery (5) takes Deadly Aspects.',
    early: 'Improved Tracking and Savage Strikes early: more damage on tracked targets and harder melee crits.',
  },
  'rogue/combat': {
    main: 'Combat (35) is the steady, sturdy rogue: Coup de Grace for a bigger Eviscerate, Efficient Strikes for a cheaper Sinister Strike, Precision for hit, Hack and Slash for your weapon type, Flash of Steel to make Shank give more Energy, Blade Flurry and Adrenaline Rush.',
    second: 'Assassination (16) adds Malice and Lethality for crit, Ruthlessness and Improved Slice and Dice for free combo points and uptime, Remorseless Attacks and Cold Blood.',
    early: 'Lightning Reflexes, Coup de Grace and Efficient Strikes first: more dodge, a bigger Eviscerate and cheaper builders.',
  },
  'rogue/assassination': {
    main: 'Assassination (36) is built around crits and poisons: Malice for crit, Ruthlessness for free combo points, Lethality for crit damage, Vile Poisons and Improved Poisons, Relentless Strikes for energy, Venom (through Shank), Seal Fate and Mutilate.',
    second: 'Combat (13) takes Coup de Grace for Eviscerate, Puncturing Wounds for Backstab and Mutilate crits, Precision for hit and Composure for Poised. Subtlety (2) takes Opportunity for dagger damage.',
    early: 'Malice first. Crit powers Seal Fate later on.',
  },
  'rogue/subtlety': {
    main: 'Subtlety (29) is stealth and control: Setup and Master of Deception, Opportunity and Improved Ambush for openers, Dirty Deeds, Initiative and Premeditation for fast combo points, Serrated Blades, Elusiveness, Preparation and Hemorrhage.',
    second: 'Combat (17) adds Coup de Grace, Lightning Reflexes, Precision, Improved Sprint, Endurance and Improved Kick for PvP survival and control. Assassination (5) takes Malice for crit.',
    early: 'Opportunity and Master of Deception early. Your openers do a lot of the work.',
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
  },
  'priest/discipline': {
    main: 'Discipline (31) prevents damage before it happens: Twin Disciplines and Improved Power Word: Shield, Meditation for mana, then Soul Warding, Penance, Renewed Hope, Divine Aegis and Power Infusion.',
    second: 'Holy (20) adds Twilight Focus so damage does not slow your casts, Holy Specialization, Divine Fury, Inspiration, Improved Healing and Holy Binding.',
    early: 'Twin Disciplines first: stronger instant spells, including your shields.',
  },
  'shaman/enhancement': {
    main: 'Enhancement (33) is a melee shaman: Thundering Strikes for crit, Ancestral Knowledge and Mental Dexterity to turn Intellect into attack power, Elemental Weapons, Flurry, Stormstrike, Maelstrom Weapon and Rage of the Farseer.',
    second: 'Elemental (8) adds Concussion and Elemental Devastation for melee crit after your spells crit. Restoration (10) takes Tidal Focus and Totemic Focus for cheaper spells and totems.',
    early: 'Thundering Strikes first. Crits trigger Flurry for faster attacks.',
  },
  'shaman/elemental': {
    main: 'Elemental (32) is a lightning caster: Concussion and Convection for damage and mana, Reverberation for faster shocks, Elemental Alacrity, Call of Thunder and Lightning Overload, Elemental Fury for crits, down to Lightning Mastery for burst.',
    second: 'Restoration (14) adds Tidal Focus, Totemic Focus, Mindfulness and Natural Grace so you can keep casting. Enhancement (5) takes Thundering Strikes.',
    early: 'Concussion and Convection first: more damage per cast for less mana.',
  },
  'shaman/restoration': {
    main: 'Restoration (46) goes very deep for healing: Improved Healing Wave, Tidal Focus, Healing Focus, Restorative Totems, Mana Tide Totem, Nature\'s Swiftness and Purification, down to Riptide.',
    second: 'Enhancement (5) takes Thundering Strikes for crit.',
    early: 'Improved Healing Wave and Tidal Focus first for faster, cheaper heals.',
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
  },
  'warlock/demonology': {
    main: 'Demonology (30) is about your pet and your own toughness: Demonic Embrace for Stamina, Unholy Power for pet damage, Fel Vitality, Demonic Energies, Decimation, Soul Link, Demonic Knowledge and Master Demonologist.',
    second: 'Destruction (16) adds Improved Shadow Bolt, Bane for faster casts, Ruin for crit damage and Agonizing Flames. Affliction (5) takes Suppression for hit.',
    early: 'Demonic Embrace first. It makes you much harder to kill.',
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
  },
  'druid/restoration': {
    main: 'Restoration (45) is a heal-over-time healer: Nature\'s Focus so casts cannot be interrupted, Reflection for mana, Gift of Nature, Bloom for extra healing when your heals expire, Swiftmend, Living Spirit, Improved Regrowth and Wild Growth.',
    second: 'Balance (6) takes Genesis for stronger heals over time and Nature\'s Majesty.',
    early: 'Nature\'s Focus and Heart of the Wild first: uninterrupted heals and more Intellect.',
  },
};
