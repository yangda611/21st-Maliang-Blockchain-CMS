'use client';

import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings } from 'lucide-react';
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

interface TopNavigationProps {
  user: AdminUser;
}

export function TopNavigation({ user }: TopNavigationProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!supabase) {
        console.error('Supabase客户端未初始化');
        router.push('/maliang-admin');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('登出失败:', error);
      } else {
        // 登出成功，重定向到登录页面
        router.push('/maliang-admin');
      }
    } catch (error) {
      console.error('登出过程中发生错误:', error);
    }
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-card border-b border-border animate-fade-in-up">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 左侧搜索区域 */}
        <div className="flex items-center gap-4">
          <div className="relative animate-fade-in-up animate-delay-100">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="搜索..."
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* 右侧用户区域 */}
        <div className="flex items-center gap-4">
          {/* 通知图标 */}
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative animate-fade-in-up animate-delay-200">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* 用户头像和菜单 */}
          <div className="relative animate-fade-in-up animate-delay-300">
            <button
              onClick={handleProfileMenuToggle}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium text-foreground hidden md:inline">
                {user.email}
              </span>
            </button>

            {/* 下拉菜单 */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-fade-in-up">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user.role === 'super_admin' ? '超级管理员' : '管理员'}
                  </p>
                </div>
                <ul className="py-2">
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-secondary transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>账户设置</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}