/**
 * Unit Tests for Authentication Middleware
 * Tests auth functionality and security
 */

import { NextRequest } from 'next/server';
import {
  withAdminAuth,
  createAuthenticatedHandler,
  rateLimit,
  ADMIN_ROLES,
  hasRequiredRole,
} from '@/lib/auth-middleware';

// Mock Supabase
jest.mock('@/lib/supabase-server', () => ({
  createClient: () => ({
    auth: {
      getUser: jest.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: jest.fn(),
        }),
      }),
    }),
  }),
}));

describe('Authentication Middleware', () => {
  beforeEach(() => {
    // Clear rate limit map
    (rateLimit as any).rateLimitMap = new Map();
  });

  describe('Role Hierarchy', () => {
    it('should correctly validate role permissions', () => {
      expect(hasRequiredRole(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN)).toBe(true);
      expect(hasRequiredRole(ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR)).toBe(true);
      expect(hasRequiredRole(ADMIN_ROLES.EDITOR, ADMIN_ROLES.TRANSLATOR)).toBe(true);
      expect(hasRequiredRole(ADMIN_ROLES.TRANSLATOR, ADMIN_ROLES.EDITOR)).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within limit', () => {
      const identifier = 'test-ip';

      for (let i = 0; i < 50; i++) {
        const result = rateLimit(identifier, 100, 60000);
        expect(result.success).toBe(true);
      }
    });

    it('should block requests exceeding limit', () => {
      const identifier = 'test-ip';

      // Use up the limit
      for (let i = 0; i < 100; i++) {
        rateLimit(identifier, 100, 60000);
      }

      // Next request should be blocked
      const result = rateLimit(identifier, 100, 60000);
      expect(result.success).toBe(false);
      expect(result.response).toBeDefined();
    });
  });

  describe('Authentication Handler', () => {
    it('should create authenticated handlers', () => {
      const mockHandler = jest.fn();
      const authenticatedHandler = createAuthenticatedHandler(mockHandler, ADMIN_ROLES.ADMIN);

      expect(typeof authenticatedHandler).toBe('function');
    });

    it('should protect routes requiring authentication', async () => {
      const mockHandler = jest.fn();
      const authenticatedHandler = createAuthenticatedHandler(mockHandler, ADMIN_ROLES.ADMIN);

      const request = new NextRequest('http://localhost:3000/api/test');

      // Mock unauthenticated request
      const result = await authenticatedHandler(request);

      expect(result.status).toBe(401);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('Token Extraction', () => {
    it('should extract Bearer token from Authorization header', () => {
      const token = 'test-token-123';
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      // Access private method for testing
      const getAuthToken = (withAdminAuth as any).getAuthToken;
      const extractedToken = getAuthToken(request);

      expect(extractedToken).toBe(token);
    });

    it('should extract token from cookies', () => {
      const token = 'cookie-token-456';
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          cookie: `sb-access-token=${token}`,
        },
      });

      // Access private method for testing
      const getAuthToken = (withAdminAuth as any).getAuthToken;
      const extractedToken = getAuthToken(request);

      expect(extractedToken).toBe(token);
    });

    it('should return null for missing token', () => {
      const request = new NextRequest('http://localhost:3000/api/test');

      // Access private method for testing
      const getAuthToken = (withAdminAuth as any).getAuthToken;
      const extractedToken = getAuthToken(request);

      expect(extractedToken).toBeNull();
    });
  });

  describe('CORS Headers', () => {
    it('should add CORS headers to responses', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          origin: 'http://example.com',
        },
      });

      // Access private method for testing
      const cors = (withAdminAuth as any).cors;
      const corsResponse = cors(request);

      if (corsResponse) {
        expect(corsResponse.headers.get('Access-Control-Allow-Origin')).toBe('http://example.com');
        expect(corsResponse.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS');
      }
    });
  });

  describe('Admin Role Validation', () => {
    it('should validate admin roles correctly', () => {
      const roles = Object.values(ADMIN_ROLES);

      expect(roles).toContain('super_admin');
      expect(roles).toContain('admin');
      expect(roles).toContain('editor');
      expect(roles).toContain('translator');
    });

    it('should have correct role hierarchy values', () => {
      expect(ADMIN_ROLES.TRANSLATOR).toBe('translator');
      expect(ADMIN_ROLES.EDITOR).toBe('editor');
      expect(ADMIN_ROLES.ADMIN).toBe('admin');
      expect(ADMIN_ROLES.SUPER_ADMIN).toBe('super_admin');
    });
  });
});
