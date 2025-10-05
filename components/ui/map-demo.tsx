"use client";
import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";

interface WorldMapDemoProps { lang?: string }

// Lazy-load WorldMap to avoid SSR issues
const WorldMap = dynamic(() => import("@/components/ui/map").then(mod => ({ default: mod.WorldMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  )
});

function WorldMapDemoInner({ lang = 'zh' }: WorldMapDemoProps) {
  const copy = useMemo(() => ({
    zh: {
      title: '全球一张链，连的就是快',
      subtitle: '节点一上线，世界即在线。跨时区、跨地域、零信任成本，价值一跳直达。',
    },
    en: {
      title: 'One Global Chain. Instant Connection.',
      subtitle: 'Spin up a node and you are live worldwide—across timezones and borders with near‑zero trust cost. Value moves in a single hop.',
    },
    ja: {
      title: '世界は一枚のチェーン。速さが正義。',
      subtitle: 'ノードが立ち上がれば世界が即オンライン。時差も距離も超えて、ゼロトラストコストで価値が一跳び。',
    },
    ko: {
      title: '세상은 하나의 체인, 연결은 속도다.',
      subtitle: '노드 하나 올리면 전 세계 즉시 온라인. 시차와 국경을 넘어, 거의 제로 트러스트 비용으로 가치가 한 번에 전달됩니다.',
    },
    ar: {
      title: 'سلسلة واحدة للعالم. اتصال فوري.',
      subtitle: 'بمجرد تشغيل عقدة يصبح العالم متصلاً فوراً. عبر المناطق الزمنية والحدود وبكلفة ثقة شبه معدومة، تصل القيمة مباشرة.',
    },
    es: {
      title: 'Una sola cadena para el mundo. Conexión al instante.',
      subtitle: 'Levanta un nodo y el mundo está en línea. A través de husos y fronteras, con costo de confianza casi cero, el valor llega de un salto.',
    }
  } as const), []);

  const t = (copy as any)[lang] || (copy as any).zh;

  return (
    <section className="dark:bg-black bg-white w-full py-16">
      <div className="max-w-7xl mx-auto text-center pb-8 px-4 sm:px-6 lg:px-8">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">{t.title}</p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">{t.subtitle}</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorldMap
          dots={[
            { start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" }, end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" } },
            { start: { lat: 64.2008, lng: -149.4937, label: "Fairbanks" }, end: { lat: -15.7975, lng: -47.8919, label: "Brasília" } },
            { start: { lat: -15.7975, lng: -47.8919, label: "Brasília" }, end: { lat: 38.7223, lng: -9.1393, label: "Lisbon" } },
            { start: { lat: 51.5074, lng: -0.1278, label: "London" }, end: { lat: 28.6139, lng: 77.209, label: "New Delhi" } },
            { start: { lat: 28.6139, lng: 77.209, label: "New Delhi" }, end: { lat: 55.7558, lng: 37.6173, label: "Moscow" } },
            { start: { lat: 28.6139, lng: 77.209, label: "New Delhi" }, end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" } },
            { start: { lat: 51.5074, lng: -0.1278, label: "London" }, end: { lat: 31.242, lng: 121.495, label: "Shanghai" } },
            { start: { lat: 40.7128, lng: -74.006, label: "New York" }, end: { lat: 3.139, lng: 101.6869, label: "Kuala Lumpur" } },
          ]}
        />
      </div>
    </section>
  );
}

export function WorldMapDemo({ lang = 'zh' }: WorldMapDemoProps) {
  return (
    <Suspense fallback={
      <section className="dark:bg-black bg-white w-full py-16">
        <div className="max-w-7xl mx-auto text-center pb-8 px-4 sm:px-6 lg:px-8">
          <p className="font-bold text-xl md:text-4xl dark:text-white text-black">Global Network</p>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">Connect teams and clients worldwide for seamless collaboration.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </section>
    }>
      <WorldMapDemoInner lang={lang} />
    </Suspense>
  );
}
