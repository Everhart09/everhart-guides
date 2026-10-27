// Races and racials in WoW Forever, and how much each racial is worth to each spec.
//
// Racial names, numbers and text follow the official WoW Forever spell tooltips (Wowhead's Forever database) updated with
// Blizzard's final pre-launch racial pass in the Oct 26 beta notes and its Oct 27 additions (Wowhead's tooltips lag a build
// behind; `source: 'notes'` marks racials that only exist in the notes so far). `changed` says what Blizzard changed late in
// the beta, so players who remember the earlier version can see why it differs. Race/class combinations follow Forever's character creation.
// Forever gives every race two active and two passive racials; the old weapon-skill and resistance racials are gone.
export const RACIALS_AS_OF = 'October 26–27, 2026 beta notes (final pre-launch pass)';

// ── Racials ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// id = Forever spell id. text = the official tooltip (cooldowns included for actives).
export const RACIALS = {
  willToSurvive: { id: 1259718, name: 'Will to Survive', icon: 'spell_shadow_charm', active: true, cd: '3 min', text: 'Instantly removes all Stun effects.' },
  perception: { id: 20600, name: 'Perception', icon: 'spell_nature_sleep', active: true, cd: '3 min', text: 'Dramatically increases stealth detection for 20 sec.' },
  ruthless: { id: 20597, name: 'Ruthless', icon: 'ability_meleedamage', changed: 'Replaced Sword Specialization (Oct 16), then reduced to 1% from 2% (Oct 26).', text: 'Increases your critical strike chance with all spells and attacks by 1%.' },
  humanSpirit: { id: 20598, name: 'The Human Spirit', icon: 'inv_enchant_shardbrilliantsmall', changed: 'Increased to 10% from 5% (Oct 26).', text: 'Spirit increased by 10%.' },

  stoneform: { id: 20594, name: 'Stoneform', icon: 'spell_shadow_unholystrength', active: true, cd: '3 min', text: 'Instantly removes and grants immunity to all Bleed, Poison, and Disease effects, and reduces all Physical damage taken by 10% for 8 sec.' },
  findTreasure: { id: 2481, name: 'Find Treasure', icon: 'racial_dwarf_findtreasure', active: true, changed: 'Now also finds extra items in chests (Oct 16).', text: 'Sense nearby treasure, making it appear on the minimap, with a chance to find additional items in most chests. Lasts until canceled.' },
  artisansPrecision: { name: "Artisan's Precision", icon: 'ability_marksmanship', source: 'notes', changed: 'New (Oct 26). Replaced Earth Fury, which had replaced Mace Specialization on Oct 16.', text: 'Increases hit chance with spells and attacks by 1%.' },
  bigGameHunter: { id: 1259721, name: 'Big Game Hunter', icon: 'inv_weapon_rifle_05', text: 'Damage dealt versus Beasts increased by 5%.' },

  elunesLight: { id: 1259799, name: "Elune's Light", icon: 'spell_nature_moonglow', active: true, cd: '3 min', text: 'Increases your critical strike chance with all spells and attacks by 10% for 15 sec.' },
  shadowmeld: { id: 20580, name: 'Shadowmeld', icon: 'ability_ambush', active: true, cd: '10 sec (2 min in combat)', text: 'Slip into the shadows, reducing the chance for enemies to detect your presence. Lasts until cancelled or upon moving. Using this ability in combat discourages enemies from attacking you, but increases the cooldown to 2 min.' },
  quickness: { id: 20582, name: 'Quickness', icon: 'ability_racial_shadowmeld', changed: 'The run speed now stacks with other speed bonuses (Oct 16).', text: 'Dodge chance increased by 1% and movement speed increased by 2%. Night Elf Rogues and Druids are harder to detect in Stealth as if they were 1 level higher.' },
  wispSpirit: { id: 20585, name: 'Wisp Spirit', icon: 'spell_nature_wispsplode', text: 'Transform into a wisp upon death, increasing movement speed by 75%.' },

  escapeArtist: { id: 20589, name: 'Escape Artist', icon: 'ability_rogue_trip', active: true, cd: '2 min', text: 'Instantly escape the effects of any movement impairing effect and gain immunity to those effects for 3 sec.' },
  eureka: { id: 1259812, name: 'Eureka!', icon: 'inv_gnometoy', active: true, cd: '2 min', changed: 'Now an 8 sec buff instead of 3 charges (Oct 16).', text: 'For 8 sec, your non-periodic spells and abilities cost 10% less Mana, Rage or Energy and deal 10% more damage or healing (Power Word: Shield included).' },
  expansiveMind: { id: 20591, name: 'Expansive Mind', icon: 'inv_enchant_essenceeternallarge', text: 'Maximum Mana, Rage or Energy increased by 5%.' },
  engineeringSpec: { id: 20593, name: 'Engineering Specialization', icon: 'inv_misc_gear_01', text: 'Your gnomish ingenuity reduces the rate of engineering devices failing or backfiring when you use them by 20%.' },

  walkOnAir: { id: 1259416, name: 'Walk on Air', icon: 'inv_elemental_primal_air', active: true, cd: '1.5 min', changed: 'Cooldown reduced to 1.5 min from 2 min (Oct 16).', text: 'Glide downward through the air for 10 sec while controlling your direction of travel.' },
  windBlessed: { id: 1259710, name: 'Wind Blessed', icon: 'inv_misc_volatileair', changed: 'Raised to 3% from 1% (Oct 16), then set to 2% (Oct 26).', text: 'Increases your spellcasting, melee, and ranged Haste by 2%.' },
  elementalInsight: { id: 1259707, name: 'Elemental Insight', icon: 'achievement_raidprimalist_windelemental', text: 'Damage dealt versus Elementals increased by 5%.' },
  readLeyLine: { id: 1259705, name: 'Read Leyline', icon: 'ability_mage_incantersabsorbtion', active: true, cd: '2 min', text: 'Increases your Health and Mana regeneration by 50% for 15 sec (castable while moving). Used at a Ley Line, it also grants Attuned for 1 hour, doubling the bonus to 100%; Attuned persists through death but is removed when you enter a raid. Can\'t be used while Innervate is active.', changed: 'Reworked: 50% for 15 sec, or 100% for an hour once Attuned (Oct 26).' },
  skysight: { id: 1259686, name: 'Skysight', icon: 'ability_skyreach_lens_flare', active: true, cd: '2 min', text: 'Increases your movement speed by 15% for 15 sec (castable while moving). Used at an elemental convergence, it also grants Charged for 1 hour, raising the bonus to 30%; Charged persists through death but is removed when you enter a raid.', changed: 'Reworked: 15% for 15 sec, or 30% for an hour once Charged (Oct 26).' },

  bloodFury: { id: 20572, name: 'Blood Fury', icon: 'racial_orc_berserkerstrength', active: true, cd: '2 min', changed: 'Cooldown raised to 3 min (Oct 16), then back to 2 min (Oct 27).', text: 'Increases Attack Power and Spell Power by 10% for 15 sec.' },
  shatterCurse: { id: 1299026, name: 'Shatter Curse', icon: 'spell_nature_removecurse', active: true, cd: '3 min', text: 'Instantly removes all Curses and Banes, and reduces all Magical damage taken by 5% for 8 sec.', changed: 'No longer grants immunity, and the damage cut went to 5% from 15% (Oct 16).' },
  command: { name: 'Command', icon: 'ability_warrior_warcry', source: 'notes', changed: 'Re-added (Oct 26), replacing Savage, which had replaced Axe Specialization on Oct 16.', text: 'Increases the damage done by Hunter and Warlock pets by 5%.' },
  hardiness: { id: 20573, name: 'Hardiness', icon: 'inv_helmet_23', text: 'Duration of Stun effects on you reduced by 20%.' },

  willOfTheForsaken: { id: 7744, name: 'Will of the Forsaken', icon: 'spell_shadow_raisedead', active: true, cd: '2 min', text: 'Instantly removes all Charm, Fear and Sleep effects.' },
  cannibalize: { id: 20577, name: 'Cannibalize', icon: 'ability_racial_cannibalize', active: true, cd: '2 min', text: 'Regenerates 7% of total Health and 7% of total Mana every 2 sec for 10 sec. Only works on Humanoid or Undead corpses within 5 yds. Any movement, action, or damage taken cancels it.' },
  underwaterBreathing: { id: 5227, name: 'Underwater Breathing', icon: 'spell_shadow_demonbreath', text: 'Underwater breath lasts 300% longer than normal.' },
  touchOfTheGrave: { id: 1260189, name: 'Touch of the Grave', icon: 'spell_shadow_fingerofdeath', text: 'Your spells and attacks can drain Health from the target, up to 5% of your maximum Health: a 30% chance for casters and 20% for Paladins, Rogues and Warriors, with a 15 sec cooldown.', changed: 'Proc chance raised and given a cooldown (Oct 16); cooldown cut to 15 sec from 25 sec (Oct 27).' },

  warStomp: { id: 20549, name: 'War Stomp', icon: 'ability_warstomp', active: true, cd: '1.5 min', changed: 'Cooldown reduced to 1.5 min from 2 min (Oct 16).', text: 'Stuns up to 5 enemies within 8 yds for 2 sec (0.5 sec cast).' },
  cultivation: { id: 20552, name: 'Cultivation', icon: 'inv_misc_flower_01', active: true, cd: '15 min', changed: 'Cooldown reduced to 15 min from 60 min (Oct 16).', text: 'Cultivate a nearby herb, growing a duplicate you can harvest without requiring Herbalism skill. Each herb may only be cultivated once.' },
  plainsrunning: { id: 1259918, name: 'Plainsrunning', icon: 'achievement_zone_barrens_01', text: 'Gain 2% increased movement speed every 5 sec spent moving, up to 60%. You must keep moving a minimum distance; taking damage or standing still reduces the effect. Doesn\'t affect mounted speed.', changed: 'Doubled to 2% per stack, up to 60%, and no longer affects mounts (Oct 26).' },
  endurance: { id: 20550, name: 'Endurance', icon: 'spell_nature_unyeildingstamina', text: 'Total Health increased by 5%.', changed: 'Lost its +1% hit (Oct 16) and then its crit bonus (Oct 26): now just 5% Health.' },

  berserking: { id: 20554, name: 'Berserking', icon: 'racial_troll_berserk', active: true, cd: '3 min', text: 'Increases your spellcasting and attack speed by 10% for 15 sec.', changed: 'Duration increased to 15 sec from 10 sec (Oct 27).' },
  rapidRegeneration: { id: 1260270, name: 'Rapid Regeneration', icon: 'ability_racial_regeneratin', active: true, cd: '3 min', text: 'Regenerate 50% of your maximum Health over 6 sec (channeled). Any movement, action, or damage taken cancels it.' },
  beastSlaying: { id: 20557, name: 'Beast Slaying', icon: 'inv_misc_pelt_bear_ruin_02', text: 'Damage dealt versus Beasts increased by 5%.' },
  regeneration: { id: 20555, name: 'Regeneration', icon: 'spell_nature_regenerate', text: 'Health regeneration rate increased by 20%. In addition, 20% of total Health regeneration continues during combat.', changed: 'Doubled to 20% from 10% (Oct 16).' },
};

