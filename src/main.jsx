import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import App from './App.jsx';
import './styles.css';
import { initAnalytics } from './lib/analytics.js';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Em produção o HTML já vem pré-renderizado (build/prerender.js): hidrata. No `npm run dev` o
// #root está vazio: renderiza do zero.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

initAnalytics();
