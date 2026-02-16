"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Mail } from "lucide-react";

export default function SettingsPage() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div>
            <h1 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <UserIcon size={28} />
                アカウント設定
            </h1>

            <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 0" }}>
                    {/* ユーザーアイコン（大きめ） */}
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                        color: "#6b7280",
                        marginBottom: "1rem",
                        overflow: "hidden",
                    }}>
                        {user.photoURL ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.photoURL} alt={user.displayName || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <UserIcon size={40} />
                        )}
                    </div>

                    <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                        {user.displayName || "ゲストユーザー"}
                    </h2>
                    <p style={{ color: "#666", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Mail size={16} />
                        {user.email}
                    </p>
                </div>

                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "1.5rem", marginTop: "1rem" }}>
                    <button
                        onClick={logout}
                        className="btn-primary"
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            background: "#ef4444", // Red color for logout
                        }}
                    >
                        <LogOut size={20} />
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
}
