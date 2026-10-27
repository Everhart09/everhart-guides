// Ranks the races a spec can play, per mode (dungeons & raids, PvP, leveling), and explains every racial's value.
import { RACIALS, SPEC_PROFILES, racesForClass } from '../data/races.js';

const MODE_INDEX = { pve: 0, pvp: 1, leveling: 2 };
const dps = (p) => p.kind === 'melee' || p.kind === 'ranged' || p.kind === 'caster';
const physical = (p) => p.kind === 'melee' || p.kind === 'ranged' || p.kind === 'tank';
const an = (word) => (/^[aeiou]/i.test(word) ? `an ${word}` : `a ${word}`);
const roleWord = (p) => ({ melee: 'melee damage dealers', ranged: 'hunters', caster: 'casters', healer: 'healers', tank: 'tanks' }[p.kind]);

/** value(ctx) → { v: [pve, pvp, leveling] (0–10), why: string | { pve, pvp, leveling } } */
const VALUE = {
  willToSurvive: (p) => ({
    v: [1, p.kind === 'healer' ? 8 : 9, 1],
    why: { pve: 'A stun break. Very few dungeon or raid stuns are worth spending it on.', pvp: `One of the best PvP racials in the game: a 3-min "break any stun" button. Stuns are how ${p.kind === 'healer' ? 'healers get killed' : 'kills happen'} in Forever PvP.`, leveling: 'Occasionally saves you from a stun-lock while questing, rarely matters.' },
  }),
  perception: (p) => ({
    v: [0, p.stealth ? 5 : 4, 1],
    why: { pve: 'No use in dungeons or raids.', pvp: `Reveals stealthed Rogues and Druids for 20 sec. Good for ${p.stealth ? 'stealth duels and spotting the enemy first' : 'stopping openers on you or your healer'}.`, leveling: 'Helps spot stealthed mobs and players in contested zones.' },
  }),
  ruthless: (p) => {
    if (dps(p)) return { v: [5, 4, 3], why: '+1% crit on everything, always on, whatever weapon you use. Small but permanent. (It replaced Sword Specialization, so it no longer needs a sword.)' };
    if (p.kind === 'healer') return { v: [3, 2, 1], why: '+1% crit, always on: a few more critical heals. Small.' };
    return { v: [3, 2, 2], why: '+1% crit, always on: a little more threat and damage. Small.' };
  },
  humanSpirit: (p) => {
    if (p.kind === 'healer' || p.spirit) return { v: [6, 3, 4], why: `+10% Spirit means noticeably more mana regeneration${p.spirit && p.kind !== 'healer' ? ', and Shadow gets even more from Spirit Tap' : ' between casts'}. Always on, and doubled in Blizzard\'s final pass.` };
    if (p.res === 'mana') return { v: [3, 1, 3], why: '+10% Spirit is some extra mana regeneration, mostly felt while leveling.' };
    return { v: [0, 0, 1], why: `+10% Spirit barely matters for ${an(p.res)} user beyond slightly faster health regeneration out of combat.` };
  },

  stoneform: (p) => ({
    v: p.kind === 'tank' || p.also === 'tank' ? [6, 6, 3] : [3, physical(p) ? 7 : 6, 3],
    why: {
      pve: p.kind === 'tank' || p.also === 'tank'
        ? 'A free defensive cooldown: 10% less Physical damage for 8 sec, plus it cleanses bleeds, poisons and diseases. Great for tank-buster moments.'
        : 'Cleanses bleeds, poisons and diseases and cuts Physical damage taken by 10% for 8 sec. Handy on poison and disease bosses.',
      pvp: 'Removes Rogue poisons, Warrior bleeds and diseases, then makes you immune for 8 sec with 10% less Physical damage. Strong against melee.',
      leveling: 'Saves a few deaths to poison and bleed mobs.',
    },
  }),
  findTreasure: () => ({ v: [0, 0, 3], why: 'Shows treasure chests on the minimap and can find extra items in most chests. Some extra gold and loot while leveling, nothing in combat.' }),
  artisansPrecision: (p) => {
    if (p.kind === 'healer') return { v: [1, 1, 1], why: '+1% hit with spells and attacks. Healers don\'t need hit, so it does little for you.' };
    return { v: [p.kind === 'tank' ? 5 : 6, 3, 2], why: `+1% hit with spells and attacks, always on. Hit is a stat you need anyway${p.kind === 'tank' ? ' (missed attacks cost threat)' : ''}, so this frees gear for other stats until you reach the hit cap. (It replaced Mace Specialization and the short-lived Earth Fury.)` };
  },
  bigGameHunter: (p) => ({ v: [1, 0, 5], why: { pve: '+5% damage to Beasts. Few dungeon or raid bosses are beasts, so it rarely matters at 60.', pvp: 'No effect on players.', leveling: `+5% damage to Beasts, and a huge share of leveling mobs are beasts${p.kind === 'healer' ? ' (when you\'re soloing)' : ''}. Noticeably faster questing.` } }),

  elunesLight: (p) => {
    if (dps(p)) return { v: [6, 7, 3], why: { pve: `+10% crit for 15 sec every 3 min. Huge burst: line it up with your other cooldowns${p.kind === 'caster' ? ' (more crits also mean more mana back from crit-based talents)' : ''}. One of Forever's strongest offensive racials.`, pvp: '+10% crit for 15 sec turns a burst window into a kill window.', leveling: 'Speeds up tough fights, but a 3-min cooldown makes it a once-in-a-while button while questing.' } };
    if (p.kind === 'healer') return { v: [5, 4, 1], why: '+10% crit for 15 sec: more critical heals during a damage spike. Good, not game-changing.' };
    return { v: [4, 3, 2], why: '+10% crit for 15 sec helps you build early threat on the pull and adds a little survivability where crits matter.' };
  },
  shadowmeld: (p) => ({
    v: [p.kind === 'tank' ? 0 : p.kind === 'melee' ? 1 : p.kind === 'ranged' ? 2 : 4, p.stealth ? 4 : 3, 2],
    why: {
      pve: p.kind === 'tank' ? 'You want enemies hitting you, so it has no PvE use for a tank.' : `Using it in combat "discourages enemies from attacking you": an emergency threat drop${p.kind === 'melee' ? ', though melee rarely pull aggro' : ' when you pull aggro'}.`,
      pvp: p.stealth ? 'A second way to hide and reset, and it pairs well with your stealth play.' : 'Hide when standing still: ambush flag runners, drop out of sight, or dodge a fight.',
      leveling: 'Sit unseen to avoid mobs and players.',
    },
  }),
  quickness: (p) => ({
    v: [p.kind === 'tank' || p.also === 'tank' ? 5 : 1, physical(p) ? 3 : 2, 2],
    why: p.kind === 'tank' || p.also === 'tank'
      ? '+1% dodge is real avoidance for a tank, and +2% run speed is always on.'
      : `+1% dodge and +2% run speed, always on${p.stealth ? ', and your stealth counts as 1 level higher' : ''}. Small but free.`,
  }),
  wispSpirit: () => ({ v: [0, 1, 2], why: '75% faster as a ghost. Shorter corpse runs, nothing else.' }),

  escapeArtist: (p) => ({
    v: [1, p.kind === 'melee' ? 8 : p.kind === 'ranged' ? 7 : p.kind === 'healer' ? 5 : 6, 1],
    why: { pve: 'Breaks roots and slows. Rarely needed in dungeons and raids.', pvp: p.kind === 'melee' ? 'Breaks Frost Nova, Hamstring, Crippling Poison and every other root or slow, then 3 sec of immunity. For melee, staying on target is everything.' : p.kind === 'ranged' ? 'Breaks roots and slows so you can get back to range. Excellent for kiting.' : 'Breaks a root or slow and buys 3 sec of free movement to get away or reposition.', leveling: 'Escapes a root or slow while questing now and then.' },
  }),
  eureka: (p) => {
    if (p.kind === 'healer') return { v: [4, 3, 1], why: 'For 8 sec, your direct heals cost 10% less and heal 10% more (Power Word: Shield counts too). A small boost for a damage spike every 2 min.' };
    if (p.dots) return { v: [3, 3, 2], why: 'Only empowers non-periodic spells, and most of your damage comes from DoTs, so it does less for this spec.' };
    if (p.kind === 'tank') return { v: [3, 2, 2], why: 'For 8 sec, your abilities deal 10% more damage (more threat) at 10% less cost. A small boost on the pull.' };
    return { v: [5, 5, 2], why: `For 8 sec, your non-periodic ${p.kind === 'caster' ? 'spells' : 'abilities'} deal 10% more damage and cost 10% less. Line it up with your other cooldowns every 2 min.` };
  },
  expansiveMind: (p) => {
    if (p.res === 'energy') return { v: [4, 4, 2], why: '+5% maximum Energy: a bigger pool to fill before openers and burst. Energy specs feel this every fight.' };
    if (p.res === 'rage') return { v: [1, 1, 1], why: '+5% maximum Rage does almost nothing: you rarely sit at the rage cap.' };
    return { v: [p.kind === 'healer' ? 5 : 4, 3, 3], why: `+5% maximum Mana: longer before you run dry${p.kind === 'healer' ? ' on long fights' : ''}, and less drinking while leveling.` };
  },
  engineeringSpec: () => ({ v: [1, 2, 0], why: 'Only matters if you take Engineering: gadgets fail and backfire 20% less often, which helps most in PvP.' }),

  walkOnAir: () => ({ v: [0, 2, 2], why: 'Glide for 10 sec. Shortcuts off cliffs and safe falls: fun utility, no combat power.' }),
  windBlessed: (p) => ({ v: [5, 3, 3], why: `+2% Haste on everything, always on. Faster ${p.kind === 'caster' || p.kind === 'healer' ? 'casts' : p.kind === 'ranged' ? 'shots and attacks' : 'attacks'} for every second of every fight.` }),
  elementalInsight: () => ({ v: [3, 0, 2], why: { pve: '+5% damage to Elementals. Molten Core is mostly elementals, so it shines there; elsewhere it\'s situational.', pvp: 'No effect on players.', leveling: '+5% damage against the elementals you meet while questing. Situational.' } }),
  readLeyLine: (p) => ({
    v: p.res === 'mana' ? [2, 0, 5] : [0, 0, 3],
    why: p.res === 'mana'
      ? '+50% Health and Mana regeneration for 15 sec. Use it at a Ley Line to become Attuned for an hour (it survives death, but not entering a raid), doubling that to +100%. Cuts a lot of drinking while leveling.'
      : '+50% Health regeneration for 15 sec, or +100% for an hour after using it at a Ley Line. Less downtime while leveling.',
  }),
  skysight: () => ({ v: [0, 1, 4], why: '+15% run speed for 15 sec. Use it at an elemental convergence to become Charged for an hour (it survives death, but not entering a raid): +30% run speed. Much faster questing on foot.' }),

  bloodFury: (p) => {
    if (dps(p)) return { v: [7, 8, 4], why: `+10% ${p.kind === 'caster' ? 'Spell Power' : 'Attack Power'} for 15 sec every 2 min. A solid burst cooldown to stack with your others${p.pet ? ' (it boosts your damage, not your pet\'s)' : ''}.` };
    if (p.kind === 'tank') return { v: [4, 3, 2], why: '+10% Attack Power and Spell Power for 15 sec every 2 min: more threat on the pull.' };
    return { v: [3, 2, 2], why: 'The tooltip boosts Spell Power, so it may lift your healing; it\'s mainly a damage cooldown.' };
  },
  shatterCurse: (p) => ({
    v: [p.kind === 'tank' ? 3 : p.kind === 'healer' ? 2 : 1, p.kind === 'melee' ? 4 : 3, 1],
    why: { pve: 'Removes your curses and cuts Magical damage taken by 5% for 8 sec. Situational: handy on curse-heavy fights.', pvp: 'Cleanses Warlock curses on demand, with 5% less magic damage for 8 sec. It no longer gives immunity, so they can be reapplied.', leveling: 'Removes the odd curse from a mob.' },
  }),
  command: (p) => (p.pet
    ? { v: [6, 4, 5], why: 'Your pet deals 5% more damage, always on. A real chunk of a Hunter\'s or Warlock\'s damage comes from the pet, and while leveling the pet does even more of the work.' }
    : { v: [0, 0, 0], why: 'Only Hunter and Warlock pets benefit, so it does nothing for this spec.' }),
  hardiness: (p) => ({ v: [1, physical(p) ? 6 : 5, 1], why: { pve: 'Stuns are rare in PvE, so it barely matters.', pvp: 'Every stun on you lasts 20% shorter: Kidney Shot, Cheap Shot, Hammer of Justice and more. Always on.', leveling: 'Barely matters while questing.' } }),

  willOfTheForsaken: (p) => ({
    v: [p.kind === 'tank' ? 4 : 2, 9, 1],
    why: { pve: p.kind === 'tank' ? 'Breaks boss fears (Onyxia, Magmadar and others) so you keep threat.' : 'Breaks the occasional boss fear.', pvp: 'Breaks Fear, Charm and Sleep. Warlocks, Priests and Warriors all fear, which makes this one of the best PvP racials.', leveling: 'Breaks fears from fleeing or casting mobs now and then.' },
  }),
  cannibalize: (p) => ({ v: [1, 2, 5], why: `Restores 35% Health${p.res === 'mana' ? ' and Mana' : ''} over 10 sec from a humanoid or undead corpse. Cuts a lot of eating${p.res === 'mana' ? ' and drinking' : ''} while leveling.` }),
  underwaterBreathing: () => ({ v: [0, 0, 1], why: 'Breath lasts 4 times longer underwater. Convenient for underwater quests.' }),
  touchOfTheGrave: (p) => ({ v: [2, 3, 3], why: `Every so often your ${p.kind === 'caster' || p.kind === 'healer' ? 'spells' : 'attacks'} drain up to 5% of your max Health (${p.kind === 'caster' || p.kind === 'healer' ? '30%' : '20%'} chance, at most once every 15 sec). Small free sustain.` }),

  warStomp: (p) => ({
    v: [p.kind === 'tank' ? 3 : 2, p.kind === 'melee' || p.kind === 'healer' ? 6 : 5, 3],
    why: { pve: p.kind === 'tank' ? 'A 2-sec AoE stun: interrupts casters on trash pulls and buys time to pick up loose mobs.' : 'A 2-sec AoE stun for emergencies on trash.', pvp: 'Stuns up to 5 enemies for 2 sec: interrupt a cast, peel a Rogue off your healer, or start a kill.', leveling: 'Escape or interrupt when a pull goes wrong.' },
  }),
  cultivation: () => ({ v: [0, 0, 2], why: 'Grow extra herbs you can pick without Herbalism. A little extra gold.' }),
  plainsrunning: () => ({ v: [0, 3, 4], why: { pve: 'Builds up to 60% run speed while you keep moving. Nice between pulls, no help in a fight.', pvp: 'Builds up to 60% run speed while moving undamaged: great for world PvP roaming and running flags early on.', leveling: 'Builds up to 60% run speed while you keep moving (doubled in Blizzard\'s final pass). Big for questing on foot, though it doesn\'t boost mounts.' } }),
  endurance: (p) => {
    if (p.kind === 'tank' || p.also === 'tank') return { v: [5, 4, 3], why: '+5% Health, always on. Health is a tank\'s first defense against spikes.' };
    return { v: [2, 4, 2], why: '+5% Health: more room to survive burst, especially in PvP. (Blizzard\'s final pass removed its hit and crit bonuses.)' };
  },

  berserking: (p) => {
    if (dps(p)) return { v: [6, 5, 3], why: `+10% ${p.kind === 'caster' ? 'casting' : 'attack'} speed for 15 sec every 3 min. A solid burst cooldown to stack with your others.` };
    if (p.kind === 'healer') return { v: [5, 4, 1], why: '+10% casting speed for 15 sec: faster heals when the group is taking heavy damage.' };
    return { v: [4, 3, 2], why: '+10% attack speed for 15 sec: more swings, more rage and threat.' };
  },
  rapidRegeneration: () => ({ v: [1, 1, 5], why: 'Channel to regenerate 50% of your Health over 6 sec. Skip eating between pulls: great while leveling.' }),
  beastSlaying: (p) => VALUE.bigGameHunter(p),
  regeneration: () => ({ v: [0, 1, 3], why: '+20% Health regeneration, and 20% of it continues in combat. Less eating between pulls while leveling.' }),
};

