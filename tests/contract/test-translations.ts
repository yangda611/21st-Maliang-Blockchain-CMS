/**
 * Contract Test: Multi-language Content API
 * Tests API contract for translation management
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { SupportedLanguage } from '@/types/content';

describe('Multi-language Content API Contract', () => {
  let testProductId: string;
  let testCategoryId: string;
  const supabase = getSupabaseClient();

  beforeAll(async () => {
    // Create test category
    const { data: category } = await supabase
      .from('content_categories')
      .insert({
        name: { zh: '测试分类', en: 'Test Category' },
        slug: 'translation-test-category',
        content_type: 'product',
        hierarchy_level: 1,
        display_order: 1,
        is_active: true,
      })
      .select()
      .single();

    testCategoryId = category!.id;
  });

  afterAll(async () => {
    if (testProductId) {
      await supabase.from('products').delete().eq('id', testProductId);
    }
    if (testCategoryId) {
      await supabase.from('content_categories').delete().eq('id', testCategoryId);
    }
  });

  describe('Multi-language JSONB Storage', () => {
    it('should store content in multiple languages', async () => {
      const multiLangProduct = {
        category_id: testCategoryId,
        name: {
          zh: '多语言产品',
          en: 'Multi-language Product',
          ja: '多言語製品',
          ko: '다국어 제품',
          ar: 'منتج متعدد اللغات',
          es: 'Producto multilingüe',
        },
        description: {
          zh: '中文描述',
          en: 'English Description',
          ja: '日本語の説明',
          ko: '한국어 설명',
        },
        slug: 'multi-lang-product-test',
        translation_status: 'draft' as const,
        is_published: false,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(multiLangProduct)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toHaveProperty('zh');
      expect(data?.name).toHaveProperty('en');
      expect(data?.name).toHaveProperty('ja');
      expect(data?.name).toHaveProperty('ko');
      expect(data?.name).toHaveProperty('ar');
      expect(data?.name).toHaveProperty('es');

      testProductId = data!.id;
    });

    it('should query content by language', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, description')
        .eq('id', testProductId)
        .single();

      expect(error).toBeNull();
      expect(data?.name).toHaveProperty('zh');
      expect(data?.name).toHaveProperty('en');
    });
  });

  describe('Translation Status Workflow', () => {
    it('should update translation status to pending_review', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({ translation_status: 'pending_review' })
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('pending_review');
    });

    it('should approve translation and set to published', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({
          translation_status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('published');
      expect(data?.is_published).toBe(true);
    });

    it('should revert to draft status', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({
          translation_status: 'draft',
          is_published: false,
        })
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('draft');
    });
  });

  describe('Partial Translation Support', () => {
    it('should allow partial language translations', async () => {
      const partialTranslation = {
        category_id: testCategoryId,
        name: {
          zh: '部分翻译产品',
          en: 'Partially Translated Product',
        },
        description: {
          zh: '只有中文和英文',
        },
        slug: 'partial-translation-test',
        translation_status: 'draft' as const,
        is_published: false,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(partialTranslation)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toHaveProperty('zh');
      expect(data?.name).toHaveProperty('en');
      expect(data?.name).not.toHaveProperty('ja');

      await supabase.from('products').delete().eq('id', data!.id);
    });
  });

  describe('Language Fallback Logic', () => {
    it('should retrieve content with missing language gracefully', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, description')
        .eq('id', testProductId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      
      // Even if a language is missing, the JSONB structure should be valid
      const name = data?.name as Record<string, string>;
      expect(typeof name).toBe('object');
    });
  });

  describe('Translation Completeness Check', () => {
    it('should identify incomplete translations', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('name, description, translation_status')
        .eq('id', testProductId)
        .single();

      expect(error).toBeNull();
      
      const supportedLanguages: SupportedLanguage[] = ['zh', 'en', 'ja', 'ko', 'ar', 'es'];
      const name = data?.name as Record<string, string>;
      
      const missingLanguages = supportedLanguages.filter(lang => !name[lang]);
      
      // If there are missing languages and status is published, it should be flagged
      if (missingLanguages.length > 0 && data?.translation_status === 'published') {
        console.warn('Published content has incomplete translations:', missingLanguages);
      }
      
      expect(data).toBeDefined();
    });
  });

  describe('Bulk Translation Updates', () => {
    it('should update multiple language fields at once', async () => {
      const bulkUpdate = {
        name: {
          zh: '批量更新产品',
          en: 'Bulk Updated Product',
          ja: '一括更新製品',
        },
        description: {
          zh: '批量更新描述',
          en: 'Bulk updated description',
          ja: '一括更新の説明',
        },
      };

      const { data, error } = await supabase
        .from('products')
        .update(bulkUpdate)
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toEqual(bulkUpdate.name);
      expect(data?.description).toEqual(bulkUpdate.description);
    });
  });
});
