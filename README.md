# CMS 管理后台系统

一个现代化的 CMS 管理后台系统，采用暗黑主题和拟物化设计风格。

## ✨ 特性

- 🎨 **暗黑主题 + 拟物化设计** - 现代化的 UI 设计
- 🔐 **完整的鉴权系统** - JWT Token 认证
- 📊 **数据可视化** - 使用 ECharts 展示用户数据
- 📱 **响应式设计** - 支持各种屏幕尺寸
- ⚡ **高性能** - 基于 React 18 + Vite
- 🎭 **动画效果** - 流畅的页面过渡和交互动画

## 🛠️ 技术栈

### 前端
- **React 18** - 用户界面框架
- **TypeScript** - 类型安全
- **Ant Design** - UI 组件库
- **ECharts** - 数据可视化
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **Styled Components** - CSS-in-JS
- **Vite** - 构建工具

### 后端
- **Express.js** - Web 服务器
- **JWT** - 身份认证
- **bcryptjs** - 密码加密
- **CORS** - 跨域支持

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

### 2. 启动后端服务器

```bash
cd server
npm run dev
```

后端服务器将在 `http://localhost:3001` 启动

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端应用将在 `http://localhost:3000` 启动

## 🔑 默认登录信息

- **用户名**: `admin`
- **密码**: `admin123`

## 📁 项目结构

```
cms-admin-dashboard/
├── src/
│   ├── components/          # 组件
│   │   ├── Layout/         # 布局组件
│   │   ├── Dashboard/      # 仪表板组件
│   │   └── Common/         # 通用组件
│   ├── pages/              # 页面
│   ├── store/              # 状态管理
│   ├── services/           # API 服务
│   └── main.tsx           # 应用入口
├── server/                 # 后端服务器
│   ├── server.js          # 服务器主文件
│   └── package.json       # 后端依赖
└── package.json           # 前端依赖
```

## 🎨 设计特色

### 暗黑主题
- 深色背景色系 (#1a1a1a, #2d2d2d)
- 蓝色系主色调 (#3b82f6, #1e40af)
- 高对比度文字颜色

### 拟物化风格
- 玻璃拟态效果 (Glassmorphism)
- 新拟态阴影 (Neumorphism)
- 圆角和渐变效果
- 悬停动画和过渡效果

## 📊 功能模块

### 1. 登录与鉴权
- 用户登录验证
- JWT Token 管理
- 路由守卫
- 自动登出

### 2. 仪表板 (Dashboard)
- 用户统计卡片
- 用户增长趋势图
- 用户活跃度柱状图
- 用户列表表格

### 3. 布局系统
- 响应式侧边栏
- 顶部导航栏
- 主内容区域
- 移动端适配

## 🔧 开发说明

### 环境变量
创建 `.env` 文件：
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### API 接口
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `GET /api/dashboard` - 获取仪表板数据
- `GET /api/dashboard/refresh` - 刷新仪表板数据

### 状态管理
使用 Zustand 进行状态管理：
- `authStore` - 用户认证状态
- `dashboardStore` - 仪表板数据状态

## 🚀 部署

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
cd server
npm start
```

## 📝 开发计划

- [ ] 用户管理模块
- [ ] 内容管理模块
- [ ] 系统设置模块
- [ ] 权限管理
- [ ] 数据导出功能
- [ ] 实时通知系统

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License