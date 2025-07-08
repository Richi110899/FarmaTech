"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGuard({ children, roles }) {
  const { data: session, status } = useSession();
  const { isAuthenticated, loading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = pathname.startsWith("/login") || 
                   pathname.startsWith("/api");

  useEffect(() => {
    if (loading) return;
    if (!isPublic && status === "unauthenticated" && !isAuthenticated()) {
      router.replace("/login");
      return;
    }
    // Si está autenticado pero no tiene el rol permitido
    if (!isPublic && roles && roles.length > 0 && user && !roles.includes(user.rol)) {
      router.replace("/");
      return;
    }
  }, [isPublic, status, isAuthenticated, loading, router, roles, user]);

  // Si está cargando, no mostrar nada
  if (loading) return null;

  // Si no es una ruta pública y no está autenticado, no mostrar nada
  if (!isPublic && status !== "authenticated" && !isAuthenticated()) {
    return null;
  }

  // Si no tiene el rol permitido, no mostrar nada
  if (!isPublic && roles && roles.length > 0 && user && !roles.includes(user.rol)) {
    return null;
  }

  return children;
} 