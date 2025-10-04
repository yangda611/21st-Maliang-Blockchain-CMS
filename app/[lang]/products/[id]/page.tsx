import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ProductDetail from '@/components/public/product-detail';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface ProductDetailPageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  // In a real app, fetch product data based on params.id
  const metadata = {
    zh: {
      title: `产品详情 - Codexia 区块链CMS`,
      description: '查看产品详细信息和功能特性',
    },
    en: {
      title: `Product Details - Codexia Blockchain CMS`,
      description: 'View detailed product information and features',
    },
    ja: {
      title: `製品詳細 - CodexiaブロックチェーンCMS`,
      description: '製品の詳細情報と機能を表示',
    },
    ko: {
      title: `제품 세부 정보 - Codexia 블록체인 CMS`,
      description: '제품 상세 정보 및 기능 보기',
    },
    ar: {
      title: `تفاصيل المنتج - Codexia Blockchain CMS`,
      description: 'عرض معلومات المنتج التفصيلية والميزات',
    },
    es: {
      title: `Detalles del Producto - Codexia Blockchain CMS`,
      description: 'Ver información detallada del producto y características',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { lang, id } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ProductDetail productId={id} />
      </main>
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
