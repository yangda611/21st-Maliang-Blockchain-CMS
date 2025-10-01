import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

// 检查环境变量是否配置
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 环境变量未配置！')
    console.error('请在 .env.local 文件中配置：')
    console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// 创建服务角色客户端（用于管理员操作）
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null

// 管理员用户类型定义
export interface AdminUser {
    id: string
    email: string
    password: string
    role: 'admin' | 'super_admin'
    created_at: string
    updated_at: string
    last_login?: string
    is_active: boolean
}

// 登录函数
export async function signInAdmin(email: string, password: string) {
    try {
        console.log('开始登录验证:', { email, supabaseUrl: supabaseUrl ? '已配置' : '未配置' })

        if (!supabase) {
            throw new Error('Supabase 客户端未初始化，请检查环境变量配置')
        }

        // 使用 Supabase Auth 进行登录
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            console.error('登录认证失败:', error)
            throw new Error('邮箱或密码错误')
        }

        // 查询管理员用户信息
        const { data: adminUser, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single()

        if (adminError) {
            console.error('查询管理员用户失败:', adminError)
            throw new Error('用户不存在或已被禁用')
        }

        console.log('登录成功，更新最后登录时间')

        // 更新最后登录时间
        const { error: updateError } = await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminUser.id)

        if (updateError) {
            console.error('更新登录时间失败:', updateError)
        }

        return { user: adminUser, error: null }
    } catch (error) {
        console.error('登录过程出错:', error)
        return { user: null, error: error instanceof Error ? error.message : '登录失败' }
    }
}

// 获取当前用户
export async function getCurrentAdmin() {
    try {
        if (!supabase) {
            return null
        }
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (error) {
        console.error('获取当前用户失败:', error)
        return null
    }
}

// 测试 Supabase 连接
export async function testSupabaseConnection() {
    try {

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase 环境变量未配置')
        }
        if (!supabase) {
            throw new Error('请检查Supabase环境变量配置')
        }

        // 尝试查询 admin_users 表
        const { data, error } = await supabase
            .from('admin_users')
            .select('count')
            .limit(1)

        if (error) {
            throw new Error(`数据库连接失败: ${error.message}`)
        }

        console.log('Supabase 连接测试成功')
        return { success: true, message: '连接成功' }
    } catch (error) {
        console.error('Supabase 连接测试失败:', error)
        return { success: false, message: error instanceof Error ? error.message : '连接失败' }
    }
}