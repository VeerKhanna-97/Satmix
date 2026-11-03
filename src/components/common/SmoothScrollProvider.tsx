// ============================================================
// FILE: src/components/common/SmoothScrollProvider.tsx
// PURPOSE: Unified Smooth Scrolling & GSAP ScrollTrigger Bridge
//          Normalizes wheel/touch physics via Lenis (Darkroom Engineering)
//          and synchronizes with GSAP 3 requestAnimationFrame ticker
// ============================================================

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SmoothScrollProvider({ children, enabled = true }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 1. Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 3. Drive Lenis render loop directly through GSAP's high-precision ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Expose lenis for smooth programmatic anchor links (e.g. #calculator, #how-it-works)
    (window as any).satmixLenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).satmixLenis;
    };
  }, [enabled]);

  return <>{children}</>;
}

export default SmoothScrollProvider;
