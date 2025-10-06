/**
 * Universal Translation Hook
 * Provides translation functionality with state management and caching
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { SupportedLanguage, MultiLanguageText } from '@/types/content';
import { 
  getTranslationService, 
  type TranslationRequest, 
  type TranslationResponse,
  type TranslationConfig 
} from '@/lib/services/translation-service';

export type ContentType = 'plain' | 'markdown' | 'html';

export interface UseTranslationOptions {
  autoSave?: boolean;
  cacheEnabled?: boolean;
  batchSize?: number;
  onSuccess?: (translations: Partial<MultiLanguageText>) => void;
  onError?: (error: string) => void;
  onProgress?: (language: SupportedLanguage, progress: number) => void;
}

export interface TranslationProgress {
  [language: string]: number;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguages: SupportedLanguage[];
  contentType: ContentType;
  translations: Partial<MultiLanguageText>;
  timestamp: Date;
  duration: number;
}

export interface UseTranslationReturn {
  // 状态管理
  isTranslating: boolean;
  translatingLanguages: Set<SupportedLanguage>;
  translationProgress: TranslationProgress;
  translationError: string | null;
  translationHistory: TranslationHistoryItem[];
  
  // 翻译方法
  translateToLanguage: (
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    sourceText: string,
    contentType: ContentType
  ) => Promise<TranslationResponse>;
  
  translateToAll: (
    sourceLanguage: SupportedLanguage,
    sourceText: string,
    contentType: ContentType,
    targetLanguages?: SupportedLanguage[]
  ) => Promise<TranslationResponse>;
  
  batchTranslate: (
    requests: TranslationRequest[]
  ) => Promise<TranslationResponse[]>;
  
  // 状态控制
  clearError: () => void;
  cancelTranslation: () => void;
  clearHistory: () => void;
  
  // 工具方法
  getTranslationHistory: () => TranslationHistoryItem[];
  isLanguageTranslating: (language: SupportedLanguage) => boolean;
  getTranslationProgress: (language: SupportedLanguage) => number;
}

// 简单的内存缓存实现
class TranslationCache {
  private cache = new Map<string, { response: TranslationResponse; timestamp: number }>();
  private readonly maxAge = 24 * 60 * 60 * 1000; // 24小时
  private readonly maxSize = 1000;

  generateKey(
    sourceText: string,
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    contentType: ContentType
  ): string {
    try {
      return `${sourceLanguage}-${targetLanguage}-${contentType}-${btoa(unescape(encodeURIComponent(sourceText))).slice(0, 50)}`;
    } catch {
      // Fallback for non-browser environments
      return `${sourceLanguage}-${targetLanguage}-${contentType}-${sourceText.slice(0, 50)}`;
    }
  }

  get(key: string): TranslationResponse | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.response;
  }

  set(key: string, response: TranslationResponse): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      response,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const globalCache = new TranslationCache();

export function useTranslation(options: UseTranslationOptions = {}): UseTranslationReturn {
  const {
    autoSave = true,
    cacheEnabled = true,
    batchSize = 5,
    onSuccess,
    onError,
    onProgress
  } = options;

  // 状态管理
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatingLanguages, setTranslatingLanguages] = useState<Set<SupportedLanguage>>(new Set());
  const [translationProgress, setTranslationProgress] = useState<TranslationProgress>({});
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([]);

  // 用于取消翻译的 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // 清理错误状态
  const clearError = useCallback(() => {
    setTranslationError(null);
  }, []);

  // 取消翻译
  const cancelTranslation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTranslating(false);
    setTranslatingLanguages(new Set());
    setTranslationProgress({});
  }, []);

  // 清空历史记录
  const clearHistory = useCallback(() => {
    setTranslationHistory([]);
  }, []);

  // 检查语言是否正在翻译
  const isLanguageTranslating = useCallback((language: SupportedLanguage) => {
    return translatingLanguages.has(language);
  }, [translatingLanguages]);

  // 获取翻译进度
  const getTranslationProgress = useCallback((language: SupportedLanguage) => {
    return translationProgress[language] || 0;
  }, [translationProgress]);

  // 获取翻译历史
  const getTranslationHistory = useCallback(() => {
    return translationHistory;
  }, [translationHistory]);

  // 添加到历史记录
  const addToHistory = useCallback((
    sourceText: string,
    sourceLanguage: SupportedLanguage,
    targetLanguages: SupportedLanguage[],
    contentType: ContentType,
    translations: Partial<MultiLanguageText>,
    duration: number
  ) => {
    const historyItem: TranslationHistoryItem = {
      id: Date.now().toString(),
      sourceText,
      sourceLanguage,
      targetLanguages,
      contentType,
      translations,
      timestamp: new Date(),
      duration
    };

    setTranslationHistory(prev => [historyItem, ...prev.slice(0, 49)]); // 保留最近50条记录
  }, []);

  // 更新翻译进度
  const updateProgress = useCallback((language: SupportedLanguage, progress: number) => {
    setTranslationProgress(prev => ({
      ...prev,
      [language]: progress
    }));
    onProgress?.(language, progress);
  }, [onProgress]);

  // 单个语言翻译
  const translateToLanguage = useCallback(async (
    sourceLanguage: SupportedLanguage,
    targetLanguage: SupportedLanguage,
    sourceText: string,
    contentType: ContentType
  ): Promise<TranslationResponse> => {
    if (!sourceText.trim()) {
      const error = '源文本为空';
      setTranslationError(error);
      onError?.(error);
      return { success: false, error };
    }

    // 检查缓存
    const cacheKey = globalCache.generateKey(sourceText, sourceLanguage, targetLanguage, contentType);
    if (cacheEnabled) {
      const cached = globalCache.get(cacheKey);
      if (cached) {
        onSuccess?.({ [targetLanguage]: cached.translations?.[targetLanguage] || '' });
        return cached;
      }
    }

    try {
      const translationService = getTranslationService();
      
      // 更新状态
      setIsTranslating(true);
      setTranslatingLanguages(prev => new Set(prev).add(targetLanguage));
      updateProgress(targetLanguage, 0);
      clearError();

      const request: TranslationRequest = {
        sourceText,
        sourceLanguage,
        targetLanguages: [targetLanguage],
        contentType
      };

      updateProgress(targetLanguage, 50);
      
      const response = await translationService.translate(request);
      
      updateProgress(targetLanguage, 100);

      if (response.success && response.translations) {
        // 缓存结果
        if (cacheEnabled) {
          globalCache.set(cacheKey, response);
        }
        
        // 添加到历史
        addToHistory(
          sourceText,
          sourceLanguage,
          [targetLanguage],
          contentType,
          response.translations,
          Date.now() - Date.now()
        );

        onSuccess?.(response.translations);
      } else {
        setTranslationError(response.error || '翻译失败');
        onError?.(response.error || '翻译失败');
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '翻译过程中发生未知错误';
      
      // 特殊处理翻译服务未初始化的错误
      if (errorMessage.includes('Translation service not initialized')) {
        const serviceError = '翻译服务未初始化，请检查配置或刷新页面重试';
        setTranslationError(serviceError);
        onError?.(serviceError);
        return { success: false, error: serviceError };
      }
      
      setTranslationError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsTranslating(false);
      setTranslatingLanguages(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetLanguage);
        return newSet;
      });
      updateProgress(targetLanguage, 0);
    }
  }, [cacheEnabled, clearError, updateProgress, addToHistory, onSuccess, onError]);

  // 翻译到所有目标语言 - 优化为一次API调用，增强部分成功处理
  const translateToAll = useCallback(async (
    sourceLanguage: SupportedLanguage,
    sourceText: string,
    contentType: ContentType,
    targetLanguages?: SupportedLanguage[]
  ): Promise<TranslationResponse> => {
    if (!sourceText.trim()) {
      const error = '源文本为空';
      setTranslationError(error);
      onError?.(error);
      return { success: false, error };
    }

    // 如果没有指定目标语言，使用所有支持的语言（除了源语言）
    const allLanguages: SupportedLanguage[] = ['zh', 'en', 'ja', 'ko', 'ar', 'es'];
    const targets = targetLanguages || allLanguages.filter(lang => lang !== sourceLanguage);

    if (targets.length === 0) {
      const error = '没有可翻译的目标语言';
      setTranslationError(error);
      onError?.(error);
      return { success: false, error };
    }

    // 生成批量缓存键
    const batchCacheKey = `${sourceLanguage}-${targets.sort().join('-')}-${contentType}-${sourceText.slice(0, 50)}`;
    
    // 检查批量缓存
    if (cacheEnabled) {
      const cached = globalCache.get(batchCacheKey);
      if (cached) {
        console.log('📦 Using cached batch translation result');
        onSuccess?.(cached.translations || {});
        return cached;
      }
    }

    try {
      const translationService = getTranslationService();
      
      // 更新状态
      setIsTranslating(true);
      setTranslatingLanguages(new Set(targets));
      setTranslationProgress({});
      clearError();

      const request: TranslationRequest = {
        sourceText,
        sourceLanguage,
        targetLanguages: targets,
        contentType
      };

      const response = await translationService.translate(request);

      if (response.success && response.translations) {
        const translationCount = Object.keys(response.translations).length;
        const expectedCount = targets.length;
        
        // 检查是否为部分成功
        if (translationCount < expectedCount) {
          const successfulLanguages = Object.keys(response.translations);
          const failedLanguages = targets.filter(lang => !successfulLanguages.includes(lang));
          
          // 设置部分成功的警告信息
          const partialSuccessWarning = `部分翻译成功：${successfulLanguages.length}/${expectedCount} 种语言翻译完成。失败的语言：${failedLanguages.join(', ')}`;
          setTranslationError(partialSuccessWarning);
          onError?.(partialSuccessWarning);
        } else {
          clearError();
        }

        // 缓存批量翻译结果
        if (cacheEnabled) {
          globalCache.set(batchCacheKey, response);
          
          // 同时为每个语言设置单独缓存，以便单个翻译时也能命中
          Object.entries(response.translations).forEach(([targetLang, translation]) => {
            if (translation) {
              const singleCacheKey = globalCache.generateKey(
                sourceText, 
                sourceLanguage, 
                targetLang as SupportedLanguage, 
                contentType
              );
              globalCache.set(singleCacheKey, {
                success: true,
                translations: { [targetLang]: translation }
              });
            }
          });
        }

        // 添加到历史
        addToHistory(
          sourceText,
          sourceLanguage,
          targets,
          contentType,
          response.translations,
          Date.now() - Date.now()
        );

        onSuccess?.(response.translations);
        
        return {
          ...response,
          success: true // 即使部分成功也返回true，让UI能显示已翻译的内容
        };
      } else {
        setTranslationError(response.error || '批量翻译失败');
        onError?.(response.error || '批量翻译失败');
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '批量翻译过程中发生未知错误';
      
      console.error('💥 Translation error:', error);
      
      // 特殊处理翻译服务未初始化的错误
      if (errorMessage.includes('Translation service not initialized')) {
        const serviceError = '翻译服务未初始化，请检查配置或刷新页面重试';
        setTranslationError(serviceError);
        onError?.(serviceError);
        return { success: false, error: serviceError };
      }
      
      setTranslationError(errorMessage);
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsTranslating(false);
      setTranslatingLanguages(new Set());
      setTranslationProgress({});
    }
  }, [cacheEnabled, clearError, addToHistory, onSuccess, onError]);

  // 批量翻译
  const batchTranslate = useCallback(async (
    requests: TranslationRequest[]
  ): Promise<TranslationResponse[]> => {
    if (requests.length === 0) {
      return [];
    }

    try {
      const translationService = getTranslationService();
      
      // 更新状态
      setIsTranslating(true);
      const allTargetLanguages = requests.flatMap(req => req.targetLanguages);
      setTranslatingLanguages(new Set(allTargetLanguages));
      clearError();

      // 分批处理
      const results: TranslationResponse[] = [];
      for (let i = 0; i < requests.length; i += batchSize) {
        const batch = requests.slice(i, i + batchSize);
        const batchResults = await translationService.batchTranslate(batch);
        results.push(...batchResults);

        // 更新进度
        const progress = Math.min(100, Math.round(((i + batchSize) / requests.length) * 100));
        batch.forEach(req => {
          req.targetLanguages.forEach(lang => {
            updateProgress(lang, progress);
          });
        });
      }

      // 处理成功的翻译
      const successfulTranslations = results.filter(r => r.success);
      if (successfulTranslations.length > 0) {
        const allTranslations = successfulTranslations.reduce((acc, result) => {
          if (result.translations) {
            Object.assign(acc, result.translations);
          }
          return acc;
        }, {} as Partial<MultiLanguageText>);
        
        onSuccess?.(allTranslations);
      }

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '批量翻译过程中发生未知错误';
      setTranslationError(errorMessage);
      onError?.(errorMessage);
      return requests.map(() => ({ success: false, error: errorMessage }));
    } finally {
      setIsTranslating(false);
      setTranslatingLanguages(new Set());
      setTranslationProgress({});
    }
  }, [batchSize, clearError, updateProgress, onSuccess, onError]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cancelTranslation();
    };
  }, [cancelTranslation]);

  return {
    // 状态
    isTranslating,
    translatingLanguages,
    translationProgress,
    translationError,
    translationHistory,
    
    // 方法
    translateToLanguage,
    translateToAll,
    batchTranslate,
    clearError,
    cancelTranslation,
    clearHistory,
    getTranslationHistory,
    isLanguageTranslating,
    getTranslationProgress
  };
}

// 导出缓存实例供外部使用
export { globalCache as translationCache };
