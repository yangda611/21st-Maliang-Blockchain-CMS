-- Maliang CMS Database Schema
-- Complete database structure for blockchain-based CMS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enum Types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor', 'translator');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
        CREATE TYPE content_type AS ENUM ('product', 'article', 'page', 'category');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'translation_status') THEN
        CREATE TYPE translation_status AS ENUM ('draft', 'in_review', 'approved', 'published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type') THEN
        CREATE TYPE message_type AS ENUM ('contact', 'product_inquiry', 'support', 'other');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
        CREATE TYPE supported_language AS ENUM ('en', 'zh', 'es', 'fr', 'de', 'ja', 'ko');
    END IF;
END $$;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role admin_role DEFAULT 'editor',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Categories Table
CREATE TABLE IF NOT EXISTS content_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- Multi-language support
    description JSONB,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    hierarchy_level INTEGER DEFAULT 1,
    content_type content_type DEFAULT 'product',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Tags Table
CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    specifications JSONB,
    pricing JSONB, -- {currency: string, amount: number, discountedAmount?: number}
    images TEXT[] DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    translation_status translation_status DEFAULT 'draft',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Products to Tags Many-to-Many Relationship
CREATE TABLE IF NOT EXISTS products_tags (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES content_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (product_id, tag_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_tags_product_id ON products_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_products_tags_tag_id ON products_tags(tag_id);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
    title JSONB NOT NULL,
    content JSONB NOT NULL,
    excerpt JSONB,
    featured_image TEXT,
    author_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tags TEXT[] DEFAULT '{}',
    translation_status translation_status DEFAULT 'draft',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Static Pages Table
CREATE TABLE IF NOT EXISTS static_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    content JSONB NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    meta_title JSONB,
    meta_description JSONB,
    translation_status translation_status DEFAULT 'draft',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Postings Table
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    requirements JSONB NOT NULL,
    location JSONB,
    employment_type VARCHAR(100),
    application_deadline TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitor Messages Table
CREATE TABLE IF NOT EXISTS visitor_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT NOT NULL,
    message_type message_type DEFAULT 'contact',
    related_id UUID, -- Can relate to products, articles, etc.
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL,
    image_desktop TEXT NOT NULL,
    image_mobile TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Configurations Table
CREATE TABLE IF NOT EXISTS seo_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type VARCHAR(100) NOT NULL,
    page_id UUID, -- Can be null for global settings
    meta_title JSONB NOT NULL,
    meta_description JSONB NOT NULL,
    meta_keywords JSONB,
    og_image TEXT,
    canonical_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(page_type, page_id)
);

-- Translation Workflows Table
CREATE TABLE IF NOT EXISTS translation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type content_type NOT NULL,
    language supported_language NOT NULL,
    status translation_status DEFAULT 'draft',
    translator_id UUID REFERENCES admin_users(id),
    reviewer_id UUID REFERENCES admin_users(id),
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(content_id, content_type, language)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_categories_parent_id ON content_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_content_categories_content_type ON content_categories(content_type);
CREATE INDEX IF NOT EXISTS idx_content_categories_slug ON content_categories(slug);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_translation_status ON products(translation_status);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON products(is_published);

CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_translation_status ON articles(translation_status);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);

CREATE INDEX IF NOT EXISTS idx_static_pages_slug ON static_pages(slug);
CREATE INDEX IF NOT EXISTS idx_static_pages_translation_status ON static_pages(translation_status);
CREATE INDEX IF NOT EXISTS idx_static_pages_is_published ON static_pages(is_published);

CREATE INDEX IF NOT EXISTS idx_job_postings_is_active ON job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_application_deadline ON job_postings(application_deadline);

CREATE INDEX IF NOT EXISTS idx_visitor_messages_is_read ON visitor_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_visitor_messages_created_at ON visitor_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

CREATE INDEX IF NOT EXISTS idx_seo_configurations_page_type ON seo_configurations(page_type);

