'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { Shield, QrCode, CheckCircle } from 'lucide-react';
import { GlowCard } from '@/components/ui/glow-card';

interface SolutionSectionProps { lang?: string }

export default function SolutionSection({ lang = 'zh' }: SolutionSectionProps) {
  const prefersReduced = useReducedMotion();

  const content = {
    zh: {
      title: '别再靠嘴皮子保证了，让技术给你站台！',
      intro: '我们不做传统的、一撕就掉的防伪码。我们为你的每一件商品，都刻上一个基于区块链的"数字身份证"。',
      features: [
        { icon: Shield, title: '无法篡改', description: '信息上链，就像刻在石头上，从源头杜绝造假可能。', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: '全程溯源', description: '从原料、生产、仓储到渠道，信息全部打通，问题一目了然。', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: '权威证明', description: '消费者扫码即是验真，这是你对品质的终极承诺。', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
    en: {
      title: 'Stop relying on talk—let technology stand behind you!',
      intro: 'We don\'t do traditional scratch-off codes. We engrave a blockchain-based digital ID for every single product.',
      features: [
        { icon: Shield, title: 'Immutable', description: 'On-chain data is like stone—no tampering, no rewriting.', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: 'End-to-End Traceability', description: 'From raw materials to production, warehousing and channels—all connected.', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: 'Authoritative Proof', description: 'A simple scan verifies authenticity—your ultimate quality promise.', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
    ja: {
      title: '口約束ではなく、技術で信頼を証明しましょう！',
      intro: '従来の「はがれる防偽コード」ではなく、すべての商品にブロックチェーンベースのデジタルIDを刻みます。',
      features: [
        { icon: Shield, title: '改ざん不可', description: 'チェーン上の情報は石に刻むのと同じ。書き換え不能。', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: '全工程トレーサビリティ', description: '原料・生産・保管・流通まで、全てが連携され可視化。', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: '権威ある証明', description: 'スキャン一つで真偽判定。品質への最終的な約束。', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
    ko: {
      title: '말로 설득하지 말고, 기술로 증명하세요!',
      intro: '우리는 쉽게 벗겨지는 전통 코드 대신 모든 상품에 블록체인 기반 디지털 신분증을 새깁니다。',
      features: [
        { icon: Shield, title: '변조 불가', description: '온체인 정보는 돌에 새긴 것처럼 변경할 수 없습니다.', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: '전 과정 추적', description: '원자재·생산·보관·유통까지 전 구간 데이터 연결.', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: '권위 있는 증명', description: '소비자는 스캔 한 번으로 진위 확인—품질에 대한 최종 보증.', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
    ar: {
      title: 'لا تعتمد على الكلام—دع التقنية تقف إلى جانبك!',
      intro: 'لا نستخدم رموزاً تقليدية سهلة الإزالة. نمنح كل منتج هوية رقمية مبنية على البلوكشين.',
      features: [
        { icon: Shield, title: 'غير قابل للتلاعب', description: 'البيانات على السلسلة كالنقش على الحجر.', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: 'تتبّع شامل', description: 'من المواد الخام إلى الإنتاج والتوزيع—كل المراحل متصلة.', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: 'إثبات موثوق', description: 'مسح واحد يثبت الأصالة—وعد نهائي بالجودة.', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
    es: {
      title: 'No confíes en palabras—deja que la tecnología hable por ti',
      intro: 'No usamos códigos tradicionales que se despegan. Damos a cada producto una ID digital basada en blockchain.',
      features: [
        { icon: Shield, title: 'Inmutable', description: 'La información en cadena es como piedra: no se puede alterar.', color: 'purple' as const, image: 'codexia/image/Immutable.png' },
        { icon: QrCode, title: 'Trazabilidad total', description: 'Desde materias primas hasta canales—todo conectado.', color: 'blue' as const, image: 'codexia/image/End-to-End Traceability.png' },
        { icon: CheckCircle, title: 'Prueba autorizada', description: 'Un escaneo verifica la autenticidad: tu promesa final de calidad.', color: 'green' as const, image: 'codexia/image/Authoritative Proof.png' },
      ],
    },
  } as const;

  const t = content[lang as keyof typeof content] || content.zh;

  return (
    <section className="py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 md:mb-10">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">{t.title}</span>
          </h2>
          <p className="text-white/70 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">{t.intro}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-3 max-w-6xl mx-auto"
        >
          {t.features.map((f, idx) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              className="flex justify-center"
            >
              <GlowCard
                glowColor={f.color}
                size="lg"
                className="w-full max-w-sm"
              >
                <div className="h-full relative">
                  {/* 背景图片 */}
                  <img
                    src={`https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/${f.image}`}
                    alt={f.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-2xl"
                  />

                  <div className="relative h-full flex flex-col p-6 md:p-8">
                    {/* 图标区域 */}
                    <div className="flex justify-start mb-6 md:mb-8">
                      <div className="p-4 bg-white/10 rounded-lg">
                        <f.icon className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    {/* 文字内容区域 - 靠右下角 */}
                    <div className="flex-1 flex flex-col justify-end items-end">
                      <div className="space-y-3 md:space-y-4 text-right">
                        <h3 className="font-bold text-white text-xl md:text-2xl leading-tight">{f.title}</h3>
                        <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-xs text-left">{f.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
