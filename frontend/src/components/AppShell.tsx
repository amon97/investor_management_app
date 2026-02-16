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
          <main className="page-content">
            {children}
          </main>
          <BottomNav />
        </ProtectedRoute>
      )}
    </AuthProvider>
  );
}
