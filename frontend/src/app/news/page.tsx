"use client";

import { useEffect, useState } from "react";
import { Newspaper, RefreshCw } from "lucide-react";
import NewsList from "@/components/NewsList";

import { getApiBaseUrl } from "@/lib/api";

const API_BASE = getApiBaseUrl();

export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/news`);
            const data = await res.json();
            setArticles(data.articles || []);
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
        fetchNews();
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

            {loading && !refreshing ? (
                <div style={{ textAlign: "center", padding: "4rem 0" }}>
                    <p className="loading-pulse" style={{ fontSize: "1.25rem", color: "#888" }}>
                        ニュースを探しています...
                    </p>
                </div>
            ) : (
                <NewsList articles={articles} />
            )}
        </div>
    );
}
