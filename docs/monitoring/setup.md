# Maliang CMS 监控配置指南

## 监控概述

为了确保 Maliang CMS 的高可用性和性能稳定性，我们需要建立全面的监控体系。本指南涵盖应用监控、基础设施监控、业务指标监控和告警配置。

## 监控架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   应用层监控    │    │ 基础设施监控    │    │   业务监控      │
│   (Next.js)     │◄──►│   (服务器)      │    │   (用户行为)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │   Grafana       │    │   AlertManager  │
│   (指标收集)    │    │   (可视化)      │    │   (告警)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 应用层监控

### 性能指标收集

在 Next.js 应用中添加性能监控：

```typescript
// lib/monitoring.ts
export const metrics = {
  // 页面加载时间
  pageLoadTime: new prometheus.Histogram({
    name: 'nextjs_page_load_duration_seconds',
    help: 'Duration of Next.js page loads in seconds',
    labelNames: ['page', 'status'],
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  }),

  // API 响应时间
  apiResponseTime: new prometheus.Histogram({
    name: 'nextjs_api_response_duration_seconds',
    help: 'Duration of API responses in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),

  // 错误率
  errorRate: new prometheus.Counter({
    name: 'nextjs_errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'page', 'user_agent'],
  }),

  // 用户互动
  userInteractions: new prometheus.Counter({
    name: 'nextjs_user_interactions_total',
    help: 'Total user interactions',
    labelNames: ['type', 'page'],
  }),
};

// 中间件收集指标
export function withMetrics(handler: any) {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const endTimer = metrics.apiResponseTime.startTimer();

    try {
      const response = await handler(req, ...args);

      endTimer({
        method: req.method,
        route: req.nextUrl.pathname,
        status_code: response.status,
      });

      return response;
    } catch (error) {
      metrics.errorRate.inc({
        type: 'api_error',
        page: req.nextUrl.pathname,
      });

      throw error;
    }
  };
}
```

### 健康检查端点

```typescript
// app/api/health/route.ts
export async function GET() {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'ok',
    version: process.env.npm_package_version,
  };

  try {
    // 检查数据库连接
    await sql`SELECT 1`;

    // 检查缓存连接
    await redis.ping();

    return NextResponse.json(healthCheck);
  } catch (error) {
    healthCheck.status = 'error';
    return NextResponse.json(healthCheck, { status: 503 });
  }
}
```

## 基础设施监控

### 服务器指标

使用 Node.js 内置模块收集系统指标：

```typescript
// lib/system-metrics.ts
import os from 'os';
import v8 from 'v8';

export function collectSystemMetrics() {
  return {
    // CPU 使用率
    cpu_usage: process.cpuUsage(),

    // 内存使用情况
    memory: {
      used: process.memoryUsage(),
      system: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem(),
      },
    },

    // V8 堆信息
    heap: v8.getHeapStatistics(),

    // 系统信息
    system: {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: os.uptime(),
    },

    // 网络接口
    network: os.networkInterfaces(),

    // 负载平均值
    loadavg: os.loadavg(),
  };
}
```

### Docker 容器监控

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=your-grafana-password
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

### Prometheus 配置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'maliang-cms'
    static_configs:
      - targets: ['host.docker.internal:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

## 业务指标监控

### 用户行为指标

```typescript
// lib/analytics.ts
export const analytics = {
  // 页面浏览
  pageViews: new prometheus.Counter({
    name: 'maliang_page_views_total',
    help: 'Total page views',
    labelNames: ['page', 'language', 'user_agent'],
  }),

  // 用户注册
  userRegistrations: new prometheus.Counter({
    name: 'maliang_user_registrations_total',
    help: 'Total user registrations',
    labelNames: ['source', 'plan'],
  }),

  // 内容创建
  contentCreated: new prometheus.Counter({
    name: 'maliang_content_created_total',
    help: 'Total content created',
    labelNames: ['type', 'language', 'author'],
  }),

  // 内容发布
  contentPublished: new prometheus.Counter({
    name: 'maliang_content_published_total',
    help: 'Total content published',
    labelNames: ['type', 'language'],
  }),

  // 访客留言
  visitorMessages: new prometheus.Counter({
    name: 'maliang_visitor_messages_total',
    help: 'Total visitor messages',
    labelNames: ['type', 'source'],
  }),
};
```

### 业务健康指标

```typescript
// lib/business-metrics.ts
export async function collectBusinessMetrics() {
  const supabase = createClient();

  // 内容统计
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const { count: totalArticles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);

  const { count: totalMessages } = await supabase
    .from('visitor_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  return {
    content: {
      totalProducts: totalProducts || 0,
      totalArticles: totalArticles || 0,
      totalMessages: totalMessages || 0,
    },
    system: {
      databaseConnections: await getActiveConnections(),
      cacheHitRate: await getCacheHitRate(),
      apiResponseTime: await getAverageResponseTime(),
    },
  };
}
```

## 告警配置

### AlertManager 配置

```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@maliang.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'email'

receivers:
  - name: 'email'
    email_configs:
      - to: 'admin@maliang.com'
        subject: 'Maliang CMS Alert'
        body: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

### 告警规则

```yaml
# alert-rules.yml
groups:
  - name: maliang-cms
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% over the last 5 minutes"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(api_response_duration_seconds_bucket[5m])) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow API response time"
          description: "95th percentile response time is {{ $value }}s"

      - alert: DatabaseConnectionHigh
        expr: database_connections > 50
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connections"
          description: "Database has {{ $value }} active connections"

      - alert: CacheHitRateLow
        expr: cache_hit_rate < 0.8
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Low cache hit rate"
          description: "Cache hit rate is {{ $value }}%"
```

## 日志管理

### 结构化日志

```typescript
// lib/logger.ts
interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      ...context,
    }));
  },

  error: (message: string, error?: Error, context?: LogContext) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      ...context,
    }));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      ...context,
    }));
  },
};
```

### 日志聚合

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:latest
    volumes:
      - ./promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log
    command: -config.file=/etc/promtail/config.yml

volumes:
  loki_data:
```

