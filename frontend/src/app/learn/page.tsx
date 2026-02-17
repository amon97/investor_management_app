"use client";

import { GraduationCap, TrendingUp, Shield, Coins, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

type Tab = "nisa" | "basics" | "links";

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<Tab>("nisa");

  return (
    <div>
      {/* ページタイトル */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <GraduationCap size={28} />
          投資の学習
        </h1>
        <p style={{ color: "#666", marginTop: "0.25rem", fontSize: "1.05rem" }}>
          配当投資に役立つ知識をやさしく解説します
        </p>
      </div>

      {/* タブ切り替え */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {([
          { key: "nisa" as Tab, label: "新NISA" },
          { key: "basics" as Tab, label: "配当の基本" },
          { key: "links" as Tab, label: "おすすめ教材" },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "10px",
              border: activeTab === key ? "2px solid var(--primary)" : "2px solid #e5e7eb",
              background: activeTab === key ? "var(--primary-light)" : "#fff",
              color: activeTab === key ? "var(--primary)" : "#666",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              minHeight: 48,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 新NISAタブ */}
      {activeTab === "nisa" && <NisaSection />}

      {/* 配当の基本タブ */}
      {activeTab === "basics" && <BasicsSection />}

      {/* おすすめ教材タブ */}
      {activeTab === "links" && <LinksSection />}
    </div>
  );
}

function NisaSection() {
  return (
    <>
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
          2つの投資わく
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ background: "#eff6ff", borderRadius: "12px", padding: "1rem", border: "1px solid #bfdbfe" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#2563eb", margin: "0 0 0.5rem" }}>つみたて投資わく</h3>
            <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
              <li>年間<strong>120万円</strong>まで投資できます</li>
              <li>投資信託（プロにおまかせ）が対象です</li>
              <li>毎月コツコツ積み立てるスタイルです</li>
              <li>初心者の方におすすめです</li>
            </ul>
          </div>
          <div style={{ background: "#fef3c7", borderRadius: "12px", padding: "1rem", border: "1px solid #fde68a" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#b45309", margin: "0 0 0.5rem" }}>成長投資わく</h3>
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
          配当金もNISAでおトク！
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            NISA口座で株を持っていると、もらえる<strong>配当金にも税金がかかりません</strong>。
          </p>
          <p style={{ marginTop: "0.5rem" }}>例えば年間10万円の配当をもらう場合：</p>
          <div className="form-grid-2" style={{ marginTop: "0.75rem" }}>
            <div style={{ background: "#fff", borderRadius: "10px", padding: "0.75rem", textAlign: "center", border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: "0.9rem", color: "#888", margin: "0 0 0.25rem" }}>通常の口座</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#dc2626", margin: 0 }}>約8万円</p>
              <p style={{ fontSize: "0.85rem", color: "#888", margin: "0.2rem 0 0" }}>税金で約2万円引かれる</p>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "0.75rem", textAlign: "center", border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: "0.9rem", color: "#888", margin: "0 0 0.25rem" }}>NISA口座</p>
              <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "#16a34a", margin: 0 }}>10万円そのまま！</p>
              <p style={{ fontSize: "0.85rem", color: "#16a34a", margin: "0.2rem 0 0" }}>税金ゼロ</p>
            </div>
          </div>
        </div>
      </div>

      {/* 注意点 */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          知っておきたいこと
        </h2>
        <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
          <li>NISA口座は<strong>1人1つだけ</strong>しか作れません</li>
          <li>銀行や証券会社で申し込みが必要です</li>
          <li>配当金の受け取り方法を<strong>「株式数比例配分方式」</strong>にしないと非課税になりません</li>
          <li>元本が減るリスクはあります（預金とは違います）</li>
        </ul>
      </div>
    </>
  );
}

function BasicsSection() {
  return (
    <>
      <div className="card" style={{ marginBottom: "1rem", background: "#f0fdf4", borderColor: "#bbf7d0" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          配当金ってなに？
        </h2>
        <p style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          株を持っていると、会社の利益の一部が<strong style={{ color: "#16a34a" }}>配当金</strong>として株主にもらえます。
          銀行の利息のようなもので、株を持っているだけで定期的にお金が入ってきます。
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          配当利回りとは？
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            <strong>配当利回り</strong> = 年間配当金 ÷ 株価 × 100
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            例えば、株価が1,000円で年間配当が40円なら、利回りは<strong>4%</strong>です。
            一般的に<strong style={{ color: "#16a34a" }}>3%以上</strong>で「高配当」と言われます。
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          権利確定日と配当の受け取り
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            配当をもらうには、<strong>権利確定日</strong>（決算日）に株を保有している必要があります。
          </p>
          <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0 0" }}>
            <li>多くの日本企業は<strong>3月</strong>と<strong>9月</strong>が権利確定日です</li>
            <li>権利確定日の<strong>2営業日前</strong>までに買う必要があります</li>
            <li>配当金は権利確定日から<strong>2〜3ヶ月後</strong>に届きます</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          配当金の税金
        </h2>
        <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444" }}>
          <p>
            配当金には通常<strong style={{ color: "#dc2626" }}>約20%の税金</strong>（所得税15.315% + 住民税5%）がかかります。
          </p>
          <p style={{ marginTop: "0.5rem" }}>
            <strong>NISA口座</strong>を使えばこの税金がゼロになるので、配当投資にはNISAがとても有利です。
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem", background: "#fefce8", borderColor: "#fde68a" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>
          高配当株の選び方のポイント
        </h2>
        <ul style={{ fontSize: "1.05rem", lineHeight: 2, color: "#444", paddingLeft: "1.2rem", margin: 0 }}>
          <li>配当利回りが<strong>3%以上</strong>あること</li>
          <li><strong>連続増配</strong>している（配当が毎年増えている）企業は安心感がある</li>
          <li><strong>配当性向</strong>が50%以下（利益の半分以下で配当を払える余裕がある）</li>
          <li>業績が安定していて、景気に左右されにくい業種</li>
          <li>一つの銘柄に集中せず、<strong>セクター分散</strong>が大事</li>
        </ul>
      </div>
    </>
  );
}

function LinksSection() {
  const resources = [
    {
      category: "入門",
      items: [
        {
          title: "金融庁 NISA特設ウェブサイト",
          url: "https://www.fsa.go.jp/policy/nisa2/",
          description: "新NISAの公式情報。制度の概要や始め方がわかりやすくまとまっています。",
        },
        {
          title: "日本取引所グループ - 株式投資の基礎",
          url: "https://www.jpx.co.jp/learning/index.html",
          description: "東証公式の投資学習サイト。初心者向けのコンテンツが充実しています。",
        },
      ],
    },
    {
      category: "配当投資",
      items: [
        {
          title: "みんかぶ - 配当利回りランキング",
          url: "https://minkabu.jp/ranking/dividend-yield",
          description: "日本株の配当利回りランキング。高配当銘柄を探すのに便利です。",
        },
        {
          title: "配当金DB",
          url: "https://db.discoat.net/",
          description: "日本株の配当金情報を網羅的にまとめたデータベースサイトです。",
        },
      ],
    },
    {
      category: "証券口座",
      items: [
        {
          title: "SBI証券",
          url: "https://www.sbisec.co.jp/",
          description: "手数料が安く、NISA口座にも対応。初心者に人気の証券会社です。",
        },
        {
          title: "楽天証券",
          url: "https://www.rakuten-sec.co.jp/",
          description: "楽天ポイントで投資ができる。楽天経済圏の方におすすめです。",
        },
      ],
    },
  ];

  return (
    <>
      {resources.map((group) => (
        <div key={group.category} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={20} />
            {group.category}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {group.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "1.05rem", margin: 0, color: "#2563eb" }}>
                      {item.title}
                    </p>
                    <p style={{ color: "#666", fontSize: "0.95rem", margin: "0.3rem 0 0", lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                  <ExternalLink size={18} color="#888" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
