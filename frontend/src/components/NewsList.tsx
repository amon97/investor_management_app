"use client";

import { ExternalLink, Tag } from "lucide-react";

interface NewsArticle {
    id: string;
    title: string;
    summary: string;
    source: string;
    published_at: string;
    url: string;
    related_ticker?: string;
    related_name?: string;
    category: string;
}

interface NewsListProps {
    articles: NewsArticle[];
}

function formatDate(isoString: string): string {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
        return `${Math.floor(diffHours)}時間前`;
    }
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function NewsList({ articles }: NewsListProps) {
    if (!articles || articles.length === 0) {
        return (
            <div className="card" style={{ textAlign: "center", padding: "3rem 1rem", color: "#888" }}>
                <p style={{ fontSize: "1.1rem" }}>
                    現在表示できるニュースはありません。<br />
                    <span style={{ fontSize: "0.9rem" }}>
                        （しばらくしてから再読み込みしてください）
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {articles.map((article) => (
                <article
                    key={article.id}
                    className="card"
                    style={{
                        padding: "1.25rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    {/* ヘッダー: ソース・日付・関連銘柄 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#666", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 600, color: "#444" }}>{article.source}</span>
                            <span>•</span>
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                        {article.related_name && (
                            <span
                                style={{
                                    background: "#e8f5ec",
                                    color: "#16a34a",
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                }}
                            >
                                <Tag size={12} />
                                {article.related_name}
                            </span>
                        )}
                    </div>

                    {/* タイトル */}
                    <h3 style={{ fontSize: "1.15rem", lineHeight: 1.5, margin: "0.25rem 0" }}>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--foreground)", textDecoration: "none" }}
                            className="hover:text-primary transition-colors"
                        >
                            {article.title}
                        </a>
                    </h3>

                    {/* サマリー（あれば） */}
                    {article.summary && (
                        <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.6, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {article.summary}
                        </p>
                    )}

                    {/* リンクボタン */}
                    <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                color: "var(--primary)",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            記事を読む <ExternalLink size={14} />
                        </a>
                    </div>
                </article>
            ))}
        </div>
    );
}
