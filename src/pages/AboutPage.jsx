import { useEffect, useState } from 'react';
import { CLASSES } from '../data/classes/index.js';
import { PROFESSIONS } from '../data/professions.js';
import { DUNGEONS } from '../data/dungeons/index.js';
import { Icon } from '../components/icons.jsx';
import { appInfo } from '../lib/updates.js';
import { stage } from '../data/release.js';

const REPO = 'https://github.com/Everhart09/everhart-guides';
const SPECS = CLASSES.reduce((n, c) => n + c.specs.length, 0);

// Every feature: what it is, how to use it, and where to open it. `go` gets the app's nav object.
const FEATURES = [
  {
    id: 'guides', icon: 'sword', title: 'Class & spec guides',
    what: `A full guide for each of the ${SPECS} specs across ${CLASSES.length} classes, written for WoW Forever's talents and abilities.`,
    how: [
      '**Overview**: summary, ratings for leveling, solo, dungeons, PvP and raiding, pros and cons, signature talents, races, professions and consumables.',
      '**Talents**: drag the level slider (1–60) or press play to watch the build fill in point by point. Arrow keys step one level and Space plays or pauses. The trees use their in-game backgrounds.',
      '**Stats & Gear**: stat priority with explanations, weapon choices and the best pre-raid item for every slot, taken from the Forever item database.',
      '**Rotation**: opener, single-target, AoE and cooldowns, with a "why" under each step and a level slider that shows what your rotation looks like before 60.',
      '**Leveling & Route**: tips, talent checkpoints and a route planner. Pick your faction and level to see which zones and dungeons to do, with the zone map.',
      'Your slider positions are remembered per guide, so you can leave and come back.',
    ],
    go: (nav) => nav.cls(CLASSES[0].id), open: 'Pick a class in the sidebar',
  },
  {
    id: 'class', icon: 'shield', title: 'Class pages',
    what: 'Every class has its own page above its specs, with what changed in Forever and what you can train.',
    how: [
      '**Overview** compares the three specs side by side.',
      "**What's new in Forever** lists new, removed and reworked talents and abilities compared with Classic. The compare toggle shows both versions.",
      '**Trainer checklist** lists every ability rank and the level you learn it. Set your level, tick off what you have trained and see what is coming next. Saved per class.',
    ],
  },
  {
    id: 'calc', icon: 'star', title: 'Talent Calculator',
    what: 'Build your own 51-point spec on the real Forever talent trees, with every rule enforced.',
    how: [
      'Left-click a talent to add a point and right-click to remove one. Row requirements and prerequisites are checked as you go.',
      'Load any guide build as a starting point, then tweak it.',
      'Save builds on your computer, or share them as a code like warrior:30305213032015201-15050130032. Paste a code into Import to load someone else’s build.',
    ],
    go: (nav) => nav.calc(), open: 'Open the calculator',
  },
  {
    id: 'races', icon: 'shield', title: 'Best Race',
    what: 'Every race each spec can be in WoW Forever, ranked, with what each racial does for that spec and why.',
    how: [
      'Pick a class and spec, then what you will do most: **Dungeons & raids**, **PvP** or **Leveling**. Each changes which racials matter. Filter to Alliance or Horde.',
      'The top cards name the best Alliance and Horde race. Below, every race shows all four racials, rated Key, Useful, Minor or No real use for that spec, with the reason and the in-game tooltip.',
      'Forever reworked racials: weapon racials now give crit instead of weapon skill, resistances are gone, and the new Skyborne get haste and elemental bonuses. New race/class combinations are marked.',
      "Each guide's Overview shows the best race on each side and links here for the full breakdown.",
    ],
    go: (nav) => nav.races(), open: 'Find your race',
  },
  {
    id: 'picker', icon: 'star', title: 'Class Picker',
    what: 'Not sure what to play? Answer 11 quick questions and get your best-matching class and spec.',
    how: [
      'Questions cover role, melee or ranged, fantasy, pace, how you survive, what you bring to a group, where you will spend your time, complexity, pets and hybrids.',
      `Every one of the ${SPECS} specs is scored using its guide ratings and its own playstyle traits. The reel lands on your top pick, followed by your top three and six more worth a look.`,
      'Your answers are saved, so you can change one and see how the results shift.',
    ],
    go: (nav) => nav.picker(), open: 'Take the quiz',
  },
  {
    id: 'dungeons', icon: 'skull', title: 'Dungeons & Raids',
    what: `Boss-by-boss guides for ${DUNGEONS.length} dungeons, including Forever's new Hall of Thanes, Ruins of Lordaeron and Excavation Site.`,
    how: [
      'Each dungeon starts with a roster of boss portraits. Each boss then gets an overview, its abilities, tips for tanks, healers and DPS, and its loot. Hover an item to see its stats and drop chance.',
      'Filter by faction, new dungeons or favorites, and enter your level to highlight dungeons that fit.',
      'Dungeon names in each guide’s Leveling & Route tab link straight to the dungeon’s guide.',
    ],
    go: (nav) => nav.dungeons(), open: 'Browse dungeons',
  },
  {
    id: 'professions', icon: 'settings', title: 'Professions',
    what: `All ${PROFESSIONS.length} professions (gathering, crafting and secondary) from 1 to 300.`,
    how: [
      'Drag the skill slider to see what to craft or where to farm next, the trainer rank you need, and the materials still left to reach 300.',
      'Each profession also lists its pros and cons, specializations, notable recipes and any changes in the latest Forever patch notes.',
      'The hub page suggests profession pairings and has a grid showing which professions suit each class.',
    ],
    go: (nav) => nav.professions(), open: 'See professions',
  },
  {
    id: 'legacy', icon: 'star', title: 'Legacy System',
    what: "WoW Forever's account-wide progression, explained, with a perk planner.",
    how: [
      'Plan a character’s points across the Professions, Adventure and Resourcefulness trees. The point cap and tree requirements are enforced. Click to add a point, right-click or use − to remove one.',
      'Tick off the 65 Legacy challenges to see how many points your account has earned.',
      'Share plans as codes. Perk text comes from the official perk spells in the game data.',
    ],
    go: (nav) => nav.legacy(), open: 'Open Legacy',
  },
  {
    id: 'news', icon: 'note', title: stage('News & Beta', 'Patch Notes'),
    what: "Blizzard's latest WoW Forever patch notes, imported straight from the official forum thread.",
    how: [
      'Patch notes are grouped by class and system, with the current notes always on top.',
      ...stage([
        'Until launch, a Beta overview tab covers the schedule, current level cap, open dungeons and known issues.',
        'At launch the countdown and beta-only parts disappear on their own.',
      ], []),
    ],
    go: (nav) => nav.patch(), open: 'Read the notes',
  },
  {
    id: 'yours', icon: 'heart', title: 'Your stuff',
    what: 'Small tools that make the app yours.',
    how: [
      '**Favorites**: click the star at the top right of any guide, class, profession or dungeon. It appears at the top of the sidebar.',
      '**Notes**: the notes button on any page opens a side panel. Notes save as you type, and "All notes" lists every page you have written on.',
      '**Cheat sheets**: every spec guide has Print and Save as PDF buttons that make a one-page summary of the build, stats, rotation and leveling tips.',
      '**Pick up where you left off**: the home page shows the pages you visited most recently.',
    ],
  },
  {
    id: 'search', icon: 'search', title: 'Search',
    what: 'Jump anywhere without clicking through menus.',
    how: [
      'Press **Ctrl + K** (or click the search bar at the top) and start typing a class, spec, profession, dungeon or page name.',
      'Use the arrow keys to choose a result and Enter to open it.',
    ],
  },
  {
    id: 'appearance', icon: 'sun', title: 'Settings & appearance',
    what: 'Open Settings from the bottom of the sidebar.',
    how: [
      '**Theme**: Current (dark), Horde (crimson, with the Horde crest), Alliance (blue and gold, with the Alliance crest) or Nebula (pink, purple and turquoise), each with matching background orbs.',
      '**Text size**: four sizes that scale the whole window. **Compact layout**: Off, Auto (for small windows) or On.',
      '**Updates**: turn automatic checks on or off, check now, or go back to the guide data that came with the app.',
    ],
    go: (nav) => nav.settings(), open: 'Open Settings',
  },
];

