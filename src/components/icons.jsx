const CLASS_PATHS = {
  warrior: [
    'M14.5 17.5 3 6V3h3l11.5 11.5', 'M13 19l6-6', 'M16 16l4 4', 'M19 21l2-2',
    'M14.5 6.5 18 3h3v3l-3.5 3.5', 'M5 14l4 4', 'M7 17l-3 3', 'M3 19l2 2',
  ],
  paladin: ['M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z', 'M12 7v9', 'M8.5 10.5h7'],
  hunter: ['M4 20 19 5', 'M14 5h5v5', 'M4 20l1-3 2 2z', 'M6 3a15 15 0 0 1 15 15'],
  rogue: ['M12 2l2.2 10L12 14l-2.2-2z', 'M7.5 14h9', 'M12 14v5', 'M10 21h4'],
  priest: ['M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z', 'M12 2v3', 'M12 19v3', 'M2 12h3', 'M19 12h3', 'M4.9 4.9l2.1 2.1', 'M17 17l2.1 2.1', 'M4.9 19.1 7 17', 'M17 7l2.1-2.1'],
  shaman: ['M13 2 4 14h7l-1 8 9-12h-7z'],
  mage: ['M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z'],
  warlock: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  druid: ['M5 19C5 10 11 4 20 4c0 9-6 15-15 15z', 'M5 19l8-8'],
};

export function ClassIcon({ id, size = 20, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(CLASS_PATHS[id] || []).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

const UI_PATHS = {
  search: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z', 'M20 20l-4-4'],
  home: ['M3 11l9-7 9 7', 'M5 10v10h14V10'],
  play: ['M7 4l13 8-13 8z'],
  pause: ['M7 4h3v16H7z', 'M14 4h3v16h-3z'],
  first: ['M6 5v14', 'M18 5l-9 7 9 7z'],
  last: ['M18 5v14', 'M6 5l9 7-9 7z'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14', 'M5 12h14'],
  check: ['M5 12l5 5L20 7'],
  x: ['M6 6l12 12', 'M18 6 6 18'],
  arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
  chevron: ['M9 6l6 6-6 6'],
  shield: ['M12 3l8 3v6c0 4.5-3.4 8.3-8 9.5C7.4 20.3 4 16.5 4 12V6z'],
  heart: ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'],
  sword: ['M14.5 4.5 20 4l-.5 5.5L9 20l-3-3z', 'M5 15l4 4', 'M3 21l2-2'],
  settings: ['M4 6h9', 'M17 6h3', 'M15 4v4', 'M4 12h3', 'M11 12h9', 'M9 10v4', 'M4 18h11', 'M19 18h1', 'M17 16v4'],
  star: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z'],
  note: ['M5 3h10l4 4v14H5z', 'M15 3v4h4', 'M8.5 12h7', 'M8.5 16h5'],
  print: ['M7 9V3h10v6', 'M7 17H4v-7h16v7h-3', 'M7 14h10v7H7z'],
  download: ['M12 4v11', 'M7 10l5 5 5-5', 'M5 20h14'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v2', 'M12 20v2', 'M2 12h2', 'M20 12h2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
  moon: ['M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'],
  skull: ['M12 3a8 8 0 0 0-8 8c0 2.8 1.4 4.7 3 5.8V20h10v-3.2c1.6-1.1 3-3 3-5.8a8 8 0 0 0-8-8z', 'M9 11.5h.01', 'M15 11.5h.01', 'M10 20v-2', 'M14 20v-2'],
  text: ['M4 7V5h11v2', 'M9.5 5v14', 'M7.5 19h4', 'M14 13v-1.5h7V13', 'M17.5 11.5V19', 'M16 19h3'],
};

export function Icon({ name, size = 16, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(UI_PATHS[name] || []).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export const ROLE_ICON = { tank: 'shield', healer: 'heart', dps: 'sword' };
