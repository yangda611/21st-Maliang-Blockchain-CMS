/**
 * Lazy Wrapper Component
 * 提供组件懒加载功能，优化代码分割
 */

'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { cn } from '@/lib/utils';

interface LazyWrapperProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  className?: string;
  props?: Record<string, any>;
}

// 默认加载占位符
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center justify-center p-8', className)}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
  </div>
);

export function LazyWrapper({ 
  loader, 
  fallback = <DefaultFallback />, 
  className,
  props = {}
}: LazyWrapperProps) {
  const LazyComponent = lazy(loader);

  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </div>
  );
}

// 管理后台专用懒加载包装器
export function AdminLazyWrapper({ 
  loader, 
  fallback = <DefaultFallback />, 
  props = {}
}: Omit<LazyWrapperProps, 'className'>) {
  return (
    <LazyWrapper 
      loader={loader}
      fallback={fallback}
      className="w-full"
      props={props}
    />
  );
}

// 图片懒加载包装器
export function ImageLazyWrapper({ 
  loader, 
  fallback = <DefaultFallback />, 
  className,
  props = {}
}: LazyWrapperProps) {
  return (
    <LazyWrapper 
      loader={loader}
      fallback={fallback}
      className={cn('relative', className)}
      props={props}
    />
  );
}
