import { Icon } from './icons.jsx';
import { pageInfo, pageKey } from '../lib/pages.js';

/**
 * "← Back to …" at the top of a page. Returns to the page you came from; with no history yet (e.g. right after the
 * app starts), it goes to `fallback` ({ label, go }) instead. Renders nothing when there's neither.
 */
export default function BackButton({ nav, fallback = null }) {
  const prev = nav.previous;
  const info = prev ? pageInfo(pageKey(prev)) : null;
  const label = info ? info.label : fallback?.label;
  if (!label) return null;
  const go = () => {
    if (!(info && nav.back())) fallback?.go();
  };
  return (
    <button className="back-btn" onClick={go} title={`Back to ${label} (Alt+←)`}>
      <Icon name="back" size={14} />
      <span>Back to {label}</span>
    </button>
  );
}
