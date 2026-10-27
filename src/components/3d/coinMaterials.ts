// ============================================================
// FILE: src/components/3d/coinMaterials.ts
// PURPOSE: High-res procedural canvas textures with official cryptocurrency logos,
//          authentic brand color gradients, and physical PBR materials
//          Assets: BTC, ETH, SOL, USDT
// ============================================================

import * as THREE from 'three';
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

// Highly saturated, vibrant brand colors matching official token standards
const ASSET_CONFIGS: Record<CryptoAsset, AssetColorConfig> = {
  BTC: {
    gradientStart: '#FFA126',
    gradientEnd: '#E67E00',
    edgeColor: '#C26A00',
    emissiveColor: '#F7931A',
    logoScale: 0.62,
  },
  ETH: {
    gradientStart: '#7A96F8',
    gradientMid: '#5773E3',
    gradientEnd: '#3B52BA',
    edgeColor: '#30449E',
    emissiveColor: '#627EEA',
    logoScale: 0.58,
  },
  SOL: {
    gradientStart: '#A855F7',
    gradientMid: '#6366F1',
    gradientEnd: '#10B981',
    edgeColor: '#6B21A8',
    emissiveColor: '#10B981',
    logoScale: 0.60,
  },
  USDT: {
    gradientStart: '#2BC999',
    gradientEnd: '#1E9E78',
    edgeColor: '#167B5E',
    emissiveColor: '#26A17B',
    logoScale: 0.60,
  },
};

const TEXTURE_RES = 1024;

