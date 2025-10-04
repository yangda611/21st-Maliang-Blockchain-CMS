# Maliang CMS API Documentation

## Overview

Maliang CMS provides a comprehensive REST API for managing blockchain-based content. All API endpoints require authentication for admin operations and support multi-language content.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most admin endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Getting an Auth Token

1. Login via `/api/auth/login` (POST)
2. Receive JWT token in response
3. Include token in subsequent requests

## Response Format

All API responses follow this structure:

```json
{
  "data": { ... },     // Response data
  "error": null,       // Error message (null if success)
  "message": "Success"  // Human-readable message
}
```

## Error Codes

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

---

## Products API

### Get Products

**GET** `/api/products`

Query parameters:
- `category` (string): Filter by category ID
- `published` (boolean): Filter by publication status
- `search` (string): Search in name and description
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": { "zh": "产品名称", "en": "Product Name" },
      "description": { "zh": "描述", "en": "Description" },
      "pricing": { "currency": "CNY", "amount": 100 },
      "images": ["image1.jpg"],
      "tags": ["tag1", "tag2"],
      "is_published": true,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Get Product by ID

**GET** `/api/products/{id}`

**Response:** Single product object (see above)

### Create Product

**POST** `/api/products`

**Body:**
```json
{
  "name": { "zh": "产品名称", "en": "Product Name" },
  "description": { "zh": "描述", "en": "Description" },
  "categoryId": "category-uuid",
  "slug": "product-slug",
  "pricing": { "currency": "CNY", "amount": 100 },
  "images": ["image1.jpg"],
  "tags": ["tag1", "tag2"],
  "isPublished": false
}
```

**Required fields:** `name`, `description`, `categoryId`, `slug`

### Update Product

**PUT** `/api/products/{id}`

**Body:** Same as create, with fields to update

### Delete Product

**DELETE** `/api/products/{id}`

---

## Articles API

### Get Articles

**GET** `/api/articles`

Query parameters:
- `category` (string): Filter by category ID
- `published` (boolean): Filter by publication status
- `search` (string): Search in title and excerpt
- `author` (string): Filter by author ID
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

### Get Article by Slug

**GET** `/api/articles/{slug}`

### Create Article

**POST** `/api/articles`

**Body:**
```json
{
  "title": { "zh": "文章标题", "en": "Article Title" },
  "content": { "zh": "文章内容", "en": "Article content" },
  "excerpt": { "zh": "摘要", "en": "Excerpt" },
  "categoryId": "category-uuid",
  "authorId": "author-uuid",
  "slug": "article-slug",
  "featuredImage": "image.jpg",
  "tags": ["tag1", "tag2"],
  "isPublished": false
}
```

### Update Article

**PUT** `/api/articles/{id}`

### Delete Article

**DELETE** `/api/articles/{id}`

---

## Categories API

### Get Categories

**GET** `/api/categories`

Query parameters:
- `contentType` (string): Filter by content type (product/article)
- `parent` (string): Get child categories of parent
- `active` (boolean): Filter by active status

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": { "zh": "分类名称", "en": "Category Name" },
      "slug": "category-slug",
      "parent_id": "parent-uuid",
      "content_type": "product",
      "is_active": true,
      "children": [...]
    }
  ]
}
```

### Create Category

**POST** `/api/categories`

**Body:**
```json
{
  "name": { "zh": "分类名称", "en": "Category Name" },
  "description": { "zh": "描述", "en": "Description" },
  "slug": "category-slug",
  "parentId": "parent-uuid",
  "contentType": "product",
  "displayOrder": 0,
  "isActive": true
}
```

---

## Messages API

### Get Messages

**GET** `/api/messages`

Query parameters:
- `unread` (boolean): Filter by read status
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

### Send Message

**POST** `/api/messages`

**Body:**
```json
{
  "name": "访客姓名",
  "email": "visitor@example.com",
  "phone": "13800138000",
  "message": "留言内容",
  "messageType": "contact",
  "relatedId": "related-content-id"
}
```

---

## Banners API

### Get Banners

**GET** `/api/banners`

Query parameters:
- `active` (boolean): Filter by active status

**Response:**
```json
{
  "banners": [
    {
      "id": "uuid",
      "title": { "zh": "横幅标题", "en": "Banner Title" },
      "image_desktop": "desktop-image.jpg",
      "image_mobile": "mobile-image.jpg",
      "link_url": "https://example.com",
      "display_order": 0,
      "is_active": true
    }
  ]
}
```

### Create Banner

**POST** `/api/banners`

**Body:**
```json
{
  "title": { "zh": "横幅标题", "en": "Banner Title" },
  "imageDesktop": "desktop-image.jpg",
  "imageMobile": "mobile-image.jpg",
  "linkUrl": "https://example.com",
  "displayOrder": 0,
  "isActive": true
}
```

---

## Authentication API

### Admin Login

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id": "uuid", "email": "admin@example.com" },
  "token": "jwt-token-here",
  "expires_at": "2025-01-01T00:00:00Z"
}
```

### Get Current User

**GET** `/api/auth/me`

**Headers:** `Authorization: Bearer <token>`

---

## Language Support

All content endpoints support multi-language JSONB fields:

```json
{
  "name": {
    "zh": "中文名称",
    "en": "English Name",
    "ja": "日本語名",
    "ko": "한국어 이름",
    "ar": "الاسم العربي",
    "es": "Nombre en Español"
  }
}
```

## Rate Limiting

API endpoints are rate-limited:
- 100 requests per hour per IP
- 1000 requests per hour for authenticated users

## Caching

Responses include cache headers:
- Public content: 5 minutes cache
- Private admin data: No cache
- Static assets: 1 year cache

## File Upload

**POST** `/api/upload`

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Body:**
- `file`: File to upload
- `type`: File type (image, document, etc.)

**Response:**
```json
{
  "url": "https://storage.example.com/path/to/file.jpg",
  "path": "uploads/file.jpg"
}
```

## Webhooks

Configure webhooks for content events:

**POST** `/api/webhooks`

**Body:**
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["product.created", "article.published"],
  "secret": "your-webhook-secret"
}
```

---

## SDK Usage Examples

### JavaScript/TypeScript

```javascript
import { MaliangCMS } from '@maliang/cms-sdk';

// Initialize client
const cms = new MaliangCMS({
  baseURL: 'https://your-domain.com/api',
  token: 'your-jwt-token'
});

// Get products
const products = await cms.products.list({
  category: 'tech',
  published: true
});

// Create product
const newProduct = await cms.products.create({
  name: { zh: '新产品' },
  description: { zh: '产品描述' },
  categoryId: 'category-id',
  slug: 'new-product'
});
```

### Python

```python
from maliang_cms import MaliangCMS

cms = MaliangCMS(base_url="https://your-domain.com/api", token="your-token")

# Get articles
articles = cms.articles.list(published=True, limit=10)

# Create article
article = cms.articles.create(
    title={"en": "New Article", "zh": "新文章"},
    content={"en": "Content...", "zh": "内容..."},
    category_id="category-id",
    author_id="author-id",
    slug="new-article"
)
```

## Support

For API issues or questions:
- Email: api-support@maliang.com
- Documentation: https://docs.maliang.com/api
- Status: https://status.maliang.com
