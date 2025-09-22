'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

// 懒加载SplineScene
const SplineScene = dynamic(() => import("@/components/ui/splite").then(mod => ({ default: mod.SplineScene })), {
  ssr: false,
  loading: () => (
    <div className="flex-1 relative flex items-center justify-center bg-black/20">
      <div className="animate-pulse">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  )
})

function SplineSceneBasicInner() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden gradient-border">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Interactive 3D
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Bring your UI to life with beautiful 3D scenes. Create immersive experiences 
            that capture attention and enhance your design.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
 
export function SplineSceneBasic() {
  return (
    <Suspense fallback={
      <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden gradient-border flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </Card>
    }>
      <SplineSceneBasicInner />
    </Suspense>
  )
}