const UPDATE_DATA = [
  'Talent trees', 'Pre-raid gear lists', 'Dungeon abilities, loot and portraits', 'Zone maps',
  'Legacy perks', "What's new in Forever comparisons", "Blizzard's patch notes",
];

const FAQ = [
  ['Does it need the internet?', 'No. Everything is bundled, so the guides work offline. The internet is only used to check for updates.'],
  ['Is my information sent anywhere?', 'No. There are no accounts, ads or tracking. Your favorites, notes, settings and saved builds stay on your computer.'],
  ['Why did Windows warn me when I installed it?', 'The installer isn’t code-signed (a paid certificate), so Windows SmartScreen shows "Windows protected your PC" for new apps. Click More info → Run anyway.'],
  ['A guide says its build no longer fits the talents.', 'Blizzard changed the trees in a game update. The warning links to the calculator so you can see what moved. The guide itself is fixed in a later app update.'],
  ['Something looks wrong or out of date.', 'Run Settings → Check for updates first. If it is still wrong, report it on the GitHub page below.'],
];

// Turns **bold** in feature text into <b>.
const rich = (text) => text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : part));

export default function AboutPage({ nav }) {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    appInfo().then(setInfo).catch(() => {});
  }, []);
  const jump = (id) => document.getElementById(`about-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="page about-page">
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-crest"><Icon name="heart" size={38} /></div>
        <div className="hero-text">
          <div className="kicker">Everhart Guides{info?.version ? ` · Version ${info.version}` : ''}</div>
          <h1>About this app</h1>
          <p className="hero-desc">
            Everhart Guides is a free desktop companion for <b>WoW Forever</b>. It brings class guides, talents, gear, leveling routes,
            dungeons, professions and patch notes together in one place, and keeps them current as the game changes.
          </p>
        </div>
      </header>

      <section className="ab-steps">
        {[
          ['1', 'Pick a class', 'Choose a class in the sidebar, or take the Class Picker if you are not sure yet.'],
          ['2', 'Open a spec guide', 'Talents, gear, rotation and your leveling route are all tabs on one page.'],
          ['3', 'Make it yours', 'Star favorites, take notes, print a cheat sheet or plan your own talents.'],
          ['4', 'Stay current', 'The app checks for new guide data and new versions by itself.'],
        ].map(([n, t, d]) => (
          <div key={n} className="ab-step"><span className="ab-step-n">{n}</span><div><b>{t}</b><p>{d}</p></div></div>
        ))}
      </section>

      <nav className="ab-jump" aria-label="Jump to section">
        {FEATURES.map((f) => <button key={f.id} onClick={() => jump(f.id)}>{f.title}</button>)}
        <button onClick={() => jump('updates')}>Updates</button>
        <button onClick={() => jump('faq')}>FAQ</button>
      </nav>

      <div className="section-title"><h2>Features</h2><span className="rule" /></div>
      <div className="ab-features">
        {FEATURES.map((f) => (
          <article key={f.id} id={`about-${f.id}`} className="panel ab-feature">
            <header>
              <span className="ab-icon"><Icon name={f.icon} size={18} /></span>
              <h3>{f.title}</h3>
            </header>
            <p className="ab-what">{f.what}</p>
            <ul>{f.how.map((h) => <li key={h}>{rich(h)}</li>)}</ul>
            {f.go && (
              <button className="btn-ghost ab-open" onClick={() => f.go(nav)}>{f.open} <Icon name="arrow" size={13} /></button>
            )}
          </article>
        ))}
      </div>

      <div className="section-title" id="about-updates"><h2>How updates work</h2><span className="rule" /></div>
      <div className="ab-two">
        <section className="panel">
          <div className="kicker">The app itself</div>
          <h3 className="ab-h">New versions</h3>
          <p>
            When the app starts, it checks GitHub for a newer version. It downloads in the background and a <b>Restart & update</b> button
            appears when it is ready. Your favorites, notes, settings and downloaded data are kept.
          </p>
        </section>
        <section className="panel">
          <div className="kicker">The guide data</div>
          <h3 className="ab-h">Game and patch changes</h3>
          <p>
            Once a day (and any time you press <b>Settings → Check for updates</b>), the app asks Wowhead whether it has newer WoW Forever
            data and checks Blizzard’s forum for new patch notes. Anything out of date is downloaded, with a progress bar, and the app
            restarts. No reinstall needed:
          </p>
          <ul className="ab-tags">{UPDATE_DATA.map((d) => <li key={d}>{d}</li>)}</ul>
        </section>
      </div>

      <div className="section-title"><h2>Where the information comes from</h2><span className="rule" /></div>
      <section className="panel ab-sources">
        <ul>
          <li><b>WoW Forever game data</b> via Wowhead’s Forever database: talents, abilities, items, boss abilities and loot, Legacy perks, zone maps and boss portraits.</li>
          <li><b>Blizzard</b>: the official WoW Forever patch notes, imported from the Blizzard forums.</li>
          <li><b>Guide writing</b>: ratings, rotations, tips and explanations are written for this app, with dungeon strategies credited to Wowhead’s Forever guides.</li>
        </ul>
      </section>

      <div className="section-title" id="about-faq"><h2>Questions</h2><span className="rule" /></div>
      <section className="panel ab-faq">
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      <footer className="ab-footer">
        <a className="btn-ghost" href={REPO} target="_blank" rel="noreferrer">View on GitHub</a>
        <a className="btn-ghost" href={`${REPO}/releases`} target="_blank" rel="noreferrer">Release notes</a>
        <a className="btn-ghost" href={`${REPO}/issues`} target="_blank" rel="noreferrer">Report a problem</a>
        <p className="fine">
          Fan-made and unofficial. Not affiliated with or endorsed by Blizzard Entertainment. World of Warcraft, WoW Forever, the game
          icons and artwork are trademarks and property of Blizzard Entertainment. The app’s source code is MIT licensed.
        </p>
      </footer>
    </div>
  );
}
