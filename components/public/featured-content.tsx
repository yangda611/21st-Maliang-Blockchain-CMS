/**
 * Featured Content Component
 * Displays featured products, articles, and categories with multi-language support
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/utils/animations';
import { AlertTriangle, Shuffle, Ban, Shield, QrCode, CheckCircle, TrendingUp, Lock, Users, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FeaturedContentProps {
  lang?: string;
}

export default function FeaturedContent({ lang = 'zh' }: FeaturedContentProps) {
  const prefersReduced = useReducedMotion();
  // 多语言内容
  const content = {
    zh: {
      sectionTitle: '为什么选择 Codexia',
      sectionDescription: '我们提供企业级的内容管理系统解决方案，结合区块链技术和现代化设计理念',
      features: [
        {
          icon: Shield,
          title: '区块链安全',
          description: '基于区块链技术，确保内容的安全性和不可篡改性',
        },
        {
          icon: QrCode,
          title: '高性能',
          description: '优化的架构设计，支持高并发访问和快速响应',
        },
        {
          icon: Users,
          title: '多语言支持',
          description: '支持6种主流语言，轻松拓展全球市场',
        },
        {
          icon: CheckCircle,
          title: '现代化设计',
          description: '暗黑科技风格设计，专为现代企业打造',
        },
      ],
      stats: [
        { number: '6', label: '支持语言' },
        { number: '99.9%', label: '可用性' },
        { number: '24/7', label: '技术支持' },
      ],
      painTitle: '还在被这些问题“钝刀子割肉”？',
      pains: [
        { icon: AlertTriangle, title: '假货横行', description: '新品刚上，山寨比你卖得还快？' },
        { icon: Shuffle, title: '窜货扰价', description: '市场价格被打乱，优秀经销商怨声载道？' },
        { icon: Users, title: '信任缺失', description: '客户反复询问真假，品牌忠诚度一降再降？' },
        { icon: Ban, title: '打假无力', description: '投入巨大，却像打地鼠一样，永远打不完？' },
      ],
      solutionTitle: '别再靠嘴皮子保证了，让技术给你站台！',
      solutionIntro: '我们不做传统的、一撕就掉的防伪码。我们为你的每一件商品，都刻上一个基于区块链的“数字身份证”。',
      solutionFeatures: [
        { icon: Shield, title: '无法篡改', description: '信息上链，就像刻在石头上，从源头杜绝造假可能。' },
        { icon: QrCode, title: '全程溯源', description: '从原料、生产、仓储到渠道，信息全部打通，问题一目了然。' },
        { icon: CheckCircle, title: '权威证明', description: '消费者扫码即是验真，这是你对品质的终极承诺。' },
      ],
      benefitsTitle: '这不只是防伪，这是在帮你“赚钱”和“增值”',
      benefits: [
        { icon: TrendingUp, title: '提升利润', description: '彻底杜绝假货，把被侵占的市场份额抢回来！' },
        { icon: Lock, title: '稳固价格', description: '有效管控窜货，保护渠道健康，让经销商死心塌地和你一起干。' },
        { icon: Users, title: '增强信任', description: '让客户买得放心，把一次性顾客变成终身粉丝。' },
        { icon: BarChart2, title: '沉淀价值', description: '每一次扫码，都是一次品牌互动。数据沉淀让决策更精准。' },
      ],
      cta: {
        title: '品牌升级，刻不容缓。',
        subtitle: '立即联系我们的解决方案专家，看看你的品牌能提升多少价值。',
        button: '免费获取您的品牌保护方案',
      },
    },
    en: {
      sectionTitle: 'Why Choose Codexia',
      sectionDescription: 'We provide enterprise-grade content management system solutions, combining blockchain technology and modern design concepts',
      features: [
        {
          icon: Shield,
          title: 'Blockchain Security',
          description: 'Based on blockchain technology, ensuring content security and immutability',
        },
        {
          icon: QrCode,
          title: 'High Performance',
          description: 'Optimized architecture design, supporting high concurrency access and fast response',
        },
        {
          icon: Users,
          title: 'Multi-language Support',
          description: 'Supports 6 mainstream languages, easily expand to global markets',
        },
        {
          icon: CheckCircle,
          title: 'Modern Design',
          description: 'Dark sci-fi style design, built for modern enterprises',
        },
      ],
      stats: [
        { number: '6', label: 'Supported Languages' },
        { number: '99.9%', label: 'Uptime' },
        { number: '24/7', label: 'Technical Support' },
      ],
      painTitle: 'Still being slowly bled by these problems?',
      pains: [
        { icon: AlertTriangle, title: 'Counterfeits Everywhere', description: 'New product launches, yet knock-offs sell faster than you?' },
        { icon: Shuffle, title: 'Price Arbitrage', description: 'Market pricing gets disrupted; great distributors are frustrated?' },
        { icon: Users, title: 'Trust Deficit', description: 'Customers keep asking “is it real?” — loyalty keeps dropping?' },
        { icon: Ban, title: 'Endless Whack-a-Mole', description: 'Massive spend on anti-counterfeiting, yet it never seems to end?' },
      ],
      solutionTitle: 'Stop relying on talk—let technology stand behind you!',
      solutionIntro: 'We don’t do traditional, easily-removed security codes. We engrave a blockchain-based “digital ID” for every single product.',
      solutionFeatures: [
        { icon: Shield, title: 'Immutable', description: 'On-chain data is like stone—no tampering, no rewriting.' },
        { icon: QrCode, title: 'End-to-End Traceability', description: 'From raw materials to production, warehousing and channels—all connected.' },
        { icon: CheckCircle, title: 'Authoritative Proof', description: 'A simple scan verifies authenticity—your ultimate quality promise.' },
      ],
      benefitsTitle: 'More than anti-counterfeiting—this helps you earn and grow value',
      benefits: [
        { icon: TrendingUp, title: 'Increase Profit', description: 'Eliminate counterfeits and reclaim your stolen market share.' },
        { icon: Lock, title: 'Stabilize Prices', description: 'Effectively control diversion and protect a healthy channel network.' },
        { icon: Users, title: 'Strengthen Trust', description: 'Let customers buy with confidence—turn one-time buyers into lifelong fans.' },
        { icon: BarChart2, title: 'Accumulate Value', description: 'Every scan is an interaction; data compounds to sharpen decisions.' },
      ],
      cta: {
        title: 'Brand upgrade can’t wait.',
        subtitle: 'Talk to our solution experts now and see how much value your brand can gain.',
        button: 'Get your brand protection plan (Free)',
      },
    },
    ja: {
      sectionTitle: 'なぜCodexiaを選ぶのか',
      sectionDescription: 'ブロックチェーン技術と現代的なデザインコンセプトを組み合わせたエンタープライズグレードのコンテンツ管理システムソリューションを提供します',
      features: [
        {
          icon: Shield,
          title: 'ブロックチェーンセキュリティ',
          description: 'ブロックチェーン技術に基づき、コンテンツのセキュリティと改ざん防止を確保',
        },
        {
          icon: QrCode,
          title: '高性能',
          description: '最適化されたアーキテクチャ設計、高同時アクセスと高速応答をサポート',
        },
        {
          icon: Users,
          title: '多言語サポート',
          description: '6つの主流言語をサポートし、グローバル市場に簡単に展開可能',
        },
        {
          icon: CheckCircle,
          title: '現代的なデザイン',
          description: 'ダークSFスタイルデザイン、現代企業向けに構築',
        },
      ],
      stats: [
        { number: '6', label: 'サポート言語' },
        { number: '99.9%', label: '稼働率' },
        { number: '24/7', label: 'テクニカルサポート' },
      ],
      painTitle: 'まだこれらの問題に“じわじわ”傷つけられていませんか？',
      pains: [
        { icon: AlertTriangle, title: '偽物の横行', description: '新製品を出しても、模倣品の方が速く売れてしまう？' },
        { icon: Shuffle, title: '横流し・価格崩壊', description: '市場価格が乱れ、優秀な代理店から不満の声？' },
        { icon: Users, title: '信頼の欠如', description: 'お客様が真偽確認を繰り返し、ロイヤルティが低下？' },
        { icon: Ban, title: 'いたちごっこ', description: '多額の投資でも、もぐら叩きのように終わりが見えない？' },
      ],
      solutionTitle: '口約束ではなく、技術で信頼を証明しましょう！',
      solutionIntro: '従来型の“はがれる防偽コード”ではなく、あらゆる商品にブロックチェーンベースの「デジタルID」を刻みます。',
      solutionFeatures: [
        { icon: Shield, title: '改ざん不可', description: 'チェーン上の情報は石に刻むのと同じ。書き換え不能。' },
        { icon: QrCode, title: '全工程トレーサビリティ', description: '原料・生産・保管・流通まで、全てが連携され可視化。' },
        { icon: CheckCircle, title: '権威ある証明', description: 'スキャン一つで真偽判定。品質への最終的な約束。' },
      ],
      benefitsTitle: 'これは防偽だけではなく、「収益」と「価値」を高める仕組みです',
      benefits: [
        { icon: TrendingUp, title: '利益向上', description: '偽物を排除し、奪われたシェアを取り戻す。' },
        { icon: Lock, title: '価格の安定', description: '横流しを抑制し、健全なチャネルを保護。' },
        { icon: Users, title: '信頼の強化', description: '安心して購入できる体験で、ファンを増やす。' },
        { icon: BarChart2, title: '価値の蓄積', description: 'スキャンごとにデータが蓄積し、意思決定が精緻に。' },
      ],
      cta: {
        title: 'ブランドアップグレードは待ったなし。',
        subtitle: '今すぐソリューション専門家に相談し、どれほど価値が高まるか確かめましょう。',
        button: '無料でブランド保護プランを取得',
      },
    },
    ko: {
      sectionTitle: '왜 Codexia를 선택해야 할까',
      sectionDescription: '블록체인 기술과 현대적인 디자인 개념을 결합한 엔터프라이즈급 콘텐츠 관리 시스템 솔루션을 제공합니다',
      features: [
        {
          icon: Shield,
          title: '블록체인 보안',
          description: '블록체인 기술을 기반으로 콘텐츠의 보안성과 변경 불가능성을 보장',
        },
        {
          icon: QrCode,
          title: '고성능',
          description: '최적화된 아키텍처 설계로 고동시 액세스와 빠른 응답 지원',
        },
        {
          icon: Users,
          title: '다국어 지원',
          description: '6개 주요 언어를 지원하여 글로벌 시장에 쉽게 확장 가능',
        },
        {
          icon: CheckCircle,
          title: '현대적인 디자인',
          description: '다크 SF 스타일 디자인으로 현대 기업을 위해 구축',
        },
      ],
      stats: [
        { number: '6', label: '지원 언어' },
        { number: '99.9%', label: '가동률' },
        { number: '24/7', label: '기술 지원' },
      ],
      painTitle: '아직도 이런 문제로 “서서히 피를 흘리고” 있나요?',
      pains: [
        { icon: AlertTriangle, title: '가품 만연', description: '신제품을 내도 짝퉁이 더 빨리 팔리나요?' },
        { icon: Shuffle, title: '가격 교란', description: '시장 가격이 무너지고, 우수 대리점의 불만이 커지나요?' },
        { icon: Users, title: '신뢰 부족', description: '고객이 진품 여부를 반복해서 묻고 충성도가 떨어지나요?' },
        { icon: Ban, title: '끝없는 단속', description: '막대한 비용에도 두더지 잡기처럼 끝이 없나요?' },
      ],
      solutionTitle: '말이 아닌 기술로 증명하세요!',
      solutionIntro: '우리는 쉽게 벗겨지는 전통 방위 코드를 쓰지 않습니다. 모든 상품에 블록체인 기반 “디지털 신분증”을 새깁니다.',
      solutionFeatures: [
        { icon: Shield, title: '변조 불가', description: '온체인 정보는 돌에 새긴 것처럼 바꿀 수 없습니다.' },
        { icon: QrCode, title: '전 과정 추적', description: '원자재·생산·보관·유통까지 전 구간 데이터 연결.' },
        { icon: CheckCircle, title: '권위 있는 증명', description: '소비자는 스캔 한 번으로 진위 확인—품질에 대한 최종 보증.' },
      ],
      benefitsTitle: '이건 단순 방위가 아니라, 수익과 가치를 키우는 시스템입니다',
      benefits: [
        { icon: TrendingUp, title: '이익 증대', description: '가품을 근절하고 빼앗긴 점유율을 되찾으세요.' },
        { icon: Lock, title: '가격 안정', description: '유통 왜곡을 통제하여 건강한 채널을 보호.' },
        { icon: Users, title: '신뢰 강화', description: '안심 구매 경험으로 일회성 고객을 평생 팬으로.' },
        { icon: BarChart2, title: '가치 축적', description: '스캔 데이터가 쌓여 더 정확한 의사결정을 지원.' },
      ],
      cta: {
        title: '브랜드 업그레이드는 미룰 수 없습니다.',
        subtitle: '지금 솔루션 전문가와 상담하고, 가치 상승 폭을 확인하세요.',
        button: '무료 브랜드 보호 플랜 받기',
      },
    },
    ar: {
      sectionTitle: 'لماذا تختار Codexia',
      sectionDescription: 'نحن نقدم حلول نظام إدارة المحتوى من المستوى المؤسسي، تجمع بين تقنية البلوكشين ومفاهيم التصميم الحديثة',
      features: [
        {
          icon: Shield,
          title: 'أمان البلوكشين',
          description: 'مبني على تقنية البلوكشين، يضمن أمان المحتوى وعدم قابليته للتغيير',
        },
        {
          icon: QrCode,
          title: 'أداء عالي',
          description: 'تصميم معماري محسن، يدعم الوصول المتزامن العالي والاستجابة السريعة',
        },
        {
          icon: Users,
          title: 'دعم متعدد اللغات',
          description: 'يدعم 6 لغات رئيسية، يتوسع بسهولة إلى الأسواق العالمية',
        },
        {
          icon: CheckCircle,
          title: 'تصميم حديث',
          description: 'تصميم نمط الخيال العلمي المظلم، مبني للمؤسسات الحديثة',
        },
      ],
      stats: [
        { number: '6', label: 'اللغات المدعومة' },
        { number: '99.9%', label: 'وقت التشغيل' },
        { number: '24/7', label: 'الدعم الفني' },
      ],
      painTitle: 'هل ما زلت تُستنزف ببطء بهذه المشاكل؟',
      pains: [
        { icon: AlertTriangle, title: 'تفشي المقلدات', description: 'تُطلق منتجاً جديداً، لكن التقليد يباع أسرع؟' },
        { icon: Shuffle, title: 'تشويه الأسعار', description: 'اختلال الأسعار في السوق واستياء الموزعين الجيدين؟' },
        { icon: Users, title: 'فقدان الثقة', description: 'العملاء يكررون سؤال: هل هو أصلي؟ والولاء في تراجع؟' },
        { icon: Ban, title: 'حرب لا تنتهي', description: 'إنفاق ضخم على مكافحة التزوير، ومع ذلك لا نهاية؟' },
      ],
      solutionTitle: 'لا تعتمد على الوعود—دع التقنية تقف إلى جانبك!',
      solutionIntro: 'لا نقدم رموزاً تقليدية سهلة الإزالة. نمنح كل منتج "هوية رقمية" مبنية على البلوكشين.',
      solutionFeatures: [
        { icon: Shield, title: 'غير قابل للتلاعب', description: 'البيانات على السلسلة كالنقش على الحجر.' },
        { icon: QrCode, title: 'تتبّع شامل', description: 'من المواد الخام إلى القنوات—كل المراحل موصولة وواضحة.' },
        { icon: CheckCircle, title: 'إثبات موثوق', description: 'مسح واحد يثبت الأصالة—وعد نهائي بالجودة.' },
      ],
      benefitsTitle: 'أكثر من مجرد مكافحة التزوير—إنه يساعدك على الربح وتنمية القيمة',
      benefits: [
        { icon: TrendingUp, title: 'زيادة الأرباح', description: 'القضاء على المقلدات واستعادة الحصة السوقية المسروقة.' },
        { icon: Lock, title: 'استقرار الأسعار', description: 'التحكم في التشويش على القنوات وحماية صحتها.' },
        { icon: Users, title: 'تعزيز الثقة', description: 'اجعل العملاء يشترون بثقة وحوّلهم إلى معجبين دائمين.' },
        { icon: BarChart2, title: 'تراكم القيمة', description: 'كل عملية مسح هي تفاعل؛ البيانات المتراكمة تدعم قرارات أدق.' },
      ],
      cta: {
        title: 'ترقية العلامة التجارية لا تحتمل التأجيل.',
        subtitle: 'تواصل الآن مع خبرائنا لمعرفة مقدار القيمة التي يمكن أن تكتسبها علامتك.',
        button: 'احصل على خطة حماية علامتك مجاناً',
      },
    },
    es: {
      sectionTitle: 'Por qué elegir Codexia',
      sectionDescription: 'Proporcionamos soluciones de sistema de gestión de contenido de nivel empresarial, combinando tecnología blockchain y conceptos de diseño moderno',
      features: [
        {
          icon: Shield,
          title: 'Seguridad Blockchain',
          description: 'Basado en tecnología blockchain, asegura la seguridad del contenido e inmutabilidad',
        },
        {
          icon: QrCode,
          title: 'Alto Rendimiento',
          description: 'Diseño arquitectónico optimizado, soporta acceso concurrente alto y respuesta rápida',
        },
        {
          icon: Users,
          title: 'Soporte Multi-idioma',
          description: 'Soporta 6 idiomas principales, se expande fácilmente a mercados globales',
        },
        {
          icon: CheckCircle,
          title: 'Diseño Moderno',
          description: 'Diseño estilo ciencia ficción oscuro, construido para empresas modernas',
        },
      ],
      stats: [
        { number: '6', label: 'Idiomas Soportados' },
        { number: '99.9%', label: 'Tiempo de actividad' },
        { number: '24/7', label: 'Soporte Técnico' },
      ],
      painTitle: '¿Sigues perdiendo poco a poco por estos problemas?',
      pains: [
        { icon: AlertTriangle, title: 'Falsificaciones por doquier', description: '¿Lanzas un producto y los imitadores venden más rápido?' },
        { icon: Shuffle, title: 'Desorden de precios', description: 'El mercado se desordena y tus mejores distribuidores se quejan.' },
        { icon: Users, title: 'Déficit de confianza', description: 'Los clientes preguntan una y otra vez si es auténtico; la lealtad cae.' },
        { icon: Ban, title: 'Lucha interminable', description: 'Gran inversión en anti-falsificación, pero nunca termina.' },
      ],
      solutionTitle: 'No confíes en palabras—deja que la tecnología hable por ti',
      solutionIntro: 'No usamos códigos tradicionales que se despegan. Damos a cada producto una “ID digital” basada en blockchain.',
      solutionFeatures: [
        { icon: Shield, title: 'Inmutable', description: 'La información en cadena es como piedra: no se puede alterar.' },
        { icon: QrCode, title: 'Trazabilidad total', description: 'Desde materias primas hasta canales—todo conectado.' },
        { icon: CheckCircle, title: 'Prueba autorizada', description: 'Con un escaneo se verifica la autenticidad—tu promesa final de calidad.' },
      ],
      benefitsTitle: 'No es solo anti-falsificación—te ayuda a ganar y a crecer en valor',
      benefits: [
        { icon: TrendingUp, title: 'Aumenta la ganancia', description: 'Elimina las falsificaciones y recupera cuota de mercado.' },
        { icon: Lock, title: 'Estabiliza precios', description: 'Controla la desviación de canales y protege la salud del ecosistema.' },
        { icon: Users, title: 'Refuerza la confianza', description: 'Convierte compras puntuales en fans de por vida.' },
        { icon: BarChart2, title: 'Acumula valor', description: 'Cada escaneo es interacción; los datos mejoran tus decisiones.' },
      ],
      cta: {
        title: 'La actualización de marca no puede esperar.',
        subtitle: 'Habla ahora con nuestros expertos y descubre cuánto valor puede ganar tu marca.',
        button: 'Obtén tu plan de protección de marca (Gratis)',
      },
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pain Points Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {currentContent.painTitle}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 md:grid-cols-2 mb-16"
        >
          {currentContent.pains.map((p: any) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
            >
              <div className="p-3 bg-white/10 rounded-lg">
                <p.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                <p className="text-white/60">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Solution Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {currentContent.solutionTitle}
            </span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto mt-4">
            {currentContent.solutionIntro}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid gap-6 md:grid-cols-3 mb-16"
        >
          {currentContent.solutionFeatures.map((f: any) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              whileHover={prefersReduced ? undefined : { y: -3, scale: 1.01 }}
              className="p-6 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {currentContent.benefitsTitle}
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16"
        >
          {currentContent.benefits.map((b: any) => (
            <motion.div
              key={b.title}
              variants={fadeInUp}
              whileHover={prefersReduced ? undefined : { y: -3 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-lg">
                  <b.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{b.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{b.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 sm:p-10 border border-white/10"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">{currentContent.cta.title}</h3>
          <p className="text-white/70 max-w-3xl mx-auto mb-6">{currentContent.cta.subtitle}</p>
          <Link href="/contact" prefetch>
            <Button size="lg" className="px-6">
              {currentContent.cta.button}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
