import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Database } from '@/types/database';

// GET 请求 - 获取用户列表（支持搜索和分页）
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '服务角色客户端未初始化' },
        { status: 500 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 验证分页参数
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: '页码和每页条数必须大于0' },
        { status: 400 }
      );
    }

    // 构建查询
    let query = supabaseAdmin
      .from('admin_users')
      .select('*', { count: 'exact' });

    // 添加搜索条件（如果提供了搜索参数）
    if (search && search.trim() !== '') {
      query = query.ilike('email', `%${search.trim()}%`);
    }

    // 获取总数
    const { count: totalItems, error: countError } = await query;

    if (countError) {
      console.error('获取用户总数失败:', countError);
      return NextResponse.json(
        { error: countError.message || '获取用户列表失败' },
        { status: 500 }
      );
    }

    // 计算分页
    const totalPages = Math.ceil(totalItems! / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // 获取分页数据
    const { data: users, error: dataError } = await query
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex - 1);

    if (dataError) {
      console.error('获取用户数据失败:', dataError);
      return NextResponse.json(
        { error: dataError.message || '获取用户列表失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: users || [],
      pagination: {
        page,
        totalPages,
        totalItems: totalItems || 0,
        limit,
      }
    });

  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// POST 请求 - 创建用户（保持原有功能不变）
export async function POST(request: NextRequest) {
  try {
    const { email, password, role = 'admin', is_active = true } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码不能为空' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '服务角色客户端未初始化' },
        { status: 500 }
      );
    }

    // 使用服务角色客户端创建用户
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error('创建用户失败:', error);
      return NextResponse.json(
        { error: error.message || '创建用户失败' },
        { status: 400 }
      );
    }

    // 添加到admin_users表
    const adminUserData = {
      id: data.user?.id || '',
      email: email,
      role: (role as any) || 'admin',
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 使用类型断言来绕过Database类型检查问题
    const { error: adminError } = await (supabaseAdmin as any)
      .from('admin_users')
      .insert([adminUserData]);

    if (adminError) {
      console.error('添加到admin_users表失败:', adminError);
      return NextResponse.json(
        { error: adminError.message || '创建用户失败' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: '用户创建成功',
      user: {
        id: data.user?.id,
        email,
        role,
        is_active
      }
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    );
  }
}