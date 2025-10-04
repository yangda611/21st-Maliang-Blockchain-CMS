# Feature: E2E Test Coverage for Maliang Blockchain CMS

This tasks.md enumerates concrete, dependency-ordered tasks to validate and harden the CMS using MCP-driven end-to-end tests. Each task is immediately executable with clear files, routes, and expected outcomes. [P] marks tasks that can run in parallel.

Repo root: e:/localCode/21st-Maliang-Blockchain-CMS

Related docs:
- Test plan: `docs/tests/test-plan.md`
- MCP workflow: `.windsurf/workflows/test-with-mcp.md`
- Fixtures: `docs/tests/fixtures/sample.md`, `docs/tests/fixtures/sample.html`

## Tasks

T001. Setup: Ensure environment variables
- Files: `.env.local`
- Details:
  - Define: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - Restart dev server after editing
- Dependency: None

T002. Setup: Verify dev server is reachable
- URL: `http://localhost:3000/zh`
- Acceptance: Status 200; no fatal console errors
- Dependency: T001

T003. MCP: Smoke test homepage [P]
- Command: Run workflow step 2 in `.windsurf/workflows/test-with-mcp.md`
- Acceptance: Hero renders; no SWC/JS runtime fatal error
- Dependency: T002

T004. MCP: Admin login [P]
- URL: `/maliang-admin`
- Credentials: `yangda611@gmail.com` / `chenyang123`
- Acceptance: Redirects to `/maliang-admin/dashboard`
- Notes: If blocked, check `lib/supabase.ts` and auth policies
- Dependency: T002

T005. API/RLS: Contact submission succeeds
- Page: `/zh/contact`
- Server route: `app/api/messages/route.ts`
- Expected: `POST /api/messages` → 201, no 403 RLS
- If 403: ensure `SUPABASE_SERVICE_ROLE_KEY` configured; server restarted
- Dependency: T001, T002

T006. MCP: Verify message appears in admin list
- Page: `/maliang-admin/messages`
- Acceptance: New message visible, can mark read/unread
- Dependency: T005, T004

T007. Articles: Open New Article modal [P]
- Component: `components/admin/article-manager.tsx`
- Acceptance: Modal opens; includes 分类/标题/内容/摘要/封面/Slug/标签/发布
- Dependency: T004

T008. Editor: Plain text mode editing [P]
- Component: `components/admin/content-editor.tsx`
- Steps: Set “纯文本”，输入多段; observe counter
- Acceptance: Text persists; counter updates
- Dependency: T007

T009. Editor: Markdown edit + preview [P]
- Steps: Set “Markdown”; paste `docs/tests/fixtures/sample.md`
- Acceptance: Preview shows headings/list/code block
- Dependency: T007

T010. Editor: HTML import [P]
- Steps: Set “HTML导入”; upload `docs/tests/fixtures/sample.html`
- Acceptance: Extracted body text present; can continue editing
- Dependency: T007

T011. Article create → list refresh
- Steps: Fill required fields; submit
- Acceptance: Modal closes; list shows new article card; optional 发布=已发布
- Dependency: T008–T010

T012. Article edit/delete/publish toggle
- Steps: Edit title/contents; delete; toggle 已发布/草稿
- Acceptance: Changes reflected in list; no console errors
- Dependency: T011

T013. I18N: Language switch smoke [P]
- Pages: key top-level routes under `app/[lang]/*`
- Acceptance: Text switches to EN/JA etc. without runtime errors
- Dependency: T002

T014. API hardening: messages route negative cases
- File: `app/api/messages/route.ts`
- Cases: missing `name/email/message` → 400; invalid email → 400
- Acceptance: Proper status codes and messages; no server crash
- Dependency: T002

T015. Security review: Disable or protect admin bootstrap routes
- Files: any `api` routes that create/ensure admin
- Acceptance: Either removed from production or guarded via allowlist token
- Dependency: T004

T016. Polish: Update docs with execution results
- File: `docs/tests/test-plan.md`
- Acceptance: Each case records pass/fail, console/network highlights, remediation links
- Dependency: T003–T015

## Parallelization Guidance
- [P] tasks can run together if you spawn multiple browser instances. Suggested groups:
  - Group A: T003, T013
  - Group B: T004, T007
  - Group C: T008, T009, T010
- Keep sequential: T011 → T012; T005 → T006

## Notes
- Use the MCP workflow `.windsurf/workflows/test-with-mcp.md` to drive steps 2–15.
- If any fatal error appears (e.g., SWC JSX parse), check recently edited components like `components/admin/content-editor.tsx` for syntax/closing tag issues.
