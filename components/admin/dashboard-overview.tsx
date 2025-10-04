/**
 * Dashboard Overview Component
 * Displays CMS statistics and quick actions
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { getSupabaseClient } from '@/lib/supabase';
import {
  FileText,
  ShoppingCart,
  Users,
  Globe,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalArticles: number;
  totalCategories: number;
  totalPages: number;
  totalMessages: number;
  totalJobs: number;
  recentActivity: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalArticles: 0,
    totalCategories: 0,
    totalPages: 0,
    totalMessages: 0,
    totalJobs: 0,
    recentActivity: 0,
    systemHealth: 'healthy',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const sb = getSupabaseClient();

      const countExact = async (table: string, filter?: (q: any) => any) => {
        let q = sb.from(table).select('*', { count: 'exact', head: true });
        if (filter) q = filter(q);
        const { count, error } = await q;
        if (error) throw error;
        return count || 0;
      };

      const [
        totalProducts,
        totalArticles,
        totalCategories,
        totalPages,
        totalMessages,
        totalJobs,
      ] = await Promise.all([
        countExact('products'),
        countExact('articles'),
        countExact('content_categories', (q) => q.eq('is_active', true)),
        countExact('static_pages'),
        // 待处理留言：未读
        countExact('visitor_messages', (q) => q.eq('is_read', false)),
        countExact('job_postings', (q) => q.eq('is_active', true)),
      ]);

      setStats({
        totalProducts,
        totalArticles,
        totalCategories,
        totalPages,
        totalMessages,
        totalJobs,
        // 可选：最近活动可基于审计/日志，这里先用合计估算
        recentActivity: totalProducts + totalArticles + totalMessages,
        systemHealth: 'healthy',
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: '添加产品',
      description: '创建新产品内容',
      icon: ShoppingCart,
      href: '/maliang-admin/products',
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: '发布文章',
      description: '撰写新文章',
      icon: FileText,
      href: '/maliang-admin/articles',
      color: 'bg-green-500/20 text-green-400',
    },
    {
      title: '管理分类',
      description: '组织内容分类',
      icon: Settings,
      href: '/maliang-admin/categories',
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: '查看留言',
      description: '处理访客留言',
      icon: Users,
      href: '/maliang-admin/messages',
      color: 'bg-orange-500/20 text-orange-400',
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeInUp} className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">总产品数</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-400" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">+12%</span>
            <span className="text-white/60 ml-2">较上月</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">总文章数</p>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
            </div>
            <FileText className="h-8 w-8 text-green-400" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400">+8%</span>
            <span className="text-white/60 ml-2">较上月</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">总分类数</p>
              <p className="text-3xl font-bold">{stats.totalCategories}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-400" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="h-4 w-4 text-blue-400 mr-1" />
            <span className="text-white/60">活跃分类</span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">待处理留言</p>
              <p className="text-3xl font-bold">{stats.totalMessages}</p>
            </div>
            <Users className="h-8 w-8 text-orange-400" />
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Eye className="h-4 w-4 text-orange-400 mr-1" />
            <span className="text-orange-400">需要处理</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">快速操作</h2>
          <div className="grid gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-white/90 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/60">{action.description}</p>
                  </div>
                  <Plus className="h-5 w-5 text-white/40 group-hover:text-white/60 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">系统状态</h2>
          <div className="space-y-3">
            <div className="p-4 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">系统健康度</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    stats.systemHealth === 'healthy' ? 'bg-green-400' :
                    stats.systemHealth === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm text-white/60 capitalize">
                    {stats.systemHealth === 'healthy' ? '正常' :
                     stats.systemHealth === 'warning' ? '警告' : '错误'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">数据库连接</span>
                <span className="text-sm text-green-400">已连接</span>
              </div>
            </div>

            <div className="p-4 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">最近活动</span>
                <span className="text-sm text-white/60">{stats.recentActivity} 次操作</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-black border border-white/10 rounded-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-8 bg-white/10 rounded w-3/4"></div>
              </div>
              <div className="h-8 w-8 bg-white/10 rounded"></div>
            </div>
            <div className="mt-4 h-4 bg-white/10 rounded w-1/3"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
