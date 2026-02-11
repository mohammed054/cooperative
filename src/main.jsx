import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import initErrorMonitoring from './utils/errorMonitoring'

// Initialize error monitoring
initErrorMonitoring()

// Disable scroll restoration
history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
