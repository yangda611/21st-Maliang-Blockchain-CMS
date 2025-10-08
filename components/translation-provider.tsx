/**
 * Translation Provider Component
 * Initializes the translation service with environment configuration
 * 优化版本：使用记忆化和更好的性能管理
 */

'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { initializeTranslation, getDefaultTranslationConfig } from '@/lib/services/translation-service';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 记忆化配置检查
  const checkConfig = useCallback(() => {
    const config = getDefaultTranslationConfig();
    return {
      isValid: !!(config.apiBaseUrl && config.apiKey),
      config
    };
  }, []);

  // 记忆化初始化逻辑
  const initTranslation = useCallback(async () => {
    try {
      const { isValid, config } = checkConfig();
      
      // Check if required configuration is available
      if (!isValid) {
        console.warn('Translation service configuration is incomplete');
        setError('Translation service configuration is incomplete');
        setIsInitialized(true);
        return;
      }

      // Initialize the translation service
      initializeTranslation(config);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize translation service';
      console.error('Translation service initialization failed:', errorMessage);
      setError(errorMessage);
      setIsInitialized(true); // Still mark as initialized to prevent infinite loading
    }
  }, [checkConfig]);

  useEffect(() => {
    initTranslation();
  }, [initTranslation]);

  // 记忆化错误处理
  const handleError = useCallback(() => {
    if (error) {
      console.warn('Translation service error:', error);
    }
  }, [error]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  // Always render children, translation features will gracefully degrade if not initialized
  return <>{children}</>;
}
