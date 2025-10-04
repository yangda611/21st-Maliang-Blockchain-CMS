/**
 * SEO Service
 * Business logic for SEO optimization
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { APIResponse, SEOConfiguration, MultiLanguageText } from '@/types/content';
import {
  generateSlug,
  generateUniqueSlug,
  generateMetaTitle,
  generateMetaDescription,
  generateCanonicalUrl,
  generateSitemapEntry,
  validateMetaTitleLength,
  validateMetaDescriptionLength,
} from '@/utils/seo';

export class SEOService {
  private supabase = getSupabaseClient();

  /**
   * Create SEO configuration
   */
  async createConfig(data: Omit<SEOConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<SEOConfiguration>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('seo_configurations')
        .insert({
          page_type: data.pageType,
          page_id: data.pageId,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          og_image: data.ogImage,
          canonical_url: data.canonicalUrl,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToSEOConfig(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create SEO configuration');
    }
  }

  /**
   * Get SEO configuration by page
   */
  async getConfig(pageType: string, pageId?: string): Promise<APIResponse<SEOConfiguration>> {
    try {
      let query = this.supabase
        .from('seo_configurations')
        .select('*')
        .eq('page_type', pageType);

      if (pageId) {
        query = query.eq('page_id', pageId);
      } else {
        query = query.is('page_id', null);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      return { success: true, data: this.mapToSEOConfig(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch SEO configuration');
    }
  }

  /**
   * Update SEO configuration
   */
  async updateConfig(id: string, data: Partial<SEOConfiguration>): Promise<APIResponse<SEOConfiguration>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.metaTitle) updateData.meta_title = data.metaTitle;
      if (data.metaDescription) updateData.meta_description = data.metaDescription;
      if (data.metaKeywords) updateData.meta_keywords = data.metaKeywords;
      if (data.ogImage !== undefined) updateData.og_image = data.ogImage;
      if (data.canonicalUrl !== undefined) updateData.canonical_url = data.canonicalUrl;

      const { data: result, error } = await (this.supabase as any)
        .from('seo_configurations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToSEOConfig(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update SEO configuration');
    }
  }

  /**
   * Delete SEO configuration
   */
  async deleteConfig(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await (this.supabase as any)
        .from('seo_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete SEO configuration');
    }
  }

  /**
   * Generate sitemap data
   */
  async generateSitemap(baseUrl: string): Promise<APIResponse<any[]>> {
    try {
      const sitemapEntries: any[] = [];

      // Add static pages
      const { data: pages } = await (this.supabase as any)
        .from('static_pages')
        .select('slug, updated_at')
        .eq('is_published', true);

      if (pages) {
        pages.forEach((page: any) => {
          sitemapEntries.push(
            generateSitemapEntry(`${baseUrl}/pages/${page.slug}`, page.updated_at, 0.9, 'monthly')
          );
        });
      }

      // Add products
      const { data: products } = await (this.supabase as any)
        .from('products')
        .select('slug, updated_at')
        .eq('is_published', true);

      if (products) {
        products.forEach((product: any) => {
          sitemapEntries.push(
            generateSitemapEntry(`${baseUrl}/products/${product.slug}`, product.updated_at, 0.8, 'weekly')
          );
        });
      }

      // Add articles
      const { data: articles } = await (this.supabase as any)
        .from('articles')
        .select('slug, updated_at')
        .eq('is_published', true);

      if (articles) {
        articles.forEach((article: any) => {
          sitemapEntries.push(
            generateSitemapEntry(`${baseUrl}/articles/${article.slug}`, article.updated_at, 0.7, 'weekly')
          );
        });
      }

      // Add job postings
      const { data: jobs } = await (this.supabase as any)
        .from('job_postings')
        .select('id, updated_at')
        .eq('is_active', true);

      if (jobs) {
        jobs.forEach((job: any) => {
          sitemapEntries.push(
            generateSitemapEntry(`${baseUrl}/jobs/${job.id}`, job.updated_at, 0.6, 'weekly')
          );
        });
      }

      // Add categories
      const { data: categories } = await (this.supabase as any)
        .from('content_categories')
        .select('slug, updated_at')
        .eq('is_active', true);

      if (categories) {
        categories.forEach((category: any) => {
          sitemapEntries.push(
            generateSitemapEntry(`${baseUrl}/categories/${category.slug}`, category.updated_at, 0.7, 'weekly')
          );
        });
      }

      return { success: true, data: sitemapEntries };
    } catch (error) {
      return this.handleError(error, 'Failed to generate sitemap');
    }
  }

  /**
   * Generate unique slug for content
   */
  async generateUniqueSlug(baseText: string, tableName: string, excludeId?: string): Promise<APIResponse<string>> {
    try {
      const baseSlug = generateSlug(baseText);

      // Get existing slugs
      let query = this.supabase
        .from(tableName)
        .select('slug');

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const existingSlugs = data?.map((item: any) => item.slug) || [];
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

      return { success: true, data: uniqueSlug };
    } catch (error) {
      return this.handleError(error, 'Failed to generate unique slug');
    }
  }

  /**
   * Validate SEO metadata
   */
  validateMetadata(metaTitle: string, metaDescription: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    const titleValidation = validateMetaTitleLength(metaTitle);
    if (!titleValidation.valid) {
      errors.push(titleValidation.message!);
    }

    const descValidation = validateMetaDescriptionLength(metaDescription);
    if (!descValidation.valid) {
      errors.push(descValidation.message!);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate optimized meta tags
   */
  generateMetaTags(
    title: MultiLanguageText,
    description: MultiLanguageText,
    siteName: string,
    language: string = 'zh'
  ): {
    metaTitle: string;
    metaDescription: string;
  } {
    const titleText = title[language as keyof MultiLanguageText] || title.zh || title.en || '';
    const descText = description[language as keyof MultiLanguageText] || description.zh || description.en || '';

    return {
      metaTitle: generateMetaTitle(titleText, siteName),
      metaDescription: generateMetaDescription(descText),
    };
  }

  /**
   * Submit URL to search engines
   */
  async submitToSearchEngines(url: string): Promise<APIResponse<void>> {
    try {
      // TODO: Implement actual search engine submission
      // This would integrate with Google Search Console API, Bing Webmaster Tools, etc.
      
      console.log('Submitting URL to search engines:', url);
      
      // Placeholder for actual implementation
      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to submit to search engines');
    }
  }

  /**
   * Get SEO analytics summary
   */
  async getAnalyticsSummary(): Promise<APIResponse<any>> {
    try {
      const summary: any = {
        totalPages: 0,
        publishedContent: 0,
        missingMetadata: 0,
        optimizedContent: 0,
      };

      // Count static pages
      const { count: pagesCount } = await (this.supabase as any)
        .from('static_pages')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      summary.totalPages += pagesCount || 0;

      // Count products
      const { count: productsCount } = await (this.supabase as any)
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      summary.publishedContent += productsCount || 0;

      // Count articles
      const { count: articlesCount } = await (this.supabase as any)
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      summary.publishedContent += articlesCount || 0;

      // Count SEO configurations
      const { count: seoCount } = await (this.supabase as any)
        .from('seo_configurations')
        .select('*', { count: 'exact', head: true });

      summary.optimizedContent = seoCount || 0;
      summary.missingMetadata = summary.publishedContent - summary.optimizedContent;

      return { success: true, data: summary };
    } catch (error) {
      return this.handleError(error, 'Failed to get analytics summary');
    }
  }

  /**
   * Map database row to SEOConfiguration
   */
  private mapToSEOConfig(data: any): SEOConfiguration {
    return {
      id: data.id,
      pageType: data.page_type,
      pageId: data.page_id,
      metaTitle: data.meta_title,
      metaDescription: data.meta_description,
      metaKeywords: data.meta_keywords,
      ogImage: data.og_image,
      canonicalUrl: data.canonical_url,
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
export const seoService = new SEOService();
