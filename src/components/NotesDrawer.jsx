import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons.jsx';
import { setNote, useNotes } from '../lib/prefs.js';
import { pageInfo } from '../lib/pages.js';

const when = (iso) => new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

/** Slide-in panel with a personal note for the current page, plus a list of every page you've written notes on. */
export default function NotesDrawer({ pageKey, nav, onClose }) {
  const notes = useNotes();
  const info = pageInfo(pageKey);
  const [text, setText] = useState(notes[pageKey]?.text ?? '');
  const [tab, setTab] = useState('page'); // page | all
  const area = useRef(null);
  const saveTimer = useRef(null);

  // Switching pages while open loads that page's note.
  useEffect(() => {
    setText(notes[pageKey]?.text ?? '');
    setTab('page');
  }, [pageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === 'page') area.current?.focus();
  }, [tab, pageKey]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Autosave shortly after typing stops, and when the drawer closes.
  const change = (value) => {
    setText(value);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setNote(pageKey, value), 400);
  };
  useEffect(() => () => clearTimeout(saveTimer.current), []);
  const flush = () => {
    clearTimeout(saveTimer.current);
    if ((notes[pageKey]?.text ?? '') !== text) setNote(pageKey, text);
  };

  const all = Object.entries(notes)
    .map(([key, n]) => ({ key, ...n, info: pageInfo(key) }))
    .filter((n) => n.info)
    .sort((a, b) => b.updated.localeCompare(a.updated));

  return (
    <aside className="notes-drawer" aria-label="Notes">
      <header className="nd-head">
        <Icon name="note" size={16} />
        <h2>Notes</h2>
        <button className="ub-close" onClick={() => { flush(); onClose(); }} title="Close (Esc)"><Icon name="x" size={16} /></button>
      </header>
      <div className="nd-tabs">
        <button className={tab === 'page' ? 'active' : ''} onClick={() => setTab('page')}>This page</button>
        <button className={tab === 'all' ? 'active' : ''} onClick={() => { flush(); setTab('all'); }}>All notes <span>{all.length}</span></button>
      </div>

      {tab === 'page' && (
        <div className="nd-body">
          <div className="nd-page">{info?.label ?? 'This page'}<span>{info?.sub}</span></div>
          <textarea
            ref={area}
            value={text}
            onChange={(e) => change(e.target.value)}
            onBlur={flush}
            placeholder="Your notes for this page: build tweaks, macros, reminders, who to group with…"
            spellCheck
          />
          <p className="fine">
            {notes[pageKey] ? `Saved ${when(notes[pageKey].updated)}` : 'Notes save automatically'} · Kept on this computer only.
          </p>
        </div>
      )}

      {tab === 'all' && (
        <div className="nd-body">
          {all.length === 0 && <p className="fine">No notes yet. Open any guide, class, profession or dungeon page and write one.</p>}
          <ul className="nd-list">
            {all.map((n) => (
              <li key={n.key}>
                <button onClick={() => n.info.go(nav)} style={{ '--c': n.info.color }}>
                  <span className="nd-list-title">{n.info.label} <em>{n.info.sub}</em></span>
                  <span className="nd-list-text">{n.text.slice(0, 140)}{n.text.length > 140 ? '…' : ''}</span>
                  <span className="nd-list-date">{when(n.updated)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
