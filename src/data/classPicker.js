// Class picker quiz. Each answer adds points to specs; ratings and difficulty come from the spec guides themselves,
// the traits below describe each spec's fantasy and playstyle.

// Playstyle traits per spec. Every spec gets its own list so specs inside one class can come out differently.
//   fantasy: armor holy arcane dark stealth beast nature elements shapeshift
//   pace:    burst steady setup        survive: tough control escape selfheal
//   brings:  damage support utility    other:   pet
export const TRAITS = {
  warrior: {
    arms: ['armor', 'burst', 'tough', 'damage'],
    fury: ['armor', 'steady', 'tough', 'damage'],
    protection: ['armor', 'steady', 'tough', 'support', 'utility'],
  },
  paladin: {
    retribution: ['armor', 'holy', 'burst', 'tough', 'selfheal', 'support'],
    holy: ['holy', 'burst', 'selfheal', 'support'],
    protection: ['holy', 'armor', 'setup', 'tough', 'support'],
  },
  hunter: {
    'beast-mastery': ['beast', 'nature', 'pet', 'setup', 'escape', 'damage'],
    marksmanship: ['beast', 'pet', 'steady', 'control', 'damage', 'support'],
    survival: ['beast', 'nature', 'pet', 'burst', 'control', 'escape', 'utility'],
  },
  rogue: {
    combat: ['stealth', 'steady', 'escape', 'damage'],
    assassination: ['stealth', 'dark', 'burst', 'escape', 'damage'],
    subtlety: ['stealth', 'dark', 'burst', 'escape', 'control', 'utility'],
  },
  priest: {
    shadow: ['dark', 'setup', 'selfheal', 'control', 'support', 'utility'],
    holy: ['holy', 'steady', 'selfheal', 'support', 'utility'],
    discipline: ['holy', 'setup', 'selfheal', 'control', 'support', 'utility'],
  },
  shaman: {
    enhancement: ['elements', 'nature', 'burst', 'tough', 'selfheal', 'support'],
    elemental: ['elements', 'arcane', 'burst', 'control', 'selfheal', 'damage', 'support'],
    restoration: ['elements', 'nature', 'steady', 'selfheal', 'support'],
  },
  mage: {
    frost: ['arcane', 'steady', 'control', 'utility'],
    fire: ['arcane', 'burst', 'escape', 'damage'],
    arcane: ['arcane', 'burst', 'escape', 'utility', 'support'],
  },
  warlock: {
    affliction: ['dark', 'pet', 'setup', 'control', 'selfheal', 'utility'],
    demonology: ['dark', 'pet', 'setup', 'tough', 'utility', 'support'],
    destruction: ['dark', 'pet', 'burst', 'control', 'damage'],
  },
  druid: {
    feral: ['shapeshift', 'beast', 'steady', 'tough', 'escape', 'damage'],
    balance: ['nature', 'shapeshift', 'arcane', 'setup', 'control', 'selfheal', 'support'],
    restoration: ['nature', 'setup', 'selfheal', 'support', 'utility'],
  },
};
export const HYBRIDS = ['paladin', 'priest', 'shaman', 'druid'];

