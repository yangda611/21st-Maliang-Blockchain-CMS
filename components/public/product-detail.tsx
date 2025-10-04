/**
 * Product Detail Component
 * Detailed view of a single product with features and pricing
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check, Star, Users, Zap, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  specifications?: { zh: string; en: string };
  pricing: { currency: string; amount: number; discountedAmount?: number };
  images: string[];
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      // Mock data for now - in production, fetch based on productId
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockProduct: Product = {
        id: productId,
        name: { zh: '企业版CMS', en: 'Enterprise CMS' },
        description: {
          zh: '专为大型企业设计的全功能内容管理系统，支持多语言内容创作、区块链安全特性和高级权限管理。',
          en: 'Full-featured CMS designed for large enterprises with multi-language support, blockchain security, and advanced permission management.'
        },
        specifications: {
          zh: '• 多语言支持 (6种语言)\n• 区块链内容存证\n• 高级权限管理系统\n• RESTful API 接口\n• Docker 容器化部署\n• 24/7 技术支持',
          en: '• Multi-language support (6 languages)\n• Blockchain content verification\n• Advanced permission management\n• RESTful API interfaces\n• Docker containerization\n• 24/7 technical support'
        },
        pricing: { currency: 'CNY', amount: 9999, discountedAmount: 7999 },
        images: [
          '/images/product-detail-1.jpg',
          '/images/product-detail-2.jpg',
          '/images/product-detail-3.jpg'
        ],
        tags: ['企业', '区块链', '多语言', '高可用'],
        isPublished: true,
        createdAt: new Date().toISOString(),
      };

      setProduct(mockProduct);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-video bg-white/10 rounded-xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-white/40 text-lg mb-4">产品未找到</div>
        <Link href="/products" className="text-white/60 hover:text-white">
          返回产品列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回产品列表
        </Link>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-video bg-white/10 rounded-xl overflow-hidden">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name.zh}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-white'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name.zh} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name.zh}</h1>
            <div className="flex items-center gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-white/80 leading-relaxed">
              {product.description.zh}
            </p>
          </div>

          {/* Pricing */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-4">
              {product.pricing.discountedAmount ? (
                <>
                  <div className="text-3xl font-bold text-white">
                    ¥{product.pricing.discountedAmount.toLocaleString()}
                  </div>
                  <div className="text-xl text-white/60 line-through">
                    ¥{product.pricing.amount.toLocaleString()}
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    优惠中
                  </div>
                </>
              ) : (
                <div className="text-3xl font-bold text-white">
                  ¥{product.pricing.amount.toLocaleString()}
                </div>
              )}
            </div>
            <p className="text-white/60 mt-2">年起</p>
          </div>

          {/* CTA Button */}
          <button className="w-full px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            立即购买
          </button>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">产品特色</h3>
            <div className="grid gap-3">
              {[
                { icon: Shield, text: '区块链安全存证' },
                { icon: Zap, text: '高性能架构' },
                { icon: Users, text: '多语言支持' },
                { icon: Star, text: '企业级功能' },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-white/80">
                  <feature.icon className="h-5 w-5 text-white/60" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">技术规格</h3>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <pre className="text-sm text-white/80 whitespace-pre-line">
                  {product.specifications.zh}
                </pre>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
