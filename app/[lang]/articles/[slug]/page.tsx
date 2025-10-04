import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ArticleDetail from '@/components/public/article-detail';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface ArticleDetailPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  // In a real app, fetch article data based on params.slug and params.lang
  const metadata = {
    zh: {
      title: `文章详情 - Codexia 区块链CMS`,
      description: '查看文章详细信息和技术内容',
    },
    en: {
      title: `Article Details - Codexia Blockchain CMS`,
      description: 'View detailed article information and technical content',
    },
    ja: {
      title: `記事詳細 - CodexiaブロックチェーンCMS`,
      description: '記事の詳細情報と技術コンテンツを表示',
    },
    ko: {
      title: `기사 세부 정보 - Codexia 블록체인 CMS`,
      description: '기사 상세 정보 및 기술 콘텐츠 보기',
    },
    ar: {
      title: `تفاصيل المقالة - Codexia Blockchain CMS`,
      description: 'عرض معلومات المقالة التفصيلية والمحتوى التقني',
    },
    es: {
      title: `Detalles del Artículo - Codexia Blockchain CMS`,
      description: 'Ver información detallada del artículo y contenido técnico',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { lang, slug } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ArticleDetail articleSlug={slug} />
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
