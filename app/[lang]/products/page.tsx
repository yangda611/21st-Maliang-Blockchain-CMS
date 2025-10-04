import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ProductsList from '@/components/public/products-list';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface ProductsPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  const metadata = {
    zh: {
      title: '产品 - Codexia 区块链CMS',
      description: '探索我们的区块链CMS产品系列，支持多语言内容管理',
    },
    en: {
      title: 'Products - Codexia Blockchain CMS',
      description: 'Explore our blockchain CMS product series, supporting multi-language content management',
    },
    ja: {
      title: '製品 - CodexiaブロックチェーンCMS',
      description: 'ブロックチェーンCMS製品シリーズを探索、多言語コンテンツ管理をサポート',
    },
    ko: {
      title: '제품 - Codexia 블록체인 CMS',
      description: '블록체인 CMS 제품 시리즈 탐색, 다국어 콘텐츠 관리 지원',
    },
    ar: {
      title: 'المنتجات - Codexia Blockchain CMS',
      description: 'استكشف سلسلة منتجات CMS البلوكشين لدينا، تدعم إدارة المحتوى متعدد اللغات',
    },
    es: {
      title: 'Productos - Codexia Blockchain CMS',
      description: 'Explora nuestra serie de productos CMS blockchain, compatible con gestión de contenido multilingüe',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function ProductsPage({ params }: ProductsPageProps) {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar lang={lang} />
      <main className="pt-16">
        <ProductsList lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
