/**
 * Product Card Component
 * Individual product display card
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingCart, Tag, Star } from 'lucide-react';
import Image from 'next/image';
import { cardHover } from '@/utils/animations';

interface Product {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  pricing: { currency: string; amount: number };
  images: string[];
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const prefersReduced = useReducedMotion();
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        animate="rest"
        whileHover={prefersReduced ? undefined : "hover"}
        className="p-6 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-all will-change-transform hover:shadow-lg hover:shadow-black/20"
      >
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white/10 rounded-lg overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name.zh}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-white/40" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{product.name.zh}</h3>
                <p className="text-white/60 mb-3 line-clamp-2">
                  {product.description.zh}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">
                  {formatPrice(product.pricing.amount, product.pricing.currency)}
                </div>
                <div className="text-sm text-white/60">起</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-3">
              {product.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Star className="h-4 w-4" />
                <span>已发布</span>
              </div>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      animate="rest"
      whileHover={prefersReduced ? undefined : "hover"}
      className="group p-6 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-all cursor-pointer will-change-transform hover:shadow-lg hover:shadow-black/20"
    >
      {/* Product Image */}
      <div className="aspect-video bg-white/10 rounded-lg overflow-hidden mb-4">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name.zh}
            width={400}
            height={240}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-white/40" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold group-hover:text-white/90 transition-colors">
            {product.name.zh}
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {formatPrice(product.pricing.amount, product.pricing.currency)}
            </div>
            <div className="text-sm text-white/60">起</div>
          </div>
        </div>

        <p className="text-white/60 text-sm line-clamp-2">
          {product.description.zh}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {product.tags.length > 2 && (
            <span className="text-xs text-white/60">
              +{product.tags.length - 2}
            </span>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Star className="h-4 w-4" />
            <span>已发布</span>
          </div>
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-all">
            查看详情
          </button>
        </div>
      </div>
    </motion.div>
  );
}