// Each option's effect: role / range / tag / rating / difficulty / pet / hybrid. The scoring lives in src/lib/classPicker.js.
export const QUESTIONS = [
  {
    id: 'role',
    q: 'What do you want to do in a group?',
    hint: 'Every class can level solo, so this is about dungeons and raids.',
    options: [
      { id: 'dps', label: 'Deal damage', sub: 'Top the meters and take things down', role: 'dps' },
      { id: 'tank', label: 'Tank', sub: 'Lead the pulls and take the hits', role: 'tank' },
      { id: 'healer', label: 'Heal', sub: 'Keep everyone alive', role: 'healer' },
      { id: 'any', label: 'Not sure yet', sub: 'Show me the best fit overall' },
    ],
  },
  {
    id: 'range',
    q: 'Up close or from a distance?',
    options: [
      { id: 'melee', label: 'Up close', sub: 'Swords, axes and daggers in the thick of it', range: 'melee' },
      { id: 'ranged', label: 'From range', sub: 'Spells, bows or guns from safety', range: 'ranged' },
      { id: 'any', label: 'Either is fine', sub: '' },
    ],
  },
  {
    id: 'fantasy',
    q: 'Which fantasy speaks to you most?',
    options: [
      { id: 'armor', label: 'Plate and steel', sub: 'A warrior in heavy armor', tag: 'armor' },
      { id: 'holy', label: 'Holy light', sub: 'Faith, protection and healing', tag: 'holy' },
      { id: 'arcane', label: 'Fire, frost and arcane', sub: 'A spellcaster bending raw magic', tag: 'arcane' },
      { id: 'dark', label: 'Dark magic', sub: 'Curses, demons and the void', tag: 'dark' },
      { id: 'stealth', label: 'Striking unseen', sub: 'Stealth, poisons and ambushes', tag: 'stealth' },
      { id: 'beast', label: 'Beasts and the hunt', sub: 'Tracking prey with an animal at your side', tag: 'beast' },
      { id: 'nature', label: 'The wild', sub: 'Nature magic, forms and the elements', tag: ['nature', 'shapeshift'] },
      { id: 'elements', label: 'Totems and storms', sub: 'Calling on earth, fire, water and air', tag: 'elements' },
    ],
  },
  {
    id: 'pace',
    q: 'How do you like a fight to play out?',
    hint: 'This applies to healing and tanking too.',
    options: [
      { id: 'burst', label: 'Big moments', sub: 'Build up, then unload huge hits or heals', tag: 'burst', why: 'Plays around big burst moments' },
      { id: 'steady', label: 'A steady rhythm', sub: 'Constant pressure, always something to press', tag: 'steady', why: 'Has a steady, constant rhythm' },
      { id: 'setup', label: 'Set it up and let it work', sub: 'DoTs, HoTs, shields and pets doing the job over time', tag: 'setup', why: 'Wins by setting things up and letting them tick' },
      { id: 'any', label: 'No preference', sub: '' },
    ],
  },
  {
    id: 'survive',
    q: 'When a fight goes wrong, how do you get out of it?',
    options: [
      { id: 'tough', label: 'Tough it out', sub: 'Heavy armor and a thick skin', tag: 'tough', why: 'Hard to kill' },
      { id: 'control', label: 'Control the fight', sub: 'Roots, fears, slows and kiting', tag: 'control', why: 'Lots of crowd control to stay in charge' },
      { id: 'escape', label: 'Slip away', sub: 'Vanish, blink or play dead', tag: 'escape', why: 'Great escape tools' },
      { id: 'selfheal', label: 'Heal through it', sub: 'Patch myself up mid-fight', tag: 'selfheal', why: 'Can heal itself through trouble' },
    ],
  },
  {
    id: 'brings',
    q: 'What would you most like to bring to a group?',
    options: [
      { id: 'damage', label: 'Raw numbers', sub: 'The biggest hits on the meter', tag: 'damage', why: 'Brings big raw numbers' },
      { id: 'support', label: 'Buffs and support', sub: 'Auras, totems and blessings that lift everyone', tag: 'support', why: 'Makes the whole group stronger' },
      { id: 'utility', label: 'Utility and tricks', sub: 'Crowd control, portals, summons and resurrection', tag: 'utility', why: 'Packed with utility' },
      { id: 'any', label: 'Whatever wins', sub: '' },
    ],
  },
  {
    id: 'focus',
    q: 'Where will you spend most of your time?',
    options: [
      { id: 'leveling', label: 'Leveling and questing', sub: 'The journey from 1 to 60', rating: 'leveling' },
      { id: 'group', label: 'Dungeons with friends', sub: 'Five-player runs', rating: 'group' },
      { id: 'pvp', label: 'PvP', sub: 'Battlegrounds and world PvP', rating: 'pvp' },
      { id: 'raid', label: 'Raiding at 60', sub: 'Molten Core and beyond', rating: 'raid' },
    ],
  },
  {
    id: 'social',
    q: 'Do you mostly play alone or with others?',
    options: [
      { id: 'solo', label: 'Mostly solo', sub: 'I want to handle anything on my own', rating: 'solo' },
      { id: 'mixed', label: 'A bit of both', sub: '' },
      { id: 'group', label: 'Mostly in groups', sub: 'I\'ll have friends or a guild', rating: 'group' },
    ],
  },
  {
    id: 'complexity',
    q: 'How complex should your class be?',
    options: [
      { id: 'simple', label: 'Keep it simple', sub: 'Few buttons, forgiving', difficulty: 'low' },
      { id: 'some', label: 'Some depth', sub: 'Room to learn and improve', difficulty: 'mid' },
      { id: 'hard', label: 'Challenge me', sub: 'High skill ceiling', difficulty: 'high' },
    ],
  },
  {
    id: 'pet',
    q: 'How do you feel about a permanent pet?',
    options: [
      { id: 'yes', label: 'I want a companion', sub: 'A beast or demon at my side', pet: 1 },
      { id: 'any', label: 'No preference', sub: '' },
      { id: 'no', label: 'No pets, please', sub: 'Just me', pet: -1 },
    ],
  },
  {
    id: 'hybrid',
    q: 'Would you like to switch roles later?',
    hint: 'Hybrid classes can tank, heal or deal damage with a respec.',
    options: [
      { id: 'yes', label: 'Yes, keep my options open', sub: 'Flexible hybrid', hybrid: 1 },
      { id: 'no', label: 'No, I\'ll specialize', sub: 'One job, done well', hybrid: 0 },
    ],
  },
];
