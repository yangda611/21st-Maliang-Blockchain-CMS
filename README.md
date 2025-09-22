# 21st Maliang Blockchain CMS

一个现代化的区块链CMS系统，使用Next.js、TypeScript、Tailwind CSS和shadcn/ui构建。

## 功能特性

- 🚀 现代化的Hero页面设计
- 🎨 使用Tailwind CSS进行样式设计
- ⚡ 基于Next.js 14的App Router
- 🔧 TypeScript支持
- 🎭 Framer Motion动画效果
- 📱 完全响应式设计
- 🌙 支持深色模式

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui
- **动画**: Framer Motion
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React组件
│   └── ui/               # UI组件库
│       ├── button.tsx    # 按钮组件
│       ├── animated-group.tsx # 动画组组件
│       └── hero-section-1.tsx # Hero页面组件
├── lib/                  # 工具函数
│   └── utils.ts          # 通用工具函数
└── public/               # 静态资源
```

## 组件说明

### HeroSection

主要的Hero页面组件，包含：
- 响应式导航栏
- 动画标题和描述
- 行动按钮
- 客户Logo展示区域
- 背景图片和装饰元素

### 依赖组件

- **Button**: 基于shadcn/ui的按钮组件
- **AnimatedGroup**: 用于创建动画效果的包装组件

## 自定义

### 修改内容

编辑 `components/ui/hero-section-1.tsx` 文件来修改：
- 标题和描述文本
- 按钮链接
- 菜单项
- 客户Logo

### 修改样式

编辑 `app/globals.css` 文件来修改：
- 颜色主题
- 全局样式

## 部署

### Vercel (推荐)

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署

### 其他平台

```bash
npm run build
npm start
```

## 许可证

MIT License
