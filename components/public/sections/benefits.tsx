'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { TrendingUp, Lock, Users, BarChart2 } from 'lucide-react';
import { EvervaultCard } from '@/components/ui/evervault-card';

interface BenefitsSectionProps { lang?: string }

export default function BenefitsSection({ lang = 'zh' }: BenefitsSectionProps) {
  const prefersReduced = useReducedMotion();

  const content = {
    zh: {
      title: '这不只是防伪，这是在帮你"赚钱"和"增值"',
      items: [
        {
          icon: TrendingUp,
          title: '利润',
          description: '彻底杜绝假货，把被侵占的市场份额抢回来！',
          hoverText: '利润提升'
        },
        {
          icon: Lock,
          title: '价格',
          description: '有效管控窜货，保护渠道健康，稳定价格体系。',
          hoverText: '价格稳定'
        },
        {
          icon: Users,
          title: '信任',
          description: '让客户买得放心，把一次性顾客变成终身粉丝。',
          hoverText: '信任增强'
        },
        {
          icon: BarChart2,
          title: '价值',
          description: '每一次扫码，都是一次品牌互动。数据沉淀让决策更精准。',
          hoverText: '价值沉淀'
        },
      ],
    },
    en: {
      title: 'More than anti-counterfeiting—this helps you earn and grow value',
      items: [
        {
          icon: TrendingUp,
          title: 'Profit',
          description: 'Eliminate counterfeits and reclaim your stolen market share.',
          hoverText: 'Profit Growth'
        },
        {
          icon: Lock,
          title: 'Price',
          description: 'Effectively control diversion and protect a healthy channel network.',
          hoverText: 'Price Stability'
        },
        {
          icon: Users,
          title: 'Trust',
          description: 'Let customers buy with confidence—turn one-time buyers into lifelong fans.',
          hoverText: 'Trust Building'
        },
        {
          icon: BarChart2,
          title: 'Value',
          description: 'Every scan is an interaction; data compounds to sharpen decisions.',
          hoverText: 'Value Creation'
        },
      ],
    },
    ja: {
      title: 'これは防偽だけではなく、"稼ぐ・価値を高める"ための仕組みです',
      items: [
        {
          icon: TrendingUp,
          title: '利益',
          description: '偽物を徹底排除し、奪われたシェアを取り戻す。',
          hoverText: '利益向上'
        },
        {
          icon: Lock,
          title: '価格',
          description: '横流しを効果的に抑制し、健全なチャネルを保護。',
          hoverText: '価格安定'
        },
        {
          icon: Users,
          title: '信頼',
          description: '安心して購入できる体験で、一見客を生涯ファンへ。',
          hoverText: '信頼強化'
        },
        {
          icon: BarChart2,
          title: '価値',
          description: 'スキャンのたびにブランドとの接点が蓄積。意思決定がより正確に。',
          hoverText: '価値蓄積'
        },
      ],
    },
    ko: {
      title: '이건 단순 방위가 아니라, 수익과 가치를 키우는 시스템입니다',
      items: [
        {
          icon: TrendingUp,
          title: '이익',
          description: '가품을 근절하고 빼앗긴 점유율을 되찾으세요.',
          hoverText: '이익증대'
        },
        {
          icon: Lock,
          title: '가격',
          description: '유통 왜곡을 통제하여 건강한 채널을 보호.',
          hoverText: '가격안정'
        },
        {
          icon: Users,
          title: '신뢰',
          description: '안심 구매 경험으로 일회성 고객을 평생 팬으로.',
          hoverText: '신뢰강화'
        },
        {
          icon: BarChart2,
          title: '가치',
          description: '스캔 데이터가 쌓여 더 정확한 의사결정을 지원.',
          hoverText: '가치축적'
        },
      ],
    },
    ar: {
      title: 'أكثر من مجرد مكافحة التزوير—إنه يساعدك على الربح وتنمية القيمة',
      items: [
        {
          icon: TrendingUp,
          title: 'الربح',
          description: 'القضاء على المقلدات واستعادة الحصة السوقية المسروقة.',
          hoverText: 'نمو الأرباح'
        },
        {
          icon: Lock,
          title: 'السعر',
          description: 'التحكم في التشويش على القنوات وحماية صحتها.',
          hoverText: 'استقرار الأسعار'
        },
        {
          icon: Users,
          title: 'الثقة',
          description: 'اجعل العملاء يشترون بثقة وحوّلهم إلى معجبين دائمين.',
          hoverText: 'بناء الثقة'
        },
        {
          icon: BarChart2,
          title: 'القيمة',
          description: 'كل عملية مسح هي تفاعل؛ البيانات المتراكمة تدعم قرارات أدق.',
          hoverText: 'خلق القيمة'
        },
      ],
    },
    es: {
      title: 'No es solo anti-falsificación—te ayuda a ganar y a crecer en valor',
      items: [
        {
          icon: TrendingUp,
          title: 'Ganancia',
          description: 'Elimina las falsificaciones y recupera cuota de mercado.',
          hoverText: 'Crecimiento'
        },
        {
          icon: Lock,
          title: 'Precio',
          description: 'Controla la desviación de canales y protege la salud del ecosistema.',
          hoverText: 'Estabilidad'
        },
        {
          icon: Users,
          title: 'Confianza',
          description: 'Convierte compras puntuales en fans de por vida.',
          hoverText: 'Fidelidad'
        },
        {
          icon: BarChart2,
          title: 'Valor',
          description: 'Cada escaneo es interacción; los datos mejoran tus decisiones.',
          hoverText: 'Valoración'
        },
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
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{t.title}</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {t.items.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="group"
              style={{
                //边框
                border: '2px solid transparent',
                borderRadius: '16px',
                padding: '16px',
                animationDelay: `${idx * 0.1}s`,
                background: 'linear-gradient(45deg,rgba(255, 0, 183, 0),rgb(48, 47, 47)) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                width: '100%',
                height: '120%',
              } as React.CSSProperties}
            >
              <div className="relative mb-4">
                <EvervaultCard text={item.hoverText} className="w-full aspect-square" />
              </div>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <item.icon className="h-5 w-5 text-white/70" />
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                </div>
                <p className="text-white/60 text-xs leading-relaxed px-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
