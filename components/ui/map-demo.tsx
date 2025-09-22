"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// 懒加载WorldMap
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

function WorldMapDemoInner() {
  return (
    <div className="dark:bg-black bg-white w-full">
      <div className="max-w-7xl mx-auto text-center pb-8">
       <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Global{" "}
         Network
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Connect with teams and clients worldwide. Our platform enables seamless 
          collaboration across continents, bringing the world to your workspace.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
              label: "Fairbanks"
            },
            end: {
              lat: 34.0522,
              lng: -118.2437,
              label: "Los Angeles"
            },
          },
          {
            start: { 
              lat: 64.2008, 
              lng: -149.4937,
              label: "Fairbanks"
            },
            end: { 
              lat: -15.7975, 
              lng: -47.8919,
              label: "Brasília"
            },
          },
          {
            start: { 
              lat: -15.7975, 
              lng: -47.8919,
              label: "Brasília"
            },
            end: { 
              lat: 38.7223, 
              lng: -9.1393,
              label: "Lisbon"
            },
          },
          {
            start: { 
              lat: 51.5074, 
              lng: -0.1278,
              label: "London"
            },
            end: { 
              lat: 28.6139, 
              lng: 77.209,
              label: "New Delhi"
            },
          },
          {
            start: { 
              lat: 28.6139, 
              lng: 77.209,
              label: "New Delhi"
            },
            end: { 
              lat: 55.7558, 
              lng: 37.6173,
              label: "Moscow"
            },
          },
          {
            start: { 
              lat: 28.6139, 
              lng: 77.209,
              label: "New Delhi"
            },
            end: { 
              lat: -1.2921, 
              lng: 36.8219,
              label: "Nairobi"
            },
          },
          {
            start: { 
              lat: 51.5074, 
              lng: -0.1278,
              label: "London"
            },
            end: { 
              lat: 31.242, 
              lng: 121.495,
              label: "Shang Hai"
            },
          },
          {
            start: { 
              lat: 40.7128, 
              lng: -74.0060,
              label: "New York"
            },
            end: { 
              lat: 3.1390, 
              lng: 101.6869,
              label: "KualaLumpur"
            },
          }
        ]}
      />
    </div>
  );
}

export function WorldMapDemo() {
  return (
    <Suspense fallback={
      <div className="dark:bg-black bg-white w-full">
        <div className="max-w-7xl mx-auto text-center pb-8">
          <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
            Global Network
          </p>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
            Connect with teams and clients worldwide. Our platform enables seamless 
            collaboration across continents, bringing the world to your workspace.
          </p>
        </div>
        <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] dark:bg-black bg-white rounded-lg relative font-sans overflow-hidden flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    }>
      <WorldMapDemoInner />
    </Suspense>
  );
}
