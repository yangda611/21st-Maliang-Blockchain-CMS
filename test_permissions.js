// 测试 Supabase 权限配置的脚本
const { createClient } = require('@supabase/supabase-js');

// 从环境变量加载配置
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  console.error('❌ 缺少必要的环境变量');
  process.exit(1);
}

// 创建客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testPermissions() {
  console.log('🔧 开始测试 Supabase 权限配置...\n');

  // 1. 测试匿名客户端连接
  try {
    const { data, error } = await supabase.from('admin_users').select('count').limit(1);
    if (error) {
      console.error('❌ 匿名客户端连接失败:', error.message);
    } else {
      console.log('✅ 匿名客户端连接成功');
    }
  } catch (error) {
    console.error('❌ 匿名客户端连接失败:', error.message);
  }

  // 2. 测试服务角色客户端连接
  try {
    const { data, error } = await supabaseAdmin.from('admin_users').select('count').limit(1);
    if (error) {
      console.error('❌ 服务角色客户端连接失败:', error.message);
    } else {
      console.log('✅ 服务角色客户端连接成功');
    }
  } catch (error) {
    console.error('❌ 服务角色客户端连接失败:', error.message);
  }

  // 3. 测试用户创建权限（仅服务角色）
  console.log('\n👤 测试用户创建权限...');

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'test123456';

  try {
    // 尝试使用匿名客户端创建用户（应该失败）
    console.log('  尝试使用匿名客户端创建用户...');
    const { data: anonData, error: anonError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (anonError) {
      console.log('  ✅ 匿名客户端创建用户失败（预期行为）:', anonError.message);
    } else {
      console.log('  ⚠️  匿名客户端创建用户成功（意外行为）');
    }

    // 尝试使用服务角色客户端创建用户（应该成功）
    console.log('  尝试使用服务角色客户端创建用户...');
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    });

    if (adminError) {
      console.log('  ❌ 服务角色客户端创建用户失败:', adminError.message);
    } else {
      console.log('  ✅ 服务角色客户端创建用户成功');
      console.log('  📧 创建的用户ID:', adminData.user?.id);

      // 清理测试用户
      console.log('  清理测试用户...');
      await supabaseAdmin.auth.admin.deleteUser(adminData.user.id);
      console.log('  ✅ 测试用户清理完成');
    }

  } catch (error) {
    console.error('❌ 用户创建测试失败:', error.message);
  }

  // 4. 测试 admin_users 表权限
  console.log('\n📋 测试 admin_users 表权限...');

  try {
    // 测试查询权限
    const { data: users, error: queryError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .limit(1);

    if (queryError) {
      console.error('❌ 查询 admin_users 表失败:', queryError.message);
    } else {
      console.log('✅ 查询 admin_users 表成功');
      console.log(`📊 当前用户数量: ${users?.length || 0}`);
    }

  } catch (error) {
    console.error('❌ admin_users 表权限测试失败:', error.message);
  }

  console.log('\n🎉 权限测试完成！');
}

// 运行测试
testPermissions().catch(console.error);