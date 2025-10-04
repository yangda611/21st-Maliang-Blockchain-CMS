/**
 * Products List Component
 * Displays products with filtering and pagination with multi-language support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/public/product-card';
import { fadeInUp, staggerContainer } from '@/utils/animations';

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

interface ProductsListProps {
  lang?: string;
}

export default function ProductsList({ lang = 'zh' }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 多语言内容
  const content = {
    zh: {
      pageTitle: '我们的产品',
      pageDescription: '探索功能强大、易于使用的区块链CMS解决方案',
      searchPlaceholder: '搜索产品...',
      allCategories: '所有分类',
      categories: {
        '企业': '企业版',
        '中小企业': '中小企业',
        '区块链': '区块链',
        '多语言': '多语言',
      },
      resultsCount: (count: number, search?: string) =>
        `显示 ${count} 个产品${search ? ` (搜索: "${search}")` : ''}`,
      noResults: '未找到产品',
      noResultsDesc: '请尝试调整搜索条件或浏览其他分类',
      loadingText: '加载中...',
    },
    en: {
      pageTitle: 'Our Products',
      pageDescription: 'Explore powerful and easy-to-use blockchain CMS solutions',
      searchPlaceholder: 'Search products...',
      allCategories: 'All Categories',
      categories: {
        '企业': 'Enterprise',
        '中小企业': 'SME',
        '区块链': 'Blockchain',
        '多语言': 'Multi-language',
      },
      resultsCount: (count: number, search?: string) =>
        `Showing ${count} products${search ? ` (search: "${search}")` : ''}`,
      noResults: 'No products found',
      noResultsDesc: 'Please try adjusting your search terms or browse other categories',
      loadingText: 'Loading...',
    },
    ja: {
      pageTitle: '製品',
      pageDescription: '強力で使いやすいブロックチェーンCMSソリューションを探求',
      searchPlaceholder: '製品を検索...',
      allCategories: 'すべてのカテゴリ',
      categories: {
        '企业': 'エンタープライズ',
        '中小企业': '中小企業',
        '区块链': 'ブロックチェーン',
        '多语言': '多言語',
      },
      resultsCount: (count: number, search?: string) =>
        `${count}個の製品を表示${search ? ` (検索: "${search}")` : ''}`,
      noResults: '製品が見つかりません',
      noResultsDesc: '検索条件を調整するか、他のカテゴリを閲覧してください',
      loadingText: '読み込み中...',
    },
    ko: {
      pageTitle: '제품',
      pageDescription: '강력하고 사용하기 쉬운 블록체인 CMS 솔루션 탐색',
      searchPlaceholder: '제품 검색...',
      allCategories: '모든 카테고리',
      categories: {
        '企业': '기업',
        '中小企业': '중소기업',
        '区块链': '블록체인',
        '多语言': '다국어',
      },
      resultsCount: (count: number, search?: string) =>
        `${count}개 제품 표시${search ? ` (검색: "${search}")` : ''}`,
      noResults: '제품을 찾을 수 없습니다',
      noResultsDesc: '검색 조건을 조정하거나 다른 카테고리를 탐색하세요',
      loadingText: '로딩 중...',
    },
    ar: {
      pageTitle: 'منتجاتنا',
      pageDescription: 'استكشف حلول CMS البلوكشين القوية والسهلة الاستخدام',
      searchPlaceholder: 'البحث في المنتجات...',
      allCategories: 'جميع الفئات',
      categories: {
        '企业': 'المؤسسي',
        '中小企业': 'المؤسسات الصغيرة والمتوسطة',
        '区块链': 'البلوكشين',
        '多语言': 'متعدد اللغات',
      },
      resultsCount: (count: number, search?: string) =>
        `عرض ${count} منتج${search ? ` (البحث: "${search}")` : ''}`,
      noResults: 'لم يتم العثور على منتجات',
      noResultsDesc: 'يرجى محاولة تعديل مصطلحات البحث أو تصفح فئات أخرى',
      loadingText: 'جارٍ التحميل...',
    },
    es: {
      pageTitle: 'Nuestros Productos',
      pageDescription: 'Explora soluciones CMS blockchain poderosas y fáciles de usar',
      searchPlaceholder: 'Buscar productos...',
      allCategories: 'Todas las Categorías',
      categories: {
        '企业': 'Empresarial',
        '中小企业': 'PYME',
        '区块链': 'Blockchain',
        '多语言': 'Multi-idioma',
      },
      resultsCount: (count: number, search?: string) =>
        `Mostrando ${count} productos${search ? ` (búsqueda: "${search}")` : ''}`,
      noResults: 'No se encontraron productos',
      noResultsDesc: 'Por favor intenta ajustar los términos de búsqueda o navega otras categorías',
      loadingText: 'Cargando...',
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockProducts: Product[] = [
        {
          id: '1',
          name: { zh: '企业版CMS', en: 'Enterprise CMS' },
          description: {
            zh: '专为大型企业设计的全功能内容管理系统',
            en: 'Full-featured CMS designed for large enterprises'
          },
          pricing: { currency: 'CNY', amount: 9999 },
          images: ['/images/product1.jpg'],
          tags: ['企业', '区块链', '多语言'],
          isPublished: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: { zh: '专业版CMS', en: 'Professional CMS' },
          description: {
            zh: '适合中小企业的高性价比内容管理解决方案',
            en: 'Cost-effective CMS solution for SMEs'
          },
          pricing: { currency: 'CNY', amount: 2999 },
          images: ['/images/product2.jpg'],
          tags: ['中小企业', '高性价比'],
          isPublished: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' ||
      product.name.zh.includes(searchTerm) ||
      product.name.en.includes(searchTerm) ||
      product.description.zh.includes(searchTerm) ||
      product.description.en.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' ||
      product.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {currentContent.pageTitle}
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-3xl mx-auto">
          {currentContent.pageDescription}
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder={currentContent.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/60" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
            >
              <option value="all">{currentContent.allCategories}</option>
              <option value="企业">{currentContent.categories['企业']}</option>
              <option value="中小企业">{currentContent.categories['中小企业']}</option>
              <option value="区块链">{currentContent.categories['区块链']}</option>
              <option value="多语言">{currentContent.categories['多语言']}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-white/10 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/60'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/60'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <p className="text-white/60">
          {currentContent.resultsCount(filteredProducts.length, searchTerm)}
        </p>
      </motion.div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/5 rounded-xl h-64 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={viewMode === 'grid'
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-6"
          }
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <ProductCard product={product} viewMode={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-white/40 text-lg mb-4">{currentContent.noResults}</div>
          <p className="text-white/60">
            {currentContent.noResultsDesc}
          </p>
        </motion.div>
      )}
    </div>
  );
}
