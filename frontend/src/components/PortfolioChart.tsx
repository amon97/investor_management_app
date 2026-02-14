"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Holding {
    name: string;
    market_value: number;
    sector: string;
}

interface PortfolioChartProps {
    holdings: Holding[];
}

// シニアにも見やすい、区別しやすい色パレット
const COLORS = [
    "#2563eb", // 青
    "#dc2626", // 赤
    "#16a34a", // 緑
    "#d97706", // オレンジ
    "#7c3aed", // 紫
    "#0891b2", // シアン
    "#e11d48", // ローズ
    "#4f46e5", // インディゴ
    "#059669", // エメラルド
];

function formatYen(value: number): string {
    if (value >= 10000) {
        return `${(value / 10000).toFixed(0)}万円`;
    }
    return `${value.toLocaleString()}円`;
}

function CustomTooltip({ active, payload }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { percent: number } }>;
}) {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div
                style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "10px 14px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "0.95rem",
                }}
            >
                <p style={{ fontWeight: 700, marginBottom: "4px" }}>{data.name}</p>
                <p style={{ color: "#666" }}>
                    {formatYen(data.value)}（{(data.payload.percent * 100).toFixed(1)}%）
                </p>
            </div>
        );
    }
    return null;
}

export default function PortfolioChart({ holdings }: PortfolioChartProps) {
    const data = holdings.map((h) => ({
        name: h.name,
        value: Math.round(h.market_value),
    }));

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div>
            {/* 円グラフ — 画面幅に応じて高さを調整 */}
            <div style={{ width: "100%", height: "min(280px, 60vw)" }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="35%"
                            outerRadius="55%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 凡例 — CSSクラスでモバイル/タブレット/デスクトップを制御 */}
            <div className="chart-legend">
                {data.map((entry, index) => (
                    <div
                        key={entry.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.25rem 0",
                        }}
                    >
                        <span
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: 3,
                                backgroundColor: COLORS[index % COLORS.length],
                                flexShrink: 0,
                            }}
                        />
                        <span style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
                            {entry.name}
                            <br />
                            <span style={{ color: "#888", fontSize: "0.8rem" }}>
                                {formatYen(entry.value)}（{((entry.value / total) * 100).toFixed(1)}%）
                            </span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
