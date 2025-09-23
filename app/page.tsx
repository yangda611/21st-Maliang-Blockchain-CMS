import { HeroSection } from "@/components/ui/hero-section-1"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SpeedInsights/>
    </main>
  )
}
