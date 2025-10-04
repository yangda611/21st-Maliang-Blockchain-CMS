'use client'
import React from 'react'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

// 仅保留背景视频容器与品牌滑动条，按照项目依赖改为 framer-motion

export function HeroBackground({
  children,
  videoSrc = 'https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477',
  className,
  posterSrc,
}: {
  children?: React.ReactNode
  videoSrc?: string
  className?: string
  posterSrc?: string
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:px-12">
        {children}
      </div>
      <div className="absolute inset-0 sm:inset-1 overflow-hidden rounded-none sm:rounded-3xl border-0 sm:border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          poster={posterSrc}
          className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
          src={videoSrc}
        />
      </div>
    </div>
  )
}

export function PoweringBrands() {
  return (
    <div className="bg-background pb-2">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">Powering the best teams</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider gap={112} duration={25} durationOnHover={50}>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/column.svg" alt="Column Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-5 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="Lemon Squeezy Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-4 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-7 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/lilly.svg" alt="Lilly Logo" />
              </div>
              <div className="flex">
                <img loading="lazy" decoding="async" fetchPriority="low" className="mx-auto h-6 w-fit dark:invert" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI Logo" />
              </div>
            </InfiniteSlider>

            <div className="bg-gradient-to-r from-background to-transparent absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-gradient-to-l from-background to-transparent absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
            <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
          </div>
        </div>
      </div>
    </div>
  )
}
