"use client";

import Link from "next/link";
import { User } from "lucide-react";
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
            たけしぱっと見配当
          </span>
        </div>
        {user && (
          <Link href="/settings" aria-label="設定">
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid #d1d5db",
            }}>
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={20} color="#6b7280" />
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