// Cache map for generated textures, materials, and shared geometry
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
 * Draws the official coin logo centered with high-resolution bicubic sharpness
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
    const grad = ctx.createLinearGradient(140, TEXTURE_RES - 140, TEXTURE_RES - 140, 140);
    grad.addColorStop(0, cfg.gradientStart);
    if (cfg.gradientMid) grad.addColorStop(0.5, cfg.gradientMid);
    grad.addColorStop(1, cfg.gradientEnd);
    ctx.fillStyle = grad;
  } else if (asset === 'ETH') {
    const grad = ctx.createRadialGradient(
      center - 40,
      center - 60,
      40,
      center,
      center,
      TEXTURE_RES * 0.5
    );
    grad.addColorStop(0, cfg.gradientStart);
    if (cfg.gradientMid) grad.addColorStop(0.65, cfg.gradientMid);
    grad.addColorStop(1, cfg.gradientEnd);
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createRadialGradient(
      center - 40,
      center - 60,
      40,
      center,
      center,
      TEXTURE_RES * 0.5
    );
    grad.addColorStop(0, cfg.gradientStart);
    grad.addColorStop(0.72, cfg.gradientEnd);
    grad.addColorStop(1, cfg.edgeColor);
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // 2. Concentric minted rings flush to rim boundary (r = 512px)
  // Outer bright highlight rim
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(center, center, 502, 0, Math.PI * 2);
  ctx.stroke();

  // Stepped inner shadow groove
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(center, center, 482, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (72 circular micro-dots)
  const dotCount = 72;
  const dotRadius = 462;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
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
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, 442, 0, Math.PI * 2);
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
    ctx.lineTo(Math.cos(rad) * 430, Math.sin(rad) * 430);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Official Logo in Center with specular depth shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
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
  ctx.strokeStyle = '#E2E2E2';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(center, center, 502, 0, Math.PI * 2);
  ctx.stroke();

  // Rim groove (recessed dark notch)
  ctx.strokeStyle = '#303030';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(center, center, 482, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (raised dots)
  const dotCount = 72;
  const dotRadius = 462;
  ctx.fillStyle = '#D4D4D4';
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    const x = center + dotRadius * Math.cos(a);
    const y = center + dotRadius * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner accent line
  ctx.strokeStyle = '#B0B0B0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, 442, 0, Math.PI * 2);
  ctx.stroke();

  // Micro lathe concentric turn rings
  for (let r = 80; r < 430; r += 32) {
    ctx.strokeStyle = r % 64 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Raised Logo Plateau
  ctx.save();
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 6;
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
 * Builds smooth non-indexed buffer geometry for a coin with beveled edges.
 * Dimensions: outer radius ~0.34, thickness ~0.08, 96 radial segments.
 */
export function getCoinGeometry(): THREE.BufferGeometry {
  if (sharedCoinGeometry) {
    return sharedCoinGeometry;
  }

  const outerRadius = 0.34;
  const thickness = 0.08;
  const halfH = thickness / 2;
  const bevelRadius = 0.012;
  const innerRadius = outerRadius - bevelRadius; // 0.328
  const radialSegments = 96;

  const bevelSteps = 4;
  const profile: { r: number; y: number; nr: number; ny: number }[] = [];

  for (let j = 0; j <= bevelSteps; j++) {
    const phi = -Math.PI / 2 + (Math.PI / 2) * (j / bevelSteps);
    profile.push({
      r: innerRadius + bevelRadius * Math.cos(phi),
      y: -halfH + bevelRadius + bevelRadius * Math.sin(phi),
      nr: Math.cos(phi),
      ny: Math.sin(phi),
    });
  }

  const straightWallYTop = halfH - bevelRadius;
  if (straightWallYTop > profile[profile.length - 1].y) {
    profile.push({
      r: outerRadius,
      y: straightWallYTop,
      nr: 1,
      ny: 0,
    });
  }

  for (let j = 1; j <= bevelSteps; j++) {
    const phi = (Math.PI / 2) * (j / bevelSteps);
    profile.push({
      r: innerRadius + bevelRadius * Math.cos(phi),
      y: halfH - bevelRadius + bevelRadius * Math.sin(phi),
      nr: Math.cos(phi),
      ny: Math.sin(phi),
    });
  }

  const profileCount = profile.length;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  // Group 0: Edge & Bevels
  const edgeStartIndex = 0;
  for (let i = 0; i < radialSegments; i++) {
    const theta1 = (i / radialSegments) * Math.PI * 2;
    const theta2 = ((i + 1) / radialSegments) * Math.PI * 2;
    const u1 = i / radialSegments;
    const u2 = (i + 1) / radialSegments;

    const cos1 = Math.cos(theta1);
    const sin1 = Math.sin(theta1);
    const cos2 = Math.cos(theta2);
    const sin2 = Math.sin(theta2);

    for (let p = 0; p < profileCount - 1; p++) {
      const pA = profile[p];
      const pB = profile[p + 1];

      const v1x = pA.r * cos1; const v1y = pA.y; const v1z = pA.r * sin1;
      const v2x = pB.r * cos1; const v2y = pB.y; const v2z = pB.r * sin1;
      const v3x = pA.r * cos2; const v3y = pA.y; const v3z = pA.r * sin2;
      const v4x = pB.r * cos2; const v4y = pB.y; const v4z = pB.r * sin2;

      const n1x = pA.nr * cos1; const n1y = pA.ny; const n1z = pA.nr * sin1;
      const n2x = pB.nr * cos1; const n2y = pB.ny; const n2z = pB.nr * sin1;
      const n3x = pA.nr * cos2; const n3y = pA.ny; const n3z = pA.nr * sin2;
      const n4x = pB.nr * cos2; const n4y = pB.ny; const n4z = pB.nr * sin2;

      const vValA = p / (profileCount - 1);
      const vValB = (p + 1) / (profileCount - 1);

      positions.push(v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z);
      normals.push(n1x, n1y, n1z, n2x, n2y, n2z, n3x, n3y, n3z);
      uvs.push(u1, vValA, u1, vValB, u2, vValA);

      positions.push(v3x, v3y, v3z, v2x, v2y, v2z, v4x, v4y, v4z);
      normals.push(n3x, n3y, n3z, n2x, n2y, n2z, n4x, n4y, n4z);
      uvs.push(u2, vValA, u1, vValB, u2, vValA);
    }
  }
  const edgeIndexCount = positions.length / 3 - edgeStartIndex;

  // Group 1: Front Face (+Y) - Exactly scaled to innerRadius
  const frontStartIndex = positions.length / 3;
  const frontY = halfH;
  for (let i = 0; i < radialSegments; i++) {
    const theta1 = (i / radialSegments) * Math.PI * 2;
    const theta2 = ((i + 1) / radialSegments) * Math.PI * 2;

    const x1 = innerRadius * Math.cos(theta1);
    const z1 = innerRadius * Math.sin(theta1);
    const x2 = innerRadius * Math.cos(theta2);
    const z2 = innerRadius * Math.sin(theta2);

    const uv1u = 0.5 + x1 / (2 * innerRadius);
    const uv1v = 0.5 - z1 / (2 * innerRadius);
    const uv2u = 0.5 + x2 / (2 * innerRadius);
    const uv2v = 0.5 - z2 / (2 * innerRadius);

    positions.push(0, frontY, 0, x1, frontY, z1, x2, frontY, z2);
    normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0);
    uvs.push(0.5, 0.5, uv1u, uv1v, uv2u, uv2v);
  }
  const frontIndexCount = positions.length / 3 - frontStartIndex;

  // Group 2: Back Face (-Y) - Exactly scaled to innerRadius
  const backStartIndex = positions.length / 3;
  const backY = -halfH;
  for (let i = 0; i < radialSegments; i++) {
    const theta1 = (i / radialSegments) * Math.PI * 2;
    const theta2 = ((i + 1) / radialSegments) * Math.PI * 2;

    const x1 = innerRadius * Math.cos(theta1);
    const z1 = innerRadius * Math.sin(theta1);
    const x2 = innerRadius * Math.cos(theta2);
    const z2 = innerRadius * Math.sin(theta2);

    const uv1u = 0.5 - x1 / (2 * innerRadius);
    const uv1v = 0.5 - z1 / (2 * innerRadius);
    const uv2u = 0.5 - x2 / (2 * innerRadius);
    const uv2v = 0.5 - z2 / (2 * innerRadius);

    positions.push(0, backY, 0, x2, backY, z2, x1, backY, z1);
    normals.push(0, -1, 0, 0, -1, 0, 0, -1, 0);
    uvs.push(0.5, 0.5, uv2u, uv2v, uv1u, uv1v);
  }
  const backIndexCount = positions.length / 3 - backStartIndex;

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  geom.addGroup(edgeStartIndex, edgeIndexCount, 0);
  geom.addGroup(frontStartIndex, frontIndexCount, 1);
  geom.addGroup(backStartIndex, backIndexCount, 2);

  geom.computeBoundingBox();
  geom.computeBoundingSphere();

  sharedCoinGeometry = geom;
  return sharedCoinGeometry;
}

/**
 * Returns physical PBR materials with calibrated saturation, metallic sheen, and clearcoat
 */
export function getCoinMaterials(asset: CryptoAsset): THREE.Material[] {
  if (materialCache.has(asset)) {
    return materialCache.get(asset)!;
  }

  const cfg = ASSET_CONFIGS[asset];
  const colorMap = createFaceColorTexture(asset);
  const bumpMap = createFaceBumpTexture(asset);
  const edgeBump = createEdgeBumpTexture();

  // 1. Edge Material - Rich brushed metallic rim
  const edgeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.edgeColor),
    metalness: 0.72,
    roughness: 0.22,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    bumpMap: edgeBump,
    bumpScale: 1.8,
  });

  // 2. Front Face Material - Vivid color fidelity with high-contrast specular reflections
  const faceMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.5,
    metalness: 0.40,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.08,
  });

  // 3. Back Face Material
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.5,
    metalness: 0.40,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.08,
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
