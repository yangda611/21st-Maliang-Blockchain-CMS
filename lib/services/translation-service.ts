/**
 * AI Translation Service
 * Provides automatic translation functionality using AI API
 */

import type { SupportedLanguage, MultiLanguageText } from '@/types/content';

// Translation configuration
export interface TranslationConfig {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  maxRetries: number;
  timeout: number;
}

// Translation request interface
export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  contentType: 'plain' | 'markdown' | 'html';
}

// Translation response interface
export interface TranslationResponse {
  success: boolean;
  translations?: Partial<MultiLanguageText>;
  error?: string;
}

// Language mapping for AI prompts
const LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  es: 'Español'
};

class TranslationService {
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  /**
   * Generate batch translation prompt for all target languages
   */
  private generateBatchPrompt(
    content: string,
    sourceLang: SupportedLanguage,
    targetLanguages: SupportedLanguage[],
    contentType: 'plain' | 'markdown' | 'html'
  ): string {
    const sourceName = LANGUAGE_MAP[sourceLang];
    const targetNames = targetLanguages.map(lang => LANGUAGE_MAP[lang]).join('、');

    switch (contentType) {
      case 'plain':
        return `请将以下文本从${sourceName}一次性翻译为${targetNames}，返回JSON格式：

要求：
1. 只返回JSON格式的翻译结果，不要添加任何解释
2. JSON格式：{"${targetLanguages.join('": "翻译结果", "')}": "翻译结果"}
3. 确保所有语言都有翻译结果

原文：
${content}`;

      case 'markdown':
        return `请将以下Markdown内容从${sourceName}一次性翻译为${targetNames}，返回JSON格式：

要求：
1. 保持所有Markdown语法标记不变（# * \` \`\`\`等）
2. 只翻译文本内容，不翻译代码块内容
3. 保持原有的格式和结构
4. 只返回JSON格式的翻译结果，不要添加任何解释
5. JSON格式：{"${targetLanguages.join('": "翻译结果", "')}": "翻译结果"}
6. 确保所有语言都有翻译结果

原文：
${content}`;

      case 'html':
        return `请将以下HTML内容从${sourceName}一次性翻译为${targetNames}，返回JSON格式：

要求：
1. 保持所有HTML标签和属性不变
2. 只翻译标签内的文本内容
3. 不翻译HTML属性值（如href、src、class等）
4. 保持原有的HTML结构
5. 只返回JSON格式的翻译结果，不要添加任何解释
6. JSON格式：{"${targetLanguages.join('": "翻译结果", "')}": "翻译结果"}
7. 确保所有语言都有翻译结果

原文：
${content}`;

      default:
        return `请将以下内容从${sourceName}一次性翻译为${targetNames}，返回JSON格式：
{"${targetLanguages.join('": "翻译结果", "')}": "翻译结果"}

原文：
${content}`;
    }
  }

  /**
   * Generate translation prompt based on content type (legacy, for single language)
   */
  private generatePrompt(
    content: string,
    sourceLang: SupportedLanguage,
    targetLang: SupportedLanguage,
    contentType: 'plain' | 'markdown' | 'html'
  ): string {
    return this.generateBatchPrompt(content, sourceLang, [targetLang], contentType);
  }

