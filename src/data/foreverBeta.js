// WoW Forever beta: schedule, current state, access and limitations.
// Update `current` and `timeline` as Blizzard posts new beta builds.

export const BETA = {
  start: '2026-09-17',
  end: '2026-10-21',
  current: {
    build: 'October 1, 2026 update',
    levelCap: 30,
    dungeons: [
      ['Ragefire Chasm', ''], ['Hall of Thanes', '13–18 · new'], ['Ruins of Lordaeron', '15–20 · new'], ['Wailing Caverns', ''],
      ['The Deadmines', ''], ['Shadowfang Keep', ''], ['The Stockade', ''], ['Blackfathom Deeps', ''],
      ['Gnomeregan', ''], ['Razorfen Kraul', ''], ['Scarlet Monastery', ''], ['Excavation Site: Wetlands', '26–31 · new'],
      ['Razorfen Downs', '25+'], ['Uldaman', '30+'],
    ],
  },
  timeline: [
    { date: '2026-09-17', title: 'Beta opens — Week 1', items: ['Level cap 20', 'New dungeons Hall of Thanes (13–18) and Ruins of Lordaeron (15–20)', 'New Skyborne race and Zephras Isle zone playable', 'All zone content up to level 20'] },
    { date: '2026-09-24', title: 'Week 2 development update', items: ['Cooldown Manager introduced (off by default)', 'First big class tuning pass', 'Temporary beta respec cost of 1 silver'] },
    { date: '2026-10-01', title: 'Week 3 — level 30 update', items: ['Level cap raised to 30', 'New dungeon Excavation Site: Wetlands (26–31), plus Razorfen Downs and Uldaman', 'Dungeon quest bonus XP cut by 50%', 'Honor cap raised to 25,000'] },
    { date: '2026-10-21', title: 'Beta ends', items: ['Beta access closes'] },
    { date: '2026-11-04', title: 'Full release', items: ['WoW Forever launches worldwide at 3:00 PM PST'] },
  ],
  access: [
    'Buyers of the Skyborne Epic Pack or the limited-time Warcraft Forever Collection get beta access',
    'Players who opted in can be selected throughout the test — invitations go out regularly',
  ],
  limitations: [
    { area: 'Level cap', text: 'You can only level to 30 right now. Content from 31–60 (including raids) cannot be tested yet.' },
    { area: 'Talents', text: 'Talent trees are still changing between builds — talents have been added, removed and moved every week.' },
    { area: 'Respecs', text: 'Respecs temporarily cost only 1 silver during the beta to encourage testing builds.' },
    { area: 'Leveling speed', text: 'Blizzard is still tuning XP (dungeon quest XP was halved on Oct 1) and creature respawn rates in busy zones.' },
    { area: 'Short test', text: 'The beta runs about five weeks and closes two weeks before launch.' },
  ],
  guideNotes: [
    'Talent trees in this app are imported from the current beta client. Run npm run talents after each beta build to stay in sync.',
    'Builds and leveling advice cover levels 1–60, but the beta only reaches 30 — everything past 30 is untested until launch.',
    'Stat priorities, pros/cons and playstyle advice build on Classic knowledge adjusted for Forever changes.',
    "Pre-raid gear lists come from the WoW Forever item database on Wowhead (npm run gear). Many new Forever items don't list a source yet, and trinket effects aren't scored.",
    'Profession leveling steps and material counts are estimates — buy ~10–20% extra.',
    'Game icons are © Blizzard Entertainment (via the Wowhead CDN). Everhart Guides is a non-commercial fan project, not affiliated with Blizzard.',
  ],
};
