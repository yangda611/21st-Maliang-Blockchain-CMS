'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { AlertTriangle, Shuffle, Ban, Users } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

type PainKey = 'counterfeits' | 'arbitrage' | 'trust' | 'whackamole';

interface PainPointsSectionProps {
  lang?: string;
  imageMap?: Partial<Record<PainKey, { src: string; alt?: string }>>;
}

export default function PainPointsSection({ lang = 'zh', imageMap }: PainPointsSectionProps) {
  const prefersReduced = useReducedMotion();

  const content = {
    zh: {
      title: '还在被这些问题“钝刀子割肉”？',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: '假货横行', description: '新品刚上，山寨比你卖得还快？' },
        { key: 'arbitrage', icon: Shuffle, title: '窜货扰价', description: '市场价格被打乱，优秀经销商怨声载道？' },
        { key: 'trust', icon: Users, title: '信任缺失', description: '客户反复询问真假，品牌忠诚度一降再降？' },
        { key: 'whackamole', icon: Ban, title: '打假无力', description: '投入巨大，却像打地鼠一样，永远打不完？' },
      ],
    },
    en: {
      title: 'Still being slowly bled by these problems?',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: 'Counterfeits Everywhere', description: 'New products launch, yet knock-offs sell faster than you?' },
        { key: 'arbitrage', icon: Shuffle, title: 'Price Arbitrage', description: 'Market pricing is disrupted; top distributors are frustrated?' },
        { key: 'trust', icon: Users, title: 'Trust Deficit', description: 'Customers keep asking “is it real?”; loyalty keeps dropping?' },
        { key: 'whackamole', icon: Ban, title: 'Endless Whack-a-Mole', description: 'Huge anti-counterfeit spend, but it never seems to end?' },
      ],
    },
    ja: {
      title: 'まだこれらの問題に“じわじわ”傷つけられていませんか？',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: '偽物の横行', description: '新製品を発売しても、模倣品の方が速く売れてしまう？' },
        { key: 'arbitrage', icon: Shuffle, title: '横流しで価格崩壊', description: '市場価格が乱れ、優秀な代理店から不満の声？' },
        { key: 'trust', icon: Users, title: '信頼の欠如', description: 'お客様が何度も真偽を確認、ロイヤルティが低下？' },
        { key: 'whackamole', icon: Ban, title: 'いたちごっこ', description: '多額の投資でも、もぐら叩きのように終わりが見えない？' },
      ],
    },
    ko: {
      title: '아직도 이런 문제로 “서서히 피를 흘리고” 있나요?',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: '가품 만연', description: '신제품을 내도 짝퉁이 더 빨리 팔리나요?' },
        { key: 'arbitrage', icon: Shuffle, title: '가격 교란', description: '시장 가격이 무너지고, 우수 대리점의 불만이 커지나요?' },
        { key: 'trust', icon: Users, title: '신뢰 부족', description: '고객이 진품 여부를 반복해서 묻고 충성도가 떨어지나요?' },
        { key: 'whackamole', icon: Ban, title: '끝없는 단속', description: '막대한 비용에도 두더지 잡기처럼 끝이 없나요?' },
      ],
    },
    ar: {
      title: 'هل ما زلت تُستنزف ببطء بهذه المشاكل؟',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: 'تفشي المقلدات', description: 'تُطلق منتجاً جديداً، لكن التقليد يباع أسرع؟' },
        { key: 'arbitrage', icon: Shuffle, title: 'تشويه الأسعار', description: 'اختلال الأسعار في السوق واستياء الموزعين الجيدين؟' },
        { key: 'trust', icon: Users, title: 'فقدان الثقة', description: 'العملاء يكررون سؤال: هل هو أصلي؟ والولاء في تراجع؟' },
        { key: 'whackamole', icon: Ban, title: 'حرب لا تنتهي', description: 'إنفاق ضخم على مكافحة التزوير، ومع ذلك لا نهاية؟' },
      ],
    },
    es: {
      title: '¿Sigues perdiendo poco a poco por estos problemas?',
      items: [
        { key: 'counterfeits', icon: AlertTriangle, title: 'Falsificaciones por doquier', description: '¿Lanzas un producto y los imitadores venden más rápido?' },
        { key: 'arbitrage', icon: Shuffle, title: 'Desorden de precios', description: 'El mercado se desordena y tus mejores distribuidores se quejan.' },
        { key: 'trust', icon: Users, title: 'Déficit de confianza', description: 'Los clientes preguntan una y otra vez si es auténtico; la lealtad cae.' },
        { key: 'whackamole', icon: Ban, title: 'Lucha interminable', description: 'Gran inversión en anti-falsificación, pero nunca termina.' },
      ],
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
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{t.title}</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-8 md:gap-x-16 md:gap-y-8 md:grid-cols-2"
        >
          {t.items.map((p, idx) => {
            const image = imageMap?.[p.key as PainKey];
            return (
              <motion.div
                key={p.title}
                variants={fadeInUp}
                className="h-full"
              >
                <div className="relative h-full min-h-[320px] rounded-[1.5rem] border-[0.75px] border-border p-3 md:rounded-[2rem] md:p-4 overflow-hidden hover:border-white/30 transition-all duration-300">
                  <GlowingEffect
                    spread={70}
                    glow={true}
                    disabled={!!prefersReduced}
                    proximity={120}
                    inactiveZone={0.01}
                    borderWidth={4}
                    movementDuration={1.2}
                  />
                  <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background/80 backdrop-blur-sm p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-8">
                    {image && (
                      <img src={image.src} alt={image.alt || p.title} className="absolute inset-0 h-full w-full object-cover opacity-15" />
                    )}
                    <div className="relative flex flex-1 flex-col justify-between gap-4">
                      <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-3">
                        <p.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="pt-1 text-xl leading-[1.4] font-semibold tracking-[-0.02em] md:text-2xl md:leading-[1.5] text-foreground">
                          {p.title}
                        </h3>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{p.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
