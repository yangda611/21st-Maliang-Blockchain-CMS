/**
 * Optimized Image Component
 * 提供图片懒加载、预加载和性能优化
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // 懒加载实现
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 生成低质量占位符
  const generateBlurDataURL = (src: string) => {
    // 对于外部图片，生成一个简单的占位符
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==';
  };

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={cn(
          'flex items-center justify-center bg-gray-800 text-gray-400',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative', className)}>
      {/* 加载占位符 */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-800 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* 实际图片 */}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || generateBlurDataURL(src)}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            objectFit: 'cover',
          }}
        />
      )}
    </div>
  );
}
