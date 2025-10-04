import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) as string

const admin = supabaseUrl && serviceKey
  ? createClient<Database>(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

export async function POST(req: Request) {
  try {
    if (!admin) {
      return NextResponse.json({ error: 'Service client not initialized' }, { status: 500 })
    }

    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Ensure auth user exists and is confirmed
    let userId: string | undefined
    // listUsers 没有按邮箱过滤参数，这里先取一页再在内存中过滤（足够覆盖我们的管理员账号场景）
    const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 100 })
    const found = listed?.data?.users?.find((u) => u.email?.toLowerCase() === String(email).toLowerCase())
    if (found) {
      userId = found.id
      // 确保账号已确认，同时把密码更新为传入的最新密码
      await admin.auth.admin.updateUserById(userId, {
        email_confirm: true,
        password,
      })
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (error || !data?.user) {
        return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 500 })
      }
      userId = data.user.id
    }

    // Ensure admin_users record exists
    const { error: upsertErr } = await admin
      .from('admin_users')
      .upsert(
        {
          id: userId,
          email,
          password_hash: 'managed_by_supabase_auth',
          role: 'super_admin',
          is_active: true,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: 'id' } as any
      )

    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, userId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}
