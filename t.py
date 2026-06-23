import requests

url = "https://stocktraders.vn/service/data/getTotalTrade"

payload = {
    "TotalTradeRequest": {
        "account": "StockTraders"
    }
}

res = requests.post(url, json=payload)
data = res.json()

tickers = [
    item["ticker"]
    for item in data["TotalTradeReply"]["stockTotals"]
]

print(tickers)