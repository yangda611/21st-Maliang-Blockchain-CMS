# Maliang CMS 备份策略指南

## 备份概述

备份是确保 Maliang CMS 数据安全和业务连续性的关键措施。本指南定义了完整的备份策略，包括数据库备份、文件备份、配置备份和灾难恢复方案。

## 备份类型

### 1. 数据库备份
- **完整备份**：所有数据的完整快照
- **增量备份**：仅上次备份以来的变化
- **实时备份**：数据库的实时副本（Supabase 提供）

### 2. 文件备份
- **应用文件**：源代码和配置文件
- **上传文件**：用户上传的图片和文档
- **静态资源**：构建产物和静态文件

### 3. 配置备份
- **环境变量**：所有敏感配置信息
- **部署配置**：Docker、Nginx 等配置文件
- **监控配置**：Prometheus、Grafana 配置

## 备份频率

### 生产环境
- **数据库**：每天完整备份 + 每小时增量备份
- **文件**：每天备份上传目录
- **配置**：每次变更后立即备份

### 开发环境
- **数据库**：每天备份
- **文件**：按需备份
- **配置**：版本控制管理

## 存储策略

### 本地存储
- **优点**：快速访问，低成本
- **缺点**：单点故障风险
- **位置**：`/var/backups/maliang-cms/`

### 云存储
- **优点**：异地容灾，高可用性
- **缺点**：网络依赖，成本较高
- **提供商**：AWS S3、Google Cloud Storage、阿里云 OSS

### 混合存储
- **本地**：近期备份（7天内）
- **云端**：长期备份（30天以上）

## 备份实施

### 自动备份脚本

```bash
#!/bin/bash
# backup.sh - Automated backup script

BACKUP_DIR="/var/backups/maliang-cms"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR/daily
mkdir -p $BACKUP_DIR/hourly

# 数据库备份
echo "Starting database backup..."

# Supabase 备份（使用 pg_dump）
pg_dump $DATABASE_URL > $BACKUP_DIR/daily/db_backup_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/daily/db_backup_$DATE.sql

# 文件备份
echo "Starting file backup..."
tar -czf $BACKUP_DIR/daily/files_backup_$DATE.tar.gz \
  /var/www/maliang-cms/uploads/ \
  /var/www/maliang-cms/.env.local \
  /etc/nginx/sites-available/maliang-cms

# 配置备份
echo "Starting configuration backup..."
cp -r /etc/prometheus/ $BACKUP_DIR/daily/prometheus_$DATE/
cp -r /etc/grafana/ $BACKUP_DIR/daily/grafana_$DATE/

# 清理过期备份
echo "Cleaning old backups..."
find $BACKUP_DIR -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -type d -empty -delete

# 上传到云存储
echo "Uploading to cloud storage..."
aws s3 sync $BACKUP_DIR/daily/ s3://maliang-cms-backups/daily/ --delete

echo "Backup completed at $(date)"
```

### 定时任务配置

```bash
# /etc/cron.d/maliang-cms-backup
# 每天凌晨2点执行完整备份
0 2 * * * root /var/www/maliang-cms/scripts/backup.sh

# 每小时执行增量备份（数据库）
0 * * * * root /var/www/maliang-cms/scripts/incremental-backup.sh
```

### Docker 备份

```yaml
# docker-compose.backup.yml
version: '3.8'
services:
  backup:
    image: alpine:latest
    volumes:
      - ./backup.sh:/backup.sh
      - backups:/backups
      - maliang_data:/var/www/maliang-cms
    command: sh /backup.sh
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

volumes:
  backups:
  maliang_data:
```

## 云存储配置

### AWS S3 配置

```bash
# 创建备份存储桶
aws s3 mb s3://maliang-cms-backups

# 设置生命周期策略（自动删除过期备份）
aws s3api put-bucket-lifecycle-configuration \
  --bucket maliang-cms-backups \
  --lifecycle-configuration '{
    "Rules": [
      {
        "ID": "DeleteOldBackups",
        "Status": "Enabled",
        "Filter": { "Prefix": "daily/" },
        "Expiration": { "Days": 30 }
      }
    ]
  }'

# 配置跨区域复制（可选）
aws s3api put-bucket-replication \
  --bucket maliang-cms-backups \
  --replication-configuration '{
    "Role": "arn:aws:iam::ACCOUNT:role/ReplicationRole",
    "Rules": [
      {
        "ID": "CrossRegionReplication",
        "Status": "Enabled",
        "Prefix": "",
        "Destination": {
          "Bucket": "arn:aws:s3:::maliang-cms-backups-replica"
        }
      }
    ]
  }'
```

### 加密配置

```bash
# 启用 S3 服务器端加密
aws s3api put-bucket-encryption \
  --bucket maliang-cms-backups \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'
```

## 监控和验证

### 备份监控

