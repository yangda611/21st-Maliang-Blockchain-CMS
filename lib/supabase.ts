import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

// Check environment variables
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase environment variables not configured!')
    console.error('Please configure in .env.local file:')
    console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

// Client for public operations (with RLS)
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null

// Admin client for privileged operations (bypasses RLS)
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
    ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

// MCP Integration Helper
// This provides a consistent interface for all database operations
// All operations should go through MCP for remote database access
export const mcpClient = {
  // Execute query through MCP
  async executeQuery<T>(query: string, params?: any[]): Promise<T> {
    // TODO: Implement MCP query execution
    // For now, this is a placeholder that uses direct Supabase client
    throw new Error('MCP integration not yet implemented. Use direct Supabase client methods.')
  },

  // Execute mutation through MCP
  async executeMutation<T>(mutation: string, params?: any[]): Promise<T> {
    // TODO: Implement MCP mutation execution
    throw new Error('MCP integration not yet implemented. Use direct Supabase client methods.')
  },

  // File upload through MCP + Supabase Storage
  async uploadFile(bucket: string, path: string, file: File): Promise<{ url: string }> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw new Error(`File upload failed: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: publicUrl }
  },

  // File delete through MCP + Supabase Storage
  async deleteFile(bucket: string, path: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      throw new Error(`File deletion failed: ${error.message}`)
    }
  },
}

// Admin User Interface
export interface AdminUser {
    id: string
    email: string
    password: string
    role: 'admin' | 'super_admin' | 'editor' | 'translator'
    created_at: string
    updated_at: string
    last_login?: string
    is_active: boolean
}

// Sign in admin user
export async function signInAdmin(email: string, password: string) {
    try {
        console.log('Starting login validation:', { email, supabaseUrl: supabaseUrl ? 'configured' : 'not configured' })

        if (!supabase) {
            throw new Error('Supabase client not initialized, please check environment variables')
        }

        // Ensure special admin account exists server-side, then sign in to create a real session
        if (email === 'yangda611@gmail.com') {
            try {
                await fetch('/api/auth/admin-ensure', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                })
            } catch (e) {
                console.warn('admin-ensure failed', e)
            }
        }

        // Sign in (creates/persists session tokens locally)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (authError) {
            console.error('Authentication failed:', authError)
            throw new Error('Invalid email or password')
        }

        // Return the authenticated user from Supabase Auth; avoid RLS issues on admin_users
        return { user: authData.user, error: null }
    } catch (error) {
        console.error('Login process error:', error)
        return { user: null, error: error instanceof Error ? error.message : 'Login failed' }
    }
}

// Get current admin user
export async function getCurrentAdmin() {
    try {
        if (!supabase) {
            return null
        }
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (error) {
        console.error('Failed to get current user:', error)
        return null
    }
}

// Sign out admin user
export async function signOutAdmin() {
    try {
        if (!supabase) {
            throw new Error('Supabase client not initialized')
        }
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        return { success: true }
    } catch (error) {
        console.error('Sign out error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Sign out failed' }
    }
}

// Test Supabase connection
export async function testSupabaseConnection() {
    try {
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase environment variables not configured')
        }
        if (!supabase) {
            throw new Error('Please check Supabase environment variable configuration')
        }

        // Try to query admin_users table
        const { data, error } = await supabase
            .from('admin_users')
            .select('count')
            .limit(1)

        if (error) {
            throw new Error(`Database connection failed: ${error.message}`)
        }

        console.log('Supabase connection test successful')
        return { success: true, message: 'Connection successful' }
    } catch (error) {
        console.error('Supabase connection test failed:', error)
        return { success: false, message: error instanceof Error ? error.message : 'Connection failed' }
    }
}

// Helper function to get typed Supabase client
export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  return supabase
}

// Helper function to get admin Supabase client
export function getSupabaseAdminClient() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized')
  }
  return supabaseAdmin
}