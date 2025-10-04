/**
 * About Section Component
 * Company information, team, and mission with multi-language support
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Target, Users, Lightbulb, Shield, Award, TrendingUp } from 'lucide-react';
import { fadeInUp, slideInLeft, slideInRight, staggerContainer } from '@/utils/animations';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Value {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutSectionProps {
  lang?: string;
}

export default function AboutSection({ lang = 'zh' }: AboutSectionProps) {
  const prefersReduced = useReducedMotion();
  // 多语言内容
  const content = {
    zh: {
      sectionTitle: '关于Codexia',
      sectionDescription: '我们是区块链CMS领域的创新者，致力于通过前沿技术重新定义内容管理的安全性和可靠性。我们的使命是将区块链技术与内容创作完美融合，为现代企业提供值得信赖的内容管理解决方案。',
      missionTitle: '我们的使命',
      missionDescription: '通过区块链技术和创新设计，重新定义内容管理的安全性和可靠性，为全球企业提供值得信赖的内容创作和管理平台。',
      visionTitle: '我们的愿景',
      visionDescription: '成为区块链CMS领域的领导者，推动内容生态的安全升级，让每一位内容创作者都能享受到技术创新带来的便利和保障。',
      valuesTitle: '核心价值观',
      teamTitle: '我们的团队',
      milestonesTitle: '发展历程',
      awardsTitle: '荣誉奖项',
      values: [
        {
          icon: Target,
          title: '创新驱动',
          description: '我们不断探索前沿技术，将区块链与内容管理完美结合，创造行业领先的解决方案。',
        },
        {
          icon: Shield,
          title: '安全第一',
          description: '内容安全是我们的核心价值，我们采用区块链技术确保内容的不可篡改和版权保护。',
        },
        {
          icon: Users,
          title: '用户导向',
          description: '深入理解用户需求，提供直观易用、高效可靠的内容管理体验。',
        },
        {
          icon: Lightbulb,
          title: '持续改进',
          description: '我们相信技术的力量，不断迭代产品，为用户创造更大的价值。',
        },
      ],
      teamMembers: [
        {
          name: '张三',
          role: '创始人 & CEO',
          avatar: '/images/team/zhangsan.jpg',
          bio: '区块链技术专家，拥有10年软件开发经验，专注于分布式系统和内容安全领域。',
        },
        {
          name: '李四',
          role: '技术总监',
          avatar: '/images/team/lisi.jpg',
          bio: '全栈开发专家，精通React、Node.js和区块链智能合约开发，主导产品技术架构设计。',
        },
        {
          name: '王五',
          role: '产品经理',
          avatar: '/images/team/wangwu.jpg',
          bio: '资深产品经理，专注用户体验设计和产品战略规划，具有丰富的内容管理系统产品经验。',
        },
        {
          name: '赵六',
          role: '市场总监',
          avatar: '/images/team/zhaoliu.jpg',
          bio: '数字营销专家，负责品牌建设和市场推广，擅长区块链技术和创新产品的市场定位。',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: '公司成立',
          description: 'Codexia区块链CMS项目启动，团队组建完成，开始产品研发。',
        },
        {
          year: '2024',
          title: '产品发布',
          description: '第一版区块链CMS产品正式发布，支持多语言内容管理和区块链存证功能。',
        },
        {
          year: '2024',
          title: '获得投资',
          description: '获得知名投资机构的风险投资，用于产品优化和市场拓展。',
        },
        {
          year: '2025',
          title: '市场扩张',
          description: '产品进入国际市场，支持6种语言，服务全球多家企业客户。',
        },
      ],
      awards: [
        {
          icon: Award,
          title: '区块链创新奖',
          description: '2024年度区块链技术创新应用奖',
        },
        {
          icon: Shield,
          title: '信息安全认证',
          description: '通过国际信息安全管理体系认证',
        },
        {
          icon: TrendingUp,
          title: '快速发展企业',
          description: '2024最具发展潜力科技企业',
        },
      ],
    },
    en: {
      sectionTitle: 'About Codexia',
      sectionDescription: 'We are innovators in the blockchain CMS field, committed to redefining the security and reliability of content management through cutting-edge technology. Our mission is to perfectly integrate blockchain technology with content creation, providing modern enterprises with trustworthy content management solutions.',
      missionTitle: 'Our Mission',
      missionDescription: 'Through blockchain technology and innovative design, redefine the security and reliability of content management, providing global enterprises with trustworthy content creation and management platforms.',
      visionTitle: 'Our Vision',
      visionDescription: 'Become the leader in the blockchain CMS field, promote the security upgrade of the content ecosystem, and let every content creator enjoy the convenience and protection brought by technological innovation.',
      valuesTitle: 'Core Values',
      teamTitle: 'Our Team',
      milestonesTitle: 'Development History',
      awardsTitle: 'Awards & Recognition',
      values: [
        {
          icon: Target,
          title: 'Innovation Driven',
          description: 'We continuously explore cutting-edge technology, perfectly integrating blockchain with content management to create industry-leading solutions.',
        },
        {
          icon: Shield,
          title: 'Security First',
          description: 'Content security is our core value. We use blockchain technology to ensure content immutability and copyright protection.',
        },
        {
          icon: Users,
          title: 'User Oriented',
          description: 'Deeply understand user needs, provide intuitive, easy-to-use, efficient and reliable content management experience.',
        },
        {
          icon: Lightbulb,
          title: 'Continuous Improvement',
          description: 'We believe in the power of technology, continuously iterate products to create greater value for users.',
        },
      ],
      teamMembers: [
        {
          name: 'John Doe',
          role: 'Founder & CEO',
          avatar: '/images/team/zhangsan.jpg',
          bio: 'Blockchain technology expert with 10 years of software development experience, specializing in distributed systems and content security.',
        },
        {
          name: 'Jane Smith',
          role: 'CTO',
          avatar: '/images/team/lisi.jpg',
          bio: 'Full-stack development expert, proficient in React, Node.js and blockchain smart contract development, leading product technical architecture design.',
        },
        {
          name: 'Mike Johnson',
          role: 'Product Manager',
          avatar: '/images/team/wangwu.jpg',
          bio: 'Senior product manager focused on user experience design and product strategic planning, with extensive content management system product experience.',
        },
        {
          name: 'Sarah Wilson',
          role: 'Marketing Director',
          avatar: '/images/team/zhaoliu.jpg',
          bio: 'Digital marketing expert responsible for brand building and market promotion, skilled in market positioning of blockchain technology and innovative products.',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: 'Company Founded',
          description: 'Codexia blockchain CMS project launched, team formation completed, product development begins.',
        },
        {
          year: '2024',
          title: 'Product Launch',
          description: 'First version of blockchain CMS product officially released, supporting multi-language content management and blockchain certification.',
        },
        {
          year: '2024',
          title: 'Investment Received',
          description: 'Received venture capital from well-known investment institutions for product optimization and market expansion.',
        },
        {
          year: '2025',
          title: 'Market Expansion',
          description: 'Product enters international market, supports 6 languages, serves multiple global enterprise customers.',
        },
      ],
      awards: [
        {
          icon: Award,
          title: 'Blockchain Innovation Award',
          description: '2024 Blockchain Technology Innovation Application Award',
        },
        {
          icon: Shield,
          title: 'Information Security Certification',
          description: 'Passed international information security management system certification',
        },
        {
          icon: TrendingUp,
          title: 'Fast-growing Enterprise',
          description: '2024 Most Potential Technology Enterprise',
        },
      ],
    },
    ja: {
      sectionTitle: 'Codexiaについて',
      sectionDescription: '私たちはブロックチェーンCMS分野のイノベーターで、最先端技術を通じてコンテンツ管理のセキュリティと信頼性を再定義することに専念しています。私たちの使命は、ブロックチェーン技術とコンテンツ作成を完璧に統合し、現代企業に信頼できるコンテンツ管理ソリューションを提供することです。',
      missionTitle: '私たちの使命',
      missionDescription: 'ブロックチェーン技術と革新的なデザインを通じて、コンテンツ管理のセキュリティと信頼性を再定義し、世界中の企業に信頼できるコンテンツ作成と管理プラットフォームを提供します。',
      visionTitle: '私たちのビジョン',
      visionDescription: 'ブロックチェーンCMS分野のリーダーとなり、コンテンツエコシステムのセキュリティ向上を推進し、すべてのコンテンツクリエイターが技術革新による利便性と保護を享受できるようにします。',
      valuesTitle: 'コアバリュー',
      teamTitle: '私たちのチーム',
      milestonesTitle: '発展の歴史',
      awardsTitle: '栄誉と表彰',
      values: [
        {
          icon: Target,
          title: 'イノベーション駆動',
          description: '最先端技術を継続的に探求し、ブロックチェーンとコンテンツ管理を完璧に統合して業界をリードするソリューションを作成します。',
        },
        {
          icon: Shield,
          title: 'セキュリティファースト',
          description: 'コンテンツセキュリティは私たちのコアバリューです。ブロックチェーン技術を使用してコンテンツの改ざん防止と著作権保護を確保します。',
        },
        {
          icon: Users,
          title: 'ユーザ导向',
          description: 'ユーザーのニーズを深く理解し、直感的で使いやすく、効率的で信頼性の高いコンテンツ管理体験を提供します。',
        },
        {
          icon: Lightbulb,
          title: '継続的改善',
          description: '技術の力を信じ、製品を継続的に反復してユーザーに大きな価値を創造します。',
        },
      ],
      teamMembers: [
        {
          name: '田中太郎',
          role: '創業者 & CEO',
          avatar: '/images/team/zhangsan.jpg',
          bio: 'ブロックチェーン技術専門家で、10年のソフトウェア開発経験を持ち、分散システムとコンテンツセキュリティ分野に特化しています。',
        },
        {
          name: '佐藤花子',
          role: '技術責任者',
          avatar: '/images/team/lisi.jpg',
          bio: 'フルスタック開発専門家で、React、Node.js、ブロックチェーンスマートコントラクト開発に精通し、製品技術アーキテクチャ設計を主導しています。',
        },
        {
          name: '鈴木次郎',
          role: 'プロダクトマネージャー',
          avatar: '/images/team/wangwu.jpg',
          bio: 'シニアプロダクトマネージャーで、ユーザー体験デザインと製品戦略計画に焦点を当て、豊富なコンテンツ管理システム製品経験を持っています。',
        },
        {
          name: '高橋美咲',
          role: 'マーケティング責任者',
          avatar: '/images/team/zhaoliu.jpg',
          bio: 'デジタルマーケティング専門家で、ブランド構築と市場プロモーションを担当し、ブロックチェーン技術と革新的製品の市場ポジショニングに長けています。',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: '会社設立',
          description: 'CodexiaブロックチェーンCMSプロジェクトが開始され、チーム編成が完了し、製品開発が開始されます。',
        },
        {
          year: '2024',
          title: '製品リリース',
          description: '最初のバージョンのブロックチェーンCMS製品が正式にリリースされ、多言語コンテンツ管理とブロックチェーン証明機能をサポートします。',
        },
        {
          year: '2024',
          title: '投資獲得',
          description: '著名投資機関からベンチャーキャピタルを受け取り、製品最適化と市場拡大に使用されます。',
        },
        {
          year: '2025',
          title: '市場拡大',
          description: '製品が国際市場に参入し、6言語をサポートし、世界中の複数の企業顧客にサービスを提供します。',
        },
      ],
      awards: [
        {
          icon: Award,
          title: 'ブロックチェーンイノベーション賞',
          description: '2024年ブロックチェーン技術革新アプリケーション賞',
        },
        {
          icon: Shield,
          title: '情報セキュリティ認証',
          description: '国際情報セキュリティマネジメントシステム認証に合格',
        },
        {
          icon: TrendingUp,
          title: '急速成長企業',
          description: '2024年最も発展可能性のあるテクノロジー企業',
        },
      ],
    },
    ko: {
      sectionTitle: 'Codexia 소개',
      sectionDescription: '우리는 블록체인 CMS 분야의 혁신자로서, 최첨단 기술을 통해 콘텐츠 관리의 보안성과 신뢰성을 재정의하는 데 전념하고 있습니다. 우리의 사명은 블록체인 기술과 콘텐츠 생성을 완벽하게 통합하여 현대 기업에 신뢰할 수 있는 콘텐츠 관리 솔루션을 제공하는 것입니다.',
      missionTitle: '우리의 사명',
      missionDescription: '블록체인 기술과 혁신적인 디자인을 통해 콘텐츠 관리의 보안성과 신뢰성을 재정의하여 글로벌 기업에 신뢰할 수 있는 콘텐츠 생성 및 관리 플랫폼을 제공합니다.',
      visionTitle: '우리의 비전',
      visionDescription: '블록체인 CMS 분야의 리더가 되어 콘텐츠 생태계의 보안 업그레이드를 촉진하고 모든 콘텐츠 크리에이터가 기술 혁신으로 인한 편의성과 보호를 누릴 수 있도록 합니다.',
      valuesTitle: '핵심 가치',
      teamTitle: '우리 팀',
      milestonesTitle: '발전 역사',
      awardsTitle: '수상 및 인정',
      values: [
        {
          icon: Target,
          title: '혁신 주도',
          description: '최첨단 기술을 지속적으로 탐구하여 블록체인과 콘텐츠 관리를 완벽하게 통합하고 업계를 선도하는 솔루션을 만듭니다.',
        },
        {
          icon: Shield,
          title: '보안 우선',
          description: '콘텐츠 보안은 우리의 핵심 가치입니다. 블록체인 기술을 사용하여 콘텐츠의 변경 불가능성과 저작권 보호를 보장합니다.',
        },
        {
          icon: Users,
          title: '사용자 중심',
          description: '사용자 요구를 깊이 이해하고 직관적이며 사용하기 쉽고 효율적이며 신뢰할 수 있는 콘텐츠 관리 경험을 제공합니다.',
        },
        {
          icon: Lightbulb,
          title: '지속적 개선',
          description: '기술의 힘을 믿고 제품을 지속적으로 반복하여 사용자에게 더 큰 가치를 창출합니다.',
        },
      ],
      teamMembers: [
        {
          name: '김철수',
          role: '창립자 & CEO',
          avatar: '/images/team/zhangsan.jpg',
          bio: '블록체인 기술 전문가로 10년의 소프트웨어 개발 경험을 보유하고 분산 시스템 및 콘텐츠 보안 분야에 특화되어 있습니다.',
        },
        {
          name: '이영희',
          role: 'CTO',
          avatar: '/images/team/lisi.jpg',
          bio: '풀스택 개발 전문가로 React, Node.js 및 블록체인 스마트 계약 개발에 능숙하며 제품 기술 아키텍처 설계를 주도합니다.',
        },
        {
          name: '박민준',
          role: '제품 관리자',
          avatar: '/images/team/wangwu.jpg',
          bio: '시니어 제품 관리자로 사용자 경험 디자인과 제품 전략 계획에 중점을 두고 풍부한 콘텐츠 관리 시스템 제품 경험을 보유하고 있습니다.',
        },
        {
          name: '정수진',
          role: '마케팅 이사',
          avatar: '/images/team/zhaoliu.jpg',
          bio: '디지털 마케팅 전문가로 브랜드 구축과 시장 홍보를 담당하며 블록체인 기술과 혁신 제품의 시장 포지셔닝에 능숙합니다.',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: '회사 설립',
          description: 'Codexia 블록체인 CMS 프로젝트가 시작되고 팀 구성이 완료되어 제품 개발이 시작됩니다.',
        },
        {
          year: '2024',
          title: '제품 출시',
          description: '첫 번째 버전의 블록체인 CMS 제품이 공식 출시되어 다국어 콘텐츠 관리와 블록체인 인증 기능을 지원합니다.',
        },
        {
          year: '2024',
          title: '투자 유치',
          description: '유명 투자 기관으로부터 벤처 캐피털을 유치하여 제품 최적화와 시장 확대에 사용됩니다.',
        },
        {
          year: '2025',
          title: '시장 확대',
          description: '제품이 국제 시장에 진입하여 6개 언어를 지원하고 전 세계 여러 기업 고객에게 서비스를 제공합니다.',
        },
      ],
      awards: [
        {
          icon: Award,
          title: '블록체인 혁신상',
          description: '2024년 블록체인 기술 혁신 응용상',
        },
        {
          icon: Shield,
          title: '정보 보안 인증',
          description: '국제 정보 보안 관리 시스템 인증 통과',
        },
        {
          icon: TrendingUp,
          title: '급성장 기업',
          description: '2024년 가장 발전 가능성이 있는 기술 기업',
        },
      ],
    },
    ar: {
      sectionTitle: 'حول Codexia',
      sectionDescription: 'نحن المبتكرون في مجال CMS البلوكشين، ملتزمون بإعادة تعريف أمان وموثوقية إدارة المحتوى من خلال التكنولوجيا المتطورة. مهمتنا هي دمج تقنية البلوكشين مع إنشاء المحتوى بشكل مثالي، لتوفير حلول إدارة محتوى موثوقة للمؤسسات الحديثة.',
      missionTitle: 'مهمتنا',
      missionDescription: 'من خلال تقنية البلوكشين والتصميم المبتكر، إعادة تعريف أمان وموثوقية إدارة المحتوى، وتوفير منصات إنشاء وإدارة محتوى موثوقة للمؤسسات العالمية.',
      visionTitle: 'رؤيتنا',
      visionDescription: 'أن نصبح قادة في مجال CMS البلوكشين، وندفع ترقية أمان نظام المحتوى البيئي، وندع كل منشئ محتوى يستمتع بالراحة والحماية التي تجلبها الابتكارات التكنولوجية.',
      valuesTitle: 'القيم الأساسية',
      teamTitle: 'فريقنا',
      milestonesTitle: 'تاريخ التطور',
      awardsTitle: 'الجوائز والتقدير',
      values: [
        {
          icon: Target,
          title: 'الابتكار المدفوع',
          description: 'نحن نستكشف باستمرار التكنولوجيا المتطورة، وندمج البلوكشين مع إدارة المحتوى بشكل مثالي لإنشاء حلول رائدة في الصناعة.',
        },
        {
          icon: Shield,
          title: 'الأمان أولاً',
          description: 'أمان المحتوى هو قيمتنا الأساسية. نحن نستخدم تقنية البلوكشين لضمان عدم قابلية تغيير المحتوى وحماية حقوق النشر.',
        },
        {
          icon: Users,
          title: 'موجه نحو المستخدم',
          description: 'نفهم احتياجات المستخدمين بعمق، ونوفر تجربة إدارة محتوى بديهية وسهلة الاستخدام وفعالة وموثوقة.',
        },
        {
          icon: Lightbulb,
          title: 'التحسين المستمر',
          description: 'نحن نؤمن بقوة التكنولوجيا، ونكرر المنتجات باستمرار لخلق قيمة أكبر للمستخدمين.',
        },
      ],
      teamMembers: [
        {
          name: 'أحمد علي',
          role: 'المؤسس والرئيس التنفيذي',
          avatar: '/images/team/zhangsan.jpg',
          bio: 'خبير تقنية البلوكشين بخبرة 10 سنوات في تطوير البرمجيات، متخصص في الأنظمة الموزعة وأمان المحتوى.',
        },
        {
          name: 'فاطمة محمد',
          role: 'مدير التكنولوجيا',
          avatar: '/images/team/lisi.jpg',
          bio: 'خبير تطوير متكامل، ماهر في React وNode.js وتطوير عقود البلوكشين الذكية، يقود تصميم بنية المنتج التكنولوجية.',
        },
        {
          name: 'محمد حسن',
          role: 'مدير المنتج',
          avatar: '/images/team/wangwu.jpg',
          bio: 'مدير منتج كبير يركز على تصميم تجربة المستخدم والتخطيط الاستراتيجي للمنتج، ولديه خبرة واسعة في منتجات نظام إدارة المحتوى.',
        },
        {
          name: 'سارة أحمد',
          role: 'مدير التسويق',
          avatar: '/images/team/zhaoliu.jpg',
          bio: 'خبير تسويق رقمي مسؤول عن بناء العلامة التجارية والترويج في السوق، ماهر في تحديد موقع السوق لتقنية البلوكشين والمنتجات المبتكرة.',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: 'تأسيس الشركة',
          description: 'بدء مشروع Codexia blockchain CMS، اكتمال تشكيل الفريق، بدء تطوير المنتج.',
        },
        {
          year: '2024',
          title: 'إطلاق المنتج',
          description: 'إصدار النسخة الأولى من منتج CMS البلوكشين رسمياً، يدعم إدارة المحتوى متعدد اللغات ووظيفة التصديق بالبلوكشين.',
        },
        {
          year: '2024',
          title: 'الحصول على استثمار',
          description: 'الحصول على رأس مال مخاطر من مؤسسات استثمارية مشهورة لتحسين المنتج وتوسيع السوق.',
        },
        {
          year: '2025',
          title: 'توسع السوق',
          description: 'دخول المنتج إلى السوق الدولية، يدعم 6 لغات، يخدم عملاء مؤسسيين متعددين عالمياً.',
        },
      ],
      awards: [
        {
          icon: Award,
          title: 'جائزة ابتكار البلوكشين',
          description: 'جائزة تطبيق ابتكار تقنية البلوكشين لعام 2024',
        },
        {
          icon: Shield,
          title: 'شهادة أمن المعلومات',
          description: 'اجتياز شهادة نظام إدارة أمن المعلومات الدولية',
        },
        {
          icon: TrendingUp,
          title: 'المؤسسة سريعة النمو',
          description: 'أكثر مؤسسات التكنولوجيا إمكانية للتطور في عام 2024',
        },
      ],
    },
    es: {
      sectionTitle: 'Acerca de Codexia',
      sectionDescription: 'Somos innovadores en el campo de CMS blockchain, comprometidos a redefinir la seguridad y confiabilidad de la gestión de contenido a través de tecnología de vanguardia. Nuestra misión es integrar perfectamente la tecnología blockchain con la creación de contenido, proporcionando soluciones de gestión de contenido confiables para empresas modernas.',
      missionTitle: 'Nuestra Misión',
      missionDescription: 'A través de la tecnología blockchain y el diseño innovador, redefinir la seguridad y confiabilidad de la gestión de contenido, proporcionando plataformas de creación y gestión de contenido confiables para empresas globales.',
      visionTitle: 'Nuestra Visión',
      visionDescription: 'Convertirnos en líderes en el campo de CMS blockchain, promover la actualización de seguridad del ecosistema de contenido, y permitir que cada creador de contenido disfrute de la conveniencia y protección que trae la innovación tecnológica.',
      valuesTitle: 'Valores Principales',
      teamTitle: 'Nuestro Equipo',
      milestonesTitle: 'Historia de Desarrollo',
      awardsTitle: 'Premios y Reconocimientos',
      values: [
        {
          icon: Target,
          title: 'Innovación Impulsada',
          description: 'Exploramos continuamente tecnología de vanguardia, integrando perfectamente blockchain con gestión de contenido para crear soluciones líderes en la industria.',
        },
        {
          icon: Shield,
          title: 'Seguridad Primero',
          description: 'La seguridad del contenido es nuestro valor principal. Usamos tecnología blockchain para asegurar la inmutabilidad del contenido y la protección de derechos de autor.',
        },
        {
          icon: Users,
          title: 'Orientado al Usuario',
          description: 'Entendemos profundamente las necesidades del usuario, proporcionando una experiencia de gestión de contenido intuitiva, fácil de usar, eficiente y confiable.',
        },
        {
          icon: Lightbulb,
          title: 'Mejora Continua',
          description: 'Creemos en el poder de la tecnología, iteramos continuamente productos para crear mayor valor para los usuarios.',
        },
      ],
      teamMembers: [
        {
          name: 'Carlos García',
          role: 'Fundador y CEO',
          avatar: '/images/team/zhangsan.jpg',
          bio: 'Experto en tecnología blockchain con 10 años de experiencia en desarrollo de software, especializado en sistemas distribuidos y seguridad de contenido.',
        },
        {
          name: 'María López',
          role: 'CTO',
          avatar: '/images/team/lisi.jpg',
          bio: 'Experta en desarrollo full-stack, proficient en React, Node.js y desarrollo de contratos inteligentes blockchain, lidera el diseño de arquitectura técnica del producto.',
        },
        {
          name: 'José Martínez',
          role: 'Gerente de Producto',
          avatar: '/images/team/wangwu.jpg',
          bio: 'Gerente de producto senior enfocado en diseño de experiencia de usuario y planificación estratégica de producto, con amplia experiencia en productos de sistemas de gestión de contenido.',
        },
        {
          name: 'Ana Rodríguez',
          role: 'Directora de Marketing',
          avatar: '/images/team/zhaoliu.jpg',
          bio: 'Experta en marketing digital responsable de construcción de marca y promoción de mercado, hábil en posicionamiento de mercado de tecnología blockchain y productos innovadores.',
        },
      ],
      milestones: [
        {
          year: '2023',
          title: 'Fundación de la Empresa',
          description: 'Lanzamiento del proyecto Codexia blockchain CMS, formación completa del equipo, inicio del desarrollo del producto.',
        },
        {
          year: '2024',
          title: 'Lanzamiento del Producto',
          description: 'Primera versión del producto CMS blockchain lanzada oficialmente, compatible con gestión de contenido multilingüe y función de certificación blockchain.',
        },
        {
          year: '2024',
          title: 'Inversión Recibida',
          description: 'Capital de riesgo recibido de instituciones de inversión reconocidas para optimización del producto y expansión del mercado.',
        },
        {
          year: '2025',
          title: 'Expansión de Mercado',
          description: 'Producto entra al mercado internacional, compatible con 6 idiomas, sirve a múltiples clientes empresariales globales.',
        },
      ],
      awards: [
        {
          icon: Award,
          title: 'Premio a la Innovación Blockchain',
          description: 'Premio a la Aplicación Innovadora de Tecnología Blockchain 2024',
        },
        {
          icon: Shield,
          title: 'Certificación de Seguridad de la Información',
          description: 'Aprobó la certificación del sistema de gestión de seguridad de la información internacional',
        },
        {
          icon: TrendingUp,
          title: 'Empresa de Crecimiento Rápido',
          description: 'Empresa de Tecnología con Mayor Potencial de Desarrollo 2024',
        },
      ],
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {currentContent.sectionTitle}
          </span>
        </h1>
        <p className="text-xl text-white/60 max-w-4xl mx-auto leading-relaxed">
          {currentContent.sectionDescription}
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 mb-16"
      >
        <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10">
          <Target className="h-12 w-12 text-white mb-4" />
          <h3 className="text-2xl font-semibold mb-4">{currentContent.missionTitle}</h3>
          <p className="text-white/80 leading-relaxed">
            {currentContent.missionDescription}
          </p>
        </div>

        <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-xl border border-white/10">
          <TrendingUp className="h-12 w-12 text-white mb-4" />
          <h3 className="text-2xl font-semibold mb-4">{currentContent.visionTitle}</h3>
          <p className="text-white/80 leading-relaxed">
            {currentContent.visionDescription}
          </p>
        </div>
      </motion.div>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">{currentContent.valuesTitle}</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {currentContent.values.map((value) => (
            <motion.div
              key={value.title}
              variants={fadeInUp}
              whileHover={prefersReduced ? undefined : { y: -2 }}
              className="flex items-start gap-4 p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              <div className="p-3 bg-white/10 rounded-lg">
                <value.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">{value.title}</h4>
                <p className="text-white/70">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Team */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">{currentContent.teamTitle}</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {currentContent.teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              whileHover={prefersReduced ? undefined : { y: -2 }}
              className="text-center p-6 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-white/60" />
              </div>
              <h4 className="font-semibold text-white mb-1">{member.name}</h4>
              <p className="text-white/60 text-sm mb-3">{member.role}</p>
              <p className="text-white/70 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Company Milestones */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12">{currentContent.milestonesTitle}</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-6"
        >
          {currentContent.milestones.map((milestone, index) => (
            <motion.div
              key={`${milestone.year}-${milestone.title}`}
              variants={index % 2 === 0 ? slideInLeft : slideInRight}
              className={`flex items-center gap-6 p-6 rounded-lg border border-white/10 ${
                index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{milestone.year}</span>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">{milestone.title}</h4>
                <p className="text-white/70">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Awards & Recognition */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center mb-12">{currentContent.awardsTitle}</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8 text-center"
        >
          {currentContent.awards.map((award) => (
            <motion.div
              key={award.title}
              variants={fadeInUp}
              className="p-6 bg-white/5 rounded-lg border border-white/10"
            >
              <award.icon className="h-12 w-12 text-white mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">{award.title}</h4>
              <p className="text-white/70 text-sm">{award.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
