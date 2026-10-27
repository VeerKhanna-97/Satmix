// ============================================================
// FILE: src/components/3d/HeroCoinsCanvas.tsx
// PURPOSE: Interactive floating 3D WebGL crypto coin constellation for the Hero section
//          Strictly 4 core assets: BTC, ETH, SOL, USDT
// ============================================================

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getCoinGeometry, getCoinMaterials, CryptoAsset } from './coinMaterials';

interface CoinSpec {
  asset: CryptoAsset;
  pos: [number, number, number];
  scale: number;
  tilt: number;
  phase: number;
  hero?: boolean;
}

// Exactly 4 coins: BTC (center hero), ETH (left top), SOL (right top), USDT (left bottom)
const DESKTOP_COINS: CoinSpec[] = [
  { asset: 'BTC', pos: [0.0, 0.2, 0.4], scale: 3.2, tilt: -0.28, phase: 0, hero: true },
  { asset: 'ETH', pos: [-3.8, 1.4, -1.2], scale: 2.1, tilt: 0.55, phase: 1.3 },
  { asset: 'SOL', pos: [3.9, 0.8, -1.0], scale: 2.1, tilt: -0.6, phase: 2.6 },
  { asset: 'USDT', pos: [-5.2, -1.5, -2.8], scale: 1.7, tilt: 0.7, phase: 3.9 },
];

const MOBILE_COINS: CoinSpec[] = [
  { asset: 'BTC', pos: [0.0, 0.3, 0.1], scale: 2.3, tilt: -0.25, phase: 0, hero: true },
  { asset: 'ETH', pos: [-2.1, 1.8, -1.5], scale: 1.4, tilt: 0.45, phase: 1.5 },
  { asset: 'SOL', pos: [2.1, 1.0, -1.5], scale: 1.4, tilt: -0.5, phase: 2.5 },
  { asset: 'USDT', pos: [-1.8, -2.0, -1.8], scale: 1.3, tilt: 0.3, phase: 3.8 },
];

interface HeroCoinsCanvasProps {
  className?: string;
}

export const HeroCoinsCanvas: React.FC<HeroCoinsCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive setup
    const isMobile = window.innerWidth < 768;
    const activeSpecs = isMobile ? MOBILE_COINS : DESKTOP_COINS;

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    // Subtle violet rim light
    const rimLight1 = new THREE.DirectionalLight(0x8b5cff, 2.2);
    rimLight1.position.set(-4, 2, -4);
    scene.add(rimLight1);

    // Mint fill light matching Satmix branding
    const rimLight2 = new THREE.DirectionalLight(0x00f5b8, 1.2);
    rimLight2.position.set(4, -2, -3);
    scene.add(rimLight2);

    // Create Coin Meshes
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const coinGeometry = getCoinGeometry();
    const coinMeshes: {
      group: THREE.Group;
      mesh: THREE.Mesh;
      spec: CoinSpec;
      spinT: number;
      spinCooldown: number;
    }[] = [];

    activeSpecs.forEach((spec) => {
      const group = new THREE.Group();
      group.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      group.scale.setScalar(spec.scale);

      const materials = getCoinMaterials(spec.asset);
      const mesh = new THREE.Mesh(coinGeometry, materials);
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);

      rootGroup.add(group);
      coinMeshes.push({
        group,
        mesh,
        spec,
        spinT: 1,
        spinCooldown: spec.hero ? 2.5 : 999,
      });
    });

    // Pointer Interaction
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetPointerX = x * 0.18;
      targetPointerY = y * 0.12;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop with Visibility Pause
    let isVisible = true;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          clock.start();
          animate();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(container);

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer dampening
      currentPointerX += (targetPointerX - currentPointerX) * 0.06;
      currentPointerY += (targetPointerY - currentPointerY) * 0.06;

      rootGroup.rotation.y = currentPointerX;
      rootGroup.rotation.x = -currentPointerY;

      // Update Individual Coins
      coinMeshes.forEach((item) => {
        const { group, spec } = item;

        // Periodic dramatic spin for hero BTC
        let heroSpin = 0;
        if (spec.hero && !prefersReducedMotion) {
          item.spinCooldown -= delta;
          if (item.spinCooldown <= 0) {
            item.spinT = 0;
            item.spinCooldown = 4.5;
          }
          if (item.spinT < 1) {
            item.spinT = Math.min(1, item.spinT + delta / 1.4);
            const ease =
              item.spinT < 0.5
                ? 4 * item.spinT * item.spinT * item.spinT
                : 1 - Math.pow(-2 * item.spinT + 2, 3) / 2;
            heroSpin = ease * Math.PI * 2;
          }
        }

        // Gentle floating physics
        if (!prefersReducedMotion) {
          const wobbleY = Math.sin(elapsed * 0.7 + spec.phase) * 0.12;
          const wobbleRotZ = Math.sin(elapsed * 0.4 + spec.phase) * 0.08;
          const wobbleRotY = Math.sin(elapsed * 0.5 + spec.phase) * 0.16;

          group.position.y = spec.pos[1] + wobbleY;
          group.rotation.y = spec.tilt + wobbleRotY + heroSpin;
          group.rotation.z = wobbleRotZ;
        } else {
          group.rotation.y = spec.tilt;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
