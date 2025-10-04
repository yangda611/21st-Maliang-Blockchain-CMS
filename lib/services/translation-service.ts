/**
 * Translation Service
 * Business logic for multi-language content management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type {
  SupportedLanguage,
  TranslationStatus,
  TranslationProgress,
  TranslationWorkflow,
  APIResponse,
  ContentType,
} from '@/types/content';
import { SUPPORTED_LANGUAGES, getMissingLanguages, getTranslationCompleteness } from '@/utils/language-detection';

export class TranslationService {
  private supabase = getSupabaseClient();

  /**
   * Get translation progress for content
   */
  async getProgress(contentId: string, contentType: ContentType): Promise<APIResponse<TranslationProgress>> {
    try {
      const tableName = this.getTableName(contentType);
      const { data, error } = await (this.supabase as any)
        .from(tableName)
        .select('name, title, description')
        .eq('id', contentId)
        .single();

      if (error) throw error;

      // Check which fields have translations
      const content = data.name || data.title || data.description || {};
      const completedLanguages = SUPPORTED_LANGUAGES.filter((lang) => content[lang]);
      const pendingLanguages = SUPPORTED_LANGUAGES.filter((lang) => !content[lang]);
      const completionPercentage = getTranslationCompleteness(content);

      return {
        success: true,
        data: {
          contentId,
          contentType,
          totalLanguages: SUPPORTED_LANGUAGES.length,
          completedLanguages,
          pendingLanguages,
          completionPercentage,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to get translation progress');
    }
  }

  /**
   * Submit content for translation review
   */
  async submitForReview(
    contentId: string,
    contentType: ContentType,
    translatorId: string,
    notes?: string
  ): Promise<APIResponse<void>> {
    try {
      const tableName = this.getTableName(contentType);
      const { error } = await (this.supabase as any)
        .from(tableName)
        .update({
          translation_status: 'pending_review',
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', contentId);

      if (error) throw error;

      // TODO: Create translation workflow record
      // This would track the review process

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to submit for review');
    }
  }

  /**
   * Approve translation
   */
  async approveTranslation(
    contentId: string,
    contentType: ContentType,
    reviewerId: string,
    feedback?: string
  ): Promise<APIResponse<void>> {
    try {
      const tableName = this.getTableName(contentType);
      const { error } = await (this.supabase as any)
        .from(tableName)
        .update({
          translation_status: 'published',
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', contentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to approve translation');
    }
  }

  /**
   * Reject translation (send back to draft)
   */
  async rejectTranslation(
    contentId: string,
    contentType: ContentType,
    reviewerId: string,
    feedback: string
  ): Promise<APIResponse<void>> {
    try {
      const tableName = this.getTableName(contentType);
      const { error } = await (this.supabase as any)
        .from(tableName)
        .update({
          translation_status: 'draft',
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', contentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to reject translation');
    }
  }

  /**
   * Update translation for specific language
   */
  async updateLanguage(
    contentId: string,
    contentType: ContentType,
    language: SupportedLanguage,
    translations: Record<string, string>
  ): Promise<APIResponse<void>> {
    try {
      const tableName = this.getTableName(contentType);
      
      // Get current content
      const { data: current } = await (this.supabase as any)
        .from(tableName)
        .select('*')
        .eq('id', contentId)
        .single();

      if (!current) {
        throw new Error('Content not found');
      }

      // Update each translatable field
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      Object.entries(translations).forEach(([field, value]) => {
        if (current[field]) {
          updateData[field] = {
            ...current[field],
            [language]: value,
          };
        }
      });

      const { error } = await (this.supabase as any)
        .from(tableName)
        .update(updateData as any)
        .eq('id', contentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to update translation');
    }
  }

  /**
   * Copy translation from one language to another
   */
  async copyTranslation(
    contentId: string,
    contentType: ContentType,
    fromLanguage: SupportedLanguage,
    toLanguage: SupportedLanguage
  ): Promise<APIResponse<void>> {
    try {
      const tableName = this.getTableName(contentType);
      
      const { data: current } = await (this.supabase as any)
        .from(tableName)
        .select('*')
        .eq('id', contentId)
        .single();

      if (!current) {
        throw new Error('Content not found');
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Copy translatable fields
      const translatableFields = ['name', 'title', 'description', 'content', 'excerpt', 'requirements'];
      
      translatableFields.forEach((field) => {
        if (current[field] && current[field][fromLanguage]) {
          updateData[field] = {
            ...current[field],
            [toLanguage]: current[field][fromLanguage],
          };
        }
      });

      const { error } = await (this.supabase as any)
        .from(tableName)
        .update(updateData as any)
        .eq('id', contentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to copy translation');
    }
  }

  /**
   * Get content pending translation review
   */
  async getPendingReviews(contentType?: ContentType): Promise<APIResponse<any[]>> {
    try {
      const results: any[] = [];

      const contentTypes: ContentType[] = contentType ? [contentType] : ['product', 'article', 'page'];

      for (const type of contentTypes) {
        const tableName = this.getTableName(type);
        const { data, error } = await (this.supabase as any)
          .from(tableName)
          .select('*')
          .eq('translation_status', 'pending_review')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          results.push(...data.map((item: any) => ({ ...item, contentType: type })));
        }
      }

      return { success: true, data: results };
    } catch (error) {
      return this.handleError(error, 'Failed to get pending reviews');
    }
  }

  /**
   * Get incomplete translations
   */
  async getIncompleteTranslations(contentType?: ContentType): Promise<APIResponse<any[]>> {
    try {
      const results: any[] = [];

      const contentTypes: ContentType[] = contentType ? [contentType] : ['product', 'article', 'page'];

      for (const type of contentTypes) {
        const tableName = this.getTableName(type);
        const { data, error } = await (this.supabase as any)
          .from(tableName)
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Filter items with incomplete translations
          const incomplete = data.filter((item: any) => {
            const content = item.name || item.title || item.description || {};
            const missing = getMissingLanguages(content);
            return missing.length > 0;
          });

          results.push(...incomplete.map((item: any) => ({ ...item, contentType: type })));
        }
      }

      return { success: true, data: results };
    } catch (error) {
      return this.handleError(error, 'Failed to get incomplete translations');
    }
  }

  /**
   * Validate translation completeness
   */
  validateCompleteness(content: Record<string, string>): {
    isComplete: boolean;
    missingLanguages: SupportedLanguage[];
    completionPercentage: number;
  } {
    const missing = getMissingLanguages(content);
    const percentage = getTranslationCompleteness(content);

    return {
      isComplete: missing.length === 0,
      missingLanguages: missing,
      completionPercentage: percentage,
    };
  }

  /**
   * Get table name from content type
   */
  private getTableName(contentType: ContentType): string {
    const tableMap: Record<ContentType, string> = {
      product: 'products',
      article: 'articles',
      page: 'static_pages',
    };

    return tableMap[contentType];
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
export const translationService = new TranslationService();
