import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Global error handlers to catch any runtime errors outside React boundaries
const reportError = (error: unknown, source: string) => {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[${source}]`, err);
  try {
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = '';
    }
  } catch {
    // ignore
  }
};

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason, 'unhandledrejection');
});

window.addEventListener('error', (event) => {
  reportError(event.error, 'window.error');
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element #root not found in DOM');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
