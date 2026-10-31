// WoW Forever beta patch notes bundled with the app, from Blizzard's official "WoW Forever Beta Development Notes"
// forum thread. The desktop app imports newer notes automatically (Settings → Check for updates); those win.
// Items are strings, or { t: text, note: developers' note, sub: [nested items] }.

const BUNDLED_PATCH = {
  "title": "Beta Development Notes",
  "build": "October 27, 2026 update",
  "forumTitle": "WoW Forever Beta Development Notes – Updated October 26",
  "postId": 30634848,
  "date": "2026-10-27",
  "author": "Kaivax",
  "source": "https://us.forums.blizzard.com/en/wow/t/wow-forever-beta-development-notes-%E2%80%93-updated-october-26/2360696/8",
  "imported": true,
  "parser": 2,
  "highlights": [
    {
      "label": "Total changes",
      "value": "19",
      "text": "Changes listed in the October 27 notes"
    }
  ],
  "intro": [
    "As we approach the launch of WoW Forever, we’ve been reflecting on feedback we’ve heard on racial abilities and passive traits: Some players have expressed that some of the new racial traits feel too generic, while others have raised concerns that some are objectively stronger than others.",
    "In taking a final pass on these, we’ve prioritized racial identity, which means that some races will naturally be slightly more effective than others at certain combat roles. In some places where we had replaced role- or class-focused racials with generic ones, we’re rolling those changes back. One exception to this is the weapon specialization racials, like humans’ Sword Specialization or orcs’ Axe Specialization. While those have a strong fantasy component to them, it is not healthy in the long run for future raid and dungeon loot tables to be evaluated through the lens of “required” weapon types.",
    "At the same time, we’re doing a tuning pass on some of the remaining passive bonuses to help ensure that they aren’t skewing outcomes in a way that limits player preferences."
  ],
  "sections": [
    {
      "id": "races",
      "title": "Races",
      "groups": [
        {
          "title": "Human",
          "items": [
            "Ruthless now increases critical chance by 1% (was 2%).",
            "Human Spirit now increases Spirit by 10% (was 5%)."
          ]
        },
        {
          "title": "Dwarf",
          "items": [
            "Earth Fury (2% increased critical strike damage and healing) removed.",
            "Added: Artisan’s Precision - Increases hit chance with spells and attacks by 1%."
          ]
        },
        {
          "title": "Tauren",
          "items": [
            "Plainsrunning now grants 2% movement speed per stack (was 1%), for a total max increase of 60% (was 30%).",
            "Plainsrunning no longer increases mounted movement speed.",
            "Endurance no longer provides any modifiers beyond 5% increased Health (no hit chance or critical damage modifiers)."
          ]
        },
        {
          "title": "Orc",
          "items": [
            "Savage removed (1% increased critical strike chance).",
            "Command re-added, increasing Warlock and Hunter pet damage by 5%.",
            "Blood Fury’s cooldown reduced to 2 minutes (was 3 minutes)."
          ]
        },
        {
          "title": "Troll",
          "items": [
            "Berserking duration increased to 15 seconds (was 10 seconds)."
          ]
        },
        {
          "title": "Undead",
          "items": [
            "Touch of the Grave internal cooldown reduced to 15 seconds (was 25 seconds)."
          ]
        },
        {
          "title": "Skyborne",
          "items": [
            "Wind-Blessed Haste bonus reduced to 2% (was 3%).",
            "Read Leyline now increases Mana and Health regeneration by 50% (was 100%), with a 15-second duration. This ability cannot be used while Innervate is active, and will be replaced by Innervate as a more powerful effect.",
            "Using Read Leyline at a Ley Line now also grants “Attuned” for 1 hour. While Attuned, the benefit of Read Leyline is increased to 100% regeneration increase. Attuned persists through death, and is removed upon entering a raid.",
            "Skysight is now a 15% increased movement speed (was 10%), with a 15-second duration.",
            "Using Skysight at an elemental convergence now also grants “Charged” for 1 hour. While Charged, the benefit of Skysight is a 30% movement speed increase. Charged persists through death, and is removed upon entering a raid.",
            "Charged persists through death, and is removed upon entering a raid.",
            "Attuned persists through death, and is removed upon entering a raid."
          ]
        }
      ]
    }
  ],
  "previous": null
};

const downloaded = (() => {
  try {
    const data = globalThis.everhart?.getPatchNotesOverride?.();
    return data?.sections && data?.build ? data : null;
  } catch {
    return null;
  }
})();

export const PATCH = downloaded ?? BUNDLED_PATCH;
export const PATCH_ORIGIN = downloaded ? 'downloaded' : 'bundled';
