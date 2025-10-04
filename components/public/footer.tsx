/**
 * Footer Component
 * Site footer with links and information with multi-language support
 */

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'zh' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // 多语言页脚内容
  const content = {
    zh: {
      description: '还在跟客户解释哪个是真哪个是假？累不累？让每个产品自己开口说话！',
      copyright: `© ${currentYear} Codexia. 保留所有权利。`,
      builtWith: '基于区块链技术构建',
      design: '暗黑科技风格设计',
      sections: {
        产品: [
          { name: 'CMS系统', href: '/products' },
          { name: '区块链集成', href: '/blockchain' },
          { name: 'API文档', href: '/docs' },
          { name: '定价', href: '/pricing' },
        ],
        支持: [
          { name: '帮助中心', href: '/help' },
          { name: '联系我们', href: '/contact' },
          { name: '状态页面', href: '/status' },
          { name: '社区', href: '/community' },
        ],
        公司: [
          { name: '关于我们', href: '/about' },
          { name: '博客', href: '/blog' },
          { name: '招聘', href: '/careers' },
          { name: '新闻', href: '/news' },
        ],
        法律: [
          { name: '隐私政策', href: '/privacy' },
          { name: '服务条款', href: '/terms' },
          { name: 'Cookie政策', href: '/cookies' },
          { name: '安全', href: '/security' },
        ],
      },
    },
    en: {
      description: 'Still explaining to customers which is real and which is fake? Tired of it? Let every product speak for itself!',
      copyright: `© ${currentYear} Codexia. All rights reserved.`,
      builtWith: 'Built with Blockchain Technology',
      design: 'Dark Sci-Fi Design',
      sections: {
        Products: [
          { name: 'CMS System', href: '/products' },
          { name: 'Blockchain Integration', href: '/blockchain' },
          { name: 'API Documentation', href: '/docs' },
          { name: 'Pricing', href: '/pricing' },
        ],
        Support: [
          { name: 'Help Center', href: '/help' },
          { name: 'Contact Us', href: '/contact' },
          { name: 'Status Page', href: '/status' },
          { name: 'Community', href: '/community' },
        ],
        Company: [
          { name: 'About Us', href: '/about' },
          { name: 'Blog', href: '/blog' },
          { name: 'Careers', href: '/careers' },
          { name: 'News', href: '/news' },
        ],
        Legal: [
          { name: 'Privacy Policy', href: '/privacy' },
          { name: 'Terms of Service', href: '/terms' },
          { name: 'Cookie Policy', href: '/cookies' },
          { name: 'Security', href: '/security' },
        ],
      },
    },
    ja: {
      description: 'まだ顧客に本物と偽物の区別を説明していますか？もう疲れましたよね？これからは、製品自身に語らせましょう！',
      copyright: `© ${currentYear} Codexia. すべての権利を保有。`,
      builtWith: 'ブロックチェーン技術で構築',
      design: 'ダークSFスタイルデザイン',
      sections: {
        製品: [
          { name: 'CMSシステム', href: '/products' },
          { name: 'ブロックチェーン統合', href: '/blockchain' },
          { name: 'APIドキュメント', href: '/docs' },
          { name: '価格設定', href: '/pricing' },
        ],
        サポート: [
          { name: 'ヘルプセンター', href: '/help' },
          { name: 'お問い合わせ', href: '/contact' },
          { name: 'ステータスページ', href: '/status' },
          { name: 'コミュニティ', href: '/community' },
        ],
        会社: [
          { name: '私たちについて', href: '/about' },
          { name: 'ブログ', href: '/blog' },
          { name: '採用情報', href: '/careers' },
          { name: 'ニュース', href: '/news' },
        ],
        法律: [
          { name: 'プライバシーポリシー', href: '/privacy' },
          { name: '利用規約', href: '/terms' },
          { name: 'Cookieポリシー', href: '/cookies' },
        ],
      },
    },
    ko: {
      description: '아직도 고객에게 어떤 것이 진품이고 가품인지 설명하고 있나요? 지치지 않으세요? 모든 제품이 스스로 말하게 하세요!',
      copyright: `© ${currentYear} Codexia. 모든 권리 보유.`,
      builtWith: '블록체인 기술로 구축',
      design: '다크 SF 스타일 디자인',
      sections: {
        제품: [
          { name: 'CMS 시스템', href: '/products' },
          { name: '블록체인 통합', href: '/blockchain' },
          { name: 'API 문서', href: '/docs' },
          { name: '가격 책정', href: '/pricing' },
        ],
        지원: [
          { name: '도움말 센터', href: '/help' },
          { name: '문의하기', href: '/contact' },
          { name: '상태 페이지', href: '/status' },
          { name: '커뮤니티', href: '/community' },
        ],
        회사: [
          { name: '회사 소개', href: '/about' },
          { name: '블로그', href: '/blog' },
          { name: '채용', href: '/careers' },
          { name: '뉴스', href: '/news' },
        ],
        법률: [
          { name: '개인정보 보호정책', href: '/privacy' },
          { name: '서비스 약관', href: '/terms' },
          { name: '쿠키 정책', href: '/cookies' },
          { name: '보안', href: '/security' },
        ],
      },
    },
    ar: {
      description: 'هل ما زلت تشرح للعملاء أيهما الأصلي وأيهما المقلد؟ أليس هذا مرهقاً؟ دع كل منتج يتحدث عن نفسه!',
      copyright: `© ${currentYear} Codexia. جميع الحقوق محفوظة.`,
      builtWith: 'مبني بتقنية البلوكشين',
      design: 'تصميم الخيال العلمي المظلم',
      sections: {
        المنتجات: [
          { name: 'نظام إدارة المحتوى', href: '/products' },
          { name: 'تكامل البلوكشين', href: '/blockchain' },
          { name: 'وثائق API', href: '/docs' },
          { name: 'التسعير', href: '/pricing' },
        ],
        الدعم: [
          { name: 'مركز المساعدة', href: '/help' },
          { name: 'اتصل بنا', href: '/contact' },
          { name: 'صفحة الحالة', href: '/status' },
          { name: 'المجتمع', href: '/community' },
        ],
        الشركة: [
          { name: 'معلومات عنا', href: '/about' },
          { name: 'المدونة', href: '/blog' },
          { name: 'الوظائف', href: '/careers' },
          { name: 'الأخبار', href: '/news' },
        ],
        القانونية: [
          { name: 'سياسة الخصوصية', href: '/privacy' },
          { name: 'شروط الخدمة', href: '/terms' },
          { name: 'سياسة ملفات تعريف الارتباط', href: '/cookies' },
          { name: 'الأمان', href: '/security' },
        ],
      },
    },
    es: {
      description: '¿Todavía explicándole a sus clientes cuál es el auténtico y cuál es la falsificación? ¿Cansado? ¡Deje que cada producto hable por sí mismo!',
      copyright: `© ${currentYear} Codexia. Todos los derechos reservados.`,
      builtWith: 'Construido con Tecnología Blockchain',
      design: 'Diseño Ciencia Ficción Oscura',
      sections: {
        Productos: [
          { name: 'Sistema CMS', href: '/products' },
          { name: 'Documentación API', href: '/docs' },
          { name: 'Precios', href: '/pricing' },
        ],
        Soporte: [
          { name: 'Centro de Ayuda', href: '/help' },
          { name: 'Contáctanos', href: '/contact' },
          { name: 'Página de Estado', href: '/status' },
          { name: 'Comunidad', href: '/community' },
        ],
        Empresa: [
          { name: 'Acerca de Nosotros', href: '/about' },
          { name: 'Blog', href: '/blog' },
          { name: 'Carreras', href: '/careers' },
          { name: 'Noticias', href: '/news' },
        ],
        Legal: [
          { name: 'Política de Privacidad', href: '/privacy' },
          { name: 'Términos de Servicio', href: '/terms' },
          { name: 'Política de Cookies', href: '/cookies' },
          { name: 'Seguridad', href: '/security' },
        ],
      },
    },
  };

  const currentContent = content[lang as keyof typeof content] || content.zh;

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid gap-8 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-4 block">
              Codexia
            </Link>
            <p className="text-white/60 mb-6 max-w-md">
              {currentContent.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {[
                { name: 'GitHub', icon: Github, href: 'https://github.com' },
                { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
                { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
                { name: 'Email', icon: Mail, href: 'mailto:contact@codexia.com' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-white/60 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(currentContent.sections).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-white/60 text-sm">
              {currentContent.copyright}
            </p>

            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>{currentContent.builtWith}</span>
              <span>•</span>
              <span>{currentContent.design}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
