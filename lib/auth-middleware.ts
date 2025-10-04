/**
 * Authentication Middleware
 * Protects API routes that require admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// Admin roles in order of hierarchy
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  TRANSLATOR: 'translator',
} as const;

export type AdminRole = typeof ADMIN_ROLES[keyof typeof ADMIN_ROLES];

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  [ADMIN_ROLES.TRANSLATOR]: 1,
  [ADMIN_ROLES.EDITOR]: 2,
  [ADMIN_ROLES.ADMIN]: 3,
  [ADMIN_ROLES.SUPER_ADMIN]: 4,
} as const;

/**
 * Check if user has required role for access
 */
function hasRequiredRole(userRole: AdminRole, requiredRole: AdminRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Extract token from request headers
 */
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Also check for token in cookies (for browser requests)
  const token = request.cookies.get('sb-access-token')?.value;
  if (token) {
    return token;
  }

  return null;
}

/**
 * Authenticate user and get their admin info
 */
async function authenticateAdmin(token: string): Promise<{
  user: any;
  adminUser: any;
} | null> {
  try {
    const supabase = createClient();

    // Set the auth token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return null;
    }

    // Get admin user data
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      return null;
    }

    return { user, adminUser };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware function for protecting admin routes
 */
export async function withAdminAuth(
  request: NextRequest,
  requiredRole: AdminRole = ADMIN_ROLES.EDITOR
): Promise<{
  authenticated: true;
  user: any;
  adminUser: any;
} | {
  authenticated: false;
  response: NextResponse;
}> {
  try {
    const token = getAuthToken(request);

    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        ),
      };
    }

    const authResult = await authenticateAdmin(token);

    if (!authResult) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        ),
      };
    }

    const { user, adminUser } = authResult;

    // Check if user has required role
    if (!hasRequiredRole(adminUser.role, requiredRole)) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        ),
      };
    }

    return {
      authenticated: true,
      user,
      adminUser,
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      ),
    };
  }
}

/**
 * Higher-order function to create authenticated API route handlers
 */
export function createAuthenticatedHandler<T extends any[]>(
  handler: (request: NextRequest, auth: { user: any; adminUser: any }, ...args: T) => Promise<NextResponse>,
  requiredRole: AdminRole = ADMIN_ROLES.EDITOR
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = await withAdminAuth(request, requiredRole);

    if (!authResult.authenticated) {
      return authResult.response;
    }

    return handler(request, authResult, ...args);
  };
}

/**
 * Rate limiting for API routes
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { success: boolean; response?: NextResponse } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  rateLimitMap.forEach((data, key) => {
    if (data && data.resetTime < now) {
      rateLimitMap.delete(key);
    }
  });

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < now) {
    // First request or window expired
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      ),
    };
  }

  // Increment counter
  current.count++;
  rateLimitMap.set(identifier, current);

  return { success: true };
}

/**
 * CORS middleware for API routes
 */
export function cors(request: NextRequest): NextResponse | null {
  // Only apply CORS to non-GET requests or requests with origin
  const origin = request.headers.get('origin');
  const method = request.method;

  if (method === 'GET' && !origin) {
    return null; // No CORS needed for simple GET requests
  }

  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (method === 'OPTIONS') {
    return response;
  }

  return null;
}

/**
 * Combined middleware for API routes
 */
export async function apiMiddleware(
  request: NextRequest,
  requiredRole: AdminRole = ADMIN_ROLES.EDITOR
): Promise<{
  success: true;
  auth: { user: any; adminUser: any };
  response?: NextResponse;
} | {
  success: false;
  response: NextResponse;
}> {
  // Apply CORS
  const corsResponse = cors(request);
  if (corsResponse) {
    return { success: false, response: corsResponse };
  }

  // Apply rate limiting
  const clientIP = request.headers.get('x-forwarded-for') ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

  const rateLimitResult = rateLimit(clientIP, 100, 60 * 60 * 1000); // 100 requests per hour

  if (!rateLimitResult.success) {
    return { success: false, response: rateLimitResult.response! };
  }

  // Apply authentication
  const authResult = await withAdminAuth(request, requiredRole);

  if (!authResult.authenticated) {
    return { success: false, response: authResult.response };
  }

  return {
    success: true,
    auth: authResult,
  };
}
