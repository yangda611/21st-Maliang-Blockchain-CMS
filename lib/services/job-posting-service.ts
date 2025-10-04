/**
 * Job Posting Service
 * Business logic for job posting management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { JobPosting, APIResponse, PaginatedResponse } from '@/types/content';

export class JobPostingService {
  private supabase = getSupabaseClient();

  /**
   * Create a new job posting
   */
  async create(data: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<JobPosting>> {
    try {
      const { data: result, error } = await (this.supabase as any)
        .from('job_postings')
        .insert({
          title: data.title,
          description: data.description,
          requirements: data.requirements,
          location: data.location,
          employment_type: data.employmentType,
          application_deadline: data.applicationDeadline,
          is_active: data.isActive !== undefined ? data.isActive : true,
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to create job posting');
    }
  }

  /**
   * Get job posting by ID
   */
  async getById(id: string): Promise<APIResponse<JobPosting>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('job_postings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch job posting');
    }
  }

  /**
   * Get all job postings with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      isActive?: boolean;
      employmentType?: string;
      includeExpired?: boolean;
    }
  ): Promise<APIResponse<PaginatedResponse<JobPosting>>> {
    try {
      let query = this.supabase
        .from('job_postings')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      if (filters?.employmentType) {
        query = query.eq('employment_type', filters.employmentType);
      }

      if (!filters?.includeExpired) {
        query = query.or('application_deadline.is.null,application_deadline.gte.' + new Date().toISOString());
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          data: data.map(this.mapToJobPosting),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch job postings');
    }
  }

  /**
   * Get active job postings
   */
  async getActive(page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<JobPosting>>> {
    return this.getAll(page, pageSize, { isActive: true, includeExpired: false });
  }

  /**
   * Get job postings by employment type
   */
  async getByEmploymentType(
    employmentType: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<APIResponse<PaginatedResponse<JobPosting>>> {
    return this.getAll(page, pageSize, { isActive: true, employmentType, includeExpired: false });
  }

  /**
   * Update job posting
   */
  async update(id: string, data: Partial<JobPosting>): Promise<APIResponse<JobPosting>> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.requirements) updateData.requirements = data.requirements;
      if (data.location) updateData.location = data.location;
      if (data.employmentType) updateData.employment_type = data.employmentType;
      if (data.applicationDeadline !== undefined) updateData.application_deadline = data.applicationDeadline;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await (this.supabase as any)
        .from('job_postings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(result) };
    } catch (error) {
      return this.handleError(error, 'Failed to update job posting');
    }
  }

  /**
   * Activate job posting
   */
  async activate(id: string): Promise<APIResponse<JobPosting>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('job_postings')
        .update({
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to activate job posting');
    }
  }

  /**
   * Deactivate job posting
   */
  async deactivate(id: string): Promise<APIResponse<JobPosting>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('job_postings')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to deactivate job posting');
    }
  }

  /**
   * Delete job posting
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await (this.supabase as any)
        .from('job_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete job posting');
    }
  }

  /**
   * Extend application deadline
   */
  async extendDeadline(id: string, newDeadline: string): Promise<APIResponse<JobPosting>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('job_postings')
        .update({
          application_deadline: newDeadline,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToJobPosting(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to extend deadline');
    }
  }

  /**
   * Check if job posting is expired
   */
  isExpired(jobPosting: JobPosting): boolean {
    if (!jobPosting.applicationDeadline) {
      return false;
    }

    return new Date(jobPosting.applicationDeadline) < new Date();
  }

  /**
   * Map database row to JobPosting
   */
  private mapToJobPosting(data: any): JobPosting {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      employmentType: data.employment_type,
      applicationDeadline: data.application_deadline,
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
export const jobPostingService = new JobPostingService();
