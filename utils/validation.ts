/**
 * Form Validation Utilities
 * Reusable validation functions for CMS forms
 */

import type { MultiLanguageText, SupportedLanguage } from '@/types/content';

// Validation result type
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
    return { valid: false, errors };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate phone number
 * @param phone - Phone number to validate
 * @param required - Whether phone is required
 * @returns Validation result
 */
export function validatePhone(phone: string, required: boolean = false): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    if (required) {
      errors.push('Phone number is required');
    }
    return { valid: !required, errors };
  }

  // Allow various phone formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    errors.push('Invalid phone number format');
  }

  if (phone.replace(/\D/g, '').length < 10) {
    errors.push('Phone number must be at least 10 digits');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate URL
 * @param url - URL to validate
 * @param required - Whether URL is required
 * @returns Validation result
 */
export function validateUrl(url: string, required: boolean = false): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    if (required) {
      errors.push('URL is required');
    }
    return { valid: !required, errors };
  }

  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate slug
 * @param slug - Slug to validate
 * @returns Validation result
 */
export function validateSlug(slug: string): ValidationResult {
  const errors: string[] = [];

  if (!slug) {
    errors.push('Slug is required');
    return { valid: false, errors };
  }

  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  if (slug.length > 100) {
    errors.push('Slug must be less than 100 characters');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate multi-language text
 * @param text - Multi-language text object
 * @param requiredLanguages - Languages that must have content
 * @returns Validation result
 */
export function validateMultiLanguageText(
  text: MultiLanguageText | undefined,
  requiredLanguages: SupportedLanguage[] = ['zh', 'en']
): ValidationResult {
  const errors: string[] = [];

  if (!text) {
    errors.push('Content is required');
    return { valid: false, errors };
  }

  for (const lang of requiredLanguages) {
    if (!text[lang] || text[lang].trim() === '') {
      errors.push(`Content in ${lang} is required`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate text length
 * @param text - Text to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateTextLength(
  text: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'Text'
): ValidationResult {
  const errors: string[] = [];

  if (!text) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors };
  }

  if (text.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters`);
  }

  if (text.length > maxLength) {
    errors.push(`${fieldName} must be less than ${maxLength} characters`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value === undefined || value === null || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate number range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): ValidationResult {
  const errors: string[] = [];

  if (isNaN(value)) {
    errors.push(`${fieldName} must be a number`);
    return { valid: false, errors };
  }

  if (value < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }

  if (value > max) {
    errors.push(`${fieldName} must be at most ${max}`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate date
 * @param date - Date string to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateDate(date: string, fieldName: string = 'Date'): ValidationResult {
  const errors: string[] = [];

  if (!date) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push(`${fieldName} is not a valid date`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate future date
 * @param date - Date string to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateFutureDate(date: string, fieldName: string = 'Date'): ValidationResult {
  const dateValidation = validateDate(date, fieldName);
  if (!dateValidation.valid) {
    return dateValidation;
  }

  const errors: string[] = [];
  const dateObj = new Date(date);
  const now = new Date();

  if (dateObj <= now) {
    errors.push(`${fieldName} must be in the future`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate image file
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): ValidationResult {
  const errors: string[] = [];

  if (!file) {
    errors.push('Image file is required');
    return { valid: false, errors };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('File must be an image (JPEG, PNG, WebP, or GIF)');
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with strength indicator
 */
export function validatePassword(password: string): ValidationResult & { strength?: string } {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  // Calculate strength
  let strength = 'weak';
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return { valid: errors.length === 0, errors, strength };
}

/**
 * Validate array not empty
 * @param array - Array to validate
 * @param fieldName - Field name for error messages
 * @returns Validation result
 */
export function validateArrayNotEmpty(array: any[], fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (!array || array.length === 0) {
    errors.push(`${fieldName} must have at least one item`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Combine multiple validation results
 * @param results - Array of validation results
 * @returns Combined validation result
 */
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap((result) => result.errors);
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Sanitize HTML input to prevent XSS
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

/**
 * Validate sensitive words filter
 * @param text - Text to check
 * @param sensitiveWords - Array of sensitive words
 * @returns Validation result
 */
export function validateSensitiveWords(
  text: string,
  sensitiveWords: string[]
): ValidationResult {
  const errors: string[] = [];
  const lowerText = text.toLowerCase();

  const foundWords = sensitiveWords.filter((word) => lowerText.includes(word.toLowerCase()));

  if (foundWords.length > 0) {
    errors.push(`Content contains sensitive words: ${foundWords.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}
