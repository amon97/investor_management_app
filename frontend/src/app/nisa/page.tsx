"use client";

import { BookOpen, TrendingUp, Shield, Coins } from "lucide-react";

export default function NisaPage() {
  return (
    <div>
      {/* ページタイトル */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookOpen size={28} />
          新NISAガイド
        </h1>
        <p style={{ color: "#666", marginTop: "0.25rem", fontSize: "1.05rem" }}>
          2024年から始まった新しいNISA制度をやさしく解説します
        </p>
      </div>

      {/* 新NISAとは */}
      <div className="card" style={{ marginBottom: "1rem", background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Shield size={22} color="#16a34a" />
          新NISAってなに？
        </h2>
        <p style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          NISAは、株や投資信託で得た利益に<strong style={{ color: "#16a34a" }}>税金がかからなくなる</strong>おトクな制度です。
          通常は利益の約20%が税金として引かれますが、NISA口座なら<strong>まるまる手元に残ります</strong>。
        </p>
      </div>

      {/* 2つの枠 */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Coins size={22} color="#d4a017" />
          2つの投資枠
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* つみたて投資枠 */}
          <div style={{
            background: "#eff6ff",
            borderRadius: "12px",
            padding: "1rem",
            border: "1px solid #bfdbfe",
          }}>
            <h3 style={{ fontSize: "1.1rem", color: "#2563eb", margin: "0 0 0.5rem" }}>
              つみたて投資枠
            </h3>
            <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
              <li>年間<strong>120万円</strong>まで投資できます</li>
              <li>投資信託（プロにおまかせ）が対象です</li>
              <li>毎月コツコツ積み立てるスタイルです</li>
              <li>初心者の方におすすめです</li>
            </ul>
          </div>

          {/* 成長投資枠 */}
          <div style={{
            background: "#fef3c7",
            borderRadius: "12px",
            padding: "1rem",
            border: "1px solid #fde68a",
          }}>
            <h3 style={{ fontSize: "1.1rem", color: "#b45309", margin: "0 0 0.5rem" }}>
              成長投資枠
            </h3>
            <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
              <li>年間<strong>240万円</strong>まで投資できます</li>
              <li>個別株や投資信託が対象です</li>
              <li>配当金をもらいたい方に向いています</li>
              <li>好きな会社の株を自分で選べます</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 非課税保有限度額 */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <TrendingUp size={22} color="#16a34a" />
          いくらまで非課税？
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            2つの枠を合わせて、最大<strong style={{ color: "#16a34a", fontSize: "1.3rem" }}>1,800万円</strong>まで非課税で投資できます。
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            しかも<strong>期限はありません</strong>。いつまでも非課税のまま持ち続けられます。
            売ったら翌年にまた枠が復活するので、何度でも使えます。
          </p>
        </div>
      </div>

      {/* 配当金とNISA */}
      <div className="card" style={{ marginBottom: "1rem", background: "#fefce8", borderColor: "#fde68a" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          🎁 配当金もNISAでおトク！
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            NISA口座で株を持っていると、もらえる<strong>配当金にも税金がかかりません</strong>。
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            例えば年間10万円の配当をもらう場合：
          </p>
          <div className="form-grid-2" style={{
            marginTop: "0.75rem",
          }}>
            <div style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "0.75rem",
              textAlign: "center",
              border: "1px solid #e5e7eb",
            }}>
              <p style={{ fontSize: "0.9rem", color: "#888", margin: "0 0 0.25rem" }}>通常の口座</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#dc2626", margin: 0 }}>
                約8万円
              </p>
              <p style={{ fontSize: "0.85rem", color: "#888", margin: "0.2rem 0 0" }}>税金で約2万円引かれる</p>
            </div>
            <div style={{
              background: "#f0fdf4",
              borderRadius: "10px",
              padding: "0.75rem",
              textAlign: "center",
              border: "1px solid #bbf7d0",
            }}>
              <p style={{ fontSize: "0.9rem", color: "#888", margin: "0 0 0.25rem" }}>NISA口座</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#16a34a", margin: 0 }}>
                10万円そのまま！
              </p>
              <p style={{ fontSize: "0.85rem", color: "#16a34a", margin: "0.2rem 0 0" }}>税金ゼロ</p>
            </div>
          </div>
        </div>
      </div>

      {/* 注意点 */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          ⚠️ 知っておきたいこと
        </h2>
        <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
          <li>NISA口座は<strong>1人1つだけ</strong>しか作れません</li>
          <li>銀行や証券会社で申し込みが必要です</li>
          <li>配当金の受け取り方法を<strong>「株式数比例配分方式」</strong>にしないと非課税になりません（証券会社で設定できます）</li>
          <li>元本が減るリスクはあります（預金とは違います）</li>
        </ul>
      </div>
    </div>
  );
}
