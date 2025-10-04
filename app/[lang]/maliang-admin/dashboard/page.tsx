'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { getCurrentAdmin } from '@/lib/supabase';
import AdminLayout from '@/components/admin/admin-layout';
import DashboardOverview from '@/components/admin/dashboard-overview';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface DashboardPageProps {
  params: {
    lang: string;
  };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { lang } = params

  // 验证语言参数
  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound()
  }

  const router = useRouter();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentAdmin();
      if (!user) {
        router.push(`/${currentLanguage}/maliang-admin`);
      }
    };

    checkAuth();
  }, [router, currentLanguage]);

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

// 注意：客户端组件不能导出 generateStaticParams()
// 如果需要静态生成，请使用服务端组件
