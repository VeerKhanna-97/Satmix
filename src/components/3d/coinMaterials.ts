// ============================================================
// FILE: src/components/3d/coinMaterials.ts
// PURPOSE: High-res authentic procedural canvas textures with official cryptocurrency logos,
//          exact beveled geometry, and calibrated PBR physical materials for both light & dark mode.
//          Assets: BTC, ETH, SOL, USDT
// ============================================================

import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OFFICIAL_COIN_LOGOS } from './coinLogoData';

export type CryptoAsset = 'BTC' | 'ETH' | 'SOL' | 'USDT';
export type CoinType = CryptoAsset;

export interface AssetColorConfig {
  gradientStart: string;
  gradientMid?: string;
  gradientEnd: string;
  edgeColor: string;
  emissiveColor: string;
  logoScale: number;
}

// Calibrated, luminous, high-vibrancy brand standards that pop in both light and dark backgrounds
const ASSET_CONFIGS: Record<CryptoAsset, AssetColorConfig> = {
  BTC: {
    gradientStart: '#FFAC1C',
    gradientEnd: '#E67E00',
    edgeColor: '#D97706',
    emissiveColor: '#F7931A',
    logoScale: 0.58,
  },
  ETH: {
    gradientStart: '#7C98F8',
    gradientMid: '#5A75E6',
    gradientEnd: '#4258BD',
    edgeColor: '#4358A8',
    emissiveColor: '#627EEA',
    logoScale: 0.56,
  },
  SOL: {
    gradientStart: '#C084FC',
    gradientMid: '#818CF8',
    gradientEnd: '#34D399',
    edgeColor: '#7C3AED',
    emissiveColor: '#10B981',
    logoScale: 0.58,
  },
  USDT: {
    gradientStart: '#34D399',
    gradientEnd: '#10B981',
    edgeColor: '#059669',
    emissiveColor: '#10B981',
    logoScale: 0.58,
  },
};

const TEXTURE_RES = 1024;

// Cache map for generated textures, materials, and shared geometry to avoid memory duplication
const textureCache = new Map<string, THREE.CanvasTexture>();
const materialCache = new Map<CryptoAsset, THREE.Material[]>();
const loadedLogoImages = new Map<CryptoAsset, HTMLImageElement>();
let sharedCoinGeometry: THREE.BufferGeometry | null = null;

function createCanvas2D(width = TEXTURE_RES, height = TEXTURE_RES): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * Initializes and caches the official base64 logo images
 */
function initOfficialLogo(asset: CryptoAsset): HTMLImageElement | undefined {
  if (typeof window === 'undefined') return undefined;
  if (loadedLogoImages.has(asset)) {
    return loadedLogoImages.get(asset);
  }

  const base64Uri = OFFICIAL_COIN_LOGOS[asset];
  if (!base64Uri) return undefined;

  const img = new Image();
  img.src = base64Uri;
  loadedLogoImages.set(asset, img);

  img.onload = () => {
    refreshTextures(asset);
  };

  return img;
}

function refreshTextures(asset: CryptoAsset) {
  const colorTex = textureCache.get(`face-color-${asset}`);
  const img = loadedLogoImages.get(asset);
  if (colorTex && colorTex.image && img) {
    const canvas = colorTex.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderFaceColorPass(ctx, asset, img);
      colorTex.needsUpdate = true;
    }
  }

  const bumpTex = textureCache.get(`face-bump-${asset}`);
  if (bumpTex && bumpTex.image && img) {
    const canvas = bumpTex.image as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderFaceBumpPass(ctx, asset, img);
      bumpTex.needsUpdate = true;
    }
  }
}

/**
 * Draws the official coin logo centered with crisp scaling
 */
function drawOfficialLogo(ctx: CanvasRenderingContext2D, asset: CryptoAsset, logoImg?: HTMLImageElement) {
  const center = TEXTURE_RES / 2;
  const cfg = ASSET_CONFIGS[asset];
  const targetSize = Math.round(TEXTURE_RES * cfg.logoScale);

  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    ctx.drawImage(
      logoImg,
      center - targetSize / 2,
      center - targetSize / 2,
      targetSize,
      targetSize
    );
    ctx.restore();
  }
}

/**
 * Full render pass for Face Color Map
 */
