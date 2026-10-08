import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './styles.css';
import './styles-professions.css';
import './styles-features.css';
import './styles-tools.css';
import './styles-theme.css';
import './styles-extras.css';
import App from './App.jsx';
import { applyAppearance, watchSystem } from './lib/prefs.js';

// Theme, density and text size go on before the first render so there's no flash of the wrong theme.
document.documentElement.dataset.platform = globalThis.everhart?.platform ?? 'web';
applyAppearance();
watchSystem();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