CREATE INDEX IF NOT EXISTS idx_translation_workflows_content ON translation_workflows(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_translation_workflows_status ON translation_workflows(status);
CREATE INDEX IF NOT EXISTS idx_translation_workflows_language ON translation_workflows(language);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or replace triggers for updated_at
DO $$
BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
    DROP TRIGGER IF EXISTS update_content_categories_updated_at ON content_categories;
    DROP TRIGGER IF EXISTS update_products_updated_at ON products;
    DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
    DROP TRIGGER IF EXISTS update_static_pages_updated_at ON static_pages;
    DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
    DROP TRIGGER IF EXISTS update_banners_updated_at ON banners;
    DROP TRIGGER IF EXISTS update_seo_configurations_updated_at ON seo_configurations;
    DROP TRIGGER IF EXISTS update_translation_workflows_updated_at ON translation_workflows;
    
    -- Create new triggers
    CREATE TRIGGER update_admin_users_updated_at 
        BEFORE UPDATE ON admin_users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_content_categories_updated_at 
        BEFORE UPDATE ON content_categories 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_products_updated_at 
        BEFORE UPDATE ON products 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_articles_updated_at 
        BEFORE UPDATE ON articles 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_static_pages_updated_at 
        BEFORE UPDATE ON static_pages 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_job_postings_updated_at 
        BEFORE UPDATE ON job_postings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_banners_updated_at 
        BEFORE UPDATE ON banners 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_seo_configurations_updated_at 
        BEFORE UPDATE ON seo_configurations 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    CREATE TRIGGER update_translation_workflows_updated_at 
        BEFORE UPDATE ON translation_workflows 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS static_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS visitor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS seo_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS translation_workflows ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    -- Drop admin_users policies
    DROP POLICY IF EXISTS "Admin users can view their own data" ON admin_users;
    DROP POLICY IF EXISTS "Super admins can view all admin users" ON admin_users;
    DROP POLICY IF EXISTS "Super admins can insert admin users" ON admin_users;
    DROP POLICY IF EXISTS "Admin users can update their own data" ON admin_users;
    DROP POLICY IF EXISTS "Super admins can update any admin user" ON admin_users;
    
    -- Add other DROP POLICY statements for other tables as needed
END $$;

-- Admin Users Policies
CREATE POLICY "Admin users can view their own data" ON admin_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all admin users" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Super admins can insert admin users" ON admin_users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Admin users can update their own data" ON admin_users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can update any admin user" ON admin_users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Content Categories Policies (Public read, Admin write)
CREATE POLICY "Anyone can view published categories" ON content_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON content_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Content Tags Policies (Public read, Admin write)
CREATE POLICY "Anyone can view tags" ON content_tags
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON content_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Products Policies
CREATE POLICY "Anyone can view published products" ON products
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

-- Articles Policies
CREATE POLICY "Anyone can view published articles" ON articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all articles" ON articles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage articles" ON articles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

-- Static Pages Policies
CREATE POLICY "Anyone can view published pages" ON static_pages
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage static pages" ON static_pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

-- Job Postings Policies
CREATE POLICY "Anyone can view active job postings" ON job_postings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage job postings" ON job_postings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Visitor Messages Policies
CREATE POLICY "Anyone can insert messages" ON visitor_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all messages" ON visitor_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can update messages" ON visitor_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Banners Policies
CREATE POLICY "Anyone can view active banners" ON banners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage banners" ON banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
        )
    );

-- SEO Configurations Policies
CREATE POLICY "Anyone can view SEO configs" ON seo_configurations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage SEO configs" ON seo_configurations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );

-- Translation Workflows Policies
CREATE POLICY "Admins can view translation workflows" ON translation_workflows
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor', 'translator')
        )
    );

CREATE POLICY "Admins and translators can manage workflows" ON translation_workflows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor', 'translator')
        )
    );

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-files', 'cms-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for file uploads
CREATE POLICY "Anyone can view files" ON storage.objects
    FOR SELECT USING (bucket_id = 'cms-files');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'cms-files' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'cms-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'cms-files' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
