import { ClassEmblem } from './GameIcon.jsx';
import { charKey, classOf, specOf, useCharacters } from '../lib/armory.js';

/** Favorite Armory characters on the home page; each opens that character on the Armory page. */
export default function FavoriteCharacters({ nav }) {
  const favs = useCharacters().filter((c) => c.fav);
  if (!favs.length) return null;
  const open = (c) => {
    try { localStorage.setItem('everhart.armory.selected', charKey(c)); } catch { /* fine */ }
    nav.armory();
  };
  return (
    <section className="continue-row">
      <div className="section-title"><h2>Your characters</h2><span className="rule" /></div>
      <div className="cr-grid">
        {favs.map((c) => {
          const d = c.data;
          const cls = classOf(d);
          const spec = specOf(cls, d.talents);
          return (
            <button key={charKey(c)} className="cr-card" style={{ '--c': cls?.color ?? 'var(--gold)' }} onClick={() => open(c)}>
              {d.images?.avatar ? <img className="ar-avatar" src={d.images.avatar} alt="" width={38} height={38} /> : cls && <ClassEmblem id={cls.id} size={30} />}
              <span className="cr-text">
                <b>{[d.name, d.surname].filter(Boolean).join(' ')}</b>
                <em>Level {d.level} {spec ? `${spec.name} ` : ''}{d.className}</em>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
