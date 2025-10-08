/**
 * Language Updater Component
 * 轻量级的语言更新器，用于更新语言状态而不重复创建Provider
 */

'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import type { SupportedLanguage } from '@/types/content';

interface LanguageUpdaterProps {
  language: SupportedLanguage;
  children: React.ReactNode;
}

export function LanguageUpdater({ language, children }: LanguageUpdaterProps) {
  const { setLanguage } = useLanguage();

  useEffect(() => {
    // 只更新语言状态，不重新创建Provider
    setLanguage(language);
  }, [language, setLanguage]);

  return <>{children}</>;
}
