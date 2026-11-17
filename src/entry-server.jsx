import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

// Usado só em build (build/prerender.js). `path` identifica a rota; hoje só existe '/'.
// Para páginas futuras (ver src/routes.js), escolha o componente de página aqui e em main.jsx.
// eslint-disable-next-line no-unused-vars
export function render(path = '/') {
  return renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
