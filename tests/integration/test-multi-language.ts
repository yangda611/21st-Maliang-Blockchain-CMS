/**
 * Integration Test: Multi-language Content Management
 * Tests end-to-end multi-language workflows
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { SupportedLanguage } from '@/types/content';

describe('Multi-language Content Management Integration', () => {
  const supabase = getSupabaseClient();
  const testData = {
    categoryId: '',
    productId: '',
    articleId: '',
  };

  const supportedLanguages: SupportedLanguage[] = ['zh', 'en', 'ja', 'ko', 'ar', 'es'];

  afterAll(async () => {
    if (testData.articleId) {
      await supabase.from('articles').delete().eq('id', testData.articleId);
    }
    if (testData.productId) {
      await supabase.from('products').delete().eq('id', testData.productId);
    }
    if (testData.categoryId) {
      await supabase.from('content_categories').delete().eq('id', testData.categoryId);
    }
  });

  describe('Complete Translation Workflow', () => {
    it('Step 1: Create content with default language (Chinese)', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert({
          name: { zh: '多语言测试分类' },
          description: { zh: '这是中文描述' },
          slug: 'multi-lang-test-category',
          content_type: 'product',
          hierarchy_level: 1,
          display_order: 1,
          is_active: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toHaveProperty('zh');
      testData.categoryId = data!.id;
    });

    it('Step 2: Add English translation', async () => {
      const { data: existing } = await supabase
        .from('content_categories')
        .select('name, description')
        .eq('id', testData.categoryId)
        .single();

      const updatedName = {
        ...existing!.name,
        en: 'Multi-language Test Category',
      };

      const updatedDescription = {
        ...existing!.description,
        en: 'This is English description',
      };

      const { data, error } = await supabase
        .from('content_categories')
        .update({
          name: updatedName,
          description: updatedDescription,
        })
        .eq('id', testData.categoryId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toHaveProperty('zh');
      expect(data?.name).toHaveProperty('en');
    });

    it('Step 3: Add remaining language translations', async () => {
      const { data: existing } = await supabase
        .from('content_categories')
        .select('name, description')
        .eq('id', testData.categoryId)
        .single();

      const fullTranslations = {
        name: {
          ...existing!.name,
          ja: '多言語テストカテゴリ',
          ko: '다국어 테스트 카테고리',
          ar: 'فئة اختبار متعددة اللغات',
          es: 'Categoría de prueba multilingüe',
        },
        description: {
          ...existing!.description,
          ja: 'これは日本語の説明です',
          ko: '이것은 한국어 설명입니다',
          ar: 'هذا وصف باللغة العربية',
          es: 'Esta es una descripción en español',
        },
      };

      const { data, error } = await supabase
        .from('content_categories')
        .update(fullTranslations)
        .eq('id', testData.categoryId)
        .select()
        .single();

      expect(error).toBeNull();
      supportedLanguages.forEach((lang) => {
        expect(data?.name).toHaveProperty(lang);
        expect(data?.description).toHaveProperty(lang);
      });
    });

    it('Step 4: Create product with full translations', async () => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          category_id: testData.categoryId,
          name: {
            zh: '多语言产品',
            en: 'Multi-language Product',
            ja: '多言語製品',
            ko: '다국어 제품',
            ar: 'منتج متعدد اللغات',
            es: 'Producto multilingüe',
          },
          description: {
            zh: '这是一个完整的多语言产品描述',
            en: 'This is a complete multi-language product description',
            ja: 'これは完全な多言語製品の説明です',
            ko: '이것은 완전한 다국어 제품 설명입니다',
            ar: 'هذا وصف كامل للمنتج متعدد اللغات',
            es: 'Esta es una descripción completa del producto multilingüe',
          },
          slug: 'multi-lang-product',
          translation_status: 'draft',
          is_published: false,
        })
        .select()
        .single();

      expect(error).toBeNull();
      testData.productId = data!.id;
    });

    it('Step 5: Submit for translation review', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({ translation_status: 'pending_review' })
        .eq('id', testData.productId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('pending_review');
    });

    it('Step 6: Approve translations and publish', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({
          translation_status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', testData.productId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('published');
      expect(data?.is_published).toBe(true);
    });
  });

  describe('Language Fallback Mechanism', () => {
    it('should handle missing language gracefully', async () => {
      // Create product with only Chinese and English
      const { data, error } = await supabase
        .from('products')
        .insert({
          category_id: testData.categoryId,
          name: {
            zh: '部分翻译产品',
            en: 'Partially Translated Product',
          },
          description: {
            zh: '只有中英文',
            en: 'Only Chinese and English',
          },
          slug: 'partial-translation-product',
          translation_status: 'draft',
          is_published: false,
        })
        .select()
        .single();

      expect(error).toBeNull();

      // Simulate language fallback logic
      const requestedLang: SupportedLanguage = 'ja';
      const name = data!.name as Record<string, string>;
      const fallbackName = name[requestedLang] || name['en'] || name['zh'];

      expect(fallbackName).toBeDefined();
      expect(fallbackName).toBe('Partially Translated Product'); // Falls back to English

      // Cleanup
      await supabase.from('products').delete().eq('id', data!.id);
    });

    it('should prioritize language fallback: requested > English > Chinese', async () => {
      const content = {
        zh: '中文内容',
        en: 'English Content',
        ja: '日本語コンテンツ',
      };

      // Test fallback logic
      const getContent = (lang: SupportedLanguage) => {
        return content[lang] || content['en'] || content['zh'];
      };

      expect(getContent('ja')).toBe('日本語コンテンツ');
      expect(getContent('ko')).toBe('English Content'); // Falls back to English
      expect(getContent('ar')).toBe('English Content'); // Falls back to English

      // If English is missing
      const contentNoEn = { zh: '中文内容', ja: '日本語コンテンツ' };
      const getContentNoEn = (lang: SupportedLanguage) => {
        return contentNoEn[lang] || contentNoEn['zh'];
      };

      expect(getContentNoEn('ko')).toBe('中文内容'); // Falls back to Chinese
    });
  });

  describe('Translation Status Management', () => {
    it('should track translation completeness', async () => {
      const { data } = await supabase
        .from('products')
        .select('name, description, translation_status')
        .eq('id', testData.productId)
        .single();

      const name = data!.name as Record<string, string>;
      const description = data!.description as Record<string, string>;

      const nameCompleteness = supportedLanguages.filter((lang) => name[lang]).length;
      const descCompleteness = supportedLanguages.filter((lang) => description[lang]).length;

      expect(nameCompleteness).toBe(supportedLanguages.length);
      expect(descCompleteness).toBe(supportedLanguages.length);
    });

    it('should identify incomplete translations', async () => {
      // Create product with incomplete translations
      const { data } = await supabase
        .from('products')
        .insert({
          category_id: testData.categoryId,
          name: { zh: '不完整', en: 'Incomplete', ja: '不完全' },
          description: { zh: '描述', en: 'Description' },
          slug: 'incomplete-translations',
          translation_status: 'draft',
          is_published: false,
        })
        .select()
        .single();

      const name = data!.name as Record<string, string>;
      const missingLanguages = supportedLanguages.filter((lang) => !name[lang]);

      expect(missingLanguages.length).toBeGreaterThan(0);
      expect(missingLanguages).toContain('ko');
      expect(missingLanguages).toContain('ar');
      expect(missingLanguages).toContain('es');

      // Cleanup
      await supabase.from('products').delete().eq('id', data!.id);
    });
  });

  describe('RTL Language Support', () => {
    it('should handle RTL languages (Arabic)', async () => {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          category_id: testData.categoryId,
          author_id: '00000000-0000-0000-0000-000000000001',
          title: {
            zh: 'RTL测试文章',
            en: 'RTL Test Article',
            ar: 'مقالة اختبار RTL',
          },
          content: {
            zh: '这是测试内容',
            en: 'This is test content',
            ar: 'هذا محتوى اختباري',
          },
          slug: 'rtl-test-article',
          translation_status: 'published',
          is_published: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.title).toHaveProperty('ar');

      testData.articleId = data!.id;

      // Verify RTL content is stored correctly
      const title = data!.title as Record<string, string>;
      expect(title['ar']).toBe('مقالة اختبار RTL');
    });
  });

  describe('Bulk Translation Updates', () => {
    it('should update multiple language fields efficiently', async () => {
      const updates = {
        name: {
          zh: '批量更新产品',
          en: 'Bulk Updated Product',
          ja: '一括更新製品',
          ko: '대량 업데이트 제품',
          ar: 'منتج محدث بالجملة',
          es: 'Producto actualizado en masa',
        },
      };

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', testData.productId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toEqual(updates.name);
    });
  });
});
