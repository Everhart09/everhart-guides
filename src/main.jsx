import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './app.css';
import App from './App.jsx';
import { applyAppearance, watchSystem } from './lib/prefs.js';

// Theme, density and text size go on before the first render so there's no flash of the wrong theme.
applyAppearance();
watchSystem();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
