// ============================================================
// FILE: src/components/3d/BasketCoinStackCanvas.tsx
// PURPOSE: Interactive 3D physical coin stacks displaying asset allocation volume
// ============================================================

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BasketId } from '../../types';
import { getCoinGeometry, getCoinMaterials, CryptoAsset } from './coinMaterials';

interface BasketCoinStackCanvasProps {
  basketId: BasketId;
  activeAssetTicker?: string | null;
  className?: string;
}

interface StackCoin {
  asset: CryptoAsset;
  group: THREE.Group;
  baseY: number;
  currentY: number;
  targetY: number;
  baseX: number;
}

export const BasketCoinStackCanvas: React.FC<BasketCoinStackCanvasProps> = ({
  basketId,
  activeAssetTicker,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeTickerRef = useRef<string | null>(activeAssetTicker ?? null);
  const stackCoinsRef = useRef<StackCoin[]>([]);
  const isDraggingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.15, y: -0.35 });

  useEffect(() => {
    activeTickerRef.current = activeAssetTicker ?? null;
  }, [activeAssetTicker]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine coin count distribution based on basket
    // Total 10 coins representing 100%
    const coinConfig: { asset: CryptoAsset; count: number }[] =
      basketId === 'stable'
        ? [
            { asset: 'USDT', count: 8 }, // 80% (closest integer for 85%)
            { asset: 'BTC', count: 2 },  // 20%
          ]
        : [
            { asset: 'BTC', count: 6 },  // 60-70%
            { asset: 'ETH', count: 3 },  // 20-30%
            { asset: 'SOL', count: 1 },  // 10%
          ];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0, 0.9, 3.4);
    camera.lookAt(0, 0.05, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio lighting with warm specular
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(2, 5, 3);
    scene.add(dirLight1);

    const rimLight = new THREE.DirectionalLight(0x8b5cff, 1.4);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Subtle dark contact shadow beneath coins
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.42;
    scene.add(shadowMesh);

    // Build stacks
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const coinGeom = getCoinGeometry();
    const coins: StackCoin[] = [];
    const coinThickness = 0.08 + 0.012; // 0.092 spacing

    let coinIndex = 0;
    coinConfig.forEach((stack, stackIdx) => {
      // Horizontal separation for multi-asset columns
      const totalColumns = coinConfig.length;
      const colX = (stackIdx - (totalColumns - 1) / 2) * 0.9;

      for (let i = 0; i < stack.count; i++) {
        const group = new THREE.Group();
        const baseY = -0.38 + i * coinThickness;
        const subtleJitter = Math.sin((stackIdx + 1) * 12.98 + i * 78.23) * 0.015;

        group.position.set(colX + subtleJitter, baseY, 0);
        group.scale.setScalar(1.0);

        const materials = getCoinMaterials(stack.asset);
        const mesh = new THREE.Mesh(coinGeom, materials);
        mesh.rotation.x = Math.PI / 2;
        group.add(mesh);

        rootGroup.add(group);

        coins.push({
          asset: stack.asset,
          group,
          baseY,
          currentY: baseY,
          targetY: baseY,
          baseX: colX,
        });
        coinIndex++;
      }
    });

    stackCoinsRef.current = coins;

    // Drag-to-rotate interaction
    const onPointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = (e.clientX - pointerStartRef.current.x) * 0.008;
      const dy = (e.clientY - pointerStartRef.current.y) * 0.008;
      targetRotationRef.current.y += dx;
      targetRotationRef.current.x = Math.max(-0.2, Math.min(0.5, targetRotationRef.current.x + dy));
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Loop
    let animationFrameId: number;
    let isVisible = true;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId) {
        clock.start();
        animate();
      }
    });
    observer.observe(container);

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Smooth stack rotation towards target
      rootGroup.rotation.y += (targetRotationRef.current.y - rootGroup.rotation.y) * 0.08;
      rootGroup.rotation.x += (targetRotationRef.current.x - rootGroup.rotation.x) * 0.08;

      // Subtle ambient idle breathing
      if (!isDraggingRef.current && !prefersReducedMotion) {
        targetRotationRef.current.y = -0.35 + Math.sin(elapsed * 0.5) * 0.08;
      }

      // Check hovered asset lift
      const activeTicker = activeTickerRef.current;
      coins.forEach((coin) => {
        const isHovered = activeTicker && coin.asset === activeTicker;
        const targetLift = isHovered ? coin.baseY + 0.16 : coin.baseY;
        coin.currentY += (targetLift - coin.currentY) * 0.14;
        coin.group.position.y = coin.currentY;

        // Subtle scale highlight on selection
        const targetScale = isHovered ? 1.05 : 1.0;
        coin.group.scale.setScalar(
          coin.group.scale.x + (targetScale - coin.group.scale.x) * 0.14
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer.disconnect();
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [basketId]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${className}`}
      role="img"
      aria-label={`3D Coin Stack for ${basketId} basket`}
    />
  );
};
