# Supabase Storage Configuration
# File storage bucket setup for Maliang CMS

# Bucket Configuration
BUCKET_NAME="cms-files"
BUCKET_PUBLIC=true

# Storage Policies (已包含在schema.sql中)

## Manual Setup Instructions:

### 1. Create Storage Bucket in Supabase Dashboard:
1. 登录 Supabase Dashboard
2. 进入项目设置 > Storage
3. 点击 "New bucket"
4. 名称: cms-files
5. 设为公开桶 (Public bucket): 是
6. 点击 "Create bucket"

### 2. Upload Initial Assets:
将以下目录结构上传到 cms-files 存储桶:

```
cms-files/
├── images/
│   ├── articles/
│   │   ├── blockchain-cms.jpg
│   │   └── funding-news.jpg
│   ├── banners/
│   │   ├── desktop-welcome.jpg
│   │   ├── mobile-welcome.jpg
│   │   ├── desktop-blockchain.jpg
│   │   └── mobile-blockchain.jpg
│   ├── products/
│   │   ├── wallet-1.jpg
│   │   ├── wallet-2.jpg
│   │   ├── nft-platform-1.jpg
│   │   └── nft-platform-2.jpg
│   └── team/
│       ├── zhangsan.jpg
│       ├── lisi.jpg
│       ├── wangwu.jpg
│       └── zhaoliu.jpg
└── uploads/
    └── (用户上传的文件将存储在这里)
```

### 3. Set Bucket Policies:
存储桶策略已在 schema.sql 中定义，包括:
- 公开读取权限
- 认证用户上传权限
- 用户管理自己的文件权限

### 4. Environment Variables:
确保在 .env.local 中设置以下变量:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=cms-files
```

## File Upload Guidelines:

### Image Specifications:
- **Articles**: 800x450px, WebP格式优选
- **Products**: 600x400px, 支持透明背景
- **Banners**: 1920x1080px (桌面), 750x1334px (移动)
- **Team Photos**: 400x400px, 正方形

### File Naming Convention:
- 小写字母和连字符
- 无特殊字符或空格
- 例如: `product-smart-wallet-hero.jpg`

### Security Considerations:
- 所有上传必须通过认证用户
- 文件类型验证 (images/*)
- 文件大小限制 (最大 10MB)
- 恶意文件扫描 (可选)

## Integration Code Example:

```typescript
// lib/storage.ts
import { supabase } from '@/lib/supabase'

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('cms-files')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error
  return data
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage
    .from('cms-files')
    .getPublicUrl(path)

  return data.publicUrl
}
```

## Troubleshooting:

### Common Issues:
1. **403 Forbidden**: 检查存储桶是否设为公开
2. **401 Unauthorized**: 确保用户已认证
3. **File too large**: 检查文件大小限制
4. **Invalid file type**: 验证文件类型过滤器

### Monitoring:
- 在 Supabase Dashboard 中监控存储使用情况
- 设置警报阈值 (例如 80% 使用率)
- 定期清理无用文件
