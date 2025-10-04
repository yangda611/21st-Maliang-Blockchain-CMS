/**
 * Static Page Service
 * Business logic for static page management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { StaticPage, APIResponse, PaginatedResponse, TranslationStatus } from '@/types/content';

export class StaticPageService {
  private supabase = getSupabaseClient();

  /**
   * Create a new static page
   */
  async create(data: Omit<StaticPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<StaticPage>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('static_pages')
        .insert({
          title: data.title,
          content: data.content,
          slug: data.slug,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          translation_status: data.translationStatus || 'draft',
          is_published: data.isPublished || false,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create static page');
    }
  }

  /**
   * Get static page by ID
   */
  async getById(id: string): Promise<APIResponse<StaticPage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch static page');
    }
  }

  /**
   * Get static page by slug
   */
  async getBySlug(slug: string): Promise<APIResponse<StaticPage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch static page');
    }
  }

  /**
   * Get all static pages with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 50,
    filters?: {
      isPublished?: boolean;
      translationStatus?: TranslationStatus;
      searchQuery?: string;
    }
  ): Promise<APIResponse<PaginatedResponse<StaticPage>>> {
    try {
      let query = this.supabase
        .from('static_pages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }

      if (filters?.translationStatus) {
        query = query.eq('translation_status', filters.translationStatus);
      }

      if (filters?.searchQuery) {
        query = query.or(`title->>'zh'.ilike.%${filters.searchQuery}%,title->>'en'.ilike.%${filters.searchQuery}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          data: data.map(this.mapToStaticPage),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch static pages');
    }
  }

  /**
   * Get published static pages
   */
  async getPublished(): Promise<APIResponse<StaticPage[]>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data.map(this.mapToStaticPage) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch published pages');
    }
  }

  /**
   * Update static page
   */
  async update(id: string, data: Partial<StaticPage>): Promise<APIResponse<StaticPage>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.title) updateData.title = data.title;
      if (data.content) updateData.content = data.content;
      if (data.slug) updateData.slug = data.slug;
      if (data.metaTitle) updateData.meta_title = data.metaTitle;
      if (data.metaDescription) updateData.meta_description = data.metaDescription;
      if (data.translationStatus) updateData.translation_status = data.translationStatus;
      if (data.isPublished !== undefined) updateData.is_published = data.isPublished;

      const { data: result, error } = await (this.supabase as any)
        .from('static_pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update static page');
    }
  }

  /**
   * Publish static page
   */
  async publish(id: string): Promise<APIResponse<StaticPage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .update({
          is_published: true,
          translation_status: 'published',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to publish static page');
    }
  }

  /**
   * Unpublish static page
   */
  async unpublish(id: string): Promise<APIResponse<StaticPage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .update({
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to unpublish static page');
    }
  }

  /**
   * Delete static page
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await (this.supabase as any)
        .from('static_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete static page');
    }
  }

  /**
   * Update translation status
   */
  async updateTranslationStatus(id: string, status: TranslationStatus): Promise<APIResponse<StaticPage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('static_pages')
        .update({
          translation_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToStaticPage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to update translation status');
    }
  }

  /**
   * Map database row to StaticPage
   */
  private mapToStaticPage(data: any): StaticPage {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      slug: data.slug,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      translationStatus: data.translation_status,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any, defaultMessage: string): APIResponse<any> {
    console.error(defaultMessage, error);
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || defaultMessage,
      },
    };
  }
}

// Export singleton instance
export const staticPageService = new StaticPageService();
