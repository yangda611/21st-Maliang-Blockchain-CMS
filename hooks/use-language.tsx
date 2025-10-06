/**
 * useLanguage Hook
 * Multi-language state management
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { SupportedLanguage } from '@/types/content';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_ADMIN_LANGUAGE,
  DEFAULT_FRONTEND_LANGUAGE,
  detectLanguageFromBrowser,
  getContentWithFallback,
  isContentAvailable,
  getMissingLanguages,
  getTranslationCompleteness,
  getLanguageDirection,
  getLanguageDisplayName,
} from '@/utils/language-detection';
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isAdmin: boolean;
  supportedLanguages: SupportedLanguage[];
  getContent: (content: Record<string, string> | undefined) => string;
  isAvailable: (content: Record<string, string> | undefined) => boolean;
  getMissing: (content: Record<string, string> | undefined) => SupportedLanguage[];
  getCompleteness: (content: Record<string, string> | undefined) => number;
  direction: 'ltr' | 'rtl';
  displayName: string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider props
interface LanguageProviderProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  initialLanguage?: SupportedLanguage;
}

/**
 * Language Provider Component
 * Wrap your app with this to provide language context
 */
export function LanguageProvider({
  children,
  isAdmin = false,
  initialLanguage,
}: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    if (initialLanguage) {
      return initialLanguage;
    }

    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferred-language');
      if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
      }

      // Detect from browser
      if (typeof navigator !== 'undefined' && navigator.language) {
        const detected = detectLanguageFromBrowser(navigator.language);
        return detected;
      }
    }

    // Default language based on context
    return isAdmin ? DEFAULT_ADMIN_LANGUAGE : DEFAULT_FRONTEND_LANGUAGE;
  });

  // Save language preference
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', lang);
      // Update HTML lang attribute
      document.documentElement.lang = lang;
      // Update direction
      document.documentElement.dir = getLanguageDirection(lang);
    }
  }, []);

  // Get content with fallback
  const getContent = useCallback(
    (content: Record<string, string> | undefined) => {
      return getContentWithFallback(content, currentLanguage);
    },
    [currentLanguage]
  );

  // Check if content is available
  const isAvailable = useCallback(
    (content: Record<string, string> | undefined) => {
      return isContentAvailable(content, currentLanguage);
    },
    [currentLanguage]
  );

  // Get missing languages
  const getMissing = useCallback((content: Record<string, string> | undefined) => {
    return getMissingLanguages(content);
  }, []);

  // Get translation completeness
  const getCompleteness = useCallback((content: Record<string, string> | undefined) => {
    return getTranslationCompleteness(content);
  }, []);

  // Update HTML attributes on language change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = getLanguageDirection(currentLanguage);
    }
  }, [currentLanguage]);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isAdmin,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getContent,
    isAvailable,
    getMissing,
    getCompleteness,
    direction: getLanguageDirection(currentLanguage),
    displayName: getLanguageDisplayName(currentLanguage),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * useLanguage Hook
 * Access language context and utilities
 */
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}

/**
 * useContentTranslation Hook
 * Simplified hook for getting translated content
 */
export function useContentTranslation() {
  const { currentLanguage, getContent } = useLanguage();

  const t = useCallback(
    (content: Record<string, string> | undefined, fallback?: string) => {
      const translated = getContent(content);
      return translated || fallback || '';
    },
    [getContent]
  );

  return { t, language: currentLanguage };
}

/**
 * useLanguageDetection Hook
 * Detect and set language based on various sources
 */
export function useLanguageDetection() {
  const { setLanguage } = useLanguage();

  // Detect from IP (requires server-side implementation)
  const detectFromIP = useCallback(
    async (ipAddress: string) => {
      try {
        // TODO: Implement IP-based detection
        // const detected = await detectLanguageFromIP(ipAddress);
        // setLanguage(detected);
        console.log('IP-based detection not yet implemented');
      } catch (error) {
        console.error('Failed to detect language from IP:', error);
      }
    },
    [setLanguage]
  );

  // Detect from browser
  const detectFromBrowser = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const detected = detectLanguageFromBrowser(navigator.language);
      setLanguage(detected);
    }
  }, [setLanguage]);

  return {
    detectFromIP,
    detectFromBrowser,
  };
}

/**
 * useLanguageSwitcher Hook
 * Utilities for language switching UI
 */
export function useLanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();

  const languages = supportedLanguages.map((lang) => ({
    code: lang,
    name: getLanguageDisplayName(lang, 'english'),
    nativeName: getLanguageDisplayName(lang, 'native'),
    isActive: lang === currentLanguage,
  }));

  const switchLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setLanguage(lang);
      // Also update the URL to reflect the new language with proper navigation
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/').filter(Boolean);

        // Remove existing language prefix if present
        if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as SupportedLanguage)) {
          segments.shift();
        }

        // Add new language prefix
        const newPath = segments.length > 0 ? `/${lang}/${segments.join('/')}` : `/${lang}`;

        // Check if we're in admin panel - if so, don't reload the page
        if (currentPath.includes('/maliang-admin') || currentPath.includes('/admin')) {
          // Update URL without page reload using history API
          window.history.pushState({}, '', newPath);
        } else {
          // Use window.location for proper navigation on frontend
          window.location.href = newPath;
        }
      }
    },
    [setLanguage]
  );

  return {
    languages,
    currentLanguage,
    switchLanguage,
  };
}
