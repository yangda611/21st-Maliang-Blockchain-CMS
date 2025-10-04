# Maliang CMS Technical Documentation

## System Architecture

### Overview

Maliang CMS is a modern, blockchain-based content management system built with Next.js 14, TypeScript, and Supabase. The system supports multi-language content, advanced caching, and comprehensive admin functionality.

### Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │    Supabase     │    │   Blockchain    │
│   (Frontend)    │◄──►│   (Backend)     │    │    (Arweave)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   PostgreSQL    │    │  IPFS/Arweave   │
│   (React/TSX)   │    │   Database      │    │   Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Context + Hooks
- **Internationalization**: Custom implementation
- **Testing**: Jest + Testing Library

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes
- **Caching**: Multi-layer (Memory + Redis-ready)

### Blockchain Integration
- **Content Hashing**: SHA-256 for integrity
- **Decentralized Storage**: Arweave integration
- **Smart Contracts**: Ethereum (planned)

## Database Schema

### Core Tables

#### `admin_users`
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role admin_role DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

#### `content_categories`
```sql
CREATE TABLE content_categories (
  id UUID PRIMARY KEY,
  name JSONB NOT NULL,
  slug VARCHAR(255) UNIQUE,
  parent_id UUID REFERENCES content_categories(id),
  content_type content_type,
  display_order INTEGER,
  is_active BOOLEAN
);
```

#### `products` / `articles`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES content_categories(id),
  name JSONB NOT NULL,
  description JSONB,
  pricing JSONB,
  images TEXT[],
  slug VARCHAR(255) UNIQUE,
  is_published BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

## Multi-Language Implementation

### Translation Structure

All translatable content uses JSONB fields:

```json
{
  "zh": "中文内容",
  "en": "English content",
  "ja": "日本語内容",
  "ko": "한국어 내용",
  "ar": "المحتوى العربي",
  "es": "Contenido en español"
}
```

### Translation Files

Static translations stored in `/public/locales/`:
- `zh.json` - Chinese (Simplified)
- `en.json` - English
- `ja.json` - Japanese
- `ko.json` - Korean
- `ar.json` - Arabic
- `es.json` - Spanish

### Language Detection

1. **URL Path**: `/zh/products` → Chinese
2. **Cookie**: `maliang-language=zh`
3. **Accept-Language Header**: Browser preference
4. **Default**: Chinese (`zh`)

## Authentication & Authorization

### Admin Roles

```typescript
enum AdminRole {
  TRANSLATOR = 'translator',    // Can translate content
  EDITOR = 'editor',           // Can edit content
  ADMIN = 'admin',             // Full content management
  SUPER_ADMIN = 'super_admin'  // System administration
}
```

### JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "admin@example.com",
  "role": "admin",
  "exp": 1640995200,
  "iat": 1640991600
}
```

## API Architecture

### Route Structure

```
app/api/
├── auth/
│   ├── login/route.ts
│   └── me/route.ts
├── products/
│   ├── route.ts (GET, POST)
│   └── [id]/route.ts (GET, PUT, DELETE)
├── articles/
│   ├── route.ts (GET, POST)
│   └── [slug]/route.ts (GET)
├── categories/route.ts (GET, POST)
├── messages/route.ts (GET, POST)
└── banners/route.ts (GET, POST)
```

### Middleware Stack

1. **CORS** - Cross-origin requests
2. **Rate Limiting** - Request throttling
3. **Authentication** - JWT validation
4. **Authorization** - Role checking
5. **Input Validation** - Schema validation
6. **Caching** - Response caching

## Caching Strategy

### Multi-Layer Caching

1. **Memory Cache** (In-process)
   - Fastest access
   - Per-instance storage
   - TTL-based expiration

2. **Redis Cache** (Distributed)
   - Cross-instance sharing
   - Persistent storage
   - Advanced features (tags, patterns)

3. **CDN Cache** (Edge)
   - Global distribution
   - Static asset optimization
   - Geographic routing

### Cache Keys

```typescript
// Product list with filters
`products:list:${category}:${published}:${limit}:${offset}`

// Single product
`product:${id}`

// Article with slug
`article:${slug}`

// Category tree
`categories:${contentType}`
```

## File Storage

### Supabase Storage Buckets

- **`cms-files`**: Public bucket for images and assets
- **`private-files`**: Private bucket for sensitive documents

### File Organization

```
cms-files/
├── images/
│   ├── products/{product-id}/
│   ├── articles/{article-id}/
│   ├── banners/
│   └── team/
└── uploads/
    └── temp/
