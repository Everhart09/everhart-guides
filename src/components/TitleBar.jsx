import { Icon } from './icons.jsx';
import { CountdownPill } from './Countdown.jsx';

export default function TitleBar({ onSearch, onCountdown }) {
  return (
    <header className="titlebar">
      <div className="brand">
        <svg className="brand-mark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M12 20.5s-8.5-5.2-8.5-11.2A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 2.9c0 6-8.5 11.2-8.5 11.2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 17.2s-5.4-3.5-5.4-7.4a2.9 2.9 0 0 1 5.4-1.5 2.9 2.9 0 0 1 5.4 1.5c0 3.9-5.4 7.4-5.4 7.4z" fill="currentColor" opacity=".85" />
        </svg>
        <span className="brand-name">Everhart Guides</span>
      </div>
      <button className="search-trigger" onClick={onSearch}>
        <Icon name="search" size={14} />
        <span>Search classes, specs & professions</span>
        <kbd>Ctrl K</kbd>
      </button>
      <CountdownPill onClick={onCountdown} />
      <div className="titlebar-spacer" />
    </header>
  );
}
