# Everhart Guides

A desktop app with class and spec guides for **WoW Forever**, built with React, Vite and Electron.

## Download

Get the latest Windows installer from the [Releases page](https://github.com/Everhart09/everhart-guides/releases/latest) (`Everhart-Guides-Setup-x.y.z.exe`), run it, and pick where to install.

The installer isn't code-signed yet, so Windows may show **"Windows protected your PC"**. Click **More info → Run anyway**. Once installed, the app keeps itself up to date: new versions download in the background from this repo's Releases (you'll see **Restart & update**), and guide data refreshes through **Settings → Check for updates**.

> Fan-made and unofficial. World of Warcraft, WoW Forever, the game icons and the WoW Forever logo are trademarks and property of Blizzard Entertainment. Guide data comes from the WoW Forever beta and Wowhead, credited throughout the app.

It covers 9 classes and 27 specs. Each guide has:

- **Talent planner**: a level slider (1–60) that shows where every point goes, with play/step controls, prerequisite arrows, signature-talent markers and a clickable pick order
- **Overview**: summary, ratings (leveling / solo / dungeons / PvP / raiding), pros & cons, signature talents, races, professions, consumables
- **Stats & Gear**: ranked stat priorities, weapon preferences, and **pre-raid gear lists** — the best items per slot from the WoW Forever item database, with sources, Forever change badges and Wowhead links
- **Rotation**: opener, single-target and AoE priorities, cooldowns and notes
- **Leveling**: tips, talent checkpoints every 10 levels, and class ability milestones

There's also a class comparison page, a role filter and quick picks on the home screen. Press `Ctrl+K` to search.

**Talent Calculator** (sidebar) lets you build your own 51-point spec on the real Forever trees with all rules enforced. Load any guide build to tweak it, save builds locally, and share them as codes like `warrior:30305213032015201-15050130032`.

**Leveling help**:
- **Leveling & Route** (tab in every spec guide): leveling tips and talent checkpoints, plus a route planner. Pick Alliance or Horde and your level to see which zones to quest in and which dungeons to run. Covers Forever's new zones (Zephras Isle, Riverglades) and dungeons (Hall of Thanes, Ruins of Lordaeron, Excavation Site: Wetlands), plus a full 1–60 timeline. Areas with no announced levels yet are listed separately. Each zone shows its WoW Forever map (click a zone card to switch, click the map for full size). They update through Settings → Check for updates like the rest of the guide data; `npm run maps` refreshes the bundled copies.
- **What's new in Forever** (class page tab): compares Classic with Forever, covering new, removed and reworked talents (with a Classic-vs-Forever compare toggle) and spellbook changes such as new, renamed and removed abilities and level changes.
- **Trainer checklist** (class page tab): every ability rank with the level you learn it, taken from the Forever data. Set your level, tick off what you've trained and see what's coming next. Saved per class.

**Dungeons & Raids** (sidebar): a boss-by-boss guide for every dungeon in the beta, including Forever's new Hall of Thanes, Ruins of Lordaeron and Excavation Site, plus early notes on City of Dalaran. Each dungeon opens with a roster of boss portraits (renders of the in-game models), then one section per boss: an overview, its mechanics (real spell data), what to watch out for as tank, healer and DPS, and its drops (item level, slot, stats and drop chance on hover). Filter by faction, new dungeons or favorites, and enter your level to highlight dungeons that fit. Dungeon names in each guide's Leveling & Route tab link to their guides. Raids are listed but not guided yet, because the beta is capped at 30. Strategy text lives in `src/data/dungeons/catalog.js`, credited to Wowhead's Forever guides. Abilities, loot and boss levels come from `npm run dungeons`, and the app refreshes them itself with every guide update.

**Your stuff**:
- **Favorites**: star any guide, class, profession or dungeon (top-right of the page) and it appears in a Favorites section at the top of the sidebar.
- **Notes**: the notes button on any page opens a side panel for personal notes. They save automatically on your computer, and "All notes" lists every page you've written on.
- **Cheat sheets**: every spec guide has Print and Save as PDF buttons that produce a one-page cheat sheet with the talent build (and its import code), stat priority, weapons, consumables, rotation and leveling tips.
- **Appearance** (Settings): theme: Current (the classic dark look), Horde (crimson, with the Horde crest behind the pages) or Alliance (blue and gold, with the Alliance crest), each with matching background orbs; four text sizes that scale the whole window; and a compact layout (Off / Auto for small windows / On).

**Automatic beta updates**: on startup (at most once a day) the desktop app checks whether Wowhead has newer WoW Forever data or Blizzard has posted new beta notes. **Settings → Check for updates** (or the banner) downloads whatever is out of date: talent trees, pre-raid gear lists, dungeon guide data, zone maps, Legacy System perks, the "What's new" class comparisons and Blizzard's latest beta patch notes (imported straight from the official forum thread), with a progress bar, then restarts the app. No rebuild needed. Downloads are stored in your app-data folder; the WoW Forever Beta page has "Check now" and "Use bundled trees" buttons. Guides whose builds no longer fit the new trees show a warning with a link to fix them in the calculator.

**Legacy System** (sidebar) explains WoW Forever's account-wide Legacy progression and includes a perk calculator: plan a character's points across the Professions, Adventure and Resourcefulness trees with the 16-point cap and tree requirements enforced, share builds as codes, and tick off the 65 Legacy challenges to see how many points your account has. Perk text and icons come from the official perk spells in the WoW Forever game data and refresh with Settings → Check for updates (`npm run legacy` updates the bundled copy); ranks, requirements and challenges are in `src/data/legacy.js`.

**Professions** covers all 12 professions (gathering, crafting and secondary):

- A skill slider (1–300) with step-by-step crafting or farming, trainer rank bands, and a materials list for the rest of the way to 300
- Pros and cons, ratings, tips, trainer info, specializations and notable recipes
- A hub page with recommended pairings and a class-fit grid (classes × professions)
- Profession names in each spec guide link straight to their profession pages

**News & Beta** (sidebar) has Blizzard's latest patch notes and, until launch, a **Beta overview** tab: schedule, current level cap, open dungeons, limitations and known issues. **Launch mode:** after the release date (`src/data/release.js`) the app drops its beta-only parts on its own: the countdown and Beta tab disappear, the leveling route stops showing a level cap, and the page becomes plain Patch Notes.

## Running

```bash
npm install
npm run dev       # hot-reloading dev mode (Vite + Electron)
npm start         # production build, then launch
npm run dist      # build a Windows installer into /release
npm run validate  # check every talent build against the talent rules
npm run smoke     # build, then open every page and tab in the real app and report any that break (run before releasing)
npm run icons     # look up and download any missing game icons (only needed after adding talents)
npm run changes   # regenerate the bundled Classic-vs-Forever comparison after `npm run talents` (the app can also rebuild it itself)
npm run dungeons  # refresh dungeon boss abilities, loot and NPC info from Wowhead's Forever tooltips (add --force to refetch everything; the app can also update them itself)
npm run gear      # rebuild the bundled pre-raid gear lists from Wowhead's Forever item database (the app can also update them itself)
```

## Sharing the app (installer)

```bash
npm run dist
```

This builds `release/Everhart-Guides-Setup-<version>.exe` (about 115 MB), a standard Windows installer. It lets people pick the install folder and adds Desktop and Start Menu shortcuts, and the app appears in Windows' Apps list for uninstalling. Send people that one file; the rest of `release/` is build output.

- **Releasing a new version:**
  1. Bump `"version"` in `package.json` (e.g. `1.2.0`).
  2. Run `npm run dist`. It writes `Everhart-Guides-Setup-<version>.exe`, its `.blockmap` and `latest.yml` to `release/`.
  3. Publish all three on GitHub, e.g. `gh release create v1.2.0 release/Everhart-Guides-Setup-1.2.0.exe release/Everhart-Guides-Setup-1.2.0.exe.blockmap release/latest.yml --title "Everhart Guides 1.2.0" --notes "What changed"`.
- **Automatic app updates:** installed copies (1.1.0 and later) check this repo's latest release on startup and in Settings → App version. They download new versions in the background and offer **Restart & update**. `latest.yml` must be attached to the release, because that's what the updater reads. Users' favorites, notes, settings and downloaded guide data are kept (they live in `%APPDATA%\Everhart Guides`).
- **Guide data stays current on its own:** talent, gear, dungeon and class-comparison data update through Settings → Check for updates without a new release.
- **Windows SmartScreen:** the installer isn't code-signed, so Windows will show "Windows protected your PC" the first time. Users click **More info → Run anyway**. Removing the warning requires a code-signing certificate (set `CSC_LINK`/`CSC_KEY_PASSWORD` before `npm run dist`).
- **App icon:** `build/icon.png` (512×512).



Game icons are bundled in `public/icons`, so the app works offline. `src/data/icons.json` maps each talent, class and profession to an icon name. `npm run icons` fills in anything missing using Wowhead's Classic search, then downloads the images from the Wowhead icon CDN. If a name can't be matched, add it to `STATIC_ICONS` in `scripts/fetch-icons.mjs`. Icons are © Blizzard Entertainment and are included for non-commercial fan use.

> If you launch from a VS Code terminal and Electron behaves like plain Node, unset `ELECTRON_RUN_AS_NODE` first.

## Editing guides

All guide content lives in `src/data/classes/<class>.js`. The talent trees themselves live in `src/data/talents/forever.json`, which is generated, so don't edit it by hand.

- **Builds**: an ordered list of `[talentName, points]`. The first point is spent at level 10 and one more each level after that, 51 in total.
- **Ability names** wrapped in `**double asterisks**` inside rotation text show up as highlighted chips.

After editing a build, run `npm run validate`. It checks tier requirements (5 points per row), prerequisites, max ranks and the 51-point total.

Talent trees are imported from the official WoW Forever beta data (via Wowhead's Forever talent calculator) with `npm run talents`. Run it again after each beta update, then `npm run validate` to see which builds or guide text need changes.

## License

The source code is [MIT licensed](LICENSE). Blizzard's game icons, the WoW Forever logo and imported game data aren't covered by that license; see [NOTICE.md](NOTICE.md).
