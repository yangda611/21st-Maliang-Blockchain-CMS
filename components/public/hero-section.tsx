/**
 * Hero Section Component
 * Main hero section for the homepage with multi-language support
 */

'use client';

import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, QrCode, Fingerprint } from 'lucide-react';
import { HeroBackground, PoweringBrands } from '@/components/ui/hero-section-5';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  lang?: string;
}

export default function HeroSection({ lang = 'zh' }: HeroSectionProps) {
  // 多语言内容
  const content = {
    zh: {
      title: 'Codexia',
      subtitle: '你的品牌值多少钱？别让假货给你定了价！',
      description: '信任不是你吹出来的，是拿技术刻出来的。把信任刻在链上，把价值刻进用户心里。',
    },
    en: {
      title: 'Codexia',
      subtitle: "How much is your brand worth? Don't let counterfeiters set the price for you!",
      description: "Trust isn't built on words; it's forged by technology. We etch trust onto the blockchain and embed value into the hearts of users",
    },
    ja: {
      title: 'Codexia',
      subtitle: 'あなたのブランド価値はいくらですか？偽造品にその価値を決めさせてはいけません！',
      description: '信頼は言葉で語るものではなく、技術で刻むものです。信頼をチェーンに刻み、価値をユーザーの心に刻み込む。',
    },
    ko: {
      title: 'Codexia',
      subtitle: '당신의 브랜드 가치는 얼마입니까? 위조품이 당신의 가격을 정하게 두지 마세요!',
      description: '신뢰는 말로 쌓는 것이 아니라, 기술로 새기는 것입니다. 신뢰를 블록체인에 새기고, 가치를 사용자의 마음에 새깁니다.',
    },
    ar: {
      title: 'Codexia',
      subtitle: 'هل تعرف قيمة علامتك التجارية؟ لا تدع المخادع يحدد سعرك!',
      description: 'الثقة لا تُبنى على الأقوال، بل تُنقَش بالتقنية. ننقش الثقة على البلوك تشين، ونغرس القيمة في قلوب المستخدمين.',
    },
    es: {
      title: 'Codexia',
      subtitle: '¿Cuánto vale tu marca? No dejes que los falsificados te den el precio!',
      description: 'La confianza no se pregona, se labra con tecnología. Grabamos la confianza en la cadena de bloques y forjamos el valor en el corazón de los usuarios.',
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  // 容器 ref（可用于后续滚动交互）
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  // 拆分文字的动效
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, when: 'beforeChildren' },
    },
  } as const;

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  const SplitText = ({ text, className = '' }: { text: string; className?: string }) => {
    if (prefersReduced) {
      return <span className={className}>{text}</span>;
    }
    return (
      <motion.span
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {text.split('').map((char, i) => (
          <motion.span key={`${char}-${i}`} variants={letterVariants} className="inline-block">
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  };

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
        <HeroBackground className="h-full w-full">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-52 sm:pt-60 lg:pt-72 xl:pt-80 pb-28 lg:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-10 sm:space-y-12"
        >
          {/* Main Heading - 拆分文字进入 */}
          <div className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.25]">
            <SplitText
              text={currentContent.title}
              className="block bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-5"
            />
            <SplitText
              text={currentContent.subtitle}
              className="block bg-gradient-to-r from-white/70 via-white/50 to-white/70 bg-clip-text text-transparent leading-[1.35] mt-1 sm:mt-2 mb-6 sm:mb-8"
            />
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl sm:text-2xl text-white/60 max-w-3xl mx-auto leading-[1.85] sm:leading-[1.9]"
          >
            {currentContent.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="px-6">
              <Link href="/products">
                <QrCode className="h-4 w-4 mr-2" />
                {(() => {
                  const labels = {
                    zh: { p: '开始使用' },
                    en: { p: 'Get Started' },
                    ja: { p: 'はじめる' },
                    ko: { p: '시작하기' },
                    ar: { p: 'ابدأ الآن' },
                    es: { p: 'Empezar' },
                  } as const;
                  const l = labels[lang as keyof typeof labels] || labels.zh;
                  return l.p;
                })()}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-6">
              <Link href="/contact">
                <Fingerprint className="h-4 w-4 mr-2" />
                {(() => {
                  const labels = {
                    zh: { s: '立即获取您的品牌保护方案！' },
                    en: { s: 'Get Your Brand Protection Plan Now!' },
                    ja: { s: 'ブランド保護プランを今すぐ取得！' },
                    ko: { s: '문의하기' },
                    ar: { s: 'احصل على خطة حماية علامتك التجارية الآن!' },
                    es: { s: '¡Obtenga su plan de protección de marca ahora!' },
                  } as const;
                  const l = labels[lang as keyof typeof labels] || labels.zh;
                  return l.s;
                })()}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        aria-hidden
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          {prefersReduced ? (
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          ) : (
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          )}
        </div>
      </motion.div>
    </HeroBackground>
  </section>
  <div className="py-12 sm:py-16">
    <PoweringBrands />
  </div>
    </>
  );
}
