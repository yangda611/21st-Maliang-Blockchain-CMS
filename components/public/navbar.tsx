/**
 * Navbar Component
 * Main navigation bar for the public site with multi-language support
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import LanguageSelector from '@/components/public/language-selector';

interface NavbarProps {
  lang?: string;
}

export default function Navbar({ lang = 'zh' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 多语言导航菜单
  const navigation = {
    zh: [
      { name: '首页', href: '/' },
      { name: '产品', href: '/products' },
      { name: '文章', href: '/articles' },
      { name: '关于我们', href: '/about' },
      { name: '联系我们', href: '/contact' },
    ],
    en: [
      { name: 'Home', href: '/' },
      { name: 'Products', href: '/products' },
      { name: 'Articles', href: '/articles' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
    ],
    ja: [
      { name: 'ホーム', href: '/' },
      { name: '製品', href: '/products' },
      { name: '記事', href: '/articles' },
      { name: '私たちについて', href: '/about' },
      { name: 'お問い合わせ', href: '/contact' },
    ],
    ko: [
      { name: '홈', href: '/' },
      { name: '제품', href: '/products' },
      { name: '기사', href: '/articles' },
      { name: '회사 소개', href: '/about' },
      { name: '문의하기', href: '/contact' },
    ],
    ar: [
      { name: 'الرئيسية', href: '/' },
      { name: 'المنتجات', href: '/products' },
      { name: 'المقالات', href: '/articles' },
      { name: 'معلومات عنا', href: '/about' },
      { name: 'اتصل بنا', href: '/contact' },
    ],
    es: [
      { name: 'Inicio', href: '/' },
      { name: 'Productos', href: '/products' },
      { name: 'Artículos', href: '/articles' },
      { name: 'Acerca de Nosotros', href: '/about' },
      { name: 'Contáctanos', href: '/contact' },
    ],
  };

  const currentNavigation = navigation[lang as keyof typeof navigation] || navigation.zh;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            >
              Codexia
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
