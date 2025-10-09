/**
 * 智能缓存系统
 * 提供多层缓存策略，优化性能
 */

// 缓存条目接口
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // 生存时间（毫秒）
  key: string;
}

// 缓存配置接口
interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
}

// 默认缓存配置
const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 100, // 最大缓存条目数
  defaultTTL: 5 * 60 * 1000, // 默认5分钟
  cleanupInterval: 60 * 1000, // 清理间隔1分钟
};

class SmartCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanup();
  }

  /**
   * 设置缓存
   */
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      key,
    };

    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, entry);
  }

  /**
   * 获取缓存
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 获取所有缓存键
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 检查条目是否过期
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * 驱逐最旧的条目
   */
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * 启动定期清理
   */
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 清理过期条目
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * 销毁缓存
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cache.clear();
  }
}

// 预定义的缓存实例
export const translationCache = new SmartCache({
  maxSize: 50,
  defaultTTL: 10 * 60 * 1000, // 翻译缓存10分钟
});

export const imageCache = new SmartCache({
  maxSize: 30,
  defaultTTL: 30 * 60 * 1000, // 图片缓存30分钟
});

export const apiCache = new SmartCache({
  maxSize: 100,
  defaultTTL: 2 * 60 * 1000, // API缓存2分钟
});

export const contentCache = new SmartCache({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 内容缓存5分钟
});

export const geoLocationCache = new SmartCache({
  maxSize: 1000,
  defaultTTL: 24 * 60 * 60 * 1000, // IP地理位置缓存24小时
});

/**
 * 缓存装饰器函数
 */
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cache: SmartCache<any>,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    // 尝试从缓存获取
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // 执行原函数
    const result = await fn(...args);
    
    // 存储到缓存
    cache.set(key, result, ttl);
    
    return result;
  }) as T;
}

/**
 * 创建缓存键生成器
 */
export function createKeyGenerator(prefix: string) {
  return (...args: any[]) => {
    return `${prefix}:${JSON.stringify(args)}`;
  };
}

/**
 * 内存缓存（用于客户端）
 */
class MemoryCache {
  private static instance: MemoryCache;
  private cache = new Map<string, any>();

  private constructor() {}

  static getInstance(): MemoryCache {
    if (!MemoryCache.instance) {
      MemoryCache.instance = new MemoryCache();
    }
    return MemoryCache.instance;
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const memoryCache = MemoryCache.getInstance();
