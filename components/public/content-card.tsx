/**
 * Content Card Component
 * Reusable card for displaying products, articles, etc.
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContentTranslation } from '@/hooks/use-language';
import { cardHover } from '@/utils/animations';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import type { MultiLanguageText } from '@/types/content';

interface ContentCardProps {
  title: MultiLanguageText;
  description?: MultiLanguageText;
  image?: string;
  href: string;
  tags?: string[];
  date?: string;
  type?: 'product' | 'article' | 'default';
}

export default function ContentCard({
  title,
  description,
  image,
  href,
  tags,
  date,
  type = 'default',
}: ContentCardProps) {
  const { t } = useContentTranslation();

  return (
    <Link href={href}>
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="group h-full bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all"
      >
        {/* Image */}
        {image && (
          <div className="aspect-video bg-white/5 overflow-hidden">
            <img
              src={image}
              alt={t(title)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-medium mb-2 group-hover:text-white/90 transition-colors">
            {t(title)}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-white/60 line-clamp-2 mb-4">
              {t(description)}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between">
            {date && (
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Calendar className="h-3 w-3" />
                <span>{new Date(date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-white/60 group-hover:text-white group-hover:gap-2 transition-all">
              <span>查看详情</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
