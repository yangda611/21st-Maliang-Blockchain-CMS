/**
 * Article Service
 * Business logic for article management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { Article, APIResponse, PaginatedResponse, TranslationStatus } from '@/types/content';

export class ArticleService {
  private supabase = getSupabaseClient();

  /**
   * Create a new article
   */
  async create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<Article>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('articles')
        .insert({
          category_id: data.categoryId,
          author_id: data.authorId,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          featured_image: data.featuredImage,
          slug: data.slug,
          tags: data.tags || [],
          translation_status: data.translationStatus || 'draft',
          is_published: data.isPublished || false,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create article');
    }
  }

  /**
   * Get article by ID
   */
  async getById(id: string, includeRelations: boolean = false): Promise<APIResponse<Article>> {
    try {
      let query = (this.supabase as any).from('articles').select('*');

      if (includeRelations) {
        query = (this.supabase as any).from('articles').select('*, content_categories(*), admin_users(*)');
      }

      const { data, error } = await query.eq('id', id).single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch article');
    }
  }

  /**
   * Get article by slug
   */
  async getBySlug(slug: string): Promise<APIResponse<Article>> {
    try {
      const { data, error } = await this.supabase
        .from('articles')
        .select('*, content_categories(*), admin_users(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch article');
    }
  }

  /**
   * Get all articles with pagination and filters
   */
  async getAll(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      categoryId?: string;
      authorId?: string;
      isPublished?: boolean;
      translationStatus?: TranslationStatus;
      tags?: string[];
      searchQuery?: string;
    }
  ): Promise<APIResponse<PaginatedResponse<Article>>> {
    try {
      let query = this.supabase
        .from('articles')
        .select('*, content_categories(*), admin_users(*)', { count: 'exact' })
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.authorId) {
        query = query.eq('author_id', filters.authorId);
      }

      if (filters?.isPublished !== undefined) {
        query = query.eq('is_published', filters.isPublished);
      }

      if (filters?.translationStatus) {
        query = query.eq('translation_status', filters.translationStatus);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
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
          data: data.map(this.mapToArticle),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch articles');
    }
  }

  /**
   * Get published articles
   */
  async getPublished(page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Article>>> {
    return this.getAll(page, pageSize, { isPublished: true, translationStatus: 'published' });
  }

  /**
   * Get articles by category
   */
  async getByCategory(categoryId: string, page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Article>>> {
    return this.getAll(page, pageSize, { categoryId, isPublished: true });
  }

  /**
   * Get articles by author
   */
  async getByAuthor(authorId: string, page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Article>>> {
    return this.getAll(page, pageSize, { authorId });
  }

  /**
   * Get articles by tags
   */
  async getByTags(tags: string[], page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Article>>> {
    return this.getAll(page, pageSize, { tags, isPublished: true });
  }

  /**
   * Get related articles (same category or tags)
   */
  async getRelated(articleId: string, limit: number = 5): Promise<APIResponse<Article[]>> {
    try {
      const { data: article } = await (this.supabase as any)
        .from('articles')
        .select('category_id, tags')
        .eq('id', articleId)
        .single();

      if (!article) {
        throw new Error('Article not found');
      }

      const { data, error } = await (this.supabase as any)
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .neq('id', articleId)
        .or(`category_id.eq.${article.category_id},tags.cs.{${article.tags?.join(',') || ''}}`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { success: true, data: data.map(this.mapToArticle) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch related articles');
    }
  }

  /**
   * Update article
   */
  async update(id: string, data: Partial<Article>): Promise<APIResponse<Article>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.categoryId) updateData.category_id = data.categoryId;
      if (data.title) updateData.title = data.title;
      if (data.content) updateData.content = data.content;
      if (data.excerpt) updateData.excerpt = data.excerpt;
      if (data.featuredImage !== undefined) updateData.featured_image = data.featuredImage;
      if (data.slug) updateData.slug = data.slug;
      if (data.tags) updateData.tags = data.tags;
      if (data.translationStatus) updateData.translation_status = data.translationStatus;
      if (data.isPublished !== undefined) updateData.is_published = data.isPublished;

      const { data: result, error } = await (this.supabase as any)
        .from('articles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update article');
    }
  }

  /**
   * Publish article
   */
  async publish(id: string): Promise<APIResponse<Article>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('articles')
        .update({
          is_published: true,
          translation_status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to publish article');
    }
  }

  /**
   * Unpublish article
   */
  async unpublish(id: string): Promise<APIResponse<Article>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('articles')
        .update({
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to unpublish article');
    }
  }

  /**
   * Delete article
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete article');
    }
  }

  /**
   * Update translation status
   */
  async updateTranslationStatus(id: string, status: TranslationStatus): Promise<APIResponse<Article>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('articles')
        .update({
          translation_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToArticle(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to update translation status');
    }
  }

  /**
   * Map database row to Article
   */
  private mapToArticle(data: any): Article {
    return {
      id: data.id,
      categoryId: data.category_id,
      authorId: data.author_id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      featuredImage: data.featured_image,
      slug: data.slug,
      tags: data.tags || [],
      translationStatus: data.translation_status,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
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
export const articleService = new ArticleService();
