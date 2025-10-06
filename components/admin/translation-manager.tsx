/**
 * Translation Manager Component
 * Interface for managing multi-language content translations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTranslationService } from '@/lib/services/translation-service';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Languages, CheckCircle, Clock, AlertCircle, FileText, Package, Globe } from 'lucide-react';
import type { SupportedLanguage } from '@/types/content';

export default function TranslationManager() {
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [incompleteTranslations, setIncompleteTranslations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'incomplete'>('pending');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // TODO: Implement translation management API endpoints
    // For now, just show empty state
    setPendingReviews([]);
    setIncompleteTranslations([]);
    setLoading(false);
  };

  const handleApprove = async (contentId: string, contentType: string) => {
    // TODO: Implement approve translation API
    console.log('Approve translation:', contentId, contentType);
  };

  const handleReject = async (contentId: string, contentType: string) => {
    const feedback = prompt('请输入拒绝原因：');
    if (!feedback) return;
    // TODO: Implement reject translation API
    console.log('Reject translation:', contentId, contentType, feedback);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-5 w-5" />;
      case 'article':
        return <FileText className="h-5 w-5" />;
      case 'page':
        return <Globe className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      product: '产品',
      article: '文章',
      page: '页面',
    };
    return labels[type] || type;
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">翻译管理</h1>
        <p className="text-white/60 mt-1">管理多语言内容翻译和审核</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            activeTab === 'pending'
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>待审核 ({pendingReviews.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('incomplete')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            activeTab === 'incomplete'
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>未完成 ({incompleteTranslations.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {activeTab === 'pending' && (
            <>
              {pendingReviews.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getContentTypeIcon(item.contentType)}
                        <div>
                          <h3 className="text-lg font-medium">
                            {item.name?.zh || item.title?.zh || item.name?.en || item.title?.en}
                          </h3>
                          <p className="text-sm text-white/60">
                            {getContentTypeLabel(item.contentType)} • 待审核
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-sm text-yellow-400">
                          待审核
                        </span>
                        <span className="text-sm text-white/40">
                          更新于 {new Date(item.updated_at).toLocaleString('zh-CN')}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(item.id, item.contentType)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg transition-all text-green-400"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>批准</span>
                        </button>
                        <button
                          onClick={() => handleReject(item.id, item.contentType)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all text-red-400"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>拒绝</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {pendingReviews.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>暂无待审核的翻译</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'incomplete' && (
            <>
              {incompleteTranslations.map((item) => {
                // Simple completeness calculation for now
                const completeness = {
                  completionPercentage: 0,
                  missingLanguages: [] as SupportedLanguage[]
                };

                return (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    className="p-6 bg-black border border-white/10 rounded-lg hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getContentTypeIcon(item.contentType)}
                          <div>
                            <h3 className="text-lg font-medium">
                              {item.name?.zh || item.title?.zh || item.name?.en || item.title?.en}
                            </h3>
                            <p className="text-sm text-white/60">
                              {getContentTypeLabel(item.contentType)}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/60">翻译完成度</span>
                            <span className={`text-sm font-medium ${getCompletionColor(completeness.completionPercentage)}`}>
                              {completeness.completionPercentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                              style={{ width: `${completeness.completionPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-white/60">缺少语言:</span>
                          {completeness.missingLanguages.map((lang) => (
                            <span
                              key={lang}
                              className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400"
                            >
                              {lang.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {incompleteTranslations.length === 0 && (
                <div className="text-center py-12 text-white/40">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>所有内容翻译已完成</p>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
