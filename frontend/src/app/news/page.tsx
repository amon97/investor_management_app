"use client";

import { useEffect, useState } from "react";
import { Newspaper, ExternalLink } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Article {
    id: number;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    url: string;
    related_ticker: string | null;
    related_name: string | null;
    category: string;
}

function formatRelativeDate(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "昨日";
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getCategoryBadgeClass(category: string): string {
    switch (category) {
        case "配当":
            return "badge badge-dividend";
        case "業績":
            return "badge badge-performance";
        case "株価":
            return "badge badge-price";
        case "特集":
            return "badge badge-feature";
        default:
            return "badge badge-dividend";
    }
}

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        const url = filter
            ? `${API_BASE}/api/news?ticker=${filter}`
            : `${API_BASE}/api/news`;

        setLoading(true);
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setArticles(data.articles);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [filter]);

    // フィルタ用の銘柄リスト抽出
    const tickers = Array.from(
        new Map(
            articles
                .filter((a) => a.related_ticker)
                .map((a) => [a.related_ticker, a.related_name])
        ).entries()
    );

    return (
        <div>
            {/* ページタイトル */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Newspaper size={28} />
                    ニュース
                </h1>
                <p style={{ color: "#666", marginTop: "0.25rem" }}>
                    保有銘柄に関する最新のニュースをお届けします
                </p>
            </div>

            {/* フィルタボタン */}
            <div
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginBottom: "1.5rem",
                }}
            >
                <button
                    onClick={() => setFilter(null)}
                    className="btn-primary"
                    style={{
                        background: filter === null ? "var(--primary)" : "#e5e7eb",
                        color: filter === null ? "#fff" : "#333",
                        minHeight: 44,
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                    }}
                >
                    すべて
                </button>
                {tickers.map(([ticker, name]) => (
                    <button
                        key={ticker}
                        onClick={() => setFilter(ticker!)}
                        className="btn-primary"
                        style={{
                            background: filter === ticker ? "var(--primary)" : "#e5e7eb",
                            color: filter === ticker ? "#fff" : "#333",
                            minHeight: 44,
                            padding: "0.5rem 1rem",
                            fontSize: "1rem",
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* 記事一覧 */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                    <p className="loading-pulse" style={{ fontSize: "1.25rem", color: "#888" }}>
                        読み込み中...
                    </p>
                </div>
            ) : articles.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                    <p style={{ fontSize: "1.25rem", color: "#888" }}>
                        該当するニュースはありません
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {articles.map((article) => (
                        <article key={article.id} className="card">
                            {/* ヘッダー行 */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                    marginBottom: "0.75rem",
                                }}
                            >
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <span className={getCategoryBadgeClass(article.category)}>
                                        {article.category}
                                    </span>
                                    {article.related_name && (
                                        <span
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#888",
                                                alignSelf: "center",
                                            }}
                                        >
                                            {article.related_name}
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontSize: "0.85rem", color: "#888", whiteSpace: "nowrap" }}>
                                    {formatRelativeDate(article.published_at)} ・ {article.source}
                                </span>
                            </div>

                            {/* タイトル */}
                            <h3 style={{ margin: "0 0 0.5rem", lineHeight: 1.5 }}>{article.title}</h3>

                            {/* 要約 */}
                            <p
                                style={{
                                    color: "#555",
                                    fontSize: "1rem",
                                    lineHeight: 1.8,
                                    margin: "0 0 1rem",
                                }}
                            >
                                {article.summary}
                            </p>

                            {/* 「読む」ボタン */}
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ width: "100%", textAlign: "center" }}
                            >
                                <ExternalLink size={20} />
                                この記事を読む
                            </a>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
