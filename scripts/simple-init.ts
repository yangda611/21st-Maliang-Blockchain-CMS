import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// 加载环境变量
config();

// 从环境变量获取数据库连接信息
const dbConfig = {
  host: process.env.maliang_blockchain__POSTGRES_HOST || 'db.pvznifymjkunclzzquje.supabase.co',
  port: 6543,
  database: 'postgres',
  user: process.env.maliang_blockchain__POSTGRES_USER || 'postgres',
  password: 'zEJkSrnxJ0KRckO9',
  ssl: {
    rejectUnauthorized: false
  }
};

async function executeSimpleSQL() {
  try {
    console.log('🔄 连接数据库...');

    // 创建数据库连接
    const client = new Client(dbConfig);
    await client.connect();

    console.log('✅ 数据库连接成功');

    // 首先删除可能存在的冲突对象
    console.log('🔄 删除现有对象...');

    try {
      // 删除表（按依赖关系顺序）
      await client.query(`
        DROP TABLE IF EXISTS articles_tags CASCADE;
        DROP TABLE IF EXISTS products_tags CASCADE;
        DROP TABLE IF EXISTS translation_workflows CASCADE;
        DROP TABLE IF EXISTS seo_configurations CASCADE;
        DROP TABLE IF EXISTS banners CASCADE;
        DROP TABLE IF EXISTS visitor_messages CASCADE;
        DROP TABLE IF EXISTS job_postings CASCADE;
        DROP TABLE IF EXISTS static_pages CASCADE;
        DROP TABLE IF EXISTS articles CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
        DROP TABLE IF EXISTS content_tags CASCADE;
        DROP TABLE IF EXISTS content_categories CASCADE;
        DROP TABLE IF EXISTS admin_users CASCADE;
      `);

      // 删除类型
      await client.query(`
        DROP TYPE IF EXISTS admin_role CASCADE;
        DROP TYPE IF EXISTS content_type CASCADE;
        DROP TYPE IF EXISTS translation_status CASCADE;
        DROP TYPE IF EXISTS message_type CASCADE;
        DROP TYPE IF EXISTS supported_language CASCADE;
      `);

      // 删除函数
      await client.query(`
        DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
      `);

    } catch (dropError) {
      console.log('⚠️ 删除现有对象时出现警告（可能是因为对象不存在）:', dropError instanceof Error ? dropError.message : String(dropError));
    }

    // 启用必要的扩展
    console.log('🔄 启用数据库扩展...');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // 创建枚举类型
    console.log('🔄 创建枚举类型...');
    await client.query(`
      CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'editor', 'translator');
      CREATE TYPE content_type AS ENUM ('product', 'article', 'page', 'category');
      CREATE TYPE translation_status AS ENUM ('draft', 'in_review', 'approved', 'published');
      CREATE TYPE message_type AS ENUM ('contact', 'product_inquiry', 'support', 'other');
      CREATE TYPE supported_language AS ENUM ('en', 'zh', 'es', 'fr', 'de', 'ja', 'ko');
    `);

    // 创建表
    console.log('🔄 创建表结构...');

    // 创建管理员用户表
    await client.query(`
      CREATE TABLE admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role admin_role DEFAULT 'editor',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 创建内容分类表
    await client.query(`
      CREATE TABLE content_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name JSONB NOT NULL,
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
    `);

    // 创建内容标签表
    await client.query(`
      CREATE TABLE content_tags (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name JSONB NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 创建产品表
    await client.query(`
      CREATE TABLE products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        category_id UUID REFERENCES content_categories(id) ON DELETE CASCADE,
        name JSONB NOT NULL,
        description JSONB NOT NULL,
        specifications JSONB,
        pricing JSONB,
        images TEXT[] DEFAULT '{}',
        slug VARCHAR(255) UNIQUE NOT NULL,
        tags TEXT[] DEFAULT '{}',
        translation_status translation_status DEFAULT 'draft',
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ
      );
    `);

    // 创建产品标签关联表
    await client.query(`
      CREATE TABLE products_tags (
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES content_tags(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (product_id, tag_id)
      );
    `);

    // 创建文章表
    await client.query(`
      CREATE TABLE articles (
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
    `);

    // 创建文章标签关联表
    await client.query(`
      CREATE TABLE articles_tags (
        article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES content_tags(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (article_id, tag_id)
      );
    `);

    // 创建静态页面表
    await client.query(`
      CREATE TABLE static_pages (
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
    `);

    // 创建招聘信息表
    await client.query(`
      CREATE TABLE job_postings (
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
    `);

    // 创建访客消息表
    await client.query(`
      CREATE TABLE visitor_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        message_type message_type DEFAULT 'contact',
        related_id UUID,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 创建横幅表
    await client.query(`
      CREATE TABLE banners (
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
    `);

    // 创建 SEO 配置表
    await client.query(`
      CREATE TABLE seo_configurations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        page_type VARCHAR(100) NOT NULL,
        page_id UUID,
        meta_title JSONB NOT NULL,
        meta_description JSONB NOT NULL,
        meta_keywords JSONB,
        og_image TEXT,
        canonical_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(page_type, page_id)
      );
    `);

    // 创建翻译工作流表
    await client.query(`
      CREATE TABLE translation_workflows (
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
    `);

    // 创建索引
    console.log('🔄 创建索引...');
    await client.query(`
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

      CREATE INDEX IF NOT EXISTS idx_products_tags_product_id ON products_tags(product_id);
      CREATE INDEX IF NOT EXISTS idx_products_tags_tag_id ON products_tags(tag_id);

      CREATE INDEX IF NOT EXISTS idx_articles_tags_article_id ON articles_tags(article_id);
      CREATE INDEX IF NOT EXISTS idx_articles_tags_tag_id ON articles_tags(tag_id);
    `);

    // 创建更新时间触发函数和触发器
    console.log('🔄 创建触发器...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_content_categories_updated_at BEFORE UPDATE ON content_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_static_pages_updated_at BEFORE UPDATE ON static_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON job_postings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_seo_configurations_updated_at BEFORE UPDATE ON seo_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      CREATE TRIGGER update_translation_workflows_updated_at BEFORE UPDATE ON translation_workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // 启用 RLS 并创建策略
    console.log('🔄 设置行级安全策略...');
    await client.query(`
      ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
      ALTER TABLE products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE visitor_messages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
      ALTER TABLE seo_configurations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE translation_workflows ENABLE ROW LEVEL SECURITY;
    `);

    // 创建基础策略（简化版）
    await client.query(`
      CREATE POLICY "Enable read access for all users" ON content_categories FOR SELECT USING (is_active = true);
      CREATE POLICY "Enable read access for all users" ON content_tags FOR SELECT USING (true);
      CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (is_published = true);
      CREATE POLICY "Enable read access for all users" ON articles FOR SELECT USING (is_published = true);
      CREATE POLICY "Enable read access for all users" ON static_pages FOR SELECT USING (is_published = true);
      CREATE POLICY "Enable read access for all users" ON job_postings FOR SELECT USING (is_active = true);
      CREATE POLICY "Enable insert for visitor messages" ON visitor_messages FOR INSERT WITH CHECK (true);
    `);

    await client.end();

    console.log('✅ Schema 创建完成');

    // 现在插入种子数据
    console.log('🔄 插入种子数据...');

    // 重新连接以插入数据
    const client2 = new Client(dbConfig);
    await client2.connect();

    // 创建管理员用户
    await client2.query(`
      INSERT INTO admin_users (email, password_hash, role, is_active) VALUES
      ('admin@maliang.com', crypt('admin123', gen_salt('bf')), 'super_admin', true),
      ('editor@maliang.com', crypt('editor123', gen_salt('bf')), 'editor', true),
      ('translator@maliang.com', crypt('translator123', gen_salt('bf')), 'translator', true)
      ON CONFLICT (email) DO NOTHING;
    `);

    // 创建分类
    await client2.query(`
      INSERT INTO content_categories (name, description, slug, hierarchy_level, content_type, display_order, is_active) VALUES
      ('{"zh": "区块链产品", "en": "Blockchain Products", "ja": "ブロックチェーン製品", "ko": "블록체인 제품", "ar": "منتجات البلوكشين", "es": "Productos Blockchain"}',
       '{"zh": "基于区块链技术的创新产品系列", "en": "Innovative product series based on blockchain technology", "ja": "ブロックチェーン技術に基づく革新的な製品シリーズ", "ko": "블록체인 기술 기반의 혁신적인 제품 시리즈", "ar": "سلسلة منتجات مبتكرة مبنية على تقنية البلوكشين", "es": "Serie de productos innovadores basados en tecnología blockchain"}',
       'blockchain-products', 1, 'product', 0, true),

      ('{"zh": "技术文章", "en": "Technical Articles", "ja": "技術記事", "ko": "기술 기사", "ar": "مقالات تقنية", "es": "Artículos Técnicos"}',
       '{"zh": "分享区块链和CMS技术的最新见解", "en": "Share the latest insights on blockchain and CMS technology", "ja": "ブロックチェーンとCMS技術の最新インサイトを共有", "ko": "블록체인 및 CMS 기술의 최신 인사이트 공유", "ar": "مشاركة أحدث الأفكار حول تقنية البلوكشين وCMS", "es": "Compartir las últimas perspectivas sobre tecnología blockchain y CMS"}',
       'technical-articles', 1, 'article', 0, true)
      ON CONFLICT (slug) DO NOTHING;
    `);

    // 创建标签
    await client2.query(`
      INSERT INTO content_tags (name, slug, usage_count) VALUES
      ('{"zh": "区块链", "en": "Blockchain", "ja": "ブロックチェーン", "ko": "블록체인", "ar": "البلوكشين", "es": "Blockchain"}', 'blockchain', 5),
      ('{"zh": "CMS", "en": "CMS", "ja": "CMS", "ko": "CMS", "ar": "نظام إدارة المحتوى", "es": "CMS"}', 'cms', 8),
      ('{"zh": "技术创新", "en": "Technological Innovation", "ja": "技術革新", "ko": "기술 혁신", "ar": "الابتكار التكنولوجي", "es": "Innovación Tecnológica"}', 'technology-innovation', 3)
      ON CONFLICT (slug) DO NOTHING;
    `);

    await client2.end();

    console.log('✅ 种子数据插入完成');
    console.log('🎉 数据库初始化完成！');

  } catch (error) {
    console.error('❌ 初始化过程中出错:', error);
  }
}

// 运行初始化
executeSimpleSQL();