## 可视化面板

### Grafana 仪表板

#### 应用性能面板
- 响应时间趋势
- 错误率监控
- 请求量统计
- 用户活跃度

#### 基础设施面板
- CPU 使用率
- 内存使用情况
- 磁盘使用情况
- 网络流量

#### 业务指标面板
- 内容发布统计
- 用户互动数据
- 访客行为分析
- 转化率追踪

## 监控部署

### Docker Compose 监控栈

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/config.yml
    networks:
      - monitoring

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - loki_data:/loki
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring

networks:
  monitoring:
    driver: bridge

volumes:
  grafana_data:
  loki_data:
```

### 监控脚本

```bash
#!/bin/bash
# monitoring-setup.sh

# 安装监控栈
docker-compose -f docker-compose.monitoring.yml up -d

# 等待服务启动
sleep 30

# 配置 Grafana 数据源
curl -X POST \
  http://localhost:3000/api/datasources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://prometheus:9090",
    "access": "proxy",
    "isDefault": true
  }'

echo "监控系统部署完成"
echo "Grafana: http://localhost:3000 (admin/${GRAFANA_PASSWORD})"
echo "Prometheus: http://localhost:9090"
```

## 监控最佳实践

### 指标设计原则

1. **相关性**：只收集有意义的指标
2. **可操作性**：指标应该能指导行动
3. **实时性**：及时发现问题
4. **成本效益**：监控成本不应过高

### 告警策略

1. **分级告警**：不同严重程度的告警
2. **告警收敛**：避免告警风暴
3. **告警确认**：确保告警被处理
4. **故障演练**：定期测试告警机制

### 性能优化

1. **指标采样**：合理设置收集频率
2. **数据保留**：设置合适的数据保留期
3. **查询优化**：优化监控查询性能
4. **资源监控**：监控监控系统自身

## 故障诊断

### 常见监控问题

#### 指标不准确

```bash
# 检查指标端点
curl http://localhost:3000/api/metrics

# 验证指标格式
# 确保指标名称和标签正确
```

#### 告警不触发

```bash
# 测试告警规则
curl -X POST http://localhost:9090/-/reload

# 检查告警历史
curl http://localhost:9093/api/v1/alerts
```

#### 可视化面板异常

```bash
# 检查数据源连接
# 验证查询语法
# 确认时间范围设置
```

## 扩展监控

### 分布式追踪

```typescript
// lib/tracing.ts
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const provider = new NodeTracerProvider({
  plugins: {
    http: {
      enabled: true,
      path: '/api/traces',
    },
  },
});

provider.addSpanProcessor(
  new BatchSpanProcessor(new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  }))
);

provider.register();
```

### 实时监控

```typescript
// lib/real-time-metrics.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // 发送实时指标
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      timestamp: Date.now(),
      metrics: collectSystemMetrics(),
    }));
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
  });
});
```

## 监控成本控制

### 优化策略

1. **采样率**：只采样部分请求
2. **数据压缩**：压缩传输的指标数据
3. **本地聚合**：在应用层预聚合指标
4. **智能告警**：减少无效告警数量

### 成本监控

```typescript
// 监控监控成本
const monitoringCost = {
  prometheus: calculatePrometheusCost(),
  grafana: calculateGrafanaCost(),
  alerting: calculateAlertingCost(),
  storage: calculateStorageCost(),
};

logger.info('Monitoring cost', monitoringCost);
```

## 总结

完善的监控体系是确保 Maliang CMS 高可用性的关键。通过实施本指南中的监控策略，您可以：

1. **实时监控**：及时发现和解决问题
2. **性能优化**：持续改进系统性能
3. **故障预防**：提前发现潜在风险
4. **容量规划**：合理规划资源需求

记住，监控的目标不仅是收集数据，更是将数据转化为行动，确保系统的稳定运行和用户满意度。

---

*本监控指南最后更新于 2025-01-XX。如需技术支持，请联系技术团队。*
