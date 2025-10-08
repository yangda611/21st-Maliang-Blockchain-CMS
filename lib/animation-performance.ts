/**
 * 动画性能优化工具
 * 提供GPU加速、动画时机优化和性能监控
 */

import { useEffect, useRef, useCallback } from 'react';

// 检测设备性能能力
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      isLowEnd: false,
      prefersReducedMotion: false,
      supportsGPUAcceleration: false,
      maxConcurrentAnimations: 3
    };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData);
  
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isLowEndCPU = hardwareConcurrency <= 2;
  
  const memory = (navigator as any).deviceMemory;
  const isLowMemory = memory && memory <= 2;
  
  const isLowEnd = isSlowConnection || isLowEndCPU || isLowMemory;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsGPUAcceleration = CSS.supports('transform', 'translate3d(0, 0, 0)');
  
  return {
    isLowEnd,
    prefersReducedMotion,
    supportsGPUAcceleration,
    maxConcurrentAnimations: isLowEnd ? 2 : 4,
    connectionSpeed: connection?.effectiveType || 'unknown'
  };
}

// 动画性能配置
export const ANIMATION_CONFIG = {
  // 低端设备配置
  lowEnd: {
    duration: 0.2,
    stagger: 0.05,
    easing: 'ease-out',
    disableParallax: true,
    maxParticles: 20,
    reduceComplexity: true
  },
  // 高端设备配置
  highEnd: {
    duration: 0.6,
    stagger: 0.1,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    disableParallax: false,
    maxParticles: 50,
    reduceComplexity: false
  }
};

// 获取当前设备的动画配置
export function getAnimationConfig() {
  const capabilities = getDeviceCapabilities();
  return capabilities.isLowEnd ? ANIMATION_CONFIG.lowEnd : ANIMATION_CONFIG.highEnd;
}

// GPU加速样式生成器
export function getGPUAcceleratedStyles(transform: string = 'translate3d(0, 0, 0)') {
  const capabilities = getDeviceCapabilities();
  
  if (!capabilities.supportsGPUAcceleration) {
    return {};
  }
  
  return {
    transform,
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
    willChange: 'transform, opacity'
  };
}

// 动画性能监控
class AnimationPerformanceMonitor {
  private activeAnimations = new Set<string>();
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private callbacks: Array<(fps: number) => void> = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const measure = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= this.lastTime + 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        this.callbacks.forEach(callback => callback(this.fps));
      }
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }

  registerAnimation(id: string) {
    this.activeAnimations.add(id);
  }

  unregisterAnimation(id: string) {
    this.activeAnimations.delete(id);
  }

  getActiveAnimationCount() {
    return this.activeAnimations.size;
  }

  getFPS() {
    return this.fps;
  }

  onFPSUpdate(callback: (fps: number) => void) {
    this.callbacks.push(callback);
  }

  shouldThrottle() {
    const capabilities = getDeviceCapabilities();
    return this.fps < 30 || this.activeAnimations.size > capabilities.maxConcurrentAnimations;
  }
}

// 单例实例
export const performanceMonitor = new AnimationPerformanceMonitor();

// 动画钩子
export function useAnimationPerformance(animationId?: string) {
  const idRef = useRef(animationId || `animation-${Date.now()}-${Math.random()}`);
  const capabilities = useRef(getDeviceCapabilities());

  useEffect(() => {
    const id = idRef.current;
    performanceMonitor.registerAnimation(id);
    
    return () => {
      performanceMonitor.unregisterAnimation(id);
    };
  }, []);

  const shouldAnimate = useCallback(() => {
    return !capabilities.current.prefersReducedMotion && !performanceMonitor.shouldThrottle();
  }, []);

  const getConfig = useCallback(() => {
    return getAnimationConfig();
  }, []);

  return {
    shouldAnimate,
    getConfig,
    capabilities: capabilities.current,
    fps: performanceMonitor.getFPS(),
    activeAnimations: performanceMonitor.getActiveAnimationCount()
  };
}

// 优化的动画延迟函数
export function optimizedDelay(delay: number): number {
  const config = getAnimationConfig();
  const shouldThrottle = performanceMonitor.shouldThrottle();
  
  if (shouldThrottle) {
    return Math.min(delay * 0.5, 0.1); // 减少延迟时间
  }
  
  return delay * (config.duration / 0.6); // 根据配置调整
}

// 批量动画控制器
export class AnimationBatch {
  private animations: Array<() => void> = [];
  private isScheduled = false;

  add(animation: () => void) {
    this.animations.push(animation);
    this.schedule();
  }

  private schedule() {
    if (this.isScheduled) return;
    
    this.isScheduled = true;
    requestAnimationFrame(() => {
      this.flush();
      this.isScheduled = false;
    });
  }

  private flush() {
    const capabilities = getDeviceCapabilities();
    const maxAnimations = capabilities.maxConcurrentAnimations;
    
    // 只执行限制数量的动画
    const toExecute = this.animations.splice(0, maxAnimations);
    toExecute.forEach(animation => animation());
    
    // 如果还有动画待执行，继续调度
    if (this.animations.length > 0) {
      this.schedule();
    }
  }

  clear() {
    this.animations = [];
  }
}

// 全局动画批次实例
export const globalAnimationBatch = new AnimationBatch();

// 性能优化的动画属性
export function getOptimizedAnimationProps(baseProps: any = {}) {
  const config = getAnimationConfig();
  const shouldThrottle = performanceMonitor.shouldThrottle();
  
  return {
    ...baseProps,
    duration: shouldThrottle ? config.duration * 0.5 : config.duration,
    ease: config.easing,
    stagger: shouldThrottle ? config.stagger * 0.5 : config.stagger,
    // 为低端设备减少动画复杂度
    ...(config.reduceComplexity && {
      opacity: 0,
      scale: 0.95,
      transition: { duration: config.duration }
    })
  };
}

// 导出常用工具
export {
  getDeviceCapabilities as detectDevicePerformance,
  getAnimationConfig as getOptimizedAnimationConfig
};
