import { useState } from 'react';
import { Icon } from './icons.jsx';
import { isFavorite, toggleFavorite, useNotes, usePrefs } from '../lib/prefs.js';

const canExport = () => Boolean(globalThis.everhart?.exportPdf);

/** Favorite / notes / export buttons shown in the top-right corner of a page header. */
export default function PageActions({ favKey, noteKey, nav, exportName }) {
  usePrefs(); // re-render when favorites change
  const notes = useNotes();
  const [exporting, setExporting] = useState(false);
  const fav = favKey ? isFavorite(favKey) : false;
  const hasNote = Boolean(notes[noteKey]);

  const exportPdf = async () => {
    setExporting(true);
    document.documentElement.classList.add('printing');
    try {
      await globalThis.everhart.exportPdf(exportName);
    } finally {
      document.documentElement.classList.remove('printing');
      setExporting(false);
    }
  };

  return (
    <div className="page-actions">
      {favKey && (
        <button className={`pa-btn ${fav ? 'on' : ''}`} onClick={() => toggleFavorite(favKey)} title={fav ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={fav}>
          <Icon name="star" size={16} className={fav ? 'filled' : ''} />
        </button>
      )}
      <button className={`pa-btn ${hasNote ? 'has-note' : ''}`} onClick={nav.notes} title={hasNote ? 'Your notes for this page' : 'Add notes'}>
        <Icon name="note" size={16} />
      </button>
      {exportName && (
        <>
          <button className="pa-btn" onClick={() => window.print()} title="Print cheat sheet"><Icon name="print" size={16} /></button>
          {canExport() && (
            <button className="pa-btn" onClick={exportPdf} disabled={exporting} title="Save cheat sheet as PDF">
              <Icon name="download" size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
