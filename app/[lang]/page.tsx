import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import HeroSection from '@/components/public/hero-section';
import PainPointsSection from '@/components/public/sections/pain-points';
import SolutionSection from '@/components/public/sections/solution';
import BenefitsSection from '@/components/public/sections/benefits';
import FinalCTASection from '@/components/public/sections/final-cta';
import Footer from '@/components/public/footer';
import { WorldMapDemo } from '@/components/ui/map-demo';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface HomePageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  const metadata = {
    zh: {
      title: 'Codexia 区块链CMS - 专业的内容管理系统',
      description: '基于区块链技术的现代化内容管理系统，支持多语言、暗黑科技风格设计',
      keywords: '区块链,CMS,内容管理,暗黑科技,Codexia',
    },
    en: {
      title: 'Codexia Blockchain CMS - Professional Content Management System',
      description: 'Modern content management system based on blockchain technology, supporting multi-language and dark sci-fi design',
      keywords: 'blockchain,CMS,content management,dark sci-fi,Codexia',
    },
    ja: {
      title: 'CodexiaブロックチェーンCMS - プロフェッショナルコンテンツ管理システム',
      description: 'ブロックチェーン技術に基づく現代的なコンテンツ管理システム、多言語とダークSFスタイルデザインをサポート',
      keywords: 'ブロックチェーン,CMS,コンテンツ管理,ダークSF,Codexia',
    },
    ko: {
      title: 'Codexia 블록체인 CMS - 전문 콘텐츠 관리 시스템',
      description: '블록체인 기술 기반의 현대적인 콘텐츠 관리 시스템, 다국어 및 다크 SF 스타일 디자인 지원',
      keywords: '블록체인,CMS,콘텐츠 관리,다크 SF,Codexia',
    },
    ar: {
      title: 'Codexia Blockchain CMS - نظام إدارة المحتوى المهني',
      description: 'نظام إدارة محتوى حديث مبني على تقنية البلوكشين، يدعم متعدد اللغات وتصميم الخيال العلمي المظلم',
      keywords: 'البلوكشين,CMS,إدارة المحتوى,الخيال العلمي المظلم,Codexia',
    },
    es: {
      title: 'Codexia Blockchain CMS - Sistema Profesional de Gestión de Contenido',
      description: 'Sistema moderno de gestión de contenido basado en tecnología blockchain, compatible con múltiples idiomas y diseño oscuro de ciencia ficción',
      keywords: 'blockchain,CMS,gestión de contenido,ciencia ficción oscura,Codexia',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function HomePage({ params }: HomePageProps) {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black mobile-overflow-hidden">
      <Navbar lang={lang} />
      <main className="pt-14 sm:pt-16">
        <HeroSection lang={lang} />
        <PainPointsSection
          lang={lang}
          imageMap={{
            counterfeits: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/counterfeits.png', alt: '假货横行 - 新品刚上，山寨比你卖得还快？' },
            arbitrage: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/arbitrage.png', alt: '窜货扰价 - 市场价格被打乱，优秀经销商怨声载道？' },
            trust: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/trust.png', alt: '信任缺失 - 客户反复询问真假，品牌忠诚度一降再降？' },
            whackamole: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/whackamole.png', alt: '打假无力 - 投入巨大，却像打地鼠一样，永远打不完？' },
          }}
        />
        <SolutionSection lang={lang} />
        <BenefitsSection lang={lang} />
        <WorldMapDemo lang={lang} />
        <FinalCTASection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
