/**
 * Visitor Message Service
 * Business logic for visitor message management
 */

import { getSupabaseClient } from '@/lib/supabase';
import type { VisitorMessage, APIResponse, PaginatedResponse, MessageType } from '@/types/content';

export class VisitorMessageService {
  private supabase = getSupabaseClient();

  /**
   * Create a new visitor message
   * Use the server API to bypass potential RLS issues in public context.
   */
  async create(data: Omit<VisitorMessage, 'id' | 'createdAt'>): Promise<APIResponse<VisitorMessage>> {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? null,
          message: data.message,
          messageType: data.messageType ?? 'contact',
          relatedId: data.relatedId ?? null,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || `Failed to send message (HTTP ${res.status})`);
      }

      // The API currently returns only success boolean; we can re-fetch or map a minimal object
      // For UI use we just echo back the submitted fields with a generated timestamp.
      return {
        success: true,
        data: {
          id: 'temp-' + Date.now(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          messageType: (data.messageType as any) || 'contact',
          relatedId: data.relatedId,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to create visitor message');
    }
  }

  /**
   * Get visitor message by ID
   */
  async getById(id: string): Promise<APIResponse<VisitorMessage>> {
    try {
      const { data, error } = await this.supabase
        .from('visitor_messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToVisitorMessage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch visitor message');
    }
  }

  /**
   * Get all visitor messages with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      isRead?: boolean;
      messageType?: MessageType;
      relatedId?: string;
    }
  ): Promise<APIResponse<PaginatedResponse<VisitorMessage>>> {
    try {
      let query = this.supabase
        .from('visitor_messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.messageType) {
        query = query.eq('message_type', filters.messageType);
      }

      if (filters?.relatedId) {
        query = query.eq('related_id', filters.relatedId);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data: {
          data: data.map(this.mapToVisitorMessage),
          total: count || 0,
          page,
          pageSize,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    } catch (error) {
      return this.handleError(error, 'Failed to fetch visitor messages');
    }
  }

  /**
   * Get unread messages
   */
  async getUnread(page: number = 1, pageSize: number = 20): Promise<APIResponse<PaginatedResponse<VisitorMessage>>> {
    return this.getAll(page, pageSize, { isRead: false });
  }

  /**
   * Get messages by type
   */
  async getByType(
    messageType: MessageType,
    page: number = 1,
    pageSize: number = 20
  ): Promise<APIResponse<PaginatedResponse<VisitorMessage>>> {
    return this.getAll(page, pageSize, { messageType });
  }

  /**
   * Get job applications for a specific job
   */
  async getJobApplications(
    jobId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<APIResponse<PaginatedResponse<VisitorMessage>>> {
    // schema 枚举不含 job_application，沿用 'other' 作为职位申请类别占位
    return this.getAll(page, pageSize, { messageType: 'other', relatedId: jobId });
  }

  /**
   * Mark message as read
   */
  async markAsRead(id: string): Promise<APIResponse<VisitorMessage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('visitor_messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToVisitorMessage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to mark message as read');
    }
  }

  /**
   * Mark message as unread
   */
  async markAsUnread(id: string): Promise<APIResponse<VisitorMessage>> {
    try {
      const { data, error } = await (this.supabase as any)
        .from('visitor_messages')
        .update({ is_read: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data: this.mapToVisitorMessage(data) };
    } catch (error) {
      return this.handleError(error, 'Failed to mark message as unread');
    }
  }

  /**
   * Mark multiple messages as read
   */
  async markMultipleAsRead(ids: string[]): Promise<APIResponse<void>> {
    try {
      const { error } = await (this.supabase as any)
        .from('visitor_messages')
        .update({ is_read: true })
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to mark messages as read');
    }
  }

  /**
   * Delete message
   */
  async delete(id: string): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('visitor_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete visitor message');
    }
  }

  /**
   * Delete multiple messages
   */
  async deleteMultiple(ids: string[]): Promise<APIResponse<void>> {
    try {
      const { error } = await this.supabase
        .from('visitor_messages')
        .delete()
        .in('id', ids);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return this.handleError(error, 'Failed to delete messages');
    }
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(): Promise<APIResponse<number>> {
    try {
      const { count, error } = await this.supabase
        .from('visitor_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;

      return { success: true, data: count || 0 };
    } catch (error) {
      return this.handleError(error, 'Failed to get unread count');
    }
  }

  /**
   * Get message count by type
   */
  async getCountByType(messageType: MessageType): Promise<APIResponse<number>> {
    try {
      const { count, error } = await this.supabase
        .from('visitor_messages')
        .select('*', { count: 'exact', head: true })
        .eq('message_type', messageType);

      if (error) throw error;

      return { success: true, data: count || 0 };
    } catch (error) {
      return this.handleError(error, 'Failed to get message count');
    }
  }

  /**
   * Map database row to VisitorMessage
   */
  private mapToVisitorMessage(data: any): VisitorMessage {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      messageType: data.message_type,
      relatedId: data.related_id,
      isRead: data.is_read,
      createdAt: data.created_at,
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
export const visitorMessageService = new VisitorMessageService();
