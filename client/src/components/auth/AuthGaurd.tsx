"use client";

import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, allowedRoles, fallback = null }: AuthGuardProps) {
  const { user, isAuthenticated, authChecked } = useAuth();

  if (!authChecked) return null; // avoid flashing content before we know auth state
  if (!isAuthenticated) return <>{fallback}</>;
  if (allowedRoles && !allowedRoles.includes(user.role ?? "")) return <>{fallback}</>;

  return <>{children}</>;
}