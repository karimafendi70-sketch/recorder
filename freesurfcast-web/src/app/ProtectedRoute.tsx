"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return (
      <section className="card">
        <p className="muted">Redirecting to login...</p>
      </section>
    );
  }

  return <>{children}</>;
}
