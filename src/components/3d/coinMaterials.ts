// ============================================================
// FILE: src/components/3d/coinMaterials.ts
// PURPOSE: High-res procedural canvas textures, beveled coin geometry,
//          and physical PBR materials for 3D crypto coins (BTC, ETH, SOL, USDT)
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

const TEXTURE_RES = 1024;

// Cache map for generated textures, materials, and shared geometry to avoid memory churn
const textureCache = new Map<string, THREE.CanvasTexture>();
const materialCache = new Map<CryptoAsset, THREE.Material[]>();
let sharedCoinGeometry: THREE.BufferGeometry | null = null;

function createCanvas2D(width = TEXTURE_RES, height = TEXTURE_RES): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * Draws sharp, vector-quality crypto symbol glyphs directly onto canvas.
 * Rendered at exact coordinates for resolution-independent clarity.
 */
function drawAssetGlyph(ctx: CanvasRenderingContext2D, asset: CryptoAsset, color = '#FFFFFF') {
  const center = TEXTURE_RES / 2;
  ctx.save();
  ctx.translate(center, center);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (asset === 'BTC') {
    // 14-degree clockwise rotated bold Bitcoin glyph with twin vertical notches
    ctx.rotate((14 * Math.PI) / 180);

    const notchW = 24;
    const notchH = 55;
    const spineW = 46;
    const spineH = 340;
    const spineX = -75;

    // Left vertical spine
    ctx.fillRect(spineX, -spineH / 2, spineW, spineH);

    // Top loop
    const rTop = 95;
    const rTopIn = 52;
    const cyTop = -78;
    ctx.beginPath();
    ctx.arc(0, cyTop, rTop, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(spineX + spineW, cyTop + rTop);
    ctx.lineTo(spineX + spineW, cyTop - rTop);
    ctx.closePath();
    ctx.fill();

    // Top loop cutout
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(0, cyTop, rTopIn, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(spineX + spineW, cyTop + rTopIn);
    ctx.lineTo(spineX + spineW, cyTop - rTopIn);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Bottom loop (slightly wider)
    const rBot = 108;
    const rBotIn = 58;
    const cyBot = 82;
    ctx.beginPath();
    ctx.arc(8, cyBot, rBot, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(spineX + spineW, cyBot + rBot);
    ctx.lineTo(spineX + spineW, cyBot - rBot);
    ctx.closePath();
    ctx.fill();

    // Bottom loop cutout
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(8, cyBot, rBotIn, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(spineX + spineW, cyBot + rBotIn);
    ctx.lineTo(spineX + spineW, cyBot - rBotIn);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Middle indent bar connecting loops
    ctx.fillRect(spineX, -18, 95, 36);

    // Twin vertical notches passing through top and bottom
    const notchX1 = -28;
    const notchX2 = 24;
    // Top notches
    ctx.fillRect(notchX1, -spineH / 2 - notchH + 12, notchW, notchH);
    ctx.fillRect(notchX2, -spineH / 2 - notchH + 12, notchW, notchH);
    // Bottom notches
    ctx.fillRect(notchX1, spineH / 2 - 12, notchW, notchH);
    ctx.fillRect(notchX2, spineH / 2 - 12, notchW, notchH);
  } else if (asset === 'ETH') {
    // Sleek stacked diamond bars with chamfered faceted tips
    const drawDiamondBar = (y: number, width: number, height: number) => {
      const chamfer = height * 0.48;
      ctx.beginPath();
      ctx.moveTo(-width / 2 + chamfer, y - height / 2);
      ctx.lineTo(width / 2 - chamfer, y - height / 2);
      ctx.lineTo(width / 2, y);
      ctx.lineTo(width / 2 - chamfer, y + height / 2);
      ctx.lineTo(-width / 2 + chamfer, y + height / 2);
      ctx.lineTo(-width / 2, y);
      ctx.closePath();
      ctx.fill();
    };

    const h = 58;
    drawDiamondBar(-150, 360, h);
    drawDiamondBar(0, 260, h);
    drawDiamondBar(150, 360, h);

    // Subtle faceted center line
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -180);
    ctx.lineTo(0, 180);
    ctx.stroke();
    ctx.restore();
  } else if (asset === 'SOL') {
    // Layered dual concentric circle arcs with rounded terminal caps
    ctx.lineCap = 'round';

    // Outer primary circular arc
    ctx.lineWidth = 44;
    ctx.beginPath();
    ctx.arc(0, 0, 195, 0.38 * Math.PI, 1.88 * Math.PI, false);
    ctx.stroke();

    // Inner counter circular arc
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.arc(0, 0, 118, 1.38 * Math.PI, 2.88 * Math.PI, false);
    ctx.stroke();

    // Central core accent pip
    ctx.beginPath();
    ctx.arc(0, 0, 28, 0, Math.PI * 2);
    ctx.fill();
  } else if (asset === 'USDT') {
    // Geometric Tether 'T' with curved crossbar arches
    const barW = 350;
    const barH = 58;
    const stemW = 60;
    const stemH = 360;

    // Top crossbar
    ctx.fillRect(-barW / 2, -180, barW, barH);

    // Central vertical stem
    ctx.fillRect(-stemW / 2, -180, stemW, stemH);

    // Curved elliptical horizontal ring / belt
    ctx.lineWidth = 42;
    ctx.beginPath();
    ctx.ellipse(0, 25, 185, 75, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Creates high-resolution 1024x1024 procedural color map for coin face
 */
export function createFaceColorTexture(asset: CryptoAsset): THREE.CanvasTexture {
  const cacheKey = `face-color-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  const center = TEXTURE_RES / 2;
  const cfg = ASSET_CONFIGS[asset];

  // Base background gradient matching brand specifications
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

  // Subtle minted coin concentric rings & bevel grooves
  // Outer bright highlight ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(center, center, 468, 0, Math.PI * 2);
  ctx.stroke();

  // Stepped inner shadow groove
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(center, center, 446, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (72 circular micro-dots)
  const dotCount = 72;
  const dotRadius = 428;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    const x = center + dotRadius * Math.cos(a);
    const y = center + dotRadius * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner hairline ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(center, center, 412, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle radial sheen reflection lines
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

  // Crisp white glyph with subtle drop highlight
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  drawAssetGlyph(ctx, asset, '#FFFFFF');
  ctx.shadowColor = 'transparent';

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
  const cacheKey = `face-bump-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  const center = TEXTURE_RES / 2;

  // Baseline mid-gray (neutral displacement)
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // Outer raised rim plateau
  ctx.strokeStyle = '#D8D8D8';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.arc(center, center, 466, 0, Math.PI * 2);
  ctx.stroke();

  // Rim groove (recessed dark notch)
  ctx.strokeStyle = '#383838';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(center, center, 446, 0, Math.PI * 2);
  ctx.stroke();

  // Milled beaded ring (raised dots)
  const dotCount = 72;
  const dotRadius = 428;
  ctx.fillStyle = '#C4C4C4';
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    const x = center + dotRadius * Math.cos(a);
    const y = center + dotRadius * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner accent line
  ctx.strokeStyle = '#A8A8A8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(center, center, 412, 0, Math.PI * 2);
  ctx.stroke();

  // Micro lathe concentric turn rings
  for (let r = 80; r < 400; r += 32) {
    ctx.strokeStyle = r % 64 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Soft Gaussian-like blur on glyph for smooth physical bevel transition
  ctx.save();
  ctx.shadowColor = '#FFFFFF';
  ctx.shadowBlur = 6;
  drawAssetGlyph(ctx, asset, '#FFFFFF');
  // Second crisp pass to raise plateau center
  drawAssetGlyph(ctx, asset, '#FFFFFF');
  ctx.restore();

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
    // Cosine profile: 240 at ridge apex, 20 at groove trough
    const val = Math.floor(130 + 110 * Math.cos(angle));
    for (let y = 0; y < 4; y++) {
      const idx = (y * 16 + x) * 4;
      imgData.data[idx] = val;     // R
      imgData.data[idx + 1] = val; // G
      imgData.data[idx + 2] = val; // B
      imgData.data[idx + 3] = 255; // A
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
 *
 * Material groups:
 * Group 0: Rim / Edge + Bevels (maps to edgeMaterial)
 * Group 1: Front Face (maps to faceMaterial)
 * Group 2: Back Face (maps to backMaterial)
 */
export function getCoinGeometry(): THREE.BufferGeometry {
  if (sharedCoinGeometry) {
    return sharedCoinGeometry;
  }

  const outerRadius = 0.34;
  const thickness = 0.08;
  const halfH = thickness / 2; // 0.04
  const bevelRadius = 0.012;
  const innerRadius = outerRadius - bevelRadius; // 0.328
  const radialSegments = 96;

  // Bevel profile points along (r, y) with outward normal (nr, ny)
  // Arc steps for bottom and top bevels
  const bevelSteps = 4;
  const profile: { r: number; y: number; nr: number; ny: number }[] = [];

  // 1. Bottom bevel arc (from bottom face rim phi = -pi/2 to horizontal phi = 0)
  for (let j = 0; j <= bevelSteps; j++) {
    const phi = -Math.PI / 2 + (Math.PI / 2) * (j / bevelSteps);
    profile.push({
      r: innerRadius + bevelRadius * Math.cos(phi),
      y: -halfH + bevelRadius + bevelRadius * Math.sin(phi),
      nr: Math.cos(phi),
      ny: Math.sin(phi),
    });
  }

  // 2. Straight vertical cylinder wall
  const straightWallYTop = halfH - bevelRadius;
  if (straightWallYTop > profile[profile.length - 1].y) {
    profile.push({
      r: outerRadius,
      y: straightWallYTop,
      nr: 1,
      ny: 0,
    });
  }

  // 3. Top bevel arc (from phi = 0 to top face rim phi = +pi/2)
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
      const p1 = profile[p];
      const p2 = profile[p + 1];
      const v1 = p / (profileCount - 1);
      const v2 = (p + 1) / (profileCount - 1);

      // Vertex A (theta1, p1)
      const ax = p1.r * cos1, ay = p1.y, az = p1.r * sin1;
      const anx = p1.nr * cos1, any = p1.ny, anz = p1.nr * sin1;

      // Vertex B (theta2, p1)
      const bx = p1.r * cos2, by = p1.y, bz = p1.r * sin2;
      const bnx = p1.nr * cos2, bny = p1.ny, bnz = p1.nr * sin2;

      // Vertex C (theta1, p2)
      const cx = p2.r * cos1, cy = p2.y, cz = p2.r * sin1;
      const cnx = p2.nr * cos1, cny = p2.ny, cnz = p2.nr * sin1;

      // Vertex D (theta2, p2)
      const dx = p2.r * cos2, dy = p2.y, dz = p2.r * sin2;
      const dnx = p2.nr * cos2, dny = p2.ny, dnz = p2.nr * sin2;

      // Triangle 1: A -> B -> D
      positions.push(ax, ay, az,  bx, by, bz,  dx, dy, dz);
      normals.push(anx, any, anz,  bnx, bny, bnz,  dnx, dny, dnz);
      uvs.push(u1, v1,  u2, v1,  u2, v2);

      // Triangle 2: A -> D -> C
      positions.push(ax, ay, az,  dx, dy, dz,  cx, cy, cz);
      normals.push(anx, any, anz,  dnx, dny, dnz,  cnx, cny, cnz);
      uvs.push(u1, v1,  u2, v2,  u1, v2);
    }
  }
  const edgeCount = (positions.length / 3) - edgeStartIndex;

  // Group 1: Front Face (+Y)
  const frontStartIndex = positions.length / 3;
  for (let i = 0; i < radialSegments; i++) {
    const theta1 = (i / radialSegments) * Math.PI * 2;
    const theta2 = ((i + 1) / radialSegments) * Math.PI * 2;

    const x1 = innerRadius * Math.cos(theta1);
    const z1 = innerRadius * Math.sin(theta1);
    const x2 = innerRadius * Math.cos(theta2);
    const z2 = innerRadius * Math.sin(theta2);

    // Planar UV projection scaled to outer coin radius
    const uCenter = 0.5;
    const vCenter = 0.5;
    const u1 = 0.5 + (x1 / (outerRadius * 2));
    const v1 = 0.5 - (z1 / (outerRadius * 2));
    const u2 = 0.5 + (x2 / (outerRadius * 2));
    const v2 = 0.5 - (z2 / (outerRadius * 2));

    // Triangle: Center -> (x1, z1) -> (x2, z2)
    positions.push(0, halfH, 0,  x1, halfH, z1,  x2, halfH, z2);
    normals.push(0, 1, 0,  0, 1, 0,  0, 1, 0);
    uvs.push(uCenter, vCenter,  u1, v1,  u2, v2);
  }
  const frontCount = (positions.length / 3) - frontStartIndex;

  // Group 2: Back Face (-Y)
  const backStartIndex = positions.length / 3;
  for (let i = 0; i < radialSegments; i++) {
    const theta1 = (i / radialSegments) * Math.PI * 2;
    const theta2 = ((i + 1) / radialSegments) * Math.PI * 2;

    const x1 = innerRadius * Math.cos(theta1);
    const z1 = innerRadius * Math.sin(theta1);
    const x2 = innerRadius * Math.cos(theta2);
    const z2 = innerRadius * Math.sin(theta2);

    const uCenter = 0.5;
    const vCenter = 0.5;
    const u1 = 0.5 - (x1 / (outerRadius * 2));
    const v1 = 0.5 - (z1 / (outerRadius * 2));
    const u2 = 0.5 - (x2 / (outerRadius * 2));
    const v2 = 0.5 - (z2 / (outerRadius * 2));

    // Triangle wound counter-clockwise looking from bottom: Center -> (x2, z2) -> (x1, z1)
    positions.push(0, -halfH, 0,  x2, -halfH, z2,  x1, -halfH, z1);
    normals.push(0, -1, 0,  0, -1, 0,  0, -1, 0);
    uvs.push(uCenter, vCenter,  u2, v2,  u1, v1);
  }
  const backCount = (positions.length / 3) - backStartIndex;

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

  // Assign Three.js material groups: [edgeMaterial, faceMaterial, backMaterial]
  geometry.addGroup(edgeStartIndex, edgeCount, 0);
  geometry.addGroup(frontStartIndex, frontCount, 1);
  geometry.addGroup(backStartIndex, backCount, 2);

  sharedCoinGeometry = geometry;
  return sharedCoinGeometry;
}

/**
 * Returns physical materials: [edgeMaterial, faceMaterial, backMaterial]
 * Uses MeshPhysicalMaterial with metalness 0.55, roughness 0.28, clearcoat 0.6, bumpScale 1.8.
 */
export function getCoinMaterials(asset: CryptoAsset): THREE.Material[] {
  if (materialCache.has(asset)) {
    return materialCache.get(asset)!;
  }

  const colorMap = createFaceColorTexture(asset);
  const bumpMap = createFaceBumpTexture(asset);
  const edgeBump = createEdgeBumpTexture();
  const cfg = ASSET_CONFIGS[asset];

  // 1. Edge Material: High-sheen fluted coin rim
  const edgeMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(cfg.edgeColor),
    metalness: 0.55,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    bumpMap: edgeBump,
    bumpScale: 1.8,
  });

  // 2. Front Face Material: Vivid brand color with raised minted glyph relief
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

  // 3. Back Face Material: Cohesive reverse side
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

/**
 * Convenience helper to create a complete coin Mesh with shared geometry and materials
 */
export function createCoinMesh(asset: CryptoAsset): THREE.Mesh {
  const geom = getCoinGeometry();
  const mats = getCoinMaterials(asset);
  return new THREE.Mesh(geom, mats);
}

/**
 * Clears texture, material, and geometry caches to free WebGL GPU memory
 */
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
