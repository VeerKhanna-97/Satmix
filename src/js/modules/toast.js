
let toastContainer;
export function initToast() {
  toastContainer = document.getElementById('toast-container');
}


  const tickerTrack = document.querySelector('.ticker-track');
  let previousPrices = {};

  async function fetchCryptoPrices() {
    try {
      let backendData = null;
      let usingBackend = false;
      try {
        // First try the backend proxy (bypasses browser adblockers on live site)
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.length > 0) {
            backendData = json.data;
            usingBackend = true;
          }
        }
      } catch (e) {
        // Backend failed (e.g. testing locally offline without Vercel CLI)
      }

      if (usingBackend && backendData) {
        renderTicker(backendData);
      } else {
        // Fallback: Fetch crypto data directly from CoinGecko API client-side
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true');
        if (!res.ok) throw new Error(`API error! status: ${res.status}`);
        const data = await res.json();
        
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

        const compiledData = coins.map(coin => {
          const coinData = data[coin.id];
          if (!coinData) throw new Error(`Missing data for ${coin.id}`);
          return {
            id: coin.id,
            symbol: coin.symbol,
            priceUsd: coinData.usd,
            priceInr: coinData.inr,
            changePercent24Hr: coinData.usd_24h_change
          };
        });

        renderTicker(compiledData);
      }
    } catch (err) {
      console.warn("Using offline ticker fallback data", err);
      renderTicker(getFallbackPrices());
    }
  }

  function getFallbackPrices() {
    return [
      { id: 'bitcoin', symbol: 'BTC', priceUsd: (65000 + (Math.random() - 0.5) * 120).toString(), changePercent24Hr: '1.24' },
      { id: 'ethereum', symbol: 'ETH', priceUsd: (3400 + (Math.random() - 0.5) * 15).toString(), changePercent24Hr: '-0.45' },
      { id: 'solana', symbol: 'SOL', priceUsd: (145 + (Math.random() - 0.5) * 2.5).toString(), changePercent24Hr: '3.12' },
      { id: 'ripple', symbol: 'XRP', priceUsd: (0.50 + (Math.random() - 0.5) * 0.05).toString(), changePercent24Hr: '0.80' },
      { id: 'cardano', symbol: 'ADA', priceUsd: (0.40 + (Math.random() - 0.5) * 0.03).toString(), changePercent24Hr: '-1.10' },
      { id: 'dogecoin', symbol: 'DOGE', priceUsd: (0.08 + (Math.random() - 0.5) * 0.005).toString(), changePercent24Hr: '2.50' },
      { id: 'polkadot', symbol: 'DOT', priceUsd: (6.00 + (Math.random() - 0.5) * 0.20).toString(), changePercent24Hr: '-0.25' },
      { id: 'tether', symbol: 'USDT', priceUsd: '1.00', changePercent24Hr: '0.05' }
    ];
  }

  function renderTicker(data) {
    if (!tickerTrack) return;
    const order = ['bitcoin', 'ethereum', 'solana', 'ripple', 'cardano', 'dogecoin', 'polkadot', 'tether'];
    data.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    let tickerHTML = '';
    data.forEach(coin => {
      const priceUsd = parseFloat(coin.priceUsd);
      const priceInr = coin.priceInr ? parseFloat(coin.priceInr) : (priceUsd * 88.00);
      const change = parseFloat(coin.changePercent24Hr);
      const isUp = change >= 0;
      const changeSign = isUp ? '+' : '';
      const changeClass = isUp ? 'price-up' : 'price-down';
      
      let priceText = '';
      if (coin.symbol === 'USDT') {
        priceText = `₹${priceInr.toFixed(2)}`;
      } else if (priceInr >= 100000) {
        priceText = `₹${(priceInr / 100000).toFixed(2)}L`;
      } else {
        priceText = `₹${new Intl.NumberFormat('en-IN').format(Math.round(priceInr))}`;
      }

      let flashClass = '';
      if (previousPrices[coin.id]) {
        if (priceUsd > previousPrices[coin.id]) {
          flashClass = 'price-up';
        } else if (priceUsd < previousPrices[coin.id]) {
          flashClass = 'price-down';
        }
      }
      previousPrices[coin.id] = priceUsd;

      tickerHTML += `
        <div class="ticker-item" id="ticker-${coin.id}">
          <span>${coin.symbol}/INR</span>
          <span class="ticker-price ${flashClass}">${priceText}</span>
          <span class="ticker-change ${changeClass}">${changeSign}${change.toFixed(2)}%</span>
        </div>
      `;
    });

    tickerTrack.innerHTML = tickerHTML.repeat(4);

    setTimeout(() => {
      data.forEach(coin => {
        const itemPrice = document.querySelector(`#ticker-${coin.id} .ticker-price`);
        if (itemPrice) {
          itemPrice.classList.remove('price-up', 'price-down');
        }
      });
    }, 1000);
  }

  // Run immediately and poll
  fetchCryptoPrices();
  setInterval(fetchCryptoPrices, 10000);

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  