// ============================================================
// FILE: src/components/3d/coinMaterials.ts
// PURPOSE: High-res procedural canvas textures with official currency logos,
//          beveled coin geometry, and physical PBR materials for 3D crypto coins
//          Supported assets: BTC, ETH, SOL, USDT
// ============================================================

import * as THREE from 'three';

export type CryptoAsset = 'BTC' | 'ETH' | 'SOL' | 'USDT';
export type CoinType = CryptoAsset;

export interface AssetColorConfig {
  gradientStart: string;
  gradientMid?: string;
  gradientEnd: string;
  edgeColor: string;
  emissiveColor: string;
}

const ASSET_CONFIGS: Record<CryptoAsset, AssetColorConfig> = {
  BTC: {
    gradientStart: '#F7931A',
    gradientEnd: '#E8860F',
    edgeColor: '#C46D08',
    emissiveColor: '#F7931A',
  },
  ETH: {
    gradientStart: '#627EEA',
    gradientEnd: '#5068D6',
    edgeColor: '#4358A8',
    emissiveColor: '#627EEA',
  },
  SOL: {
    gradientStart: '#9945FF',
    gradientMid: '#5F7CF0',
    gradientEnd: '#14F195',
    edgeColor: '#5A3BD6',
    emissiveColor: '#14F195',
  },
  USDT: {
    gradientStart: '#26A17B',
    gradientEnd: '#1F8D6B',
    edgeColor: '#166E53',
    emissiveColor: '#26A17B',
  },
};

const LOGO_PATHS: Record<CryptoAsset, string> = {
  BTC: '/currencies/bitcoin.png',
  ETH: '/currencies/ethereum-eth-logo.png',
  SOL: '/currencies/Solana.png',
  USDT: '/currencies/USDT.png',
};

const TEXTURE_RES = 1024;

// Cache map for generated textures, materials, and shared geometry to avoid memory churn
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
 * Preloads the official coin logo images from public/currencies/
 * When loaded, seamlessly redraws textures and sets needsUpdate = true.
 */
function preloadLogo(asset: CryptoAsset) {
  if (typeof window === 'undefined') return;
  if (loadedLogoImages.has(asset)) return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = LOGO_PATHS[asset];
  img.onload = () => {
    loadedLogoImages.set(asset, img);
    refreshCoinTextures(asset);
  };
}

