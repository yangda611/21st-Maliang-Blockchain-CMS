'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';

// 懒加载Three.js
const loadThreeJS = () => import('three');

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

// 内部组件，只在需要时加载Three.js
function DottedSurfaceInner({ className, ...props }: DottedSurfaceProps) {
	const { theme } = useTheme();
	const [isLoaded, setIsLoaded] = useState(false);
	const [THREE, setTHREE] = useState<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: any;
		camera: any;
		renderer: any;
		particles: any[];
		animationId: number;
		count: number;
	} | null>(null);

	// 懒加载Three.js
	useEffect(() => {
		loadThreeJS().then((three) => {
			setTHREE(three);
			setIsLoaded(true);
		});
	}, []);

	// 优化的初始化函数
	const initializeScene = useCallback(() => {
		if (!THREE || !containerRef.current || sceneRef.current) return;

		const SEPARATION = 150; // 增加间距，减少粒子密度
		const AMOUNTX = 40; // 减少X轴粒子数量
		const AMOUNTY = 60; // 减少Y轴粒子数量

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: false, // 关闭抗锯齿以提升性能
			powerPreference: "high-performance", // 优先使用高性能GPU
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 限制像素比
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const particles: any[] = [];
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				if (theme === 'dark') {
					colors.push(200, 200, 200);
				} else {
					colors.push(0, 0, 0);
				}
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 8, // 减小粒子大小
			vertexColors: true,
			transparent: true,
			opacity: 0.8, // 降低透明度
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId: number = 0;

		// 优化的动画函数
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			// 优化：减少计算频率，每3帧更新一次位置
			// if (Math.floor(count) % 3 === 0) {
				let i = 0;
				for (let ix = 0; ix < AMOUNTX; ix++) {
					for (let iy = 0; iy < AMOUNTY; iy++) {
						const index = i * 3;

						// 简化动画计算
						positions[index + 1] =
							Math.sin((ix + count) * 0.2) * 50 + // 减少振幅和频率
							Math.sin((iy + count) * 0.3) * 50;

						i++;
					}
				}
				positionAttribute.needsUpdate = true;
			// }

			renderer.render(scene, camera);
			count += 0.01; // 减慢动画速度
		};

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animation
		animate();

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};
	}, [THREE, theme]);

	// 当Three.js加载完成后初始化场景
	useEffect(() => {
		if (isLoaded && THREE) {
			// 延迟初始化，避免阻塞主线程和文本渲染
			const timeout = setTimeout(initializeScene, 500);
			return () => clearTimeout(timeout);
		}
	}, [isLoaded, THREE, initializeScene]);

	// Cleanup function
	useEffect(() => {
		return () => {
			if (sceneRef.current) {
				cancelAnimationFrame(sceneRef.current.animationId);

		// Clean up Three.js objects
		if (THREE) {
			sceneRef.current.scene.traverse((object: any) => {
				if (object instanceof THREE.Points) {
					object.geometry.dispose();
					if (Array.isArray(object.material)) {
						object.material.forEach((material: any) => material.dispose());
					} else {
						object.material.dispose();
					}
				}
			});
		}

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none fixed inset-0 -z-1', className)}
			{...props}
		/>
	);
}

// 主组件，使用Suspense包装
export function DottedSurface({ className, ...props }: DottedSurfaceProps) {
	return (
		<Suspense fallback={
			<div 
				className={cn(
					'pointer-events-none fixed inset-0 -z-1 bg-black/50',
					className
				)}
				{...props}
			/>
		}>
			<DottedSurfaceInner className={className} {...props} />
		</Suspense>
	);
}
