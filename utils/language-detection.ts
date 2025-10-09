/**
 * Language Detection Utility
 * Handles IP-based language detection and fallback logic
 */

import type { SupportedLanguage } from '@/types/content';
import { geoLocationCache } from '@/lib/cache';

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
    // Check cache first
    const cacheKey = `country_${ipAddress}`;
    const cachedCountry = geoLocationCache.get(cacheKey) as string;
    
    if (cachedCountry) {
      return COUNTRY_LANGUAGE_MAP[cachedCountry] || DEFAULT_FRONTEND_LANGUAGE;
    }

    // Get country from IP
    const countryCode = await getCountryFromIP(ipAddress);
    
    // Cache the result
    geoLocationCache.set(cacheKey, countryCode);
    
    return COUNTRY_LANGUAGE_MAP[countryCode] || DEFAULT_FRONTEND_LANGUAGE;
  } catch (error) {
    console.error('Language detection from IP failed:', error);
    return DEFAULT_FRONTEND_LANGUAGE;
  }
}

/**
 * Get country code from IP address using ip-api.com
 * @param ipAddress - User's IP address
 * @returns Country code
 */
async function getCountryFromIP(ipAddress: string): Promise<string> {
  try {
    // Skip localhost and private IPs
    if (isPrivateIP(ipAddress) || isLocalhost(ipAddress)) {
      // For development, check if there's a simulated IP in environment or cache
      if (process.env.NODE_ENV === 'development') {
        const simulatedIP = process.env.SIMULATE_IP_FOR_TESTING;
        if (simulatedIP) {
          console.log(`Development mode: Using simulated IP ${simulatedIP} instead of localhost ${ipAddress}`);
          return await getCountryFromIP(simulatedIP);
        }
      }
      return 'US'; // Default for development
    }

    // Normalize IPv6 addresses for API compatibility
    let normalizedIP = ipAddress;
    if (isIPv6(ipAddress)) {
      normalizedIP = normalizeIPv6ForAPI(ipAddress);
      console.log(`IPv6 address detected: ${ipAddress} -> normalized to: ${normalizedIP}`);
      
      // If we still have an IPv6 address after normalization and it's not localhost
      // we need to handle it specially since most APIs don't support IPv6 geolocation
      if (isIPv6(normalizedIP)) {
        console.log(`IPv6 address ${normalizedIP} not supported by geolocation API, using default`);
        return 'US'; // Default for unsupported IPv6
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`http://ip-api.com/json/${normalizedIP}?fields=status,countryCode`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Maliang-CMS/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === 'success' && data.countryCode) {
      return data.countryCode.toUpperCase();
    }

    throw new Error('Invalid response from ip-api.com');
  } catch (error) {
    console.error('Failed to get country from IP:', error, {
      originalIP: ipAddress,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown'
    });
    return 'US'; // Default fallback
  }
}

/**
 * Check if IP address is IPv6
 * @param ipAddress - IP address to check
 * @returns True if IP is IPv6
 */
function isIPv6(ipAddress: string): boolean {
  return ipAddress.includes(':');
}

/**
 * Normalize IPv6 address for API compatibility
 * @param ipAddress - IPv6 address
 * @returns Normalized IPv4-compatible address or string for API
 */
function normalizeIPv6ForAPI(ipAddress: string): string {
  // For localhost IPv6
  if (ipAddress === '::1' || ipAddress === '0:0:0:0:0:0:0:1') {
    return '127.0.0.1'; // Convert to IPv4 localhost for API compatibility
  }
  
  // For IPv4-mapped IPv6 addresses (::ffff:x.x.x.x)
  const ipv4Match = ipAddress.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
  if (ipv4Match) {
    return ipv4Match[1];
  }
  
  // For other IPv6 addresses, return a special handling
  // Some geolocation APIs don't support IPv6, so we'll use a fallback
  return ipAddress;
}

/**
 * Check if IP address is private/local
 * @param ipAddress - IP address to check
 * @returns True if IP is private
 */
function isPrivateIP(ipAddress: string): boolean {
  // Check for private IPv4 ranges
  const privateIPv4Ranges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
  ];

  // Check for private IPv6 ranges
  const privateIPv6Ranges = [
    /^::1$/,           // IPv6 localhost
    /^fc00:/,          // Unique local address
    /^fe80:/,          // Link-local address
    /^::ffff:10:/,     // IPv4-mapped private network 10.0.0.0/8
    /^::ffff:172\.(1[6-9]|2[0-9]|3[0-1])/, // IPv4-mapped private network 172.16.0.0/12
    /^::ffff:192\.168\./, // IPv4-mapped private network 192.168.0.0/16
    /^::ffff:127\./,   // IPv4-mapped localhost
    /^::ffff:169\.254\./, // IPv4-mapped link-local
  ];

  return privateIPv4Ranges.some(range => range.test(ipAddress)) ||
         privateIPv6Ranges.some(range => range.test(ipAddress));
}

/**
 * Check if IP address is localhost
 * @param ipAddress - IP address to check
 * @returns True if IP is localhost
 */
function isLocalhost(ipAddress: string): boolean {
  return ipAddress === 'localhost' || 
         ipAddress === '::1' || 
         ipAddress === '0:0:0:0:0:0:0:1' ||
         ipAddress.startsWith('127.') ||
         ipAddress === '0.0.0.0';
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
