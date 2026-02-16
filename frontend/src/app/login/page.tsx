"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

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
      <h1 style={{ fontSize: "1.6rem", marginBottom: "1rem", color: "#333" }}>マイ配当ダッシュボード</h1>
      <p style={{ marginBottom: "2rem", color: "#666", fontSize: "1.1rem", lineHeight: 1.8 }}>
        あなたの配当金を<br/>
        かんたんに管理できるアプリです。<br/>
        <span style={{ fontSize: "0.95rem", color: "#888" }}>
          下のボタンを押してログインしてください。
        </span>
      </p>

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
    </div>
  );
}
