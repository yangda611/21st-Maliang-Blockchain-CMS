/**
 * useContent Hook
 * CRUD operations for content management
 */

'use client';

import { useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import type {
  ContentCategory,
  Product,
  Article,
  StaticPage,
  JobPosting,
  VisitorMessage,
  ContentTag,
  Banner,
  PaginatedResponse,
  APIResponse,
} from '@/types/content';

/**
 * useContent Hook
 * Generic content CRUD operations
 */
export function useContent<T>(tableName: string) {
  const supabase = getSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create content
  const create = useCallback(
    async (data: Partial<T>): Promise<APIResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error: dbError } = await supabase
          .from(tableName)
          .insert(data as any)
          .select()
          .single();

        if (dbError) throw dbError;

        return { success: true, data: result as T };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create content';
        setError(message);
        return { success: false, error: { code: 'CREATE_ERROR', message } };
      } finally {
        setLoading(false);
      }
    },
    [supabase, tableName]
  );

  // Read single content by ID
  const getById = useCallback(
    async (id: string): Promise<APIResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: dbError } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();

        if (dbError) throw dbError;

        return { success: true, data: data as T };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch content';
        setError(message);
        return { success: false, error: { code: 'FETCH_ERROR', message } };
      } finally {
        setLoading(false);
      }
    },
    [supabase, tableName]
  );

  // Read content list with pagination
  const getList = useCallback(
    async (
      page: number = 1,
      pageSize: number = 10,
      filters?: Record<string, any>
    ): Promise<APIResponse<PaginatedResponse<T>>> => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(tableName).select('*', { count: 'exact' });

        // Apply filters
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              query = query.eq(key, value);
            }
          });
        }

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error: dbError, count } = await query;

        if (dbError) throw dbError;

        const totalPages = count ? Math.ceil(count / pageSize) : 0;

        return {
          success: true,
          data: {
            data: data as T[],
            total: count || 0,
            page,
            pageSize,
            totalPages,
          },
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch content list';
        setError(message);
        return { success: false, error: { code: 'FETCH_ERROR', message } };
      } finally {
        setLoading(false);
      }
    },
    [supabase, tableName]
  );

  // Update content
  const update = useCallback(
    async (id: string, data: Partial<T>): Promise<APIResponse<T>> => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error: dbError } = await (supabase as any)
          .from(tableName)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (dbError) throw dbError;

        return { success: true, data: result as T };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update content';
        setError(message);
        return { success: false, error: { code: 'UPDATE_ERROR', message } };
      } finally {
        setLoading(false);
      }
    },
    [supabase, tableName]
  );

  // Delete content
  const remove = useCallback(
    async (id: string): Promise<APIResponse<void>> => {
      setLoading(true);
      setError(null);

      try {
        const { error: dbError } = await supabase.from(tableName).delete().eq('id', id);

        if (dbError) throw dbError;

        return { success: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete content';
        setError(message);
        return { success: false, error: { code: 'DELETE_ERROR', message } };
      } finally {
        setLoading(false);
      }
    },
    [supabase, tableName]
  );

  return {
    loading,
    error,
    create,
    getById,
    getList,
    update,
    remove,
  };
}

/**
 * useCategories Hook
 * Specialized hook for content categories
 */
export function useCategories() {
  const base = useContent<ContentCategory>('content_categories');

  const getByContentType = useCallback(
    async (contentType: 'product' | 'article' | 'page') => {
      return base.getList(1, 100, { content_type: contentType, is_active: true });
    },
    [base]
  );

  return {
    ...base,
    getByContentType,
  };
}

/**
 * useProducts Hook
 * Specialized hook for products
 */
export function useProducts() {
  const base = useContent<Product>('products');

  const getPublished = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      return base.getList(page, pageSize, { is_published: true });
    },
    [base]
  );

  const getByCategory = useCallback(
    async (categoryId: string, page: number = 1, pageSize: number = 10) => {
      return base.getList(page, pageSize, { category_id: categoryId, is_published: true });
    },
    [base]
  );

  return {
    ...base,
    getPublished,
    getByCategory,
  };
}

/**
 * useArticles Hook
 * Specialized hook for articles
 */
export function useArticles() {
  const base = useContent<Article>('articles');

  const getPublished = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      return base.getList(page, pageSize, { is_published: true });
    },
    [base]
  );

  const getByCategory = useCallback(
    async (categoryId: string, page: number = 1, pageSize: number = 10) => {
      return base.getList(page, pageSize, { category_id: categoryId, is_published: true });
    },
    [base]
  );

  return {
    ...base,
    getPublished,
    getByCategory,
  };
}

/**
 * useStaticPages Hook
 * Specialized hook for static pages
 */
export function useStaticPages() {
  const base = useContent<StaticPage>('static_pages');
  const supabase = getSupabaseClient();

  const getBySlug = useCallback(
    async (slug: string): Promise<APIResponse<StaticPage>> => {
      try {
        const { data, error } = await supabase
          .from('static_pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;

        return { success: true, data: data as StaticPage };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch page';
        return { success: false, error: { code: 'FETCH_ERROR', message } };
      }
    },
    [supabase]
  );

  return {
    ...base,
    getBySlug,
  };
}

/**
 * useJobPostings Hook
 * Specialized hook for job postings
 */
export function useJobPostings() {
  const base = useContent<JobPosting>('job_postings');

  const getActive = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      return base.getList(page, pageSize, { is_active: true });
    },
    [base]
  );

  return {
    ...base,
    getActive,
  };
}

/**
 * useMessages Hook
 * Specialized hook for visitor messages
 */
export function useMessages() {
  const base = useContent<VisitorMessage>('visitor_messages');

  // 将数据库 snake_case 字段映射为前端 camelCase 模型
  const mapRow = useCallback((data: any): VisitorMessage => ({
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    message: data.message,
    messageType: data.message_type ?? data.messageType,
    relatedId: data.related_id ?? data.relatedId ?? undefined,
    isRead: data.is_read ?? data.isRead ?? false,
    createdAt: data.created_at ?? data.createdAt,
  }), []);

  // 覆盖通用 getList，确保返回的 data.data 已做字段映射
  const getList = useCallback(
    async (
      page: number = 1,
      pageSize: number = 10,
      filters?: Record<string, any>
    ) => {
      const res = await base.getList(page, pageSize, filters);
      if (!res.success || !res.data) return res;
      const rows = (res.data.data as any[]).map(mapRow);
      return {
        success: true as const,
        data: { ...res.data, data: rows },
      };
    },
    [base, mapRow]
  );

  const getUnread = useCallback(
    async (page: number = 1, pageSize: number = 10) => {
      return getList(page, pageSize, { is_read: false });
    },
    [getList]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      return base.update(id, { is_read: true } as Partial<VisitorMessage>);
    },
    [base]
  );

  return {
    ...base,
    getList, // 使用映射后的 getList
    getUnread,
    markAsRead,
  };
}

/**
 * useTags Hook
 * Specialized hook for content tags
 */
export function useTags() {
  const base = useContent<ContentTag>('content_tags');

  const getPopular = useCallback(
    async (limit: number = 10) => {
      return base.getList(1, limit);
    },
    [base]
  );

  return {
    ...base,
    getPopular,
  };
}

/**
 * useBanners Hook
 * Specialized hook for banners
 */
export function useBanners() {
  const base = useContent<Banner>('banners');

  const getActive = useCallback(
    async () => {
      return base.getList(1, 100, { is_active: true });
    },
    [base]
  );

  return {
    ...base,
    getActive,
  };
}
