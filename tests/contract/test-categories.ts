/**
 * Contract Test: Content Categories API
 * Tests API contract for category CRUD operations
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { ContentCategory } from '@/types/content';

describe('Content Categories API Contract', () => {
  let testCategoryId: string;
  const supabase = getSupabaseClient();

  const mockCategory = {
    name: { zh: '测试分类', en: 'Test Category' },
    description: { zh: '测试描述', en: 'Test Description' },
    slug: 'test-category',
    content_type: 'product' as const,
    hierarchy_level: 1,
    display_order: 1,
    is_active: true,
  };

  afterAll(async () => {
    // Cleanup: Delete test category
    if (testCategoryId) {
      await supabase.from('content_categories').delete().eq('id', testCategoryId);
    }
  });

  describe('POST /api/categories - Create Category', () => {
    it('should create a new category with valid data', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert(mockCategory)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toEqual(mockCategory.name);
      expect(data?.slug).toBe(mockCategory.slug);
      expect(data?.content_type).toBe(mockCategory.content_type);

      testCategoryId = data!.id;
    });

    it('should fail with duplicate slug', async () => {
      const { error } = await supabase
        .from('content_categories')
        .insert(mockCategory);

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505'); // Unique violation
    });

    it('should fail with missing required fields', async () => {
      const { error } = await supabase
        .from('content_categories')
        .insert({ name: { zh: '不完整' } });

      expect(error).toBeDefined();
    });
  });

  describe('GET /api/categories - List Categories', () => {
    it('should retrieve all categories', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter categories by content_type', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('content_type', 'product');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      data?.forEach((cat) => {
        expect(cat.content_type).toBe('product');
      });
    });

    it('should filter active categories only', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      data?.forEach((cat) => {
        expect(cat.is_active).toBe(true);
      });
    });
  });

  describe('GET /api/categories/:id - Get Single Category', () => {
    it('should retrieve category by id', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('id', testCategoryId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testCategoryId);
    });

    it('should return error for non-existent id', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .single();

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('PUT /api/categories/:id - Update Category', () => {
    it('should update category with valid data', async () => {
      const updatedData = {
        name: { zh: '更新分类', en: 'Updated Category' },
        display_order: 2,
      };

      const { data, error } = await supabase
        .from('content_categories')
        .update(updatedData)
        .eq('id', testCategoryId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toEqual(updatedData.name);
      expect(data?.display_order).toBe(2);
    });

    it('should fail with invalid data', async () => {
      const { error } = await supabase
        .from('content_categories')
        .update({ content_type: 'invalid' as any })
        .eq('id', testCategoryId);

      expect(error).toBeDefined();
    });
  });

  describe('DELETE /api/categories/:id - Delete Category', () => {
    it('should soft delete category (set is_active to false)', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .update({ is_active: false })
        .eq('id', testCategoryId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.is_active).toBe(false);
    });

    it('should hard delete category', async () => {
      const { error } = await supabase
        .from('content_categories')
        .delete()
        .eq('id', testCategoryId);

      expect(error).toBeNull();

      // Verify deletion
      const { data } = await supabase
        .from('content_categories')
        .select('*')
        .eq('id', testCategoryId)
        .single();

      expect(data).toBeNull();
    });
  });

  describe('Hierarchical Categories', () => {
    it('should support parent-child relationships', async () => {
      const parentCategory = {
        ...mockCategory,
        slug: 'parent-category',
        parent_id: null,
      };

      const { data: parent } = await supabase
        .from('content_categories')
        .insert(parentCategory)
        .select()
        .single();

      const childCategory = {
        ...mockCategory,
        slug: 'child-category',
        parent_id: parent!.id,
        hierarchy_level: 2,
      };

      const { data: child, error } = await supabase
        .from('content_categories')
        .insert(childCategory)
        .select()
        .single();

      expect(error).toBeNull();
      expect(child?.parent_id).toBe(parent!.id);
      expect(child?.hierarchy_level).toBe(2);

      // Cleanup
      await supabase.from('content_categories').delete().eq('id', child!.id);
      await supabase.from('content_categories').delete().eq('id', parent!.id);
    });
  });
});
