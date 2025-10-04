'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import AdminLayout from '@/components/admin/admin-layout'

export default function SettingsPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const sb = getSupabaseClient()

    let unsub: { unsubscribe: () => void } | undefined

    const run = async () => {
      const { data: { session } } = await sb.auth.getSession()
      if (session?.user) {
        setChecking(false)
      } else {
        unsub = sb.auth.onAuthStateChange((_e, s) => {
          if (s?.user) setChecking(false)
          else router.replace('/maliang-admin')
        }).data.subscription as any

        setTimeout(async () => {
          const { data: { session: s2 } } = await sb.auth.getSession()
          if (!s2?.user) router.replace('/maliang-admin')
          else setChecking(false)
        }, 200)
      }
    }

    run()
    return () => { try { unsub?.unsubscribe() } catch {} }
  }, [router])

  if (checking) {
    return (
      <AdminLayout>
        <div className="p-6 text-white/70">正在验证登录状态...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">系统设置</h1>
          <p className="text-white/60 mt-1">站点与后台的基础配置（占位页面，可继续扩展表单与保存逻辑）。</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-3">站点信息</h2>
            <div className="space-y-3 text-sm text-white/70">
              <div>站点名称、Logo、语言等配置。</div>
            </div>
          </section>
          <section className="rounded-lg border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-3">安全与会话</h2>
            <div className="space-y-3 text-sm text-white/70">
              <div>密码策略、会话时长、二次验证等。</div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