  /**
   * Call AI API for translation
   */
  private async callAI(prompt: string): Promise<string> {
    const response = await fetch(`${this.config.apiBaseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return data.choices[0].message.content.trim();
  }

  /**
   * Translate content with retry mechanism
   */
  private async translateWithRetry(
    prompt: string,
    retries: number = 0
  ): Promise<string> {
    try {
      return await this.callAI(prompt);
    } catch (error) {
      if (retries < this.config.maxRetries) {
        console.warn(`Translation attempt ${retries + 1} failed, retrying...`, error);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
        return this.translateWithRetry(prompt, retries + 1);
      }
      throw error;
    }
  }

  /**
   * Parse JSON response from AI with enhanced error handling
   */
  private parseTranslationResponse(response: string, targetLanguages: SupportedLanguage[]): Partial<MultiLanguageText> {
    console.log('🔍 Parsing translation response:', response);
    console.log('🎯 Target languages:', targetLanguages);
    
    const translations: Partial<MultiLanguageText> = {};
    const parseErrors: string[] = [];

    // Strategy 1: Standard JSON extraction
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Standard JSON parsing successful:', parsed);
        
        for (const lang of targetLanguages) {
          if (parsed[lang] && typeof parsed[lang] === 'string' && parsed[lang].trim()) {
            translations[lang] = parsed[lang].trim();
            console.log(`✅ Found translation for ${lang}:`, translations[lang]?.substring(0, 50) + '...');
          } else {
            console.warn(`⚠️ Missing or empty translation for ${lang}`);
            parseErrors.push(`Missing translation for ${lang}`);
          }
        }
        
        if (Object.keys(translations).length > 0) {
          console.log('🎉 Successfully parsed translations:', Object.keys(translations));
          return translations;
        }
      }
    } catch (error) {
      console.warn('⚠️ Standard JSON parsing failed:', error);
      parseErrors.push(`Standard parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Strategy 2: Try to find JSON with different patterns
    const jsonPatterns = [
      /```json\s*([\s\S]*?)\s*```/,
      /```\s*([\s\S]*?)\s*```/,
      /\{[^{}]*"[^"]{2}[^"]*"[^{}]*:[^{}]*"[^"]*"[^{}]*\}/,
    ];

    for (let i = 0; i < jsonPatterns.length; i++) {
      try {
        const match = response.match(jsonPatterns[i]);
        if (match && match[1]) {
          const jsonStr = match[1].trim();
          const parsed = JSON.parse(jsonStr);
          console.log(`✅ Pattern ${i + 1} parsing successful:`, parsed);
          
          let foundTranslations = 0;
          for (const lang of targetLanguages) {
            if (parsed[lang] && typeof parsed[lang] === 'string' && parsed[lang].trim()) {
              translations[lang] = parsed[lang].trim();
              foundTranslations++;
              console.log(`✅ Found translation for ${lang} (pattern ${i + 1}):`, translations[lang]?.substring(0, 50) + '...');
            }
          }
          
          if (foundTranslations > 0) {
            console.log(`🎉 Successfully parsed ${foundTranslations} translations using pattern ${i + 1}`);
            return translations;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Pattern ${i + 1} parsing failed:`, error);
        parseErrors.push(`Pattern ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Strategy 3: Manual extraction for edge cases
    try {
      console.log('🔧 Attempting manual extraction...');
      
      // Look for language code patterns
      for (const lang of targetLanguages) {
        const patterns = [
          new RegExp(`"${lang}"\\s*:\\s*"([^"]*)"`, 'i'),
          new RegExp(`"${lang}"\\s*:\\s*'([^']*)'`, 'i'),
          new RegExp(`${lang}\\s*[:=]\\s*"([^"]*)"`, 'i'),
        ];
        
        for (const pattern of patterns) {
          const match = response.match(pattern);
          if (match && match[1] && match[1].trim()) {
            translations[lang] = match[1].trim();
            console.log(`✅ Manual extraction found translation for ${lang}:`, translations[lang]?.substring(0, 50) + '...');
            break;
          }
        }
      }
      
      if (Object.keys(translations).length > 0) {
        console.log('🎉 Manual extraction successful:', Object.keys(translations));
        return translations;
      }
    } catch (error) {
      console.warn('⚠️ Manual extraction failed:', error);
      parseErrors.push(`Manual extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // If all strategies failed, log detailed error information
    console.error('❌ All parsing strategies failed');
    console.error('📄 Original response:', response);
    console.error('🎯 Target languages:', targetLanguages);
    console.error('💥 Parse errors:', parseErrors);
    
    // Return empty translations instead of throwing to allow partial success handling
    return translations;
  }

  /**
   * Main translation method - optimized for batch translation
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const { sourceText, sourceLanguage, targetLanguages, contentType } = request;

    if (!sourceText.trim()) {
      return {
        success: false,
        error: 'Source text is empty'
      };
    }

    // Filter out source language
    const filteredTargetLanguages = targetLanguages.filter(lang => lang !== sourceLanguage);
    
    if (filteredTargetLanguages.length === 0) {
      return {
        success: false,
        error: 'No valid target languages'
      };
    }

    try {
      // Use batch translation for all languages at once
      const prompt = this.generateBatchPrompt(
        sourceText,
        sourceLanguage,
        filteredTargetLanguages,
        contentType
      );

      const response = await this.translateWithRetry(prompt);
      const translations = this.parseTranslationResponse(response, filteredTargetLanguages);

      if (Object.keys(translations).length === 0) {
        return {
          success: false,
          error: 'No translations found in response'
        };
      }

      return {
        success: true,
        translations
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Translation failed:', error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Batch translate multiple content pieces
   */
  async batchTranslate(
    requests: TranslationRequest[]
  ): Promise<TranslationResponse[]> {
    const results = await Promise.allSettled(
      requests.map(request => this.translate(request))
    );

    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });
  }

  /**
   * Check if translation service is configured
   */
  isConfigured(): boolean {
    return !!(this.config.apiBaseUrl && this.config.apiKey && this.config.model);
  }
}

// Create singleton instance
let translationService: TranslationService | null = null;

/**
 * Initialize translation service
 */
export function initializeTranslation(config: TranslationConfig): TranslationService {
  translationService = new TranslationService(config);
  return translationService;
}

/**
 * Get translation service instance
 */
export function getTranslationService(): TranslationService {
  if (!translationService) {
    throw new Error('Translation service not initialized. Call initializeTranslation first.');
  }
  return translationService;
}

/**
 * Default configuration from environment variables
 */
export function getDefaultTranslationConfig(): TranslationConfig {
  return {
    apiBaseUrl: process.env.NEXT_PUBLIC_TRANSLATION_API_BASE_URL || process.env.TRANSLATION_API_BASE_URL || 'https://api-inference.modelscope.cn/v1/chat/completions',
    apiKey: process.env.NEXT_PUBLIC_TRANSLATION_API_KEY || process.env.TRANSLATION_API_KEY || '',
    model: process.env.NEXT_PUBLIC_TRANSLATION_MODEL || process.env.TRANSLATION_MODEL || 'ZhipuAI/GLM-4.5',
    maxRetries: 3,
    timeout: 30000,
  };
}
