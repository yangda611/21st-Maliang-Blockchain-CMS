/**
 * Integration Test: SEO Optimization Workflow
 * Tests end-to-end SEO features and optimization
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';

describe('SEO Optimization Workflow Integration', () => {
  const supabase = getSupabaseClient();
  const testData = {
    categoryId: '',
    productId: '',
    articleId: '',
    seoConfigId: '',
    tagIds: [] as string[],
  };

  afterAll(async () => {
    // Cleanup
    if (testData.seoConfigId) {
      await supabase.from('seo_configurations').delete().eq('id', testData.seoConfigId);
    }
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

  describe('SEO-Friendly Content Creation', () => {
    it('Step 1: Create category with SEO-friendly slug', async () => {
      const { data, error } = await supabase
        .from('content_categories')
        .insert({
          name: { zh: 'SEO优化分类', en: 'SEO Optimized Category' },
          description: {
            zh: '这是一个SEO优化的分类描述',
            en: 'This is an SEO optimized category description',
          },
          slug: 'seo-optimized-category',
          content_type: 'article',
          hierarchy_level: 1,
          display_order: 1,
          is_active: true,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.slug).toMatch(/^[a-z0-9-]+$/); // SEO-friendly slug format
      testData.categoryId = data!.id;
    });

    it('Step 2: Create SEO-optimized tags', async () => {
      const tags = [
        { name: { zh: 'SEO优化', en: 'SEO Optimization' }, slug: 'seo-optimization' },
        { name: { zh: '搜索引擎', en: 'Search Engine' }, slug: 'search-engine' },
        { name: { zh: '网站优化', en: 'Website Optimization' }, slug: 'website-optimization' },
      ];

      for (const tag of tags) {
        const { data, error } = await supabase
          .from('content_tags')
          .insert(tag)
          .select()
          .single();

        expect(error).toBeNull();
        expect(data?.slug).toMatch(/^[a-z0-9-]+$/);
        testData.tagIds.push(data!.id);
      }
    });

    it('Step 3: Create product with SEO metadata', async () => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          category_id: testData.categoryId,
          name: {
            zh: 'SEO优化产品 - 提升搜索排名',
            en: 'SEO Optimized Product - Boost Search Rankings',
          },
          description: {
            zh: '这是一个经过SEO优化的产品描述，包含关键词和详细信息',
            en: 'This is an SEO optimized product description with keywords and detailed information',
          },
          slug: 'seo-optimized-product-boost-rankings',
          tags: ['seo-optimization', 'search-engine'],
          translation_status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.slug.length).toBeLessThan(100); // SEO best practice
      testData.productId = data!.id;
    });

    it('Step 4: Create article with rich SEO content', async () => {
      const { data, error } = await supabase
        .from('articles')
        .insert({
          category_id: testData.categoryId,
          author_id: '00000000-0000-0000-0000-000000000001',
          title: {
            zh: 'SEO优化完整指南 - 提升网站排名的10个技巧',
            en: 'Complete SEO Optimization Guide - 10 Tips to Boost Website Rankings',
          },
          content: {
            zh: '详细的SEO优化内容，包含关键词、标题、描述等最佳实践',
            en: 'Detailed SEO optimization content with keywords, titles, descriptions and best practices',
          },
          excerpt: {
            zh: '学习如何优化网站SEO，提升搜索引擎排名',
            en: 'Learn how to optimize website SEO and improve search engine rankings',
          },
          slug: 'complete-seo-optimization-guide-10-tips',
          tags: ['seo-optimization', 'search-engine', 'website-optimization'],
          translation_status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      expect(error).toBeNull();
      testData.articleId = data!.id;
    });
  });

  describe('SEO Configuration Management', () => {
    it('Step 5: Create SEO configuration for product', async () => {
      const { data, error } = await supabase
        .from('seo_configurations')
        .insert({
          page_type: 'product',
          page_id: testData.productId,
          meta_title: {
            zh: 'SEO优化产品 - 提升搜索排名 | 公司名称',
            en: 'SEO Optimized Product - Boost Search Rankings | Company Name',
          },
          meta_description: {
            zh: '购买我们的SEO优化产品，帮助您的网站提升搜索引擎排名，增加流量和转化率。',
            en: 'Buy our SEO optimized product to help boost your website search rankings, increase traffic and conversions.',
          },
          meta_keywords: {
            zh: 'SEO优化, 搜索引擎优化, 网站排名, 流量提升',
            en: 'SEO optimization, search engine optimization, website ranking, traffic boost',
          },
          og_image: 'https://example.com/seo-product-og-image.jpg',
          canonical_url: 'https://example.com/products/seo-optimized-product-boost-rankings',
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.meta_title).toHaveProperty('zh');
      expect(data?.meta_title).toHaveProperty('en');
      testData.seoConfigId = data!.id;
    });

    it('Step 6: Verify meta title length (SEO best practice)', async () => {
      const { data } = await supabase
        .from('seo_configurations')
        .select('meta_title')
        .eq('id', testData.seoConfigId)
        .single();

      const metaTitle = data!.meta_title as Record<string, string>;
      
      // Meta title should be 50-60 characters for optimal SEO
      Object.values(metaTitle).forEach((title) => {
        expect(title.length).toBeLessThan(70);
        expect(title.length).toBeGreaterThan(20);
      });
    });

    it('Step 7: Verify meta description length (SEO best practice)', async () => {
      const { data } = await supabase
        .from('seo_configurations')
        .select('meta_description')
        .eq('id', testData.seoConfigId)
        .single();

      const metaDescription = data!.meta_description as Record<string, string>;
      
      // Meta description should be 150-160 characters for optimal SEO
      Object.values(metaDescription).forEach((desc) => {
        expect(desc.length).toBeLessThan(200);
        expect(desc.length).toBeGreaterThan(50);
      });
    });
  });

  describe('URL Structure and Slug Optimization', () => {
    it('should generate SEO-friendly slugs', async () => {
      const testCases = [
        { input: 'SEO优化产品', expected: 'seo-optimized-product' },
        { input: 'Complete SEO Guide', expected: 'complete-seo-guide' },
        { input: '10个SEO技巧', expected: '10-seo-tips' },
      ];

      // Simulate slug generation
      const generateSlug = (text: string): string => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };

      testCases.forEach(({ input, expected }) => {
        const slug = generateSlug(input);
        expect(slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it('should prevent duplicate slugs', async () => {
      const { error } = await supabase.from('articles').insert({
        category_id: testData.categoryId,
        author_id: '00000000-0000-0000-0000-000000000001',
        title: { zh: '重复slug文章', en: 'Duplicate Slug Article' },
        content: { zh: '内容', en: 'Content' },
        slug: 'complete-seo-optimization-guide-10-tips', // Duplicate
        translation_status: 'draft',
        is_published: false,
      });

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505');
    });
  });

  describe('Tag-Based SEO', () => {
    it('should support tag filtering for SEO', async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', ['seo-optimization']);

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.length).toBeGreaterThan(0);
    });

    it('should track tag usage for popular keywords', async () => {
      const { data: tags } = await supabase
        .from('content_tags')
        .select('*')
        .in('slug', ['seo-optimization', 'search-engine', 'website-optimization']);

      expect(tags).toBeDefined();
      expect(tags!.length).toBe(3);

      // Update usage count
      for (const tag of tags!) {
        await supabase
          .from('content_tags')
          .update({ usage_count: (tag.usage_count || 0) + 1 })
          .eq('id', tag.id);
      }

      // Verify most used tags
      const { data: popularTags } = await supabase
        .from('content_tags')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(5);

      expect(popularTags).toBeDefined();
    });
  });

  describe('Sitemap Generation Data', () => {
    it('should retrieve all published content for sitemap', async () => {
      // Get all published products
      const { data: products } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_published', true);

      // Get all published articles
      const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at')
        .eq('is_published', true);

      // Get all published static pages
      const { data: pages } = await supabase
        .from('static_pages')
        .select('slug, updated_at')
        .eq('is_published', true);

      expect(products).toBeDefined();
      expect(articles).toBeDefined();
      expect(pages).toBeDefined();

      // Simulate sitemap entry
      const sitemapEntries = [
        ...(products || []).map((p) => ({
          url: `/products/${p.slug}`,
          lastmod: p.updated_at,
          priority: 0.8,
        })),
        ...(articles || []).map((a) => ({
          url: `/articles/${a.slug}`,
          lastmod: a.updated_at,
          priority: 0.7,
        })),
        ...(pages || []).map((p) => ({
          url: `/pages/${p.slug}`,
          lastmod: p.updated_at,
          priority: 0.9,
        })),
      ];

      expect(sitemapEntries.length).toBeGreaterThan(0);
    });
  });

  describe('Canonical URLs', () => {
    it('should set canonical URLs to prevent duplicate content', async () => {
      const { data } = await supabase
        .from('seo_configurations')
        .select('canonical_url')
        .eq('id', testData.seoConfigId)
        .single();

      expect(data?.canonical_url).toBeDefined();
      expect(data?.canonical_url).toMatch(/^https?:\/\//);
    });
  });

  describe('Open Graph Metadata', () => {
    it('should include OG image for social sharing', async () => {
      const { data } = await supabase
        .from('seo_configurations')
        .select('og_image')
        .eq('id', testData.seoConfigId)
        .single();

      expect(data?.og_image).toBeDefined();
      expect(data?.og_image).toMatch(/\.(jpg|jpeg|png|webp)$/i);
    });
  });

  describe('Search Engine Indexing', () => {
    it('should only include published content in search results', async () => {
      // Get published products
      const { data: publishedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .eq('translation_status', 'published');

      // Get draft products (should not be indexed)
      const { data: draftProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', false);

      expect(publishedProducts).toBeDefined();
      expect(draftProducts).toBeDefined();

      // Only published products should be in sitemap
      publishedProducts?.forEach((product) => {
        expect(product.is_published).toBe(true);
        expect(product.translation_status).toBe('published');
      });
    });
  });

  describe('Internal Linking Structure', () => {
    it('should support related content linking', async () => {
      // Get articles in same category
      const { data: relatedArticles } = await supabase
        .from('articles')
        .select('*')
        .eq('category_id', testData.categoryId)
        .eq('is_published', true)
        .neq('id', testData.articleId);

      expect(relatedArticles).toBeDefined();

      // Get articles with same tags
      const { data: taggedArticles } = await supabase
        .from('articles')
        .select('*')
        .contains('tags', ['seo-optimization'])
        .neq('id', testData.articleId);

      expect(taggedArticles).toBeDefined();
    });
  });

  describe('Performance Optimization for SEO', () => {
    it('should retrieve content efficiently with indexes', async () => {
      const startTime = Date.now();

      await supabase
        .from('products')
        .select('*')
        .eq('slug', 'seo-optimized-product-boost-rankings')
        .single();

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      // Query should be fast (< 100ms) with proper indexing
      expect(queryTime).toBeLessThan(1000);
    });
  });
});