```typescript
// lib/backup-monitor.ts
export async function checkBackupHealth() {
  const checks = {
    database: await checkDatabaseBackup(),
    files: await checkFileBackup(),
    cloud: await checkCloudBackup(),
    integrity: await verifyBackupIntegrity(),
  };

  return {
    status: Object.values(checks).every(c => c.status === 'ok') ? 'healthy' : 'unhealthy',
    checks,
    lastCheck: new Date().toISOString(),
  };
}

async function checkDatabaseBackup() {
  try {
    // 检查最近的备份文件
    const recentBackups = await listBackups('database', 24); // 24小时内

    return {
      status: recentBackups.length > 0 ? 'ok' : 'warning',
      message: `Found ${recentBackups.length} recent backups`,
      lastBackup: recentBackups[0]?.timestamp,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }
}
```

### 备份验证

```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file>"
  exit 1
fi

echo "Verifying backup: $BACKUP_FILE"

# 检查文件完整性
if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
  echo "❌ Backup file is corrupted"
  exit 1
fi

# 检查备份大小
SIZE=$(stat -c%s "$BACKUP_FILE")
if [ $SIZE -lt 1000 ]; then
  echo "⚠️  Backup file seems too small"
fi

# 尝试还原测试（可选）
# pg_restore -l "$BACKUP_FILE" >/dev/null 2>&1
# if [ $? -eq 0 ]; then
#   echo "✅ Backup structure is valid"
# else
#   echo "❌ Backup structure is invalid"
#   exit 1
# fi

echo "✅ Backup verification completed"
```

## 灾难恢复

### 恢复优先级

1. **Level 1**：数据库恢复（核心业务数据）
2. **Level 2**：文件恢复（用户上传内容）
3. **Level 3**：配置恢复（系统配置）
4. **Level 4**：监控恢复（监控系统）

### 恢复步骤

```bash
#!/bin/bash
# disaster-recovery.sh

RECOVERY_TYPE=$1  # database, files, config, full

case $RECOVERY_TYPE in
  "database")
    echo "Recovering database..."
    # 停止应用
    pm2 stop maliang-cms

    # 恢复数据库
    psql $DATABASE_URL < /var/backups/maliang-cms/latest-db-backup.sql

    # 重启应用
    pm2 start maliang-cms
    ;;

  "files")
    echo "Recovering files..."
    # 恢复上传文件
    tar -xzf /var/backups/maliang-cms/latest-files-backup.tar.gz -C /
    chown -R www-data:www-data /var/www/maliang-cms/uploads/
    ;;

  "config")
    echo "Recovering configuration..."
    # 恢复配置文件
    cp /var/backups/maliang-cms/config-backup/.env.local /var/www/maliang-cms/
    cp -r /var/backups/maliang-cms/config-backup/nginx/* /etc/nginx/sites-available/
    systemctl reload nginx
    ;;

  "full")
    echo "Performing full recovery..."
    $0 database
    $0 files
    $0 config
    ;;
esac

echo "Recovery completed"
```

### 恢复测试

```bash
#!/bin/bash
# test-recovery.sh

echo "Testing disaster recovery..."

# 创建临时数据库
TEST_DB="maliang_cms_recovery_test"
createdb $TEST_DB

# 恢复到测试数据库
psql $TEST_DB < /var/backups/maliang-cms/latest-db-backup.sql

# 运行测试
npm run test:recovery

# 清理测试数据库
dropdb $TEST_DB

echo "Recovery test completed"
```

## 加密和安全

### 备份加密

```bash
#!/bin/bash
# encrypted-backup.sh

BACKUP_FILE=$1
PASSWORD=${BACKUP_PASSWORD:-"your-secure-password"}

# 创建加密备份
openssl enc -aes-256-cbc -salt -in "$BACKUP_FILE" -out "${BACKUP_FILE}.enc" -pass pass:"$PASSWORD"

# 验证加密
openssl enc -aes-256-cbc -d -in "${BACKUP_FILE}.enc" -out /tmp/decrypted -pass pass:"$PASSWORD" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ Backup encryption successful"
  rm /tmp/decrypted
else
  echo "❌ Backup encryption failed"
  exit 1
fi
```

### 访问控制

```yaml
# S3 存储桶策略
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBackupAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT:user/backup-user"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::maliang-cms-backups",
        "arn:aws:s3:::maliang-cms-backups/*"
      ]
    }
  ]
}
```

## 成本优化

### 存储成本控制

1. **分层存储**：
   - 热数据：本地 SSD（快速访问）
   - 温数据：云存储标准层（中等成本）
   - 冷数据：云存储低频层（低成本）

2. **压缩策略**：
   - 数据库备份：gzip 压缩（70% 压缩率）
   - 文件备份：tar + gzip（80% 压缩率）
   - 日志文件：日志轮转 + 压缩

3. **生命周期管理**：
   - 7天内：本地快速存储
   - 30天内：云存储标准层
   - 90天后：云存储低频层
   - 1年后：删除或归档