const tierOf = (score, best) => {
  const r = best > 0 ? score / best : 0;
  return r >= 0.95 ? 'Best' : r >= 0.8 ? 'Great' : r >= 0.62 ? 'Good' : 'Okay';
};
const tagOf = (v) => (v >= 6 ? 'key' : v >= 3 ? 'useful' : v >= 1 ? 'minor' : 'none');

/** Every race this spec can be, ranked for a mode. Each entry: { race, score, tier (within its faction), rank, racials: [{ key, racial, value, why, tag }] }. */
export function rankRaces(cls, spec, mode = 'pve') {
  const p = SPEC_PROFILES[`${cls.id}/${spec.id}`];
  if (!p) return [];
  const m = MODE_INDEX[mode] ?? 0;
  const ranked = racesForClass(cls.id).map((race) => {
    const racials = race.racials.map((key) => {
      const res = VALUE[key](p);
      const value = res.v[m];
      const why = typeof res.why === 'string' ? res.why : res.why[mode] ?? res.why.pve;
      return { key, racial: RACIALS[key], value, why, tag: tagOf(value) };
    }).sort((a, b) => b.value - a.value);
    return { race, score: racials.reduce((s, r) => s + r.value, 0), racials };
  }).sort((a, b) => b.score - a.score || a.race.name.localeCompare(b.race.name));
  // Tiers compare races on the same side: most players pick their faction first, so the best Alliance race is "Best"
  // even when a Horde race scores higher.
  const bestOn = { A: ranked.find((r) => r.race.side === 'A')?.score ?? 0, H: ranked.find((r) => r.race.side === 'H')?.score ?? 0 };
  return ranked.map((r, i) => ({ ...r, tier: tierOf(r.score, bestOn[r.race.side]), rank: i + 1 }));
}

/** Best race on each side for a mode: { A: entry | null, H: entry | null }. */
export function bestBySide(cls, spec, mode = 'pve') {
  const ranked = rankRaces(cls, spec, mode);
  return { A: ranked.find((r) => r.race.side === 'A') ?? null, H: ranked.find((r) => r.race.side === 'H') ?? null };
}

/** One sentence naming a race's standout racials for this spec, e.g. "Blood Fury and Command". */
export function standouts(entry) {
  const top = entry.racials.filter((r) => r.value >= 3).slice(0, 2).map((r) => r.racial.name);
  return top.length ? top.join(' and ') : 'small, mostly utility racials';
}

export { roleWord };
