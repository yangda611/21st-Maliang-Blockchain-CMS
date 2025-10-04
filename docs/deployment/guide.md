# Maliang CMS 部署指南

## 部署概述

Maliang CMS 支持多种部署方式，从开发环境到生产环境的完整部署流程。本指南将详细介绍如何部署和配置系统。

## 系统要求

### 服务器要求

- **Node.js**: 18.0.0 或更高版本
- **npm/yarn**: 最新版本
- **PostgreSQL**: 13.0 或更高版本（通过 Supabase 提供）
- **Redis**: 6.0 或更高版本（可选，用于高级缓存）

### 推荐配置

#### 开发环境
- CPU: 2核
- 内存: 4GB
- 存储: 20GB SSD
- 带宽: 10Mbps

#### 生产环境
- CPU: 4核+
- 内存: 8GB+
- 存储: 100GB+ SSD
- 带宽: 100Mbps+

## 部署方式

### 方式一：Vercel 部署（推荐）

#### 1. 准备工作

1. **创建 Vercel 账号**
   - 访问 https://vercel.com
   - 注册并登录账号

2. **连接 GitHub 仓库**
   - 将项目推送到 GitHub
   - 在 Vercel 中连接仓库

#### 2. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```env
# 必需变量
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 可选变量（生产环境推荐）
REDIS_URL=redis://your-redis-instance
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 3. 部署步骤

1. 在 Vercel 中点击"Deploy"
2. 等待自动构建完成
3. 配置自定义域名（如果需要）
4. 设置自动部署（连接 Git 推送）

#### 4. 域名配置

在域名注册商处添加 CNAME 记录：
```
CNAME your-domain.com cname.vercel-dns.com
```

### 方式二：Docker 部署

#### 1. Docker 镜像构建

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Docker Compose 配置

```yaml
version: '3.8'
services:
  maliang-cms:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

#### 3. 部署命令

```bash
# 构建镜像
docker build -t maliang-cms .

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f maliang-cms
```

### 方式三：手动部署

#### 1. 服务器准备

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 创建应用用户
sudo adduser --system --shell /bin/bash --group maliang
sudo mkdir -p /var/www/maliang-cms
sudo chown maliang:maliang /var/www/maliang-cms
```

#### 2. 应用部署

```bash
# 克隆代码（或上传构建产物）
git clone https://github.com/your-repo/maliang-cms.git /var/www/maliang-cms
cd /var/www/maliang-cms

# 安装依赖
npm ci --production

# 构建应用
npm run build

# 使用 PM2 启动
pm2 start npm --name "maliang-cms" -- start
pm2 save
pm2 startup
```

## 数据库配置

### Supabase 设置

1. **创建项目**
   - 访问 https://supabase.com
   - 创建新项目
   - 选择区域和数据库密码

2. **运行数据库迁移**
   ```bash
   # 在项目根目录运行
   npm run db:migrate
   ```

3. **种子数据**
   ```bash
   npm run db:seed
   ```

### 本地开发数据库

如果需要本地 PostgreSQL：

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 创建数据库
sudo -u postgres createdb maliang_cms
sudo -u postgres psql -c "CREATE USER maliang WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE maliang_cms TO maliang;"

# 更新环境变量
echo "DATABASE_URL=postgresql://maliang:your-password@localhost:5432/maliang_cms" >> .env.local
```

## 环境变量配置

### 生产环境 `.env.local`

```env
# 数据库配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 站点配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Redis 缓存（可选）
REDIS_URL=redis://localhost:6379

# 文件上传
SUPABASE_STORAGE_BUCKET=cms-files

# 邮件服务（可选）
SMTP_HOST=smtp.your-email.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password

# 区块链配置（可选）
ARWEAVE_WALLET_KEY=your-arweave-key
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-key
```

### 开发环境 `.env.local`

```env
# 开发数据库
DATABASE_URL=postgresql://user:password@localhost:5432/maliang_cms_dev

# Supabase 开发项目
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key

# 开发设置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## 文件存储配置

### Supabase Storage

1. **创建存储桶**
   ```bash
   # 在 Supabase 控制台中创建公开存储桶
   Bucket Name: cms-files
   Public: true
   ```

2. **上传初始资源**
   - 将 `/public/images/` 下的文件上传到存储桶
   - 设置正确的缓存策略

### 本地文件存储（开发）

```typescript
// lib/local-storage.ts (开发环境)
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const { url } = await response.json();
  return url;
}
```

## 反向代理配置

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # SSL 配置（生产环境）
    # listen 443 ssl http2;
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri @proxy;
    }

    # API 路由代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Next.js 应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/TLS 配置

### Let's Encrypt 证书

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 监控和日志

