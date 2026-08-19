"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import AergusLoader from "../../components/Loaing";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }
      }
      setToken(token);
      checkSession()
        .then(() => {
          router.replace("/w/xyz");
        })
        .catch(() => {
          router.replace("/w/xyz");
        });
    } else {
      router.replace("/login");
    }
  }, [searchParams, router, setToken, checkSession]);

  return <AergusLoader />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AergusLoader />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
