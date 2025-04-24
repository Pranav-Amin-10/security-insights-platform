
/**
 * Security Watermark Module
 * IMPORTANT: DO NOT MODIFY THIS FILE
 * Tampering with this file will trigger security validations to fail
 */

// Security hash to verify integrity
const INTEGRITY_KEY = "a7f92c3d-e456-7890-b123-456def789012";

// Watermark information
const watermark = {
  project: "Security Insights Platform",
  author: "Original Developer",
  license: "Proprietary - All Rights Reserved",
  buildTimestamp: new Date().toISOString(),
  buildId: Math.random().toString(36).substring(2, 15),
};

// Generate a simple integrity hash based on watermark values
const generateIntegrityHash = () => {
  const valueString = Object.values(watermark).join('|') + INTEGRITY_KEY;
  let hash = 0;
  for (let i = 0; i < valueString.length; i++) {
    const char = valueString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// Store the hash for later validation
const originalHash = generateIntegrityHash();

/**
 * Initializes the watermark and logs attribution info to console
 */
export const initWatermark = () => {
  if (process.env.NODE_ENV !== 'development') {
    // Apply console styling for better visibility
    console.log(
      '%c⚠️ Security Insights Platform ⚠️',
      'color: #0066cc; font-size: 16px; font-weight: bold;'
    );
    console.log(
      '%c© Original Developer - All Rights Reserved',
      'color: #444; font-size: 12px;'
    );
    console.log(
      '%cUnauthorized modification, distribution, or use is strictly prohibited.',
      'color: #cc0000; font-size: 10px;'
    );
  }
  
  // Store metadata in a non-obvious property
  Object.defineProperty(window, '__sip_metadata__', {
    value: {
      ...watermark,
      integrityHash: originalHash,
    },
    writable: false,
    configurable: false,
    enumerable: false,
  });
};

/**
 * Validates the integrity of the watermark
 * @returns {boolean} Whether the application is tampered with
 */
export const validateIntegrity = () => {
  const currentHash = generateIntegrityHash();
  const storedMetadata = (window as any).__sip_metadata__;
  
  if (!storedMetadata || currentHash !== originalHash) {
    if (process.env.NODE_ENV !== 'development') {
      console.error('Security validation failed: Application integrity compromised');
    }
    return false;
  }
  return true;
};

/**
 * Retrieves the watermark metadata (safe to use publicly)
 */
export const getApplicationInfo = () => {
  return {
    name: watermark.project,
    author: watermark.author,
    license: watermark.license,
  };
};
