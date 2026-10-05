// Class picker quiz. Each answer adds points to specs; ratings and difficulty come from the spec guides themselves,
// the "style" tags below describe each class's fantasy and playstyle.

// Playstyle tags per class, with spec-level additions.
export const STYLE = {
  warrior: { tags: ['armor', 'weapons'], specs: {} },
  paladin: { tags: ['armor', 'holy', 'weapons'], specs: {} },
  hunter: { tags: ['nature', 'pet', 'weapons'], specs: {} },
  rogue: { tags: ['stealth', 'weapons'], specs: {} },
  priest: { tags: ['magic', 'holy'], specs: { shadow: ['shadow'] } },
  shaman: { tags: ['nature', 'magic'], specs: { enhancement: ['weapons'] } },
  mage: { tags: ['magic'], specs: {} },
  warlock: { tags: ['magic', 'shadow', 'pet'], specs: {} },
  druid: { tags: ['nature', 'magic', 'shapeshift'], specs: { feral: ['stealth'] } },
};
export const HYBRIDS = ['paladin', 'priest', 'shaman', 'druid'];

// Each option's effect: role / range / tags / rating / difficulty / pet / hybrid. Weights are points added per spec.
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
      { id: 'armor', label: 'Heavy armor and big weapons', sub: 'A knight in plate', tag: 'armor' },
      { id: 'magic', label: 'Arcane and elemental magic', sub: 'Fireballs, frost and lightning', tag: 'magic' },
      { id: 'shadow', label: 'Shadows and stealth', sub: 'Dark magic or striking unseen', tag: ['shadow', 'stealth'] },
      { id: 'nature', label: 'Nature and beasts', sub: 'Animal companions and wild forms', tag: ['nature', 'shapeshift'] },
      { id: 'holy', label: 'Holy light', sub: 'Faith, protection and healing', tag: 'holy' },
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
