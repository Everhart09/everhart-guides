import { useState } from 'react';
import { ClassIcon } from './icons.jsx';
import { classIcon, professionIcon } from '../lib/icons.js';

/** A bundled game icon image; renders `fallback` if the image is missing or fails to load. */
export function GameIcon({ src, size = 24, className = '', fallback = null, alt = '' }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return fallback;
  return (
    <img className={`game-icon ${className}`} src={src} width={size} height={size} alt={alt}
      draggable={false} onError={() => setFailed(true)} />
  );
}

export function ClassEmblem({ id, size = 20, className = '' }) {
  return <GameIcon src={classIcon(id)} size={size} className={className}
    fallback={<ClassIcon id={id} size={size} className={className} />} />;
}

export function ProfessionEmblem({ id, size = 20, className = '' }) {
  return <GameIcon src={professionIcon(id)} size={size} className={className}
    fallback={<span className={`prof-glyph ${className}`} style={{ width: size, height: size }}>{id[0].toUpperCase()}</span>} />;
}
