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
  password: 'zEJkSrnxJ0KRckO9', // 从 .env.local 中获取
  ssl: {
    rejectUnauthorized: false
  }
};

async function executeSQLFile(filePath: string, forceRecreate = false) {
  try {
    console.log(`🔄 执行 SQL 文件: ${filePath}`);

    // 读取 SQL 文件
    const sqlContent = readFileSync(filePath, 'utf8');

    // 如果需要强制重新创建，先删除现有对象
    if (forceRecreate) {
      console.log('🔄 强制重新创建模式：删除现有对象...');

      // 创建数据库连接
      const client = new Client(dbConfig);
      await client.connect();

      // 删除现有策略、触发器、表和类型
      await client.query(`
        DO $$
        DECLARE
          rec RECORD;
        BEGIN
          -- 删除所有策略
          FOR rec IN (SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', rec.policyname, rec.schemaname, rec.tablename);
          END LOOP;

          -- 删除所有触发器
          FOR rec IN (SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public') LOOP
            EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', rec.trigger_name, rec.event_object_table);
          END LOOP;

          -- 删除表（按依赖关系顺序）
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

          -- 删除 Supabase 内置表（如果存在） - 注释掉这些语句，因为它们可能导致问题
          -- DROP TABLE IF EXISTS objects CASCADE;
          -- DROP TABLE IF EXISTS buckets CASCADE;
          -- DROP TABLE IF EXISTS migrations CASCADE;

          -- 删除类型
          DROP TYPE IF EXISTS admin_role CASCADE;
          DROP TYPE IF EXISTS content_type CASCADE;
          DROP TYPE IF EXISTS translation_status CASCADE;
          DROP TYPE IF EXISTS message_type CASCADE;
          DROP TYPE IF EXISTS supported_language CASCADE;

          -- 删除函数
          DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

        EXCEPTION
          WHEN OTHERS THEN
            -- 忽略错误，继续执行
            RAISE NOTICE 'Error occurred: %', SQLERRM;
        END $$;
      `);

      await client.end();
    }

    // 创建数据库连接
    const client = new Client(dbConfig);
    await client.connect();

    // 执行 SQL
    await client.query(sqlContent);

    await client.end();

    console.log(`✅ ${filePath} 执行成功`);
    return true;
  } catch (error) {
    console.error(`❌ ${filePath} 执行失败:`, error instanceof Error ? error.message : String(error));
    return false;
  }
}

async function initDatabase() {
  console.log('🚀 开始数据库初始化...');

  try {
    // 检查是否需要强制重新创建
    const forceRecreate = process.argv.includes('--force');

    if (forceRecreate) {
      console.log('⚠️ 强制重新创建模式已启用');
    }

    // 执行 schema.sql
    const schemaPath = join(process.cwd(), 'database', 'schema.sql');
    const schemaSuccess = await executeSQLFile(schemaPath, forceRecreate);
    if (!schemaSuccess) {
      console.error('❌ Schema 初始化失败');
      return;
    }

    // 执行 seeds.sql
    const seedsPath = join(process.cwd(), 'database', 'seeds.sql');
    const seedsSuccess = await executeSQLFile(seedsPath, false);
    if (!seedsSuccess) {
      console.error('❌ Seeds 初始化失败');
      return;
    }

    console.log('🎉 数据库初始化完成！');

  } catch (error) {
    console.error('❌ 初始化过程中出错:', error);
  }
}

// 运行初始化
initDatabase();
