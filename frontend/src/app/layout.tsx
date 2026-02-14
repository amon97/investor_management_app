import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "マイ配当ダッシュボード",
  description:
    "保有株の配当金を一目で確認。シニア投資家のための配当管理・ニュース集約アプリ。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "配当管理",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "マイ配当ダッシュボード",
    description: "保有株の配当金を一目で確認できる投資管理アプリ",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1a6b3c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* iOSでのホーム画面追加用 */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {/* ヘッダー */}
        <header
          style={{
            borderBottom: "2px solid #e5e7eb",
            padding: "0.75rem 1rem",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 40,
            /* iOSのノッチ対応 */
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>💰</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333" }}>
              マイ配当ダッシュボード
            </span>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main
          className="page-content"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "1.25rem 1rem",
            paddingLeft: "max(1rem, env(safe-area-inset-left))",
            paddingRight: "max(1rem, env(safe-area-inset-right))",
          }}
        >
          {children}
        </main>

        {/* 下部ナビゲーション */}
        <BottomNav />
      </body>
    </html>
  );
}
