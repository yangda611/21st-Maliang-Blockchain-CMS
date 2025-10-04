/**
 * Language Detection Utility
 * Handles IP-based language detection and fallback logic
 */

import type { SupportedLanguage } from '@/types/content';

// Supported languages configuration
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['zh', 'en', 'ja', 'ko', 'ar', 'es'];

export const LANGUAGE_CONFIG = {
  zh: { name: 'Chinese', nativeName: '中文', direction: 'ltr' as const },
  en: { name: 'English', nativeName: 'English', direction: 'ltr' as const },
  ja: { name: 'Japanese', nativeName: '日本語', direction: 'ltr' as const },
  ko: { name: 'Korean', nativeName: '한국어', direction: 'ltr' as const },
  ar: { name: 'Arabic', nativeName: 'العربية', direction: 'rtl' as const },
  es: { name: 'Spanish', nativeName: 'Español', direction: 'ltr' as const },
};

// Default languages
export const DEFAULT_ADMIN_LANGUAGE: SupportedLanguage = 'zh';
export const DEFAULT_FRONTEND_LANGUAGE: SupportedLanguage = 'en';

// Country to language mapping
const COUNTRY_LANGUAGE_MAP: Record<string, SupportedLanguage> = {
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  JP: 'ja',
  KR: 'ko',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CL: 'es',
  CO: 'es',
};

/**
 * Detect language from IP address using geolocation
 * @param ipAddress - User's IP address
 * @returns Detected language code
 */
export async function detectLanguageFromIP(ipAddress: string): Promise<SupportedLanguage> {
  try {
    // In production, use a geolocation service like ipapi.co or ip-api.com
    // For now, return default language
    // Example API call:
    // const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    // const data = await response.json();
    // const countryCode = data.country_code;
    
    // Simulate country detection (replace with actual API call)
    const countryCode = await getCountryFromIP(ipAddress);
    
    return COUNTRY_LANGUAGE_MAP[countryCode] || DEFAULT_FRONTEND_LANGUAGE;
  } catch (error) {
    console.error('Language detection from IP failed:', error);
    return DEFAULT_FRONTEND_LANGUAGE;
  }
}

/**
 * Get country code from IP address
 * @param ipAddress - User's IP address
 * @returns Country code
 */
async function getCountryFromIP(ipAddress: string): Promise<string> {
  // TODO: Implement actual geolocation API call
  // Example using ipapi.co:
  // const response = await fetch(`https://ipapi.co/${ipAddress}/country/`);
  // return await response.text();
  
  // For development, return default
  return 'US';
}

/**
 * Detect language from browser settings
 * @param acceptLanguage - Accept-Language header value
 * @returns Detected language code
 */
export function detectLanguageFromBrowser(acceptLanguage: string): SupportedLanguage {
  if (!acceptLanguage) {
    return DEFAULT_FRONTEND_LANGUAGE;
  }

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = '1'] = lang.trim().split(';q=');
      return { code: code.split('-')[0].toLowerCase(), quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const { code } of languages) {
    if (SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)) {
      return code as SupportedLanguage;
    }
  }

  return DEFAULT_FRONTEND_LANGUAGE;
}

/**
 * Get content with language fallback
 * Priority: requested language > English > Chinese
 * @param content - Multi-language content object
 * @param requestedLang - Requested language code
 * @returns Content in best available language
 */
export function getContentWithFallback(
  content: Record<string, string> | undefined,
  requestedLang: SupportedLanguage
): string {
  if (!content) {
    return '';
  }

  // Try requested language
  if (content[requestedLang]) {
    return content[requestedLang];
  }

  // Fallback to English
  if (content['en']) {
    return content['en'];
  }

  // Fallback to Chinese
  if (content['zh']) {
    return content['zh'];
  }

  // Return first available language
  const firstAvailable = Object.values(content)[0];
  return firstAvailable || '';
}

/**
 * Check if content is available in requested language
 * @param content - Multi-language content object
 * @param language - Language code to check
 * @returns True if content exists in language
 */
export function isContentAvailable(
  content: Record<string, string> | undefined,
  language: SupportedLanguage
): boolean {
  return Boolean(content && content[language]);
}

/**
 * Get missing languages for content
 * @param content - Multi-language content object
 * @returns Array of missing language codes
 */
export function getMissingLanguages(
  content: Record<string, string> | undefined
): SupportedLanguage[] {
  if (!content) {
    return SUPPORTED_LANGUAGES;
  }

  return SUPPORTED_LANGUAGES.filter((lang) => !content[lang]);
}

/**
 * Calculate translation completeness percentage
 * @param content - Multi-language content object
 * @returns Percentage of completed translations (0-100)
 */
export function getTranslationCompleteness(
  content: Record<string, string> | undefined
): number {
  if (!content) {
    return 0;
  }

  const completedCount = SUPPORTED_LANGUAGES.filter((lang) => content[lang]).length;
  return Math.round((completedCount / SUPPORTED_LANGUAGES.length) * 100);
}

/**
 * Validate language code
 * @param code - Language code to validate
 * @returns True if language is supported
 */
export function isValidLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}

/**
 * Get language direction (LTR or RTL)
 * @param language - Language code
 * @returns Text direction
 */
export function getLanguageDirection(language: SupportedLanguage): 'ltr' | 'rtl' {
  return LANGUAGE_CONFIG[language]?.direction || 'ltr';
}

/**
 * Format language display name
 * @param language - Language code
 * @param inLanguage - Language to display name in
 * @returns Formatted language name
 */
export function getLanguageDisplayName(
  language: SupportedLanguage,
  inLanguage: 'native' | 'english' = 'native'
): string {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return language;
  }

  return inLanguage === 'native' ? config.nativeName : config.name;
}
