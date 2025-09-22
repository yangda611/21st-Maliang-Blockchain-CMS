'use client'

import { Suspense, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface SplineSceneProps {
  scene: string
  className?: string
}

// 尝试修复 Spline 导入问题
let Spline: any = null;

// 动态加载 Spline 组件
const loadSpline = async () => {
  try {
    const splineModule = await import('@splinetool/react-spline');
    Spline = splineModule.default;
    return true;
  } catch (error) {
    console.error('Failed to load Spline:', error);
    return false;
  }
};

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadSpline().then((success) => {
      if (success) {
        setIsLoaded(true);
      } else {
        setLoadError(true);
      }
    });
  }, []);

  if (loadError) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 ${className || ''}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
            <div className="text-white text-2xl">⚠️</div>
          </div>
          <h3 className="text-white/80 text-lg font-semibold mb-2">3D Scene Error</h3>
          <p className="text-white/60 text-sm">Unable to load 3D content</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !Spline) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 ${className || ''}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <h3 className="text-white/80 text-lg font-semibold mb-2">Loading 3D Scene</h3>
          <p className="text-white/60 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense 
      fallback={
        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 ${className || ''}`}>
          <div className="animate-pulse">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  );
}