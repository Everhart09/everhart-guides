import { Fragment } from 'react';
import { Icon, ROLE_ICON } from './icons.jsx';
import { ROLE_LABELS, RATING_LABELS } from '../data/classes/index.js';

/** Renders guide text, turning **Ability Name** into highlighted ability chips. */
export function Rich({ text }) {
  const parts = text.split('**');
  return parts.map((p, i) =>
    i % 2 ? <b key={i} className="ability">{p}</b> : <Fragment key={i}>{p}</Fragment>,
  );
}

export function RoleChip({ role }) {
  return (
    <span className={`role-chip role-${role}`}>
      <Icon name={ROLE_ICON[role]} size={12} />
      {ROLE_LABELS[role]}
    </span>
  );
}

export function Difficulty({ value }) {
  const label = ['', 'Beginner', 'Easy', 'Moderate', 'Advanced', 'Expert'][value];
  return (
    <span className="difficulty" title={`Difficulty: ${label}`}>
      <span className="pips">
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= value ? 'on' : ''} />)}
      </span>
      {label}
    </span>
  );
}

export function Ratings({ ratings, compact = false, labels = RATING_LABELS }) {
  return (
    <div className={`ratings ${compact ? 'compact' : ''}`}>
      {Object.entries(labels).map(([key, label]) => (
        <div className="rating" key={key}>
          <span className="rating-label">{label}</span>
          <span className="rating-bar">
            {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= ratings[key] ? 'on' : ''} />)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Panel({ title, kicker, children, className = '', action }) {
  return (
    <section className={`panel ${className}`}>
      {(title || kicker) && (
        <header className="panel-head">
          <div>
            {kicker && <div className="kicker">{kicker}</div>}
            {title && <h3>{title}</h3>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
