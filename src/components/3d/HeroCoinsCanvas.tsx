// ============================================================
// FILE: src/components/3d/HeroCoinsCanvas.tsx
// PURPOSE: Interactive floating 3D WebGL crypto coin constellation for the Hero section
//          Strictly 4 core assets: BTC, ETH, SOL, USDT
//          Calibrated for brilliant illumination in both light and dark themes
//          Responsive: Desktop preserved 100%, mobile mathematically framed
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

// Exactly 4 coins on Desktop:
// BTC (center-right backdrop), ETH (upper-left), SOL (upper-right flank), USDT (lower-left)
// Positioned in peripheral negative space to avoid obscuring the hero headline
const DESKTOP_COINS: CoinSpec[] = [
  { asset: 'BTC', pos: [1.2, -0.1, -0.6], scale: 3.1, tilt: -0.28, phase: 0, hero: true },
  { asset: 'ETH', pos: [-4.6, 2.0, -1.8], scale: 2.0, tilt: 0.55, phase: 1.3 },
  { asset: 'SOL', pos: [4.8, 1.4, -1.4], scale: 2.1, tilt: -0.6, phase: 2.6 },
  { asset: 'USDT', pos: [-5.6, -1.8, -3.2], scale: 1.6, tilt: 0.7, phase: 3.9 },
];

/**
 * Calculates adaptive camera distance and coin specs calibrated for viewport aspect ratio.
 * Desktop (>= 768px): Strictly returns DESKTOP_COINS with cameraZ = 9.5 (100% fidelity).
 * Mobile (< 768px): Dynamically calculates proportional coordinates so all 4 coins
 * are beautifully visible, framing the top, sides, and phone backdrop without clipping.
 */
function getSpecsForViewport(width: number, height: number): { specs: CoinSpec[]; cameraZ: number } {
  const isMobile = width < 768;
  const aspect = width / Math.max(1, height);

  if (!isMobile) {
    return {
      specs: DESKTOP_COINS,
      cameraZ: 9.5,
    };
  }

  // Mobile / Phone View Calibration:
  // On portrait phones, the aspect ratio is tall and narrow (~0.30 - 0.45).
  // Pull camera back to z = 11.2 to widen the visible field.
  const cameraZ = 11.2;
  const tanHalfFov = 0.28675; // tan(16 deg) for vertical FOV 32
  const hh = cameraZ * tanHalfFov; // ~3.21 units
  const hw = Math.max(0.92, hh * aspect); // ~1.05 to ~1.35 units on phones

  // Proportional placement ensuring all coins stay comfortably in peripheral negative space:
  // 1. ETH: Elevated to the upper-left shoulder above the headline (clears all subtitle body text)
  // 2. SOL: Upper-right corner (balances ETH, clears text)
  // 3. BTC: Hero coin, right-center flank (behind CTAs/value prop, does not cover headline)
  // 4. USDT: Lower-left backdrop (frames the 3D phone model)
  const mobileCoins: CoinSpec[] = [
    {
      asset: 'BTC',
      pos: [hw * 0.62, -0.15, -0.6],
      scale: Math.min(1.58, hw * 1.35),
      tilt: -0.22,
      phase: 0,
      hero: true,
    },
    {
      asset: 'ETH',
      pos: [-hw * 0.86, hh * 0.84, -1.2],
      scale: Math.min(1.05, hw * 0.95),
      tilt: 0.38,
      phase: 1.4,
    },
    {
      asset: 'SOL',
      pos: [hw * 0.88, hh * 0.72, -1.4],
      scale: Math.min(1.02, hw * 0.90),
      tilt: -0.42,
      phase: 2.7,
    },
    {
      asset: 'USDT',
      pos: [-hw * 0.82, -hh * 0.68, -1.6],
      scale: Math.min(0.98, hw * 0.88),
      tilt: 0.32,
      phase: 4.0,
    },
  ];

  return { specs: mobileCoins, cameraZ };
}

interface HeroCoinsCanvasProps {
  className?: string;
  themeMode?: 'light' | 'dark';
}

export const HeroCoinsCanvas: React.FC<HeroCoinsCanvasProps> = ({ className = '', themeMode = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    const { specs: initialSpecs, cameraZ: initialCameraZ } = getSpecsForViewport(initialWidth, initialHeight);

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(32, initialWidth / initialHeight, 0.1, 100);
    camera.position.set(0, 0, initialCameraZ);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, initialWidth < 768 ? 1.5 : 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = themeMode === 'light' ? 1.35 : 1.25;
    container.appendChild(renderer.domElement);

    // Studio Lighting calibrated to prevent darkness/washout in both light and dark backgrounds
    const ambientIntensity = themeMode === 'light' ? 1.6 : 1.4;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    // Direct Key Light illuminating the face details
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 5, 7);
    scene.add(keyLight);

    // Frontal fill light to eliminate dark shadows on coins facing the camera
    const frontFillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontFillLight.position.set(0, 0, 8);
    scene.add(frontFillLight);

    // Side Rim Lights for crisp metallic edge glints
    const rimLightLeft = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLightLeft.position.set(-5, 2, 2);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLightRight.position.set(5, -2, 2);
    scene.add(rimLightRight);

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

    initialSpecs.forEach((spec) => {
      const group = new THREE.Group();
      group.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      group.scale.setScalar(spec.scale);

      const materials = getCoinMaterials(spec.asset);
      const mesh = new THREE.Mesh(coinGeometry, materials);
      // Lathe + Circle merge is oriented in Y-up. Rotate to face front (+Z)
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

    // Pointer Interaction with Cached Bounding Rect (prevents layout thrashing on every mousemove)
    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let cachedRect = container.getBoundingClientRect();

    const updateCachedRect = () => {
      if (container) {
        cachedRect = container.getBoundingClientRect();
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!cachedRect.width || !cachedRect.height) return;
      const x = ((e.clientX - cachedRect.left) / cachedRect.width) * 2 - 1;
      const y = -(((e.clientY - cachedRect.top) / cachedRect.height) * 2 - 1);
      targetPointerX = x * 0.18;
      targetPointerY = y * 0.12;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', updateCachedRect, { passive: true });

    // Dynamic Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      updateCachedRect();
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      const { specs, cameraZ } = getSpecsForViewport(width, height);

      camera.position.z = cameraZ;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2));

      // Dynamically update coin positions & scales for the new viewport
      specs.forEach((spec, i) => {
        if (coinMeshes[i]) {
          coinMeshes[i].spec = spec;
          coinMeshes[i].group.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
          coinMeshes[i].group.scale.setScalar(spec.scale);
        }
      });
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

        // Periodic celebratory 360 spin for hero BTC
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
      window.removeEventListener('scroll', updateCachedRect);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [themeMode]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};

export default HeroCoinsCanvas;
