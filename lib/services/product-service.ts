/**
 * Product Service
 * Business logic for product management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { Product, APIResponse, PaginatedResponse, TranslationStatus } from '@/types/content';

export class ProductService {
  private supabase = getSupabaseClient();

  /**
   * Create a new product
   */
  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<Product>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('products')
        .insert({
          category_id: data.categoryId,
          name: data.name,
          description: data.description,
          specifications: data.specifications,
          pricing: data.pricing,
          images: data.images || [],
          slug: data.slug,
          tags: data.tags || [],
          translation_status: data.translationStatus || 'draft',
          is_published: data.isPublished || false,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create product');
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: string, includeCategory: boolean = false): Promise<APIResponse<Product>> {
    try {
      let query = (this.supabase as any).from('products').select('*');

      if (includeCategory) {
        query = (this.supabase as any).from('products').select('*, content_categories(*)');
      }

      const { data, error } = await query.eq('id', id).single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch product');
    }
  }

  /**
   * Get product by slug
   */
  async getBySlug(slug: string): Promise<APIResponse<Product>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('products')
        .select('*, content_categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch product');
    }
  }

  /**
   * Get all products with pagination and filters
   */
  async getAll(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      categoryId?: string;
      isPublished?: boolean;
      translationStatus?: TranslationStatus;
      tags?: string[];
      searchQuery?: string;
    }
  ): Promise<APIResponse<PaginatedResponse<Product>>> {
    try {
      let query = this.supabase
        .from('products')
        .select('*, content_categories(*)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
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
        query = query.or(`name->>'zh'.ilike.%${filters.searchQuery}%,name->>'en'.ilike.%${filters.searchQuery}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          data: data.map(this.mapToProduct),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch products');
    }
  }

  /**
   * Get published products
   */
  async getPublished(page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Product>>> {
    return this.getAll(page, pageSize, { isPublished: true, translationStatus: 'published' });
  }

  /**
   * Get products by category
   */
  async getByCategory(categoryId: string, page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Product>>> {
    return this.getAll(page, pageSize, { categoryId, isPublished: true });
  }

  /**
   * Get products by tags
   */
  async getByTags(tags: string[], page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<Product>>> {
    return this.getAll(page, pageSize, { tags, isPublished: true });
  }

  /**
   * Update product
   */
  async update(id: string, data: Partial<Product>): Promise<APIResponse<Product>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.categoryId) updateData.category_id = data.categoryId;
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      if (data.specifications) updateData.specifications = data.specifications;
      if (data.pricing) updateData.pricing = data.pricing;
      if (data.images) updateData.images = data.images;
      if (data.slug) updateData.slug = data.slug;
      if (data.tags) updateData.tags = data.tags;
      if (data.translationStatus) updateData.translation_status = data.translationStatus;
      if (data.isPublished !== undefined) updateData.is_published = data.isPublished;

      const { data: result, error } = await (this.supabase as any)
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update product');
    }
  }

  /**
   * Publish product
   */
  async publish(id: string): Promise<APIResponse<Product>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('products')
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

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to publish product');
    }
  }

  /**
   * Unpublish product
   */
  async unpublish(id: string): Promise<APIResponse<Product>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('products')
        .update({
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to unpublish product');
    }
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await (this.supabase as any)
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete product');
    }
  }

  /**
   * Update translation status
   */
  async updateTranslationStatus(id: string, status: TranslationStatus): Promise<APIResponse<Product>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('products')
        .update({
          translation_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to update translation status');
    }
  }

  /**
   * Add images to product
   */
  async addImages(id: string, imageUrls: string[]): Promise<APIResponse<Product>> {
    try {
      const { data: product } = await (this.supabase as any)
        .from('products')
        .select('images')
        .eq('id', id)
        .single();

      const currentImages = product?.images || [];
      const updatedImages = [...currentImages, ...imageUrls];

      const { data, error } = await (this.supabase as any)
        .from('products')
        .update({
          images: updatedImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to add images');
    }
  }

  /**
   * Remove image from product
   */
  async removeImage(id: string, imageUrl: string): Promise<APIResponse<Product>> {
    try {
      const { data: product } = await (this.supabase as any)
        .from('products')
        .select('images')
        .eq('id', id)
        .single();

      const currentImages = product?.images || [];
      const updatedImages = currentImages.filter((img: string) => img !== imageUrl);

      const { data, error } = await (this.supabase as any)
        .from('products')
        .update({
          images: updatedImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToProduct(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to remove image');
    }
  }

  /**
   * Map database row to Product
   */
  private mapToProduct(data: any): Product {
    return {
      id: data.id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      specifications: data.specifications,
      pricing: data.pricing,
      images: data.images || [],
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
export const productService = new ProductService();
