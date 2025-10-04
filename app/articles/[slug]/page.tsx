/**
 * Article Detail Page
 * Detailed view of a single article
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ArticleDetail from '@/components/public/article-detail';
import Footer from '@/components/public/footer';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // In a real app, fetch article data based on params.slug
  return {
    title: `文章详情 - Maliang区块链CMS`,
    description: '查看文章详细信息和技术内容',
  };
}

export default function ArticleDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ArticleDetail articleSlug={params.slug} />
      </main>
      <Footer />
    </div>
  );
}
