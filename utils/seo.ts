/**
 * SEO Optimization Helpers
 * Utilities for SEO-friendly content generation
 */

import type { MultiLanguageText } from '@/types/content';

/**
 * Generate SEO-friendly slug from text
 * @param text - Input text
 * @returns SEO-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug by appending number if needed
 * @param baseSlug - Base slug
 * @param existingSlugs - Array of existing slugs
 * @returns Unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Validate slug format
 * @param slug - Slug to validate
 * @returns True if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  // Slug should only contain lowercase letters, numbers, and hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

/**
 * Generate meta title with optimal length
 * @param title - Original title
 * @param siteName - Site name to append
 * @param maxLength - Maximum length (default: 60)
 * @returns Optimized meta title
 */
export function generateMetaTitle(
  title: string,
  siteName?: string,
  maxLength: number = 60
): string {
  const separator = ' | ';
  let metaTitle = title;

  if (siteName) {
    const fullTitle = `${title}${separator}${siteName}`;
    if (fullTitle.length <= maxLength) {
      metaTitle = fullTitle;
    } else if (title.length <= maxLength) {
      metaTitle = title;
    } else {
      metaTitle = title.substring(0, maxLength - 3) + '...';
    }
  } else if (title.length > maxLength) {
    metaTitle = title.substring(0, maxLength - 3) + '...';
  }

  return metaTitle;
}

/**
 * Generate meta description with optimal length
 * @param description - Original description
 * @param maxLength - Maximum length (default: 160)
 * @returns Optimized meta description
 */
export function generateMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) {
    return description;
  }

  // Try to cut at last complete sentence
  const truncated = description.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastPeriodEn = truncated.lastIndexOf('.');

  const cutPoint = Math.max(lastPeriod, lastPeriodEn);

  if (cutPoint > maxLength * 0.7) {
    return description.substring(0, cutPoint + 1);
  }

  // Cut at last space
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Extract keywords from text
 * @param text - Input text
 * @param maxKeywords - Maximum number of keywords
 * @returns Array of keywords
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Remove special characters and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3); // Filter short words

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach((word) => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Sort by frequency and return top keywords
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Generate canonical URL
 * @param baseUrl - Base URL of the site
 * @param path - Path of the page
 * @returns Canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
}

/**
 * Generate Open Graph image URL
 * @param imageUrl - Original image URL
 * @param baseUrl - Base URL of the site
 * @returns Absolute OG image URL
 */
export function generateOgImageUrl(imageUrl: string, baseUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = imageUrl.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
}

/**
 * Generate sitemap entry
 * @param url - Page URL
 * @param lastmod - Last modification date
 * @param priority - Priority (0.0 to 1.0)
 * @param changefreq - Change frequency
 * @returns Sitemap entry object
 */
export function generateSitemapEntry(
  url: string,
  lastmod: string,
  priority: number = 0.5,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly'
) {
  return {
    url,
    lastmod: new Date(lastmod).toISOString().split('T')[0],
    priority: Math.max(0, Math.min(1, priority)),
    changefreq,
  };
}

/**
 * Validate meta title length (SEO best practice)
 * @param title - Meta title
 * @returns Validation result
 */
export function validateMetaTitleLength(title: string): {
  valid: boolean;
  length: number;
  message?: string;
} {
  const length = title.length;

  if (length < 30) {
    return { valid: false, length, message: 'Meta title is too short (minimum 30 characters)' };
  }

  if (length > 60) {
    return { valid: false, length, message: 'Meta title is too long (maximum 60 characters)' };
  }

  return { valid: true, length };
}

/**
 * Validate meta description length (SEO best practice)
 * @param description - Meta description
 * @returns Validation result
 */
export function validateMetaDescriptionLength(description: string): {
  valid: boolean;
  length: number;
  message?: string;
} {
  const length = description.length;

  if (length < 50) {
    return {
      valid: false,
      length,
      message: 'Meta description is too short (minimum 50 characters)',
    };
  }

  if (length > 160) {
    return {
      valid: false,
      length,
      message: 'Meta description is too long (maximum 160 characters)',
    };
  }

  return { valid: true, length };
}

/**
 * Generate breadcrumb schema for SEO
 * @param items - Breadcrumb items
 * @returns JSON-LD breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate article schema for SEO
 * @param article - Article data
 * @returns JSON-LD article schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt: string;
  imageUrl?: string;
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    ...(article.imageUrl && {
      image: article.imageUrl,
    }),
  };
}

/**
 * Generate product schema for SEO
 * @param product - Product data
 * @returns JSON-LD product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
}): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
    },
  };
}
