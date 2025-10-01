# Supabase 后台管理系统设置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并登录
2. 点击 "New Project" 创建新项目
3. 填写项目信息：
   - 项目名称：`maliang-blockchain-cms`
   - 数据库密码：设置一个强密码
   - 地区：选择离您最近的地区

## 2. 获取项目配置信息

1. 在项目仪表板中，点击左侧菜单的 "Settings"
2. 选择 "API" 选项卡
3. 复制以下信息：
   - Project URL
   - anon public key

## 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 获取服务角色密钥
1. 在 Supabase Dashboard 中，进入 "Settings" > "API"
2. 在 "Project API keys" 部分找到 "service_role" 密钥
3. 复制服务角色密钥到环境变量中

## 4. 创建数据库表

在 Supabase 项目仪表板中：

1. 点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制并执行以下 SQL 代码：

```sql
-- 创建管理员用户表
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

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 插入初始管理员用户
INSERT INTO admin_users (email, password, role, is_active) 
VALUES ('yangda611@gmail.com', 'chenyang123', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
```

## 5. 启动应用程序

```bash
npm run dev
```

## 6. 访问管理后台

打开浏览器访问：`http://localhost:3000/maliang-admin`

使用以下凭据登录：
- 邮箱：`yangda611@gmail.com`
- 密码：`chenyang123`

## 功能特性

✅ **已实现的功能：**
- 美观的登录界面
- 响应式设计
- 动画效果
- 表单验证
- 错误处理
- 成功提示

🔄 **待实现的功能：**
- 登录后的管理后台页面
- 用户管理
- 内容管理
- 系统设置

## 🔧 权限配置方案

### 方案1：使用服务角色密钥（推荐）
✅ **已实施** - 这是最直接的解决方案

系统已经配置了服务角色密钥，可以在用户管理功能中创建新用户：

```typescript
// 使用服务角色客户端创建用户
const { data, error } = await supabaseAdmin.auth.admin.createUser({
  email: newUser.email,
  password: newUser.password,
  email_confirm: true,
});
```

### 方案2：配置 Supabase RLS (Row Level Security)
如果需要更细粒度的权限控制，可以配置 RLS 策略：

#### 2.1 启用 RLS
在 Supabase Dashboard 中：
1. 进入 `Authentication` > `Policies`
2. 为 `admin_users` 表启用 RLS
3. 创建适当的策略

#### 2.2 示例策略

```sql
-- 只有超级管理员可以创建新用户
CREATE POLICY "Only super admins can insert users"
ON admin_users FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM admin_users
    WHERE role = 'super_admin' AND is_active = true
  )
);

-- 用户只能查看和编辑自己的信息
CREATE POLICY "Users can view own data"
ON admin_users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON admin_users FOR UPDATE
USING (auth.uid() = id);
```

## 🔐 安全最佳实践

### 1. 服务角色密钥安全
- ⚠️ **重要**：服务角色密钥拥有完全访问权限
- ✅ 只在服务端使用
- ✅ 永远不要暴露给客户端
- ✅ 定期轮换密钥

### 2. 权限最小化原则
- 只授予必要的权限
- 使用 RLS 策略限制数据访问
- 定期审查用户权限

### 3. 用户管理最佳实践
- 实施密码强度要求
- 启用多因素认证
- 定期审查用户活动
- 实施账户锁定策略

## 🚀 部署注意事项

### Vercel 部署
在 Vercel 环境变量中设置：
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 本地开发
确保 `.env.local` 文件包含所有必要的环境变量。

## 📝 当前功能状态

- ✅ 用户登录验证
- ✅ 用户列表显示
- ✅ 用户信息编辑
- ✅ 用户状态切换
- ✅ 用户删除（防止自删除）
- ✅ 使用服务角色密钥创建新用户
- 🔄 错误处理和验证

## 🔧 故障排除

如果遇到问题：

1. 检查环境变量是否正确设置
2. 确认 Supabase 项目 URL 和密钥正确
3. 验证数据库表是否创建成功
4. 检查浏览器控制台是否有错误信息
5. 确认开发服务器正在运行
6. **权限问题**：确保服务角色密钥正确配置

## 安全注意事项

⚠️ **重要提醒：**
- 当前使用明文密码存储，生产环境应使用密码哈希
- 建议启用 Supabase 的 Row Level Security (RLS)
- 添加会话管理和 JWT 令牌验证
- 实施更严格的访问控制
- **服务角色密钥安全**：不要将服务角色密钥暴露给客户端

## 故障排除

如果遇到问题：

1. 检查环境变量是否正确设置
2. 确认 Supabase 项目 URL 和密钥正确
3. 验证数据库表是否创建成功
4. 检查浏览器控制台是否有错误信息
5. 确认开发服务器正在运行

## 下一步开发

1. 创建管理后台仪表板
2. 实现用户管理功能
3. 添加内容管理系统
4. 集成区块链相关功能
5. 实施安全措施和权限控制

