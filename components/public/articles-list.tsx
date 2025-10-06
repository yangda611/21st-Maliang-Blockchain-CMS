/**
 * Articles List Component
 * Displays articles with filtering and pagination with multi-language support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, Tag } from 'lucide-react';
import ArticleCard from '@/components/public/article-card';
import { useCategoriesRealtime } from '@/hooks/use-categories-realtime';

interface Article {
  id: string;
  title: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  content: { zh: string; en: string };
  featuredImage?: string;
  authorId: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
}

interface ContentCategory {
  id: string;
  name: { zh: string; en: string; [key: string]: string };
  description?: { zh: string; en: string; [key: string]: string };
  slug: string;
  content_type: string;
  is_active: boolean;
  display_order: number;
}

interface ArticlesListProps {
  lang?: string;
}

export default function ArticlesList({ lang = 'zh' }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Use real-time categories hook
  const { categories, loading: categoriesLoading } = useCategoriesRealtime('article');

  // 多语言内容
  const content = {
    zh: {
      pageTitle: '技术文章',
      pageDescription: '分享区块链CMS技术的最新见解和最佳实践',
      searchPlaceholder: '搜索文章...',
      allCategories: '所有分类',
      resultsCount: (count: number, search?: string) =>
        `显示 ${count} 篇文章${search ? ` (搜索: "${search}")` : ''}`,
      noResults: '未找到文章',
      noResultsDesc: '请尝试调整搜索条件或浏览其他分类',
      loadingText: '加载中...',
    },
    en: {
      pageTitle: 'Technical Articles',
      pageDescription: 'Sharing the latest insights and best practices in blockchain CMS technology',
      searchPlaceholder: 'Search articles...',
      allCategories: 'All Categories',
      resultsCount: (count: number, search?: string) =>
        `Showing ${count} articles${search ? ` (search: "${search}")` : ''}`,
      noResults: 'No articles found',
      noResultsDesc: 'Please try adjusting your search terms or browse other categories',
      loadingText: 'Loading...',
    },
    ja: {
      pageTitle: '技術記事',
      pageDescription: 'ブロックチェーンCMS技術の最新の洞察とベストプラクティスを共有',
      searchPlaceholder: '記事を検索...',
      allCategories: 'すべてのカテゴリ',
      resultsCount: (count: number, search?: string) =>
        `${count}件の記事を表示${search ? ` (検索: "${search}")` : ''}`,
      noResults: '記事が見つかりません',
      noResultsDesc: '検索条件を調整するか、他のカテゴリを閲覧してください',
      loadingText: '読み込み中...',
    },
    ko: {
      pageTitle: '기술 기사',
      pageDescription: '블록체인 CMS 기술의 최신 통찰력과 모범 사례 공유',
      searchPlaceholder: '기사 검색...',
      allCategories: '모든 카테고리',
      resultsCount: (count: number, search?: string) =>
        `${count}개 기사 표시${search ? ` (검색: "${search}")` : ''}`,
      noResults: '기사를 찾을 수 없습니다',
      noResultsDesc: '검색 조건을 조정하거나 다른 카테고리를 탐색하세요',
      loadingText: '로딩 중...',
    },
    ar: {
      pageTitle: 'المقالات التقنية',
      pageDescription: 'مشاركة أحدث الرؤى وأفضل الممارسات في تقنية CMS البلوكشين',
      searchPlaceholder: 'البحث في المقالات...',
      allCategories: 'جميع الفئات',
      resultsCount: (count: number, search?: string) =>
        `عرض ${count} مقالة${search ? ` (البحث: "${search}")` : ''}`,
      noResults: 'لم يتم العثور على مقالات',
      noResultsDesc: 'يرجى محاولة تعديل مصطلحات البحث أو تصفح فئات أخرى',
      loadingText: 'جارٍ التحميل...',
    },
    es: {
      pageTitle: 'Artículos Técnicos',
      pageDescription: 'Compartiendo las últimas perspectivas y mejores prácticas en tecnología CMS blockchain',
      searchPlaceholder: 'Buscar artículos...',
      allCategories: 'Todas las Categorías',
      resultsCount: (count: number, search?: string) =>
        `Mostrando ${count} artículos${search ? ` (búsqueda: "${search}")` : ''}`,
      noResults: 'No se encontraron artículos',
      noResultsDesc: 'Por favor intenta ajustar los términos de búsqueda o navega otras categorías',
      loadingText: 'Cargando...',
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/articles?published=true&limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      
      const data = await response.json();
      
      if (data.articles && Array.isArray(data.articles)) {
        setArticles(data.articles);
      } else {
        setArticles([]);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' ||
      article.title.zh.includes(searchTerm) ||
      article.title.en.includes(searchTerm) ||
      article.excerpt.zh.includes(searchTerm) ||
      article.excerpt.en.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' ||
      article.tags.includes(selectedCategory);

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
              className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-white/60" />
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-black border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 appearance-none cursor-pointer hover:bg-white/5 transition-colors pr-10"
                disabled={categoriesLoading}
              >
                <option value="all" className="bg-black text-white">
                  {currentContent.allCategories}
                </option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.slug}
                    className="bg-black text-white"
                  >
                    {category.name?.[lang] || category.name?.zh || category.name?.en || category.slug}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {categoriesLoading && (
              <div className="h-4 w-4 animate-spin border border-white/20 border-t-white rounded-full" />
            )}
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
          {currentContent.resultsCount(filteredArticles.length, searchTerm)}
        </p>
      </motion.div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/5 rounded-xl h-48 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
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
