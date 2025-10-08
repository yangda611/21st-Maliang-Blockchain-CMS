'use client'
/**
 * Admin Dashboard Home Page
 * Overview of CMS statistics and quick actions
 * 优化版本：使用代码分割和懒加载
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentAdmin, getSupabaseClient } from '@/lib/supabase';
import { AdminLazyWrapper } from '@/components/ui/lazy-wrapper';
import AdminLayout from '@/components/admin/admin-layout';

// 懒加载 DashboardOverview 组件
const DashboardOverview = () => (
  <AdminLazyWrapper
    loader={() => import('@/components/admin/dashboard-overview')}
    fallback={
      <div className="p-6 text-white/70">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50 mr-3"></div>
          正在加载仪表板...
        </div>
      </div>
    }
  />
);

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const sb = getSupabaseClient();

    let unsub: { unsubscribe: () => void } | undefined;

    const run = async () => {
      // 先读当前会话（避免刷新后短暂为空导致误跳转）
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        setChecking(false);
      } else {
        // 等待一次 auth 状态回调；若仍无会话再跳转
        unsub = sb.auth.onAuthStateChange((_event, s) => {
          if (s?.user) {
            setChecking(false);
          } else {
            router.replace('/maliang-admin');
          }
        }).data.subscription as any;

        // 双保险：200ms 后再查一次（处理极短暂的水合延迟）
        setTimeout(async () => {
          const { data: { session: s2 } } = await sb.auth.getSession();
          if (!s2?.user) {
            router.replace('/maliang-admin');
          } else {
            setChecking(false);
          }
        }, 200);
      }
    };

    run();
    return () => {
      try { unsub?.unsubscribe(); } catch {}
    };
  }, [router]);

  if (checking) {
    return (
      <AdminLayout>
        <div className="p-6 text-white/70">正在验证登录状态...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              仪表板概览
            </h1>
            <p className="text-white/60 mt-1">
              欢迎回来！这里是您网站的实时概览
            </p>
          </div>
        </div>

        <DashboardOverview />
      </div>
    </AdminLayout>
  );
}
