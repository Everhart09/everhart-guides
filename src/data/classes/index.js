import warrior from './warrior.js';
import paladin from './paladin.js';
import hunter from './hunter.js';
import rogue from './rogue.js';
import priest from './priest.js';
import shaman from './shaman.js';
import mage from './mage.js';
import warlock from './warlock.js';
import druid from './druid.js';

export const CLASSES = [warrior, paladin, hunter, rogue, priest, shaman, mage, warlock, druid];

export const getClass = (id) => CLASSES.find((c) => c.id === id);
export const getSpec = (cls, id) => cls?.specs.find((s) => s.id === id);

export const ROLE_LABELS = { tank: 'Tank', healer: 'Healer', dps: 'Damage' };
export const RATING_LABELS = { leveling: 'Leveling', solo: 'Solo', group: 'Dungeons', pvp: 'PvP', raid: 'Raiding' };
