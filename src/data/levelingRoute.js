// Leveling route: where to quest and which dungeons to run at each level, per faction.
// Zone/dungeon level ranges follow Wowhead's WoW Forever zone data and Blizzard's beta notes.
// New Forever content is marked `isNew`. Update as Blizzard announces more (see UNANNOUNCED below).
//
// side: 'A' Alliance, 'H' Horde, 'C' contested/both.  `start` = faction's own starting zone.

export const ZONES = [
  // Starting zones (1–12)
  { name: 'Zephras Isle', zone: 16593, levels: [1, 12], side: 'C', isNew: true, note: 'Skyborne starting zone (either faction)' },
  { name: 'Elwynn Forest', zone: 12, levels: [1, 10], side: 'A', note: 'Human start' },
  { name: 'Dun Morogh', zone: 1, levels: [1, 10], side: 'A', note: 'Dwarf & Gnome start' },
  { name: 'Teldrassil', zone: 141, levels: [1, 11], side: 'A', note: 'Night Elf start' },
  { name: 'Durotar', zone: 14, levels: [1, 10], side: 'H', note: 'Orc & Troll start' },
  { name: 'Mulgore', zone: 215, levels: [1, 10], side: 'H', note: 'Tauren start' },
  { name: 'Tirisfal Glades', zone: 85, levels: [1, 12], side: 'H', note: 'Undead start' },
  // 10–20
  { name: 'Westfall', zone: 40, levels: [9, 18], side: 'A' },
  { name: 'Loch Modan', zone: 38, levels: [10, 18], side: 'A' },
  { name: 'Darkshore', zone: 148, levels: [11, 19], side: 'A' },
  { name: 'The Barrens', zone: 17, levels: [10, 25], side: 'H' },
  { name: 'Silverpine Forest', zone: 130, levels: [10, 20], side: 'H' },
  { name: 'Redridge Mountains', zone: 44, levels: [15, 25], side: 'A' },
  { name: 'Stonetalon Mountains', zone: 406, levels: [15, 25], side: 'C' },
  // 20–30
  { name: 'Duskwood', zone: 10, levels: [18, 30], side: 'A' },
  { name: 'Wetlands', zone: 11, levels: [20, 30], side: 'A' },
  { name: 'Ashenvale', zone: 331, levels: [19, 30], side: 'C' },
  { name: 'Hillsbrad Foothills', zone: 267, levels: [20, 31], side: 'C' },
  { name: 'Thousand Needles', zone: 400, levels: [24, 35], side: 'C' },
  // 30–40
  { name: 'Alterac Mountains', zone: 36, levels: [27, 39], side: 'C' },
  { name: 'Arathi Highlands', zone: 45, levels: [30, 40], side: 'C' },
  { name: 'Stranglethorn Vale', zone: 33, levels: [30, 45], side: 'C' },
  { name: 'Desolace', zone: 405, levels: [30, 39], side: 'C' },
  { name: 'Dustwallow Marsh', zone: 15, levels: [35, 45], side: 'C' },
  // 40–50
  { name: 'Riverglades', zone: 16591, levels: [36, 44], side: 'C', isNew: true, note: 'New Forever frontier zone' },
  { name: 'Badlands', zone: 3, levels: [36, 45], side: 'C' },
  { name: 'Swamp of Sorrows', zone: 8, levels: [36, 43], side: 'C' },
  { name: 'Tanaris', zone: 440, levels: [40, 50], side: 'C' },
  { name: 'Feralas', zone: 357, levels: [41, 50], side: 'C' },
  { name: 'The Hinterlands', zone: 47, levels: [41, 50], side: 'C' },
  { name: 'Azshara', zone: 16, levels: [42, 55], side: 'C' },
  { name: 'Searing Gorge', zone: 51, levels: [43, 56], side: 'C' },
  // 50–60
  { name: "Un'Goro Crater", zone: 490, levels: [48, 55], side: 'C' },
  { name: 'Felwood', zone: 361, levels: [48, 55], side: 'C' },
  { name: 'Blasted Lands', zone: 4, levels: [45, 55], side: 'C' },
  { name: 'Burning Steppes', zone: 46, levels: [50, 58], side: 'C' },
  { name: 'Western Plaguelands', zone: 28, levels: [51, 58], side: 'C' },
  { name: 'Eastern Plaguelands', zone: 139, levels: [53, 60], side: 'C' },
  { name: 'Winterspring', zone: 618, levels: [53, 60], side: 'C' },
  { name: 'Silithus', zone: 1377, levels: [55, 60], side: 'C' },
];

