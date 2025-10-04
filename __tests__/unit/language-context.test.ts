/**
 * Unit Tests for Language Context
 * Tests multi-language functionality
 */

import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/language-context';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/zh',
}));

describe('Language Context', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should initialize with default language', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    expect(result.current.currentLanguage).toBe(DEFAULT_LANGUAGE);
    expect(result.current.isLoading).toBe(true);
  });

  it('should support all supported languages', () => {
    SUPPORTED_LANGUAGES.forEach(lang => {
      expect(SUPPORTED_LANGUAGES).toContain(lang);
    });
  });

  it('should change language correctly', async () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    await act(async () => {
      result.current.setLanguage('en');
    });

    expect(result.current.currentLanguage).toBe('en');
  });

  it('should load translations for current language', async () => {
    // Mock fetch for translation loading
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          common: { test: '测试' },
          nav: { home: '首页' }
        }),
      })
    ) as jest.MockedFunction<typeof fetch>;

    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    // Wait for translations to load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.t('common.test')).toBe('测试');
  });

  it('should handle translation fallback', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.MockedFunction<typeof fetch>;

    const { result } = renderHook(() => useLanguage(), {
      wrapper: ({ children }) => (
        <LanguageProvider>{children}</LanguageProvider>
      ),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.t('nonexistent.key', 'fallback')).toBe('fallback');
  });
});
