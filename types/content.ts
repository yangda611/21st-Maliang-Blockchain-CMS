// Content Model Interfaces for CMS

export type SupportedLanguage = 'zh' | 'en' | 'ja' | 'ko' | 'ar' | 'es';

export type MultiLanguageText = {
  [K in SupportedLanguage]?: string;
};

export type TranslationStatus = 'draft' | 'pending_review' | 'published';

export type ContentType = 'product' | 'article' | 'page';

// 与数据库 schema 中的 message_type 保持一致
// schema: CREATE TYPE message_type AS ENUM ('contact', 'product_inquiry', 'support', 'other');
export type MessageType = 'contact' | 'product_inquiry' | 'support' | 'other';

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'translator';

// Content Category
export interface ContentCategory {
  id: string;
  name: MultiLanguageText;
  description?: MultiLanguageText;
  slug: string;
  parentId?: string;
  hierarchyLevel: number;
  contentType: ContentType;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  id: string;
  categoryId: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  specifications?: MultiLanguageText;
  pricing?: {
    currency: string;
    amount: number;
    discountedAmount?: number;
  };
  images: string[];
  slug: string;
  tags: string[];
  translationStatus: TranslationStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Article
export interface Article {
  id: string;
  categoryId: string;
  title: MultiLanguageText;
  content: MultiLanguageText;
  excerpt?: MultiLanguageText;
  featuredImage?: string;
  authorId: string;
  slug: string;
  tags: string[];
  translationStatus: TranslationStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Static Page
export interface StaticPage {
  id: string;
  title: MultiLanguageText;
  content: MultiLanguageText;
  slug: string;
  metaTitle?: MultiLanguageText;
  metaDescription?: MultiLanguageText;
  translationStatus: TranslationStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Job Posting
export interface JobPosting {
  id: string;
  title: MultiLanguageText;
  description: MultiLanguageText;
  requirements: MultiLanguageText;
  location?: MultiLanguageText;
  employmentType: string;
  applicationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Visitor Message
export interface VisitorMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  messageType: MessageType;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

// Content Tag
export interface ContentTag {
  id: string;
  name: MultiLanguageText;
  slug: string;
  usageCount: number;
  createdAt: string;
}

// Banner/Slideshow
export interface Banner {
  id: string;
  title: MultiLanguageText;
  imageDesktop: string;
  imageMobile: string;
  linkUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// SEO Configuration
export interface SEOConfiguration {
  id: string;
  pageType: string;
  pageId?: string;
  metaTitle: MultiLanguageText;
  metaDescription: MultiLanguageText;
  metaKeywords: MultiLanguageText;
  ogImage?: string;
  canonicalUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Admin User
export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Translation Workflow
export interface TranslationWorkflow {
  contentId: string;
  contentType: ContentType;
  language: SupportedLanguage;
  status: TranslationStatus;
  translatorId?: string;
  reviewerId?: string;
  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;
  notes?: string;
}

// Translation Workflow State Machine
export const TranslationWorkflowStates = {
  draft: {
    canTransitionTo: ['pending_review'],
    requiredFields: ['contentId', 'contentType', 'language'],
  },
  pending_review: {
    canTransitionTo: ['draft', 'published'],
    requiredFields: ['translatorId', 'submittedAt'],
  },
  published: {
    canTransitionTo: ['draft'],
    requiredFields: ['reviewerId', 'reviewedAt', 'publishedAt'],
  },
} as const;

// Translation Progress Tracking
export interface TranslationProgress {
  contentId: string;
  contentType: ContentType;
  totalLanguages: number;
  completedLanguages: SupportedLanguage[];
  pendingLanguages: SupportedLanguage[];
  completionPercentage: number;
}

// Translation Review Request
export interface TranslationReviewRequest {
  contentId: string;
  contentType: ContentType;
  language: SupportedLanguage;
  translatorId: string;
  notes?: string;
  submittedAt: string;
}

// Translation Approval
export interface TranslationApproval {
  contentId: string;
  contentType: ContentType;
  language: SupportedLanguage;
  reviewerId: string;
  approved: boolean;
  feedback?: string;
  reviewedAt: string;
}

// Language Settings
export interface LanguageSettings {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
  direction: 'ltr' | 'rtl';
}

// Content with Category
export interface ContentWithCategory<T> {
  content: T;
  category: ContentCategory;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Response
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
