import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import AboutSection from '@/components/public/about-section';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface AboutPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  const metadata = {
    zh: {
      title: '关于我们 - Codexia 区块链CMS',
      description: '了解Maliang团队的故事、使命和愿景',
    },
    en: {
      title: 'About Us - Codexia Blockchain CMS',
      description: 'Learn about the story, mission and vision of the Maliang team',
    },
    ja: {
      title: '私たちについて - CodexiaブロックチェーンCMS',
      description: 'Maliangチームのストーリー、使命、ビジョンについて学ぶ',
    },
    ko: {
      title: '회사 소개 - Codexia 블록체인 CMS',
      description: 'Maliang 팀의 이야기, 사명 및 비전에 대해 알아보기',
    },
    ar: {
      title: 'معلومات عنا - Codexia Blockchain CMS',
      description: 'تعرف على قصة ومهمة ورؤية فريق Maliang',
    },
    es: {
      title: 'Acerca de Nosotros - Codexia Blockchain CMS',
      description: 'Conoce la historia, misión y visión del equipo de Maliang',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function AboutPage({ params }: AboutPageProps) {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar lang={lang} />
      <main className="pt-16">
        <AboutSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
