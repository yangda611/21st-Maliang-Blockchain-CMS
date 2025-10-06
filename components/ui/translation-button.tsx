/**
 * Translation Button Component
 * Reusable translation button with loading states and progress indicators
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Loader2, Check, AlertCircle } from 'lucide-react';
import type { SupportedLanguage } from '@/types/content';

export interface TranslationButtonProps {
  // 基础属性
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  sourceText: string;
  contentType: 'plain' | 'markdown' | 'html';
  
  // 状态属性
  isTranslating?: boolean;
  isCompleted?: boolean;
  hasError?: boolean;
  progress?: number;
  
  // 事件处理
  onTranslate: () => void;
  disabled?: boolean;
  
  // 样式配置
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'expanded';
  showProgress?: boolean;
  showLabel?: boolean;
  
  // 提示文本
  title?: string;
  loadingText?: string;
  completedText?: string;
  errorText?: string;
}

export function TranslationButton({
  sourceLanguage,
  targetLanguage,
  sourceText,
  contentType,
  isTranslating = false,
  isCompleted = false,
  hasError = false,
  progress = 0,
  onTranslate,
  disabled = false,
  size = 'md',
  variant = 'default',
  showProgress = true,
  showLabel = false,
  title,
  loadingText = '翻译中...',
  completedText = '已翻译',
  errorText = '翻译失败',
}: TranslationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 根据状态获取图标
  const getIcon = () => {
    if (isTranslating) {
      return <Loader2 className="animate-spin" />;
    }
    if (isCompleted) {
      return <Check />;
    }
    if (hasError) {
      return <AlertCircle />;
    }
    return <Languages />;
  };

  // 根据状态获取颜色
  const getColorClasses = () => {
    if (disabled) {
      return 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed';
    }
    if (isTranslating) {
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
    if (isCompleted) {
      return 'bg-green-500/10 border-green-500/30 text-green-400';
    }
    if (hasError) {
      return 'bg-red-500/10 border-red-500/30 text-red-400';
    }
    if (isHovered) {
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
    return 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white';
  };

  // 获取尺寸样式
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5 text-xs';
      case 'lg':
        return 'p-3 text-base';
      default:
        return 'p-2 text-sm';
    }
  };

  // 获取基础样式
  const getBaseClasses = () => {
    const base = 'flex items-center gap-2 rounded-lg border transition-all font-medium';
    const color = getColorClasses();
    const size = getSizeClasses();
    
    if (variant === 'minimal') {
      return `${base} ${color} ${size} bg-transparent border-transparent`;
    }
    
    return `${base} ${color} ${size}`;
  };

  // 生成默认标题
  const getDefaultTitle = () => {
    if (title) return title;
    if (isTranslating) return loadingText;
    if (isCompleted) return completedText;
    if (hasError) return errorText;
    return `翻译 ${targetLanguage.toUpperCase()}`;
  };

  // 渲染进度条
  const renderProgressBar = () => {
    if (!showProgress || !isTranslating) return null;
    
    return (
      <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-400"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  };

  // 渲染标签文本
  const renderLabel = () => {
    if (!showLabel) return null;
    
    let labelText = '';
    if (isTranslating) labelText = loadingText;
    else if (isCompleted) labelText = completedText;
    else if (hasError) labelText = errorText;
    else labelText = `翻译 ${targetLanguage.toUpperCase()}`;
    
    return <span className="truncate">{labelText}</span>;
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={onTranslate}
        disabled={disabled || isTranslating}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={getBaseClasses()}
        title={getDefaultTitle()}
        whileHover={!disabled && !isTranslating ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isTranslating ? { scale: 0.95 } : {}}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          {renderLabel()}
        </div>
        
        {/* 显示进度百分比 */}
        {showProgress && isTranslating && variant === 'expanded' && (
          <span className="text-xs opacity-70">{progress}%</span>
        )}
      </motion.button>
      
      {renderProgressBar()}
    </div>
  );
}

// 批量翻译按钮组件
export interface BatchTranslationButtonProps {
  sourceLanguage: SupportedLanguage;
  sourceText: string;
  contentType: 'plain' | 'markdown' | 'html';
  targetLanguages: SupportedLanguage[];
  isTranslating?: boolean;
  progress?: number;
  onTranslate: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function BatchTranslationButton({
  sourceLanguage,
  sourceText,
  contentType,
  targetLanguages,
  isTranslating = false,
  progress = 0,
  onTranslate,
  disabled = false,
  size = 'md',
  showCount = true,
}: BatchTranslationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (isTranslating) {
      return <Loader2 className="animate-spin" />;
    }
    return <Languages />;
  };

  const getColorClasses = () => {
    if (disabled) {
      return 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed';
    }
    if (isTranslating) {
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
    if (isHovered) {
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
    return 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onTranslate}
      disabled={disabled || isTranslating}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-2 rounded-lg border transition-all font-medium ${getColorClasses()} ${getSizeClasses()}`}
      title={`翻译所有未完成语言 (${targetLanguages.length}个)`}
      whileHover={!disabled && !isTranslating ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isTranslating ? { scale: 0.98 } : {}}
    >
      {getIcon()}
      <span>
        {isTranslating ? '翻译中...' : '翻译所有未完成语言'}
      </span>
      {showCount && !isTranslating && (
        <span className="px-1.5 py-0.5 bg-white/10 rounded text-xs">
          {targetLanguages.length}
        </span>
      )}
      {isTranslating && (
        <span className="text-xs opacity-70">{progress}%</span>
      )}
    </motion.button>
  );
}
