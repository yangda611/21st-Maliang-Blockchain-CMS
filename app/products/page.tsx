/**
 * Products Listing Page
 * Displays all products with filtering and search
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ProductsList from '@/components/public/products-list';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: '产品 - Maliang区块链CMS',
  description: '探索我们的区块链CMS产品系列，支持多语言内容管理',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ProductsList />
      </main>
      <Footer />
    </div>
  );
}
