
import { initWatermark, validateIntegrity } from './watermark';

/**
 * Initialize security features and validate application integrity
 */
export const initSecurityFeatures = () => {
  try {
    // Initialize watermarking
    initWatermark();
    
    // Validate application integrity
    const isValid = validateIntegrity();
    
    if (!isValid && process.env.NODE_ENV !== 'development') {
      // In production, we could take more drastic measures here
      // For now, we'll just log warnings and let the app continue
      console.error(
        '%cSECURITY ALERT: This application appears to be tampered with or running in an unauthorized environment.',
        'color: red; font-size: 14px; font-weight: bold;'
      );
    }
    
    // Additional runtime checks could be added here
  } catch (error) {
    // Log error but don't crash the app
    console.error('Failed to initialize security features:', error);
  }
};

// Schedule periodic integrity checks
export const scheduleIntegrityChecks = () => {
  // Perform checks at random intervals to make tampering harder
  const scheduleNextCheck = () => {
    const randomInterval = Math.floor(Math.random() * 300000) + 300000; // 5-10 minutes
    setTimeout(() => {
      validateIntegrity();
      scheduleNextCheck();
    }, randomInterval);
  };
  
  scheduleNextCheck();
};
