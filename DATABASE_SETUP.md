# 数据库配置说明

## 🔧 环境变量配置

在 `server/.env` 文件中配置您的 Supabase 数据库连接信息：

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development

# Supabase 配置
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 📊 数据库表结构

系统使用 `admin_users` 表，表结构如下：

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

## 🔑 默认登录账号

根据您的数据库设置，默认登录账号为：
- **邮箱**: `yangda611@gmail.com`
- **密码**: `chenyang123`

## 📈 数据统计说明

系统会从 `admin_users` 表查询以下真实数据：

### 统计数据
- **总用户数**: 查询 `admin_users` 表的总记录数
- **活跃用户数**: 查询最近7天有登录记录的用户数
- **新增用户数**: 查询最近30天注册的用户数
- **增长率**: 基于新增用户数计算

### 用户列表
- 显示最近登录的10个用户
- 包含用户邮箱、最后登录时间、活跃状态等信息

## 🚀 启动步骤

1. **配置环境变量**
   ```bash
   cd server
   cp .env.example .env
   # 编辑 .env 文件，填入您的 Supabase 配置
   ```

2. **安装依赖**
   ```bash
   cd server
   npm install
   ```

3. **测试数据库连接**
   ```bash
   curl http://localhost:3001/api/test-db
   ```

4. **启动服务器**
   ```bash
   npm run dev
   ```

## 🔍 API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录（使用数据库验证）
- `GET /api/auth/profile` - 获取用户信息（从数据库查询）
- `POST /api/auth/logout` - 退出登录

### 数据接口
- `GET /api/dashboard` - 获取仪表板数据（真实数据库查询）
- `GET /api/dashboard/refresh` - 刷新仪表板数据
- `GET /api/test-db` - 测试数据库连接

### 系统接口
- `GET /api/health` - 健康检查

## 🐛 故障排除

### 1. 数据库连接失败
- 检查 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确
- 确认 Supabase 项目是否正常运行
- 检查网络连接

### 2. 登录失败
- 确认用户邮箱和密码是否正确
- 检查用户是否在 `admin_users` 表中
- 确认用户 `is_active` 状态为 `true`

### 3. 数据查询失败
- 检查 `admin_users` 表是否存在
- 确认表结构是否正确
- 查看服务器日志获取详细错误信息

## 📝 注意事项

1. **密码安全**: 当前系统使用明文密码比较，生产环境建议使用哈希密码
2. **权限控制**: 系统基于 `is_active` 字段控制用户访问权限
3. **数据更新**: 登录时会自动更新 `last_login` 字段
4. **错误处理**: 所有数据库操作都有完善的错误处理机制

## 🔄 数据同步

系统会实时从数据库查询最新数据：
- 每次访问仪表板都会查询最新的统计数据
- 用户列表按最后登录时间排序
- 支持数据刷新功能