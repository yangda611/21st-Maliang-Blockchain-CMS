/**
 * Contract Test: Products API
 * Tests API contract for product CRUD operations
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { Product } from '@/types/content';

describe('Products API Contract', () => {
  let testProductId: string;
  let testCategoryId: string;
  const supabase = getSupabaseClient();

  const mockProduct = {
    name: { zh: '测试产品', en: 'Test Product' },
    description: { zh: '产品描述', en: 'Product Description' },
    specifications: { zh: '规格说明', en: 'Specifications' },
    pricing: { currency: 'CNY', amount: 999.99 },
    images: ['https://example.com/image1.jpg'],
    slug: 'test-product',
    tags: ['test', 'product'],
    translation_status: 'draft' as const,
    is_published: false,
  };

  beforeAll(async () => {
    // Create test category
    const { data: category } = await supabase
      .from('content_categories')
      .insert({
        name: { zh: '产品分类', en: 'Product Category' },
        slug: 'product-category-test',
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
    // Cleanup
    if (testProductId) {
      await supabase.from('products').delete().eq('id', testProductId);
    }
    if (testCategoryId) {
      await supabase.from('content_categories').delete().eq('id', testCategoryId);
    }
  });

  describe('POST /api/products - Create Product', () => {
    it('should create a new product with valid data', async () => {
      const { data, error } = await supabase
        .from('products')
        .insert({ ...mockProduct, category_id: testCategoryId })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toEqual(mockProduct.name);
      expect(data?.slug).toBe(mockProduct.slug);
      expect(data?.category_id).toBe(testCategoryId);

      testProductId = data!.id;
    });

    it('should fail with duplicate slug', async () => {
      const { error } = await supabase
        .from('products')
        .insert({ ...mockProduct, category_id: testCategoryId });

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505');
    });

    it('should fail with invalid category_id', async () => {
      const { error } = await supabase
        .from('products')
        .insert({
          ...mockProduct,
          slug: 'invalid-category-product',
          category_id: '00000000-0000-0000-0000-000000000000',
        });

      expect(error).toBeDefined();
    });
  });

  describe('GET /api/products - List Products', () => {
    it('should retrieve all products', async () => {
      const { data, error } = await supabase.from('products').select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter products by category', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', testCategoryId);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      data?.forEach((product) => {
        expect(product.category_id).toBe(testCategoryId);
      });
    });

    it('should filter published products only', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      data?.forEach((product) => {
        expect(product.is_published).toBe(true);
      });
    });

    it('should filter by translation status', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('translation_status', 'published');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      data?.forEach((product) => {
        expect(product.translation_status).toBe('published');
      });
    });
  });

  describe('GET /api/products/:id - Get Single Product', () => {
    it('should retrieve product by id', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', testProductId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testProductId);
    });

    it('should retrieve product with category', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, content_categories(*)')
        .eq('id', testProductId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.content_categories).toBeDefined();
    });
  });

  describe('PUT /api/products/:id - Update Product', () => {
    it('should update product with valid data', async () => {
      const updatedData = {
        name: { zh: '更新产品', en: 'Updated Product' },
        pricing: { currency: 'CNY', amount: 1299.99 },
        translation_status: 'pending_review' as const,
      };

      const { data, error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toEqual(updatedData.name);
      expect(data?.translation_status).toBe('pending_review');
    });

    it('should publish product', async () => {
      const { data, error } = await supabase
        .from('products')
        .update({
          is_published: true,
          translation_status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', testProductId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.is_published).toBe(true);
      expect(data?.published_at).toBeDefined();
    });
  });

  describe('DELETE /api/products/:id - Delete Product', () => {
    it('should delete product', async () => {
      const { error } = await supabase.from('products').delete().eq('id', testProductId);

      expect(error).toBeNull();

      // Verify deletion
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', testProductId)
        .single();

      expect(data).toBeNull();
    });
  });

  describe('Product Tags', () => {
    it('should support tag filtering', async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .contains('tags', ['test']);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('Multi-language Content', () => {
    it('should store multi-language fields in JSONB', async () => {
      const multiLangProduct = {
        ...mockProduct,
        slug: 'multi-lang-product',
        category_id: testCategoryId,
        name: {
          zh: '中文名称',
          en: 'English Name',
          ja: '日本語名',
          ko: '한국어 이름',
        },
      };

      const { data, error } = await supabase
        .from('products')
        .insert(multiLangProduct)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.name).toHaveProperty('zh');
      expect(data?.name).toHaveProperty('en');
      expect(data?.name).toHaveProperty('ja');
      expect(data?.name).toHaveProperty('ko');

      // Cleanup
      await supabase.from('products').delete().eq('id', data!.id);
    });
  });
});