// `opens` = minimum level to enter in Forever (from Blizzard's beta notes), where announced.
export const DUNGEONS = [
  { name: 'Ragefire Chasm', levels: [13, 18], side: 'H', where: 'Orgrimmar' },
  { name: 'The Hall of Thanes', levels: [13, 18], side: 'C', isNew: true, where: 'New Forever dungeon' },
  { name: 'Ruins of Lordaeron', levels: [15, 20], side: 'C', isNew: true, where: 'New Forever dungeon' },
  { name: 'The Deadmines', levels: [17, 26], side: 'A', where: 'Westfall' },
  { name: 'Wailing Caverns', levels: [17, 24], side: 'H', where: 'The Barrens' },
  { name: 'Shadowfang Keep', levels: [22, 30], side: 'H', where: 'Silverpine Forest' },
  { name: 'Blackfathom Deeps', levels: [24, 32], side: 'C', where: 'Ashenvale' },
  { name: 'The Stockade', levels: [24, 32], side: 'A', where: 'Stormwind City' },
  { name: 'Excavation Site: Wetlands', levels: [26, 31], side: 'C', isNew: true, where: 'Wetlands — new Forever dungeon' },
  { name: 'Gnomeregan', levels: [29, 38], side: 'A', where: 'Dun Morogh' },
  { name: 'Razorfen Kraul', levels: [29, 38], side: 'H', where: 'The Barrens' },
  { name: 'Scarlet Monastery', levels: [34, 45], side: 'H', where: 'Tirisfal Glades (4 wings)' },
  { name: 'Razorfen Downs', levels: [37, 46], side: 'H', opens: 25, where: 'The Barrens' },
  { name: 'Uldaman', levels: [41, 51], side: 'C', opens: 30, where: 'Badlands' },
  { name: "Zul'Farrak", levels: [44, 54], side: 'C', where: 'Tanaris' },
  { name: 'Maraudon', levels: [46, 55], side: 'C', where: 'Desolace' },
  { name: 'Sunken Temple', levels: [50, 56], side: 'C', where: 'Swamp of Sorrows' },
  { name: 'Blackrock Depths', levels: [52, 60], side: 'C', where: 'Blackrock Mountain' },
  { name: 'Lower Blackrock Spire', levels: [55, 60], side: 'C', where: 'Blackrock Mountain' },
  { name: 'Dire Maul', levels: [55, 60], side: 'C', where: 'Feralas' },
  { name: 'Scholomance', levels: [58, 60], side: 'C', where: 'Western Plaguelands' },
  { name: 'Stratholme', levels: [58, 60], side: 'C', where: 'Eastern Plaguelands' },
  { name: 'Upper Blackrock Spire', levels: [58, 60], side: 'C', where: 'Blackrock Mountain (10 players)' },
];

// New Forever zones/dungeons listed by Wowhead whose level ranges haven't been announced yet.
export const UNANNOUNCED = [
  { name: 'Mount Hyjal', kind: 'Zone', where: 'Kalimdor' },
  { name: "Shen'dralas", kind: 'Zone', where: 'Kalimdor' },
  { name: 'Gilneas', kind: 'Zone', where: 'Eastern Kingdoms' },
  { name: 'City of Dalaran', kind: 'Dungeon', where: 'Alterac Mountains' },
  { name: 'Manor Mistmantle', kind: 'Dungeon', where: '—' },
];

// Bracket tips shown with the route.
export const BRACKETS = [
  { from: 1, to: 12, title: 'Starting out', tip: 'Finish your starting zone, then head to your faction\'s first hub. Skyborne begin on Zephras Isle and leave at 12.' },
  { from: 13, to: 20, title: 'First dungeons', tip: 'Forever adds two new low-level dungeons — Hall of Thanes and Ruins of Lordaeron — alongside the classics.' },
  { from: 21, to: 30, title: 'The beta cap', tip: 'The WoW Forever beta currently stops at 30. Excavation Site: Wetlands (26–31) is the newest dungeon to test.' },
  { from: 31, to: 40, title: 'Mounts & Stranglethorn', tip: 'In Classic, riding unlocks at 40 — watch for Forever changes. Stranglethorn Vale and Arathi Highlands are busy hubs — Desolace is quieter.' },
  { from: 41, to: 50, title: 'Riverglades & Tanaris', tip: 'Riverglades is Forever\'s new 36–44 zone. Tanaris, Feralas and the Hinterlands carry you to 50.' },
  { from: 51, to: 60, title: 'The road to 60', tip: 'Un\'Goro, Felwood, the Plaguelands and Winterspring. Start running Blackrock Depths and Dire Maul for pre-raid gear.' },
];

