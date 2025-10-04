# Maliang 区块链 CMS 测试计划

更新时间：2025-10-03 20:34 (UTC+8)

## 1. 目标与范围
- 覆盖前台站点与后台管理的主要功能，确保关键路径可用、数据可写入、国际化与安全策略正确。
- 通过 MCP 浏览器自动化模拟真实用户操作，形成可重复的端到端测试流程。

## 2. 测试环境
- 本地开发环境：`http://localhost:3000`
- 关键环境变量（服务端需配置并重启）：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`（仅服务端使用，避免暴露到客户端）
- 账号（默认，参见 `CLAUDE.md`）：
  - Email: `yangda611@gmail.com`
  - Password: `chenyang123`

## 3. 覆盖功能矩阵
- 前台
  - 主页 `app/[lang]/page.tsx` + `components/public/hero-section.tsx`
  - 产品页 `app/[lang]/products/page.tsx`
  - 文章列表 `app/[lang]/articles/page.tsx`
  - 文章详情 `app/[lang]/articles/[slug]/page.tsx`
  - 联系我们 `app/[lang]/contact/page.tsx`（提交到 `/api/messages`）
- 后台（`/maliang-admin/*`）
  - 登录页 `app/maliang-admin/page.tsx`
  - 仪表板 `app/maliang-admin/dashboard/page.tsx`
  - 文章管理（组件）`components/admin/article-manager.tsx`
    - 新建文章弹窗：支持 纯文本 / Markdown（带预览）/ HTML 导入
    - 发布/下线、编辑、删除
  - 留言中心 `app/maliang-admin/messages/page.tsx`
  - 系统设置 `app/maliang-admin/settings/page.tsx`

## 4. 测试数据与夹具
- Markdown 夹具：`docs/tests/fixtures/sample.md`
- HTML 夹具：`docs/tests/fixtures/sample.html`
- 图片使用占位图或公网 URL

## 5. 冒烟用例（端到端）
- SMK-001 首页可打开
  - 步骤：访问 `/zh` → 观察 Hero 文案、无致命控制台错误
  - 期望：状态 200、主标题与副标题出现、无构建/运行时错误

- SMK-002 后台登录
  - 步骤：访问 `/maliang-admin` → 输入默认账号 → 登录成功跳转仪表板
  - 期望：进入 `/maliang-admin/dashboard`，显示统计卡片或面板

- SMK-003 联系我们提交
  - 前置：服务端已配置 `SUPABASE_SERVICE_ROLE_KEY`
  - 步骤：访问 `/zh/contact` → 填姓名/邮箱/留言 → 提交
  - 期望：`/api/messages` 201，无 403 RLS 报错

- SMK-004 留言中心可见新留言
  - 步骤：后台进入 `/maliang-admin/messages`
  - 期望：能看到刚提交的留言列表项，可标记已读

## 6. 功能用例（文章管理）
- ART-001 打开“新建文章”弹窗
  - 步骤：`/maliang-admin/articles` → 点击“新建文章”
  - 期望：弹窗出现，包含分类、标题、内容、摘要、封面、Slug、标签、发布等字段

- ART-002 标题多语言编辑
  - 步骤：在 `ContentEditor` 切换语言 Tab（如 `ZH/EN`）分别输入标题
  - 期望：翻译进度提示更新，生成默认 Slug（基于 ZH/EN）

- ART-003 内容编辑模式：纯文本
  - 步骤：编辑模式选择“纯文本”，输入多段内容
  - 期望：计数字段变化，内容保持

- ART-004 内容编辑模式：Markdown + 预览
  - 步骤：编辑模式选择“Markdown”，在左侧输入 `# 标题`、列表、代码块
  - 期望：右侧预览正确渲染标题/列表/代码块

- ART-005 内容编辑模式：HTML 导入
  - 步骤：选择 HTML 文件 `sample.html` 上传 → 检查导入后的文本
  - 期望：提取 `<body>` 文本内容（保留换行），可继续编辑

- ART-006 文章创建
  - 步骤：填必填项 → 提交
  - 期望：关闭弹窗、列表新增记录；若选择“立即发布”，标记为“已发布”

- ART-007 编辑/删除/发布切换
  - 步骤：列表中选择文章 → 编辑标题/内容 → 保存；执行删除；切换发布状态
  - 期望：操作成功，UI 与数据同步更新

## 7. 国际化用例（节选）
- I18N-001 语言下拉可切换（头部）
  - 步骤：点击语言切换 → 选择 EN/JA 等
  - 期望：主要文案切换为对应语言

## 8. 安全与策略
- RLS：
  - 联系表单写库通过 `/api/messages` 服务端使用 `supabaseAdmin` 绕过 RLS
  - 若远端未开匿名 Insert 策略，前端直插将 403 → 需配置 Service Role
- 管理员初始化/确保：仅在受控环境使用，避免暴露风险路由到公网

## 9. 通过/失败标准
- 通过：冒烟用例全部通过，功能用例的关键场景通过（创建/编辑/发布/留言）
- 失败：任一主路径中断（首页无法打开、后台无法登录、联系表单 403 等）

## 10. MCP 执行指南
- 使用工作流：`.windsurf/workflows/test-with-mcp.md`
- 交互式运行步骤，自动化打开页面、填表、点击按钮、收集控制台与网络状态
- 若某步失败：
  - 查看控制台错误与 API 响应
  - 确认环境变量与服务端键值配置
  - 记录复现步骤与截图
