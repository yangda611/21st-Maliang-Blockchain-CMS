/**
 * Product Detail Page
 * Detailed view of a single product
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ProductDetail from '@/components/public/product-detail';
import Footer from '@/components/public/footer';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // In a real app, fetch product data based on params.id
  return {
    title: `产品详情 - Maliang区块链CMS`,
    description: '查看产品详细信息和功能特性',
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ProductDetail productId={params.id} />
      </main>
      <Footer />
    </div>
  );
}
