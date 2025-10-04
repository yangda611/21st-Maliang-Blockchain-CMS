/**
 * Articles List Component
 * Displays articles with filtering and pagination with multi-language support
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, Tag } from 'lucide-react';
import ArticleCard from '@/components/public/article-card';

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

interface ArticlesListProps {
  lang?: string;
}

export default function ArticlesList({ lang = 'zh' }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 多语言内容
  const content = {
    zh: {
      pageTitle: '技术文章',
      pageDescription: '分享区块链CMS技术的最新见解和最佳实践',
      searchPlaceholder: '搜索文章...',
      allCategories: '所有分类',
      categories: {
        '区块链': '区块链',
        'CMS': 'CMS',
        '技术': '技术',
        '多语言': '多语言',
        '国际化': '国际化',
      },
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
      categories: {
        '区块链': 'Blockchain',
        'CMS': 'CMS',
        '技术': 'Technology',
        '多语言': 'Multi-language',
        '国际化': 'Internationalization',
      },
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
      categories: {
        '区块链': 'ブロックチェーン',
        'CMS': 'CMS',
        '技术': '技術',
        '多语言': '多言語',
        '国际化': '国際化',
      },
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
      categories: {
        '区块链': '블록체인',
        'CMS': 'CMS',
        '技术': '기술',
        '多语言': '다국어',
        '国际化': '국제화',
      },
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
      categories: {
        '区块链': 'البلوكشين',
        'CMS': 'CMS',
        '技术': 'التكنولوجيا',
        '多语言': 'متعدد اللغات',
        '国际化': 'التدويل',
      },
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
      categories: {
        '区块链': 'Blockchain',
        'CMS': 'CMS',
        '技术': 'Tecnología',
        '多语言': 'Multi-idioma',
        '国际化': 'Internacionalización',
      },
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
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockArticles: Article[] = [
        {
          id: '1',
          title: { zh: '区块链技术在CMS中的应用', en: 'Blockchain Technology in CMS Applications' },
          excerpt: {
            zh: '探索区块链技术如何革新内容管理系统，提高内容的安全性和透明度。',
            en: 'Explore how blockchain technology revolutionizes content management systems.'
          },
          content: { zh: '详细内容...', en: 'Detailed content...' },
          featuredImage: '/images/article1.jpg',
          authorId: 'admin1',
          slug: 'blockchain-cms-application',
          tags: ['区块链', 'CMS', '技术'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: { zh: '多语言内容管理的挑战与解决方案', en: 'Challenges and Solutions in Multi-language Content Management' },
          excerpt: {
            zh: '讨论多语言内容管理中的常见挑战，并提供实用的解决方案。',
            en: 'Discuss common challenges in multi-language content management.'
          },
          content: { zh: '详细内容...', en: 'Detailed content...' },
          featuredImage: '/images/article2.jpg',
          authorId: 'admin2',
          slug: 'multi-language-cms-challenges',
          tags: ['多语言', '国际化', 'CMS'],
          isPublished: true,
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
      ];

      setArticles(mockArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
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
              <option value="区块链">{currentContent.categories['区块链']}</option>
              <option value="CMS">{currentContent.categories['CMS']}</option>
              <option value="技术">{currentContent.categories['技术']}</option>
              <option value="多语言">{currentContent.categories['多语言']}</option>
              <option value="国际化">{currentContent.categories['国际化']}</option>
            </select>
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
