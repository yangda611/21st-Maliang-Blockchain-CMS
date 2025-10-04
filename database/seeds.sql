-- Maliang CMS Database Seeds
-- Initial data for development and testing

-- Create initial admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, role, is_active) VALUES
('admin@maliang.com', crypt('admin123', gen_salt('bf')), 'super_admin', true),
('editor@maliang.com', crypt('editor123', gen_salt('bf')), 'editor', true),
('translator@maliang.com', crypt('translator123', gen_salt('bf')), 'translator', true)
ON CONFLICT (email) DO NOTHING;

-- Create root categories
INSERT INTO content_categories (name, description, slug, hierarchy_level, content_type, display_order, is_active) VALUES
('{"zh": "区块链产品", "en": "Blockchain Products", "ja": "ブロックチェーン製品", "ko": "블록체인 제품", "ar": "منتجات البلوكشين", "es": "Productos Blockchain"}',
 '{"zh": "基于区块链技术的创新产品系列", "en": "Innovative product series based on blockchain technology", "ja": "ブロックチェーン技術に基づく革新的な製品シリーズ", "ko": "블록체인 기술 기반의 혁신적인 제품 시리즈", "ar": "سلسلة منتجات مبتكرة مبنية على تقنية البلوكشين", "es": "Serie de productos innovadores basados en tecnología blockchain"}',
 'blockchain-products', 1, 'product', 0, true),

('{"zh": "技术文章", "en": "Technical Articles", "ja": "技術記事", "ko": "기술 기사", "ar": "مقالات تقنية", "es": "Artículos Técnicos"}',
 '{"zh": "分享区块链和CMS技术的最新见解", "en": "Share the latest insights on blockchain and CMS technology", "ja": "ブロックチェーンとCMS技術の最新インサイトを共有", "ko": "블록체인 및 CMS 기술의 최신 인사이트 공유", "ar": "مشاركة أحدث الأفكار حول تقنية البلوكشين وCMS", "es": "Compartir las últimas perspectivas sobre tecnología blockchain y CMS"}',
 'technical-articles', 1, 'article', 0, true),

