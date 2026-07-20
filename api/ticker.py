from http.server import BaseHTTPRequestHandler
import urllib.request
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Fetch Crypto Data from CoinCap
            crypto_req = urllib.request.Request(
                'https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot', 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(crypto_req) as response:
                crypto_data = json.loads(response.read().decode())['data']
            
            # Fetch Exchange Rate Data from Frankfurter
            rate_req = urllib.request.Request(
                'https://api.frankfurter.app/latest?from=USD&to=INR', 
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(rate_req) as response:
                rate_data = json.loads(response.read().decode())
                inr_rate = rate_data['rates']['INR']
            
            # Combine data and calculate INR prices securely on backend
            compiled_data = []
            for coin in crypto_data:
                price_usd = float(coin['priceUsd'])
                price_inr = price_usd * inr_rate
                
                compiled_data.append({
                    'id': coin['id'],
                    'symbol': coin['symbol'],
                    'priceUsd': price_usd,
                    'priceInr': price_inr,
                    'changePercent24Hr': coin['changePercent24Hr']
                })
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'data': compiled_data}).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
