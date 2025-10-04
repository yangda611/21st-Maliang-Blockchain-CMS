/**
 * Homepage
 * Main landing page with hero section, featured content, and navigation
 */

import { Metadata } from 'next';
import Navbar from '@/components/public/navbar';
import HeroSection from '@/components/public/hero-section';
import PainPointsSection from '@/components/public/sections/pain-points';
import SolutionSection from '@/components/public/sections/solution';
import BenefitsSection from '@/components/public/sections/benefits';
import FinalCTASection from '@/components/public/sections/final-cta';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Codexia 区块链CMS - 专业的内容管理系统',
  description: '基于区块链技术的现代化内容管理系统，支持多语言、暗黑科技风格设计',
  keywords: '区块链,CMS,内容管理,暗黑科技,Codexia',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <HeroSection />
        <PainPointsSection
          imageMap={{
            counterfeits: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/counterfeits.png', alt: '假货横行 - 新品刚上，山寨比你卖得还快？' },
            arbitrage: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/arbitrage.png', alt: '窜货扰价 - 市场价格被打乱，优秀经销商怨声载道？' },
            trust: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/trust.png', alt: '信任缺失 - 客户反复询问真假，品牌忠诚度一降再降？' },
            whackamole: { src: 'https://pvznifymjkunclzzquje.supabase.co/storage/v1/object/public/cms-files/codexia/image/whackamole.png', alt: '打假无力 - 投入巨大，却像打地鼠一样，永远打不完？' },
          }}
        />
        <SolutionSection />
        <BenefitsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
