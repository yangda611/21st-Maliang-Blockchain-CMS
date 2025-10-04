'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/utils/animations';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FinalCTASectionProps { lang?: string }

export default function FinalCTASection({ lang = 'zh' }: FinalCTASectionProps) {
  const content = {
    zh: {
      title: '品牌升级，刻不容缓。',
      subtitle: '立即联系我们的解决方案专家，看看你的品牌能提升多少价值。',
      button: '免费获取您的品牌保护方案',
    },
    en: {
      title: "Brand upgrade can't wait.",
      subtitle: 'Talk to our solution experts now and see how much value your brand can gain.',
      button: 'Get your brand protection plan (Free)',
    },
    ja: {
      title: 'ブランドアップグレードは待ったなし。',
      subtitle: '今すぐソリューション専門家に相談し、どれほど価値が高まるか確かめましょう。',
      button: '無料でブランド保護プランを取得',
    },
    ko: {
      title: '브랜드 업그레이드는 미룰 수 없습니다.',
      subtitle: '지금 솔루션 전문가와 상담하고, 가치 상승 폭을 확인하세요.',
      button: '무료 브랜드 보호 플랜 받기',
    },
    ar: {
      title: 'ترقية العلامة التجارية لا تحتمل التأجيل.',
      subtitle: 'تواصل الآن مع خبرائنا لمعرفة مقدار القيمة التي يمكن أن تكتسبها علامتك.',
      button: 'احصل على خطة حماية علامتك مجاناً',
    },
    es: {
      title: 'La actualización de marca no puede esperar.',
      subtitle: 'Habla ahora con nuestros expertos y descubre cuánto valor puede ganar tu marca.',
      button: 'Obtén tu plan de protección de marca (Gratis)',
    },
  } as const;

  const t = content[lang as keyof typeof content] || content.zh;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 sm:p-10 border border-white/10"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">{t.title}</h3>
          <p className="text-white/70 max-w-3xl mx-auto mb-6">{t.subtitle}</p>
          <Link href="/contact" prefetch>
            <Button size="lg" className="px-6">{t.button}</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
