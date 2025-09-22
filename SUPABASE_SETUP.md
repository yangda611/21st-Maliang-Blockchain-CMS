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
```

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

## 安全注意事项

⚠️ **重要提醒：**
- 当前使用明文密码存储，生产环境应使用密码哈希
- 建议启用 Supabase 的 Row Level Security (RLS)
- 添加会话管理和 JWT 令牌验证
- 实施更严格的访问控制

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

