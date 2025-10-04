# Maliang CMS 性能优化指南

## 性能概述

性能优化是确保 Maliang CMS 快速、响应迅速的关键。本指南涵盖前端性能、后端优化、缓存策略和监控方法，帮助您实现最佳的用户体验。

## 性能指标

### Core Web Vitals

| 指标 | 优秀 | 需要改进 | 较差 |
|------|------|---------|------|
| LCP | ≤2.5s | 2.5-4s | >4s |
| FID | ≤100ms | 100-300ms | >300ms |
| CLS | ≤0.1 | 0.1-0.25 | >0.25 |

### 业务指标

- **首次内容绘制 (FCP)**：1.8秒内
- **最大内容绘制 (LCP)**：2.5秒内
- **首次输入延迟 (FID)**：100毫秒内
- **累计布局偏移 (CLS)**：0.1以下
- **总阻塞时间 (TBT)**：200毫秒以下

## 前端性能优化

### 1. 代码分割和懒加载

#### 路由级分割
```typescript
// app/layout.tsx - 全局共享代码
// app/page.tsx - 首页专用代码
// app/products/page.tsx - 产品页面专用代码
```

#### 组件懒加载
```typescript
// components/LargeComponent.tsx
const LargeComponent = lazy(() => import('./LargeComponent'));

// 使用 Suspense 包装
<Suspense fallback={<LoadingSpinner />}>
  <LargeComponent />
</Suspense>
```

#### 第三方库优化
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};
```

### 2. 图片优化

#### Next.js Image 组件
```tsx
import Image from 'next/image';

<Image
  src="/images/hero-bg.jpg"
  alt="Hero background"
  width={1920}
  height={1080}
  priority // 首屏图片优先加载
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### 图片格式优化
```typescript
// 现代格式支持
<Image
  src="/images/product.webp"
  alt="Product image"
/>

// 降级支持
<picture>
  <source srcSet="/images/product.avif" type="image/avif" />
  <source srcSet="/images/product.webp" type="image/webp" />
  <Image src="/images/product.jpg" alt="Product" />
</picture>
```

#### 响应式图片
```css
/* CSS 响应式图片 */
.responsive-image {
  width: 100%;
  height: auto;
  src: url('/images/hero-mobile.jpg');

  @media (min-width: 768px) {
    src: url('/images/hero-tablet.jpg');
  }

  @media (min-width: 1200px) {
    src: url('/images/hero-desktop.jpg');
  }
}
```

### 3. 字体优化

#### 字体加载优化
```html
<!-- 字体预加载 -->
<link rel="preload" href="/fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 字体显示优化 -->
<style>
  /* 字体加载期间使用系统字体 */
  .text-primary {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }

  /* 字体加载完成后应用自定义字体 */
  @font-face {
    font-family: 'CustomFont';
    src: url('/fonts/custom-font.woff2') format('woff2');
    font-display: swap;
  }

  .font-loaded .text-primary {
    font-family: 'CustomFont', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  }
</style>
```

#### WebFont Loader
```javascript
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Roboto:400,700', 'Inter:400,500,600']
  },
  custom: {
    families: ['CustomFont'],
    urls: ['/fonts/custom-font.css']
  },
  classes: false,
  events: false,
  timeout: 1000
});
```

### 4. JavaScript 优化

#### 代码分割
```typescript
// 动态导入大型库
const ChartComponent = lazy(() =>
  import('react-chartjs-2').then(mod => ({ default: mod.Line }))
);

// 条件导入
if (typeof window !== 'undefined') {
  // 仅客户端代码
  import('client-only-library');
}
```

#### Tree Shaking
```javascript
// 只导入需要的部分
import { formatDistance } from 'date-fns/locale/zh-CN';

// 而不是
import * as dateFns from 'date-fns';
```

## 后端性能优化

### 1. 数据库优化

#### 查询优化
```sql
-- 优化前
SELECT * FROM products WHERE category_id = '123';

-- 优化后
SELECT id, name, price FROM products
WHERE category_id = '123'
  AND is_published = true
ORDER BY created_at DESC
LIMIT 20;
```

#### 索引优化
```sql
-- 为常用查询创建复合索引
CREATE INDEX idx_products_category_published ON products(category_id, is_published);
CREATE INDEX idx_articles_published_date ON articles(is_published, published_at DESC);

-- 全文搜索索引
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('chinese', title));
```

#### 连接池优化
```typescript
// lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  max: 20,              // 最大连接数
  min: 2,               // 最小连接数
  idleTimeoutMillis: 30000,  // 空闲超时
  connectionTimeoutMillis: 2000, // 连接超时
});
```

### 2. API 优化

#### 响应缓存
```typescript
// app/api/products/route.ts
export async function GET(request: Request) {
  const cacheKey = 'products:list:all';

  // 检查缓存
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        'Cache-Control': 'public, max-age=300', // 5分钟缓存
        'CDN-Cache-Control': 'public, max-age=300',
      },
    });
  }

  // 获取数据
  const products = await getProducts();

  // 设置缓存
  await cacheSet(cacheKey, products, 300);

  return NextResponse.json(products);
}
```

