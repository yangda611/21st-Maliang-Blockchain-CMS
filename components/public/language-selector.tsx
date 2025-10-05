/**
 * Language Selector Component
 * Allows users to switch between supported languages
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguageSwitcher } from '@/hooks/use-language';

export default function LanguageSelector() {
  const { languages, currentLanguage, switchLanguage } = useLanguageSwitcher();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode: string) => {
    switchLanguage(languageCode as any);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.isActive);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
        aria-label="Select language"
      >
        <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-white/60" />
        <span className="text-xs sm:text-sm text-white/80 hidden xs:block">
          {currentLang?.nativeName || currentLang?.name || currentLanguage}
        </span>
        <ChevronDown className={`h-3 w-3 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-black border border-white/20 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors ${
                    language.isActive ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm font-medium text-white">
                      {language.nativeName}
                    </span>
                    <span className="text-xs text-white/60 uppercase hidden sm:block">
                      {language.code}
                    </span>
                  </div>
                  {language.isActive && (
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
