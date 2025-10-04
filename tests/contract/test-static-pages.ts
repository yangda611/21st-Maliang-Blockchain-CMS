/**
 * Contract Test: Static Pages API
 * Tests API contract for static page CRUD operations
 */

import { describe, it, expect, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { StaticPage } from '@/types/content';

describe('Static Pages API Contract', () => {
  let testPageId: string;
  const supabase = getSupabaseClient();

  const mockPage = {
    title: { zh: '关于我们', en: 'About Us' },
    content: { zh: '公司介绍内容', en: 'Company introduction content' },
    slug: 'about-us',
    meta_title: { zh: '关于我们 - 公司名', en: 'About Us - Company Name' },
    meta_description: { zh: 'SEO描述', en: 'SEO Description' },
    translation_status: 'draft' as const,
    is_published: false,
  };

  afterAll(async () => {
    if (testPageId) {
      await supabase.from('static_pages').delete().eq('id', testPageId);
    }
  });

  describe('POST /api/pages - Create Static Page', () => {
    it('should create a new static page with valid data', async () => {
      const { data, error } = await supabase
        .from('static_pages')
        .insert(mockPage)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.title).toEqual(mockPage.title);
      expect(data?.slug).toBe(mockPage.slug);

      testPageId = data!.id;
    });

    it('should fail with duplicate slug', async () => {
      const { error } = await supabase.from('static_pages').insert(mockPage);

      expect(error).toBeDefined();
      expect(error?.code).toBe('23505');
    });
  });

  describe('GET /api/pages - List Static Pages', () => {
    it('should retrieve all static pages', async () => {
      const { data, error } = await supabase.from('static_pages').select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter published pages', async () => {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('is_published', true);

      expect(error).toBeNull();
      data?.forEach((page) => {
        expect(page.is_published).toBe(true);
      });
    });
  });

  describe('GET /api/pages/:slug - Get Page by Slug', () => {
    it('should retrieve page by slug', async () => {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', 'about-us')
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.slug).toBe('about-us');
    });
  });

  describe('PUT /api/pages/:id - Update Static Page', () => {
    it('should update page with valid data', async () => {
      const updatedData = {
        title: { zh: '更新页面', en: 'Updated Page' },
        translation_status: 'published' as const,
        is_published: true,
      };

      const { data, error } = await supabase
        .from('static_pages')
        .update(updatedData)
        .eq('id', testPageId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.title).toEqual(updatedData.title);
      expect(data?.is_published).toBe(true);
    });
  });

  describe('DELETE /api/pages/:id - Delete Static Page', () => {
    it('should delete static page', async () => {
      const { error } = await supabase.from('static_pages').delete().eq('id', testPageId);

      expect(error).toBeNull();
    });
  });

  describe('SEO Meta Tags', () => {
    it('should store SEO meta information', async () => {
      const pageWithSEO = {
        ...mockPage,
        slug: 'contact-us',
        meta_title: {
          zh: '联系我们 - 完整标题',
          en: 'Contact Us - Full Title',
        },
        meta_description: {
          zh: '这是一个SEO优化的描述',
          en: 'This is an SEO optimized description',
        },
      };

      const { data, error } = await supabase
        .from('static_pages')
        .insert(pageWithSEO)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.meta_title).toEqual(pageWithSEO.meta_title);
      expect(data?.meta_description).toEqual(pageWithSEO.meta_description);

      await supabase.from('static_pages').delete().eq('id', data!.id);
    });
  });
});
