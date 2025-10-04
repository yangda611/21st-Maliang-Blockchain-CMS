/**
 * Caching Strategies for Maliang CMS
 * Implements various caching layers for optimal performance
 */

// Memory cache implementation
class MemoryCache {
  private cache = new Map<string, { value: any; expiry: number; tags?: string[] }>();
  private maxSize = 1000;

  set(key: string, value: any, ttl: number = 3600000, tags?: string[]): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
      tags,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((item, key) => {
      if (item.tags?.includes(tag)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const memoryCache = new MemoryCache();

// Cache key generators
export function generateProductCacheKey(id: string): string {
  return `product:${id}`;
}

export function generateProductsListCacheKey(filters: Record<string, any>): string {
  const sortedFilters = Object.keys(filters)
    .sort()
    .map(key => `${key}:${filters[key]}`)
    .join(':');
  return `products:list:${sortedFilters}`;
}

export function generateArticleCacheKey(slug: string): string {
  return `article:${slug}`;
}

export function generateArticlesListCacheKey(filters: Record<string, any>): string {
  const sortedFilters = Object.keys(filters)
    .sort()
    .map(key => `${key}:${filters[key]}`)
    .join(':');
  return `articles:list:${sortedFilters}`;
}

export function generateCategoryCacheKey(): string {
  return 'categories:all';
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,        // 5 minutes
  MEDIUM: 15 * 60 * 1000,      // 15 minutes
  LONG: 60 * 60 * 1000,        // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Cache wrapper functions
export async function cacheGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try memory cache first
  const cached = memoryCache.get(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const fresh = await fetcher();

  // Cache the result
  memoryCache.set(key, fresh, ttl);

  return fresh;
}

export function cacheSet(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM, tags?: string[]): void {
  memoryCache.set(key, value, ttl, tags);
}

export function cacheDelete(key: string): void {
  memoryCache.delete(key);
}

export function cacheInvalidateByTag(tag: string): void {
  memoryCache.invalidateByTag(tag);
}

// Utility function to wrap API responses with cache headers
export function setCacheHeaders(
  response: Response,
  cacheControl: string = 'public, max-age=300' // 5 minutes default
): Response {
  response.headers.set('Cache-Control', cacheControl);
  return response;
}

// Next.js specific caching utilities
export const revalidatePaths = {
  HOME: '/',
  PRODUCTS: '/products',
  ARTICLES: '/articles',
  CATEGORIES: '/categories',
} as const;

export function revalidatePath(path: string): void {
  // In Next.js 13+ with app directory, revalidation is handled differently
  // This is a placeholder for the actual implementation
  console.log(`Revalidating path: ${path}`);

  // In a real implementation, you would call:
  // revalidatePath(path);
}

// Cache warming utilities
export async function warmCache(): Promise<void> {
  try {
    // Warm popular content caches
    console.log('Warming cache...');

    // This would typically fetch and cache popular content
    // For now, just log the action
    console.log('Cache warming completed');
  } catch (error) {
    console.error('Error warming cache:', error);
  }
}

// Database query result caching
export function cacheQueryResult<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  return cacheGet(queryKey, queryFn, ttl);
}

// Static asset caching headers
export function getStaticAssetCacheHeaders(fileExtension: string): Record<string, string> {
  const cacheControl = fileExtension.match(/\.(js|css|woff|woff2|ttf|eot)$/)
    ? 'public, max-age=31536000, immutable' // 1 year for static assets
    : 'public, max-age=3600'; // 1 hour for images

  return {
    'Cache-Control': cacheControl,
    'CDN-Cache-Control': cacheControl,
    'Vercel-CDN-Cache-Control': cacheControl,
  };
}

// API response caching decorator
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKeyFn: (...args: Parameters<T>) => string,
  ttl: number = CACHE_TTL.MEDIUM,
  tags?: string[]
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = cacheKeyFn(...args);

    const cached = memoryCache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    memoryCache.set(cacheKey, result, ttl, tags);

    return result;
  }) as T;
}

// Performance monitoring for cache hits/misses
export class CacheMetrics {
  private static hits = 0;
  private static misses = 0;

  static recordHit(): void {
    this.hits++;
  }

  static recordMiss(): void {
    this.misses++;
  }

  static getHitRate(): number {
    const total = this.hits + this.misses;
    return total === 0 ? 0 : this.hits / total;
  }

  static getStats(): { hits: number; misses: number; hitRate: number } {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.getHitRate(),
    };
  }

  static reset(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

// Enhanced cache wrapper with metrics
export async function cacheGetWithMetrics<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  const cached = memoryCache.get(key);

  if (cached !== null) {
    CacheMetrics.recordHit();
    return cached;
  }

  CacheMetrics.recordMiss();

  const fresh = await fetcher();
  memoryCache.set(key, fresh, ttl);

  return fresh;
}
