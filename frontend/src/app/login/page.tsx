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
    return <div style={{ display: "flex", justifyContent: "center", paddingTop: "5rem" }}>Loading...</div>;
  }

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "4rem auto", 
      padding: "2rem", 
      textAlign: "center",
      border: "1px solid #ddd",
      borderRadius: "12px",
      background: "#fff",
      boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
    }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "#333" }}>ログイン</h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        投資管理アプリへようこそ。<br/>
        Googleアカウントでログインしてください。
      </p>
      
      <button
        onClick={signInWithGoogle}
        style={{
          background: "#4285F4",
          color: "white",
          border: "none",
          padding: "0.8rem 1.5rem",
          fontSize: "1rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          width: "100%"
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
