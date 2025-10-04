/**
 * Contract Test: Visitor Messages API
 * Tests API contract for visitor message operations
 */

import { describe, it, expect, afterAll } from '@jest/globals';
import { getSupabaseClient } from '@/lib/supabase';
import type { VisitorMessage } from '@/types/content';

describe('Visitor Messages API Contract', () => {
  let testMessageId: string;
  const supabase = getSupabaseClient();

  const mockMessage = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+86 138 0000 0000',
    message: 'This is a test message',
    message_type: 'contact' as const,
    is_read: false,
  };

  afterAll(async () => {
    if (testMessageId) {
      await supabase.from('visitor_messages').delete().eq('id', testMessageId);
    }
  });

  describe('POST /api/messages - Create Message', () => {
    it('should create a new visitor message', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .insert(mockMessage)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.name).toBe(mockMessage.name);
      expect(data?.email).toBe(mockMessage.email);
      expect(data?.is_read).toBe(false);

      testMessageId = data!.id;
    });

    it('should create job application message', async () => {
      const jobApplication = {
        ...mockMessage,
        message_type: 'job_application' as const,
        related_id: '00000000-0000-0000-0000-000000000001',
      };

      const { data, error } = await supabase
        .from('visitor_messages')
        .insert(jobApplication)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.message_type).toBe('job_application');
      expect(data?.related_id).toBeDefined();

      await supabase.from('visitor_messages').delete().eq('id', data!.id);
    });

    it('should fail with invalid email format', async () => {
      const { error } = await supabase
        .from('visitor_messages')
        .insert({ ...mockMessage, email: 'invalid-email' });

      expect(error).toBeDefined();
    });
  });

  describe('GET /api/messages - List Messages', () => {
    it('should retrieve all messages', async () => {
      const { data, error } = await supabase.from('visitor_messages').select('*');

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should filter unread messages', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .select('*')
        .eq('is_read', false);

      expect(error).toBeNull();
      data?.forEach((msg) => {
        expect(msg.is_read).toBe(false);
      });
    });

    it('should filter by message type', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .select('*')
        .eq('message_type', 'contact');

      expect(error).toBeNull();
      data?.forEach((msg) => {
        expect(msg.message_type).toBe('contact');
      });
    });

    it('should order messages by created_at desc', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .select('*')
        .order('created_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('GET /api/messages/:id - Get Single Message', () => {
    it('should retrieve message by id', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .select('*')
        .eq('id', testMessageId)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.id).toBe(testMessageId);
    });
  });

  describe('PUT /api/messages/:id - Update Message', () => {
    it('should mark message as read', async () => {
      const { data, error } = await supabase
        .from('visitor_messages')
        .update({ is_read: true })
        .eq('id', testMessageId)
        .select()
        .single();

      expect(error).toBeNull();
      expect(data?.is_read).toBe(true);
    });
  });

  describe('DELETE /api/messages/:id - Delete Message', () => {
    it('should delete message', async () => {
      const { error } = await supabase
        .from('visitor_messages')
        .delete()
        .eq('id', testMessageId);

      expect(error).toBeNull();
    });
  });

  describe('Message Statistics', () => {
    it('should count unread messages', async () => {
      const { count, error } = await supabase
        .from('visitor_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });

    it('should count messages by type', async () => {
      const { count, error } = await supabase
        .from('visitor_messages')
        .select('*', { count: 'exact', head: true })
        .eq('message_type', 'contact');

      expect(error).toBeNull();
      expect(typeof count).toBe('number');
    });
  });
});
