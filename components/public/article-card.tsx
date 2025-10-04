/**
 * Article Card Component
 * Individual article display card
 */

'use client';

import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  featuredImage?: string;
  authorId: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="group p-6 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-all cursor-pointer"
    >
      <Link href={`/articles/${article.slug}`}>
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="aspect-video bg-white/10 rounded-lg overflow-hidden mb-4">
            <Image
              src={article.featuredImage}
              alt={article.title.zh}
              width={400}
              height={240}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="text-xs text-white/60">
                +{article.tags.length - 2}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold group-hover:text-white/90 transition-colors line-clamp-2">
            {article.title.zh}
          </h3>

          {/* Excerpt */}
          <p className="text-white/60 text-sm line-clamp-3">
            {article.excerpt.zh}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>管理员</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/60 group-hover:text-white transition-colors">
              <span className="text-sm">阅读更多</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
