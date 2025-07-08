"use client";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function GoogleAuthSync() {
  const { data: session } = useSession();
  const { user, login } = useAuth();

  useEffect(() => {
    if (session?.user?.email && (!user || user.email !== session.user.email)) {
      fetch("/api/verify-google-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            login(data.user, data.token); // GUARDA EL TOKEN
            window.location.reload();
          }
        });
    }
  }, [session, user, login]);

  return null;
} 