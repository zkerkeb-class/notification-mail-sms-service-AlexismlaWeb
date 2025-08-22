/**
 * Email normalization utilities
 */

/**
 * Normalizes an email address
 * @param {string} email - The email to normalize
 * @returns {string} - Normalized email or null if invalid
 */
function normalizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  // Trim whitespace and convert to lowercase
  const normalized = email.trim().toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return null;
  }

  return normalized;
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmailFormat(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Extracts domain from email
 * @param {string} email - The email address
 * @returns {string|null} - Domain or null if invalid
 */
function extractDomain(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return null;
  }

  return normalized.split('@')[1];
}

module.exports = {
  normalizeEmail,
  isValidEmailFormat,
  extractDomain
};
