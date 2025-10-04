# Tasks: Comprehensive CMS Backend System

**Input**: Design documents from `E:\localCode\21st-Maliang-Blockchain-CMS\specs\003-comprehensive-cms-backend\`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [x] T001 Create project structure per implementation plan (types/, hooks/, utils/ directories)
- [x] T002 Initialize TypeScript types for content models in `types/database.ts` and `types/content.ts`
- [x] T003 [P] Configure ESLint and Prettier for CMS-specific rules
- [x] T004 [P] Set up Supabase MCP integration in `lib/supabase.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T005 [P] Contract test for content categories API in `tests/contract/test-categories.ts`
- [x] T006 [P] Contract test for products API in `tests/contract/test-products.ts`
- [x] T007 [P] Contract test for articles API in `tests/contract/test-articles.ts`
- [x] T008 [P] Contract test for static pages API in `tests/contract/test-static-pages.ts`
- [x] T009 [P] Contract test for job postings API in `tests/contract/test-job-postings.ts`
- [x] T010 [P] Contract test for visitor messages API in `tests/contract/test-messages.ts`
- [x] T011 [P] Contract test for multi-language content API in `tests/contract/test-translations.ts`
- [x] T012 [P] Contract test for admin authentication API in `tests/contract/test-auth.ts`
- [x] T013 [P] Integration test for content creation workflow in `tests/integration/test-content-creation.ts`
- [x] T014 [P] Integration test for multi-language content management in `tests/integration/test-multi-language.ts`
- [x] T015 [P] Integration test for SEO optimization workflow in `tests/integration/test-seo-optimization.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Database & Types
- [x] T016 [P] Database types generation from Supabase schema in `types/database.ts`
- [x] T017 [P] Content model interfaces in `types/content.ts` (Category, Product, Article, etc.)
- [x] T018 [P] Translation workflow types in `types/content.ts` (Draft, Pending Review, Published)

### Utility Functions
- [x] T019 [P] Language detection utility in `utils/language-detection.ts`
- [x] T020 [P] SEO optimization helpers in `utils/seo.ts`
- [x] T021 [P] Form validation utilities in `utils/validation.ts`
- [x] T022 [P] Animation utilities in `utils/animations.ts`

### Custom Hooks
- [x] T023 [P] useLanguage hook for multi-language state management in `hooks/use-language.ts`
- [x] T024 [P] useContent hook for CRUD operations in `hooks/use-content.ts`
- [x] T025 [P] useAuth hook for admin authentication in `hooks/use-auth.ts`

### Core Services
- [x] T026 ContentCategoryService for category management in `lib/services/content-category-service.ts`
- [x] T027 ProductService for product CRUD operations in `lib/services/product-service.ts`
- [x] T028 ArticleService for article management in `lib/services/article-service.ts`
- [x] T029 StaticPageService for page management in `lib/services/static-page-service.ts`
- [x] T030 JobPostingService for recruitment management in `lib/services/job-posting-service.ts`
- [x] T031 VisitorMessageService for message handling in `lib/services/visitor-message-service.ts`
- [x] T032 TranslationService for multi-language content in `lib/services/translation-service.ts`
- [x] T033 SEOService for optimization features in `lib/services/seo-service.ts`

## Phase 3.4: Component Implementation

### Admin Components
- [x] T034 AdminLayout component for dashboard structure in `components/admin/admin-layout.tsx`
- [x] T035 ContentEditor component for rich text editing in `components/admin/content-editor.tsx`
- [x] T036 CategoryManager component for category CRUD in `components/admin/category-manager.tsx`
- [x] T037 ProductManager component for product management in `components/admin/product-manager.tsx`
- [x] T038 ArticleManager component for article management in `components/admin/article-manager.tsx`
- [x] T039 StaticPageManager component for page management in `components/admin/static-page-manager.tsx`
- [x] T040 JobPostingManager component for recruitment in `components/admin/job-posting-manager.tsx`
- [x] T041 MessageCenter component for visitor messages in `components/admin/message-center.tsx`
- [x] T042 TranslationManager component for multi-language content in `components/admin/translation-manager.tsx`
- [x] T043 SEOManager component for SEO optimization in `components/admin/seo-manager.tsx`

### Public Components
- [x] T044 LanguageSelector component for frontend in `components/public/language-selector.tsx`
- [x] T045 ContentCard component for content display in `components/public/content-card.tsx`
- [x] T046 CategoryNavigation component for menu structure in `components/public/category-navigation.tsx`
- [x] T047 BannerManager component for slideshow management in `components/public/banner-manager.tsx`
- [x] T048 ContactForm component for visitor interactions in `components/public/contact-form.tsx`

## Phase 3.5: Page Implementation

### Admin Pages
- [ ] T049 Admin dashboard home page in `app/maliang-admin/page.tsx`
- [ ] T050 Categories management page in `app/maliang-admin/categories/page.tsx`
- [ ] T051 Products management page in `app/maliang-admin/products/page.tsx`
- [ ] T052 Articles management page in `app/maliang-admin/articles/page.tsx`
- [ ] T053 Static pages management page in `app/maliang-admin/pages/page.tsx`
- [ ] T054 Job postings management page in `app/maliang-admin/jobs/page.tsx`
- [ ] T055 Messages management page in `app/maliang-admin/messages/page.tsx`
- [ ] T056 Translation management page in `app/maliang-admin/translations/page.tsx`
- [ ] T057 SEO management page in `app/maliang-admin/seo/page.tsx`

### Public Pages
- [ ] T058 Homepage with dynamic content in `app/page.tsx`
- [ ] T059 Category listing pages in `app/categories/[slug]/page.tsx`
- [ ] T060 Product detail pages in `app/products/[slug]/page.tsx`
- [ ] T061 Article detail pages in `app/articles/[slug]/page.tsx`
- [ ] T062 Static content pages in `app/pages/[slug]/page.tsx`
- [ ] T063 Job listings page in `app/jobs/page.tsx`
- [ ] T064 Contact page in `app/contact/page.tsx`

## Phase 3.6: Integration & Features

### Database Integration
- [ ] T065 Supabase table creation and RLS policies setup
- [ ] T066 Database seeding with initial categories and content
- [ ] T067 File storage bucket configuration for media uploads

### Multi-language Implementation
- [ ] T068 Translation JSON files for all supported languages in `public/locales/`
- [ ] T069 Language routing middleware in `middleware.ts`
- [ ] T070 Content fallback mechanism for missing translations

### SEO & Performance
- [ ] T071 Sitemap generation service in `lib/services/sitemap-service.ts`
- [ ] T072 Search engine submission tools in `lib/services/search-engine-service.ts`
- [ ] T073 Caching strategy implementation with Supabase Edge Functions
- [ ] T074 Performance monitoring and optimization

## Phase 3.7: Polish
- [ ] T075 [P] Unit tests for utility functions in `tests/unit/test-utils.ts`
- [ ] T076 [P] Unit tests for custom hooks in `tests/unit/test-hooks.ts`
- [ ] T077 [P] Unit tests for services in `tests/unit/test-services.ts`
- [ ] T078 Integration tests for complete workflows in `tests/integration/test-workflows.ts`
- [ ] T079 E2E tests for admin panel functionality in `tests/e2e/test-admin-panel.ts`
- [ ] T080 Performance tests ensuring <200ms response times in `tests/performance/test-performance.ts`
- [ ] T081 Accessibility tests for WCAG compliance in `tests/accessibility/test-a11y.ts`
- [ ] T082 [P] Documentation updates in `docs/CMS_GUIDE.md`
- [ ] T083 [P] API documentation generation in `docs/API_REFERENCE.md`
- [ ] T084 Remove debug code and console logs
- [ ] T085 Code review for constitutional compliance
- [ ] T086 Final testing and validation

## Dependencies
- Setup (T001-T004) before all other phases
- Tests (T005-T015) before implementation (T016-T086)
- Types (T016-T018) before services (T026-T033)
- Services (T026-T033) before components (T034-T048)
- Components (T034-T048) before pages (T049-T064)
- Database integration (T065-T067) before feature implementation (T068-T074)
- All implementation before polish (T075-T086)

## Parallel Execution Examples

### Launch Setup Tasks Together:
```
Task: "Create project structure per implementation plan (types/, hooks/, utils/ directories)"
Task: "Configure ESLint and Prettier for CMS-specific rules"
Task: "Set up Supabase MCP integration in lib/supabase.ts"
```

### Launch Service Tests Together:
```
Task: "Contract test for content categories API in tests/contract/test-categories.ts"
Task: "Contract test for products API in tests/contract/test-products.ts"
Task: "Contract test for articles API in tests/contract/test-articles.ts"
Task: "Contract test for static pages API in tests/contract/test-static-pages.ts"
```

### Launch Component Implementation Together:
```
Task: "ContentCard component for content display in components/public/content-card.tsx"
Task: "CategoryNavigation component for menu structure in components/public/category-navigation.tsx"
Task: "BannerManager component for slideshow management in components/public/banner-manager.tsx"
```

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each API contract → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → TypeScript interface task [P]
   - Each service → service implementation task

3. **From User Stories**:
   - Each acceptance scenario → integration test [P]
   - Each workflow → component implementation task

4. **Ordering**:
   - Setup → Tests → Types → Services → Components → Pages → Integration → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have TypeScript interfaces
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
