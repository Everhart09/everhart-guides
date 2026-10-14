// Races and racials in WoW Forever, and how much each racial is worth to each spec.
//
// Racial names, numbers and text come from the official WoW Forever spell tooltips (Wowhead's Forever database).
// Race/class combinations follow Blizzard's Forever character creation (Icy Veins' combination table and race guides).
// Forever reworked every race to two active and two passive racials: weapon "skill" racials now give critical strike
// chance while that weapon type is equipped, and the old resistance racials are gone.

// ── Racials ─────────────────────────────────────────────────────────────────────────────────────────────────────────
// id = Forever spell id. text = the official tooltip (cooldowns included for actives).
export const RACIALS = {
  willToSurvive: { id: 1259718, name: 'Will to Survive', icon: 'spell_shadow_charm', active: true, cd: '3 min', text: 'Instantly removes all Stun effects.' },
  perception: { id: 20600, name: 'Perception', icon: 'spell_nature_sleep', active: true, cd: '3 min', text: 'Dramatically increases stealth detection for 20 sec.' },
  swordSpec: { id: 20597, name: 'Sword Specialization', icon: 'ability_meleedamage', text: 'Increases your critical strike chance with all spells and attacks by 2% while you have a sword or two-handed sword equipped.' },
  humanSpirit: { id: 20598, name: 'The Human Spirit', icon: 'inv_enchant_shardbrilliantsmall', text: 'Spirit increased by 5%.' },

  stoneform: { id: 20594, name: 'Stoneform', icon: 'spell_shadow_unholystrength', active: true, cd: '3 min', text: 'Instantly removes and grants immunity to all Bleed, Poison, and Disease effects, and reduces all Physical damage taken by 10% for 8 sec.' },
  findTreasure: { id: 2481, name: 'Find Treasure', icon: 'racial_dwarf_findtreasure', active: true, text: 'Allows the dwarf to sense nearby treasure, making it appear on the minimap. Lasts until canceled.' },
  maceSpec: { id: 1259719, name: 'Mace Specialization', icon: 'inv_hammer_05', text: 'Increases your critical strike chance with all spells and attacks by 1% while you have a mace or two-handed mace equipped.' },
  bigGameHunter: { id: 1259721, name: 'Big Game Hunter', icon: 'inv_weapon_rifle_05', text: 'Damage dealt versus Beasts increased by 5%.' },

  elunesLight: { id: 1259799, name: "Elune's Light", icon: 'spell_nature_moonglow', active: true, cd: '3 min', text: 'Increases your critical strike chance with all spells and attacks by 10% for 15 sec.' },
  shadowmeld: { id: 20580, name: 'Shadowmeld', icon: 'ability_ambush', active: true, cd: '10 sec (2 min in combat)', text: 'Slip into the shadows, reducing the chance for enemies to detect your presence. Lasts until cancelled or upon moving. Using this ability in combat discourages enemies from attacking you, but increases the cooldown to 2 min.' },
  quickness: { id: 20582, name: 'Quickness', icon: 'ability_racial_shadowmeld', text: 'Dodge chance increased by 1% and movement speed increased by 2%. Night Elf Rogues and Druids are harder to detect in Stealth as if they were 1 level higher.' },
  wispSpirit: { id: 20585, name: 'Wisp Spirit', icon: 'spell_nature_wispsplode', text: 'Transform into a wisp upon death, increasing movement speed by 75%.' },

  escapeArtist: { id: 20589, name: 'Escape Artist', icon: 'ability_rogue_trip', active: true, cd: '2 min', text: 'Instantly escape the effects of any movement impairing effect and gain immunity to those effects for 3 sec.' },
  eureka: { id: 1259812, name: 'Eureka!', icon: 'inv_gnometoy', active: true, cd: '2 min', text: 'Your next 3 non-periodic spells or abilities cost 10% less and deal 10% more damage or healing.' },
  expansiveMind: { id: 20591, name: 'Expansive Mind', icon: 'inv_enchant_essenceeternallarge', text: 'Maximum Mana, Rage or Energy increased by 5%.' },
  engineeringSpec: { id: 20593, name: 'Engineering Specialization', icon: 'inv_misc_gear_01', text: 'Your gnomish ingenuity reduces the rate of engineering devices failing or backfiring when you use them by 20%.' },

  walkOnAir: { id: 1259416, name: 'Walk on Air', icon: 'inv_elemental_primal_air', active: true, cd: '2 min', text: 'Glide downward through the air for 10 sec while controlling your direction of travel.' },
  windBlessed: { id: 1259710, name: 'Wind Blessed', icon: 'inv_misc_volatileair', text: 'Increases your spellcasting, melee, and ranged Haste by 1%.' },
  elementalInsight: { id: 1259707, name: 'Elemental Insight', icon: 'achievement_raidprimalist_windelemental', text: 'Damage dealt versus Elementals increased by 5%.' },
  readLeyLine: { id: 1259705, name: 'Read Ley Line', icon: 'ability_mage_incantersabsorbtion', active: true, cd: '2 min', text: 'Tap into the power of a nearby ley line, increasing your Health and Mana regeneration by 100%. Lasts 15 sec if no ley line is nearby, and 15 min if one is found.' },
  skysight: { id: 1259686, name: 'Skysight', icon: 'ability_skyreach_lens_flare', active: true, cd: '2 min', text: 'Draw power from a convergence of elements, increasing your movement and mounted movement speeds by 10%. Lasts 30 sec if no elemental convergence is nearby, longer if one is found.' },

  bloodFury: { id: 20572, name: 'Blood Fury', icon: 'racial_orc_berserkerstrength', active: true, cd: '2 min', text: 'Increases Attack Power and Spell Power by 10% for 15 sec.' },
  shatterCurse: { id: 1299026, name: 'Shatter Curse', icon: 'spell_nature_removecurse', active: true, cd: '3 min', text: 'Instantly removes and grants immunity to all Curses and Banes, and reduces all Magical damage taken by 15% for 8 sec.' },
  axeSpec: { id: 20574, name: 'Axe Specialization', icon: 'inv_axe_02', text: 'Increases your critical strike chance with all spells and abilities by 1% while you have an axe or a two-handed axe equipped.' },
  hardiness: { id: 20573, name: 'Hardiness', icon: 'inv_helmet_23', text: 'Duration of Stun effects on you reduced by 20%.' },

  willOfTheForsaken: { id: 7744, name: 'Will of the Forsaken', icon: 'spell_shadow_raisedead', active: true, cd: '2 min', text: 'Instantly removes all Charm, Fear and Sleep effects.' },
  cannibalize: { id: 20577, name: 'Cannibalize', icon: 'ability_racial_cannibalize', active: true, cd: '2 min', text: 'Regenerates 7% of total Health and 7% of total Mana every 2 sec for 10 sec. Only works on Humanoid or Undead corpses within 5 yds. Any movement, action, or damage taken cancels it.' },
  underwaterBreathing: { id: 5227, name: 'Underwater Breathing', icon: 'spell_shadow_demonbreath', text: 'Underwater breath lasts 300% longer than normal.' },
  touchOfTheGrave: { id: 1260189, name: 'Touch of the Grave', icon: 'spell_shadow_fingerofdeath', text: 'Your spells and attacks have a 5% chance to drain Health from the target, up to 5% of your maximum Health (1 sec cooldown).' },

  warStomp: { id: 20549, name: 'War Stomp', icon: 'ability_warstomp', active: true, cd: '2 min', text: 'Stuns up to 5 enemies within 8 yds for 2 sec (0.5 sec cast).' },
  cultivation: { id: 20552, name: 'Cultivation', icon: 'inv_misc_flower_01', active: true, text: 'Cultivate a nearby herb, growing a duplicate you can harvest without requiring Herbalism skill. Each herb may only be cultivated once.' },
  plainsrunning: { id: 1259918, name: 'Plainsrunning', icon: 'achievement_zone_barrens_01', text: 'Gain 1% increased movement speed every 5 sec spent moving, up to 30%. Taking damage or standing still reduces the effect.' },
  endurance: { id: 20550, name: 'Endurance', icon: 'spell_nature_unyeildingstamina', text: 'Total Health increased by 5% and chance to hit increased by 1%.' },

  berserking: { id: 20554, name: 'Berserking', icon: 'racial_troll_berserk', active: true, cd: '3 min', text: 'Increases your spellcasting and attack speed by 10% for 10 sec.' },
  rapidRegeneration: { id: 1260270, name: 'Rapid Regeneration', icon: 'ability_racial_regeneratin', active: true, cd: '3 min', text: 'Regenerate 50% of your maximum Health over 6 sec (channeled). Any movement, action, or damage taken cancels it.' },
  beastSlaying: { id: 20557, name: 'Beast Slaying', icon: 'inv_misc_pelt_bear_ruin_02', text: 'Damage dealt versus Beasts increased by 5%.' },
  regeneration: { id: 20555, name: 'Regeneration', icon: 'spell_nature_regenerate', text: 'Health regeneration rate increased by 10%. In addition, 10% of total Health regeneration continues during combat.' },
};