('{"zh": "公司新闻", "en": "Company News", "ja": "会社ニュース", "ko": "회사 뉴스", "ar": "أخبار الشركة", "es": "Noticias de la Empresa"}',
 '{"zh": "公司最新动态和发展新闻", "en": "Latest company developments and news", "ja": "会社の最新動向とニュース", "ko": "회사의 최신 발전과 뉴스", "ar": "أحدث تطورات الشركة والأخبار", "es": "Últimos desarrollos y noticias de la empresa"}',
 'company-news', 1, 'article', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- Create subcategories
INSERT INTO content_categories (name, description, slug, parent_id, hierarchy_level, content_type, display_order, is_active)
SELECT
    '{"zh": "DeFi产品", "en": "DeFi Products", "ja": "DeFi製品", "ko": "DeFi 제품", "ar": "منتجات DeFi", "es": "Productos DeFi"}',
    '{"zh": "去中心化金融产品系列", "en": "Decentralized finance product series", "ja": "分散型金融製品シリーズ", "ko": "탈중앙화 금융 제품 시리즈", "ar": "سلسلة منتجات التمويل اللامركزي", "es": "Serie de productos de finanzas descentralizadas"}',
    'defi-products',
    id,
    2,
    'product',
    0,
    true
FROM content_categories WHERE slug = 'blockchain-products'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO content_categories (name, description, slug, parent_id, hierarchy_level, content_type, display_order, is_active)
SELECT
    '{"zh": "NFT产品", "en": "NFT Products", "ja": "NFT製品", "ko": "NFT 제품", "ar": "منتجات NFT", "es": "Productos NFT"}',
    '{"zh": "数字收藏品和NFT相关产品", "en": "Digital collectibles and NFT related products", "ja": "デジタルコレクティブルとNFT関連製品", "ko": "디지털 수집품 및 NFT 관련 제품", "ar": "المقتنيات الرقمية ومنتجات NFT ذات الصلة", "es": "Coleccionables digitales y productos relacionados con NFT"}',
    'nft-products',
    id,
    2,
    'product',
    1,
    true
FROM content_categories WHERE slug = 'blockchain-products'
ON CONFLICT (slug) DO NOTHING;

-- Create sample products
INSERT INTO products (category_id, name, description, specifications, pricing, images, slug, tags, translation_status, is_published) VALUES
(
    (SELECT id FROM content_categories WHERE slug = 'defi-products'),
    '{"zh": "智能合约钱包", "en": "Smart Contract Wallet", "ja": "スマートコントラクトウォレット", "ko": "스마트 계약 지갑", "ar": "محفظة العقود الذكية", "es": "Cartera de Contratos Inteligentes"}',
    '{"zh": "安全的去中心化钱包，支持多链资产管理", "en": "Secure decentralized wallet supporting multi-chain asset management", "ja": "マルチチェーン資産管理をサポートする安全な分散型ウォレット", "ko": "멀티체인 자산 관리를 지원하는 안전한 분산형 지갑", "ar": "محفظة لامركزية آمنة تدعم إدارة الأصول متعددة السلاسل", "es": "Cartera descentralizada segura que admite gestión de activos multicadena"}',
    '{"zh": "• 支持ETH、BSC、Polygon等多条链\n• 硬件钱包集成\n• 多重签名安全\n• 实时价格监控", "en": "• Supports ETH, BSC, Polygon and more\n• Hardware wallet integration\n• Multi-signature security\n• Real-time price monitoring", "ja": "• ETH、BSC、Polygonなどをサポート\n• ハードウェアウォレット統合\n• マルチシグネチャセキュリティ\n• リアルタイム価格監視", "ko": "• ETH, BSC, Polygon 등 지원\n• 하드웨어 지갑 통합\n• 다중 서명 보안\n• 실시간 가격 모니터링", "ar": "• يدعم ETH وBSC وPolygon وغيرها\n• تكامل محفظة الأجهزة\n• أمان متعدد التوقيعات\n• مراقبة الأسعار في الوقت الفعلي", "es": "• Soporta ETH, BSC, Polygon y más\n• Integración de billetera de hardware\n• Seguridad de multifirma\n• Monitoreo de precios en tiempo real"}',
    '{"currency": "CNY", "amount": 299, "discountedAmount": 199}',
    ARRAY['/images/products/wallet-1.jpg', '/images/products/wallet-2.jpg'],
    'smart-contract-wallet',
    ARRAY['DeFi', '钱包', '多链', '安全'],
    'published',
    true
),
(
    (SELECT id FROM content_categories WHERE slug = 'nft-products'),
    '{"zh": "NFT交易平台", "en": "NFT Trading Platform", "ja": "NFT取引プラットフォーム", "ko": "NFT 거래 플랫폼", "ar": "منصة تداول NFT", "es": "Plataforma de Comercio NFT"}',
    '{"zh": "专业的NFT交易平台，支持多种区块链网络", "en": "Professional NFT trading platform supporting multiple blockchain networks", "ja": "複数のブロックチェーンネットワークをサポートするプロフェッショナルNFT取引プラットフォーム", "ko": "다중 블록체인 네트워크를 지원하는 전문 NFT 거래 플랫폼", "ar": "منصة تداول NFT احترافية تدعم شبكات البلوكشين المتعددة", "es": "Plataforma profesional de comercio NFT que admite múltiples redes blockchain"}',
    '{"zh": "• 支持Ethereum、Solana、Polygon\n• 实时交易数据\n• 智能合约审计\n• 版税自动分配", "en": "• Supports Ethereum, Solana, Polygon\n• Real-time trading data\n• Smart contract auditing\n• Automatic royalty distribution", "ja": "• Ethereum、Solana、Polygonをサポート\n• リアルタイム取引データ\n• スマートコントラクト監査\n• 自動ロイヤリティ分配", "ko": "• Ethereum, Solana, Polygon 지원\n• 실시간 거래 데이터\n• 스마트 계약 감사\n• 자동 로열티 분배", "ar": "• يدعم Ethereum وSolana وPolygon\n• بيانات التداول في الوقت الفعلي\n• تدقيق العقود الذكية\n• توزيع الإتاوات التلقائي", "es": "• Soporta Ethereum, Solana, Polygon\n• Datos de trading en tiempo real\n• Auditoría de contratos inteligentes\n• Distribución automática de regalías"}',
    '{"currency": "CNY", "amount": 999}',
    ARRAY['/images/products/nft-platform-1.jpg', '/images/products/nft-platform-2.jpg'],
    'nft-trading-platform',
    ARRAY['NFT', '交易平台', '区块链', '收藏品'],
    'published',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Create sample articles
INSERT INTO articles (category_id, title, content, excerpt, featured_image, author_id, slug, tags, translation_status, is_published) VALUES
(
    (SELECT id FROM content_categories WHERE slug = 'technical-articles'),
    '{"zh": "区块链技术在CMS中的创新应用", "en": "Innovative Applications of Blockchain Technology in CMS", "ja": "CMSにおけるブロックチェーン技術の革新的応用", "ko": "CMS에서 블록체인 기술의 혁신적 적용", "ar": "التطبيقات المبتكرة لتقنية البلوكشين في CMS", "es": "Aplicaciones Innovadoras de la Tecnología Blockchain en CMS"}',
    '{"zh": "本文探讨了区块链技术如何革新传统CMS系统的安全性、透明性和内容管理效率。通过具体案例分析，展示了区块链CMS的实际应用价值和发展前景。", "en": "This article explores how blockchain technology revolutionizes the security, transparency, and content management efficiency of traditional CMS systems. Through specific case studies, it demonstrates the practical application value and development prospects of blockchain CMS.", "ja": "この記事では、ブロックチェーン技術が従来のCMSシステムのセキュリティ、透明性、コンテンツ管理効率をどのように革新するかを探求します。具体的なケーススタディを通じて、ブロックチェーンCMSの実用的応用価値と発展前景を示します。", "ko": "이 기사는 블록체인 기술이 기존 CMS 시스템의 보안, 투명성 및 콘텐츠 관리 효율성을 어떻게 혁신하는지 탐구합니다. 구체적인 사례 연구를 통해 블록체인 CMS의 실용적 적용 가치와 발전 전망을 보여줍니다.", "ar": "تستكشف هذه المقالة كيفية قيام تقنية البلوكشين بإحداث ثورة في أمان وشفافية وكفاءة إدارة المحتوى لأنظمة CMS التقليدية. من خلال دراسات الحالة المحددة، تظهر القيمة العملية للتطبيق وآفاق التطوير لـ CMS البلوكشين.", "es": "Este artículo explora cómo la tecnología blockchain revoluciona la seguridad, transparencia y eficiencia de gestión de contenido de los sistemas CMS tradicionales. A través de estudios de caso específicos, demuestra el valor práctico de la aplicación y las perspectivas de desarrollo del CMS blockchain."}',
    '{"zh": "区块链技术正在革新传统CMS系统，本文深入探讨其创新应用和发展前景。", "en": "Blockchain technology is revolutionizing traditional CMS systems. This article explores its innovative applications and development prospects.", "ja": "ブロックチェーン技術は従来のCMSシステムに革命をもたらしています。この記事では、その革新的応用と発展前景を探求します。", "ko": "블록체인 기술은 기존 CMS 시스템에 혁명을 가져오고 있습니다. 이 기사는 혁신적 적용과 발전 전망을 탐구합니다.", "ar": "تقنية البلوكشين تحدث ثورة في أنظمة CMS التقليدية. تستكشف هذه المقالة تطبيقاتها المبتكرة وآفاق تطويرها.", "es": "La tecnología blockchain está revolucionando los sistemas CMS tradicionales. Este artículo explora sus aplicaciones innovadoras y perspectivas de desarrollo."}',
    '/images/articles/blockchain-cms.jpg',
    (SELECT id FROM admin_users WHERE email = 'admin@maliang.com'),
    'blockchain-cms-innovation',
    ARRAY['区块链', 'CMS', '技术创新', '内容管理'],
    'published',
    true
),
(
    (SELECT id FROM content_categories WHERE slug = 'company-news'),
    '{"zh": "Maliang CMS获得新一轮融资", "en": "Maliang CMS Secures New Round of Funding", "ja": "Maliang CMSが新たな資金調達を確保", "ko": "Maliang CMS가 새로운 자금 조달을 확보", "ar": "يحصل Maliang CMS على جولة تمويل جديدة", "es": "Maliang CMS Asegura Nueva Ronda de Financiamiento"}',
    '{"zh": "Maliang区块链CMS宣布完成数千万元A轮融资，本轮融资由知名投资机构领投。资金将主要用于产品研发和市场拓展。", "en": "Maliang Blockchain CMS announces the completion of tens of millions of yuan in Series A financing, led by well-known investment institutions. The funds will be mainly used for product development and market expansion.", "ja": "MaliangブロックチェーンCMSは、数千万元のシリーズA資金調達を完了したことを発表します。この資金調達は著名投資機関が主導しました。資金は主に製品開発と市場拡大に使用されます。", "ko": "Maliang 블록체인 CMS는 수천만 위안의 시리즈 A 자금 조달 완료를 발표했습니다. 이번 자금 조달은 유명 투자 기관이 주도했습니다. 자금은 주로 제품 개발과 시장 확대에 사용됩니다.", "ar": "يعلن Maliang Blockchain CMS عن إتمام تمويل سلسلة A بقيمة عشرات الملايين من اليوانات، بقيادة مؤسسات استثمارية مشهورة. سيتم استخدام الأموال بشكل أساسي في تطوير المنتج وتوسيع السوق.", "es": "Maliang Blockchain CMS anuncia la finalización de decenas de millones de yuanes en financiamiento Serie A, liderado por instituciones de inversión reconocidas. Los fondos se utilizarán principalmente para desarrollo de productos y expansión de mercado."}',
    '{"zh": "Maliang区块链CMS完成数千万元A轮融资，加速产品创新和市场拓展。", "en": "Maliang Blockchain CMS completes tens of millions of yuan in Series A financing, accelerating product innovation and market expansion.", "ja": "MaliangブロックチェーンCMSが数千万元のシリーズA資金調達を完了し、製品イノベーションと市場拡大を加速します。", "ko": "Maliang 블록체인 CMS가 수천만 위안의 시리즈 A 자금 조달을 완료하여 제품 혁신과 시장 확대를 가속화합니다.", "ar": "يكمل Maliang Blockchain CMS تمويل سلسلة A بقيمة عشرات الملايين من اليوانات، مما يسرع الابتكار في المنتج وتوسيع السوق.", "es": "Maliang Blockchain CMS completa decenas de millones de yuanes en financiamiento Serie A, acelerando la innovación de productos y la expansión del mercado."}',
    '/images/articles/funding-news.jpg',
    (SELECT id FROM admin_users WHERE email = 'admin@maliang.com'),
    'maliang-cms-series-a-funding',
    ARRAY['融资', '公司新闻', '发展'],
    'published',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Create sample static pages
INSERT INTO static_pages (title, content, slug, meta_title, meta_description, translation_status, is_published) VALUES
(
    '{"zh": "关于我们", "en": "About Us", "ja": "私たちについて", "ko": "회사 소개", "ar": "معلومات عنا", "es": "Acerca de Nosotros"}',
    '{"zh": "## 关于Maliang\n\nMaliang区块链CMS是基于区块链技术构建的现代化内容管理系统。我们致力于为企业提供安全、高效、可靠的内容创作和管理解决方案。\n\n### 我们的使命\n\n通过区块链技术和创新设计，重新定义内容管理的安全性和可靠性，为全球企业提供值得信赖的内容创作和管理平台。\n\n### 核心价值\n\n- **创新驱动**：不断探索前沿技术\n- **安全第一**：内容安全是我们的核心价值\n- **用户导向**：深入理解用户需求\n- **持续改进**：不断迭代产品，为用户创造更大价值", "en": "## About Maliang\n\nMaliang Blockchain CMS is a modern content management system built on blockchain technology. We are committed to providing enterprises with secure, efficient, and reliable content creation and management solutions.\n\n### Our Mission\n\nThrough blockchain technology and innovative design, redefine the security and reliability of content management, providing global enterprises with trustworthy content creation and management platforms.\n\n### Core Values\n\n- **Innovation Driven**: Continuously explore cutting-edge technology\n- **Security First**: Content security is our core value\n- **User Oriented**: Deeply understand user needs\n- **Continuous Improvement**: Continuously iterate products to create greater value for users", "ja": "## Maliangについて\n\nMaliangブロックチェーンCMSは、ブロックチェーン技術に基づいて構築された現代的なコンテンツ管理システムです。企業に安全で効率的、信頼性の高いコンテンツ作成と管理ソリューションを提供することに専念しています。\n\n### 私たちの使命\n\nブロックチェーン技術と革新的なデザインを通じて、コンテンツ管理のセキュリティと信頼性を再定義し、世界中の企業に信頼できるコンテンツ作成と管理プラットフォームを提供します。\n\n### コアバリュー\n\n- **イノベーション駆動**：最先端技術を継続的に探求\n- **セキュリティファースト**：コンテンツセキュリティは私たちのコアバリュー\n- **ユーザー指向**：ユーザーニーズを深く理解\n- **継続的改善**：製品を継続的に反復し、ユーザーに大きな価値を創造", "ko": "## Maliang 소개\n\nMaliang 블록체인 CMS는 블록체인 기술을 기반으로 구축된 현대적인 콘텐츠 관리 시스템입니다. 기업에 안전하고 효율적이며 신뢰할 수 있는 콘텐츠 생성 및 관리 솔루션을 제공하는 데 전념하고 있습니다.\n\n### 우리의 사명\n\n블록체인 기술과 혁신적인 디자인을 통해 콘텐츠 관리의 보안성과 신뢰성을 재정의하여 글로벌 기업에 신뢰할 수 있는 콘텐츠 생성 및 관리 플랫폼을 제공합니다.\n\n### 핵심 가치\n\n- **혁신 주도**：최첨단 기술을 지속적으로 탐구\n- **보안 우선**：콘텐츠 보안은 우리의 핵심 가치\n- **사용자 지향**：사용자 요구를 깊이 이해\n- **지속적 개선**：제품을 지속적으로 반복하여 사용자에게 더 큰 가치 창출", "ar": "## حول Maliang\n\nMaliang Blockchain CMS هو نظام إدارة محتوى حديث مبني على تقنية البلوكشين. نحن ملتزمون بتزويد المؤسسات بحلول إنشاء وإدارة محتوى آمنة وفعالة وموثوقة.\n\n### مهمتنا\n\nمن خلال تقنية البلوكشين والتصميم المبتكر، إعادة تعريف أمان وموثوقية إدارة المحتوى، وتزويد المؤسسات العالمية بمنصات إنشاء وإدارة محتوى موثوقة.\n\n### القيم الأساسية\n\n- **الابتكار المدفوع**：استكشاف التقنيات المتطورة باستمرار\n- **الأمان أولاً**：أمان المحتوى هو قيمتنا الأساسية\n- **التوجه نحو المستخدم**：فهم عميق لاحتياجات المستخدم\n- **التحسين المستمر**：تكرار المنتج باستمرار لخلق قيمة أكبر للمستخدمين", "es": "## Acerca de Maliang\n\nMaliang Blockchain CMS es un sistema moderno de gestión de contenido construido sobre tecnología blockchain. Estamos comprometidos a proporcionar a las empresas soluciones seguras, eficientes y confiables de creación y gestión de contenido.\n\n### Nuestra Misión\n\nA través de la tecnología blockchain y el diseño innovador, redefinir la seguridad y confiabilidad de la gestión de contenido, proporcionando plataformas confiables de creación y gestión de contenido para empresas globales.\n\n### Valores Principales\n\n- **Innovación Impulsada**: Explorar continuamente tecnología de vanguardia\n- **Seguridad Primero**: La seguridad del contenido es nuestro valor principal\n- **Orientado al Usuario**: Comprensión profunda de las necesidades del usuario\n- **Mejora Continua**: Iterar productos continuamente para crear mayor valor para los usuarios"}',
    'about',
    '{"zh": "关于我们 - Maliang区块链CMS", "en": "About Us - Maliang Blockchain CMS", "ja": "私たちについて - MaliangブロックチェーンCMS", "ko": "회사 소개 - Maliang 블록체인 CMS", "ar": "معلومات عنا - Maliang Blockchain CMS", "es": "Acerca de Nosotros - Maliang Blockchain CMS"}',
    '{"zh": "了解Maliang区块链CMS团队的故事、使命和愿景", "en": "Learn about the story, mission and vision of the Maliang Blockchain CMS team", "ja": "MaliangブロックチェーンCMSチームのストーリー、使命、ビジョンについて学ぶ", "ko": "Maliang 블록체인 CMS 팀의 이야기, 사명 및 비전에 대해 알아보기", "ar": "تعرف على قصة ومهمة ورؤية فريق Maliang Blockchain CMS", "es": "Conoce la historia, misión y visión del equipo de Maliang Blockchain CMS"}',
    'published',
    true
),
(
    '{"zh": "联系我们", "en": "Contact Us", "ja": "お問い合わせ", "ko": "문의하기", "ar": "اتصل بنا", "es": "Contáctanos"}',
    '{"zh": "## 联系方式\n\n我们很乐意为您提供帮助！\n\n### 邮箱\ncontact@maliang.com\n\n### 电话\n+86 400-888-8888\n\n### 地址\n北京市朝阳区科技园区创新大厦15层\n\n### 工作时间\n周一至周五 9:00-18:00 (北京时间)", "en": "## Contact Information\n\nWe are happy to help you!\n\n### Email\ncontact@maliang.com\n\n### Phone\n+86 400-888-8888\n\n### Address\n15th Floor, Innovation Building, Technology Park, Chaoyang District, Beijing\n\n### Business Hours\nMonday to Friday 9:00-18:00 (Beijing Time)", "ja": "## 連絡先情報\n\nお客様のお手伝いをいたします！\n\n### メール\ncontact@maliang.com\n\n### 電話\n+86 400-888-8888\n\n### 住所\n北京市朝陽区科技园区イノベーションビル15階\n\n### 営業時間\n月曜日から金曜日 9:00-18:00 (北京時間)", "ko": "## 연락처 정보\n\n고객님을 도와드리겠습니다!\n\n### 이메일\ncontact@maliang.com\n\n### 전화\n+86 400-888-8888\n\n### 주소\n베이징시 차오양구 기술단지 혁신빌딩 15층\n\n### 영업 시간\n월요일부터 금요일 9:00-18:00 (베이징 시간)", "ar": "## معلومات الاتصال\n\nنحن سعداء لمساعدتك!\n\n### البريد الإلكتروني\ncontact@maliang.com\n\n### الهاتف\n+86 400-888-8888\n\n### العنوان\nالطابق 15، مبنى الابتكار، حديقة التكنولوجيا، منطقة تشاويانغ، بكين\n\n### ساعات العمل\nالاثنين إلى الجمعة 9:00-18:00 (توقيت بكين)", "es": "## Información de Contacto\n\n¡Estamos encantados de ayudarte!\n\n### Correo Electrónico\ncontact@maliang.com\n\n### Teléfono\n+86 400-888-8888\n\n### Dirección\nPiso 15, Edificio de Innovación, Parque Tecnológico, Distrito Chaoyang, Beijing\n\n### Horario de Oficina\nLunes a Viernes 9:00-18:00 (Hora de Beijing)"}',
    'contact',
    '{"zh": "联系我们 - Maliang区块链CMS", "en": "Contact Us - Maliang Blockchain CMS", "ja": "お問い合わせ - MaliangブロックチェーンCMS", "ko": "문의하기 - Maliang 블록체인 CMS", "ar": "اتصل بنا - Maliang Blockchain CMS", "es": "Contáctanos - Maliang Blockchain CMS"}',
    '{"zh": "与Maliang团队取得联系，了解区块链CMS解决方案", "en": "Get in touch with the Maliang team to learn about blockchain CMS solutions", "ja": "Maliangチームに連絡してブロックチェーンCMSソリューションについて学ぶ", "ko": "Maliang 팀에 연락하여 블록체인 CMS 솔루션에 대해 알아보기", "ar": "تواصل مع فريق Maliang لمعرفة حلول CMS البلوكشين", "es": "Ponte en contacto con el equipo de Maliang para conocer las soluciones CMS blockchain"}',
    'published',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Create sample banners
INSERT INTO banners (title, image_desktop, image_mobile, link_url, display_order, is_active) VALUES
(
    '{"zh": "欢迎使用Maliang CMS", "en": "Welcome to Maliang CMS", "ja": "Maliang CMSへようこそ", "ko": "Maliang CMS에 오신 것을 환영합니다", "ar": "مرحباً بك في Maliang CMS", "es": "Bienvenido a Maliang CMS"}',
    '/images/banners/desktop-welcome.jpg',
    '/images/banners/mobile-welcome.jpg',
    '/products',
    0,
    true
),
(
    '{"zh": "区块链技术革新", "en": "Blockchain Technology Innovation", "ja": "ブロックチェーン技術革新", "ko": "블록체인 기술 혁신", "ar": "ابتكار تقنية البلوكشين", "es": "Innovación en Tecnología Blockchain"}',
    '/images/banners/desktop-blockchain.jpg',
    '/images/banners/mobile-blockchain.jpg',
    '/articles',
    1,
    true
)
ON CONFLICT DO NOTHING;

-- Create sample job postings
INSERT INTO job_postings (title, description, requirements, location, employment_type, application_deadline, is_active) VALUES
(
    '{"zh": "高级前端开发工程师", "en": "Senior Frontend Developer", "ja": "シニアフロントエンド開発者", "ko": "시니어 프론트엔드 개발자", "ar": "مطور الواجهة الأمامية الأول", "es": "Desarrollador Frontend Senior"}',
    '{"zh": "我们正在寻找一位经验丰富的前端开发工程师，加入我们的区块链CMS产品团队。", "en": "We are looking for an experienced frontend developer to join our blockchain CMS product team.", "ja": "ブロックチェーンCMSプロダクトチームに参加する経験豊富なフロントエンド開発者を募集しています。", "ko": "블록체인 CMS 제품 팀에 참여할 경험 많은 프론트엔드 개발자를 찾고 있습니다.", "ar": "نبحث عن مطور واجهة أمامية ذو خبرة للانضمام إلى فريق منتج CMS البلوكشين لدينا.", "es": "Buscamos un desarrollador frontend experimentado para unirse a nuestro equipo de productos CMS blockchain."}',
    '{"zh": "• 5年以上前端开发经验\n• 精通React、TypeScript\n• 熟悉区块链技术优先\n• 良好的英语沟通能力", "en": "• 5+ years of frontend development experience\n• Proficient in React, TypeScript\n• Familiar with blockchain technology preferred\n• Good English communication skills", "ja": "• 5年以上のフロントエンド開発経験\n• React、TypeScriptに精通\n• ブロックチェーン技術に詳しい方を優先\n• 良好な英語コミュニケーションスキル", "ko": "• 5년 이상의 프론트엔드 개발 경험\n• React, TypeScript에 능숙\n• 블록체인 기술에 익숙한 사람 우선\n• 좋은 영어 커뮤니케이션 스킬", "ar": "• 5 سنوات خبرة في تطوير الواجهة الأمامية\n• ماهر في React وTypeScript\n• المعرفة بتقنية البلوكشين مفضلة\n• مهارات تواصل جيدة باللغة الإنجليزية", "es": "• 5+ años de experiencia en desarrollo frontend\n• Proficiente en React, TypeScript\n• Familiaridad con tecnología blockchain preferida\n• Buenas habilidades de comunicación en inglés"}',
    '{"zh": "北京/深圳/远程", "en": "Beijing/Shenzhen/Remote", "ja": "北京/深圳/リモート", "ko": "베이징/선전/원격", "ar": "بكين/شنزن/عن بعد", "es": "Beijing/Shenzhen/Remoto"}',
    '全职',
    (NOW() + INTERVAL '30 days')::timestamptz,
    true
),
(
    '{"zh": "区块链技术专家", "en": "Blockchain Technology Specialist", "ja": "ブロックチェーン技術スペシャリスト", "ko": "블록체인 기술 전문가", "ar": "أخصائي تقنية البلوكشين", "es": "Especialista en Tecnología Blockchain"}',
    '{"zh": "寻找区块链技术专家，负责智能合约开发和区块链系统架构设计。", "en": "Looking for blockchain technology specialist responsible for smart contract development and blockchain system architecture design.", "ja": "スマートコントラクト開発とブロックチェーンシステムアーキテクチャ設計を担当するブロックチェーン技術スペシャリストを募集しています。", "ko": "스마트 계약 개발과 블록체인 시스템 아키텍처 설계를 담당할 블록체인 기술 전문가를 찾고 있습니다.", "ar": "البحث عن أخصائي تقنية البلوكشين مسؤول عن تطوير العقود الذكية وتصميم بنية نظام البلوكشين.", "es": "Buscando especialista en tecnología blockchain responsable del desarrollo de contratos inteligentes y diseño de arquitectura de sistemas blockchain."}',
    '{"zh": "• 3年以上区块链开发经验\n• 精通Solidity智能合约\n• 熟悉以太坊、比特币等主流区块链\n• 密码学基础知识", "en": "• 3+ years of blockchain development experience\n• Proficient in Solidity smart contracts\n• Familiar with mainstream blockchains like Ethereum, Bitcoin\n• Cryptography fundamentals", "ja": "• 3年以上のブロックチェーン開発経験\n• Solidityスマートコントラクトに精通\n• Ethereum、Bitcoinなどの主流ブロックチェーンに詳しい\n• 暗号学の基礎知識", "ko": "• 3년 이상의 블록체인 개발 경험\n• Solidity 스마트 계약에 능숙\n• Ethereum, Bitcoin 등 주류 블록체인에 익숙\n• 암호학 기초 지식", "ar": "• 3 سنوات خبرة في تطوير البلوكشين\n• ماهر في عقود Solidity الذكية\n• المعرفة بسلاسل الكتل الرئيسية مثل Ethereum وBitcoin\n• أساسيات التشفير", "es": "• 3+ años de experiencia en desarrollo blockchain\n• Proficiente en contratos inteligentes Solidity\n• Familiaridad con blockchains mainstream como Ethereum, Bitcoin\n• Fundamentos de criptografía"}',
    '{"zh": "北京", "en": "Beijing", "ja": "北京", "ko": "베이징", "ar": "بكين", "es": "Beijing"}',
    '全职',
    (NOW() + INTERVAL '45 days')::timestamptz,
    true
)
ON CONFLICT DO NOTHING;

-- Create sample tags
INSERT INTO content_tags (name, slug, usage_count) VALUES
('{"zh": "区块链", "en": "Blockchain", "ja": "ブロックチェーン", "ko": "블록체인", "ar": "البلوكشين", "es": "Blockchain"}', 'blockchain', 5),
('{"zh": "CMS", "en": "CMS", "ja": "CMS", "ko": "CMS", "ar": "نظام إدارة المحتوى", "es": "CMS"}', 'cms', 8),
('{"zh": "技术创新", "en": "Technological Innovation", "ja": "技術革新", "ko": "기술 혁신", "ar": "الابتكار التكنولوجي", "es": "Innovación Tecnológica"}', 'technology-innovation', 3),
('{"zh": "内容管理", "en": "Content Management", "ja": "コンテンツ管理", "ko": "콘텐츠 관리", "ar": "إدارة المحتوى", "es": "Gestión de Contenidos"}', 'content-management', 6),
('{"zh": "多语言", "en": "Multilingual", "ja": "多言語", "ko": "다국어", "ar": "متعدد اللغات", "es": "Multilingüe"}', 'multi-language', 4),
('{"zh": "融资", "en": "Financing", "ja": "資金調達", "ko": "자금 조달", "ar": "تمويل", "es": "Financiación"}', 'funding', 2),
('{"zh": "公司新闻", "en": "Company News", "ja": "会社ニュース", "ko": "회사 뉴스", "ar": "أخبار الشركة", "es": "Noticias de la Empresa"}', 'company-news', 3),
('{"zh": "发展", "en": "Development", "ja": "開発", "ko": "개발", "ar": "تطوير", "es": "Desarrollo"}', 'development', 4)
ON CONFLICT (slug) DO NOTHING;

-- Link products to tags
INSERT INTO products_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, content_tags t WHERE p.slug = 'smart-contract-wallet' AND t.slug IN ('blockchain', 'cms', 'multi-language');

INSERT INTO products_tags (product_id, tag_id)
SELECT p.id, t.id FROM products p, content_tags t WHERE p.slug = 'nft-trading-platform' AND t.slug IN ('blockchain', 'cms', 'technology-innovation');

-- Link articles to tags
INSERT INTO articles_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, content_tags t WHERE a.slug = 'blockchain-cms-innovation' AND t.slug IN ('blockchain', 'cms', 'technology-innovation', 'content-management');

INSERT INTO articles_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, content_tags t WHERE a.slug = 'maliang-cms-series-a-funding' AND t.slug IN ('funding', 'company-news', 'development');

-- Create SEO configurations
INSERT INTO seo_configurations (page_type, meta_title, meta_description, meta_keywords) VALUES
('homepage',
 '{"zh": "Maliang区块链CMS - 专业的内容管理系统", "en": "Maliang Blockchain CMS - Professional Content Management System", "ja": "MaliangブロックチェーンCMS - プロフェッショナルコンテンツ管理システム", "ko": "Maliang 블록체인 CMS - 전문 콘텐츠 관리 시스템", "ar": "Maliang Blockchain CMS - نظام إدارة المحتوى المهني", "es": "Maliang Blockchain CMS - Sistema Profesional de Gestión de Contenido"}',
 '{"zh": "基于区块链技术的现代化内容管理系统，支持多语言、暗黑科技风格设计", "en": "Modern content management system based on blockchain technology, supporting multi-language and dark sci-fi design", "ja": "ブロックチェーン技術に基づく現代的なコンテンツ管理システム、多言語とダークSFスタイルデザインをサポート", "ko": "블록체인 기술 기반의 현대적인 콘텐츠 관리 시스템, 다국어 및 다크 SF 스타일 디자인 지원", "ar": "نظام إدارة محتوى حديث مبني على تقنية البلوكشين، يدعم متعدد اللغات وتصميم الخيال العلمي المظلم", "es": "Sistema moderno de gestión de contenido basado en tecnología blockchain, compatible con múltiples idiomas y diseño oscuro de ciencia ficción"}',
 '{"zh": "区块链,CMS,内容管理,暗黑科技,Maliang", "en": "blockchain,CMS,content management,dark sci-fi,Maliang", "ja": "ブロックチェーン,CMS,コンテンツ管理,ダークSF,Maliang", "ko": "블록체인,CMS,콘텐츠 관리,다크 SF,Maliang", "ar": "البلوكشين,CMS,إدارة المحتوى,الخيال العلمي المظلم,Maliang", "es": "blockchain,CMS,gestión de contenido,ciencia ficción oscura,Maliang"}'
),
('products',
 '{"zh": "产品 - Maliang区块链CMS", "en": "Products - Maliang Blockchain CMS", "ja": "製品 - MaliangブロックチェーンCMS", "ko": "제품 - Maliang 블록체인 CMS", "ar": "المنتجات - Maliang Blockchain CMS", "es": "Productos - Maliang Blockchain CMS"}',
 '{"zh": "探索我们的区块链CMS产品系列，支持多语言内容管理", "en": "Explore our blockchain CMS product series, supporting multi-language content management", "ja": "ブロックチェーンCMS製品シリーズを探索、多言語コンテンツ管理をサポート", "ko": "블록체인 CMS 제품 시리즈 탐색, 다국어 콘텐츠 관리 지원", "ar": "استكشف سلسلة منتجات CMS البلوكشين لدينا، تدعم إدارة المحتوى متعدد اللغات", "es": "Explora nuestra serie de productos CMS blockchain, compatible con gestión de contenido multilingüe"}',
 '{"zh": "区块链CMS,产品,内容管理,解决方案", "en": "blockchain CMS,products,content management,solutions", "ja": "ブロックチェーンCMS,製品,コンテンツ管理,ソリューション", "ko": "블록체인 CMS,제품,콘텐츠 관리,솔루션", "ar": "CMS البلوكشين,المنتجات,إدارة المحتوى,الحلول", "es": "CMS blockchain,productos,gestión de contenido,soluciones"}'
),
('articles',
 '{"zh": "文章 - Maliang区块链CMS", "en": "Articles - Maliang Blockchain CMS", "ja": "記事 - MaliangブロックチェーンCMS", "ko": "기사 - Maliang 블록체인 CMS", "ar": "المقالات - Maliang Blockchain CMS", "es": "Artículos - Maliang Blockchain CMS"}',
 '{"zh": "分享区块链CMS技术的最新见解和最佳实践", "en": "Share the latest insights and best practices on blockchain CMS technology", "ja": "ブロックチェーンCMS技術の最新インサイトとベストプラクティスを共有", "ko": "블록체인 CMS 기술의 최신 인사이트와 모범 사례 공유", "ar": "مشاركة أحدث الأفكار وأفضل الممارسات في تقنية CMS البلوكشين", "es": "Compartir las últimas perspectivas y mejores prácticas sobre tecnología CMS blockchain"}',
 '{"zh": "区块链,CMS,技术文章,最佳实践", "en": "blockchain,CMS,technical articles,best practices", "ja": "ブロックチェーン,CMS,技術記事,ベストプラクティス", "ko": "블록체인,CMS,기술 기사,모범 사례", "ar": "البلوكشين,CMS,مقالات تقنية,أفضل الممارسات", "es": "blockchain,CMS,artículos técnicos,mejores prácticas"}'
)
ON CONFLICT (page_type, page_id) DO NOTHING;

-- Update tag usage counts
UPDATE content_tags SET usage_count = (
    SELECT COUNT(*) FROM products_tags WHERE tag_id = content_tags.id
) + (
    SELECT COUNT(*) FROM articles_tags WHERE tag_id = content_tags.id
);
