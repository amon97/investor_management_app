"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isLine, setIsLine] = useState(false);
  const router = useRouter();

  // Check for LINE In-App Browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf("line") > -1) {
        setIsLine(true);
      }
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: "5rem", fontSize: "1.2rem" }}>読み込み中...</div>;
  }

  return (
    <div style={{
      maxWidth: 420,
      margin: "3rem auto",
      padding: "2.5rem 2rem",
      textAlign: "center",
      border: "1px solid #ddd",
      borderRadius: "16px",
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💰</div>
      <h1 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#333" }}>たけしぱっと見配当</h1>
      <p style={{ marginBottom: "2rem", color: "#666", fontSize: "1.1rem", lineHeight: 1.8 }}>
        あなたの配当金を<br />
        かんたんに管理できるアプリです。<br />
        <span style={{ fontSize: "0.95rem", color: "#888" }}>
          下のボタンを押してログインしてください。
        </span>
      </p>

      {isLine ? (
        <div style={{
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          padding: "1.5rem",
          textAlign: "left",
        }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            <AlertTriangle size={24} />
            LINEブラウザでは使えません
          </h3>
          <p style={{ fontSize: "0.95rem", color: "#333", lineHeight: 1.6 }}>
            Googleログインのセキュリティ制限により、LINEアプリ内からはログインできません。
          </p>
          <div style={{ marginTop: "1rem", background: "#fff", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.25rem" }}>👉 対処法</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              右上のメニュー（<ExternalLink size={14} style={{ display: "inline" }} /> アイコンや …）をタップし、
              <br />
              <strong>「ブラウザで開く」</strong>または<strong>「Safari/Chromeで開く」</strong>を選択してください。
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          style={{
            background: "#4285F4",
            color: "white",
            border: "none",
            padding: "1rem 1.5rem",
            fontSize: "1.15rem",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            minHeight: 56,
          }}
        >
          Googleでログインする
        </button>
      )}
    </div>
  );
}
