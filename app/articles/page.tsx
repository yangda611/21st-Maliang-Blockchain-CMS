/**
 * Articles Listing Page
 * Displays all articles with filtering and search
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ArticlesList from '@/components/public/articles-list';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: '文章 - Maliang区块链CMS',
  description: '探索我们的技术博客和行业洞察文章',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ArticlesList />
      </main>
      <Footer />
    </div>
  );
}