```

### Image Optimization

- **Formats**: WebP, AVIF (with fallbacks)
- **Sizes**: Responsive breakpoints
- **Compression**: Optimized for web delivery
- **CDN**: Global distribution

## Deployment Architecture

### Production Setup

```
┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Supabase      │
│   (Frontend)    │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   Redis         │
│   (CDN/Edge)    │    │   (Cache)       │
└─────────────────┘    └─────────────────┘
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Blockchain
ARWEAVE_WALLET_KEY=your-arweave-key
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/xxx

# Redis
REDIS_URL=redis://localhost:6379

# App Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Performance Optimization

### Frontend Performance

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Tree Shaking**: Unused code elimination

### Database Optimization

- **Indexes**: Optimized for common queries
- **Query Optimization**: Efficient data fetching
- **Connection Pooling**: Supabase handles pooling
- **Read Replicas**: For heavy read loads

### Caching Strategy

- **Static Generation**: ISR for dynamic content
- **CDN**: Global asset distribution
- **Database Query Cache**: Query result caching
- **API Response Cache**: Response-level caching

## Security Measures

### Authentication Security

- **JWT Tokens**: Short-lived with refresh capability
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Session Management**: Secure token storage

### Content Security

- **Input Sanitization**: XSS prevention
- **SQL Injection Protection**: Parameterized queries
- **File Upload Security**: Type and size validation
- **Content Validation**: Schema-based validation

### Infrastructure Security

- **HTTPS Only**: SSL/TLS encryption
- **CORS Configuration**: Controlled cross-origin access
- **Environment Separation**: Dev/staging/prod isolation
- **Secret Management**: Secure credential storage

## Monitoring & Analytics

### Application Monitoring

- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Web Vitals
- **Database Monitoring**: Supabase metrics
- **Custom Metrics**: Business-specific KPIs

### Logging Strategy

```typescript
// Structured logging
logger.info('User action', {
  userId: user.id,
  action: 'product_view',
  productId: product.id,
  timestamp: new Date().toISOString()
});
```

## Development Workflow

### Code Organization

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── maliang-admin/     # Admin pages
│   └── [lang]/           # Public pages with i18n
├── components/            # React components
│   ├── admin/            # Admin-only components
│   ├── public/           # Public components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Database client
│   └── auth-middleware.ts # Auth utilities
├── types/                # TypeScript definitions
├── utils/                # Helper functions
└── hooks/                # Custom React hooks
```

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate types from schema
npm run db:seed         # Seed database
npm run db:migrate      # Run migrations

# Testing
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report

# Linting
npm run lint            # ESLint
npm run type-check      # TypeScript check
npm run format          # Prettier formatting
```

## Troubleshooting

### Common Issues

#### Database Connection Issues

```typescript
// Check connection health
const { data, error } = await supabase
  .from('admin_users')
  .select('count')
  .limit(1);
```

#### Authentication Problems

- Verify JWT token format
- Check token expiration
- Validate user permissions

#### Translation Loading Issues

- Check network requests to `/locales/`
- Verify JSON syntax
- Fallback to default language

#### Performance Issues

- Check cache hit rates
- Monitor database query performance
- Verify CDN configuration

## API Integration Examples

### REST API Usage

```typescript
// Fetch products
const response = await fetch('/api/products?published=true&limit=20');
const { products } = await response.json();

// Create product
const newProduct = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productData)
});
```

### SDK Integration

```typescript
import { MaliangCMS } from '@maliang/cms-sdk';

const cms = new MaliangCMS({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  token: userToken
});

const products = await cms.products.list({ published: true });
```

## Future Enhancements

### Planned Features

1. **AI-Powered Translation**: Automatic translation suggestions
2. **Advanced Analytics**: Content performance metrics
3. **Workflow Automation**: Approval workflows
4. **Mobile App**: React Native companion app
5. **API Rate Limiting**: Advanced throttling strategies

### Scalability Improvements

1. **Microservices Architecture**: Service separation
2. **Multi-Region Deployment**: Global distribution
3. **Advanced Caching**: Redis cluster setup
4. **Load Balancing**: Traffic distribution
5. **Database Sharding**: Horizontal scaling

## Support & Maintenance

### Regular Maintenance Tasks

- **Database Backups**: Daily automated backups
- **Security Updates**: Dependency updates
- **Performance Monitoring**: Regular audits
- **Content Cleanup**: Orphaned asset removal

### Support Channels

- **Documentation**: https://docs.maliang.com
- **Community Forum**: https://forum.maliang.com
- **Email Support**: support@maliang.com
- **Status Page**: https://status.maliang.com

---

*This documentation is automatically generated and kept up-to-date with the codebase. Last updated: 2025-01-XX*
