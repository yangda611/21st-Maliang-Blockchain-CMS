/**
 * Translation Provider Component
 * Initializes the translation service with environment configuration
 */

'use client';

import { useEffect, useState } from 'react';
import { initializeTranslation, getDefaultTranslationConfig } from '@/lib/services/translation-service';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTranslation = async () => {
      try {
        const config = getDefaultTranslationConfig();
        
        // Check if required configuration is available
        if (!config.apiBaseUrl || !config.apiKey) {
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
    };

    initTranslation();
  }, []);

  // You can add error handling UI here if needed
  if (error) {
    console.warn('Translation service error:', error);
  }

  // Always render children, translation features will gracefully degrade if not initialized
  return <>{children}</>;
}
