/**
 * Language Context and Provider
 * Manages current language state and language switching functionality
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Supported languages
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko', 'ar', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Language names for display
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  es: 'Español',
};

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE
}: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load translations for current language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${currentLanguage}.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(flattenObject(data));
        } else {
          console.warn(`Failed to load translations for ${currentLanguage}`);
          setTranslations({});
        }
      } catch (error) {
        console.error('Error loading translations:', error);
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  // Flatten nested translation object for easier access
  function flattenObject(obj: any, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};

    Object.keys(obj).forEach(key => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    });

    return flattened;
  }

  // Translation function
  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  // Change language and update URL
  const setLanguage = (language: SupportedLanguage) => {
    if (language === currentLanguage) return;

    setCurrentLanguage(language);

    // Update URL to include language prefix
    const currentPath = pathname;
    const segments = currentPath.split('/').filter(Boolean);

    // Remove existing language prefix if present
    if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as SupportedLanguage)) {
      segments.shift();
    }

    // Add new language prefix
    const newPath = segments.length > 0 ? `/${language}/${segments.join('/')}` : `/${language}`;

    // Use router.push for client-side navigation
    router.push(newPath);

    // Update cookie for persistence
    document.cookie = `maliang-language=${language}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isLoading,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook for server-side language detection
export function getServerLanguage(request: Request): SupportedLanguage {
  // Check URL path for language prefix
  const url = new URL(request.url);
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }

  // Check accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.trim().split(';')[0].toLowerCase());

    for (const lang of languages) {
      if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
        return lang as SupportedLanguage;
      }

      // Handle language variants
      const baseLang = lang.split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(baseLang as SupportedLanguage)) {
        return baseLang as SupportedLanguage;
      }
    }
  }

  return DEFAULT_LANGUAGE;
}

// Utility function to get language from pathname
export function getLanguageFromPath(pathname: string): SupportedLanguage | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage;
  }

  return null;
}

// Utility function to remove language prefix from path
export function removeLanguagePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as SupportedLanguage)) {
    segments.shift();
  }
  return segments.length > 0 ? `/${segments.join('/')}` : '/';
}
