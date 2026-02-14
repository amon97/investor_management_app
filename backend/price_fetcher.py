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


def fetch_stock_info(ticker: str) -> dict | None:
    """銘柄の基本情報（名称・配当など）を取得"""
    symbol = to_yahoo_symbol(ticker)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        meta = data["chart"]["result"][0]["meta"]
        return {
            "ticker": ticker,
            "symbol": symbol,
            "current_price": float(meta.get("regularMarketPrice", 0)),
            "currency": meta.get("currency", "JPY"),
            "exchange": meta.get("exchangeName", ""),
        }
    except Exception as e:
        print(f"銘柄情報取得エラー ({ticker}): {e}")
        return None


def get_cache_updated_at() -> str | None:
    """キャッシュの最終更新日時を返す（ISO形式）"""
    if not os.path.exists(CACHE_FILE):
        return None
    try:
        cache = _load_cache()
        if not cache:
            return None
        latest = max(v["timestamp"] for v in cache.values())
        import datetime
        return datetime.datetime.fromtimestamp(latest).isoformat()
    except Exception:
        return None
