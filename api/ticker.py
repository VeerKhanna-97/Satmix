from http.server import BaseHTTPRequestHandler
import urllib.request
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Fetch Crypto Data from CoinGecko
            req_url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true'
            req = urllib.request.Request(req_url, headers={'User-Agent': 'Mozilla/5.0'})
            
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
            
            coins = [
                {'id': 'bitcoin', 'symbol': 'BTC'},
                {'id': 'ethereum', 'symbol': 'ETH'},
                {'id': 'solana', 'symbol': 'SOL'},
                {'id': 'tether', 'symbol': 'USDT'},
                {'id': 'ripple', 'symbol': 'XRP'},
                {'id': 'cardano', 'symbol': 'ADA'},
                {'id': 'dogecoin', 'symbol': 'DOGE'},
                {'id': 'polkadot', 'symbol': 'DOT'}
            ]
            
            compiled_data = []
            for coin in coins:
                coin_data = data.get(coin['id'])
                if coin_data:
                    compiled_data.append({
                        'id': coin['id'],
                        'symbol': coin['symbol'],
                        'priceUsd': coin_data.get('usd'),
                        'priceInr': coin_data.get('inr'),
                        'changePercent24Hr': coin_data.get('usd_24h_change')
                    })
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
            self.end_headers()
            self.wfile.write(json.dumps({'data': compiled_data}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
