/**
 * Content Category Service
 * Business logic for category management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { ContentCategory, APIResponse, PaginatedResponse } from '@/types/content';

export class ContentCategoryService {
  private supabase = getSupabaseClient();

  /**
   * Create a new category
   */
  async create(data: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<ContentCategory>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('content_categories')
        .insert({
          name: data.name,
          description: data.description,
          slug: data.slug,
          parent_id: data.parentId || null,
          hierarchy_level: data.hierarchyLevel,
          content_type: data.contentType,
          display_order: data.displayOrder,
          is_active: data.isActive,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToCategory(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create category');
    }
  }

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<APIResponse<ContentCategory>> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToCategory(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch category');
    }
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<APIResponse<ContentCategory>> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToCategory(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch category');
    }
  }

  /**
   * Get all categories with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 50,
    filters?: {
      contentType?: 'product' | 'article' | 'page';
      isActive?: boolean;
      parentId?: string | null;
    }
  ): Promise<APIResponse<PaginatedResponse<ContentCategory>>> {
    try {
      let query = this.supabase
        .from('content_categories')
        .select('*', { count: 'exact' })
        .order('display_order', { ascending: true });

      if (filters?.contentType) {
        query = query.eq('content_type', filters.contentType);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.parentId !== undefined) {
        if (filters.parentId === null) {
          query = query.is('parent_id', null);
        } else {
          query = query.eq('parent_id', filters.parentId);
        }
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          data: data.map(this.mapToCategory),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch categories');
    }
  }

  /**
   * Get category tree (hierarchical structure)
   */
  async getTree(contentType?: 'product' | 'article' | 'page'): Promise<APIResponse<ContentCategory[]>> {
    try {
      let query = this.supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('hierarchy_level', { ascending: true })
        .order('display_order', { ascending: true });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const categories = data.map(this.mapToCategory);
      const tree = this.buildTree(categories);

      return { success: true, data: tree };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch category tree');
    }
  }

  /**
   * Update category
   */
  async update(id: string, data: Partial<ContentCategory>): Promise<APIResponse<ContentCategory>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.slug) updateData.slug = data.slug;
      if (data.parentId !== undefined) updateData.parent_id = data.parentId;
      if (data.hierarchyLevel !== undefined) updateData.hierarchy_level = data.hierarchyLevel;
      if (data.displayOrder !== undefined) updateData.display_order = data.displayOrder;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await (this.supabase as any)
        .from('content_categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToCategory(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update category');
    }
  }

  /**
   * Delete category (soft delete)
   */
  async delete(id: string, hardDelete: boolean = false): Promise<APIResponse<void>> {
    try {
      if (hardDelete) {
        const { error } = await this.supabase
          .from('content_categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await (this.supabase as any)
          .from('content_categories')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete category');
    }
  }

  /**
   * Reorder categories
   */
  async reorder(updates: Array<{ id: string; displayOrder: number }>): Promise<APIResponse<void>> {
    try {
      for (const update of updates) {
        const { error } = await (this.supabase as any)
          .from('content_categories')
          .update({
            display_order: update.displayOrder,
            updated_at: new Date().toISOString(),
          })
          .eq('id', update.id);

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to reorder categories');
    }
  }

  /**
   * Get child categories
   */
  async getChildren(parentId: string): Promise<APIResponse<ContentCategory[]>> {
    try {
      const { data, error } = await this.supabase
        .from('content_categories')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      return { success: true, data: data.map(this.mapToCategory) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch child categories');
    }
  }

  /**
   * Build hierarchical tree structure
   */
  private buildTree(categories: ContentCategory[]): ContentCategory[] {
    const map = new Map<string, ContentCategory & { children?: ContentCategory[] }>();
    const roots: ContentCategory[] = [];

    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children!.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  /**
   * Map database row to ContentCategory
   */
  private mapToCategory(data: any): ContentCategory {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      slug: data.slug,
      parentId: data.parent_id,
      hierarchyLevel: data.hierarchy_level,
      contentType: data.content_type,
      displayOrder: data.display_order,
      isActive: data.is_active,
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
export const contentCategoryService = new ContentCategoryService();
