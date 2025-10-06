/**
 * Admin Category Service
 * Service for category management using admin API routes
 */

import type { ContentCategory, APIResponse, PaginatedResponse } from '@/types/content';

export class AdminCategoryService {
  private baseUrl = '/api/categories/admin';

  /**
   * Create a new category
   */
  async create(data: Omit<ContentCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<ContentCategory>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create category',
        },
      };
    }
  }

  /**
   * Get all categories
   */
  async getAll(filters?: {
    contentType?: 'product' | 'article' | 'page';
    parentId?: string | null;
    active?: boolean;
  }): Promise<APIResponse<ContentCategory[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.contentType) {
        params.append('contentType', filters.contentType);
      }
      
      if (filters?.parentId !== undefined) {
        params.append('parent', filters.parentId || '');
      }
      
      if (filters?.active !== undefined) {
        params.append('active', filters.active.toString());
      }

      const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }

      const result = await response.json();
      return { success: true, data: result.categories || [] };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch categories',
        },
      };
    }
  }

  /**
   * Update category
   */
  async update(id: string, data: Partial<ContentCategory>): Promise<APIResponse<ContentCategory>> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update category',
        },
      };
    }
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete category',
        },
      };
    }
  }

  /**
   * Toggle category active status
   */
  async toggleActive(id: string, isActive: boolean): Promise<APIResponse<ContentCategory>> {
    return this.update(id, { isActive: !isActive });
  }
}

// Export singleton instance
export const adminCategoryService = new AdminCategoryService();
