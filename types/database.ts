// Supabase Database Types
// Auto-generated types for Supabase tables

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      content_categories: {
        Row: {
          id: string
          name: Json // Multi-language: { en: string, zh: string, ja: string, ko: string, ar: string, es: string }
          description: Json | null
          slug: string
          parent_id: string | null
          hierarchy_level: number
          content_type: 'product' | 'article' | 'page'
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: Json
          description?: Json | null
          slug: string
          parent_id?: string | null
          hierarchy_level?: number
          content_type: 'product' | 'article' | 'page'
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: Json
          description?: Json | null
          slug?: string
          parent_id?: string | null
          hierarchy_level?: number
          content_type?: 'product' | 'article' | 'page'
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: Json
          description: Json
          specifications: Json | null
          pricing: Json | null
          images: string[]
          slug: string
          tags: string[]
          translation_status: 'draft' | 'pending_review' | 'published'
          is_published: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          category_id: string
          name: Json
          description: Json
          specifications?: Json | null
          pricing?: Json | null
          images?: string[]
          slug: string
          tags?: string[]
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          name?: Json
          description?: Json
          specifications?: Json | null
          pricing?: Json | null
          images?: string[]
          slug?: string
          tags?: string[]
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      articles: {
        Row: {
          id: string
          category_id: string
          title: Json
          content: Json
          excerpt: Json | null
          featured_image: string | null
          author_id: string
          slug: string
          tags: string[]
          translation_status: 'draft' | 'pending_review' | 'published'
          is_published: boolean
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          category_id: string
          title: Json
          content: Json
          excerpt?: Json | null
          featured_image?: string | null
          author_id: string
          slug: string
          tags?: string[]
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string
          title?: Json
          content?: Json
          excerpt?: Json | null
          featured_image?: string | null
          author_id?: string
          slug?: string
          tags?: string[]
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      static_pages: {
        Row: {
          id: string
          title: Json
          content: Json
          slug: string
          meta_title: Json | null
          meta_description: Json | null
          translation_status: 'draft' | 'pending_review' | 'published'
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: Json
          content: Json
          slug: string
          meta_title?: Json | null
          meta_description?: Json | null
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: Json
          content?: Json
          slug?: string
          meta_title?: Json | null
          meta_description?: Json | null
          translation_status?: 'draft' | 'pending_review' | 'published'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      job_postings: {
        Row: {
          id: string
          title: Json
          description: Json
          requirements: Json
          location: Json | null
          employment_type: string
          application_deadline: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: Json
          description: Json
          requirements: Json
          location?: Json | null
          employment_type: string
          application_deadline?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: Json
          description?: Json
          requirements?: Json
          location?: Json | null
          employment_type?: string
          application_deadline?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      visitor_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          message_type: 'contact' | 'job_application' | 'inquiry'
          related_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          message_type: 'contact' | 'job_application' | 'inquiry'
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          message_type?: 'contact' | 'job_application' | 'inquiry'
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      content_tags: {
        Row: {
          id: string
          name: Json
          slug: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: Json
          slug: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: Json
          slug?: string
          usage_count?: number
          created_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          title: Json
          image_desktop: string
          image_mobile: string
          link_url: string | null
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: Json
          image_desktop: string
          image_mobile: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: Json
          image_desktop?: string
          image_mobile?: string
          link_url?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      seo_configurations: {
        Row: {
          id: string
          page_type: string
          page_id: string | null
          meta_title: Json
          meta_description: Json
          meta_keywords: Json
          og_image: string | null
          canonical_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_type: string
          page_id?: string | null
          meta_title: Json
          meta_description: Json
          meta_keywords: Json
          og_image?: string | null
          canonical_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_type?: string
          page_id?: string | null
          meta_title?: Json
          meta_description?: Json
          meta_keywords?: Json
          og_image?: string | null
          canonical_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: 'super_admin' | 'admin' | 'editor' | 'translator'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'super_admin' | 'admin' | 'editor' | 'translator'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'super_admin' | 'admin' | 'editor' | 'translator'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_type: 'product' | 'article' | 'page'
      translation_status: 'draft' | 'pending_review' | 'published'
      message_type: 'contact' | 'job_application' | 'inquiry'
      admin_role: 'super_admin' | 'admin' | 'editor' | 'translator'
    }
  }
}
