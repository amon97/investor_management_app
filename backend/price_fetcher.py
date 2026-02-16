"""
Yahoo Finance API を使って日本株の株価をリアルタイムで取得する。
SSL証明書のパス問題を回避するため、yfinanceではなくrequestsを直接使用。
"""

import json
import os
import time
import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# Yahoo Finance 英語セクター名 → アプリ内日本語セクター名のマッピング
_SECTOR_MAP: dict[str, str] = {
    "Technology": "電機",
    "Consumer Cyclical": "自動車",
    "Consumer Defensive": "食品",
    "Financial Services": "銀行",
    "Healthcare": "医薬",
    "Industrials": "電機",
    "Communication Services": "通信",
    "Energy": "エネルギー",
    "Real Estate": "不動産",
    "Basic Materials": "その他",
    "Utilities": "インフラ",
    # TSE 業種区分 (日本語) の直接マッピング
    "情報・通信業": "通信",
    "銀行業": "銀行",
    "保険業": "保険",
    "証券、商品先物取引業": "銀行",
    "その他金融業": "銀行",
    "輸送用機器": "自動車",
    "電気機器": "電機",
    "機械": "電機",
    "精密機器": "電機",
    "医薬品": "医薬",
    "食料品": "食品",
    "卸売業": "商社",
    "小売業": "小売",
    "不動産業": "不動産",
    "電気・ガス業": "インフラ",
    "陸運業": "インフラ",
    "海運業": "インフラ",
    "空運業": "インフラ",
    "石油・石炭製品": "エネルギー",
    "鉱業": "エネルギー",
    "サービス業": "その他",
    "建設業": "インフラ",
    "鉄鋼": "その他",
    "非鉄金属": "その他",
    "化学": "その他",
}

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CACHE_FILE = os.path.join(DATA_DIR, "price_cache.json")
CACHE_DURATION_SECONDS = 300  # 5分キャッシュ


def to_yahoo_symbol(ticker: str) -> str:
    """4桁の銘柄コードをYahoo Finance形式（.T付き）に変換"""
    if ticker.endswith(".T"):
        return ticker
    return f"{ticker}.T"


def _load_cache() -> dict:
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _save_cache(cache: dict) -> None:
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False)
    except Exception as e:
        print(f"キャッシュ保存エラー: {e}")


def fetch_price(ticker: str) -> float | None:
    """1銘柄の現在値を取得（5分キャッシュあり）"""
    cache = _load_cache()
    now = time.time()

    if ticker in cache:
        entry = cache[ticker]
        if now - entry["timestamp"] < CACHE_DURATION_SECONDS:
            return entry["price"]

    symbol = to_yahoo_symbol(ticker)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        price = data["chart"]["result"][0]["meta"]["regularMarketPrice"]
        cache[ticker] = {"price": float(price), "timestamp": now}
        _save_cache(cache)
        return float(price)
    except Exception as e:
        print(f"価格取得エラー ({ticker}): {e}")
        return None


def fetch_prices(tickers: list[str]) -> dict[str, float | None]:
    """複数銘柄の現在値を一括取得"""
    result = {}
    for ticker in tickers:
        result[ticker] = fetch_price(ticker)
    return result


def _resolve_sector(raw_sector: str | None) -> str:
    """英語/日本語のセクター文字列をアプリ内セクター名に変換する"""
    if not raw_sector:
        return "その他"
    return _SECTOR_MAP.get(raw_sector, "その他")


def _fetch_sector_from_search(symbol: str) -> str:
    """Yahoo Finance search API からセクターを取得（v1/finance/search）"""
    url = f"https://query1.finance.yahoo.com/v1/finance/search?q={symbol}&quotesCount=1"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=8)
        resp.raise_for_status()
        quotes = resp.json().get("quotes", [])
        if quotes:
            raw = quotes[0].get("sector")
            return _resolve_sector(raw)
    except Exception:
        pass
    return "その他"


def _fetch_annual_dividend(symbol: str) -> float:
    """v8/chart の events=div から過去1年間の配当合計を取得"""
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
        f"?interval=3mo&range=2y&events=div"
    )
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        events = (
            data.get("chart", {})
            .get("result", [{}])[0]
            .get("events", {})
            .get("dividends", {})
        )
        cutoff = time.time() - 365 * 24 * 3600
        total = sum(v["amount"] for v in events.values() if v["date"] >= cutoff)
        return float(total)
    except Exception:
        return 0.0


def fetch_stock_info(ticker: str) -> dict | None:
    """銘柄の基本情報（名称・現在価格・年間配当・セクター）を取得"""
    symbol = to_yahoo_symbol(ticker)

    # v8/chart で名称・現在値を取得（v7/quote は 2025年以降 401 のため非使用）
    chart_url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
    try:
        resp = requests.get(chart_url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        meta = data["chart"]["result"][0]["meta"]
    except Exception as e:
        print(f"銘柄情報取得エラー ({ticker}): {e}")
        return None

    name = meta.get("longName") or meta.get("shortName") or ticker
    current_price = float(meta.get("regularMarketPrice", 0))
    currency = meta.get("currency", "JPY")
    exchange = meta.get("exchangeName", "")

    # 配当・セクターは別 API で補完
    annual_dividend = _fetch_annual_dividend(symbol)
    sector = _fetch_sector_from_search(symbol)

    return {
        "ticker": ticker,
        "symbol": symbol,
        "name": name,
        "current_price": current_price,
        "annual_dividend_per_share": annual_dividend,
        "sector": sector,
        "currency": currency,
        "exchange": exchange,
    }


def get_cache_updated_at() -> str | None:
    """キャッシュの最終更新日時を返す（日本時間のISO形式）"""
    if not os.path.exists(CACHE_FILE):
        return None
    try:
        cache = _load_cache()
        if not cache:
            return None
        latest = max(v["timestamp"] for v in cache.values())
        import datetime
        JST = datetime.timezone(datetime.timedelta(hours=9))
        return datetime.datetime.fromtimestamp(latest, tz=JST).isoformat()
    except Exception:
        return None
