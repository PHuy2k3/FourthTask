// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// PrimeReact
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider
    value={{
      // cấu hình mặc định an toàn
      ripple: true,
      autoZIndex: true,
      zIndex: { modal: 1100, overlay: 1000, menu: 1000, tooltip: 1100 },
      hideOverlaysOnDocumentScrolling: true,
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PrimeReactProvider>
);
