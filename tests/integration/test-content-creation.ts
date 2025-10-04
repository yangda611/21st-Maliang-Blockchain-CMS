/**
 * Integration Test: Content Creation Workflow
 * Tests end-to-end content creation process
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';

describe('Content Creation Workflow Integration', () => {
  const supabase = getSupabaseClient();
  const testData = {
    categoryId: '',
    productId: '',
    articleId: '',
    tagIds: [] as string[],
  };

  afterAll(async () => {
    // Cleanup in reverse order of dependencies
    if (testData.articleId) {
      await supabase.from('articles').delete().eq('id', testData.articleId);
    }
    if (testData.productId) {
      await supabase.from('products').delete().eq('id', testData.productId);
    }
    if (testData.categoryId) {
      await supabase.from('content_categories').delete().eq('id', testData.categoryId);
    }
    for (const tagId of testData.tagIds) {
      await supabase.from('content_tags').delete().eq('id', tagId);
    }
  });

  describe('Complete Content Creation Flow', () => {
    it('Step 1: Create content category', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert({
          name: { zh: '集成测试分类', en: 'Integration Test Category' },
          description: { zh: '用于集成测试', en: 'For integration testing' },
          slug: 'integration-test-category',
          content_type: 'product',
          hierarchy_level: 1,
          display_order: 1,
          is_active: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      testData.categoryId = data!.id;
    });

    it('Step 2: Create content tags', async () => {
      const tags = [
        { name: { zh: '新品', en: 'New' }, slug: 'new-product' },
        { name: { zh: '热销', en: 'Hot Sale' }, slug: 'hot-sale' },
      ];

      for (const tag of tags) {
        const { data, error } = await supabase
          .from('content_tags')
          .insert(tag)
          .select()
          .single();

        expect(error).toBeNull();
        testData.tagIds.push(data!.id);
      }

      expect(testData.tagIds.length).toBe(2);
    });

    it('Step 3: Create product with category and tags', async () => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          category_id: testData.categoryId,
          name: { zh: '集成测试产品', en: 'Integration Test Product' },
          description: { zh: '完整的产品描述', en: 'Complete product description' },
          specifications: { zh: '产品规格', en: 'Product specifications' },
          pricing: { currency: 'CNY', amount: 1999.99 },
          images: ['https://example.com/product.jpg'],
          slug: 'integration-test-product',
          tags: ['new-product', 'hot-sale'],
          translation_status: 'draft',
          is_published: false,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.category_id).toBe(testData.categoryId);
      expect(data?.tags).toContain('new-product');
      testData.productId = data!.id;
    });

    it('Step 4: Update product translation status', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({ translation_status: 'pending_review' })
        .eq('id', testData.productId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.translation_status).toBe('pending_review');
    });

    it('Step 5: Approve and publish product', async () => {
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
      expect(data?.is_published).toBe(true);
      expect(data?.translation_status).toBe('published');
    });

    it('Step 6: Verify product appears in category listing', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, content_categories(*)')
        .eq('category_id', testData.categoryId)
        .eq('is_published', true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
      expect(data![0].category_id).toBe(testData.categoryId);
    });

    it('Step 7: Create related article', async () => {
      const { data: author } = await supabase
        .from('admin_users')
        .select('id')
        .limit(1)
        .single();

      const { data, error } = await supabase
        .from('articles')
        .insert({
          category_id: testData.categoryId,
          author_id: author?.id || '00000000-0000-0000-0000-000000000001',
          title: { zh: '产品介绍文章', en: 'Product Introduction Article' },
          content: { zh: '详细的产品介绍内容', en: 'Detailed product introduction content' },
          excerpt: { zh: '文章摘要', en: 'Article excerpt' },
          slug: 'integration-test-article',
          tags: ['new-product'],
          translation_status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      testData.articleId = data!.id;
    });

    it('Step 8: Verify content relationships', async () => {
      // Verify product and article share the same category
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', testData.categoryId);

      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('category_id', testData.categoryId);

      expect(products).toBeDefined();
      expect(articles).toBeDefined();
      expect(products!.length).toBeGreaterThan(0);
      expect(articles!.length).toBeGreaterThan(0);
    });

    it('Step 9: Update tag usage count', async () => {
      for (const tagSlug of ['new-product', 'hot-sale']) {
        const { data: tag } = await supabase
          .from('content_tags')
          .select('*')
          .eq('slug', tagSlug)
          .single();

        if (tag) {
          const { error } = await supabase
            .from('content_tags')
            .update({ usage_count: (tag.usage_count || 0) + 1 })
            .eq('id', tag.id);

          expect(error).toBeNull();
        }
      }
    });

    it('Step 10: Verify complete content structure', async () => {
      // Get category with all related content
      const { data: category } = await supabase
        .from('content_categories')
        .select('*')
        .eq('id', testData.categoryId)
        .single();

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', testData.categoryId);

      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('category_id', testData.categoryId);

      expect(category).toBeDefined();
      expect(products).toBeDefined();
      expect(articles).toBeDefined();
      expect(category?.is_active).toBe(true);
      expect(products!.length).toBeGreaterThan(0);
      expect(articles!.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling in Content Creation', () => {
    it('should handle missing category gracefully', async () => {
      const { error } = await supabase.from('products').insert({
        category_id: '00000000-0000-0000-0000-000000000000',
        name: { zh: '无效分类产品', en: 'Invalid Category Product' },
        description: { zh: '描述', en: 'Description' },
        slug: 'invalid-category-product',
        translation_status: 'draft',
        is_published: false,
      });

      expect(error).toBeDefined();
    });

    it('should prevent duplicate slugs', async () => {
      const { error } = await supabase.from('products').insert({
        category_id: testData.categoryId,
        name: { zh: '重复slug产品', en: 'Duplicate Slug Product' },
        description: { zh: '描述', en: 'Description' },
        slug: 'integration-test-product', // Same as existing
        translation_status: 'draft',
        is_published: false,
      });

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505');
    });
  });

  describe('Bulk Content Operations', () => {
    it('should create multiple products in batch', async () => {
      const products = [
        {
          category_id: testData.categoryId,
          name: { zh: '批量产品1', en: 'Batch Product 1' },
          description: { zh: '描述1', en: 'Description 1' },
          slug: 'batch-product-1',
          translation_status: 'draft' as const,
          is_published: false,
        },
        {
          category_id: testData.categoryId,
          name: { zh: '批量产品2', en: 'Batch Product 2' },
          description: { zh: '描述2', en: 'Description 2' },
          slug: 'batch-product-2',
          translation_status: 'draft' as const,
          is_published: false,
        },
      ];

      const { data, error } = await supabase.from('products').insert(products).select();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBe(2);

      // Cleanup
      for (const product of data!) {
        await supabase.from('products').delete().eq('id', product.id);
      }
    });
  });
});