function refreshCoinTextures(asset: CryptoAsset) {
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
 * Fallback procedural drawing when image is still loading
 */
function drawFallbackGlyph(ctx: CanvasRenderingContext2D, asset: CryptoAsset, color = '#FFFFFF') {
  const center = TEXTURE_RES / 2;
  ctx.save();
  ctx.translate(center, center);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (asset === 'BTC') {
    ctx.rotate((14 * Math.PI) / 180);
    ctx.font = `800 ${TEXTURE_RES * 0.54}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', TEXTURE_RES * 0.015, TEXTURE_RES * 0.02);
    const notchW = 24;
    const notchH = 55;
    for (const offset of [-TEXTURE_RES * 0.075, TEXTURE_RES * 0.005]) {
      ctx.fillRect(offset, -TEXTURE_RES * 0.28, notchW, notchH);
      ctx.fillRect(offset, TEXTURE_RES * 0.21, notchW, notchH);
    }
  } else if (asset === 'ETH') {
    const w = TEXTURE_RES * 0.38;
    const h = 54;
    const r = h / 2;
    const drawPill = (y: number, pillW: number) => {
      ctx.beginPath();
      ctx.roundRect(-pillW / 2, y - h / 2, pillW, h, r);
      ctx.fill();
    };
    drawPill(-TEXTURE_RES * 0.16, w);
    drawPill(0, w * 0.72);
    drawPill(TEXTURE_RES * 0.16, w);
  } else if (asset === 'SOL') {
    ctx.lineWidth = 48;
    ctx.beginPath();
    ctx.arc(0, 0, 190, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 2);
    ctx.fill();
  } else if (asset === 'USDT') {
    ctx.fillRect(-175, -180, 350, 58);
    ctx.fillRect(-30, -180, 60, 360);
    ctx.lineWidth = 42;
    ctx.beginPath();
    ctx.ellipse(0, 25, 185, 75, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Renders the official currency logo in the center of the coin face
 */
function drawOfficialLogo(ctx: CanvasRenderingContext2D, asset: CryptoAsset, logoImg?: HTMLImageElement) {
  const center = TEXTURE_RES / 2;
  const targetSize = asset === 'BTC' ? 520 : asset === 'SOL' ? 480 : 490;

  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    // Render official logo centered with crisp dimensions
    ctx.drawImage(
      logoImg,
      center - targetSize / 2,
      center - targetSize / 2,
      targetSize,
      targetSize
    );
    ctx.restore();
  } else {
    // If image is still fetching, use crisp geometric fallback
    drawFallbackGlyph(ctx, asset, '#FFFFFF');
  }
}

/**
 * Full render pass for Color Map
 */
function renderFaceColorPass(ctx: CanvasRenderingContext2D, asset: CryptoAsset, logoImg?: HTMLImageElement) {
  const center = TEXTURE_RES / 2;
  const cfg = ASSET_CONFIGS[asset];

  ctx.clearRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // 1. Base metallic background gradient
  if (asset === 'SOL') {
    const grad = ctx.createLinearGradient(120, TEXTURE_RES - 120, TEXTURE_RES - 120, 120);
    grad.addColorStop(0, cfg.gradientStart);
    if (cfg.gradientMid) grad.addColorStop(0.52, cfg.gradientMid);
    grad.addColorStop(1, cfg.gradientEnd);
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createRadialGradient(
      center - 50,
      center - 70,
      30,
      center,
      center,
      TEXTURE_RES * 0.49
    );
    grad.addColorStop(0, cfg.gradientStart);
    grad.addColorStop(0.75, cfg.gradientEnd);
    grad.addColorStop(1, cfg.edgeColor);
    ctx.fillStyle = grad;
  }
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // 2. Concentric minted rings & fluted bevel grooves
  // Outer bright highlight ring (exact rim boundary: 512px)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
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
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, 442, 0, Math.PI * 2);
  ctx.stroke();

  // Radial lathe reflection lines
  ctx.save();
  ctx.translate(center, center);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1.5;
  for (let deg = 0; deg < 360; deg += 12) {
    const rad = (deg * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(Math.cos(rad) * 60, Math.sin(rad) * 60);
    ctx.lineTo(Math.cos(rad) * 400, Math.sin(rad) * 400);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Official Logo in Center
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 10;
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

  // Outer raised rim plateau (exact boundary to rim)
  ctx.strokeStyle = '#E0E0E0';
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
  ctx.fillStyle = '#D0D0D0';
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
  for (let r = 80; r < 400; r += 32) {
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
  preloadLogo(asset);
  const cacheKey = `face-color-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  const img = loadedLogoImages.get(asset);
  renderFaceColorPass(ctx, asset, img);

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
  preloadLogo(asset);
  const cacheKey = `face-bump-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  const img = loadedLogoImages.get(asset);
  renderFaceBumpPass(ctx, asset, img);

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
  const innerRadius = outerRadius - bevelRadius;
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
      uvs.push(u2, vValA, u1, vValB, u2, vValB);
    }
  }
  const edgeIndexCount = positions.length / 3 - edgeStartIndex;

  // Group 1: Front Face (+Y)
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

  // Group 2: Back Face (-Y)
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
 * Returns physical materials: [edgeMaterial, frontFaceMaterial, backFaceMaterial]
 */
export function getCoinMaterials(asset: CryptoAsset): THREE.Material[] {
  if (materialCache.has(asset)) {
    return materialCache.get(asset)!;
  }

  const cfg = ASSET_CONFIGS[asset];
  const colorMap = createFaceColorTexture(asset);
  const bumpMap = createFaceBumpTexture(asset);
  const edgeBump = createEdgeBumpTexture();

  // 1. Edge Material
  const edgeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.edgeColor),
    metalness: 0.65,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    bumpMap: edgeBump,
    bumpScale: 1.8,
  });

  // 2. Front Face Material
  const faceMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.8,
    metalness: 0.55,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.12,
  });

  // 3. Back Face Material
  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 1.8,
    metalness: 0.55,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    emissive: new THREE.Color(cfg.emissiveColor),
    emissiveIntensity: 0.12,
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