// ── Races ───────────────────────────────────────────────────────────────────────────────────────────────────────────
// side: 'A' Alliance or 'H' Horde. newClasses: combinations new in Forever. Skyborne pick a faction at creation, and the
// two sides differ in one racial and one class (High Order can be Mages, Windshapers can be Shamans).
export const RACES = [
  { id: 'human', name: 'Human', side: 'A', racials: ['willToSurvive', 'perception', 'swordSpec', 'humanSpirit'],
    classes: ['hunter', 'mage', 'paladin', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['hunter'],
    blurb: 'Stormwind\'s versatile humans. Will to Survive is the best stun break in the game, and Sword Specialization rewards anyone who can wield a sword.' },
  { id: 'dwarf', name: 'Dwarf', side: 'A', racials: ['stoneform', 'findTreasure', 'maceSpec', 'bigGameHunter'],
    classes: ['hunter', 'paladin', 'priest', 'rogue', 'shaman', 'warrior'], newClasses: ['shaman'],
    blurb: 'Ironforge\'s sturdy dwarves, and the only Alliance Shamans. Stoneform is a cleanse and a damage cut in one button.' },
  { id: 'nightelf', name: 'Night Elf', side: 'A', racials: ['elunesLight', 'shadowmeld', 'quickness', 'wispSpirit'],
    classes: ['druid', 'hunter', 'priest', 'rogue', 'warrior'], newClasses: [],
    blurb: 'Teldrassil\'s night elves. Elune\'s Light (+10% crit for 15 sec) is one of the strongest offensive racials in Forever.' },
  { id: 'gnome', name: 'Gnome', side: 'A', racials: ['escapeArtist', 'eureka', 'expansiveMind', 'engineeringSpec'],
    classes: ['mage', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['priest'],
    blurb: 'Gnomeregan\'s inventors. Escape Artist frees you from roots and slows, and Eureka! empowers your next three spells or abilities.' },
  { id: 'skyborne-ho', name: 'High Order Skyborne', short: 'Skyborne (Alliance)', side: 'A', skyborne: true,
    racials: ['walkOnAir', 'readLeyLine', 'windBlessed', 'elementalInsight'],
    classes: ['druid', 'hunter', 'mage', 'rogue', 'warrior'], newClasses: ['druid', 'hunter', 'mage', 'rogue', 'warrior'],
    blurb: 'Forever\'s new race, on the Alliance side. Always-on haste, bonus damage to elementals and ley-line regeneration. Needs a WoW Forever upgrade pack.' },
  { id: 'orc', name: 'Orc', side: 'H', racials: ['bloodFury', 'shatterCurse', 'axeSpec', 'hardiness'],
    classes: ['hunter', 'mage', 'rogue', 'shaman', 'warlock', 'warrior'], newClasses: ['mage'],
    blurb: 'Durotar\'s orcs. Blood Fury (+10% attack and spell power) is a strong burst for every damage dealer, and Shatter Curse cuts magic damage.' },
  { id: 'undead', name: 'Undead', side: 'H', racials: ['willOfTheForsaken', 'cannibalize', 'underwaterBreathing', 'touchOfTheGrave'],
    classes: ['mage', 'paladin', 'priest', 'rogue', 'warlock', 'warrior'], newClasses: ['paladin'],
    blurb: 'The Forsaken, and the Horde\'s only Paladins in Forever. Will of the Forsaken breaks fears, charms and sleeps.' },
  { id: 'tauren', name: 'Tauren', side: 'H', racials: ['warStomp', 'cultivation', 'plainsrunning', 'endurance'],
    classes: ['druid', 'hunter', 'shaman', 'warrior'], newClasses: [],
    blurb: 'Mulgore\'s tauren. Endurance adds 5% health and 1% hit, and War Stomp is an area stun.' },
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
// weap: how realistic each specialization weapon is for the spec (1 = a best-in-slot option, 0 = can't or won't use it).
// dots: damage comes mostly from periodic effects (Eureka! only empowers non-periodic spells). stealth: plays from stealth.
export const SPEC_PROFILES = {
  'warrior/arms': { kind: 'melee', res: 'rage', weap: { sword: 1, axe: 1, mace: 0.8 } },
  'warrior/fury': { kind: 'melee', res: 'rage', weap: { sword: 1, axe: 1, mace: 0.7 } },
  'warrior/protection': { kind: 'tank', res: 'rage', weap: { sword: 0.9, axe: 0.9, mace: 0.9 } },
  'paladin/retribution': { kind: 'melee', res: 'mana', weap: { sword: 1, mace: 1, axe: 1 } },
  'paladin/holy': { kind: 'healer', res: 'mana', weap: { mace: 1, sword: 0.7 } },
  'paladin/protection': { kind: 'tank', res: 'mana', weap: { sword: 0.9, mace: 0.9, axe: 0.6 } },
  'hunter/beast-mastery': { kind: 'ranged', res: 'mana', pet: true, weap: { sword: 0.6, axe: 0.6 } },
  'hunter/marksmanship': { kind: 'ranged', res: 'mana', pet: true, weap: { sword: 0.6, axe: 0.6 } },
  'hunter/survival': { kind: 'ranged', res: 'mana', pet: true, weap: { sword: 0.9, axe: 0.9 } },
  'rogue/combat': { kind: 'melee', res: 'energy', stealth: true, weap: { sword: 1, axe: 1, mace: 0.7 } },
  'rogue/assassination': { kind: 'melee', res: 'energy', stealth: true, weap: { sword: 0.3, mace: 0.2 } },
  'rogue/subtlety': { kind: 'melee', res: 'energy', stealth: true, weap: { sword: 0.8, mace: 0.6, axe: 0.6 } },
  'priest/shadow': { kind: 'caster', res: 'mana', dots: true, spirit: true, weap: { mace: 0.6 } },
  'priest/holy': { kind: 'healer', res: 'mana', spirit: true, weap: { mace: 0.9 } },
  'priest/discipline': { kind: 'healer', res: 'mana', spirit: true, weap: { mace: 0.9 } },
  'shaman/enhancement': { kind: 'melee', res: 'mana', weap: { axe: 1, mace: 1 } },
  'shaman/elemental': { kind: 'caster', res: 'mana', weap: { mace: 0.8 } },
  'shaman/restoration': { kind: 'healer', res: 'mana', weap: { mace: 0.9 } },
  'mage/frost': { kind: 'caster', res: 'mana', weap: { sword: 0.6 } },
  'mage/fire': { kind: 'caster', res: 'mana', weap: { sword: 0.5 } },
  'mage/arcane': { kind: 'caster', res: 'mana', weap: { sword: 0.5 } },
  'warlock/affliction': { kind: 'caster', res: 'mana', dots: true, pet: true, weap: { sword: 0.6 } },
  'warlock/demonology': { kind: 'caster', res: 'mana', pet: true, weap: { sword: 0.5 } },
  'warlock/destruction': { kind: 'caster', res: 'mana', pet: true, weap: { sword: 0.6 } },
  'druid/feral': { kind: 'melee', also: 'tank', res: 'energy', stealth: true, weap: {} },
  'druid/balance': { kind: 'caster', res: 'mana', weap: {} },
  'druid/restoration': { kind: 'healer', res: 'mana', weap: {} },
};

export const MODES = [
  ['pve', 'Dungeons & raids'],
  ['pvp', 'PvP'],
  ['leveling', 'Leveling'],
];
