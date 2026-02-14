"""
ニューススクレイピングのモック
実運用時は requests + BeautifulSoup 等で各ニュースサイトから取得する想定。
ここではダミーデータを返すモック実装。
"""

import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def fetch_news(ticker: str | None = None) -> list[dict]:
    """
    指定された銘柄コード（ticker）に関連するニュースを取得する。
    ticker が None の場合は全件返す。

    Returns:
        list[dict]: ニュース記事のリスト
    """
    with open(os.path.join(DATA_DIR, "news.json"), "r", encoding="utf-8") as f:
        data = json.load(f)

    articles = data["articles"]

    if ticker:
        articles = [a for a in articles if a.get("related_ticker") == ticker]

    # 日付の新しい順にソート
    articles.sort(key=lambda a: a["published_at"], reverse=True)

    return articles


def scrape_news_from_web(ticker: str) -> list[dict]:
    """
    （モック）Webからニュースをスクレイピングする処理。
    実運用時は以下のようなロジックになる想定:

    1. Yahoo!ファイナンスの銘柄ページにアクセス
    2. ニュース一覧をパース
    3. 各記事のタイトル・URL・日付を抽出
    4. 記事本文をスクレイピング
    """
    # モック: ダミーデータからフィルタリングして返す
    return fetch_news(ticker)
