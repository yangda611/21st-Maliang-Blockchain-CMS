/**
 * Article Detail Component
 * Detailed view of a single article with full content
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: { zh: string; en: string };
  content: { zh: string; en: string };
  excerpt: { zh: string; en: string };
  featuredImage?: string;
  authorId: string;
  slug: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
}

interface ArticleDetailProps {
  articleSlug: string;
}

export default function ArticleDetail({ articleSlug }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    loadArticle();
  }, [articleSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadArticle = async () => {
    setLoading(true);
    try {
      // Mock data for now - in production, fetch based on articleSlug
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockArticle: Article = {
        id: '1',
        title: { zh: '区块链技术在CMS中的应用', en: 'Blockchain Technology in CMS Applications' },
        content: {
          zh: `# 区块链技术在CMS中的应用

## 引言

区块链技术作为一种分布式账本技术，正在逐渐改变各个行业的运作方式。在内容管理系统（CMS）领域，区块链技术的引入为内容的安全性、透明性和版权保护提供了全新的解决方案。

## 区块链CMS的优势

### 1. 内容不可篡改

区块链的分布式账本特性确保了内容一旦发布就无法被篡改。每一次内容更新都会被记录在链上，形成完整的内容历史记录。

### 2. 版权保护

通过区块链技术，内容创作者可以为其作品添加数字水印和时间戳，确保版权归属和创作时间的真实性。

### 3. 去中心化存储

传统的CMS依赖于中心化服务器存储内容，而区块链CMS可以将内容分布式存储在网络中的多个节点上，提高系统的抗攻击性和可用性。

## 技术实现

### 智能合约

\`\`\`javascript
// 示例智能合约代码
contract ContentRegistry {
    struct Content {
        string hash;
        address author;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Content) public contents;

    function registerContent(string memory contentHash) public {
        require(!contents[contentHash].exists, "Content already registered");
        contents[contentHash] = Content({
            hash: contentHash,
            author: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
    }
}
\`\`\`

## 未来展望

区块链CMS的发展前景广阔，未来将在以下方面取得更大突破：

- 多链互操作性
- 跨平台内容流通
- AI辅助内容创作
- 更高效的共识机制

## 结论

区块链技术为CMS领域带来了革命性的变革，不仅解决了传统CMS的安全性和信任问题，还为内容生态的可持续发展提供了新的可能性。`,
          en: '# Blockchain Technology in CMS Applications\n\n## Introduction\n\nBlockchain technology, as a distributed ledger technology, is gradually changing the operation of various industries. In the field of Content Management Systems (CMS), the introduction of blockchain technology provides new solutions for content security, transparency, and copyright protection.\n\n## Advantages of Blockchain CMS\n\n### 1. Immutable Content\n\nThe distributed ledger feature of blockchain ensures that content cannot be tampered with once published. Every content update is recorded on the chain, forming a complete content history.\n\n### 2. Copyright Protection\n\nThrough blockchain technology, content creators can add digital watermarks and timestamps to their works to ensure copyright ownership and authenticity of creation time.\n\n## Conclusion\n\nBlockchain technology brings revolutionary changes to the CMS field, not only solving the security and trust issues of traditional CMS, but also providing new possibilities for the sustainable development of the content ecosystem.'
        },
        excerpt: {
          zh: '探索区块链技术如何革新内容管理系统，提高内容的安全性和透明度。',
          en: 'Explore how blockchain technology revolutionizes content management systems.'
        },
        featuredImage: '/images/article-detail.jpg',
        authorId: 'admin1',
        slug: articleSlug,
        tags: ['区块链', 'CMS', '技术', '创新'],
        isPublished: true,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      };

      setArticle(mockArticle);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-white/10 rounded w-1/4"></div>
          <div className="aspect-video bg-white/10 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-white/40 text-lg mb-4">文章未找到</div>
        <Link href="/articles" className="text-white/60 hover:text-white">
          返回文章列表
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-white/60"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            {article.title.zh}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>管理员</span>
            </div>
          </div>
        </motion.header>

        {/* Featured Image */}
        {article.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="aspect-video bg-white/10 rounded-xl overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.title.zh}
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div
            className="text-white/90 leading-relaxed whitespace-pre-line"
            style={{ whiteSpace: 'pre-line' }}
          >
            {article.content.zh}
          </div>
        </motion.article>

        {/* Article Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all">
                <Bookmark className="h-4 w-4" />
                <span>收藏文章</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all">
                <Share2 className="h-4 w-4" />
                <span>分享文章</span>
              </button>
            </div>

            <div className="text-white/60 text-sm">
              阅读进度: {Math.round(readingProgress)}%
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <h3 className="text-2xl font-semibold mb-6">相关文章</h3>
          <div className="text-center text-white/60 py-8">
            <p>暂无相关文章</p>
          </div>
        </motion.section>
      </div>
    </>
  );
}
