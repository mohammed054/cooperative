import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Reset scroll to top on page load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  history.scrollRestoration = 'manual';
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
