/**
 * About Page
 * Company information, team, and mission
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import AboutSection from '@/components/public/about-section';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: '关于我们 - Maliang区块链CMS',
  description: '了解Maliang团队的故事、使命和愿景',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
