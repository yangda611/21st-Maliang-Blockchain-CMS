/**
 * Unit Tests for Cache System
 * Tests caching functionality and performance
 */

import {
  memoryCache,
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheInvalidateByTag,
  CACHE_TTL,
  generateProductCacheKey,
  generateProductsListCacheKey,
} from '@/lib/cache';

describe('Cache System', () => {
  beforeEach(() => {
    memoryCache.clear();
  });

  describe('MemoryCache', () => {
    it('should store and retrieve values', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      memoryCache.set(key, value, 1000);
      const retrieved = memoryCache.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should respect TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      memoryCache.set(key, value, 100); // 100ms TTL
      expect(memoryCache.get(key)).toEqual(value);

      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(memoryCache.get(key)).toBeNull();
    });

    it('should delete values', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      memoryCache.set(key, value, 1000);
      expect(memoryCache.get(key)).toEqual(value);

      memoryCache.delete(key);
      expect(memoryCache.get(key)).toBeNull();
    });

    it('should invalidate by tag', () => {
      const tag = 'products';

      memoryCache.set('product-1', { id: 1 }, 1000, [tag]);
      memoryCache.set('product-2', { id: 2 }, 1000, [tag]);
      memoryCache.set('article-1', { id: 1 }, 1000, ['articles']);

      expect(memoryCache.get('product-1')).toBeTruthy();
      expect(memoryCache.get('product-2')).toBeTruthy();
      expect(memoryCache.get('article-1')).toBeTruthy();

      cacheInvalidateByTag(tag);

      expect(memoryCache.get('product-1')).toBeNull();
      expect(memoryCache.get('product-2')).toBeNull();
      expect(memoryCache.get('article-1')).toBeTruthy();
    });

    it('should enforce max size', () => {
      // Set small max size for testing
      const originalMaxSize = (memoryCache as any).maxSize;
      (memoryCache as any).maxSize = 2;

      memoryCache.set('key1', 'value1', 1000);
      memoryCache.set('key2', 'value2', 1000);
      memoryCache.set('key3', 'value3', 1000); // Should evict key1

      expect(memoryCache.get('key1')).toBeNull();
      expect(memoryCache.get('key2')).toBeTruthy();
      expect(memoryCache.get('key3')).toBeTruthy();

      // Restore original max size
      (memoryCache as any).maxSize = originalMaxSize;
    });
  });

  describe('Cache Utilities', () => {
    it('should generate correct cache keys', () => {
      const productId = '123';
      const filters = { category: 'tech', limit: 20 };

      expect(generateProductCacheKey(productId)).toBe('product:123');
      expect(generateProductsListCacheKey(filters)).toBe('products:list:category:tech:limit:20');
    });

    it('should handle async cache operations', async () => {
      const mockFetcher = jest.fn(() => Promise.resolve({ data: 'fresh-data' }));

      const result = await cacheGet('test-async', mockFetcher, 1000);

      expect(result).toEqual({ data: 'fresh-data' });
      expect(mockFetcher).toHaveBeenCalledTimes(1);
      expect(memoryCache.get('test-async')).toEqual({ data: 'fresh-data' });
    });

    it('should return cached data without calling fetcher', async () => {
      const mockFetcher = jest.fn(() => Promise.resolve({ data: 'fresh-data' }));

      // First call
      await cacheGet('test-cached', mockFetcher, 1000);
      expect(mockFetcher).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result = await cacheGet('test-cached', mockFetcher, 1000);
      expect(result).toEqual({ data: 'fresh-data' });
      expect(mockFetcher).toHaveBeenCalledTimes(1); // Still 1, not 2
    });
  });

  describe('Cache TTL Constants', () => {
    it('should have reasonable TTL values', () => {
      expect(CACHE_TTL.SHORT).toBe(5 * 60 * 1000); // 5 minutes
      expect(CACHE_TTL.MEDIUM).toBe(15 * 60 * 1000); // 15 minutes
      expect(CACHE_TTL.LONG).toBe(60 * 60 * 1000); // 1 hour
      expect(CACHE_TTL.VERY_LONG).toBe(24 * 60 * 60 * 1000); // 24 hours
    });
  });
});
