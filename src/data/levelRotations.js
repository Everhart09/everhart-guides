// Rotation stages by character level. Each stage: [startLevel, title, priority steps, tip?].
// `shared` stages apply to every spec of the class (before talents take over); spec stages are merged in by level.
// The level 60 stage comes from each spec's main `rotation` in the class file.

export const LEVEL_ROTATIONS = {
  warrior: {
    shared: [
      [1, 'First steps', ['**Battle Shout** before every pull', '**Charge** to open (level 4)', '**Rend** on targets that can bleed', '**Heroic Strike** when you have spare rage'], 'Pull with a thrown weapon or gun when Charge is on cooldown.'],
      [10, 'Stances & Overpower', ['**Bloodrage** before the pull for free rage', '**Charge** → **Rend**', '**Overpower** whenever the target dodges (12)', '**Hamstring** enemies that run', '**Heroic Strike** above 30 rage'], 'Defensive Stance and Sunder Armor are for tanking groups, not soloing.'],
    ],
    arms: [
      [20, 'Cleave, Slam & Victory Rush', ['**Charge** → **Rend**', '**Overpower** on dodge', '**Victory Rush** after every kill', '**Cleave** with 2+ enemies', '**Execute** below 20% health (24)', '**Heroic Strike** as a rage dump'], 'Retaliation (20) saves you when you pull too many.'],
      [30, 'Berserker Stance & Sweeping Strikes', ['**Sweeping Strikes** when fighting 2 targets', '**Overpower** on dodge', '**Execute** below 20%', '**Intercept** fleeing targets (Berserker Stance)', '**Heroic Strike** above 50 rage'], 'Tactical Mastery keeps your rage when you swap stances.'],
      [36, 'Whirlwind', ['**Whirlwind** on cooldown (Berserker Stance)', '**Overpower** on dodge', '**Execute** below 20%', '**Heroic Strike** above 50 rage'], 'Sweeping Strikes + Whirlwind is your best two-target burst.'],
      [40, 'Mortal Strike', ['**Mortal Strike** on cooldown', '**Whirlwind** on cooldown', '**Overpower** on dodge', '**Execute** below 20%', '**Heroic Strike** above 50 rage'], 'Mortal Strike is your biggest hit and cuts enemy healing.'],
    ],
    fury: [
      [20, 'Dual wielding', ['**Battle Shout** up at all times', '**Charge** → **Rend**', '**Victory Rush** after every kill', '**Cleave** with 2+ enemies', '**Execute** below 20% (24)', '**Heroic Strike** to soak spare rage'], 'Equip two one-handers. Cruelty and Unbridled Wrath make rage flow.'],
      [30, 'Berserker Stance', ['Live in **Berserker Stance**', '**Intercept** to open', '**Berserker Rage** for rage and fear immunity', '**Execute** below 20%', '**Heroic Strike** above 40 rage'], 'Fury is gear-hungry — keep upgrading both weapons.'],
      [36, 'Whirlwind', ['**Whirlwind** on cooldown', '**Execute** below 20%', '**Heroic Strike** above 50 rage', '**Hamstring** as a cheap rage dump'], ''],
      [31, 'Death Wish', ['**Death Wish** on tough fights', '**Whirlwind** on cooldown', '**Execute** below 20%', '**Heroic Strike** above 50 rage'], 'Death Wish makes you immune to Fear — save it for dangerous pulls.'],
      [40, 'Bloodthirst', ['**Bloodthirst** on cooldown', '**Whirlwind** on cooldown', '**Execute** below 20%', '**Heroic Strike** above 60 rage'], 'Bloodthirst also heals you — a big boost to solo sustain.'],
    ],
    protection: [
      [14, 'Learning to tank', ['**Defensive Stance** with a shield', '**Sunder Armor** x3 on the main target', '**Revenge** whenever it lights up', '**Thunder Clap** + **Demoralizing Shout** for packs', '**Taunt** anything that runs off'], 'Solo with a two-hander in Battle Stance; switch to sword-and-board for dungeons.'],
      [20, 'Last Stand', ['**Shield Block** to trigger **Revenge**', '**Revenge** on cooldown', '**Sunder Armor** for threat', '**Heroic Strike** with excess rage'], 'Last Stand → healthstone → Shield Wall (28) is your emergency chain. Vanguard (29) lets you Charge in Defensive Stance.'],
      [30, 'Concussion Blow', ['**Concussion Blow** on cooldown (threat + stun)', '**Revenge**', '**Sunder Armor**', '**Heroic Strike** with excess rage'], ''],
      [40, 'Shield Slam', ['**Shield Slam** on cooldown', '**Revenge** on cooldown', '**Sunder Armor** to 5 stacks', '**Heroic Strike** with excess rage'], 'Shield Slam is your biggest threat button.'],
    ],
  },

  paladin: {
    shared: [
      [1, 'Seal & swing', ['**Seal of Righteousness** active', 'Auto-attack', '**Judgement** on cooldown, then re-seal (4)', '**Holy Light** between pulls'], 'Keep Devotion Aura and Blessing of Might up.'],
      [6, 'Holy Strike', ['**Seal of Righteousness** active', '**Holy Strike** on cooldown', '**Judgement** + re-seal', '**Hammer of Justice** (8) to stop runners or casters'], 'Holy Strike is a new Forever ability — your main melee button.'],
      [10, 'Lay on Hands & Seal of Fury', ['**Seal of Righteousness** (solo) or **Seal of Fury** (tanking)', '**Holy Strike**', '**Judgement** + re-seal', '**Lay on Hands** in emergencies'], ''],
    ],
    retribution: [
      [20, 'Seal of Command', ['**Seal of the Crusader** → **Judgement** to open', '**Seal of Command** for the fight', '**Holy Strike** on cooldown', '**Consecration** with 2+ enemies', '**Exorcism** on undead and demons'], 'Seal of Command loves slow two-handers (3.5+ speed).'],
      [27, 'Sacred Arbiter', ['**Seal of Command** up', '**Holy Strike** — now refreshes your Judgements', '**Judgement** + re-seal', '**Exorcism** on undead/demons'], ''],
      [36, 'Repentance', ['**Seal of Command** + **Holy Strike** + **Judgement**', '**Repentance** to CC an add', '**Divine Shield** (34) → heal when in trouble'], ''],
      [40, 'Twist of Light', ['**Seal of Command** up — swapping seals leaves an Echo', '**Holy Strike** on cooldown', '**Judgement** + re-seal', '**Hammer of Wrath** on low targets (44)'], ''],
    ],
    holy: [
      [20, 'Healing groups', ['**Flash of Light** — efficient filler', '**Holy Light** (down-ranked) for big damage', '**Purify** poisons and diseases', '**Blessing of Wisdom** on yourself'], 'Solo with Seal + Holy Strike + Judgement and heal yourself when needed.'],
      [25, 'Illumination', ['**Holy Light** crits refund mana', '**Flash of Light** filler', '**Consecration** for AoE damage'], ''],
      [30, 'Divine Favor', ['**Divine Favor** + **Holy Light** for a guaranteed big heal', '**Flash of Light** filler', '**Voice of Truth** to heal through interrupts'], ''],
      [33, 'Holy Shock', ['**Holy Shock** for instant heals or damage', '**Flash of Light** filler', '**Holy Light** for big hits'], ''],
      [40, "Light's Vigil", ["**Light's Vigil** on the tank", '**Holy Shock** on the Vigil target to heal their party', '**Flash of Light** / **Holy Light**', '**Cleanse** (42) liberally'], ''],
    ],
    protection: [
      [16, 'Righteous Fury', ['**Righteous Fury** on when grouped', '**Seal of Fury** active', '**Holy Strike** + **Judgement**', '**Retribution Aura** for passive damage'], 'Turn Righteous Fury off when soloing.'],
      [20, 'Consecration tanking', ['**Righteous Fury** + **Seal of Fury**', 'Gather mobs → **Consecration**', '**Holy Strike** the main target', '**Judgement** + re-seal'], 'Consecration is baseline at 20 in Forever.'],
      [30, 'Swift Judgement', ['**Consecration** + **Holy Strike**', '**Judgement**, then **Swift Judgement** for a free second one', "**Templar's Bulwark** (31) for big damage"], ''],
      [40, 'Holy Shield', ['**Holy Shield** always up', '**Holy Strike** — Iron Creed adds threat and damage reduction', '**Consecration** + **Judgement**', "**Templar's Bulwark** emergencies"], ''],
    ],
  },

  hunter: {
    shared: [
      [1, 'Before your pet', ["**Hunter's Mark** (6)", '**Serpent Sting** (4)', '**Arcane Shot** (6)', '**Raptor Strike** in melee'], 'Keep a stack of ammo and stay at range.'],
      [10, 'Pet & Aspect', ['Send your pet first and let it build threat', '**Aspect of the Hawk** on', '**Serpent Sting** + **Arcane Shot**', '**Mend Pet** when it takes damage', '**Wing Clip** (12) if something reaches you'], 'Tame Beast at 10 — cats and boars are great leveling pets.'],
      [18, 'Multi-Shot', ["**Hunter's Mark**", 'Pet attacks', '**Serpent Sting**', '**Arcane Shot** + **Multi-Shot**', '**Freezing Trap** (20) on adds'], 'Aspect of the Cheetah at 20 replaces a mount until 40.'],
      [20, 'Aimed Shot', ["**Hunter's Mark**", '**Aimed Shot** to open (baseline in Forever)', '**Arcane Shot** + **Multi-Shot**', '**Disengage** to make space'], ''],
    ],
    'beast-mastery': [
      [26, 'Rapid Fire', ['Pet attacks, you follow', '**Rapid Fire** on harder mobs', '**Arcane Shot** + **Multi-Shot**', '**Mend Pet** to keep it healthy'], 'Your pet does most of the damage — keep it fed and happy.'],
      [31, 'Intimidation', ['**Intimidation** to stun dangerous targets', '**Arcane Shot** + **Multi-Shot**', '**Serpent Sting** on long fights'], ''],
      [34, 'Summon Hawk', ['**Summon Hawk** on cooldown — boosted by Ferocity and Unleashed Fury', '**Arcane Shot** + **Multi-Shot**', '**Intimidation** to stun'], ''],
      [40, 'Bestial Wrath', ['**Bestial Wrath** for burst', '**Summon Hawk**', '**Rapid Fire**', '**Arcane Shot** + **Multi-Shot**'], 'Bestial Wrath makes your pet immune to CC — great vs players.'],
    ],
    marksmanship: [
      [25, 'Mortal Shots', ['**Aimed Shot** opener', '**Arcane Shot** (Improved Arcane Shot) + **Multi-Shot**', '**Rapid Fire** — Rapid Killing lowers its cooldown'], 'Careful Aim turns your Intellect into attack power.'],
      [30, 'Trueshot Aura', ['**Trueshot Aura** always on', '**Aimed Shot** between Auto Shots', '**Multi-Shot** + **Arcane Shot**', '**Feign Death** (30) to drop threat'], ''],
      [34, 'Scatter Shot', ['**Aimed Shot** + **Multi-Shot**', '**Scatter Shot** → step back → keep shooting', '**Rapid Fire** for burst'], ''],
      [40, 'Sniper Shot', ['**Sniper Shot** to open from long range', '**Aimed Shot** between Auto Shots', '**Multi-Shot** on cooldown', '**Rapid Fire** for burst'], ''],
    ],
    survival: [
      [20, 'Melee hunter', ["**Hunter's Mark**", 'Pet attacks', '**Raptor Strike** when they reach you', '**Mongoose Bite** after dodging', '**Wing Clip** → step back if needed'], 'Survival in Forever fights well in melee range.'],
      [23, 'Deterrence', ['**Deterrence** when melee is on you', '**Raptor Strike** + **Mongoose Bite**', '**Arcane Shot** + **Multi-Shot** at range'], ''],
      [30, 'Counterattack & Aspect of the Beast', ['**Aspect of the Beast** in melee', '**Counterattack** after you parry', '**Raptor Strike** / **Mongoose Bite**'], ''],
      [31, 'Expose Prey', ["Keep **Hunter's Mark** up — your hits proc **Mongoose Bite**", '**Mongoose Bite** whenever it lights up', '**Raptor Strike** on cooldown'], ''],
      [40, 'Lacerating Strikes', ['**Mongoose Bite** — now also causes a bleed', '**Raptor Strike** on cooldown', '**Counterattack** after parries', '**Strider Kick** to stick to runners'], ''],
    ],
  },

  rogue: {
    shared: [
      [1, 'Combo point basics', ['**Sinister Strike** to 3 combo points', '**Eviscerate**', 'Repeat'], 'Stealth up to pick your fights.'],
      [10, 'Slice and Dice', ['**Sinister Strike**', '**Slice and Dice** at 1–2 combo points', '**Sinister Strike** to 5', '**Eviscerate**', '**Kick** casters (12)'], 'Sap (10) lets you split pulls.'],
      [20, 'Poisons', ['Apply poisons to both weapons', '**Slice and Dice** early', '**Sinister Strike** to 5', '**Eviscerate** (or **Rupture** on long fights)', '**Vanish** (22) to escape'], 'Poisons class quest at 20 — Instant Poison is your leveling choice.'],
    ],
    combat: [
      [25, 'Dual Wield Specialization', ['**Slice and Dice** up', '**Sinister Strike** to 5', '**Eviscerate**', '**Kidney Shot** (30) to stop runners'], 'Precision and Dual Wield Specialization make your off-hand count.'],
      [31, 'Blade Flurry', ['**Slice and Dice** up', '**Sinister Strike** to 5', '**Eviscerate**', '**Blade Flurry** with 2 targets'], 'Blade Flurry shreds two mobs at once.'],
      [40, 'Adrenaline Rush', ['**Slice and Dice** up', '**Sinister Strike** to 5', '**Eviscerate**', '**Adrenaline Rush** + **Blade Flurry** together'], 'Hack and Slash rewards axes and swords with extra attacks.'],
    ],
    assassination: [
      [24, 'Dagger openers', ['**Cheap Shot** (26) or **Ambush** from stealth', '**Backstab** from behind', '**Sinister Strike** from the front', '**Eviscerate** at 5'], 'Lethality makes your crits hit very hard.'],
      [26, 'Cold Blood', ['**Slice and Dice** up', '**Backstab**/**Sinister Strike** to 5', '**Cold Blood** → **Eviscerate**', '**Kidney Shot** (30) to lock down'], ''],
      [30, 'Mutilate', ['**Mutilate** to build — two daggers, 2 combo points', '**Slice and Dice** up', '**Eviscerate** at 5', '**Cold Blood** → **Eviscerate** for burst'], 'Mutilate deals extra damage to poisoned targets.'],
      [35, 'Seal Fate', ['**Mutilate** — crits now add extra combo points', '**Slice and Dice** up', '**Eviscerate** at 5'], 'Seal Fate makes crit your best stat.'],
      [40, 'Venom', ['**Venom** finisher up', '**Mutilate** to build', '**Slice and Dice** up', '**Eviscerate** at 5'], 'Venom boosts poison damage by 30% — keep it rolling.'],
    ],
    subtlety: [
      [23, 'Ghostly Strike', ['**Ambush** or **Cheap Shot** (26) to open', '**Ghostly Strike** for extra dodge', '**Sinister Strike** to 5', '**Eviscerate**'], ''],
      [25, 'Premeditation', ['**Premeditation** → **Cheap Shot**', '**Ghostly Strike** / **Sinister Strike** to 5', '**Eviscerate** or **Kidney Shot** (30)'], ''],
      [30, 'Preparation', ['**Premeditation** → **Cheap Shot**', '**Sinister Strike** to 5 → **Kidney Shot**', '**Preparation** to reset Vanish, Sprint and Evasion'], 'Preparation doubles your escape tools.'],
      [31, 'Hemorrhage', ['**Cheap Shot** opener', '**Hemorrhage** to build', '**Rupture** (Serrated Blades) or **Eviscerate** at 5'], 'Hemorrhage works with any weapon — 145% damage with a dagger.'],
      [40, 'Thousand Cuts', ['**Rupture** up — its ticks make **Hemorrhage** cheaper', '**Hemorrhage** to build', '**Eviscerate** / **Kidney Shot** at 5', 'Quietus: Hemorrhage hits harder below 35% health'], ''],
    ],
  },

  priest: {
    shared: [
      [1, 'Smite & wand', ['**Power Word: Fortitude** on', '**Smite** to open', '**Shadow Word: Pain** (4)', 'Wand to finish'], 'Pick up a wand as early as you can.'],
      [6, 'Shields up', ['**Power Word: Shield** before the mob reaches you', '**Shadow Word: Pain**', '**Mind Blast** (10)', 'Wand to finish'], 'Shield stops spell pushback — cast freely behind it.'],
    ],
    shadow: [
      [20, 'Mind Flay & Devouring Plague', ['**Mind Blast** opener', '**Shadow Word: Pain** + **Devouring Plague**', '**Power Word: Shield**', '**Mind Flay** or wand'], 'Every priest gets Devouring Plague at 20 in Forever. Spirit Tap keeps your mana high.'],
      [25, 'Vampiric Embrace', ['**Vampiric Embrace**', '**Mind Blast**', '**Shadow Word: Pain** + **Devouring Plague**', '**Mind Flay**'], 'Vampiric Embrace heals you as you deal damage.'],
      [30, 'Silence', ['DoTs up', '**Mind Blast** on cooldown', '**Mind Flay** filler', '**Silence** casters', '**Shadow Word: Death** (32) to finish'], ''],
      [40, 'Shadowform', ['**Shadowform** on — Shadow spells cost 50% less', '**Shadow Word: Pain** + **Devouring Plague**', '**Mind Blast** on cooldown', '**Mind Flay** filler'], "You can't cast Holy spells in Shadowform — shift out to heal."],
    ],
    holy: [
      [20, 'Flash Heal', ['**Renew** on the tank', '**Flash Heal** for fast heals', '**Heal** for efficiency', '**Power Word: Shield** for spikes'], 'Solo with Smite, Shadow Word: Pain and a wand.'],
      [28, 'Binding Heal & Holy Nova', ['**Binding Heal** when you and an ally are hurt', '**Holy Nova** for group damage', '**Renew** + **Flash Heal**'], ''],
      [30, 'Prayer of Healing', ['**Prayer of Healing** when 3+ party members are hurt', '**Renew** on the tank', '**Heal** for steady healing'], 'Litany of Light (31) rewards alternating heals.'],
      [40, 'Prayer of Mending', ['**Prayer of Mending** on the tank on cooldown', '**Greater Heal** (down-ranked) on the tank', '**Renew**', '**Prayer of Healing** for groups'], ''],
    ],
    discipline: [
      [20, 'Inner Focus', ['**Power Word: Shield** liberally', '**Renew**', '**Flash Heal** / **Heal**', '**Inner Focus** for a free big heal'], 'Twin Disciplines boosts your instant spells.'],
      [30, 'Soul Warding', ['**Power Word: Shield** — shorter cooldown and cheaper', '**Renew**', '**Heal** filler', '**Divine Spirit** on casters'], ''],
      [31, 'Penance', ['**Penance** on cooldown', '**Power Word: Shield** first — Renewed Hope adds crit to heals on shielded targets', '**Flash Heal** / **Heal**'], ''],
      [40, 'Power Infusion', ['**Power Infusion** on your best caster', '**Penance** on cooldown', '**Power Word: Shield**', '**Greater Heal** / **Heal** — crits leave Divine Aegis shields'], ''],
    ],
  },

  shaman: {
    shared: [
      [1, 'Lightning & shocks', ['**Lightning Bolt** to pull', '**Earth Shock** (4)', 'Melee with **Rockbiter Weapon**', '**Healing Wave** between pulls'], ''],
      [10, 'Fire totem', ['**Searing Totem** at the start of fights', '**Flame Shock** or **Earth Shock**', '**Lightning Shield** up', 'Melee or **Lightning Bolt**'], 'Fire Totem class quest at 10.'],
    ],
    enhancement: [
      [20, 'Elemental Weapons', ['Slow two-hander with **Rockbiter Weapon**', '**Searing Totem** + **Strength of Earth Totem**', '**Earth Shock** to finish or interrupt', '**Lightning Shield** up'], 'Mental Dexterity turns your Intellect into attack power.'],
      [25, 'Flurry', ['**Rockbiter Weapon** (or **Windfury Weapon** at 30)', '**Earth Shock** to finish', '**Flame Shock** on tougher mobs'], 'Thundering Strikes crits trigger Flurry.'],
      [30, 'Stormstrike & Windfury', ['**Windfury Weapon** on', '**Stormstrike** on cooldown', '**Earth Shock** right after Stormstrike', '**Reincarnation** saves your life'], ''],
      [35, 'Maelstrom Weapon', ['**Windfury Weapon** on', '**Stormstrike** on cooldown', '**Lightning Bolt** at 5 Maelstrom Weapon stacks', '**Earth Shock** after Stormstrike'], ''],
      [40, 'Rage of the Farseer', ['**Rage of the Farseer** for burst', '**Stormstrike** + **Earth Shock**', '**Lightning Bolt** at 5 Maelstrom stacks'], ''],
    ],
    elemental: [
      [20, 'Lightning caster', ['**Lightning Bolt** to pull', '**Lightning Bolt** again', '**Earth Shock** to finish', '**Searing Totem** on tougher mobs'], 'Elemental Alacrity makes Lightning Bolt much faster.'],
      [30, 'Lightning Overload', ['**Lightning Bolt** — chance for a free second bolt', '**Flame Shock**', '**Earth Shock** to finish', '**Chain Lightning** (32) for packs'], ''],
      [35, 'Elemental Fury', ['**Chain Lightning** to open', '**Lightning Bolt**', '**Earth Shock** to finish'], 'Elemental Fury doubles your crit damage bonus.'],
      [40, 'Lava Burst', ['**Flame Shock**', '**Lava Burst** (hits harder with Flame Shock)', '**Chain Lightning** / **Lightning Bolt**', '**Earth Shock** while moving'], ''],
    ],
    restoration: [
      [20, 'Water Shield', ['**Water Shield** up', '**Healing Wave** for big heals', '**Lesser Healing Wave** for fast heals', 'Drop **Healing Stream Totem** and **Mana Spring Totem** (26)'], 'Solo with Lightning Bolt and shocks.'],
      [33, "Nature's Swiftness", ["**Nature's Swiftness** + **Healing Wave** emergency", '**Healing Wave** on the tank', '**Mana Tide Totem** (34) when the party is low'], ''],
      [40, 'Riptide & Chain Heal', ['**Riptide** on the tank', '**Chain Heal** on the most injured (stronger on Riptide targets)', '**Healing Wave** on the tank'], 'Chain Heal is the best group heal in the game.'],
    ],
  },

  mage: {
    shared: [
      [1, 'Bolts & blasts', ['**Frostbolt** (4) or **Fireball**', '**Fire Blast** to finish (6)', 'Wand when low on mana'], 'Conjure food and water between pulls.'],
      [10, 'Frost Nova', ['**Frostbolt** at max range', '**Frost Nova** when the mob reaches you', 'Step back, **Frostbolt** again', '**Fire Blast** to finish'], 'Polymorph (8) handles extra adds.'],
    ],
    frost: [
      [20, 'Blizzard & AoE', ['Gather a group of mobs', '**Frost Nova**', '**Blizzard** from range', '**Frostbolt** singles'], 'Start AoE grinding once you have Blizzard and Improved Frost Nova.'],
      [25, 'Ice Lance', ['**Frostbolt** spam', '**Frost Nova** → **Ice Lance** (triple damage on frozen targets)', '**Cone of Cold** (26) as they reach you'], ''],
      [32, 'Ice Block & Cold Snap', ['**Frostbolt** spam', '**Frost Nova** → **Ice Lance** / **Frostbolt** (Shatter crits)', '**Ice Block** to reset bad pulls', '**Cold Snap** for a second Frost Nova'], ''],
      [34, 'Fingers of Frost', ['**Frostbolt** — chills can proc Fingers of Frost', '**Ice Lance** twice on a Fingers of Frost proc', '**Frost Nova** → **Ice Lance**'], ''],
      [41, 'Ice Barrier', ['**Ice Barrier** before every pull', '**Frostbolt** (Winter\'s Chill stacks)', '**Ice Lance** on Fingers of Frost / frozen targets', '**Cone of Cold** / **Blizzard** for AoE'], ''],
    ],
    fire: [
      [20, 'Pyroblast', ['**Pyroblast** to open', '**Fireball**', '**Fire Blast** to finish'], 'Fire is mana-hungry — wand when you can.'],
      [28, 'Heating Up', ['**Fireball** — crits speed up your next Pyroblast', '**Pyroblast** when Heating Up has stacked', '**Fire Blast** to finish'], ''],
      [34, 'Blast Wave', ['**Fireball** spam', '**Blast Wave** when mobs close in', '**Fire Blast** to finish', '**Flamestrike** for packs'], ''],
      [40, 'Combustion', ['**Pyroblast** opener', '**Fireball** (or **Frostfire Bolt**)', '**Combustion** for big crits', '**Fire Blast** / **Scorch** while moving'], ''],
    ],
    arcane: [
      [20, 'Clearcasting', ['**Frostbolt** spam', '**Arcane Missiles** on Clearcasting', '**Arcane Explosion** in melee range', '**Fire Blast** to finish'], ''],
      [23, 'Arcane Blast', ['**Arcane Blast** — each cast buffs your next spells', '**Arcane Missiles** on procs', '**Frostbolt** to save mana'], 'Arcane Blast gets more expensive with each stack — let it reset when mana runs low.'],
      [30, 'Presence of Mind', ['**Presence of Mind** → instant big spell', '**Arcane Blast** + **Arcane Missiles**', '**Frostbolt** to save mana'], ''],
      [40, 'Arcane Power', ['**Arcane Power** + **Presence of Mind** for burst', '**Arcane Blast** + **Arcane Missiles**', '**Arcane Explosion** for AoE'], ''],
    ],
  },

  warlock: {
    shared: [
      [1, 'Imp & Shadow Bolt', ['**Imp** casts Firebolt', '**Immolate**', '**Corruption** (4)', '**Shadow Bolt**', 'Wand to finish'], ''],
      [8, 'Bane of Agony & Fear', ['**Bane of Agony** + **Corruption** + **Immolate**', '**Shadow Bolt**', '**Fear** an extra mob', '**Life Tap** (6) for mana'], 'Curse of Agony is called Bane of Agony in Forever.'],
      [10, 'Voidwalker', ['**Voidwalker** tanks', '**Bane of Agony** + **Corruption**', '**Immolate**', '**Drain Life** (14) or wand', '**Life Tap** for mana'], 'Voidwalker class quest at 10 — your leveling tank.'],
    ],
    affliction: [
      [20, 'DoT everything', ['**Voidwalker** grabs threat', '**Bane of Agony** + **Corruption** (instant)', '**Drain Life** for sustain', '**Fear** extra mobs'], 'Instant Corruption works while moving.'],
      [25, 'Nightfall', ['DoTs up', '**Drain Life**', 'Instant **Shadow Bolt** on Nightfall procs', '**Life Tap** + **Drain Life** cycle'], ''],
      [30, 'Siphon Life', ['**Siphon Life** + **Corruption** + **Bane of Agony**', '**Drain Life** — Soul Siphon makes it stronger per DoT', 'Wand when DoTs are ticking'], ''],
      [40, 'Wrack', ['DoTs up', '**Wrack** — boosts your other DoTs by 10%', '**Drain Life** with all DoTs ticking', '**Death Coil** (42) for emergencies'], ''],
    ],
    demonology: [
      [20, 'Master Summoner', ['Pet attacks', '**Bane of Agony** + **Corruption**', '**Shadow Bolt**', '**Health Funnel** your pet'], 'Demonic Embrace makes you much tankier.'],
      [25, 'Fel Domination', ['Pet tanks, DoTs + **Shadow Bolt**', '**Fel Domination** to resummon fast', '**Demonic Sacrifice** for a big buff when needed'], ''],
      [30, 'Soul Link', ['**Soul Link** always on', 'Pet tanks, DoTs + **Shadow Bolt**', '**Health Funnel** the pet'], 'Felhunter at 30 is great against casters.'],
      [40, 'Demonic Pact', ['**Demonic Sacrifice** your Succubus, then summon another pet — Demonic Pact keeps the buff', '**Soul Link** on', 'DoTs + **Shadow Bolt**'], ''],
    ],
    destruction: [
      [20, 'Ruin', ['**Immolate**', '**Shadow Bolt** spam — Ruin doubles crit damage', '**Life Tap** for mana'], ''],
      [25, 'Shadowburn', ['**Immolate**', '**Shadow Bolt**', '**Shadowburn** to finish'], ''],
      [29, 'Conflagrate', ['**Immolate** → **Conflagrate**', '**Shadow Bolt** spam', '**Shadowburn** to finish'], 'Conflagrate consumes Immolate — reapply it right after.'],
      [40, 'Incinerate', ['**Bane of Havoc** on a second target when cleaving', '**Immolate** → **Conflagrate** (Shadow and Flame: +10% Shadow damage)', '**Shadow Bolt** / **Incinerate**', '**Shadowburn** to finish'], ''],
    ],
  },

  druid: {
    shared: [
      [1, 'Caster basics', ['**Wrath** to pull', '**Moonfire** (4)', 'Melee or wand to finish', '**Rejuvenation** / **Healing Touch** between pulls'], ''],
    ],
    feral: [
      [10, 'Bear Form', ['**Wrath** to pull', 'Shift to **Bear Form**', '**Demoralizing Roar**', '**Maul** spam', 'Shift out to heal'], 'Bear Form class quest at 10.'],
      [20, 'Cat Form', ['**Prowl** → **Rake** (24) or **Claw**', '**Claw** to 3–5 combo points', '**Rip** on long fights', 'Shift to **Bear Form** if things go wrong'], 'Omen of Clarity is baseline at 20 in Forever.'],
      [30, 'Leader of the Pack', ['**Prowl** → **Shred** from behind or **Claw**', '**Rip** / **Ferocious Bite** (32) at 5', '**Faerie Fire** to pull runners'], 'Travel Form at 30 replaces a mount.'],
      [33, 'Primal Bite', ['Bear: **Primal Bite** for big threat', 'Cat: **Shred** / **Claw** to 5', '**Rip** + **Rake** bleeds (Rend and Tear at 35)'], ''],
      [40, 'Berserk', ['**Berserk** — Primal Bite hits 3 targets with no cooldown', 'Keep **Rake** and **Rip** up', '**Shifting Power** for energy', '**Dire Bear Form** for tanking'], ''],
    ],
    balance: [
      [8, 'Roots & Wrath', ['**Entangling Roots** on melee mobs', '**Wrath** from range', '**Moonfire** while moving'], ''],
      [20, 'Starfire', ['**Moonfire**', '**Starfire** for big hits', '**Wrath** filler'], ''],
      [25, 'Vengeance crits', ['**Moonfire**', '**Starfire** — Vengeance doubles crit damage', '**Wrath** filler'], ''],
      [31, 'Eclipse', ['**Moonfire** + **Insect Swarm** (30)', '**Wrath** to build Eclipse charges', '**Starfire** with Eclipse charges'], ''],
      [40, 'Moonkin Form', ['**Moonkin Form** on', '**Moonfire** + **Insect Swarm**', '**Wrath** → **Starfire** (Eclipse)', '**Hurricane** for packs'], "You can't heal in Moonkin Form."],
    ],
    restoration: [
      [12, 'Regrowth', ['**Rejuvenation** on the tank', '**Regrowth** for burst + HoT', '**Healing Touch** for big heals'], 'Solo with Wrath and Moonfire.'],
      [28, 'Swiftmend', ['**Rejuvenation** up', '**Swiftmend** to consume a HoT instantly', '**Healing Touch** / **Regrowth**'], ''],
      [30, "Nature's Swiftness", ["**Nature's Swiftness** + **Healing Touch** emergency", '**Rejuvenation** up', '**Tranquility** for group damage'], ''],
      [40, 'Wild Growth', ['**Wild Growth** on the most damaged group', '**Rejuvenation** + **Swiftmend**', '**Regrowth** (Improved Regrowth crits)', '**Innervate** a healer'], ''],
    ],
  },
};

/** All rotation stages for a spec, in level order, ending with the level-60 rotation from the class file. */
export function rotationStages(cls, spec) {
  const data = LEVEL_ROTATIONS[cls.id] ?? {};
  const stages = [...(data.shared ?? []), ...(data[spec.id] ?? [])]
    .map(([level, title, steps, tip]) => ({ level, title, steps, tip }))
    .sort((a, b) => a.level - b.level);
  stages.push({ level: 60, title: 'Level 60', steps: spec.rotation.single, tip: spec.rotation.notes[0] ?? '' });
  return stages;
}
