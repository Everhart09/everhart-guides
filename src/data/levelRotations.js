// Rotation stages by character level.
// Each stage: [startLevel, title, steps, tip?, summary?]
//   steps:   'headline' or ['headline', 'why / when to use it']   (**Ability** = highlighted ability name)
//   tip:     one practical leveling tip for this stage
//   summary: how a typical fight plays out at this stage
// `shared` stages apply to every spec of the class (before talents take over); spec stages are merged in by level.
// The level 60 stage comes from each spec's main `rotation` in the class file.

import { rotationWhy } from './rotationExplain.js';

export const LEVEL_ROTATIONS = {
  warrior: {
    shared: [
      [1, 'First steps', [
        ['**Battle Shout** before every pull', 'A cheap attack power buff that lasts two minutes; refresh it whenever it drops.'],
        ['**Charge** to open (level 4)', 'Closes the gap, stuns briefly and gives you rage to spend straight away.'],
        ['**Rend** on targets that can bleed', 'Free damage over time while you build rage. Skip it on elementals and undead, which are immune.'],
        ['**Heroic Strike** when you have spare rage', 'Replaces your next swing with a harder hit. Only press it when rage is sitting unused.'],
      ], 'Pull with a thrown weapon or gun when Charge is on cooldown.',
      'Warriors start every fight with no rage. Charge in to get some, put Rend on, then spend the rest on Heroic Strike. Expect to eat or bandage between most pulls at these levels.'],
      [10, 'Stances & Overpower', [
        ['**Bloodrage** before the pull', 'Turns a little health into rage, so you start the fight able to use abilities.'],
        ['**Charge** → **Rend**', 'Your standard opener: gap close, rage and a bleed in two buttons.'],
        ['**Overpower** whenever the target dodges (12)', "Can't be dodged, cheap and hits hard. Watch for it lighting up and press it every time."],
        ['**Hamstring** enemies that run', 'Humanoids flee at low health and bring friends back. Slow them so they die first.'],
        ['**Heroic Strike** above 30 rage', 'Keep a little rage in reserve for Overpower, then dump the rest.'],
      ], 'Defensive Stance and Sunder Armor are for tanking groups, not soloing.',
      'You now have tools to control a fight. Open with Bloodrage and Charge, keep Rend up and react to dodges with Overpower. Most of your damage still comes from auto-attacks and Heroic Strike.'],
    ],
    arms: [
      [20, 'Cleave, Slam & Victory Rush', [
        ['**Charge** → **Rend**', 'Same opener as before; it still gives you the rage you need to start.'],
        ['**Overpower** on dodge', 'Still one of your most efficient hits; Arms talents make it crit more often.'],
        ['**Victory Rush** after every kill', 'A free, hard-hitting attack that also heals you. Use it on the next mob while it is available.'],
        ['**Cleave** with 2+ enemies', 'Hits a second target for the cost of a Heroic Strike, so it is strictly better on two mobs.'],
        ['**Execute** below 20% health (24)', 'Converts all your rage into one big hit. Nothing finishes a mob faster.'],
        ['**Heroic Strike** as a rage dump', 'Use leftover rage on single targets so it never sits capped at 100.'],
      ], 'Retaliation (20) saves you when you pull too many.',
      'Arms is built around a slow two-hander and big single hits. Victory Rush keeps your health up between pulls, so you can chain mobs with less resting than other warriors.'],
      [30, 'Berserker Stance & Sweeping Strikes', [
        ['**Sweeping Strikes** when fighting 2 targets', 'Your next few attacks also hit a nearby enemy, effectively doubling your damage on pairs.'],
        ['**Overpower** on dodge', 'Remember it needs Battle Stance; Tactical Mastery lets you swap without losing all your rage.'],
        ['**Execute** below 20%', 'Still your finisher; save rage for it as the mob gets low.'],
        ['**Intercept** fleeing targets (Berserker Stance)', 'A charge you can use mid-fight to catch runners or interrupt casters.'],
        ['**Heroic Strike** above 50 rage', 'Your hits now cost more, so keep a bigger rage buffer before dumping.'],
      ], 'Tactical Mastery keeps your rage when you swap stances.',
      'You start dancing between stances: Battle for Overpower and Sweeping Strikes, Berserker for Intercept and later Whirlwind. Pull two mobs at a time when Sweeping Strikes is ready.'],
      [36, 'Whirlwind', [
        ['**Whirlwind** on cooldown (Berserker Stance)', 'Hits everything around you with your weapon; great on one target and devastating on several.'],
        ['**Overpower** on dodge', 'Swap back to Battle Stance for it when it lights up.'],
        ['**Execute** below 20%', 'Finish targets quickly so you can move on.'],
        ['**Heroic Strike** above 50 rage', 'Dump excess rage once your cooldowns are used.'],
      ], 'Sweeping Strikes + Whirlwind is your best two-target burst.',
      'Whirlwind becomes your main button. Fight from Berserker Stance, press Whirlwind whenever it is ready and fill with Heroic Strike. Sweeping Strikes into Whirlwind kills pairs of mobs fast.'],
      [40, 'Mortal Strike', [
        ['**Mortal Strike** on cooldown', 'Your biggest hit, and it reduces healing on the target by 50%, which matters a lot against players.'],
        ['**Whirlwind** on cooldown', 'Weave it between Mortal Strikes for steady damage.'],
        ['**Overpower** on dodge', 'Still worth a stance swap when you have the rage.'],
        ['**Execute** below 20%', 'Use it instead of Mortal Strike once the target is low.'],
        ['**Heroic Strike** above 50 rage', 'Only when Mortal Strike and Whirlwind are both on cooldown.'],
      ], 'Mortal Strike is your biggest hit and cuts enemy healing.',
      'This is the Arms rotation you will use at 60: Mortal Strike and Whirlwind on cooldown, Overpower when it appears, Execute to finish. Plate armor at 40 makes you noticeably sturdier.'],
    ],
    fury: [
      [20, 'Dual wielding', [
        ['**Battle Shout** up at all times', 'More attack power on both weapons; never let it drop.'],
        ['**Charge** → **Rend**', 'Opener for rage, then switch to steady auto-attacks.'],
        ['**Victory Rush** after every kill', 'Free damage and healing that keeps you going between pulls.'],
        ['**Cleave** with 2+ enemies', 'Better than Heroic Strike whenever a second mob is nearby.'],
        ['**Execute** below 20% (24)', 'Fury builds rage quickly, so Executes hit very hard.'],
        ['**Heroic Strike** to soak spare rage', 'Two weapons generate a lot of rage; keep spending it.'],
      ], 'Equip two one-handers. Cruelty and Unbridled Wrath make rage flow.',
      'Fury fights with a weapon in each hand. Lots of fast hits mean lots of rage, which you pour into Heroic Strike and Cleave. It is gear-hungry, so upgrade weapons whenever you can.'],
      [30, 'Berserker Stance', [
        ['Live in **Berserker Stance**', 'More crit chance in exchange for taking a little more damage. Fury rarely leaves it.'],
        ['**Intercept** to open', 'Your Berserker Stance charge: it stuns and starts the fight.'],
        ['**Berserker Rage** for rage and fear immunity', 'Use it on cooldown for rage, or save it to break fears.'],
        ['**Execute** below 20%', 'Still your finisher.'],
        ['**Heroic Strike** above 40 rage', 'Keep spending, but leave enough for Execute.'],
      ], 'Fury is gear-hungry — keep upgrading both weapons.',
      'You now fight entirely from Berserker Stance, opening with Intercept instead of Charge. Your damage comes from constant auto-attacks and spending rage as fast as it arrives.'],
      [31, 'Death Wish', [
        ['**Death Wish** on tough fights', 'More damage for 30 seconds and immunity to fear. Save it for elites and dangerous pulls.'],
        ['**Whirlwind** on cooldown', 'Your best damage per rage once you have it.'],
        ['**Execute** below 20%', 'Finish quickly to keep moving.'],
        ['**Heroic Strike** above 50 rage', 'Dump rage between cooldowns.'],
      ], 'Death Wish makes you immune to Fear — save it for dangerous pulls.',
      'Death Wish is your big cooldown. Pop it when a fight would otherwise go badly, like elite quest mobs or accidental double pulls.'],
      [36, 'Whirlwind', [
        ['**Whirlwind** on cooldown', 'Hits every enemy around you; strong on single targets too.'],
        ['**Execute** below 20%', 'Use your rage on Execute as soon as it is available.'],
        ['**Heroic Strike** above 50 rage', 'Fill with Heroic Strike between Whirlwinds.'],
        ['**Hamstring** as a cheap rage dump', 'Low cost, slows the target and can trigger weapon procs.'],
      ], '',
      'Whirlwind on cooldown with Heroic Strike in between is your core loop. You can start pulling two or three mobs at once.'],
      [40, 'Bloodthirst', [
        ['**Bloodthirst** on cooldown', 'A strong instant attack that also heals you over the next few hits.'],
        ['**Whirlwind** on cooldown', 'Use it whenever Bloodthirst is on cooldown.'],
        ['**Execute** below 20%', 'Swap to Execute as targets get low.'],
        ['**Heroic Strike** above 60 rage', 'Your abilities cost more now, so keep a larger buffer.'],
      ], 'Bloodthirst also heals you — a big boost to solo sustain.',
      'This is the Fury rotation you will use at 60: Bloodthirst, then Whirlwind, with Heroic Strike soaking extra rage. Bloodthirst healing means much less downtime between pulls.'],
    ],
    protection: [
      [14, 'Learning to tank', [
        ['**Defensive Stance** with a shield', 'You take less damage and generate extra threat. This is your tanking stance.'],
        ['**Sunder Armor** x3 on the main target', 'Builds a lot of threat and lowers the target\'s armor so your group hits harder.'],
        ['**Revenge** whenever it lights up', 'Cheap, high-threat and lights up after you block, dodge or parry.'],
        ['**Thunder Clap** + **Demoralizing Shout** for packs', 'Spread threat across every mob and reduce the damage they deal to you.'],
        ['**Taunt** anything that runs off', 'Pulls a mob back onto you if it starts attacking a healer or DPS.'],
      ], 'Solo with a two-hander in Battle Stance; switch to sword-and-board for dungeons.',
      'Protection is a dungeon spec. When questing alone, fight like any warrior. In groups, hold every mob with Thunder Clap and Demoralizing Shout, then build threat on the kill target with Sunder Armor and Revenge.'],
      [20, 'Last Stand', [
        ['**Shield Block** to trigger **Revenge**', 'Guaranteed blocks mean Revenge is ready more often.'],
        ['**Revenge** on cooldown', 'Your most rage-efficient threat button.'],
        ['**Sunder Armor** for threat', 'Fill with Sunders on the main target.'],
        ['**Heroic Strike** with excess rage', 'Extra threat when you have rage to spare.'],
      ], 'Last Stand → healthstone → Shield Wall (28) is your emergency chain. Vanguard (29) lets you Charge in Defensive Stance.',
      'You now have real emergency buttons. Use Last Stand for a quick burst of health when a pull goes wrong, and keep Shield Block rolling so Revenge is always available.'],
      [30, 'Concussion Blow', [
        ['**Concussion Blow** on cooldown', 'A stun with a lot of threat attached. Also handy for stopping casters.'],
        ['**Revenge**', 'Still your best threat per rage.'],
        ['**Sunder Armor**', 'Keep stacking it on the main target.'],
        ['**Heroic Strike** with excess rage', 'Only when everything else is on cooldown.'],
      ], '',
      'Concussion Blow adds a big threat hit and a stun to your rotation. Use the stun to stop dangerous casts, not just for threat.'],
      [40, 'Shield Slam', [
        ['**Shield Slam** on cooldown', 'Your biggest threat button, and it can remove a magic buff from the enemy.'],
        ['**Revenge** on cooldown', 'Press it whenever it lights up.'],
        ['**Sunder Armor** to 5 stacks', 'Full Sunder stacks maximize your group\'s damage.'],
        ['**Heroic Strike** with excess rage', 'Spend spare rage on extra threat.'],
      ], 'Shield Slam is your biggest threat button.',
      'This is the Protection rotation you will use at 60: Shield Slam, Revenge and Sunder Armor in that order, with Heroic Strike when rage is high. Thunder Clap and Demoralizing Shout still handle packs.'],
    ],
  },

  paladin: {
    shared: [
      [1, 'Seal & swing', [
        ['**Seal of Righteousness** active', 'Adds Holy damage to every swing. Keep it on at all times.'],
        ['Auto-attack', 'Most of your early damage comes from plain weapon swings with the seal.'],
        ['**Judgement** on cooldown, then re-seal (4)', 'Releases your seal for a burst of damage. Recast the seal straight after.'],
        ['**Holy Light** between pulls', 'Heal yourself instead of eating to cut downtime.'],
      ], 'Keep Devotion Aura and Blessing of Might up.',
      'Paladins fight with a seal active and their weapon. Judge the seal for burst, put it back up, and heal yourself between fights.'],
      [6, 'Holy Strike', [
        ['**Seal of Righteousness** active', 'Always have a seal on.'],
        ['**Holy Strike** on cooldown', 'Your main melee attack in Forever: an instant Holy-damage strike.'],
        ['**Judgement** + re-seal', 'Fit it in whenever it is off cooldown.'],
        ['**Hammer of Justice** (8) to stop runners or casters', 'A stun that interrupts casts and keeps fleeing mobs from bringing friends.'],
      ], 'Holy Strike is a new Forever ability — your main melee button.',
      'Holy Strike gives you a proper rotation: seal up, Holy Strike and Judgement on cooldown, and Hammer of Justice to control dangerous mobs.'],
      [10, 'Lay on Hands & Seal of Fury', [
        ['**Seal of Righteousness** (solo) or **Seal of Fury** (tanking)', 'Righteousness for damage; Fury when you need to hold threat in a group.'],
        ['**Holy Strike**', 'Keep using it on cooldown.'],
        ['**Judgement** + re-seal', 'Judge, then put the seal straight back.'],
        ['**Lay on Hands** in emergencies', 'Fully heals you. It has a very long cooldown, so save it for real emergencies.'],
      ], '',
      'You now have a full heal for emergencies and a tanking seal for dungeons. Solo play stays the same: seal, Holy Strike, Judgement.'],
    ],
    retribution: [
      [20, 'Seal of Command', [
        ['**Seal of the Crusader** → **Judgement** to open', 'Judging Crusader increases Holy damage the target takes for the whole fight.'],
        ['**Seal of Command** for the fight', 'Your hits have a chance to deal a big extra Holy strike; best with slow weapons.'],
        ['**Holy Strike** on cooldown', 'Steady extra damage between swings.'],
        ['**Consecration** with 2+ enemies', 'Burns everything standing in it; worth the mana on packs.'],
        ['**Exorcism** on undead and demons', 'A large instant hit that only works on those creature types.'],
      ], 'Seal of Command loves slow two-handers (3.5+ speed).',
      'Retribution is about big, slow weapon hits. Judge Crusader to open, switch to Seal of Command and let your two-hander do the work, with Holy Strike in between.'],
      [27, 'Sacred Arbiter', [
        ['**Seal of Command** up', 'Keep your damage seal active.'],
        ['**Holy Strike** — now refreshes your Judgements', 'With Sacred Arbiter, Holy Strike keeps your Judgement effects going.'],
        ['**Judgement** + re-seal', 'Judge on cooldown and reseal.'],
        ['**Exorcism** on undead/demons', 'Free extra damage on the right targets.'],
      ], '',
      'Sacred Arbiter ties Holy Strike and Judgement together, so pressing Holy Strike on cooldown matters even more.'],
      [36, 'Repentance', [
        ['**Seal of Command** + **Holy Strike** + **Judgement**', 'Your core damage loop.'],
        ['**Repentance** to CC an add', 'Incapacitates a humanoid for up to a minute so you can fight one at a time.'],
        ['**Divine Shield** (34) → heal when in trouble', 'Bubble makes you immune to damage; heal yourself to full inside it.'],
      ], '',
      'You can now handle bad pulls: Repentance takes an extra mob out of the fight, and Divine Shield lets you heal up safely.'],
      [40, 'Twist of Light', [
        ['**Seal of Command** up — swapping seals leaves an Echo', 'With Twist of Light, changing seals leaves a lingering effect of the old one.'],
        ['**Holy Strike** on cooldown', 'Still a core button.'],
        ['**Judgement** + re-seal', 'Judge and reseal, using the Echo for extra damage.'],
        ['**Hammer of Wrath** on low targets (44)', 'A ranged finisher that only works below 20% health.'],
      ], '',
      'Twist of Light rewards swapping seals mid-fight. Keep the core loop going and finish targets with Hammer of Wrath once you learn it.'],
    ],
    holy: [
      [20, 'Healing groups', [
        ['**Flash of Light** — efficient filler', 'Cheap and quick. Use it for most of your healing.'],
        ['**Holy Light** (down-ranked) for big damage', 'Slower and more expensive; save it for big hits on the tank. Lower ranks save mana.'],
        ['**Purify** poisons and diseases', 'Removing a dangerous debuff is often better than healing through it.'],
        ['**Blessing of Wisdom** on yourself', 'Mana regeneration lets you heal longer.'],
      ], 'Solo with Seal + Holy Strike + Judgement and heal yourself when needed.',
      'Holy is a group healer. In dungeons, Flash of Light handles most damage and Holy Light covers spikes. Questing alone, fight like a Retribution paladin and heal yourself.'],
      [25, 'Illumination', [
        ['**Holy Light** crits refund mana', 'Illumination gives mana back when your heals crit, so bigger heals become more efficient.'],
        ['**Flash of Light** filler', 'Still your everyday heal.'],
        ['**Consecration** for AoE damage', 'Helps you solo packs when questing.'],
      ], '',
      'Illumination makes crits refund mana, so Holy Light is more efficient than it looks. You can heal longer before drinking.'],
      [30, 'Divine Favor', [
        ['**Divine Favor** + **Holy Light** for a guaranteed big heal', 'A guaranteed crit for when the tank is about to die.'],
        ['**Flash of Light** filler', 'Your everyday heal.'],
        ['**Voice of Truth** to heal through interrupts', 'Makes your heals harder to push back.'],
      ], '',
      'Divine Favor is your emergency button: a guaranteed crit on your next heal. Everything else stays the same.'],
      [33, 'Holy Shock', [
        ['**Holy Shock** for instant heals or damage', 'Instant, so it works while moving or when the tank needs health right now.'],
        ['**Flash of Light** filler', 'Your efficient everyday heal.'],
        ['**Holy Light** for big hits', 'For large damage spikes.'],
      ], '',
      'Holy Shock gives you an instant heal for emergencies and an instant damage spell when questing.'],
      [40, "Light's Vigil", [
        ["**Light's Vigil** on the tank", 'Marks the tank so your heals on them spread to the rest of the party.'],
        ['**Holy Shock** on the Vigil target to heal their party', 'Heals the whole group through the tank.'],
        ['**Flash of Light** / **Holy Light**', 'Your main heals.'],
        ['**Cleanse** (42) liberally', 'Removes magic as well as poison and disease once you learn it.'],
      ], '',
      "Light's Vigil turns your single-target heals into group healing through the tank. Keep it up and lean on Holy Shock."],
    ],
    protection: [
      [16, 'Righteous Fury', [
        ['**Righteous Fury** on when grouped', 'Greatly increases the threat from your Holy damage. Without it you will not hold mobs.'],
        ['**Seal of Fury** active', 'Your tanking seal; adds threat to every hit.'],
        ['**Holy Strike** + **Judgement**', 'Your main threat buttons on a single target.'],
        ['**Retribution Aura** for passive damage', 'Damages and builds threat on everything that hits you.'],
      ], 'Turn Righteous Fury off when soloing.',
      'Protection tanks by dealing Holy damage with Righteous Fury on. In groups, keep Seal of Fury and Retribution Aura active and spend your cooldowns on the main target.'],
      [20, 'Consecration tanking', [
        ['**Righteous Fury** + **Seal of Fury**', 'Always on when tanking.'],
        ['Gather mobs → **Consecration**', 'Pull the pack together, then drop Consecration under them for threat on every mob.'],
        ['**Holy Strike** the main target', 'Keep the kill target on you.'],
        ['**Judgement** + re-seal', 'Extra threat on cooldown.'],
      ], 'Consecration is baseline at 20 in Forever.',
      'Consecration makes you a real AoE tank: gather the pack, drop it under them, and keep Holy Strike and Judgement on the main target.'],
      [30, 'Swift Judgement', [
        ['**Consecration** + **Holy Strike**', 'Your core AoE and single-target threat.'],
        ['**Judgement**, then **Swift Judgement** for a free second one', 'Two Judgements back to back is a big burst of threat.'],
        ["**Templar's Bulwark** (31) for big damage", 'A defensive cooldown for heavy-hitting pulls.'],
      ], '',
      'Swift Judgement gives you a double Judgement for a burst of threat, useful at the start of every pull.'],
      [40, 'Holy Shield', [
        ['**Holy Shield** always up', 'More block chance, and every block deals Holy damage and threat.'],
        ['**Holy Strike** — Iron Creed adds threat and damage reduction', 'Keep it on cooldown for both threat and survival.'],
        ['**Consecration** + **Judgement**', 'AoE and burst threat.'],
        ["**Templar's Bulwark** emergencies", 'Save it for big damage.'],
      ], '',
      'This is the Protection rotation you will use at 60: Holy Shield always up, Consecration under the pack, and Holy Strike plus Judgement on the main target.'],
    ],
  },

  hunter: {
    shared: [
      [1, 'Before your pet', [
        ["**Hunter's Mark** (6)", 'Marks the target so you deal more ranged damage to it.'],
        ['**Serpent Sting** (4)', 'Poison damage over time; put it on early so it can tick.'],
        ['**Arcane Shot** (6)', 'An instant shot you can fire while the target closes the distance.'],
        ['**Raptor Strike** in melee', 'Once something reaches you, fight back in melee instead of backing away.'],
      ], 'Keep a stack of ammo and stay at range.',
      'Before level 10 you have no pet, so open from range with Serpent Sting and Arcane Shot, then finish in melee with Raptor Strike.'],
      [10, 'Pet & Aspect', [
        ['Send your pet first and let it build threat', 'Give the pet a second or two so the mob stays on it instead of you.'],
        ['**Aspect of the Hawk** on', 'More ranged attack power; your default aspect while fighting.'],
        ['**Serpent Sting** + **Arcane Shot**', 'Your damage while the pet tanks.'],
        ['**Mend Pet** when it takes damage', 'A healthy pet means you rarely need to rest.'],
        ['**Wing Clip** (12) if something reaches you', 'Slows the mob so you can step away and keep shooting.'],
      ], 'Tame Beast at 10 — cats and boars are great leveling pets.',
      'From here the pet tanks and you shoot. Send it in first, let it hold the mob, and keep it healthy with Mend Pet. Hunters have very little downtime.'],
      [18, 'Multi-Shot', [
        ["**Hunter's Mark**", 'Mark the target before you start.'],
        ['Pet attacks', 'Let the pet build threat.'],
        ['**Serpent Sting**', 'Damage over time.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Two instant-ish shots to weave between Auto Shots.'],
        ['**Freezing Trap** (20) on adds', 'Freezes an extra mob so you can deal with one at a time.'],
      ], 'Aspect of the Cheetah at 20 replaces a mount until 40.',
      'Multi-Shot adds more damage to every fight, and Freezing Trap handles the occasional extra mob.'],
      [20, 'Aimed Shot', [
        ["**Hunter's Mark**", 'Always mark first.'],
        ['**Aimed Shot** to open (baseline in Forever)', 'A big hit to start the fight before the pet engages.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Your regular shots.'],
        ['**Disengage** to make space', 'Jump back to get out of melee range.'],
      ], '',
      'Every hunter now opens with Aimed Shot, a strong first hit before the pet arrives. Then it is your usual shot rotation.'],
    ],
    'beast-mastery': [
      [26, 'Rapid Fire', [
        ['Pet attacks, you follow', 'Your pet is the main damage dealer and tank; you support it.'],
        ['**Rapid Fire** on harder mobs', 'Faster shooting for a short time. Use it on elites or big mobs.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Keep your shots going.'],
        ['**Mend Pet** to keep it healthy', 'Your pet doing well is your whole plan.'],
      ], 'Your pet does most of the damage — keep it fed and happy.',
      'Beast Mastery invests in the pet. Keep it fed, happy and healthy, and it will tank and deal most of the damage.'],
      [31, 'Intimidation', [
        ['**Intimidation** to stun dangerous targets', 'Your pet stuns the target and gains a lot of threat.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Your shots between pet attacks.'],
        ['**Serpent Sting** on long fights', 'Worth it when the mob will live long enough.'],
      ], '',
      'Intimidation gives you a stun on demand, great for interrupting casters or pulling a mob back onto the pet.'],
      [34, 'Summon Hawk', [
        ['**Summon Hawk** on cooldown — boosted by Ferocity and Unleashed Fury', 'A Forever ability: a hawk joins the fight and benefits from your pet talents.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Your shots.'],
        ['**Intimidation** to stun', 'Stun dangerous mobs.'],
      ], '',
      'Summon Hawk adds a second attacker for a short time. Use it on cooldown.'],
      [40, 'Bestial Wrath', [
        ['**Bestial Wrath** for burst', 'Your pet hits much harder and cannot be crowd-controlled for a short time.'],
        ['**Summon Hawk**', 'Stack it with Bestial Wrath.'],
        ['**Rapid Fire**', 'Your burst cooldown.'],
        ['**Arcane Shot** + **Multi-Shot**', 'Keep shooting.'],
      ], 'Bestial Wrath makes your pet immune to CC — great vs players.',
      'This is the Beast Mastery setup you will use at 60. Line up Bestial Wrath, Summon Hawk and Rapid Fire on tough targets.'],
    ],
    marksmanship: [
      [25, 'Mortal Shots', [
        ['**Aimed Shot** opener', 'Start every fight with a big hit.'],
        ['**Arcane Shot** (Improved Arcane Shot) + **Multi-Shot**', 'Shorter cooldowns mean more shots between Auto Shots.'],
        ['**Rapid Fire** — Rapid Killing lowers its cooldown', 'Use it more often thanks to your talents.'],
      ], 'Careful Aim turns your Intellect into attack power.',
      'Marksmanship focuses on your own shots. Open with Aimed Shot, then cycle Arcane Shot and Multi-Shot.'],
      [30, 'Trueshot Aura', [
        ['**Trueshot Aura** always on', 'More attack power for you and your group.'],
        ['**Aimed Shot** between Auto Shots', 'Fit it in without delaying your next Auto Shot.'],
        ['**Multi-Shot** + **Arcane Shot**', 'Your regular shots.'],
        ['**Feign Death** (30) to drop threat', 'Fake your death to drop a mob onto your pet or reset a bad pull.'],
      ], '',
      'Trueshot Aura is permanent extra damage. Feign Death lets you escape mistakes.'],
      [34, 'Scatter Shot', [
        ['**Aimed Shot** + **Multi-Shot**', 'Your main damage.'],
        ['**Scatter Shot** → step back → keep shooting', 'Disorients the target so you can regain range.'],
        ['**Rapid Fire** for burst', 'Use it on harder targets.'],
      ], '',
      'Scatter Shot is your range control: disorient, step back, keep shooting.'],
      [40, 'Sniper Shot', [
        ['**Sniper Shot** to open from long range', 'A Forever ability that opens from extra distance.'],
        ['**Aimed Shot** between Auto Shots', 'Your big hit.'],
        ['**Multi-Shot** on cooldown', 'Steady extra damage.'],
        ['**Rapid Fire** for burst', 'Your cooldown.'],
      ], '',
      'This is the Marksmanship rotation you will use at 60: Sniper Shot to open, then Aimed Shot and Multi-Shot.'],
    ],
    survival: [
      [20, 'Melee hunter', [
        ["**Hunter's Mark**", 'Mark first.'],
        ['Pet attacks', 'The pet holds the mob at first.'],
        ['**Raptor Strike** when they reach you', 'Survival is happy fighting up close.'],
        ['**Mongoose Bite** after dodging', 'Lights up after you dodge; cheap and hard-hitting.'],
        ['**Wing Clip** → step back if needed', 'Slow and reposition when you want range again.'],
      ], 'Survival in Forever fights well in melee range.',
      'Survival in Forever is comfortable in melee. Let mobs come to you and use Raptor Strike and Mongoose Bite alongside your pet.'],
      [23, 'Deterrence', [
        ['**Deterrence** when melee is on you', 'Greatly increases your dodge and parry for a few seconds.'],
        ['**Raptor Strike** + **Mongoose Bite**', 'Your melee damage.'],
        ['**Arcane Shot** + **Multi-Shot** at range', 'Use your shots while mobs approach.'],
      ], '',
      'Deterrence keeps you alive when several mobs are hitting you.'],
      [30, 'Counterattack & Aspect of the Beast', [
        ['**Aspect of the Beast** in melee', 'More attack power while fighting up close.'],
        ['**Counterattack** after you parry', 'A free strike that also roots the target.'],
        ['**Raptor Strike** / **Mongoose Bite**', 'Your core melee damage.'],
      ], '',
      'Survival commits to melee: Aspect of the Beast on, and react to parries with Counterattack.'],
      [31, 'Expose Prey', [
        ["Keep **Hunter's Mark** up — your hits proc **Mongoose Bite**", 'With Expose Prey, marked targets let you use Mongoose Bite more often.'],
        ['**Mongoose Bite** whenever it lights up', 'Your best attack.'],
        ['**Raptor Strike** on cooldown', 'Fill between Bites.'],
      ], '',
      "Expose Prey ties Hunter's Mark to Mongoose Bite, so marking targets matters even in melee."],
      [40, 'Lacerating Strikes', [
        ['**Mongoose Bite** — now also causes a bleed', 'Your best attack gains damage over time.'],
        ['**Raptor Strike** on cooldown', 'Steady damage.'],
        ['**Counterattack** after parries', 'Free damage.'],
        ['**Strider Kick** to stick to runners', 'A Forever ability for chasing targets.'],
      ], '',
      'This is the Survival setup you will use at 60: Mongoose Bite bleeds, Raptor Strike filler and Counterattack on parries.'],
    ],
  },

  rogue: {
    shared: [
      [1, 'Combo point basics', [
        ['**Sinister Strike** to 3 combo points', 'Each Sinister Strike adds a combo point. Three is enough to finish most low-level mobs.'],
        ['**Eviscerate**', 'Spends all your combo points for one big hit. More points means more damage.'],
        ['Repeat', 'Build points with Sinister Strike, spend them with Eviscerate. That is the whole rogue loop.'],
      ], 'Stealth up to pick your fights.',
      'Rogues build combo points and then spend them. Open from Stealth so you choose when fights start, Sinister Strike up to three points and finish with Eviscerate.'],
      [10, 'Slice and Dice', [
        ['**Sinister Strike**', 'Build your first point or two.'],
        ['**Slice and Dice** at 1–2 combo points', 'Faster attacks for the whole fight; cheap to apply early.'],
        ['**Sinister Strike** to 5', 'Build back up to a full set of points.'],
        ['**Eviscerate**', 'Finish with a five-point Eviscerate.'],
        ['**Kick** casters (12)', 'Interrupts a spell so casters cannot heal or nuke you.'],
      ], 'Sap (10) lets you split pulls.',
      'Slice and Dice is now part of every fight: a short one early, then build to five points for Eviscerate. Kick anything that casts.'],
      [20, 'Poisons', [
        ['Apply poisons to both weapons', 'Instant Poison adds a lot of damage for free. Reapply when it runs out.'],
        ['**Slice and Dice** early', 'Same as before.'],
        ['**Sinister Strike** to 5', 'Build combo points.'],
        ['**Eviscerate** (or **Rupture** on long fights)', 'Rupture deals more over time on mobs that will live a while.'],
        ['**Vanish** (22) to escape', 'Drops you back into Stealth to escape a fight going badly.'],
      ], 'Poisons class quest at 20 — Instant Poison is your leveling choice.',
      'Poisons are a big damage increase. Keep both weapons coated, and use Vanish to escape fights you cannot win.'],
    ],
    combat: [
      [25, 'Dual Wield Specialization', [
        ['**Slice and Dice** up', 'Keep it running the whole fight.'],
        ['**Sinister Strike** to 5', 'Your combo builder.'],
        ['**Eviscerate**', 'Your finisher.'],
        ['**Kidney Shot** (30) to stop runners', 'A finisher that stuns instead of damaging.'],
      ], 'Precision and Dual Wield Specialization make your off-hand count.',
      'Combat is the steady, sturdy leveling rogue. Keep Slice and Dice up and alternate Sinister Strike and Eviscerate.'],
      [31, 'Blade Flurry', [
        ['**Slice and Dice** up', 'Keep it running.'],
        ['**Sinister Strike** to 5', 'Build points.'],
        ['**Eviscerate**', 'Spend them.'],
        ['**Blade Flurry** with 2 targets', 'Every hit also strikes a second nearby enemy.'],
      ], 'Blade Flurry shreds two mobs at once.',
      'Blade Flurry lets you fight two mobs at once, doubling your damage on pairs.'],
      [40, 'Adrenaline Rush', [
        ['**Slice and Dice** up', 'Keep it running.'],
        ['**Sinister Strike** to 5', 'Build points.'],
        ['**Eviscerate**', 'Spend them.'],
        ['**Adrenaline Rush** + **Blade Flurry** together', 'Double energy regeneration plus cleave for a huge burst.'],
      ], 'Hack and Slash rewards axes and swords with extra attacks.',
      'This is the Combat rotation you will use at 60. Stack Adrenaline Rush with Blade Flurry for burst on tough or multiple targets.'],
    ],
    assassination: [
      [24, 'Dagger openers', [
        ['**Cheap Shot** (26) or **Ambush** from stealth', 'Ambush for damage, or Cheap Shot to stun and control the start.'],
        ['**Backstab** from behind', 'Much stronger than Sinister Strike when you are behind the target.'],
        ['**Sinister Strike** from the front', 'Use it when you cannot get behind.'],
        ['**Eviscerate** at 5', 'Finish with a full Eviscerate.'],
      ], 'Lethality makes your crits hit very hard.',
      'Assassination fights with daggers and big openers. Start from Stealth, then Backstab whenever you are behind the target.'],
      [26, 'Cold Blood', [
        ['**Slice and Dice** up', 'Keep it running.'],
        ['**Backstab**/**Sinister Strike** to 5', 'Build points.'],
        ['**Cold Blood** → **Eviscerate**', 'Guarantees a crit on your next attack. Pair it with a big Eviscerate.'],
        ['**Kidney Shot** (30) to lock down', 'Stun a target to stop casts or escapes.'],
      ], '',
      'Cold Blood gives you a guaranteed crit Eviscerate for burst.'],
      [30, 'Mutilate', [
        ['**Mutilate** to build — two daggers, 2 combo points', 'Hits with both daggers and gives two combo points at once.'],
        ['**Slice and Dice** up', 'Keep it running.'],
        ['**Eviscerate** at 5', 'Your finisher.'],
        ['**Cold Blood** → **Eviscerate** for burst', 'Save it for tough targets.'],
      ], 'Mutilate deals extra damage to poisoned targets.',
      'Mutilate replaces Backstab and Sinister Strike as your builder and works from any angle. Two points per press means you reach five quickly.'],
      [35, 'Seal Fate', [
        ['**Mutilate** — crits now add extra combo points', 'Seal Fate gives an extra point on crits, so you often reach five in two presses.'],
        ['**Slice and Dice** up', 'Keep it running.'],
        ['**Eviscerate** at 5', 'Your finisher.'],
      ], 'Seal Fate makes crit your best stat.',
      'Seal Fate turns crits into extra combo points, so crit is now your most valuable stat.'],
      [40, 'Venom', [
        ['**Venom** finisher up', 'A Forever finisher that boosts your poison damage. Keep it running like Slice and Dice.'],
        ['**Mutilate** to build', 'Your builder.'],
        ['**Slice and Dice** up', 'Still keep it running.'],
        ['**Eviscerate** at 5', 'Spend the rest on Eviscerate.'],
      ], 'Venom boosts poison damage by 30% — keep it rolling.',
      'This is the Assassination rotation you will use at 60: keep Venom and Slice and Dice up, build with Mutilate and spend extra points on Eviscerate.'],
    ],
    subtlety: [
      [23, 'Ghostly Strike', [
        ['**Ambush** or **Cheap Shot** (26) to open', 'Open from Stealth.'],
        ['**Ghostly Strike** for extra dodge', 'A combo builder that also makes you dodge more for a few seconds.'],
        ['**Sinister Strike** to 5', 'Build points.'],
        ['**Eviscerate**', 'Spend them.'],
      ], '',
      'Subtlety is the stealth and control spec. Ghostly Strike adds survivability to your rotation.'],
      [25, 'Premeditation', [
        ['**Premeditation** → **Cheap Shot**', 'Two free combo points before the fight starts.'],
        ['**Ghostly Strike** / **Sinister Strike** to 5', 'Build the rest.'],
        ['**Eviscerate** or **Kidney Shot** (30)', 'Damage, or control with a stun.'],
      ], '',
      'Premeditation starts fights with combo points already built, so your first finisher comes very early.'],
      [30, 'Preparation', [
        ['**Premeditation** → **Cheap Shot**', 'Your opener.'],
        ['**Sinister Strike** to 5 → **Kidney Shot**', 'Chain stuns to control the fight.'],
        ['**Preparation** to reset Vanish, Sprint and Evasion', 'Resets your escape cooldowns for a second use.'],
      ], 'Preparation doubles your escape tools.',
      'Preparation resets your defensive cooldowns, giving you a second chance in fights that go wrong.'],
      [31, 'Hemorrhage', [
        ['**Cheap Shot** opener', 'Stun to start.'],
        ['**Hemorrhage** to build', 'Your new builder; it also makes the target take more physical damage.'],
        ['**Rupture** (Serrated Blades) or **Eviscerate** at 5', 'Rupture on long fights, Eviscerate on short ones.'],
      ], 'Hemorrhage works with any weapon — 145% damage with a dagger.',
      'Hemorrhage replaces Sinister Strike as your builder.'],
      [40, 'Thousand Cuts', [
        ['**Rupture** up — its ticks make **Hemorrhage** cheaper', 'A Forever talent synergy: keep Rupture rolling.'],
        ['**Hemorrhage** to build', 'Your builder.'],
        ['**Eviscerate** / **Kidney Shot** at 5', 'Damage or control.'],
        ['Quietus: Hemorrhage hits harder below 35% health', 'Lean on Hemorrhage as the target gets low.'],
      ], '',
      'This is the Subtlety setup you will use at 60: Rupture up so Hemorrhage stays cheap, and finishers for damage or stuns.'],
    ],
  },

  priest: {
    shared: [
      [1, 'Smite & wand', [
        ['**Power Word: Fortitude** on', 'More health; keep it up at all times.'],
        ['**Smite** to open', 'Your starting damage spell.'],
        ['**Shadow Word: Pain** (4)', 'Damage over time; apply it and let it tick.'],
        ['Wand to finish', 'Wands cost no mana. Finishing with one saves a lot of drinking.'],
      ], 'Pick up a wand as early as you can.',
      'Priests level by putting damage over time on a mob and finishing with a wand. Save mana wherever you can.'],
      [6, 'Shields up', [
        ['**Power Word: Shield** before the mob reaches you', 'Absorbs damage and stops your casts being pushed back.'],
        ['**Shadow Word: Pain**', 'Your damage over time.'],
        ['**Mind Blast** (10)', 'Your biggest hit; use it to open or on cooldown.'],
        ['Wand to finish', 'Save mana.'],
      ], 'Shield stops spell pushback — cast freely behind it.',
      'Shield yourself before the mob arrives so you can keep casting while it hits you. Open with Mind Blast when you have it.'],
    ],
    shadow: [
      [20, 'Mind Flay & Devouring Plague', [
        ['**Mind Blast** opener', 'Start with your biggest hit from range.'],
        ['**Shadow Word: Pain** + **Devouring Plague**', 'Two damage-over-time spells; Devouring Plague also heals you.'],
        ['**Power Word: Shield**', 'Cast freely while shielded.'],
        ['**Mind Flay** or wand', 'Mind Flay slows the target; wand when saving mana.'],
      ], 'Every priest gets Devouring Plague at 20 in Forever. Spirit Tap keeps your mana high.',
      'Shadow is the fastest way to level a priest. Open with Mind Blast, put both damage over time spells on, shield yourself and finish with Mind Flay or your wand.'],
      [25, 'Vampiric Embrace', [
        ['**Vampiric Embrace**', 'Heals you for part of your Shadow damage.'],
        ['**Mind Blast**', 'Your big hit.'],
        ['**Shadow Word: Pain** + **Devouring Plague**', 'Your damage over time.'],
        ['**Mind Flay**', 'Your filler.'],
      ], 'Vampiric Embrace heals you as you deal damage.',
      'Vampiric Embrace heals you as you fight, so you rest even less between pulls.'],
      [30, 'Silence', [
        ['DoTs up', 'Keep Shadow Word: Pain and Devouring Plague ticking.'],
        ['**Mind Blast** on cooldown', 'Your big hit.'],
        ['**Mind Flay** filler', 'Fill gaps with it.'],
        ['**Silence** casters', 'Stops casting enemies from healing or nuking you.'],
        ['**Shadow Word: Death** (32) to finish', 'A quick instant finisher.'],
      ], '',
      'Silence handles dangerous casters, and Shadow Word: Death adds an instant finisher.'],
      [40, 'Shadowform', [
        ['**Shadowform** on — Shadow spells cost 50% less', 'Your Shadow spells get cheaper and hit harder, and you take less physical damage.'],
        ['**Shadow Word: Pain** + **Devouring Plague**', 'Your damage over time.'],
        ['**Mind Blast** on cooldown', 'Your big hit.'],
        ['**Mind Flay** filler', 'Your filler.'],
      ], "You can't cast Holy spells in Shadowform — shift out to heal.",
      'This is the Shadow rotation you will use at 60. Stay in Shadowform, keep both damage over time spells up, Mind Blast on cooldown and Mind Flay in between.'],
    ],
    holy: [
      [20, 'Flash Heal', [
        ['**Renew** on the tank', 'Heal over time; keep it rolling during pulls.'],
        ['**Flash Heal** for fast heals', 'Quick but expensive. Use it when health is dropping fast.'],
        ['**Heal** for efficiency', 'Slower but cheaper. Use it for steady damage.'],
        ['**Power Word: Shield** for spikes', 'Instantly absorbs damage when the tank is in trouble.'],
      ], 'Solo with Smite, Shadow Word: Pain and a wand.',
      'Holy is a dedicated healer. In groups, keep Renew on the tank and use Heal for steady damage. Save Flash Heal for emergencies.'],
      [28, 'Binding Heal & Holy Nova', [
        ['**Binding Heal** when you and an ally are hurt', 'Heals you and your target at once.'],
        ['**Holy Nova** for group damage', 'A small heal on everyone near you.'],
        ['**Renew** + **Flash Heal**', 'Your core healing.'],
      ], '',
      'You now have tools for healing yourself and the group at once.'],
      [30, 'Prayer of Healing', [
        ['**Prayer of Healing** when 3+ party members are hurt', 'Heals your whole party; very efficient on group damage.'],
        ['**Renew** on the tank', 'Keep it up.'],
        ['**Heal** for steady healing', 'Your efficient single-target heal.'],
      ], 'Litany of Light (31) rewards alternating heals.',
      'Prayer of Healing handles AoE damage in dungeons.'],
      [40, 'Prayer of Mending', [
        ['**Prayer of Mending** on the tank on cooldown', 'Heals and then bounces to other injured party members.'],
        ['**Greater Heal** (down-ranked) on the tank', 'Big heals for big damage; lower ranks save mana.'],
        ['**Renew**', 'Keep it rolling.'],
        ['**Prayer of Healing** for groups', 'For group damage.'],
      ], '',
      'This is the Holy setup you will use at 60: Prayer of Mending on cooldown, Renew on the tank and Greater Heal for big hits.'],
    ],
    discipline: [
      [20, 'Inner Focus', [
        ['**Power Word: Shield** liberally', 'Prevents damage before it happens; Discipline leans on it heavily.'],
        ['**Renew**', 'Heal over time.'],
        ['**Flash Heal** / **Heal**', 'Fast or efficient heals as needed.'],
        ['**Inner Focus** for a free big heal', 'Your next spell is free and more likely to crit.'],
      ], 'Twin Disciplines boosts your instant spells.',
      'Discipline prevents damage with shields as much as it heals. Shield whoever is taking damage before topping them up.'],
      [30, 'Soul Warding', [
        ['**Power Word: Shield** — shorter cooldown and cheaper', 'You can shield far more often now.'],
        ['**Renew**', 'Heal over time.'],
        ['**Heal** filler', 'Your efficient heal.'],
        ['**Divine Spirit** on casters', 'More Spirit means more mana regen for your group.'],
      ], '',
      'Soul Warding makes Shield your main spell. Use it freely.'],
      [31, 'Penance', [
        ['**Penance** on cooldown', 'A channeled burst of heals (or damage when soloing).'],
        ['**Power Word: Shield** first — Renewed Hope adds crit to heals on shielded targets', 'Shield first, then heal for more crits.'],
        ['**Flash Heal** / **Heal**', 'Your other heals.'],
      ], '',
      'Penance is your new main heal. Shield first, then Penance, for the strongest result.'],
      [40, 'Power Infusion', [
        ['**Power Infusion** on your best caster', 'A big haste and damage boost for another player.'],
        ['**Penance** on cooldown', 'Your main heal.'],
        ['**Power Word: Shield**', 'Prevent damage.'],
        ['**Greater Heal** / **Heal** — crits leave Divine Aegis shields', 'Your heals now leave extra shields when they crit.'],
      ], '',
      'This is the Discipline setup you will use at 60: shields, Penance and Power Infusion to boost your group.'],
    ],
  },

  shaman: {
    shared: [
      [1, 'Lightning & shocks', [
        ['**Lightning Bolt** to pull', 'Start from range with a solid hit.'],
        ['**Earth Shock** (4)', 'An instant hit that also interrupts casts.'],
        ['Melee with **Rockbiter Weapon**', 'More melee damage from your weapon enchant.'],
        ['**Healing Wave** between pulls', 'Heal up instead of eating.'],
      ], '',
      'Shamans mix spells and melee. Pull with Lightning Bolt, then fight up close with your weapon enchant and shocks.'],
      [10, 'Fire totem', [
        ['**Searing Totem** at the start of fights', 'A totem that shoots fire at your target for free damage.'],
        ['**Flame Shock** or **Earth Shock**', 'Flame Shock for damage over time, Earth Shock to interrupt.'],
        ['**Lightning Shield** up', 'Damages anything that hits you.'],
        ['Melee or **Lightning Bolt**', 'Fight in melee or from range.'],
      ], 'Fire Totem class quest at 10.',
      'Totems join the rotation. Drop Searing Totem at the start of each fight for free damage.'],
    ],
    enhancement: [
      [20, 'Elemental Weapons', [
        ['Slow two-hander with **Rockbiter Weapon**', 'Enhancement scales with big, slow weapons.'],
        ['**Searing Totem** + **Strength of Earth Totem**', 'Damage plus more Strength.'],
        ['**Earth Shock** to finish or interrupt', 'Instant damage when needed.'],
        ['**Lightning Shield** up', 'Passive damage.'],
      ], 'Mental Dexterity turns your Intellect into attack power.',
      'Enhancement is a melee shaman. Use a slow two-hander, drop your totems and fight up close.'],
      [25, 'Flurry', [
        ['**Rockbiter Weapon** (or **Windfury Weapon** at 30)', 'Your weapon enchant.'],
        ['**Earth Shock** to finish', 'Instant finisher.'],
        ['**Flame Shock** on tougher mobs', 'Damage over time for longer fights.'],
      ], 'Thundering Strikes crits trigger Flurry.',
      'Flurry speeds up your attacks after crits, so crit chance becomes valuable.'],
      [30, 'Stormstrike & Windfury', [
        ['**Windfury Weapon** on', 'Chance for extra attacks on every swing.'],
        ['**Stormstrike** on cooldown', 'A strong strike that makes your next Nature spells hit harder.'],
        ['**Earth Shock** right after Stormstrike', 'Takes advantage of the Nature damage boost.'],
        ['**Reincarnation** saves your life', 'Resurrect yourself if a fight goes wrong.'],
      ], '',
      'Windfury and Stormstrike are the heart of Enhancement. Stormstrike first, then Earth Shock while the bonus is active.'],
      [35, 'Maelstrom Weapon', [
        ['**Windfury Weapon** on', 'Your weapon enchant.'],
        ['**Stormstrike** on cooldown', 'Your main strike.'],
        ['**Lightning Bolt** at 5 Maelstrom Weapon stacks', 'Five stacks make Lightning Bolt instant.'],
        ['**Earth Shock** after Stormstrike', 'Use the Stormstrike bonus.'],
      ], '',
      'Maelstrom Weapon turns melee hits into instant Lightning Bolts.'],
      [40, 'Rage of the Farseer', [
        ['**Rage of the Farseer** for burst', 'A Forever cooldown for big damage.'],
        ['**Stormstrike** + **Earth Shock**', 'Your core combo.'],
        ['**Lightning Bolt** at 5 Maelstrom stacks', 'Instant bolts.'],
      ], '',
      'This is the Enhancement setup you will use at 60: Stormstrike, Earth Shock, Maelstrom Lightning Bolts and Rage of the Farseer for burst.'],
    ],
    elemental: [
      [20, 'Lightning caster', [
        ['**Lightning Bolt** to pull', 'Open from range.'],
        ['**Lightning Bolt** again', 'Keep casting while the mob approaches.'],
        ['**Earth Shock** to finish', 'An instant finisher as it reaches you.'],
        ['**Searing Totem** on tougher mobs', 'Extra damage.'],
      ], 'Elemental Alacrity makes Lightning Bolt much faster.',
      'Elemental is a ranged caster. Chain Lightning Bolts as the mob approaches, then finish with Earth Shock.'],
      [30, 'Lightning Overload', [
        ['**Lightning Bolt** — chance for a free second bolt', 'Lightning Overload sometimes fires an extra bolt.'],
        ['**Flame Shock**', 'Damage over time.'],
        ['**Earth Shock** to finish', 'Instant finisher.'],
        ['**Chain Lightning** (32) for packs', 'Hits several targets.'],
      ], '',
      'Lightning Overload gives your bolts a chance to fire twice.'],
      [35, 'Elemental Fury', [
        ['**Chain Lightning** to open', 'A big opener that hits several targets.'],
        ['**Lightning Bolt**', 'Your main spell.'],
        ['**Earth Shock** to finish', 'Instant finisher.'],
      ], 'Elemental Fury doubles your crit damage bonus.',
      'Elemental Fury makes your crits hit much harder.'],
      [40, 'Lava Burst', [
        ['**Flame Shock**', 'Apply it first.'],
        ['**Lava Burst** (hits harder with Flame Shock)', 'A big hit that is strongest on targets with Flame Shock.'],
        ['**Chain Lightning** / **Lightning Bolt**', 'Your fillers.'],
        ['**Earth Shock** while moving', 'Instant damage on the move.'],
      ], '',
      'This is the Elemental rotation you will use at 60: Flame Shock, Lava Burst, then Lightning Bolt and Chain Lightning.'],
    ],
    restoration: [
      [20, 'Water Shield', [
        ['**Water Shield** up', 'Returns mana when you are hit.'],
        ['**Healing Wave** for big heals', 'Your strong heal.'],
        ['**Lesser Healing Wave** for fast heals', 'Quick but expensive.'],
        ['Drop **Healing Stream Totem** and **Mana Spring Totem** (26)', 'Passive healing and mana for the group.'],
      ], 'Solo with Lightning Bolt and shocks.',
      'Restoration is a group healer. Keep Water Shield and your totems up, and use Healing Wave for most of your healing.'],
      [33, "Nature's Swiftness", [
        ["**Nature's Swiftness** + **Healing Wave** emergency", 'An instant big heal when someone is about to die.'],
        ['**Healing Wave** on the tank', 'Your main heal.'],
        ['**Mana Tide Totem** (34) when the party is low', 'Restores mana for the whole group.'],
      ], '',
      "Nature's Swiftness gives you an instant big heal for emergencies."],
      [40, 'Riptide & Chain Heal', [
        ['**Riptide** on the tank', 'An instant heal plus heal over time.'],
        ['**Chain Heal** on the most injured (stronger on Riptide targets)', 'Bounces between injured party members.'],
        ['**Healing Wave** on the tank', 'For big single-target damage.'],
      ], 'Chain Heal is the best group heal in the game.',
      'This is the Restoration setup you will use at 60: Riptide on the tank, Chain Heal for group damage and Healing Wave for spikes.'],
    ],
  },

  mage: {
    shared: [
      [1, 'Bolts & blasts', [
        ['**Frostbolt** (4) or **Fireball**', 'Your main damage spells. Frostbolt also slows the target.'],
        ['**Fire Blast** to finish (6)', 'An instant hit to finish a mob.'],
        ['Wand when low on mana', 'Saves mana.'],
      ], 'Conjure food and water between pulls.',
      'Mages kill things before they reach them. Cast from range and finish with Fire Blast.'],
      [10, 'Frost Nova', [
        ['**Frostbolt** at max range', 'Start from as far away as you can.'],
        ['**Frost Nova** when the mob reaches you', 'Freezes nearby enemies in place.'],
        ['Step back, **Frostbolt** again', 'Get back to range and keep casting.'],
        ['**Fire Blast** to finish', 'Instant finisher.'],
      ], 'Polymorph (8) handles extra adds.',
      'Frost Nova lets you kite: freeze the mob, step back and keep casting.'],
    ],
    frost: [
      [20, 'Blizzard & AoE', [
        ['Gather a group of mobs', 'Pull several mobs together.'],
        ['**Frost Nova**', 'Freeze them all.'],
        ['**Blizzard** from range', 'Damages and slows every mob in the area.'],
        ['**Frostbolt** singles', 'For single targets.'],
      ], 'Start AoE grinding once you have Blizzard and Improved Frost Nova.',
      'Frost unlocks AoE grinding: gather mobs, Frost Nova, and Blizzard them down from range.'],
      [25, 'Ice Lance', [
        ['**Frostbolt** spam', 'Your main spell.'],
        ['**Frost Nova** → **Ice Lance** (triple damage on frozen targets)', 'Ice Lance hits much harder on frozen targets.'],
        ['**Cone of Cold** (26) as they reach you', 'A short-range AoE slow.'],
      ], '',
      'Ice Lance rewards freezing targets. Frost Nova, then Ice Lance for big damage.'],
      [32, 'Ice Block & Cold Snap', [
        ['**Frostbolt** spam', 'Your main spell.'],
        ['**Frost Nova** → **Ice Lance** / **Frostbolt** (Shatter crits)', 'Shatter makes frozen targets easier to crit.'],
        ['**Ice Block** to reset bad pulls', 'Immune to damage for a few seconds.'],
        ['**Cold Snap** for a second Frost Nova', 'Resets your Frost cooldowns.'],
      ], '',
      'Ice Block and Cold Snap give you two ways out of a bad pull.'],
      [34, 'Fingers of Frost', [
        ['**Frostbolt** — chills can proc Fingers of Frost', 'Your chills can make the target count as frozen.'],
        ['**Ice Lance** twice on a Fingers of Frost proc', 'Two big Ice Lances.'],
        ['**Frost Nova** → **Ice Lance**', 'Still your core combo.'],
      ], '',
      'Fingers of Frost gives you free Shatter combos.'],
      [41, 'Ice Barrier', [
        ['**Ice Barrier** before every pull', 'Absorbs damage and prevents spell pushback.'],
        ["**Frostbolt** (Winter's Chill stacks)", 'Your main spell.'],
        ['**Ice Lance** on Fingers of Frost / frozen targets', 'Big hits.'],
        ['**Cone of Cold** / **Blizzard** for AoE', 'For packs.'],
      ], '',
      'This is the Frost setup you will use at 60: Ice Barrier, Frostbolt, and Ice Lance on frozen targets.'],
    ],
    fire: [
      [20, 'Pyroblast', [
        ['**Pyroblast** to open', 'A huge, slow opener.'],
        ['**Fireball**', 'Your main spell.'],
        ['**Fire Blast** to finish', 'Instant finisher.'],
      ], 'Fire is mana-hungry — wand when you can.',
      'Fire hits hard but burns mana. Open with Pyroblast, then Fireball.'],
      [28, 'Heating Up', [
        ['**Fireball** — crits speed up your next Pyroblast', 'Heating Up stacks on crits.'],
        ['**Pyroblast** when Heating Up has stacked', 'Faster Pyroblasts.'],
        ['**Fire Blast** to finish', 'Instant finisher.'],
      ], '',
      'Heating Up turns Fireball crits into faster Pyroblasts.'],
      [34, 'Blast Wave', [
        ['**Fireball** spam', 'Your main spell.'],
        ['**Blast Wave** when mobs close in', 'Knocks back and slows nearby enemies.'],
        ['**Fire Blast** to finish', 'Instant finisher.'],
        ['**Flamestrike** for packs', 'AoE damage.'],
      ], '',
      'Blast Wave adds AoE and a knockback.'],
      [40, 'Combustion', [
        ['**Pyroblast** opener', 'Big opener.'],
        ['**Fireball** (or **Frostfire Bolt**)', 'Your main spell.'],
        ['**Combustion** for big crits', 'Increases your fire crit chance.'],
        ['**Fire Blast** / **Scorch** while moving', 'Instant damage.'],
      ], '',
      'This is the Fire setup you will use at 60: Pyroblast to open, Fireball spam and Combustion for burst.'],
    ],
    arcane: [
      [20, 'Clearcasting', [
        ['**Frostbolt** spam', 'Arcane still levels with Frostbolt early.'],
        ['**Arcane Missiles** on Clearcasting', 'Free spell procs.'],
        ['**Arcane Explosion** in melee range', 'AoE damage.'],
        ['**Fire Blast** to finish', 'Instant finisher.'],
      ], '',
      'Arcane builds toward Arcane Blast. Early on, Frostbolt does the work and Clearcasting gives free spells.'],
      [23, 'Arcane Blast', [
        ['**Arcane Blast** — each cast buffs your next spells', 'Stacking damage, but each cast costs more mana.'],
        ['**Arcane Missiles** on procs', 'Use the free procs.'],
        ['**Frostbolt** to save mana', 'Cheaper filler.'],
      ], 'Arcane Blast gets more expensive with each stack — let it reset when mana runs low.',
      'Arcane Blast stacks up your damage but gets more expensive with each stack.'],
      [30, 'Presence of Mind', [
        ['**Presence of Mind** → instant big spell', 'Makes your next spell instant.'],
        ['**Arcane Blast** + **Arcane Missiles**', 'Your core rotation.'],
        ['**Frostbolt** to save mana', 'Cheaper filler.'],
      ], '',
      'Presence of Mind gives you an instant big spell.'],
      [40, 'Arcane Power', [
        ['**Arcane Power** + **Presence of Mind** for burst', 'Big burst damage.'],
        ['**Arcane Blast** + **Arcane Missiles**', 'Your core rotation.'],
        ['**Arcane Explosion** for AoE', 'For packs.'],
      ], '',
      'This is the Arcane setup you will use at 60: Arcane Blast and Missiles, with Arcane Power for burst.'],
    ],
  },

  warlock: {
    shared: [
      [1, 'Imp & Shadow Bolt', [
        ['**Imp** casts Firebolt', 'Your first pet; it shoots fire at your target.'],
        ['**Immolate**', 'Fire damage plus damage over time.'],
        ['**Corruption** (4)', 'Shadow damage over time.'],
        ['**Shadow Bolt**', 'Your main hit.'],
        ['Wand to finish', 'Saves mana.'],
      ], '',
      'Warlocks stack damage over time spells and let them work. Keep the Imp attacking and finish with a wand.'],
      [8, 'Bane of Agony & Fear', [
        ['**Bane of Agony** + **Corruption** + **Immolate**', 'Three damage over time spells. Bane of Agony is Forever\'s Curse of Agony.'],
        ['**Shadow Bolt**', 'Your main hit.'],
        ['**Fear** an extra mob', 'Sends a mob running so you can deal with one at a time.'],
        ['**Life Tap** (6) for mana', 'Turns health into mana.'],
      ], 'Curse of Agony is called Bane of Agony in Forever.',
      'Damage over time spells and Fear are your core. Life Tap turns health into mana so you can keep going.'],
      [10, 'Voidwalker', [
        ['**Voidwalker** tanks', 'Your tank pet; it holds mobs while you cast.'],
        ['**Bane of Agony** + **Corruption**', 'Your damage over time.'],
        ['**Immolate**', 'More damage.'],
        ['**Drain Life** (14) or wand', 'Heals you while dealing damage.'],
        ['**Life Tap** for mana', 'Health into mana.'],
      ], 'Voidwalker class quest at 10 — your leveling tank.',
      'The Voidwalker tanks for you. Send it in, stack your damage over time and Drain Life to heal.'],
    ],
    affliction: [
      [20, 'DoT everything', [
        ['**Voidwalker** grabs threat', 'Your tank.'],
        ['**Bane of Agony** + **Corruption** (instant)', 'Instant Corruption works while moving.'],
        ['**Drain Life** for sustain', 'Keep your health up.'],
        ['**Fear** extra mobs', 'Handle adds.'],
      ], 'Instant Corruption works while moving.',
      'Affliction stacks damage over time on everything and drains life to stay healthy.'],
      [25, 'Nightfall', [
        ['DoTs up', 'Keep them ticking.'],
        ['**Drain Life**', 'Your main channel.'],
        ['Instant **Shadow Bolt** on Nightfall procs', 'Free instant Shadow Bolts.'],
        ['**Life Tap** + **Drain Life** cycle', 'Endless mana and health.'],
      ], '',
      'Nightfall gives you free instant Shadow Bolts while you drain.'],
      [30, 'Siphon Life', [
        ['**Siphon Life** + **Corruption** + **Bane of Agony**', 'More damage over time, plus healing.'],
        ['**Drain Life** — Soul Siphon makes it stronger per DoT', 'More DoTs means stronger drains.'],
        ['Wand when DoTs are ticking', 'Save mana.'],
      ], '',
      'Siphon Life adds more sustain. Your damage over time spells do most of the work.'],
      [40, 'Wrack', [
        ['DoTs up', 'Keep them ticking.'],
        ['**Wrack** — boosts your other DoTs by 10%', 'A Forever ability that strengthens your damage over time.'],
        ['**Drain Life** with all DoTs ticking', 'Your sustain.'],
        ['**Death Coil** (42) for emergencies', 'Fear plus heal.'],
      ], '',
      'This is the Affliction setup you will use at 60: every damage over time spell up, Wrack to boost them and Drain Life for sustain.'],
    ],
    demonology: [
      [20, 'Master Summoner', [
        ['Pet attacks', 'Your pet does the heavy lifting.'],
        ['**Bane of Agony** + **Corruption**', 'Your damage over time.'],
        ['**Shadow Bolt**', 'Your main hit.'],
        ['**Health Funnel** your pet', 'Keep it alive.'],
      ], 'Demonic Embrace makes you much tankier.',
      'Demonology invests in your pet and your own toughness.'],
      [25, 'Fel Domination', [
        ['Pet tanks, DoTs + **Shadow Bolt**', 'Your core rotation.'],
        ['**Fel Domination** to resummon fast', 'Instant pet summon.'],
        ['**Demonic Sacrifice** for a big buff when needed', 'Sacrifice your pet for a strong buff.'],
      ], '',
      'Fel Domination lets you resummon a pet instantly if it dies.'],
      [30, 'Soul Link', [
        ['**Soul Link** always on', 'Shares damage between you and your pet.'],
        ['Pet tanks, DoTs + **Shadow Bolt**', 'Your core rotation.'],
        ['**Health Funnel** the pet', 'Keep it alive.'],
      ], 'Felhunter at 30 is great against casters.',
      'Soul Link makes you and your pet much harder to kill.'],
      [40, 'Demonic Pact', [
        ['**Demonic Sacrifice** your Succubus, then summon another pet — Demonic Pact keeps the buff', 'A Forever synergy: keep the sacrifice buff and a pet.'],
        ['**Soul Link** on', 'Shared damage.'],
        ['DoTs + **Shadow Bolt**', 'Your core rotation.'],
      ], '',
      'This is the Demonology setup you will use at 60: sacrifice a Succubus, summon a new pet and keep Soul Link up.'],
    ],
    destruction: [
      [20, 'Ruin', [
        ['**Immolate**', 'Fire damage over time.'],
        ['**Shadow Bolt** spam — Ruin doubles crit damage', 'Your main damage.'],
        ['**Life Tap** for mana', 'Keep casting.'],
      ], '',
      'Destruction is about big hits. Immolate, then Shadow Bolt spam.'],
      [25, 'Shadowburn', [
        ['**Immolate**', 'Damage over time.'],
        ['**Shadow Bolt**', 'Your main hit.'],
        ['**Shadowburn** to finish', 'An instant finisher.'],
      ], '',
      'Shadowburn gives you an instant finisher.'],
      [29, 'Conflagrate', [
        ['**Immolate** → **Conflagrate**', 'Consumes Immolate for a big instant hit.'],
        ['**Shadow Bolt** spam', 'Your main hit.'],
        ['**Shadowburn** to finish', 'Instant finisher.'],
      ], 'Conflagrate consumes Immolate — reapply it right after.',
      'Conflagrate turns Immolate into a big instant hit.'],
      [40, 'Incinerate', [
        ['**Bane of Havoc** on a second target when cleaving', 'Copies your spells to a second target.'],
        ['**Immolate** → **Conflagrate** (Shadow and Flame: +10% Shadow damage)', 'Your burst combo.'],
        ['**Shadow Bolt** / **Incinerate**', 'Your fillers.'],
        ['**Shadowburn** to finish', 'Instant finisher.'],
      ], '',
      'This is the Destruction setup you will use at 60: Immolate, Conflagrate, then Shadow Bolt or Incinerate.'],
    ],
  },

  druid: {
    shared: [
      [1, 'Caster basics', [
        ['**Wrath** to pull', 'Your starting damage spell.'],
        ['**Moonfire** (4)', 'Instant damage plus damage over time.'],
        ['Melee or wand to finish', 'Saves mana.'],
        ['**Rejuvenation** / **Healing Touch** between pulls', 'Heal up instead of eating.'],
      ], '',
      'Druids start as casters: Wrath to pull, Moonfire, then finish in melee and heal yourself.'],
    ],
    feral: [
      [10, 'Bear Form', [
        ['**Wrath** to pull', 'Pull from range.'],
        ['Shift to **Bear Form**', 'More armor and health; you fight with rage.'],
        ['**Demoralizing Roar**', 'Reduces enemy attack power.'],
        ['**Maul** spam', 'Your main bear attack.'],
        ['Shift out to heal', 'Heal yourself in caster form.'],
      ], 'Bear Form class quest at 10.',
      'Bear Form makes you much sturdier. Pull, shift into bear and Maul.'],
      [20, 'Cat Form', [
        ['**Prowl** → **Rake** (24) or **Claw**', 'Open from stealth.'],
        ['**Claw** to 3–5 combo points', 'Build combo points.'],
        ['**Rip** on long fights', 'Big bleed finisher.'],
        ['Shift to **Bear Form** if things go wrong', 'Switch to bear when you need to survive.'],
      ], 'Omen of Clarity is baseline at 20 in Forever.',
      'Cat Form is your leveling form: stealth, open, build combo points and finish. Switch to bear when you need to survive.'],
      [30, 'Leader of the Pack', [
        ['**Prowl** → **Shred** from behind or **Claw**', 'Shred hits hard from behind.'],
        ['**Rip** / **Ferocious Bite** (32) at 5', 'Your finishers.'],
        ['**Faerie Fire** to pull runners', 'Stops stealth and lets you hit fleeing mobs.'],
      ], 'Travel Form at 30 replaces a mount.',
      'Leader of the Pack adds crit for you and your party. Shred from behind whenever you can.'],
      [33, 'Primal Bite', [
        ['Bear: **Primal Bite** for big threat', 'Forever\'s name for Mangle.'],
        ['Cat: **Shred** / **Claw** to 5', 'Build combo points.'],
        ['**Rip** + **Rake** bleeds (Rend and Tear at 35)', 'Keep bleeds up.'],
      ], '',
      'Primal Bite is your new bear threat button.'],
      [40, 'Berserk', [
        ['**Berserk** — Primal Bite hits 3 targets with no cooldown', 'A big burst for tanking packs.'],
        ['Keep **Rake** and **Rip** up', 'Your bleeds.'],
        ['**Shifting Power** for energy', 'A Forever ability to restore energy.'],
        ['**Dire Bear Form** for tanking', 'Your tanking form.'],
      ], '',
      'This is the Feral setup you will use at 60: bleeds in Cat Form, and Primal Bite with Berserk for tanking.'],
    ],
    balance: [
      [8, 'Roots & Wrath', [
        ['**Entangling Roots** on melee mobs', 'Roots the mob in place so you can keep casting.'],
        ['**Wrath** from range', 'Your main damage.'],
        ['**Moonfire** while moving', 'Instant damage.'],
      ], '',
      'Roots keep mobs at range while you cast.'],
      [20, 'Starfire', [
        ['**Moonfire**', 'Damage over time.'],
        ['**Starfire** for big hits', 'A slow but very strong spell.'],
        ['**Wrath** filler', 'Your quicker spell.'],
      ], '',
      'Starfire is your big hit.'],
      [25, 'Vengeance crits', [
        ['**Moonfire**', 'Damage over time.'],
        ['**Starfire** — Vengeance doubles crit damage', 'Big crits.'],
        ['**Wrath** filler', 'Your quicker spell.'],
      ], '',
      'Vengeance makes your crits hit much harder.'],
      [31, 'Eclipse', [
        ['**Moonfire** + **Insect Swarm** (30)', 'Two damage over time spells.'],
        ['**Wrath** to build Eclipse charges', 'Builds toward Eclipse.'],
        ['**Starfire** with Eclipse charges', 'Eclipse makes Starfire stronger.'],
      ], '',
      'Eclipse links Wrath and Starfire: build charges with Wrath, then spend them on Starfire.'],
      [40, 'Moonkin Form', [
        ['**Moonkin Form** on', 'More armor and crit for your spells.'],
        ['**Moonfire** + **Insect Swarm**', 'Your damage over time.'],
        ['**Wrath** → **Starfire** (Eclipse)', 'Your core cycle.'],
        ['**Hurricane** for packs', 'AoE damage.'],
      ], "You can't heal in Moonkin Form.",
      'This is the Balance setup you will use at 60: Moonkin Form, both damage over time spells and the Eclipse cycle.'],
    ],
    restoration: [
      [12, 'Regrowth', [
        ['**Rejuvenation** on the tank', 'Heal over time.'],
        ['**Regrowth** for burst + HoT', 'A quick heal plus heal over time.'],
        ['**Healing Touch** for big heals', 'Your big heal.'],
      ], 'Solo with Wrath and Moonfire.',
      'Restoration heals mostly with heals over time.'],
      [28, 'Swiftmend', [
        ['**Rejuvenation** up', 'Keep it rolling.'],
        ['**Swiftmend** to consume a HoT instantly', 'An instant big heal.'],
        ['**Healing Touch** / **Regrowth**', 'Your other heals.'],
      ], '',
      'Swiftmend turns a heal over time into an instant heal.'],
      [30, "Nature's Swiftness", [
        ["**Nature's Swiftness** + **Healing Touch** emergency", 'An instant big heal.'],
        ['**Rejuvenation** up', 'Keep it rolling.'],
        ['**Tranquility** for group damage', 'Heals your whole party.'],
      ], '',
      "Nature's Swiftness gives you an instant big heal for emergencies."],
      [40, 'Wild Growth', [
        ['**Wild Growth** on the most damaged group', 'A group heal over time.'],
        ['**Rejuvenation** + **Swiftmend**', 'Your core healing.'],
        ['**Regrowth** (Improved Regrowth crits)', 'Quick heals.'],
        ['**Innervate** a healer', 'Restores a lot of mana.'],
      ], '',
      'This is the Restoration setup you will use at 60: Wild Growth for group healing, heals over time on the tank and Swiftmend for emergencies.'],
    ],
  },
};

/** All rotation stages for a spec, in level order, ending with the level-60 rotation from the class file. */
export function rotationStages(cls, spec) {
  const data = LEVEL_ROTATIONS[cls.id] ?? {};
  const stages = [...(data.shared ?? []), ...(data[spec.id] ?? [])]
    .map(([level, title, steps, tip, summary]) => ({
      level, title, tip, summary,
      steps: steps.map((s) => (Array.isArray(s) ? { text: s[0], why: s[1] } : { text: s, why: '' })),
    }))
    .sort((a, b) => a.level - b.level);
  stages.push({
    level: 60,
    title: 'Level 60',
    steps: spec.rotation.single.map((s) => ({ text: s, why: rotationWhy(cls.id, spec.id, s) })),
    tip: spec.rotation.notes[0] ?? '',
    summary: spec.summary ?? '',
  });
  return stages;
}
