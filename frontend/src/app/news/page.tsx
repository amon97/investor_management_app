"use client";

import { useEffect, useState, useRef } from "react";
import { Newspaper, RefreshCw } from "lucide-react";
import NewsList from "@/components/NewsList";

import { getApiBaseUrl, authFetch } from "@/lib/api";

const API_BASE = getApiBaseUrl();

// ページ遷移してもキャッシュを保持（再マウント時に即表示）
let cachedArticles: never[] | null = null;

function SkeletonCard() {
    return (
        <div className="card" style={{ padding: "1rem", marginBottom: "0.75rem" }}>
            <div className="loading-pulse" style={{ height: "1.1rem", width: "70%", background: "#e5e7eb", borderRadius: 6, marginBottom: "0.5rem" }} />
            <div className="loading-pulse" style={{ height: "0.9rem", width: "90%", background: "#f3f4f6", borderRadius: 6, marginBottom: "0.4rem" }} />
            <div className="loading-pulse" style={{ height: "0.9rem", width: "40%", background: "#f3f4f6", borderRadius: 6 }} />
        </div>
    );
}

export default function NewsPage() {
    const [articles, setArticles] = useState(cachedArticles || []);
    const [loading, setLoading] = useState(!cachedArticles);
    const [refreshing, setRefreshing] = useState(false);
    const fetchedRef = useRef(false);

    const fetchNews = async () => {
        try {
            const res = await authFetch(`${API_BASE}/api/news`);
            const data = await res.json();
            const fetched = data.articles || [];
            cachedArticles = fetched;
            setArticles(fetched);
        } catch (error) {
            console.error("News fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchNews();
        setRefreshing(false);
    };

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        if (cachedArticles) {
            // キャッシュがあれば即表示、バックグラウンドで更新
            fetchNews();
        } else {
            setLoading(true);
            fetchNews();
        }
    }, []);

    return (
        <div>
            {/* ページタイトル */}
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Newspaper size={28} />
                        最新ニュース
                    </h1>
                    <p style={{ color: "#666", marginTop: "0.25rem" }}>
                        保有銘柄に関連する最新のニュースをお届けします
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                    style={{
                        background: "none",
                        border: "1px solid #ddd",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#666",
                    }}
                    aria-label="更新"
                >
                    <RefreshCw size={20} className={refreshing ? "spinning" : ""} />
                </button>
            </div>

            {loading && articles.length === 0 ? (
                <div>
                    {[...Array(5)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <NewsList articles={articles} />
            )}
        </div>
    );
}
