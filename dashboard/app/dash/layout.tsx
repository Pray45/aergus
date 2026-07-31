"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checkSession, isLoggedIn, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!checkingAuth && !isLoggedIn) {
      router.replace("/login");
    }
  }, [checkingAuth, isLoggedIn, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-aergus-bg flex items-center justify-center font-mono text-aergus-text text-sm">
        Loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