### 日志配置

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, meta);
  },
  error: (message: string, error?: Error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`, meta);
  },
};
```

### 监控指标

关键监控指标：
- 响应时间 (P50, P95, P99)
- 错误率
- CPU 和内存使用率
- 数据库连接数
- 缓存命中率

## 备份策略

### 数据库备份

```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/maliang-cms"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# 保留最近7天的备份
find $BACKUP_DIR -name "db_backup_*.sql" -type f -mtime +7 -delete

# 上传到云存储（可选）
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql s3://your-backup-bucket/
```

### 文件备份

```bash
# 备份上传的文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/maliang-cms/uploads/

# 备份配置文件
cp /var/www/maliang-cms/.env.local $BACKUP_DIR/.env_$DATE
```

## 故障恢复

### 数据库恢复

```bash
# 从备份恢复
psql $DATABASE_URL < /var/backups/maliang-cms/db_backup_20250101.sql

# 重启应用
pm2 restart maliang-cms
```

### 文件恢复

```bash
# 恢复上传文件
tar -xzf uploads_backup.tar.gz -C /var/www/maliang-cms/
chown -R www-data:www-data /var/www/maliang-cms/uploads/
```

## 性能优化

### 生产优化检查清单

- [ ] 启用生产模式 (`NODE_ENV=production`)
- [ ] 配置 CDN（Cloudflare/Vercel）
- [ ] 设置数据库连接池
- [ ] 配置 Redis 缓存
- [ ] 启用压缩（gzip/brotli）
- [ ] 设置适当的缓存头
- [ ] 优化图片（WebP/AVIF）
- [ ] 启用 HTTP/2
- [ ] 配置负载均衡（如果需要）

### 性能监控

```bash
# 使用 Lighthouse 检查性能
npx lighthouse https://your-domain.com --output html --output-path ./lighthouse-report.html

# 监控响应时间
curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com/api/health"
```

## 安全加固

### 安全检查清单

- [ ] 配置 HTTPS
- [ ] 设置安全头（CSP, HSTS）
- [ ] 配置防火墙规则
- [ ] 定期更新依赖包
- [ ] 设置入侵检测
- [ ] 配置日志监控
- [ ] 定期安全审计

### 防火墙配置

```bash
# 只允许必要的端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22  # SSH (仅内网)

# 启用防火墙
sudo ufw enable
```

## 故障排除

### 常见部署问题

#### 构建失败

```bash
# 检查 Node.js 版本
node --version

# 清除缓存重新构建
rm -rf .next node_modules
npm install
npm run build
```

#### 数据库连接失败

```bash
# 测试数据库连接
npm run db:health

# 检查环境变量
echo $NEXT_PUBLIC_SUPABASE_URL
```

#### 文件上传失败

```bash
# 检查存储桶权限
# 确认环境变量正确
echo $SUPABASE_SERVICE_ROLE_KEY
```

## 扩展部署

### 多服务器部署

1. **主服务器**：运行 Next.js 应用
2. **数据库服务器**：PostgreSQL 集群
3. **缓存服务器**：Redis 集群
4. **文件服务器**：分布式存储

### 负载均衡

```nginx
upstream maliang_backend {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    server 192.168.1.12:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://maliang_backend;
    }
}
```

## 更新部署

### 无停机更新

```bash
# 使用 PM2 的优雅重启
pm2 reload maliang-cms

# 或使用 zero-downtime 部署
npm run deploy:zero-downtime
```

### 回滚部署

```bash
# 回滚到上一个版本
pm2 stop maliang-cms
git reset --hard HEAD~1
npm install
npm run build
pm2 start maliang-cms
```

## 支持和维护

### 日常维护

1. **监控系统健康**：检查应用状态和资源使用
2. **更新依赖**：定期更新安全补丁
3. **备份数据**：确保备份正常运行
4. **清理日志**：防止日志文件过大

### 获取帮助

- **文档**：https://docs.maliang.com/deployment
- **技术支持**：support@maliang.com
- **社区论坛**：https://forum.maliang.com
- **状态页面**：https://status.maliang.com

---

## 部署检查清单

### 部署前检查
- [ ] 所有环境变量已正确配置
- [ ] 数据库迁移已运行
- [ ] 种子数据已加载
- [ ] 文件存储桶已创建
- [ ] 域名已正确解析
- [ ] SSL证书已安装（生产环境）

### 部署后验证
- [ ] 网站可以正常访问
- [ ] 管理后台可以登录
- [ ] 数据库连接正常
- [ ] 文件上传功能正常
- [ ] 多语言切换正常
- [ ] 邮件通知正常（如果配置）

### 生产环境额外检查
- [ ] CDN配置正确
- [ ] 监控系统运行正常
- [ ] 备份策略生效
- [ ] 安全措施到位
- [ ] 性能指标符合预期

---

*本部署指南最后更新于 2025-01-XX。随着系统更新，可能需要调整部署配置。*
