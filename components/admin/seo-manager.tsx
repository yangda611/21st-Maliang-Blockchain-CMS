/**
 * SEO Manager Component
 * Interface for managing SEO configurations and optimization
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { seoService } from '@/lib/services/seo-service';
import ContentEditor from './content-editor';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Search, TrendingUp, Globe, Link, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import type { MultiLanguageText } from '@/types/content';

export default function SEOManager() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSitemapGenerator, setShowSitemapGenerator] = useState(false);
  const [sitemapUrl, setSitemapUrl] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    const result = await seoService.getAnalyticsSummary();
    if (result.success) {
      setAnalytics(result.data);
    }
    setLoading(false);
  };

  const handleGenerateSitemap = async () => {
    const baseUrl = prompt('请输入网站基础 URL (例如: https://example.com):');
    if (!baseUrl) return;

    try {
      const result = await seoService.generateSitemap(baseUrl);
      if (result.success) {
        alert(`Sitemap 已生成，包含 ${result.data?.length || 0} 个页面`);
        setSitemapUrl(`${baseUrl}/sitemap.xml`);
      }
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      alert('生成 Sitemap 失败');
    }
  };

  const handleSubmitToSearchEngines = async () => {
    if (!sitemapUrl) {
      alert('请先生成 Sitemap');
      return;
    }

    try {
      await seoService.submitToSearchEngines(sitemapUrl);
      alert('已提交到搜索引擎');
    } catch (error) {
      console.error('Failed to submit to search engines:', error);
      alert('提交失败');
    }
  };

  const getCompletionPercentage = () => {
    if (!analytics) return 0;
    const total = analytics.publishedContent;
    const optimized = analytics.optimizedContent;
    return total > 0 ? Math.round((optimized / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO 管理</h1>
        <p className="text-white/60 mt-1">搜索引擎优化和网站分析</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <>
          {/* Analytics Overview */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-sm text-white/60">总页面数</span>
              </div>
              <p className="text-3xl font-bold">{analytics?.totalPages || 0}</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm text-white/60">已发布内容</span>
              </div>
              <p className="text-3xl font-bold">{analytics?.publishedContent || 0}</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                </div>
                <span className="text-sm text-white/60">已优化内容</span>
              </div>
              <p className="text-3xl font-bold">{analytics?.optimizedContent || 0}</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="p-6 bg-black border border-white/10 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <span className="text-sm text-white/60">缺少元数据</span>
              </div>
              <p className="text-3xl font-bold">{analytics?.missingMetadata || 0}</p>
            </motion.div>
          </motion.div>

          {/* SEO Completion Progress */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="p-6 bg-black border border-white/10 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium mb-1">SEO 优化进度</h3>
                <p className="text-sm text-white/60">
                  {analytics?.optimizedContent || 0} / {analytics?.publishedContent || 0} 内容已优化
                </p>
              </div>
              <span className="text-2xl font-bold">{getCompletionPercentage()}%</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </motion.div>

          {/* SEO Tools */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2"
          >
            {/* Sitemap Generator */}
            <div className="p-6 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Link className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Sitemap 生成器</h3>
                  <p className="text-sm text-white/60">生成 XML Sitemap</p>
                </div>
              </div>
              <button
                onClick={handleGenerateSitemap}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
              >
                生成 Sitemap
              </button>
              {sitemapUrl && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-400">
                  Sitemap URL: {sitemapUrl}
                </div>
              )}
            </div>

            {/* Search Engine Submission */}
            <div className="p-6 bg-black border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Search className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium">搜索引擎提交</h3>
                  <p className="text-sm text-white/60">提交到 Google/Bing</p>
                </div>
              </div>
              <button
                onClick={handleSubmitToSearchEngines}
                disabled={!sitemapUrl}
                className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交到搜索引擎
              </button>
            </div>
          </motion.div>

          {/* SEO Best Practices */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="p-6 bg-black border border-white/10 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-4">SEO 最佳实践</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">元标题优化</p>
                  <p className="text-sm text-white/60">保持在 50-60 字符之间</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">元描述优化</p>
                  <p className="text-sm text-white/60">保持在 150-160 字符之间</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">URL 结构</p>
                  <p className="text-sm text-white/60">使用简短、描述性的 URL slug</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">图片优化</p>
                  <p className="text-sm text-white/60">使用 alt 标签和压缩图片</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">内部链接</p>
                  <p className="text-sm text-white/60">建立良好的内部链接结构</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-medium">快速操作</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all text-left">
                <p className="font-medium mb-1">检查死链</p>
                <p className="text-xs text-white/60">扫描并修复死链接</p>
              </button>
              <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all text-left">
                <p className="font-medium mb-1">性能分析</p>
                <p className="text-xs text-white/60">分析页面加载速度</p>
              </button>
              <button className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all text-left">
                <p className="font-medium mb-1">关键词研究</p>
                <p className="text-xs text-white/60">查找热门关键词</p>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
