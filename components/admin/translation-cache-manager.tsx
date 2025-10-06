/**
 * Translation Cache Manager Component
 * Provides UI for managing translation cache and history
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Download, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import { useTranslation, translationCache } from '@/hooks/use-translation';
import type { TranslationHistoryItem } from '@/hooks/use-translation';

export interface TranslationCacheManagerProps {
  show?: boolean;
  onClose?: () => void;
}

export function TranslationCacheManager({ show = false, onClose }: TranslationCacheManagerProps) {
  const [activeTab, setActiveTab] = useState<'cache' | 'history'>('cache');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'plain' | 'markdown' | 'html'>('all');
  
  const {
    translationHistory,
    clearHistory,
    isTranslating
  } = useTranslation();

  const [cacheStats, setCacheStats] = useState({
    size: 0,
    maxSize: 1000,
    memoryUsage: '0 KB'
  });

  // 更新缓存统计
  useEffect(() => {
    const updateStats = () => {
      setCacheStats({
        size: translationCache.size(),
        maxSize: 1000,
        memoryUsage: estimateMemoryUsage()
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // 估算内存使用量
  const estimateMemoryUsage = (): string => {
    const size = translationCache.size();
    const avgSize = 500; // 假设每个缓存项平均 500 字节
    const bytes = size * avgSize;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // 清空缓存
  const handleClearCache = () => {
    if (confirm('确定要清空所有翻译缓存吗？这将清除所有已缓存的翻译结果。')) {
      translationCache.clear();
      setCacheStats(prev => ({ ...prev, size: 0 }));
    }
  };

  // 清空历史
  const handleClearHistory = () => {
    if (confirm('确定要清空所有翻译历史吗？')) {
      clearHistory();
    }
  };

  // 导出历史
  const handleExportHistory = () => {
    const dataStr = JSON.stringify(translationHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 过滤历史记录
  const filteredHistory = translationHistory.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.sourceText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetLanguages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || item.contentType === filterType;
    
    return matchesSearch && matchesType;
  });

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-black/90 border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">翻译管理</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex gap-2 mb-6">
          <button
          type="button"
            onClick={() => setActiveTab('cache')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'cache'
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            缓存管理
          </button>
          <button
          type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            翻译历史
          </button>
        </div>

        {/* 缓存管理 */}
        {activeTab === 'cache' && (
          <div className="space-y-6">
            {/* 缓存统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white/60">缓存项数量</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {cacheStats.size} / {cacheStats.maxSize}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  {Math.round((cacheStats.size / cacheStats.maxSize) * 100)}% 已使用
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <span className="text-white/60">内存使用</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {cacheStats.memoryUsage}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  估算值
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="h-5 w-5 text-purple-400" />
                  <span className="text-white/60">状态</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {isTranslating ? '翻译中' : '空闲'}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  {isTranslating ? '正在进行翻译' : '等待操作'}
                </div>
              </div>
            </div>

            {/* 缓存操作 */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
              >
                <Trash2 className="h-4 w-4" />
                清空缓存
              </button>
              
              <div className="flex-1 text-sm text-white/60">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                清空缓存后，相同的翻译请求需要重新调用 API
              </div>
            </div>

            {/* 缓存进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>缓存使用率</span>
                <span>{Math.round((cacheStats.size / cacheStats.maxSize) * 100)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(cacheStats.size / cacheStats.maxSize) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 翻译历史 */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* 搜索和过滤 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="搜索翻译历史..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
              >
                <option value="all">所有类型</option>
                <option value="plain">纯文本</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>

            {/* 历史操作 */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
              >
                <Trash2 className="h-4 w-4" />
                清空历史
              </button>
              
              <button
                onClick={handleExportHistory}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg transition-all"
              >
                <Download className="h-4 w-4" />
                导出历史
              </button>
              
              <div className="flex-1 text-sm text-white/60">
                共 {translationHistory.length} 条记录，显示 {filteredHistory.length} 条
              </div>
            </div>

            {/* 历史列表 */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  {searchTerm || filterType !== 'all' ? '没有找到匹配的记录' : '暂无翻译历史'}
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            {item.contentType.toUpperCase()}
                          </span>
                          <span className="text-xs text-white/40">
                            {item.sourceLanguage.toUpperCase()} → {item.targetLanguages.join(', ').toUpperCase()}
                          </span>
                          <span className="text-xs text-white/40">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm text-white/80 line-clamp-2">
                          {item.sourceText}
                        </div>
                      </div>
                    </div>
                    
                    {item.translations && Object.keys(item.translations).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="text-xs text-white/60 mb-1">翻译结果预览:</div>
                        <div className="text-sm text-white/70 line-clamp-2">
                          {Object.values(item.translations).join(' | ')}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
