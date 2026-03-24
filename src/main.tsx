import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ── Styles (order matters) ──────────────────────────────
import './styles/variables.css';  // 1. CSS custom properties
import './styles/global.css';     // 2. Reset & base
import './styles/tailwind.css';   // 3. Tailwind directives

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
