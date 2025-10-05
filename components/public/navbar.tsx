/**
 * Navbar Component
 * Main navigation bar for the public site with multi-language support
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import LanguageSelector from '@/components/public/language-selector';
import { SUPPORTED_LANGUAGES } from '@/middleware';

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
      <div className="w-full px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            >
              Codexia
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors duration-200 relative group text-sm xl:text-base"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* 语言选择器 - 移动端优化版本 */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {/* 移动端语言切换按钮 */}
            <button
              onClick={() => {
                // 简单的语言切换逻辑，循环切换支持的语言
                const currentIndex = SUPPORTED_LANGUAGES.indexOf(lang as any);
                const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
                const nextLang = SUPPORTED_LANGUAGES[nextIndex];
                window.location.href = `/${nextLang}${window.location.pathname.replace(/^\/[^\/]+/, '')}`;
              }}
              className="sm:hidden p-2 text-white/80 hover:text-white transition-colors"
              aria-label="切换语言"
            >
              <Globe className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
              aria-label={isOpen ? "关闭菜单" : "打开菜单"}
            >
              {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-3 sm:py-4 space-y-1 sm:space-y-2">
                {currentNavigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 sm:px-4 py-2 sm:py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm sm:text-base"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* 移动端语言选择区域 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: currentNavigation.length * 0.05 }}
                  className="border-t border-white/10 pt-3 sm:pt-4 mt-3 sm:mt-4"
                >
                  <div className="px-3 sm:px-4">
                    <p className="text-xs sm:text-sm text-white/60 mb-2 sm:mb-3">选择语言 / Select Language</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { code: 'zh', name: '中文' },
                        { code: 'en', name: 'English' },
                        { code: 'ja', name: '日本語' },
                        { code: 'ko', name: '한국어' },
                      ].map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            const newPath = `/${language.code}${window.location.pathname.replace(/^\/[^\/]+/, '')}`;
                            window.location.href = newPath;
                          }}
                          className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-all ${
                            lang === language.code
                              ? 'bg-white/10 text-white border border-white/20'
                              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {language.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
