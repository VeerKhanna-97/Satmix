export const config = { runtime: 'edge' };

// In-memory edge cache (30-second TTL)
let cachedCompiledData = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30000;

const RETAIL_MARKUP = 1.025; // 2.5% retail markup accounting for 1% TDS (Sec 194S) and platform spread

const FALLBACK_BASELINE = [
  { id: 'bitcoin', symbol: 'BTC', priceUsd: 91500 * RETAIL_MARKUP, priceInr: 8150000 * RETAIL_MARKUP, changePercent24Hr: 2.15 },
  { id: 'ethereum', symbol: 'ETH', priceUsd: 3350 * RETAIL_MARKUP, priceInr: 298000 * RETAIL_MARKUP, changePercent24Hr: 1.45 },
  { id: 'solana', symbol: 'SOL', priceUsd: 195 * RETAIL_MARKUP, priceInr: 17400 * RETAIL_MARKUP, changePercent24Hr: 3.82 },
  { id: 'tether', symbol: 'USDT', priceUsd: 1.00 * RETAIL_MARKUP, priceInr: 89.20 * RETAIL_MARKUP, changePercent24Hr: 0.05 },
  { id: 'ripple', symbol: 'XRP', priceUsd: 0.62 * RETAIL_MARKUP, priceInr: 55.40 * RETAIL_MARKUP, changePercent24Hr: -0.80 },
  { id: 'cardano', symbol: 'ADA', priceUsd: 0.45 * RETAIL_MARKUP, priceInr: 40.10 * RETAIL_MARKUP, changePercent24Hr: 1.10 },
  { id: 'dogecoin', symbol: 'DOGE', priceUsd: 0.14 * RETAIL_MARKUP, priceInr: 12.50 * RETAIL_MARKUP, changePercent24Hr: -1.25 },
  { id: 'polkadot', symbol: 'DOT', priceUsd: 5.20 * RETAIL_MARKUP, priceInr: 464.00 * RETAIL_MARKUP, changePercent24Hr: 0.90 }
].map(c => ({
  ...c,
  priceUsd: Number(c.priceUsd.toFixed(2)),
  priceInr: Number(c.priceInr.toFixed(2)),
  changePercent24Hr: Number(c.changePercent24Hr.toFixed(2))
}));

export default async function handler(req) {
  const now = Date.now();

  // 1. Serve from in-memory cache if fresh (< 30 seconds)
  if (cachedCompiledData && (now - lastCacheTime < CACHE_TTL_MS)) {
    return new Response(JSON.stringify({ data: cachedCompiledData, cached: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache-Status': 'HIT'
      }
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true',
      {
        headers: { 'User-Agent': 'Satmix-Ticker/5.0 (https://satmix.in)' },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CoinGecko rate-limit or error (HTTP ${response.status})`);
    }

    const data = await response.json();

    const coins = [
      { id: 'bitcoin', symbol: 'BTC' },
      { id: 'ethereum', symbol: 'ETH' },
      { id: 'solana', symbol: 'SOL' },
      { id: 'tether', symbol: 'USDT' },
      { id: 'ripple', symbol: 'XRP' },
      { id: 'cardano', symbol: 'ADA' },
      { id: 'dogecoin', symbol: 'DOGE' },
      { id: 'polkadot', symbol: 'DOT' }
    ];

    const compiledData = coins.map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      priceUsd: Number(((data[coin.id]?.usd || 0) * RETAIL_MARKUP).toFixed(2)),
      priceInr: Number(((data[coin.id]?.inr || 0) * RETAIL_MARKUP).toFixed(2)),
      changePercent24Hr: Number((data[coin.id]?.usd_24h_change || 0).toFixed(2))
    }));

    // Update in-memory cache
    cachedCompiledData = compiledData;
    lastCacheTime = now;

    return new Response(JSON.stringify({ data: compiledData, cached: false }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache-Status': 'MISS'
      }
    });
  } catch (err) {
    console.warn('Ticker upstream fetch warning, falling back to cache:', err.message);

    // Fallback: return existing cache or baseline data with HTTP 200 (never 500!)
    const fallbackData = cachedCompiledData || FALLBACK_BASELINE;
    return new Response(JSON.stringify({ data: fallbackData, cached: true, fallback: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'X-Cache-Status': 'FALLBACK'
      }
    });
  }
}
