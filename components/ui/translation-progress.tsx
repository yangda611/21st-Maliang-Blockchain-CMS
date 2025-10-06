/**
 * Translation Progress Component
 * Displays translation progress with visual indicators
 */

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { SupportedLanguage } from '@/types/content';

export interface TranslationProgressProps {
  // 基础属性
  languages: SupportedLanguage[];
  progress: Record<string, number>;
  status: Record<string, 'pending' | 'translating' | 'completed' | 'error'>;
  
  // 样式配置
  variant?: 'compact' | 'detailed' | 'minimal';
  showLabels?: boolean;
  showPercentages?: boolean;
  animated?: boolean;
  
  // 自定义文本
  labelTexts?: {
    pending?: string;
    translating?: string;
    completed?: string;
    error?: string;
  };
}

export function TranslationProgress({
  languages,
  progress,
  status,
  variant = 'detailed',
  showLabels = true,
  showPercentages = true,
  animated = true,
  labelTexts = {
    pending: '等待中',
    translating: '翻译中',
    completed: '已完成',
    error: '失败'
  }
}: TranslationProgressProps) {
  // 获取状态图标
  const getStatusIcon = (lang: SupportedLanguage) => {
    const currentStatus = status[lang];
    
    switch (currentStatus) {
      case 'translating':
        return <Loader2 className="animate-spin" />;
      case 'completed':
        return <CheckCircle />;
      case 'error':
        return <AlertCircle />;
      default:
        return <Clock />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (lang: SupportedLanguage) => {
    const currentStatus = status[lang];
    
    switch (currentStatus) {
      case 'translating':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  // 获取进度条颜色
  const getProgressColor = (lang: SupportedLanguage) => {
    const currentStatus = status[lang];
    
    switch (currentStatus) {
      case 'translating':
        return 'bg-blue-400';
      case 'completed':
        return 'bg-green-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-white/20';
    }
  };

  // 获取整体进度
  const getOverallProgress = () => {
    if (languages.length === 0) return 0;
    const totalProgress = languages.reduce((sum, lang) => sum + (progress[lang] || 0), 0);
    return Math.round(totalProgress / languages.length);
  };

  // 获取完成状态统计
  const getStatusStats = () => {
    const stats = {
      pending: 0,
      translating: 0,
      completed: 0,
      error: 0
    };

    languages.forEach(lang => {
      const currentStatus = status[lang];
      stats[currentStatus]++;
    });

    return stats;
  };

  // 渲染紧凑版本
  const renderCompact = () => {
    const overallProgress = getOverallProgress();
    const stats = getStatusStats();

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>翻译进度</span>
          <span className="font-medium text-white">{overallProgress}%</span>
        </div>
        
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: animated ? 0.5 : 0 }}
          />
        </div>

        <div className="flex items-center gap-1 text-xs text-white/40">
          {stats.completed > 0 && (
            <span className="text-green-400">{stats.completed}</span>
          )}
          {stats.translating > 0 && (
            <span className="text-blue-400">{stats.translating}</span>
          )}
          {stats.error > 0 && (
            <span className="text-red-400">{stats.error}</span>
          )}
          {stats.pending > 0 && (
            <span>{stats.pending}</span>
          )}
        </div>
      </div>
    );
  };

  // 渲染详细版本
  const renderDetailed = () => {
    const stats = getStatusStats();

    return (
      <div className="space-y-4">
        {/* 整体进度概览 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-white/90">翻译进度</h3>
            <div className="flex items-center gap-2 text-xs">
              {stats.completed > 0 && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  {stats.completed}
                </span>
              )}
              {stats.translating > 0 && (
                <span className="flex items-center gap-1 text-blue-400">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {stats.translating}
                </span>
              )}
              {stats.error > 0 && (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {stats.error}
                </span>
              )}
              {stats.pending > 0 && (
                <span className="flex items-center gap-1 text-white/40">
                  <Clock className="h-3 w-3" />
                  {stats.pending}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-sm text-white/60">
            {getOverallProgress()}% 完成
          </div>
        </div>

        {/* 整体进度条 */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: `${getOverallProgress()}%` }}
            transition={{ duration: animated ? 0.8 : 0 }}
          />
        </div>

        {/* 各语言进度 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {languages.map((lang) => {
            const currentProgress = progress[lang] || 0;
            const currentStatus = status[lang];
            const colorClasses = getStatusColor(lang);

            return (
              <div
                key={lang}
                className={`relative p-3 rounded-lg border transition-all ${colorClasses}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(lang)}
                    <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                  </div>
                  {showPercentages && (
                    <span className="text-xs">{currentProgress}%</span>
                  )}
                </div>

                {/* 进度条 */}
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(lang)}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${currentProgress}%` }}
                    transition={{ duration: animated ? 0.5 : 0 }}
                  />
                </div>

                {/* 状态标签 */}
                {showLabels && (
                  <div className="mt-2 text-xs text-center opacity-70">
                    {labelTexts[currentStatus]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 渲染极简版本
  const renderMinimal = () => {
    const stats = getStatusStats();
    const overallProgress = getOverallProgress();

    return (
      <div className="flex items-center gap-2 text-xs text-white/60">
        <Loader2 className={`h-3 w-3 ${stats.translating > 0 ? 'animate-spin text-blue-400' : 'text-white/40'}`} />
        <span>
          {overallProgress}% ({stats.completed}/{languages.length})
        </span>
      </div>
    );
  };

  return (
    <div className="translation-progress">
      {variant === 'compact' && renderCompact()}
      {variant === 'detailed' && renderDetailed()}
      {variant === 'minimal' && renderMinimal()}
    </div>
  );
}

// 单语言进度指示器
export interface SingleLanguageProgressProps {
  language: SupportedLanguage;
  progress: number;
  status: 'pending' | 'translating' | 'completed' | 'error';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function SingleLanguageProgress({
  language,
  progress,
  status,
  showLabel = true,
  size = 'md',
  animated = true
}: SingleLanguageProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'translating':
        return <Loader2 className="animate-spin" />;
      case 'completed':
        return <CheckCircle />;
      case 'error':
        return <AlertCircle />;
      default:
        return <Clock />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'translating':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-2 text-xs';
      case 'lg':
        return 'p-4 text-base';
      default:
        return 'p-3 text-sm';
    }
  };

  return (
    <div className={`flex items-center gap-3 rounded-lg border transition-all ${getStatusColor()} ${getSizeClasses()}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        {showLabel && (
          <span className="font-medium">{language.toUpperCase()}</span>
        )}
      </div>
      
      <div className="flex-1">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-current"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: animated ? 0.5 : 0 }}
          />
        </div>
      </div>
      
      <span className="text-xs opacity-70">{progress}%</span>
    </div>
  );
}
