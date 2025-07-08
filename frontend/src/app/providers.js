"use client";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </AuthProvider>
    </SessionProvider>
  );
} 