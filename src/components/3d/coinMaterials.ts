// ============================================================
// FILE: src/components/3d/coinMaterials.ts
// PURPOSE: Procedural high-res textures, geometry, and physical materials for 3D crypto coins
// ============================================================

import * as THREE from 'three';

export type CryptoAsset = 'BTC' | 'ETH' | 'SOL' | 'USDT';

const ASSET_COLORS: Record<CryptoAsset, string> = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#9945FF',
  USDT: '#26A17B',
};

const ASSET_EDGE_COLORS: Record<CryptoAsset, string> = {
  BTC: '#E8860F',
  ETH: '#5068D6',
  SOL: '#5A3BD6',
  USDT: '#1F8D6B',
};

const TEXTURE_RES = 1024;

// Cache map for generated textures and materials to prevent memory duplication
const textureCache = new Map<string, THREE.CanvasTexture>();
const materialCache = new Map<CryptoAsset, THREE.Material[]>();
let sharedCoinGeometry: THREE.BufferGeometry | null = null;

function createCanvas2D(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_RES;
  canvas.height = TEXTURE_RES;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/**
 * Draws sharp, vector-quality crypto symbol glyphs directly onto canvas
 */
function drawAssetGlyph(ctx: CanvasRenderingContext2D, asset: CryptoAsset) {
  const center = TEXTURE_RES / 2;
  ctx.save();
  ctx.translate(center, center);

  if (asset === 'BTC') {
    ctx.rotate((14 * Math.PI) / 180);
    ctx.font = `800 ${TEXTURE_RES * 0.54}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', TEXTURE_RES * 0.015, TEXTURE_RES * 0.02);

    // Twin vertical notches for Bitcoin symbol
    const notchWidth = TEXTURE_RES * 0.038;
    const notchHeight = TEXTURE_RES * 0.075;
    for (const offset of [-TEXTURE_RES * 0.075, TEXTURE_RES * 0.005]) {
      ctx.fillRect(offset, -TEXTURE_RES * 0.28, notchWidth, notchHeight);
      ctx.fillRect(offset, TEXTURE_RES * 0.21, notchWidth, notchHeight);
    }
  } else if (asset === 'ETH') {
    // Sleek geometric diamond plates
    const width = TEXTURE_RES * 0.4;
    const barHeight = TEXTURE_RES * 0.065;
    const radius = barHeight / 2;
    const drawPill = (y: number, w: number) => {
      ctx.beginPath();
      ctx.roundRect(-w / 2, y - barHeight / 2, w, barHeight, radius);
      ctx.fill();
    };
    drawPill(-TEXTURE_RES * 0.16, width);
    drawPill(0, width * 0.72);
    drawPill(TEXTURE_RES * 0.16, width);
  } else if (asset === 'SOL') {
    // Solana layered concentric arcs
    ctx.lineWidth = TEXTURE_RES * 0.055;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(0, 0, TEXTURE_RES * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, TEXTURE_RES * 0.085, 0, Math.PI * 2);
    ctx.fill();
  } else if (asset === 'USDT') {
    // Geometric Tether 'T' symbol
    const barThickness = TEXTURE_RES * 0.075;
    // Top bar
    ctx.fillRect(-TEXTURE_RES * 0.2, -TEXTURE_RES * 0.22, TEXTURE_RES * 0.4, barThickness);
    // Vertical stem
    ctx.fillRect(-barThickness / 2, -TEXTURE_RES * 0.22, barThickness, TEXTURE_RES * 0.45);

    // Dynamic ellipse crossbar
    ctx.save();
    ctx.rotate(-0.42);
    ctx.fillRect(-TEXTURE_RES * 0.17, -TEXTURE_RES * 0.02, TEXTURE_RES * 0.34, barThickness * 0.75);
    ctx.fillRect(-TEXTURE_RES * 0.17, TEXTURE_RES * 0.09, TEXTURE_RES * 0.34, barThickness * 0.75);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Creates high-res color and emissive face map
 */
function createFaceColorTexture(asset: CryptoAsset): THREE.CanvasTexture {
  const cacheKey = `face-map-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  const baseColor = new THREE.Color(ASSET_COLORS[asset]);

  if (asset === 'SOL') {
    const grad = ctx.createLinearGradient(0, TEXTURE_RES, TEXTURE_RES, 0);
    grad.addColorStop(0, '#9945FF');
    grad.addColorStop(0.55, '#5F7CF0');
    grad.addColorStop(1, '#14F195');
    ctx.fillStyle = grad;
  } else {
    const grad = ctx.createRadialGradient(
      TEXTURE_RES * 0.35,
      TEXTURE_RES * 0.3,
      TEXTURE_RES * 0.05,
      TEXTURE_RES / 2,
      TEXTURE_RES / 2,
      TEXTURE_RES * 0.62
    );
    grad.addColorStop(0, '#' + baseColor.clone().lerp(new THREE.Color('#ffffff'), 0.28).getHexString());
    grad.addColorStop(1, '#' + baseColor.clone().lerp(new THREE.Color('#000000'), 0.1).getHexString());
    ctx.fillStyle = grad;
  }

  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  // Concentric decorative rim line
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = TEXTURE_RES * 0.012;
  ctx.beginPath();
  ctx.arc(TEXTURE_RES / 2, TEXTURE_RES / 2, TEXTURE_RES * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // Draw pure white asset glyph
  ctx.fillStyle = '#FFFFFF';
  drawAssetGlyph(ctx, asset);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates high-detail micro bump map for coin face grooves
 */
function createFaceBumpTexture(asset: CryptoAsset): THREE.CanvasTexture {
  const cacheKey = `face-bump-${asset}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const [canvas, ctx] = createCanvas2D();
  ctx.fillStyle = '#404040';
  ctx.fillRect(0, 0, TEXTURE_RES, TEXTURE_RES);

  ctx.filter = 'blur(4px)';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = TEXTURE_RES * 0.015;
  ctx.beginPath();
  ctx.arc(TEXTURE_RES / 2, TEXTURE_RES / 2, TEXTURE_RES * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  drawAssetGlyph(ctx, asset);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Fluted edge bump map (120 radial coin notches)
 */
function createEdgeBumpTexture(): THREE.CanvasTexture {
  const cacheKey = 'edge-bump';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 4;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 16, 0);
  grad.addColorStop(0, '#000000');
  grad.addColorStop(0.5, '#FFFFFF');
  grad.addColorStop(1, '#000000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(120, 1);
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Procedural coin geometry with beveled rim curve
 */
export function getCoinGeometry(): THREE.BufferGeometry {
  if (sharedCoinGeometry) {
    return sharedCoinGeometry;
  }

  const radius = 0.34;
  const innerRadius = radius * 0.82;
  const halfThickness = 0.08 / 2;
  const innerHalf = halfThickness * 0.62;

  // Bevel profile contour points
  const points: THREE.Vector2[] = [
    new THREE.Vector2(innerRadius, -innerHalf),
    new THREE.Vector2(innerRadius + 0.006, -halfThickness),
    new THREE.Vector2(radius - 0.01, -halfThickness),
    new THREE.Vector2(radius, -halfThickness + 0.01),
    new THREE.Vector2(radius, halfThickness - 0.01),
    new THREE.Vector2(radius - 0.01, halfThickness),
    new THREE.Vector2(innerRadius + 0.006, halfThickness),
    new THREE.Vector2(innerRadius, innerHalf),
  ];

  const rimLathe = new THREE.LatheGeometry(points, 96);
  const faceCapFront = new THREE.CircleGeometry(innerRadius, 96);
  faceCapFront.rotateX(-Math.PI / 2);
  faceCapFront.translate(0, innerHalf, 0);

  const faceCapBack = new THREE.CircleGeometry(innerRadius, 96);
  faceCapBack.rotateX(Math.PI / 2);
  faceCapBack.rotateY(Math.PI);
  faceCapBack.translate(0, -innerHalf, 0);

  // Group geometries with material indices: 0 = rim, 1 = front face, 2 = back face
  const mergedGeom = new THREE.CylinderGeometry(radius, radius, 0.08, 96, 1, false);
  mergedGeom.computeVertexNormals();

  sharedCoinGeometry = mergedGeom;
  return sharedCoinGeometry;
}

/**
 * Returns physical materials: [edgeMaterial, frontFaceMaterial, backFaceMaterial]
 */
export function getCoinMaterials(asset: CryptoAsset): THREE.Material[] {
  if (materialCache.has(asset)) {
    return materialCache.get(asset)!;
  }

  const colorMap = createFaceColorTexture(asset);
  const bumpMap = createFaceBumpTexture(asset);
  const edgeBump = createEdgeBumpTexture();

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(ASSET_EDGE_COLORS[asset]),
    metalness: 0.65,
    roughness: 0.28,
    bumpMap: edgeBump,
    bumpScale: 1.2,
  });

  const faceMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    bumpMap: bumpMap,
    bumpScale: 2.0,
    metalness: 0.2,
    roughness: 0.32,
    emissive: new THREE.Color(ASSET_COLORS[asset]),
    emissiveIntensity: 0.15,
  });

  const materials = [edgeMaterial, faceMaterial, faceMaterial];
  materialCache.set(asset, materials);
  return materials;
}