### 成本监控

```typescript
// lib/backup-cost-monitor.ts
export async function calculateBackupCosts() {
  const localStorage = await getLocalStorageUsage();
  const cloudStorage = await getCloudStorageUsage();
  const transferCosts = await getTransferCosts();

  const totalCost = localStorage.cost + cloudStorage.cost + transferCosts.cost;

  return {
    total: totalCost,
    breakdown: {
      local: localStorage,
      cloud: cloudStorage,
      transfer: transferCosts,
    },
    recommendations: generateCostRecommendations(totalCost),
  };
}
```

## 合规性和审计

### 备份审计

```typescript
// lib/backup-audit.ts
export async function auditBackups() {
  const auditReport = {
    timestamp: new Date().toISOString(),
    checks: {
      databaseBackups: await verifyDatabaseBackups(),
      fileBackups: await verifyFileBackups(),
      cloudBackups: await verifyCloudBackups(),
      encryption: await verifyEncryption(),
      retention: await verifyRetentionPolicy(),
    },
    compliance: {
      gdpr: checkGDPRCompliance(),
      sox: checkSOXCompliance(),
      iso27001: checkISO27001Compliance(),
    },
  };

  return auditReport;
}
```

### 审计报告

定期生成备份审计报告：

- **每日报告**：备份成功率、存储使用情况
- **每周报告**：趋势分析、潜在问题预警
- **每月报告**：合规性检查、成本分析

## 故障排除

### 常见备份问题

#### 备份失败

```bash
# 检查磁盘空间
df -h /var/backups

# 检查权限
ls -la /var/backups/maliang-cms/

# 检查数据库连接
psql $DATABASE_URL -c "SELECT 1;"
```

#### 恢复失败

```bash
# 验证备份文件完整性
gzip -t backup.sql.gz

# 检查数据库版本兼容性
pg_restore --version
psql --version

# 测试恢复到临时数据库
createdb test_recovery
psql test_recovery < backup.sql
```

#### 云存储问题

```bash
# 测试云存储连接
aws s3 ls s3://maliang-cms-backups/

# 检查网络连接
ping s3.amazonaws.com

# 验证凭证
aws sts get-caller-identity
```

## 高级特性

### 增量备份

```bash
#!/bin/bash
# incremental-backup.sh

LAST_BACKUP=$(ls -t /var/backups/maliang-cms/daily/db_backup_*.sql.gz | head -1)
BASE_BACKUP=$(basename "$LAST_BACKUP" .sql.gz)

# 创建增量备份
pg_dump --schema-only $DATABASE_URL > /var/backups/maliang-cms/hourly/schema_$DATE.sql

# 只备份变化的数据
pg_dump --data-only --table=products $DATABASE_URL > /var/backups/maliang-cms/hourly/products_$DATE.sql

# 压缩增量备份
gzip /var/backups/maliang-cms/hourly/*.sql
```

### 实时复制

```yaml
# PostgreSQL 流复制配置
# postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

# pg_hba.conf
host replication replicator 192.168.1.0/24 md5
```

### 跨区域备份

```bash
# 复制到多个区域
aws s3 sync s3://maliang-cms-backups/ s3://maliang-cms-backups-us-west-2/ --delete
aws s3 sync s3://maliang-cms-backups/ s3://maliang-cms-backups-eu-west-1/ --delete
```

## 维护计划

### 日常维护

- [ ] 检查备份成功率（目标：99.9%）
- [ ] 监控存储使用情况
- [ ] 验证备份文件完整性
- [ ] 更新备份脚本（如有必要）

### 每周维护

- [ ] 测试恢复流程
- [ ] 审计备份合规性
- [ ] 优化备份性能
- [ ] 更新文档

### 每月维护

- [ ] 全面灾难恢复演练
- [ ] 成本效益分析
- [ ] 容量规划评估
- [ ] 供应商服务审查

## 应急响应

### 备份紧急情况处理

1. **备份失败**：
   - 立即调查原因
   - 手动执行备份
   - 通知相关人员

2. **数据丢失**：
   - 停止写入操作
   - 评估丢失程度
   - 执行恢复流程

3. **存储故障**：
   - 切换到备用存储
   - 恢复最新备份
   - 调查根本原因

## 总结

完善的备份策略是 Maliang CMS 可靠性的基石。通过实施本指南中的备份方案，您可以确保：

1. **数据安全**：多重备份保护数据不丢失
2. **快速恢复**：最短时间内恢复业务
3. **合规保障**：满足各种法规要求
4. **成本控制**：合理优化备份成本

记住，备份不仅仅是技术问题，更是业务连续性保障的重要措施。定期测试和维护备份系统是确保系统可靠性的关键。

---

*本备份策略指南最后更新于 2025-01-XX。如需技术支持，请联系基础设施团队。*
