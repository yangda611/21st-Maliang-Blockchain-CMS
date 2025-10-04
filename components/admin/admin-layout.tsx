/**
 * Admin Layout Component
 * Dashboard structure with navigation and dark sci-fi aesthetic
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Package,
  Folder,
  Briefcase,
  MessageSquare,
  Languages,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';
import { fadeInUp, slideInLeft } from '@/utils/animations';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: '仪表板', href: '/maliang-admin/dashboard', enLabel: 'Dashboard' },
  { icon: Folder, label: '分类管理', href: '/maliang-admin/categories', enLabel: 'Categories' },
  { icon: Package, label: '产品管理', href: '/maliang-admin/products', enLabel: 'Products' },
  { icon: FileText, label: '文章管理', href: '/maliang-admin/articles', enLabel: 'Articles' },
  { icon: FileText, label: '页面管理', href: '/maliang-admin/pages', enLabel: 'Pages' },
  { icon: Briefcase, label: '招聘管理', href: '/maliang-admin/jobs', enLabel: 'Jobs' },
  { icon: MessageSquare, label: '留言管理', href: '/maliang-admin/messages', enLabel: 'Messages' },
  { icon: Languages, label: '翻译管理', href: '/maliang-admin/translations', enLabel: 'Translations' },
  { icon: Search, label: 'SEO管理', href: '/maliang-admin/seo', enLabel: 'SEO' },
  { icon: Settings, label: '系统设置', href: '/maliang-admin/settings', enLabel: 'Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  // const { adminUser, signOut } = useAuth();

  const handleSignOut = async () => {
    // await signOut();
    console.log('Sign out not implemented yet');
  };

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl"
      >
        <div className="flex h-full items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/maliang-admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20" />
              <span className="hidden md:block text-lg font-bold">Maliang CMS</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
              <User className="h-4 w-4" />
              <span className="text-sm">admin@example.com</span>
            </div>
            <button
              onClick={handleSignOut}
              className="h-10 px-4 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-red-500/20 hover:border-red-500/50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">退出</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-16 bottom-0 z-40 w-64 border-r border-white/10 bg-black/95 backdrop-blur-xl overflow-y-auto ${
              mobileMenuOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <nav className="p-4 space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-white/10 border border-white/20 text-white'
                          : 'border border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="p-4 md:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
