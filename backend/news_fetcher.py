"""
Google News RSS を使って日本語の株式ニュースを取得する。
feedparser ライブラリでRSSを解析し、保有銘柄に関連するニュースを返す。
"""

import feedparser
import time
from urllib.parse import quote
from datetime import datetime, timezone


def _parse_published(entry) -> str:
    """feedparserのエントリから日付文字列（ISO形式）を取得"""
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
            return dt.isoformat()
        except Exception:
            pass
    return datetime.now(timezone.utc).isoformat()


def _get_source(entry) -> str:
    """記事のソース名を取得"""
    if hasattr(entry, "source") and isinstance(entry.source, dict):
        return entry.source.get("title", "Google News")
    tags = getattr(entry, "tags", [])
    if tags and isinstance(tags[0], dict):
        return tags[0].get("term", "Google News")
    return "Google News"


def fetch_news_for_ticker(ticker: str, name: str, limit: int = 5) -> list[dict]:
    """
    指定銘柄のニュースをGoogle News RSSから取得する。

    Args:
        ticker: 証券コード（例: "7203"）
        name: 銘柄名（例: "トヨタ自動車"）
        limit: 最大取得件数

    Returns:
        ニュース記事のリスト
    """
    # 会社名で検索（株・配当キーワードを追加して金融ニュースに絞る）
    query = quote(f"{name}")
    url = f"https://news.google.com/rss/search?q={query}&hl=ja&gl=JP&ceid=JP:ja"

    try:
        feed = feedparser.parse(url)
        articles = []
        for i, entry in enumerate(feed.entries[:limit]):
            title = getattr(entry, "title", "タイトルなし")
            summary = getattr(entry, "summary", "")
            # HTMLタグを除去した簡易テキスト
            import re
            summary = re.sub(r"<[^>]+>", "", summary)[:200]

            articles.append({
                "id": f"{ticker}-{i}-{int(time.time())}",
                "title": title,
                "summary": summary,
                "source": _get_source(entry),
                "published_at": _parse_published(entry),
                "url": entry.link,
                "related_ticker": ticker,
                "related_name": name,
                "category": _guess_category(title),
            })
        return articles
    except Exception as e:
        print(f"ニュース取得エラー ({ticker} / {name}): {e}")
        return []


def _guess_category(title: str) -> str:
    """タイトルからカテゴリを推測"""
    if any(w in title for w in ["配当", "増配", "減配", "配当金"]):
        return "配当"
    if any(w in title for w in ["決算", "業績", "売上", "利益", "黒字", "赤字"]):
        return "業績"
    if any(w in title for w in ["株価", "上昇", "下落", "高値", "安値", "反発"]):
        return "株価"
    return "ニュース"


def fetch_all_news(holdings: list[dict], limit_per_ticker: int = 5) -> list[dict]:
    """
    全保有銘柄のニュースを並列取得してマージ・重複除去する。

    Args:
        holdings: 保有銘柄リスト（ticker と name フィールドを含む）
        limit_per_ticker: 銘柄ごとの最大取得件数

    Returns:
        日付降順で並べたニュース記事リスト
    """
    from concurrent.futures import ThreadPoolExecutor

    def _fetch(h):
        return fetch_news_for_ticker(h["ticker"], h["name"], limit=limit_per_ticker)

    all_articles = []
    seen_urls = set()

    with ThreadPoolExecutor(max_workers=min(len(holdings), 8)) as executor:
        results = executor.map(_fetch, holdings)

    for articles in results:
        for article in articles:
            if article["url"] not in seen_urls:
                all_articles.append(article)
                seen_urls.add(article["url"])

    # 日付の新しい順にソート
    all_articles.sort(key=lambda a: a["published_at"], reverse=True)
    return all_articles