function renderFaceColorPass(ctx: CanvasRenderingContext2D, asset: CryptoAsset, logoImg?: HTMLImageElement) {
  const center = TEXTURE_RES / 2;
  const cfg = ASSET_CONFIGS[asset];

  ctx.clearRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // 1. Rich saturated gradient matching official cryptocurrency branding
  if (asset === 'SOL') {
    const grad = ctx.createLinearGradient(120, TEXTURE_RES - 120, TEXTURE_RES - 120, 120);
    grad.addColorStop(0, cfg.gradientStart);
    if (cfg.gradientMid) grad.addColorStop(0.5, cfg.gradientMid);
    grad.addColorStop(1, cfg.gradientEnd);
    ctx.fillStyle = grad;
  } else if (asset === 'ETH') {
    const grad = ctx.createRadialGradient(
      center - 30,
      center - 50,
      40,
      center,
      center,
      TEXTURE_RES * 0.52
    );
    grad.addColorStop(0, cfg.gradientStart);
    if (cfg.gradientMid) grad.addColorStop(0.65, cfg.gradientMid);
    grad.addColorStop(1, cfg.gradientEnd);
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createRadialGradient(
      center - 30,
      center - 50,
      40,
      center,
      center,
      TEXTURE_RES * 0.52
    );
    grad.addColorStop(0, cfg.gradientStart);
    grad.addColorStop(0.75, cfg.gradientEnd);
    grad.addColorStop(1, cfg.edgeColor);
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // 2. Concentric Minted Beveled Face Features (Calibrated to r = 0.88 * 512 = 450px)
  // Outer rim highlight groove
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(center, center, 460, 0, Math.PI * 2);
  ctx.stroke();

  // Stepped inner shadow groove
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, 442, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (72 circular micro-dots)
  const dotCount = 72;
  const dotRadius = 420;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    const x = center + dotRadius * Math.cos(a);
    const y = center + dotRadius * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner hairline ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(center, center, 400, 0, Math.PI * 2);
  ctx.stroke();

  // Radial lathe reflection sheen lines
  ctx.save();
  ctx.translate(center, center);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1.5;
  for (let deg = 0; deg < 360; deg += 12) {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(Math.cos(rad) * 60, Math.sin(rad) * 60);
    ctx.lineTo(Math.cos(rad) * 390, Math.sin(rad) * 390);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Official Logo in Center with specular depth shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  drawOfficialLogo(ctx, asset, logoImg);
  ctx.restore();
}

/**
 * Full render pass for Bump Map
 */
function renderFaceBumpPass(ctx: CanvasRenderingContext2D, asset: CryptoAsset, logoImg?: HTMLImageElement) {
  const center = TEXTURE_RES / 2;

  ctx.clearRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // Baseline mid-gray (neutral displacement)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // Outer raised rim plateau
  ctx.strokeStyle = '#D8D8D8';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(center, center, 460, 0, Math.PI * 2);
  ctx.stroke();

  // Rim groove (recessed dark notch)
  ctx.strokeStyle = '#383838';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(center, center, 442, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (raised dots)
  const dotCount = 72;
  const dotRadius = 420;
  ctx.fillStyle = '#C8C8C8';
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    const x = center + dotRadius * Math.cos(a);
    const y = center + dotRadius * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner accent line
  ctx.strokeStyle = '#A8A8A8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(center, center, 400, 0, Math.PI * 2);
  ctx.stroke();

  // Micro lathe concentric turn rings
  for (let r = 80; r < 390; r += 32) {
    ctx.strokeStyle = r % 64 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Raised Logo Plateau
  ctx.save();
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 5;
  drawOfficialLogo(ctx, asset, logoImg);
  drawOfficialLogo(ctx, asset, logoImg);
  ctx.restore();
}

/**
 * Creates high-resolution 1024x1024 color map for coin face
 */
export function createFaceColorTexture(asset: CryptoAsset): THREE.CanvasTexture {
  const logoImg = initOfficialLogo(asset);
  const cacheKey = `face-color-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  renderFaceColorPass(ctx, asset, logoImg);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates 1024x1024 grayscale bump map with slight blur & rim groove creating physical raised depth
 */
export function createFaceBumpTexture(asset: CryptoAsset): THREE.CanvasTexture {
  const logoImg = initOfficialLogo(asset);
  const cacheKey = `face-bump-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  renderFaceBumpPass(ctx, asset, logoImg);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates 16x4 repeating pattern with 120 flutes wrapped around the cylinder rim
 */
export function createEdgeBumpTexture(): THREE.CanvasTexture {
  const cacheKey = 'edge-bump-fluted';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D(16, 4);
  const imgData = ctx.createImageData(16, 4);

  // Smooth sinusoidal flute ridge pattern (16 pixels horizontal)
  for (let x = 0; x < 16; x++) {
    const angle = (x / 16) * Math.PI * 2;
    const val = Math.floor(130 + 110 * Math.cos(angle));
    for (let y = 0; y < 4; y++) {
      const idx = (y * 16 + x) * 4;
      imgData.data[idx] = val;
      imgData.data[idx + 1] = val;
      imgData.data[idx + 2] = val;
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(120, 1);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Builds the exact procedural coin geometry matching the original artifact:
 * - Outer radius = 0.34
 * - Inner face disk radius = 0.34 * 0.82 = 0.2788
 * - Rim thickness = 0.08
 * - Beveled lathe contour (outer rim + chamfer corners) merged with front/back planar disks.
 */
export function getCoinGeometry(): THREE.BufferGeometry {
  if (sharedCoinGeometry) {
    return sharedCoinGeometry;
  }

  const outerR = 0.34;
  const innerR = outerR * 0.82; // 0.2788
  const halfH = 0.08 / 2;       // 0.04
  const innerHalfH = halfH * 0.62; // 0.0248

  // The 8-point beveled lathe contour profile
  const contourPoints = [
    new THREE.Vector2(innerR, -innerHalfH),
    new THREE.Vector2(innerR + 0.006, -halfH),
    new THREE.Vector2(outerR - 0.01, -halfH),
    new THREE.Vector2(outerR, -halfH + 0.01),
    new THREE.Vector2(outerR, halfH - 0.01),
    new THREE.Vector2(outerR - 0.01, halfH),
    new THREE.Vector2(innerR + 0.006, halfH),
    new THREE.Vector2(innerR, innerHalfH),
  ];

  // 1. Lathe Geometry for Edge + Bevel Rim
  const rimGeom = new THREE.LatheGeometry(contourPoints, 96);

  // 2. Front Face Cap Circle Geometry (+Y)
  const frontCap = new THREE.CircleGeometry(innerR, 96);
  frontCap.rotateX(-Math.PI / 2);
  frontCap.translate(0, innerHalfH, 0);

  // 3. Back Face Cap Circle Geometry (-Y)
  const backCap = new THREE.CircleGeometry(innerR, 96);
  backCap.rotateX(Math.PI / 2);
  backCap.rotateY(Math.PI);
  backCap.translate(0, -innerHalfH, 0);

  // Merge the 3 geometries with distinct material groups:
  // Group 0: Rim (Lathe)
  // Group 1: Front Face (Circle)
  // Group 2: Back Face (Circle)
  const merged = BufferGeometryUtils.mergeGeometries(
    [rimGeom.toNonIndexed(), frontCap.toNonIndexed(), backCap.toNonIndexed()],
    true
  );

  merged.computeVertexNormals();
  merged.computeBoundingSphere();

  sharedCoinGeometry = merged;
  return sharedCoinGeometry;
}

/**
 * Returns physical PBR materials with vibrant, luminous reflection in both light and dark modes
 */
export function getCoinMaterials(asset: CryptoAsset): THREE.Material[] {
  if (materialCache.has(asset)) {
    return materialCache.get(asset)!;
  }

  const cfg = ASSET_CONFIGS[asset];
  const colorMap = createFaceColorTexture(asset);
  const bumpMap = createFaceBumpTexture(asset);
  const edgeBump = createEdgeBumpTexture();

  // 1. Edge Material - Rich polished metallic rim with flute ridges
  const edgeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.edgeColor),
    metalness: 0.65,
    roughness: 0.25,
    clearcoat: 0.7,
    clearcoatRoughness: 0.15,
    bumpMap: edgeBump,
    bumpScale: 1.5,
  });

  // 2. Front Face Material - Vivid brand colors with bright specular sheen
  const faceMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.6,
    metalness: 0.35,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.22,
  });

  // 3. Back Face Material
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.6,
    metalness: 0.35,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.22,
  });

  const materials: THREE.Material[] = [edgeMaterial, faceMaterial, backMaterial];
  materialCache.set(asset, materials);
  return materials;
}

export function createCoinMesh(asset: CryptoAsset): THREE.Mesh {
  const geom = getCoinGeometry();
  const mats = getCoinMaterials(asset);
  return new THREE.Mesh(geom, mats);
}

export function clearCoinCache(): void {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();

  materialCache.forEach((mats) => {
    mats.forEach((mat) => mat.dispose());
  });
  materialCache.clear();

  if (sharedCoinGeometry) {
    sharedCoinGeometry.dispose();
    sharedCoinGeometry = null;
  }
}
