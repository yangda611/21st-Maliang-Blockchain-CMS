---
description: 使用 MCP 浏览器执行端到端测试
---

# 使用 MCP 浏览器执行端到端测试

前置条件：
- 本地开发服务运行在 `http://localhost:3000`
- `.env.local` 已配置：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`

## 步骤

1. 打开首页并检查是否渲染成功
// turbo
2. 打开 `http://localhost:3000/zh` 并等待页面稳定，抓取控制台错误（若有）。

3. 登录后台
4. 打开 `http://localhost:3000/maliang-admin`，输入：
   - Email: `yangda611@gmail.com`
   - Password: `chenyang123`
5. 提交后等待跳转到 `/maliang-admin/dashboard`，抓取控制台错误（若有）。

6. 测试“联系我们”表单
7. 打开 `http://localhost:3000/zh/contact`，填写：
   - 姓名：`自动化测试`
   - 邮箱：`auto.test@example.com`
   - 电话：`+86 13800000000`
   - 留言：`通过 MCP 端到端测试发送的消息`
8. 点击提交，预期接口 `/api/messages` 返回 201；若 403，检查服务端密钥与 RLS。

9. 验证留言中心
10. 打开 `http://localhost:3000/maliang-admin/messages`，检查是否能看到刚提交的留言。

11. 测试新建文章弹窗与编辑器模式
12. 打开 `http://localhost:3000/maliang-admin/articles`，点击“新建文章”。
13. 在“文章内容”选择“Markdown”，输入示例 Markdown；预览区域应正确渲染标题/列表/代码块。
14. 切换为“HTML导入”，上传 `docs/tests/fixtures/sample.html`，检查导入文本内容。
15. 填写必填项后提交，预期出现新文章卡片；尝试切换“已发布/草稿”。

## 结果记录
- 将执行结果、控制台与网络状态记录到 `docs/tests/test-plan.md` 的相应用例下。
