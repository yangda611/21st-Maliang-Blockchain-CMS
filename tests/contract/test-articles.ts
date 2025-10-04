/**
 * Contract Test: Articles API
 * Tests API contract for article CRUD operations
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { Article } from '@/types/content';

describe('Articles API Contract', () => {
  let testArticleId: string;
  let testCategoryId: string;
  let testAuthorId: string;
  const supabase = getSupabaseClient();

  const mockArticle = {
    title: { zh: '测试文章', en: 'Test Article' },
    content: { zh: '文章内容', en: 'Article Content' },
    excerpt: { zh: '摘要', en: 'Excerpt' },
    featured_image: 'https://example.com/image.jpg',
    slug: 'test-article',
    tags: ['news', 'test'],
    translation_status: 'draft' as const,
    is_published: false,
  };

  beforeAll(async () => {
    // Create test category
    const { data: category } = await supabase
      .from('content_categories')
      .insert({
        name: { zh: '文章分类', en: 'Article Category' },
        slug: 'article-category-test',
        content_type: 'article',
        hierarchy_level: 1,
        display_order: 1,
        is_active: true,
      })
      .select()
      .single();

    testCategoryId = category!.id;

    // Get or create test author
    const { data: author } = await supabase
      .from('admin_users')
      .select('id')
      .limit(1)
      .single();

    testAuthorId = author?.id || '00000000-0000-0000-0000-000000000001';
  });

  afterAll(async () => {
    // Cleanup
    if (testArticleId) {
      await supabase.from('articles').delete().eq('id', testArticleId);
    }
    if (testCategoryId) {
      await supabase.from('content_categories').delete().eq('id', testCategoryId);
    }
  });

  describe('POST /api/articles - Create Article', () => {
    it('should create a new article with valid data', async () => {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          ...mockArticle,
          category_id: testCategoryId,
          author_id: testAuthorId,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toEqual(mockArticle.title);
      expect(data?.slug).toBe(mockArticle.slug);

      testArticleId = data!.id;
    });

    it('should fail with duplicate slug', async () => {
      const { error } = await supabase
        .from('articles')
        .insert({
          ...mockArticle,
          category_id: testCategoryId,
          author_id: testAuthorId,
        });

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505');
    });
  });

  describe('GET /api/articles - List Articles', () => {
    it('should retrieve all articles', async () => {
      const { data, error } = await supabase.from('articles').select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter articles by category', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('category_id', testCategoryId);

      expect(error).toBeNull();
      data?.forEach((article) => {
        expect(article.category_id).toBe(testCategoryId);
      });
    });

    it('should filter published articles', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true);

      expect(error).toBeNull();
      data?.forEach((article) => {
        expect(article.is_published).toBe(true);
      });
    });

    it('should order articles by published_at desc', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('GET /api/articles/:id - Get Single Article', () => {
    it('should retrieve article by id', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', testArticleId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testArticleId);
    });

    it('should retrieve article with author and category', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, admin_users(*), content_categories(*)')
        .eq('id', testArticleId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('PUT /api/articles/:id - Update Article', () => {
    it('should update article with valid data', async () => {
      const updatedData = {
        title: { zh: '更新文章', en: 'Updated Article' },
        translation_status: 'pending_review' as const,
      };

      const { data, error } = await supabase
        .from('articles')
        .update(updatedData)
        .eq('id', testArticleId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.title).toEqual(updatedData.title);
      expect(data?.translation_status).toBe('pending_review');
    });

    it('should publish article', async () => {
      const { data, error } = await supabase
        .from('articles')
        .update({
          is_published: true,
          translation_status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', testArticleId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.is_published).toBe(true);
      expect(data?.published_at).toBeDefined();
    });
  });

  describe('DELETE /api/articles/:id - Delete Article', () => {
    it('should delete article', async () => {
      const { error } = await supabase.from('articles').delete().eq('id', testArticleId);

      expect(error).toBeNull();

      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('id', testArticleId)
        .single();

      expect(data).toBeNull();
    });
  });

  describe('Article Tags and Search', () => {
    it('should support tag filtering', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', ['news']);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('should support full-text search on title', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .textSearch('title', 'test');

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });
});
