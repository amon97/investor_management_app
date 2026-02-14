"""
配当管理兼ニュース集約Webアプリ — FastAPI バックエンド (MVP版)

変更点:
- Yahoo Finance APIで実際の株価を取得（5分キャッシュ）
- Google News RSSで最新の日本語ニュースを取得
- 保有銘柄のCRUD API（追加・更新・削除）
- CORS設定を環境変数で制御（本番/開発を自動切替）
"""

import json
import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# .env ファイルの読み込み（存在しない場合はスキップ）
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from price_fetcher import fetch_prices, fetch_stock_info, get_cache_updated_at
from news_fetcher import fetch_all_news, fetch_news_for_ticker

app = FastAPI(
    title="配当管理アプリ API",
    description="シニア投資家向け配当管理・ニュース集約アプリのバックエンド (MVP)",
    version="0.2.0",
)

# CORS 設定（環境変数 CORS_ORIGINS から取得、デフォルトはローカル開発用）
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
CORS_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
STOCKS_FILE = os.path.join(DATA_DIR, "stocks.json")
DIVIDENDS_FILE = os.path.join(DATA_DIR, "dividends.json")


# ---------- ユーティリティ ----------

def load_json(filepath: str) -> dict:
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filepath: str, data: dict) -> None:
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_holdings() -> list[dict]:
    return load_json(STOCKS_FILE).get("holdings", [])


def save_holdings(holdings: list[dict]) -> None:
    data = load_json(STOCKS_FILE)
    data["holdings"] = holdings
    save_json(STOCKS_FILE, data)


# ---------- Pydanticモデル ----------

class HoldingCreate(BaseModel):
    ticker: str
    name: str
    shares: int
    average_cost: float
    annual_dividend_per_share: float
    sector: str = "その他"


class HoldingUpdate(BaseModel):
    name: str | None = None
    shares: int | None = None
    average_cost: float | None = None
    annual_dividend_per_share: float | None = None
    sector: str | None = None


# ---------- ヘルスチェック ----------

@app.get("/health")
def health_check():
    """サーバーが正常に動作しているかを確認する"""
    return {"status": "ok", "version": app.version}


# ---------- ポートフォリオ ----------

@app.get("/api/portfolio")
def get_portfolio():
    """
    保有資産のポートフォリオ情報を返す。
    Yahoo Finance APIで現在値を取得（5分キャッシュ）。
    """
    holdings = get_holdings()
    tickers = [h["ticker"] for h in holdings]

    prices = fetch_prices(tickers)

    enriched = []
    for h in holdings:
        current_price = prices.get(h["ticker"]) or h.get("current_price", 0)
        market_value = current_price * h["shares"]
        enriched.append({
            **h,
            "current_price": current_price,
            "market_value": market_value,
        })

    total_asset = sum(h["market_value"] for h in enriched)
    annual_dividend = sum(
        h["shares"] * h["annual_dividend_per_share"] for h in enriched
    )

    return {
        "total_asset_value": round(total_asset),
        "annual_dividend": round(annual_dividend),
        "dividend_yield": round(annual_dividend / total_asset * 100, 2) if total_asset > 0 else 0,
        "holdings": enriched,
        "prices_updated_at": get_cache_updated_at(),
    }


@app.post("/api/portfolio/refresh")
def refresh_prices():
    """全銘柄の株価を強制的にYahoo Financeから再取得する"""
    from price_fetcher import CACHE_FILE
    if os.path.exists(CACHE_FILE):
        os.remove(CACHE_FILE)

    holdings = get_holdings()
    tickers = [h["ticker"] for h in holdings]
    prices = fetch_prices(tickers)

    return {
        "message": "価格を更新しました",
        "prices": prices,
        "updated_at": get_cache_updated_at(),
    }


# ---------- 銘柄CRUD ----------

@app.post("/api/portfolio/holdings", status_code=201)
def add_holding(body: HoldingCreate):
    """保有銘柄を新規追加する"""
    holdings = get_holdings()

    if any(h["ticker"] == body.ticker for h in holdings):
        raise HTTPException(status_code=409, detail=f"銘柄コード {body.ticker} はすでに登録されています")

    info = fetch_stock_info(body.ticker)
    current_price = info["current_price"] if info else body.average_cost

    new_holding = {
        "ticker": body.ticker,
        "name": body.name,
        "shares": body.shares,
        "average_cost": body.average_cost,
        "current_price": current_price,
        "market_value": current_price * body.shares,
        "annual_dividend_per_share": body.annual_dividend_per_share,
        "sector": body.sector,
    }

    holdings.append(new_holding)
    save_holdings(holdings)
    return new_holding


@app.put("/api/portfolio/holdings/{ticker}")
def update_holding(ticker: str, body: HoldingUpdate):
    """既存の保有銘柄を更新する"""
    holdings = get_holdings()
    for h in holdings:
        if h["ticker"] == ticker:
            if body.name is not None:
                h["name"] = body.name
            if body.shares is not None:
                h["shares"] = body.shares
            if body.average_cost is not None:
                h["average_cost"] = body.average_cost
            if body.annual_dividend_per_share is not None:
                h["annual_dividend_per_share"] = body.annual_dividend_per_share
            if body.sector is not None:
                h["sector"] = body.sector
            save_holdings(holdings)
            return h
    raise HTTPException(status_code=404, detail=f"銘柄コード {ticker} が見つかりません")


@app.delete("/api/portfolio/holdings/{ticker}", status_code=204)
def delete_holding(ticker: str):
    """保有銘柄を削除する"""
    holdings = get_holdings()
    new_holdings = [h for h in holdings if h["ticker"] != ticker]
    if len(new_holdings) == len(holdings):
        raise HTTPException(status_code=404, detail=f"銘柄コード {ticker} が見つかりません")
    save_holdings(new_holdings)
    return None


@app.get("/api/stock-info/{ticker}")
def get_stock_info(ticker: str):
    """指定銘柄の現在値・基本情報をYahoo Financeから取得"""
    info = fetch_stock_info(ticker)
    if not info:
        raise HTTPException(status_code=404, detail="銘柄情報を取得できませんでした")
    return info


# ---------- 配当スケジュール ----------

@app.get("/api/dividends")
def get_dividends():
    """月別の配当金入金スケジュールを返す"""
    return load_json(DIVIDENDS_FILE)


# ---------- ニュース ----------

@app.get("/api/news")
def get_news(ticker: str | None = Query(default=None, description="銘柄コードでフィルタリング")):
    """
    保有銘柄に関連する最新ニュースをGoogle News RSSから取得。
    """
    holdings = get_holdings()

    if ticker:
        target = next((h for h in holdings if h["ticker"] == ticker), None)
        if target:
            articles = fetch_news_for_ticker(target["ticker"], target["name"], limit=10)
        else:
            articles = []
    else:
        articles = fetch_all_news(holdings, limit_per_ticker=4)

    return {"articles": articles}
