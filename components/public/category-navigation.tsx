/**
 * Category Navigation Component
 * Hierarchical category menu for frontend
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useContentTranslation } from '@/hooks/use-language';
import { contentCategoryService } from '@/lib/services/content-category-service';
import type { ContentCategory } from '@/types/content';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { fadeInUp } from '@/utils/animations';

interface CategoryNavigationProps {
  contentType?: 'product' | 'article' | 'page';
  variant?: 'horizontal' | 'vertical';
}

export default function CategoryNavigation({
  contentType = 'product',
  variant = 'horizontal',
}: CategoryNavigationProps) {
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { t } = useContentTranslation();

  useEffect(() => {
    loadCategories();
  }, [contentType]);

  const loadCategories = async () => {
    const result = await contentCategoryService.getTree(contentType);
    if (result.success) {
      setCategories(result.data || []);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderCategory = (category: ContentCategory & { children?: ContentCategory[] }, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between px-4 py-2 hover:bg-white/5 rounded-lg transition-all ${
            level > 0 ? 'ml-4' : ''
          }`}
        >
          <Link
            href={`/categories/${category.slug}`}
            className="flex-1 text-sm text-white/80 hover:text-white"
          >
            {t(category.name)}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-white/10 rounded transition-all"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {category.children!.map((child) => renderCategory(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (variant === 'horizontal') {
    return (
      <nav className="flex items-center gap-1 overflow-x-auto">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg whitespace-nowrap transition-all"
          >
            {t(category.name)}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {categories.map((category) => renderCategory(category))}
    </nav>
  );
}
