"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, CalendarDays, Percent, RefreshCw } from "lucide-react";
import PortfolioChart from "@/components/PortfolioChart";

import { getApiBaseUrl, authFetch } from "@/lib/api";

const API_BASE = getApiBaseUrl();

interface Holding {
  ticker: string;
  name: string;
  shares: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  annual_dividend_per_share: number;
  sector: string;
}

interface Portfolio {
  total_asset_value: number;
  annual_dividend: number;
  dividend_yield: number;
  holdings: Holding[];
  prices_updated_at: string | null;
}

function formatYen(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(2)}億円`;
  }
  if (value >= 10000) {
    return `${Math.round(value / 10000).toLocaleString()}万円`;
  }
  return `${value.toLocaleString()}円`;
}

function formatUpdatedAt(isoStr: string | null): string {
  if (!isoStr) return "未取得";
  const d = new Date(isoStr);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")} 更新`;
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/portfolio`);
      const data = await res.json();
      setPortfolio(data);
    } catch {
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await authFetch(`${API_BASE}/api/portfolio/refresh`, { method: "POST" });
      await loadPortfolio();
    } finally {
      setRefreshing(false);
    }
  };

  // 初回アクセス時に自動で株価・配当を最新に更新してからポートフォリオを読み込む
  useEffect(() => {
    const initialRefresh = async () => {
      try {
        await authFetch(`${API_BASE}/api/portfolio/refresh`, { method: "POST" });
      } catch {
        // リフレッシュ失敗してもキャッシュ済みデータで表示
      }
      await loadPortfolio();
    };
    initialRefresh();
  }, [loadPortfolio]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p className="loading-pulse" style={{ fontSize: "1.25rem", color: "#888" }}>
          読み込み中...
        </p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <p style={{ fontSize: "1.25rem", color: "#c53030" }}>
          データの取得に失敗しました。
          <br />
          <span style={{ fontSize: "1rem", color: "#888" }}>
            バックエンドサーバーが起動しているか確認してください。
          </span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* --- 更新ボタン --- */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontSize: "0.9rem", color: "#888" }}>
          株価: {formatUpdatedAt(portfolio.prices_updated_at)}
        </span>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            fontSize: "0.95rem",
            minHeight: 44,
            opacity: refreshing ? 0.7 : 1,
          }}
        >
          <RefreshCw size={16} className={refreshing ? "spinning" : ""} />
          {refreshing ? "更新中..." : "株価を更新"}
        </button>
      </div>

      {/* --- 総資産 & 年間配当 --- */}
      <section style={{ marginBottom: "2rem" }}>
        <div className="stats-grid">
          {/* 総資産カード */}
          <div className="card" style={{ textAlign: "center" }}>
            <div className="stat-label">
              <TrendingUp
                size={20}
                style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}
              />
              保有資産の総額
              <span className="tooltip-text">
                （あなたが持っている株の今の価値の合計）
              </span>
            </div>
            <div className="stat-value">
              {formatYen(portfolio.total_asset_value)}
            </div>
          </div>

          {/* 年間配当カード */}
          <div
            className="card"
            style={{
              textAlign: "center",
              background: "#f0fdf4",
              borderColor: "#bbf7d0",
            }}
          >
            <div className="stat-label">
              <CalendarDays
                size={20}
                style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}
              />
              年間予定配当金
              <span className="tooltip-text">
                （1年間にもらえる配当金の予定額）
              </span>
            </div>
            <div className="stat-value" style={{ color: "#16a34a" }}>
              {formatYen(portfolio.annual_dividend)}
            </div>
          </div>

          {/* 配当利回りカード */}
          <div className="card" style={{ textAlign: "center" }}>
            <div className="stat-label">
              <Percent
                size={20}
                style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}
              />
              配当利回り
              <span className="tooltip-text">
                （投資額に対して何%の配当がもらえるかの目安）
              </span>
            </div>
            <div className="stat-value" style={{ fontSize: "2rem" }}>
              {portfolio.dividend_yield}%
            </div>
          </div>
        </div>
      </section>

      {/* --- 資産構成 円グラフ --- */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>
          📊 資産構成
          <span className="tooltip-text">
            （どの銘柄にいくら投資しているかの内訳）
          </span>
        </h2>
        <div className="card">
          <PortfolioChart holdings={portfolio.holdings} />
        </div>
      </section>

      {/* --- 保有銘柄一覧 --- */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>📋 保有銘柄一覧</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {portfolio.holdings.map((h) => {
            const gain = (h.current_price - h.average_cost) * h.shares;
            const gainPercent = ((h.current_price - h.average_cost) / h.average_cost * 100).toFixed(1);
            const isPositive = gain >= 0;
            return (
              <div key={h.ticker} className="card">
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
                    <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
                      {h.name}
                    </p>
                    <p style={{ color: "#888", fontSize: "0.9rem", margin: "0.25rem 0 0" }}>
                      証券コード: {h.ticker} ／ {h.sector}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
                      {Math.round(h.market_value).toLocaleString()}円
                    </p>
                    <p
                      style={{
                        color: isPositive ? "#16a34a" : "#dc2626",
                        fontSize: "1rem",
                        margin: "0.25rem 0 0",
                        fontWeight: 600,
                      }}
                    >
                      {isPositive ? "▲ +" : "▼ "}
                      {Math.round(gain).toLocaleString()}円（{isPositive ? "+" : ""}
                      {gainPercent}%）
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    fontSize: "1rem",
                    color: "#555",
                  }}
                >
                  <span>📦 {h.shares}株保有</span>
                  <span>💰 買った時: {h.average_cost.toLocaleString()}円</span>
                  <span>📈 今の値段: {h.current_price.toLocaleString()}円</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    🎁 年間配当: {Math.round(h.shares * h.annual_dividend_per_share).toLocaleString()}円
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
