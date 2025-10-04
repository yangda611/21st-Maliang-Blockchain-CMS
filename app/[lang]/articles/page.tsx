import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ArticlesList from '@/components/public/articles-list';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface ArticlesPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  const metadata = {
    zh: {
      title: '文章 - Codexia 区块链CMS',
      description: '探索我们的技术博客和行业洞察文章',
    },
    en: {
      title: 'Articles - Codexia Blockchain CMS',
      description: 'Explore our technical blog and industry insights articles',
    },
    ja: {
      title: '記事 - CodexiaブロックチェーンCMS',
      description: 'テクニカルブログと業界インサイト記事を探求',
    },
    ko: {
      title: '기사 - Codexia 블록체인 CMS',
      description: '기술 블로그와 산업 인사이트 기사 탐색',
    },
    ar: {
      title: 'المقالات - Codexia Blockchain CMS',
      description: 'استكشف مدونتنا التقنية ومقالات رؤى الصناعة',
    },
    es: {
      title: 'Artículos - Codexia Blockchain CMS',
      description: 'Explora nuestro blog técnico y artículos de perspectivas de la industria',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function ArticlesPage({ params }: ArticlesPageProps) {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar lang={lang} />
      <main className="pt-16">
        <ArticlesList lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