#### 流式响应
```typescript
// 大数据集流式传输
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode('['));

        // 分批处理数据
        for await (const product of getProductsStream()) {
          controller.enqueue(encoder.encode(JSON.stringify(product) + ','));
        }

        controller.enqueue(encoder.encode(']'));
        controller.close();
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
    }
  );
}
```

### 3. 缓存策略

#### 多层缓存架构
```
用户请求 → CDN缓存 → 应用缓存 → 数据库缓存 → 数据库
```

#### Redis 缓存配置
```typescript
// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

export default redis;
```

#### 缓存失效策略
```typescript
// 主动失效
export async function invalidateProductCache(productId: string) {
  await Promise.all([
    cacheDelete(`product:${productId}`),
    cacheDelete(`products:list:*`), // 通配符失效
    cacheInvalidateByTag(`products`),
  ]);
}

// 被动失效（TTL）
export function cacheProduct(productId: string, data: any) {
  return cacheSet(`product:${productId}`, data, 3600); // 1小时
}
```

## CDN 和边缘优化

### Cloudflare 配置

```javascript
// wrangler.toml
name = "maliang-cms"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

[[build.upload]]
format = "service-worker"

# 缓存规则
[[rules]]
type = "ESModule"
globs = ["**/*.js"]

# 页面规则
[pages."*"]
cache_control = "public, max-age=300"

[pages."api/*"]
cache_control = "no-cache"

[pages."images/*"]
cache_control = "public, max-age=31536000, immutable"
```

### 边缘计算

```javascript
// functions/_middleware.js
export async function onRequest({ request, next }) {
  // 边缘缓存检查
  const cacheKey = new Request(request.url);
  const cached = await caches.default.match(cacheKey);

  if (cached) {
    return cached;
  }

  // 处理请求
  const response = await next();

  // 缓存响应
  if (response.ok && isCacheable(request)) {
    const responseToCache = response.clone();
    await caches.default.put(cacheKey, responseToCache);
  }

  return response;
}
```

## 监控和分析

### 1. 实时性能监控

#### Web Vitals 监控
```typescript
// lib/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals({ name, delta, value, id }: any) {
  // 发送到分析服务
  gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    non_interaction: true,
  });

  // 发送到监控服务
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify({ name, delta, value, id }),
  });
}

// 在应用初始化时调用
getCLS(reportWebVitals);
getFID(reportWebVitals);
getFCP(reportWebVitals);
getLCP(reportWebVitals);
getTTFB(reportWebVitals);
```

#### 自定义性能指标
```typescript
// lib/performance-monitor.ts
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  record(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverage(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getPercentile(name: string, percentile: number): number {
    const values = this.metrics.get(name) || [];
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  export(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [name, values] of this.metrics) {
      result[name] = {
        count: values.length,
        average: this.getAverage(name),
        p50: this.getPercentile(name, 50),
        p90: this.getPercentile(name, 90),
        p95: this.getPercentile(name, 95),
        p99: this.getPercentile(name, 99),
      };
    }

    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

### 2. 性能预算

#### 预算配置
```json
{
  "budgets": [
    {
      "resourceType": "document",
      "resourceSizes": [
        {
          "url": "auto",
          "budget": 200
        }
      ]
    },
    {
      "resourceType": "stylesheet",
      "resourceSizes": [
        {
          "url": "auto",
          "budget": 100
        }
      ]
    },
    {
      "resourceType": "script",
      "resourceSizes": [
        {
          "url": "auto",
          "budget": 500
        }
      ]
    },
    {
      "resourceType": "image",
      "resourceSizes": [
        {
          "url": "auto",
          "budget": 1000
        }
      ]
    }
  ]
}
```

#### Lighthouse CI
```yaml
# .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Ready - started server"
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## 部署优化

### 1. 构建优化

#### Next.js 构建配置
```javascript
// next.config.js
module.exports = {
  // 启用 SWC 编译器
  swcMinify: true,

  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['lucide-react', 'framer-motion'],

    // 现代输出格式
    outputFileTracing: true,

    // 图像优化
    images: {
      formats: ['image/avif', 'image/webp'],
    },
  },

  // Webpack 优化
  webpack: (config, { isServer }) => {
    // 树摇优化
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }

    // 压缩优化
    config.optimization.minimize = true;

    return config;
  },
};
```

### 2. 静态资源优化

#### 资源内联
```html
<!-- 内联关键CSS -->
<style>
  /* 首屏必需的样式 */
  .hero { background: linear-gradient(45deg, #000, #333); }
</style>

<!-- 内联关键JS -->
<script>
  // 首屏交互逻辑
  document.addEventListener('DOMContentLoaded', function() {
    // 快速初始化
  });
</script>
```

#### 资源预加载
```html
<!-- 预加载下一页面资源 -->
<link rel="prefetch" href="/products" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

### 3. 服务端优化

#### API 路由优化
```typescript
// app/api/products/route.ts
export const runtime = 'edge'; // 边缘运行时