// ── Races ───────────────────────────────────────────────────────────────────────────────────────────────────────────
// side: 'A' Alliance or 'H' Horde. newClasses: combinations new in Forever. Skyborne pick a faction at creation, and the
// two sides differ in one racial and one class (High Order can be Mages, Windshapers can be Shamans).
export const RACES = [
  { id: 'human', name: 'Human', side: 'A', racials: ['willToSurvive', 'perception', 'ruthless', 'humanSpirit'],
    classes: ['hunter', 'mage', 'paladin', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['hunter'],
    blurb: 'Stormwind\'s versatile humans. Will to Survive is the best stun break in the game, plus a little crit and extra Spirit for everyone.' },
  { id: 'dwarf', name: 'Dwarf', side: 'A', racials: ['stoneform', 'findTreasure', 'artisansPrecision', 'bigGameHunter'],
    classes: ['hunter', 'paladin', 'priest', 'rogue', 'shaman', 'warrior'], newClasses: ['shaman'],
    blurb: 'Ironforge\'s sturdy dwarves, and the only Alliance Shamans. Stoneform is a cleanse and a damage cut in one button, and Artisan\'s Precision adds 1% hit.' },
  { id: 'nightelf', name: 'Night Elf', side: 'A', racials: ['elunesLight', 'shadowmeld', 'quickness', 'wispSpirit'],
    classes: ['druid', 'hunter', 'priest', 'rogue', 'warrior'], newClasses: [],
    blurb: 'Teldrassil\'s night elves. Elune\'s Light (+10% crit for 15 sec) is one of the strongest offensive racials in Forever.' },
  { id: 'gnome', name: 'Gnome', side: 'A', racials: ['escapeArtist', 'eureka', 'expansiveMind', 'engineeringSpec'],
    classes: ['mage', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['priest'],
    blurb: 'Gnomeregan\'s inventors. Escape Artist frees you from roots and slows, and Eureka! makes your spells and abilities cheaper and stronger for 8 sec.' },
  { id: 'skyborne-ho', name: 'High Order Skyborne', short: 'Skyborne (Alliance)', side: 'A', skyborne: true,
    racials: ['walkOnAir', 'readLeyLine', 'windBlessed', 'elementalInsight'],
    classes: ['druid', 'hunter', 'mage', 'rogue', 'warrior'], newClasses: ['druid', 'hunter', 'mage', 'rogue', 'warrior'],
    blurb: 'Forever\'s new race, on the Alliance side. Always-on haste, bonus damage to elementals and ley-line regeneration. Needs a WoW Forever upgrade pack.' },
  { id: 'orc', name: 'Orc', side: 'H', racials: ['bloodFury', 'shatterCurse', 'command', 'hardiness'],
    classes: ['hunter', 'mage', 'rogue', 'shaman', 'warlock', 'warrior'], newClasses: ['mage'],
    blurb: 'Durotar\'s orcs. Blood Fury (+10% attack and spell power) is a burst for every damage dealer, and Command makes Hunter and Warlock pets hit 5% harder.' },
  { id: 'undead', name: 'Undead', side: 'H', racials: ['willOfTheForsaken', 'cannibalize', 'underwaterBreathing', 'touchOfTheGrave'],
    classes: ['mage', 'paladin', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['paladin'],
    blurb: 'The Forsaken, and the Horde\'s only Paladins in Forever. Will of the Forsaken breaks fears, charms and sleeps.' },
  { id: 'tauren', name: 'Tauren', side: 'H', racials: ['warStomp', 'cultivation', 'plainsrunning', 'endurance'],
    classes: ['druid', 'hunter', 'shaman', 'warrior'], newClasses: [],
    blurb: 'Mulgore\'s tauren. Endurance adds 5% health, War Stomp is an area stun, and Plainsrunning builds up to 60% run speed while traveling.' },
  { id: 'troll', name: 'Troll', side: 'H', racials: ['berserking', 'rapidRegeneration', 'beastSlaying', 'regeneration'],
    classes: ['hunter', 'mage', 'priest', 'rogue', 'shaman', 'warlock', 'warrior'], newClasses: ['warlock'],
    blurb: 'The Darkspear trolls. Berserking (+10% cast and attack speed) and big self-healing for questing.' },
  { id: 'skyborne-ws', name: 'Windshaper Skyborne', short: 'Skyborne (Horde)', side: 'H', skyborne: true,
    racials: ['walkOnAir', 'skysight', 'windBlessed', 'elementalInsight'],
    classes: ['druid', 'hunter', 'rogue', 'shaman', 'warrior'], newClasses: ['druid', 'hunter', 'rogue', 'shaman', 'warrior'],
    blurb: 'Forever\'s new race, on the Horde side. Always-on haste, bonus damage to elementals and a speed blessing. Needs a WoW Forever upgrade pack.' },
];
export const getRace = (id) => RACES.find((r) => r.id === id);
export const racesForClass = (classId) => RACES.filter((r) => r.classes.includes(classId));

// ── How each spec plays, as far as racials care ─────────────────────────────────────────────────────────────────────
// kind: melee | tank | ranged (hunters) | caster | healer. res: mana | rage | energy.
// dots: damage comes mostly from periodic effects (Eureka! only empowers non-periodic spells). stealth: plays from stealth.
export const SPEC_PROFILES = {
  'warrior/arms': { kind: 'melee', res: 'rage' },
  'warrior/fury': { kind: 'melee', res: 'rage' },
  'warrior/protection': { kind: 'tank', res: 'rage' },
  'paladin/retribution': { kind: 'melee', res: 'mana' },
  'paladin/holy': { kind: 'healer', res: 'mana' },
  'paladin/protection': { kind: 'tank', res: 'mana' },
  'hunter/beast-mastery': { kind: 'ranged', res: 'mana', pet: true },
  'hunter/marksmanship': { kind: 'ranged', res: 'mana', pet: true },
  'hunter/survival': { kind: 'ranged', res: 'mana', pet: true },
  'rogue/combat': { kind: 'melee', res: 'energy', stealth: true },
  'rogue/assassination': { kind: 'melee', res: 'energy', stealth: true },
  'rogue/subtlety': { kind: 'melee', res: 'energy', stealth: true },
  'priest/shadow': { kind: 'caster', res: 'mana', dots: true, spirit: true },
  'priest/holy': { kind: 'healer', res: 'mana', spirit: true },
  'priest/discipline': { kind: 'healer', res: 'mana', spirit: true },
  'shaman/enhancement': { kind: 'melee', res: 'mana' },
  'shaman/elemental': { kind: 'caster', res: 'mana' },
  'shaman/restoration': { kind: 'healer', res: 'mana' },
  'mage/frost': { kind: 'caster', res: 'mana' },
  'mage/fire': { kind: 'caster', res: 'mana' },
  'mage/arcane': { kind: 'caster', res: 'mana' },
  'warlock/affliction': { kind: 'caster', res: 'mana', dots: true, pet: true },
  'warlock/demonology': { kind: 'caster', res: 'mana', pet: true },
  'warlock/destruction': { kind: 'caster', res: 'mana', pet: true },
  'druid/feral': { kind: 'melee', also: 'tank', res: 'energy', stealth: true },
  'druid/balance': { kind: 'caster', res: 'mana' },
  'druid/restoration': { kind: 'healer', res: 'mana' },
};

export const MODES = [
  ['pve', 'Dungeons & raids'],
  ['pvp', 'PvP'],
  ['leveling', 'Leveling'],
];
