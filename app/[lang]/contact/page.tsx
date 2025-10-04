import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ContactSection from '@/components/public/contact-section';
import Footer from '@/components/public/footer';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/middleware';

interface ContactPageProps {
  params: {
    lang: string;
  };
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  const metadata = {
    zh: {
      title: '联系我们 - Codexia 区块链CMS',
      description: '与Maliang团队取得联系，了解我们的区块链CMS解决方案',
    },
    en: {
      title: 'Contact Us - Codexia Blockchain CMS',
      description: 'Get in touch with the Maliang team to learn about our blockchain CMS solutions',
    },
    ja: {
      title: 'お問い合わせ - CodexiaブロックチェーンCMS',
      description: 'Maliangチームに連絡してブロックチェーンCMSソリューションについて学ぶ',
    },
    ko: {
      title: '문의하기 - Codexia 블록체인 CMS',
      description: 'Maliang 팀에 연락하여 블록체인 CMS 솔루션에 대해 알아보기',
    },
    ar: {
      title: 'اتصل بنا - Codexia Blockchain CMS',
      description: 'تواصل مع فريق Maliang لمعرفة حلول CMS البلوكشين لدينا',
    },
    es: {
      title: 'Contáctanos - Codexia Blockchain CMS',
      description: 'Ponte en contacto con el equipo de Maliang para conocer nuestras soluciones CMS blockchain',
    },
  };

  return metadata[lang as keyof typeof metadata] || metadata.en;
}

export default function ContactPage({ params }: ContactPageProps) {
  const { lang } = params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar lang={lang} />
      <main className="pt-16">
        <ContactSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}