export async function GET(request: Request) {
  // 边缘计算优化
  const startTime = performance.now();

  // 快速数据获取
  const products = await getProductsFromCache();

  const duration = performance.now() - startTime;

  // 添加性能头
  return new Response(JSON.stringify(products), {
    headers: {
      'X-Response-Time': `${duration}ms`,
      'Cache-Control': 'public, max-age=300',
    },
  });
}
```

## 数据库优化

### 1. 查询优化

#### 慢查询监控
```sql
-- 启用慢查询日志
SET log_min_duration_statement = 1000; -- 记录超过1秒的查询

-- 查询分析
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = '123';
```

#### 索引优化
```sql
-- 为常用查询创建索引
CREATE INDEX CONCURRENTLY idx_products_search ON products USING gin(to_tsvector('chinese', name));

-- 复合索引
CREATE INDEX CONCURRENTLY idx_products_category_published_created ON products(category_id, is_published, created_at DESC);

-- 部分索引（仅对已发布内容）
CREATE INDEX CONCURRENTLY idx_products_published ON products(id) WHERE is_published = true;
```

### 2. 连接池优化

#### Supabase 连接配置
```typescript
// lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-my-custom-header': 'maliang-cms',
      },
    },
    // 连接池配置
    pool: {
      max: 20,
      min: 2,
      idleTimeoutMillis: 30000,
    },
  }
);
```

## 移动端优化

### 1. 响应式性能

#### 移动端特定优化
```css
/* 移动端字体优化 */
@media (max-width: 768px) {
  body {
    font-size: 16px; /* 防止字体过小 */
    line-height: 1.5; /* 改善可读性 */
  }
}

/* 触摸目标优化 */
@media (max-width: 768px) {
  button, a, input, select, textarea {
    min-height: 44px; /* iOS 人机界面指南建议 */
    min-width: 44px;
  }
}
```

### 2. 移动端缓存

#### Service Worker 缓存
```javascript
// public/sw.js
const CACHE_NAME = 'maliang-cms-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 返回缓存或网络请求
        return response || fetch(event.request);
      })
  );
});
```

## 自动化优化

### 1. 构建时优化

#### 静态分析
```javascript
// scripts/analyze-bundle.js
const fs = require('fs');
const path = require('path');

function analyzeBundle() {
  const stats = fs.statSync(path.join(__dirname, '../.next/static/chunks'));

  console.log('Bundle Analysis:');
  console.log(`Total chunks: ${stats.size}`);
  console.log('Optimization suggestions:');
  // 分析大文件并提出优化建议
}

analyzeBundle();
```

### 2. 性能回归测试

#### Playwright 性能测试
```typescript
// tests/performance.spec.ts
import { test, expect } from '@playwright/test';

test('homepage performance', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const loadTime = Date.now() - startTime;

  expect(loadTime).toBeLessThan(3000); // 3秒内加载完成

  // 检查 Core Web Vitals
  const lcp = await page.evaluate(() => {
    return performance.getEntriesByType('largest-contentful-paint')[0]?.startTime;
  });

  expect(lcp).toBeLessThan(2500); // LCP < 2.5s
});
```

## 持续监控

### 1. 性能仪表板

#### Grafana 面板配置
```json
{
  "dashboard": {
    "title": "Maliang CMS Performance",
    "panels": [
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(nextjs_api_response_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(errors_total[5m]) * 100",
            "format": "percent"
          }
        ]
      }
    ]
  }
}
```

### 2. 警报规则

```yaml
# alert-rules.yml
groups:
  - name: performance
    rules:
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(api_response_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High API response time"
          description: "95th percentile response time is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate"
          description: "Error rate is {{ $value }} over the last 5 minutes"
```

## 故障排除

### 常见性能问题

#### 页面加载缓慢

```bash
# 检查资源大小
npm run analyze

# 检查图片优化
find public/images -type f -exec ls -lh {} \; | awk '{print $5 " " $9}' | sort -hr

# 检查第三方脚本
# 使用 Chrome DevTools Network 面板
```

#### 高内存使用

```typescript
// 监控内存使用
if (typeof window !== 'undefined') {
  setInterval(() => {
    const memory = (performance as any).memory;
    if (memory) {
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      });
    }
  }, 30000);
}
```

#### 数据库查询缓慢

```sql
-- 识别慢查询
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
WHERE mean_time > 1000  -- 超过1秒的查询
ORDER BY mean_time DESC
LIMIT 10;
```

## 总结

通过实施本指南中的性能优化策略，您可以显著提升 Maliang CMS 的用户体验和搜索引擎排名。记住：

1. **持续监控**：定期检查性能指标
2. **渐进式优化**：从小处着手，逐步改进
3. **用户体验优先**：性能优化要服务于用户体验
4. **数据驱动**：基于实际数据做出优化决策

优秀的性能不仅仅是技术指标，更是赢得用户信任和业务成功的关键因素。

---

*本性能优化指南最后更新于 2025-01-XX。如需性能咨询，请联系技术团队。*
