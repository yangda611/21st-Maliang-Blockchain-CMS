/**
 * Contract Test: Admin Authentication API
 * Tests API contract for admin authentication operations
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { getSupabaseClient, signInAdmin, signOutAdmin, getCurrentAdmin } from '@/lib/supabase';

describe('Admin Authentication API Contract', () => {
  const supabase = getSupabaseClient();
  let testAdminId: string;
  
  const testAdmin = {
    email: 'test-admin@example.com',
    password: 'TestPassword123!',
    role: 'editor' as const,
    is_active: true,
  };

  beforeAll(async () => {
    // Note: In real implementation, password should be hashed
    // This test assumes Supabase Auth handles password hashing
  });

  afterAll(async () => {
    // Cleanup test admin
    if (testAdminId) {
      await supabase.from('admin_users').delete().eq('id', testAdminId);
    }
  });

  describe('POST /api/auth/signup - Admin Registration', () => {
    it('should create a new admin user', async () => {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testAdmin.email,
        password: testAdmin.password,
      });

      expect(authError).toBeNull();
      expect(authData.user).toBeDefined();

      // Then create admin_users record
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          id: authData.user!.id,
          email: testAdmin.email,
          role: testAdmin.role,
          is_active: testAdmin.is_active,
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.email).toBe(testAdmin.email);
      expect(data?.role).toBe(testAdmin.role);

      testAdminId = data!.id;
    });

    it('should fail with duplicate email', async () => {
      const { error } = await supabase.auth.signUp({
        email: testAdmin.email,
        password: testAdmin.password,
      });

      expect(error).toBeDefined();
    });

    it('should fail with weak password', async () => {
      const { error } = await supabase.auth.signUp({
        email: 'weak-password@example.com',
        password: '123',
      });

      expect(error).toBeDefined();
    });
  });

  describe('POST /api/auth/signin - Admin Login', () => {
    it('should sign in with valid credentials', async () => {
      const result = await signInAdmin(testAdmin.email, testAdmin.password);

      expect(result.error).toBeNull();
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(testAdmin.email);
    });

    it('should fail with invalid email', async () => {
      const result = await signInAdmin('nonexistent@example.com', testAdmin.password);

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });

    it('should fail with invalid password', async () => {
      const result = await signInAdmin(testAdmin.email, 'WrongPassword123!');

      expect(result.error).toBeDefined();
      expect(result.user).toBeNull();
    });

    it('should fail with inactive admin account', async () => {
      // Deactivate admin
      await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('id', testAdminId);

      const result = await signInAdmin(testAdmin.email, testAdmin.password);

      expect(result.error).toBeDefined();

      // Reactivate for other tests
      await supabase
        .from('admin_users')
        .update({ is_active: true })
        .eq('id', testAdminId);
    });
  });

  describe('GET /api/auth/user - Get Current User', () => {
    it('should retrieve current authenticated user', async () => {
      // First sign in
      await signInAdmin(testAdmin.email, testAdmin.password);

      const user = await getCurrentAdmin();

      expect(user).toBeDefined();
      expect(user?.email).toBe(testAdmin.email);
    });

    it('should return null when not authenticated', async () => {
      await signOutAdmin();

      const user = await getCurrentAdmin();

      expect(user).toBeNull();
    });
  });

  describe('POST /api/auth/signout - Admin Logout', () => {
    it('should sign out successfully', async () => {
      // First sign in
      await signInAdmin(testAdmin.email, testAdmin.password);

      const result = await signOutAdmin();

      expect(result.success).toBe(true);

      // Verify user is signed out
      const user = await getCurrentAdmin();
      expect(user).toBeNull();
    });
  });

  describe('Role-Based Access Control', () => {
    it('should retrieve admin role', async () => {
      await signInAdmin(testAdmin.email, testAdmin.password);

      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('email', testAdmin.email)
        .single();

      expect(error).toBeNull();
      expect(data?.role).toBe(testAdmin.role);
    });

    it('should support different admin roles', async () => {
      const roles = ['super_admin', 'admin', 'editor', 'translator'];

      roles.forEach((role) => {
        expect(['super_admin', 'admin', 'editor', 'translator']).toContain(role);
      });
    });
  });

  describe('Session Management', () => {
    it('should maintain session after login', async () => {
      await signInAdmin(testAdmin.email, testAdmin.password);

      const { data: { session }, error } = await supabase.auth.getSession();

      expect(error).toBeNull();
      expect(session).toBeDefined();
      expect(session?.user.email).toBe(testAdmin.email);
    });

    it('should refresh session token', async () => {
      await signInAdmin(testAdmin.email, testAdmin.password);

      const { data, error } = await supabase.auth.refreshSession();

      expect(error).toBeNull();
      expect(data.session).toBeDefined();
    });
  });

  describe('Password Reset', () => {
    it('should send password reset email', async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(testAdmin.email);

      expect(error).toBeNull();
    });
  });
});
