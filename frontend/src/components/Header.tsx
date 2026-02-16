"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        borderBottom: "2px solid #e5e7eb",
        padding: "0.75rem 1rem",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 40,
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
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <span style={{ fontSize: "1.5rem" }}>💰</span>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#333" }}>
            マイ配当ダッシュボード
          </span>
        </div>
        {user && (
          <button
            onClick={logout}
            aria-label="ログアウト"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.8rem",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#666",
              fontSize: "0.85rem",
              minHeight: 36,
            }}
          >
            <LogOut size={16} />
            ログアウト
          </button>
        )}
      </div>
    </header>
  );
}
