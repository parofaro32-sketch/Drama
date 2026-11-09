import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[DramaSearch] Root element #root not found in DOM');
  document.body.innerHTML = `
    <div style="padding:2rem;font-family:sans-serif;color:#333;background:#020617;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <h1>DramaSearch</h1>
      <p style="color:#ef4444">Application root element not found. Please refresh the page.</p>
    </div>
  `;
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('[DramaSearch] Fatal render error:', err);
    rootElement.innerHTML = `
      <div style="padding:2rem;font-family:sans-serif;color:#333;background:#020617;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <h1>DramaSearch</h1>
        <p style="color:#ef4444">Failed to initialize application. Please refresh the page.</p>
        <p style="color:#94a3b8;font-size:0.875rem;margin-top:0.5rem;">${String(err)}</p>
      </div>
    `;
  }
}
