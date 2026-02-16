"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <ProtectedRoute>
          <Header />
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
          <BottomNav />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
