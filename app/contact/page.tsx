/**
 * Contact Page
 * Contact form and company information
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import ContactSection from '@/components/public/contact-section';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: '联系我们 - Maliang区块链CMS',
  description: '与Maliang团队取得联系，了解我们的区块链CMS解决方案',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <ContactSection lang="zh" />
      </main>
      <Footer />
    </div>
  );
}
