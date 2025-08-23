const { normalizeEmail, isValidEmailFormat, extractDomain } = require('../src/utils/normalizeEmail');

describe('Email normalization utilities', () => {
  describe('normalizeEmail', () => {
    test('lowercases address', () => {
      expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
    });

    test('trims whitespace', () => {
      expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
    });

    test('returns null for invalid email', () => {
      expect(normalizeEmail('not-an-email')).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(normalizeEmail('')).toBeNull();
    });

    test('returns null for null value', () => {
      expect(normalizeEmail(null)).toBeNull();
    });

    test('handles valid email with mixed case', () => {
      expect(normalizeEmail('User@Example.Com')).toBe('user@example.com');
    });
  });

  describe('isValidEmailFormat', () => {
    test('valid email format', () => {
      expect(isValidEmailFormat('user@example.com')).toBe(true);
    });

    test('invalid email format', () => {
      expect(isValidEmailFormat('not-an-email')).toBe(false);
    });

    test('empty string', () => {
      expect(isValidEmailFormat('')).toBe(false);
    });

    test('null value', () => {
      expect(isValidEmailFormat(null)).toBe(false);
    });

    test('email with spaces', () => {
      expect(isValidEmailFormat('user @example.com')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    test('extracts domain from valid email', () => {
      expect(extractDomain('user@example.com')).toBe('example.com');
    });

    test('returns null for invalid email', () => {
      expect(extractDomain('not-an-email')).toBeNull();
    });

    test('handles complex domain', () => {
      expect(extractDomain('user@sub.example.co.uk')).toBe('sub.example.co.uk');
    });

    test('returns null for null value', () => {
      expect(extractDomain(null)).toBeNull();
    });
  });
});
