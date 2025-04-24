
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSecurityFeatures, scheduleIntegrityChecks } from './lib/security/init'

// Initialize security features before rendering the app
initSecurityFeatures();

// Render the application
createRoot(document.getElementById("root")!).render(<App />);

// Schedule periodic integrity checks
scheduleIntegrityChecks();
