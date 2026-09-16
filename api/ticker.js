export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 10 } }
    );
    
    if (!response.ok) throw new Error(`CoinGecko status: ${response.status}`);
    const data = await response.json();
    
    const RETAIL_MARKUP = 1.10; // 10% retail markup accounting for 1% TDS (Sec 194S) and platform spread

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
      priceUsd: (data[coin.id]?.usd || 0) * RETAIL_MARKUP,
      priceInr: (data[coin.id]?.inr || 0) * RETAIL_MARKUP,
      changePercent24Hr: data[coin.id]?.usd_24h_change || 0
    }));

    return new Response(JSON.stringify({ data: compiledData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=10'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
