'use client';

import React from 'react';
import { Home, Users, Settings, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeItem?: string;
}

export function Sidebar({ activeItem = 'home' }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: 'home', label: '首页', icon: Home, path: '/maliang-admin/dashboard' },
    { id: 'users', label: '用户管理', icon: Users, path: '/maliang-admin/dashboard/users' },
    { id: 'analytics', label: '数据分析', icon: BarChart3, path: '/maliang-admin/dashboard/analytics' },
    { id: 'settings', label: '系统设置', icon: Settings, path: '/maliang-admin/dashboard/settings' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Logo区域 */}
      <div className="p-6 border-b border-border animate-fade-in-up">
        <h2 className="text-xl font-bold text-foreground">Maliang CMS</h2>
        <p className="text-sm text-muted-foreground mt-1">区块链内容管理系统</p>
      </div>

      {/* 菜单区域 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;

            return (
              <li key={item.id} className={`animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-foreground hover:bg-secondary hover:text-secondary-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部区域 */}
      <div className="p-4 border-t border-border animate-fade-in-up animate-delay-500">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 Maliang Blockchain CMS
        </div>
      </div>
    </div>
  );
}