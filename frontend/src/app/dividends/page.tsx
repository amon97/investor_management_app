"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";

import { getApiBaseUrl } from "@/lib/api";

const API_BASE = getApiBaseUrl();

interface DividendEntry {
    ticker: string;
    name: string;
    amount: number;
    ex_date: string;
    payment_date: string;
    note: string;
}

interface MonthSchedule {
    month: number;
    label: string;
    entries: DividendEntry[];
}

interface DividendData {
    schedule: MonthSchedule[];
    annual_total: number;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function DividendsPage() {
    const [data, setData] = useState<DividendData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetch(`${API_BASE}/api/dividends`)
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                // 配当がある月はデフォルトで展開
                const withEntries = new Set<number>(
                    d.schedule
                        .filter((m: MonthSchedule) => m.entries.length > 0)
                        .map((m: MonthSchedule) => m.month)
                );
                setExpandedMonths(withEntries);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const toggleMonth = (month: number) => {
        setExpandedMonths((prev) => {
            const next = new Set(prev);
            if (next.has(month)) {
                next.delete(month);
            } else {
                next.add(month);
            }
            return next;
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p className="loading-pulse" style={{ fontSize: "1.25rem", color: "#888" }}>
                    読み込み中...
                </p>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontSize: "1.25rem", color: "#c53030" }}>
                    データの取得に失敗しました。
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* ページタイトル */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CalendarDays size={28} />
                    配当金スケジュール
                </h1>
                <p style={{ color: "#666", marginTop: "0.25rem" }}>
                    月ごとの配当金の入金予定を確認できます
                    <span className="tooltip-text">
                        （権利確定日に株を保有していると、後日配当金が届きます）
                    </span>
                </p>
            </div>

            {/* 年間合計 */}
            <div
                className="card"
                style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    background: "#f0fdf4",
                    borderColor: "#bbf7d0",
                }}
            >
                <div className="stat-label">年間の配当金合計（税引き前）</div>
                <div className="stat-value" style={{ color: "#16a34a" }}>
                    {data.annual_total.toLocaleString()}円
                </div>
            </div>

            {/* 月別スケジュール */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.schedule.map((month) => {
                    const hasEntries = month.entries.length > 0;
                    const isExpanded = expandedMonths.has(month.month);
                    const monthTotal = month.entries.reduce((sum, e) => sum + e.amount, 0);

                    return (
                        <div
                            key={month.month}
                            className={`card dividend-month-card ${!hasEntries ? "empty" : ""}`}
                        >
                            {/* 月ヘッダー（クリックで展開/折りたたみ） */}
                            <button
                                onClick={() => hasEntries && toggleMonth(month.month)}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    background: "none",
                                    border: "none",
                                    cursor: hasEntries ? "pointer" : "default",
                                    padding: 0,
                                    fontSize: "1.125rem",
                                    fontWeight: 700,
                                    color: "var(--foreground)",
                                    minHeight: 48,
                                }}
                                aria-expanded={isExpanded}
                                disabled={!hasEntries}
                            >
                                <span>
                                    {month.label}
                                    {hasEntries && (
                                        <span
                                            style={{
                                                marginLeft: "0.75rem",
                                                fontSize: "1rem",
                                                fontWeight: 600,
                                                color: "#16a34a",
                                            }}
                                        >
                                            合計 {monthTotal.toLocaleString()}円
                                        </span>
                                    )}
                                    {!hasEntries && (
                                        <span
                                            style={{
                                                marginLeft: "0.75rem",
                                                fontSize: "0.95rem",
                                                fontWeight: 400,
                                                color: "#aaa",
                                            }}
                                        >
                                            配当金の予定なし
                                        </span>
                                    )}
                                </span>
                                {hasEntries &&
                                    (isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />)}
                            </button>

                            {/* 配当エントリ（展開時） */}
                            {isExpanded && hasEntries && (
                                <div
                                    style={{
                                        marginTop: "1rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.75rem",
                                    }}
                                >
                                    {month.entries.map((entry, idx) => (
                                        <div
                                            key={`${entry.ticker}-${idx}`}
                                            style={{
                                                background: "#f9fafb",
                                                borderRadius: "12px",
                                                padding: "1rem",
                                                border: "1px solid #e5e7eb",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-start",
                                                    flexWrap: "wrap",
                                                    gap: "0.5rem",
                                                }}
                                            >
                                                <div>
                                                    <p style={{ fontWeight: 700, margin: 0 }}>{entry.name}</p>
                                                    <p
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "0.9rem",
                                                            margin: "0.25rem 0 0",
                                                        }}
                                                    >
                                                        コード: {entry.ticker}
                                                    </p>
                                                </div>
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                        fontSize: "1.2rem",
                                                        color: "#16a34a",
                                                    }}
                                                >
                                                    {entry.amount.toLocaleString()}円
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginTop: "0.75rem",
                                                    fontSize: "0.9rem",
                                                    color: "#666",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "0.25rem",
                                                }}
                                            >
                                                <span>
                                                    📅 権利確定日: {formatDate(entry.ex_date)}
                                                    <span className="tooltip-text">
                                                        （この日に株を持っていると配当がもらえます）
                                                    </span>
                                                </span>
                                                <span>💴 入金予定日: {formatDate(entry.payment_date)}</span>
                                                {entry.note && (
                                                    <span style={{ color: "#888", fontStyle: "italic" }}>
                                                        ℹ️ {entry.note}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
