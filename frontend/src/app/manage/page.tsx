"use client";

import { useEffect, useState, useCallback } from "react";
import { Settings, Plus, Trash2, Search, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { getApiBaseUrl, authFetch } from "@/lib/api";

const API_BASE = getApiBaseUrl();

const SECTORS = [
  "自動車", "通信", "商社", "食品", "保険", "銀行", "医薬",
  "電機", "不動産", "小売", "エネルギー", "インフラ", "投資信託", "その他",
];

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

interface FormData {
  ticker: string;
  name: string;
  shares: string;
  average_cost: string;
  annual_dividend_per_share: string;
  sector: string;
}

const emptyForm: FormData = {
  ticker: "",
  name: "",
  shares: "",
  average_cost: "",
  annual_dividend_per_share: "",
  sector: "その他",
};

type AlertType = { type: "success" | "error"; message: string } | null;

export default function ManagePage() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertType>(null);
  const [tickerSearching, setTickerSearching] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const [fetchedPrice, setFetchedPrice] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadHoldings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/api/portfolio`);
      const data = await res.json();
      setHoldings(data.holdings || []);
    } catch {
      showAlert("error", "データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHoldings();
  }, [loadHoldings]);

  // 証券コードを入力したら Yahoo Finance で銘柄情報を自動取得
  const handleTickerBlur = async () => {
    const ticker = form.ticker.trim();
    if (!ticker) return;

    setTickerSearching(true);
    setAutoFilled(false);
    setFetchedPrice(null);
    try {
      const res = await authFetch(`${API_BASE}/api/stock-info/${ticker}`);
      if (res.ok) {
        const info = await res.json();
        setFetchedPrice(info.current_price || null);
        setForm((f) => ({
          ...f,
          name: info.name || f.name,
          average_cost: String(Math.round(info.current_price || 0)),
          annual_dividend_per_share: String(info.annual_dividend_per_share || "0"),
          sector: info.sector || f.sector,
        }));
        setAutoFilled(true);
        // 3秒後に取得済みインジケーターを消す
        setTimeout(() => setAutoFilled(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setTickerSearching(false);
    }
  };

  // Firestoreにホールディングを保存（ログイン中かつFirebase設定済みの場合のみ）
  const saveToFirestore = async (holding: Holding) => {
    if (!user || !db) return;
    try {
      await setDoc(
        doc(db, "users", user.uid, "holdings", holding.ticker),
        holding
      );
    } catch (e) {
      console.warn("Firestore保存エラー:", e);
    }
  };

  // FirestoreからHoldingを削除（ログイン中かつFirebase設定済みの場合のみ）
  const deleteFromFirestore = async (ticker: string) => {
    if (!user || !db) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "holdings", ticker));
    } catch (e) {
      console.warn("Firestore削除エラー:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ticker || !form.name || !form.shares || !form.average_cost) {
      showAlert("error", "必須項目をすべて入力してください");
      return;
    }

    setSubmitting(true);
    try {
      const holdingPayload = {
        ticker: form.ticker.trim(),
        name: form.name.trim(),
        shares: parseInt(form.shares),
        average_cost: parseFloat(form.average_cost),
        annual_dividend_per_share: parseFloat(form.annual_dividend_per_share || "0"),
        sector: form.sector,
      };

      const res = await authFetch(`${API_BASE}/api/portfolio/holdings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(holdingPayload),
      });

      if (res.status === 409) {
        showAlert("error", "この銘柄コードはすでに登録されています");
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        showAlert("error", err.detail || "登録に失敗しました");
        return;
      }

      const savedHolding: Holding = await res.json();

      // Firestoreにも保存（クライアント側でも確実に保存）
      await saveToFirestore(savedHolding);

      showAlert("success", "銘柄を追加しました");
      setForm(emptyForm);
      setFetchedPrice(null);
      setAutoFilled(false);
      setShowForm(false);

      // リロードせずにstateを更新（高速化）
      setHoldings(prev => [...prev, savedHolding]);
    } catch {
      showAlert("error", "通信エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (ticker: string) => {
    try {
      const res = await authFetch(`${API_BASE}/api/portfolio/holdings/${ticker}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        // Firestoreからも削除
        await deleteFromFirestore(ticker);
        showAlert("success", "銘柄を削除しました");
        setDeleteConfirm(null);

        // リロードせずにstateを更新（高速化）
        setHoldings(prev => prev.filter(h => h.ticker !== ticker));
      } else {
        showAlert("error", "削除に失敗しました");
      }
    } catch {
      showAlert("error", "通信エラーが発生しました");
    }
  };

  return (
    <div>
      {/* ページタイトル */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Settings size={28} />
          保有銘柄の管理
        </h1>
        <p style={{ color: "#666", marginTop: "0.25rem", fontSize: "1rem" }}>
          保有している株の銘柄を追加・削除できます
        </p>
      </div>

      {/* アラート */}
      {alert && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1rem 1.25rem",
            borderRadius: "12px",
            marginBottom: "1rem",
            background: alert.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${alert.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: alert.type === "success" ? "#16a34a" : "#dc2626",
            fontSize: "1.05rem",
            fontWeight: 600,
          }}
        >
          {alert.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {alert.message}
        </div>
      )}

      {/* 銘柄追加ボタン */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            width: "100%",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          <Plus size={20} />
          銘柄を追加する
        </button>
      )}

      {/* 追加フォーム */}
      {showForm && (
        <div
          className="card"
          style={{ marginBottom: "1.5rem", background: "#f8faff", borderColor: "#bfdbfe" }}
        >
          <h2 style={{ marginBottom: "1.25rem", fontSize: "1.2rem" }}>
            <Plus size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            新しい銘柄を追加
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* 証券コード */}
              <div>
                <label style={labelStyle}>証券コード（4桁）*</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={form.ticker}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, ticker: e.target.value }));
                      setAutoFilled(false);
                      setFetchedPrice(null);
                    }}
                    onBlur={handleTickerBlur}
                    placeholder="例: 7203"
                    maxLength={6}
                    style={inputStyle}
                    required
                  />
                  {tickerSearching && (
                    <Search
                      size={18}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#888",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  )}
                </div>
                {/* 自動取得完了インジケーター */}
                {autoFilled && (
                  <p style={{
                    marginTop: "0.4rem",
                    fontSize: "0.9rem",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontWeight: 600,
                  }}>
                    <Sparkles size={14} />
                    銘柄情報を自動取得しました
                  </p>
                )}
              </div>

              {/* 銘柄名 */}
              <div>
                <label style={labelStyle}>銘柄名*</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="例: トヨタ自動車"
                  style={inputStyle}
                  required
                />
              </div>

              {/* 保有株数・取得単価 */}
              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>保有株数*</label>
                  <input
                    type="number"
                    value={form.shares}
                    onChange={(e) => setForm((f) => ({ ...f, shares: e.target.value }))}
                    placeholder="例: 100"
                    min={1}
                    style={inputStyle}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>取得単価（円）*</label>
                  <input
                    type="number"
                    value={form.average_cost}
                    onChange={(e) => setForm((f) => ({ ...f, average_cost: e.target.value }))}
                    placeholder="例: 2500"
                    min={0}
                    step={0.01}
                    style={inputStyle}
                    required
                  />
                  {/* 現在値参考表示 */}
                  {fetchedPrice !== null && fetchedPrice > 0 && (
                    <p style={{
                      marginTop: "0.35rem",
                      fontSize: "0.88rem",
                      color: "#2563eb",
                      fontWeight: 600,
                    }}>
                      参考現在値: ¥{fetchedPrice.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* 年間配当・セクター */}
              <div className="form-grid-2">
                <div>
                  <label style={labelStyle}>年間配当（円/株）</label>
                  <input
                    type="number"
                    value={form.annual_dividend_per_share}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, annual_dividend_per_share: e.target.value }))
                    }
                    placeholder="例: 75"
                    min={0}
                    step={0.01}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>セクター</label>
                  <select
                    value={form.sector}
                    onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ボタン */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: "1.05rem" }}
                >
                  {submitting ? "登録中..." : "追加する"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(emptyForm);
                    setFetchedPrice(null);
                    setAutoFilled(false);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    background: "#fff",
                    fontSize: "1.05rem",
                    cursor: "pointer",
                    minHeight: 48,
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 保有銘柄一覧 */}
      <h2 style={{ marginBottom: "1rem" }}>
        現在の保有銘柄（{holdings.length}銘柄）
      </h2>

      {loading ? (
        <p className="loading-pulse" style={{ textAlign: "center", fontSize: "1.1rem", color: "#888", padding: "2rem 0" }}>
          読み込み中...
        </p>
      ) : holdings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
          <p style={{ fontSize: "1.1rem" }}>保有銘柄がありません</p>
          <p style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>「銘柄を追加する」ボタンから追加してください</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {holdings.map((h) => (
            <div key={h.ticker} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>{h.name}</p>
                  <p style={{ color: "#888", fontSize: "0.9rem", margin: "0.2rem 0 0" }}>
                    コード: {h.ticker} ／ {h.sector}
                  </p>
                  <p style={{ color: "#555", fontSize: "0.95rem", margin: "0.4rem 0 0" }}>
                    {h.shares}株 ／ 取得単価: {h.average_cost.toLocaleString()}円 ／ 現在値: {h.current_price.toLocaleString()}円
                  </p>
                  <p style={{ color: "#16a34a", fontSize: "0.95rem", margin: "0.2rem 0 0", fontWeight: 600 }}>
                    年間配当: {Math.round(h.shares * h.annual_dividend_per_share).toLocaleString()}円
                  </p>
                </div>

                {/* 削除ボタン */}
                <div>
                  {deleteConfirm === h.ticker ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                      <p style={{ fontSize: "0.9rem", color: "#dc2626", margin: 0, fontWeight: 600 }}>
                        本当に削除しますか？
                      </p>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleDelete(h.ticker)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            minHeight: 40,
                          }}
                        >
                          削除
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            padding: "0.4rem 0.8rem",
                            background: "#e5e7eb",
                            color: "#333",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "0.95rem",
                            cursor: "pointer",
                            minHeight: 40,
                          }}
                        >
                          戻る
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(h.ticker)}
                      aria-label={`${h.name}を削除`}
                      style={{
                        padding: "0.6rem",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        cursor: "pointer",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        minHeight: 48,
                        minWidth: 48,
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "1rem",
  fontWeight: 600,
  marginBottom: "0.4rem",
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "10px",
  border: "2px solid #e5e7eb",
  fontSize: "1rem",
  background: "#fff",
  boxSizing: "border-box",
  minHeight: 48,
};
