'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { TopNavigation } from '@/components/ui/top-navigation';
import { DataVisualization } from '@/components/ui/data-visualization';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export default function DashboardLayout() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 获取当前认证用户
        if (!supabase) {
          router.push('/maliang-admin');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // 如果没有会话，重定向到登录页面
          router.push('/maliang-admin');
          return;
        }

        // 获取用户信息
        const { data: userData, error: userError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userError) {
          console.error('获取用户信息失败:', userError);
          router.push('/maliang-admin');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error('鉴权检查失败:', error);
        router.push('/maliang-admin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* 侧边栏 */}
      <div className="animate-slide-in-left">
        <Sidebar />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <div className="animate-fade-in-up animate-delay-100">
          <TopNavigation user={user} />
        </div>

        {/* 数据可视化主内容 */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-fade-in-up animate-delay-200">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <DataVisualization />
          </div>
        </main>
      </div>
    </div>
  );
}